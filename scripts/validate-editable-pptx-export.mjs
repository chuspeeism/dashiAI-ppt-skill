#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TEMPLATE = path.join(ROOT, 'assets/template-swiss.html');
const OUT_DIR = path.join(ROOT, 'output/editable-pptx-validation');
const CHROME_PATH = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const EXPECTED_SLIDES = 6;
const THEME_FILTER_EXPECTED_SLIDES = 2;
const EDITED_TEXT = 'JAD-64 editable text sentinel';
const INITIAL_IMAGE_BYTES = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="24"><rect width="32" height="24" fill="#e11d48"/><text x="4" y="16" font-size="8" fill="#ffffff">old</text></svg>');
const REPLACEMENT_IMAGE_BYTES = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="24"><rect width="32" height="24" fill="#2563eb"/><text x="4" y="16" font-size="8" fill="#ffffff">new</text></svg>');
const INITIAL_IMAGE_HASH = hashBuffer(INITIAL_IMAGE_BYTES);
const REPLACEMENT_IMAGE_HASH = hashBuffer(REPLACEMENT_IMAGE_BYTES);
const INITIAL_IMAGE = `data:image/svg+xml;base64,${INITIAL_IMAGE_BYTES.toString('base64')}`;
const REPLACEMENT_IMAGE = `data:image/svg+xml;base64,${REPLACEMENT_IMAGE_BYTES.toString('base64')}`;

const args = new Set(process.argv.slice(2));
const legacyRed = args.has('--legacy-red');

if (!existsSync(CHROME_PATH)) {
  throw new Error(`Chrome executable not found: ${CHROME_PATH}
Set CHROME_PATH to a local Chrome/Chromium executable and rerun the validation.`);
}

mkdirSync(OUT_DIR, { recursive: true });

if (legacyRed) {
  await runLegacyRedValidation();
} else {
  await runEditableExportValidation();
}

async function runLegacyRedValidation() {
  const staticFindings = inspectLegacyBrowserPptxPath();
  const { url, close } = await renderValidationDeck();
  const pptxFile = path.join(OUT_DIR, 'legacy-browser-export.pptx');
  const browser = await chromium.launch({ headless: true, executablePath: CHROME_PATH });
  let page;
  try {
    const context = await browser.newContext({
      acceptDownloads: true,
      viewport: { width: 1920, height: 1080 },
    });
    page = await context.newPage();
    page.setDefaultTimeout(45000);
    page.on('dialog', dialog => dialog.dismiss().catch(() => {}));
    await page.goto(`${url}?legacy_red=${Date.now()}`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#deck > .slide.active, #deck > .slide[data-deck-active]');
    const downloadPromise = page.waitForEvent('download', { timeout: 90000 });
    await page.evaluate(() => window.__exportDeckPptx?.());
    const download = await downloadPromise;
    await download.saveAs(pptxFile);
  } finally {
    await closePage(page);
    await browser.close().catch(() => {});
    await close();
  }

  const pptx = inspectPptx(pptxFile);
  const failures = [];
  if (staticFindings.usesHtmlToImage) failures.push('Legacy browser PPTX path calls htmlToImage.toPng / captureSlideImage.');
  if (staticFindings.usesFullSlideAddImage) failures.push('Legacy browser PPTX path writes each slide as a full-slide addImage.');
  if (pptx.textCount === 0) failures.push('Legacy browser PPTX export contains no editable text nodes in slide XML.');
  if (pptx.fullSlideImageOnlySlides.length) failures.push(`Legacy browser PPTX has full-slide-image-only pages: ${pptx.fullSlideImageOnlySlides.join(', ')}.`);

  console.error(JSON.stringify({
    mode: 'legacy-red',
    passed: false,
    expectedFailure: true,
    staticFindings,
    pptx: summarizeInspection(pptx),
    failures,
  }, null, 2));
  process.exit(1);
}

async function runEditableExportValidation() {
  const exportSource = readFileSync(path.join(ROOT, 'src/export-pptx/editable.mjs'), 'utf8');
  const staticFailures = inspectEditableExportSource(exportSource);
  const { url, close } = await renderValidationDeck();
  const pptxFile = path.join(OUT_DIR, 'editable-export.pptx');
  const reportFile = path.join(OUT_DIR, 'editable-export-report.json');
  const filteredPptxFile = path.join(OUT_DIR, 'editable-theme-filter-export.pptx');
  const filteredReportFile = path.join(OUT_DIR, 'editable-theme-filter-report.json');
  const browser = await chromium.launch({ headless: true, executablePath: CHROME_PATH });
  let page;
  let mutation = null;
  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
    });
    page = await context.newPage();
    page.setDefaultTimeout(45000);
    await page.goto(`${url}?editable_validation=${Date.now()}`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#deck > .slide.active, #deck > .slide[data-deck-active]');
    const visibleGuard = await runThemeFilterGuard(page, filteredPptxFile, filteredReportFile);
    if (!visibleGuard.passed) staticFailures.push(visibleGuard.message);

    mutation = await applyUserEdits(page);
    if (!mutation.textEdited) staticFailures.push('Validation could not simulate a user text edit.');
    if (!mutation.imageEdited) staticFailures.push('Validation could not simulate a user image slot edit.');

    const mod = await import(pathToFileURL(path.join(ROOT, 'src/export-pptx/editable.mjs')));
    const result = await mod.exportEditablePptxFromPage(page, {
      outFile: pptxFile,
      reportFile,
      title: 'JAD-64 Editable Export Validation',
      includeAllThemePacks: true,
    });
    if (result.slideCount !== EXPECTED_SLIDES) {
      staticFailures.push(`Editable exporter returned ${result.slideCount} slide(s), expected ${EXPECTED_SLIDES}.`);
    }
  } finally {
    await closePage(page);
    await browser.close().catch(() => {});
    await close();
  }

  const pptx = inspectPptx(pptxFile);
  const filteredPptx = inspectPptx(filteredPptxFile);
  const report = existsSync(reportFile) ? JSON.parse(readFileSync(reportFile, 'utf8')) : null;
  const failures = [...staticFailures];
  if (pptx.slideCount !== EXPECTED_SLIDES) failures.push(`PPTX has ${pptx.slideCount} slide(s), expected ${EXPECTED_SLIDES}.`);
  if (pptx.textCount <= 0) failures.push('PPTX slide XML has no <a:t> editable text nodes.');
  if (!pptx.allText.includes(EDITED_TEXT)) failures.push('User-edited text sentinel is missing from PPTX text nodes.');
  if (pptx.shapeCount <= 0) failures.push('PPTX slide XML has no shape objects.');
  if (pptx.pictureCount <= 0) failures.push('PPTX slide XML has no image objects.');
  if (!pptx.mediaHashes.includes(REPLACEMENT_IMAGE_HASH)) failures.push('Replacement image hash is missing from ppt/media/*.');
  if (REPLACEMENT_IMAGE_HASH === INITIAL_IMAGE_HASH) failures.push('Replacement image hash unexpectedly equals the initial image hash.');
  if (!mutation?.imageSlideNumber) failures.push('Validation did not record which slide received the replacement image.');
  else if (!pptx.slides[mutation.imageSlideNumber - 1]?.pictureMediaHashes.includes(REPLACEMENT_IMAGE_HASH)) {
    failures.push(`Replacement image is not referenced by target slide ${mutation.imageSlideNumber}.`);
  }
  if (pptx.fullSlideImageOnlySlides.length) failures.push(`PPTX still has full-slide-image-only pages: ${pptx.fullSlideImageOnlySlides.join(', ')}.`);
  if (pptx.uniqueSlideHashes !== EXPECTED_SLIDES) failures.push('Slide XML content hashes repeat; page switching may have failed.');
  if (filteredPptx.slideCount !== THEME_FILTER_EXPECTED_SLIDES) failures.push(`Default export ignored current theme filter: got ${filteredPptx.slideCount} slide(s), expected ${THEME_FILTER_EXPECTED_SLIDES}.`);
  if (!report?.warnings || !Array.isArray(report.warnings)) failures.push('Editable exporter did not write a warnings report.');

  const result = {
    mode: 'editable-export',
    passed: failures.length === 0,
    pptx: summarizeInspection(pptx),
    themeFilterGuard: summarizeInspection(filteredPptx),
    report: report ? {
      slideCount: report.slideCount,
      textObjects: report.textObjects,
      shapeObjects: report.shapeObjects,
      imageObjects: report.imageObjects,
      warningCount: report.warnings.length,
    } : null,
    failures,
  };

  if (failures.length) {
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify(result, null, 2));
}

function inspectLegacyBrowserPptxPath() {
  const html = readFileSync(TEMPLATE, 'utf8');
  const start = html.indexOf('window.__exportDeckPptx = async function');
  const end = html.indexOf('window.__exportDeckHtml', start);
  const source = start >= 0 && end > start ? html.slice(start, end) : '';
  return {
    hasExportFunction: start >= 0,
    usesHtmlToImage: /htmlToImage\.toPng|captureSlideImage/.test(source) && /loadExportScript\(['"]assets\/vendor\/html-to-image\.js/.test(source),
    usesFullSlideAddImage: /pptSlide\.addImage\(\{\s*data:\s*imageData,\s*x:\s*0,\s*y:\s*0,\s*w:\s*PPT_W,\s*h:\s*PPT_H\s*\}\)/.test(source),
  };
}

function inspectEditableExportSource(source) {
  const failures = [];
  if (/htmlToImage\.toPng|captureSlideImage/.test(source)) {
    failures.push('Editable export path must not call htmlToImage.toPng or captureSlideImage.');
  }
  if (/addImage\(\{[^}]*x:\s*0[^}]*y:\s*0[^}]*w:\s*(?:PPT_W|16)[^}]*h:\s*(?:PPT_H|9)/s.test(source)) {
    failures.push('Editable export path must not add a full-slide image.');
  }
  return failures;
}

async function renderValidationDeck() {
  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });
  const configFile = path.join(OUT_DIR, 'validation-deck.jsx');
  const indexFile = path.join(OUT_DIR, 'ppt/index.html');
  writeFileSync(configFile, createValidationDeckSource());
  const render = spawnSync(path.join(ROOT, 'node_modules/.bin/tsx'), [
    path.join(ROOT, 'scripts/render-deck.jsx'),
    configFile,
    indexFile,
  ], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  if (render.status !== 0) {
    throw new Error(`Validation deck render failed:\n${render.stdout}\n${render.stderr}`);
  }
  const server = await startStaticServer(path.dirname(indexFile));
  return server;
}

function createValidationDeckSource() {
  return `import { slide } from '../../src/options.jsx';

const initialImg = '${INITIAL_IMAGE}';

export default {
  title: 'JAD-64 Editable Export Validation',
  preview: { themeSwitcher: true },
  slides: [
    slide('theme01_page001', {
      title: 'Theme01 Editable Cover',
      titleLines: ['Theme01 Editable Cover', 'Text object baseline'],
    }),
    slide('theme01_page008', {
      title: 'Theme01 Image Slot Baseline',
      imageSlotCount: 1,
      images: [initialImg],
      caption: 'Theme01 image object baseline',
    }),
    slide('theme02_page001', {
      title: 'Theme02 Editable Cover',
      titleEm: 'Text object baseline',
      imageCount: 1,
      images: [initialImg],
    }),
    slide('theme02_page006', {
      title: 'Theme02 Shape Baseline',
      subtitle: 'Color blocks and text are exported as editable objects.',
    }),
    slide('theme03_page001', {
      title: 'Theme03 Editable Cover',
      imageCount: 1,
      images: [{ src: initialImg, kind: 'image' }],
    }),
    slide('theme03_page005', {
      title: 'Theme03 Image Baseline',
      imageCount: 1,
      images: [{ src: initialImg, kind: 'image' }],
    }),
  ],
};
`;
}

async function runThemeFilterGuard(page, outFile, reportFile) {
  const mod = await import(pathToFileURL(path.join(ROOT, 'src/export-pptx/editable.mjs')));
  await page.evaluate(async () => {
    window.__setActiveThemePack?.('theme02', { navigate: true });
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  const visibleCount = await page.evaluate(() => (window.__getVisibleSlides?.() || []).length);
  const result = await mod.exportEditablePptxFromPage(page, {
    outFile,
    reportFile,
    title: 'JAD-64 Theme Filter Guard',
  });
  await page.evaluate(async () => {
    window.__setActiveThemePack?.('', { navigate: true });
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  return {
    passed: visibleCount === THEME_FILTER_EXPECTED_SLIDES && result.slideCount === visibleCount,
    message: `Default export should preserve theme-filtered visible slides: visible=${visibleCount}, exported=${result.slideCount}.`,
  };
}

async function applyUserEdits(page) {
  return page.evaluate(({ text, image }) => {
    const result = { textEdited: false, imageEdited: false };
    window.go?.(0, { animate: false, force: true });
    const active = document.querySelector('#deck > .slide.active, #deck > .slide[data-deck-active]');
    const editable = active?.querySelector?.('[data-editable-id]');
    if (editable) {
      editable.textContent = text;
      editable.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
      window.__flushEditableTextState?.();
      window.__syncDeckViewModelFromDom?.();
      result.textEdited = true;
    }

    const slides = window.__getVisibleSlides?.() || [...document.querySelectorAll('#deck > .slide:not([hidden])')];
    const targetIndex = slides.findIndex(slide => {
      const root = slide.querySelector?.('[data-prop-defaults]');
      if (!root) return false;
      try {
        const props = JSON.parse(root.dataset.propDefaults || '{}');
        return Array.isArray(props.images) || 'imageCount' in props || 'imageSlotCount' in props;
      } catch {
        return false;
      }
    });
    if (targetIndex >= 0) {
      const slide = slides[targetIndex];
      const root = slide.querySelector('[data-prop-defaults]');
      let props = {};
      try { props = JSON.parse(root.dataset.propDefaults || '{}') || {}; } catch {}
      const next = {
        ...props,
        imageCount: Number(props.imageCount || props.imageSlotCount || 1),
        imageSlotCount: Number(props.imageSlotCount || props.imageCount || 1),
        images: [{ src: image, kind: 'image' }, image],
      };
      window.__deckViewModel?.setProps?.(slide.dataset.vmSlideId, next);
      window.__renderRuntimeSlide?.(slide, next);
      window.__initEditableText?.(slide);
      window.go?.(targetIndex, { animate: false, force: true });
      result.imageEdited = !!slide.querySelector('img');
      result.imageSlideNumber = targetIndex + 1;
      window.go?.(0, { animate: false, force: true });
    }
    return result;
  }, { text: EDITED_TEXT, image: REPLACEMENT_IMAGE });
}

function inspectPptx(file) {
  if (!existsSync(file)) throw new Error(`Missing PPTX file: ${file}`);
  const entries = execFileSync('unzip', ['-Z1', file], { encoding: 'utf8' })
    .split(/\r?\n/)
    .filter(Boolean);
  const slideEntries = entries
    .filter(entry => /^ppt\/slides\/slide\d+\.xml$/.test(entry))
    .sort((a, b) => Number(a.match(/slide(\d+)\.xml/)?.[1] || 0) - Number(b.match(/slide(\d+)\.xml/)?.[1] || 0));
  const mediaEntries = entries.filter(entry => /^ppt\/media\/[^/]+$/.test(entry)).sort();
  const media = mediaEntries.map(entry => {
    const bytes = execFileSync('unzip', ['-p', file, entry], { encoding: 'buffer', maxBuffer: 20 * 1024 * 1024 });
    return { entry, hash: hashBuffer(bytes), size: bytes.length };
  });
  const mediaByEntry = new Map(media.map(item => [item.entry, item]));
  const slides = slideEntries.map((entry, index) => {
    const xml = execFileSync('unzip', ['-p', file, entry], { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
    const relsEntry = `ppt/slides/_rels/slide${index + 1}.xml.rels`;
    const relsXml = entries.includes(relsEntry) ? execFileSync('unzip', ['-p', file, relsEntry], { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 }) : '';
    return inspectSlideXml(xml, index + 1, relsXml, mediaByEntry);
  });
  const allText = slides.flatMap(slide => slide.text).join('\n');
  const hashes = new Set(slides.map(slide => slide.hash));
  return {
    file,
    slideCount: slides.length,
    slides,
    allText,
    textCount: slides.reduce((sum, slide) => sum + slide.text.length, 0),
    shapeCount: slides.reduce((sum, slide) => sum + slide.shapeCount, 0),
    pictureCount: slides.reduce((sum, slide) => sum + slide.pictureCount, 0),
    media,
    mediaHashes: media.map(item => item.hash),
    fullSlideImageOnlySlides: slides.filter(slide => slide.fullSlideImageOnly).map(slide => slide.index),
    uniqueSlideHashes: hashes.size,
  };
}

function inspectSlideXml(xml, index, relsXml, mediaByEntry) {
  const text = [...xml.matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)].map(match => decodeXml(match[1]));
  const shapeCount = (xml.match(/<p:sp\b/g) || []).length;
  const pictureCount = (xml.match(/<p:pic\b/g) || []).length;
  const pictures = [...xml.matchAll(/<p:pic\b[\s\S]*?<\/p:pic>/g)].map(match => {
    const ext = match[0].match(/<a:ext[^>]*\bcx="(\d+)"[^>]*\bcy="(\d+)"/);
    const embed = match[0].match(/r:embed="([^"]+)"/);
    const cx = Number(ext?.[1] || 0);
    const cy = Number(ext?.[2] || 0);
    return { cx, cy, rId: embed?.[1] || '', nearFullSlide: cx >= 0.9 * 16 * 914400 && cy >= 0.9 * 9 * 914400 };
  });
  const relTargets = parseSlideRelationships(relsXml);
  const pictureMediaHashes = pictures
    .map(picture => relTargets.get(picture.rId))
    .filter(Boolean)
    .map(target => mediaByEntry.get(target)?.hash)
    .filter(Boolean);
  return {
    index,
    text,
    shapeCount,
    pictureCount,
    pictures,
    pictureMediaHashes,
    fullSlideImageOnly: text.length === 0 && shapeCount <= 1 && pictures.length === 1 && pictures[0].nearFullSlide,
    hash: createHash('sha256').update(xml.replace(/id="\d+"/g, 'id=""')).digest('hex'),
  };
}

function parseSlideRelationships(xml) {
  const out = new Map();
  for (const match of xml.matchAll(/<Relationship\b[^>]*\bId="([^"]+)"[^>]*\bTarget="([^"]+)"/g)) {
    const target = match[2].replace(/^\.\.\//, 'ppt/');
    out.set(match[1], target);
  }
  return out;
}

function summarizeInspection(pptx) {
  return {
    file: pptx.file,
    slideCount: pptx.slideCount,
    textCount: pptx.textCount,
    shapeCount: pptx.shapeCount,
    pictureCount: pptx.pictureCount,
    mediaCount: pptx.media.length,
    fullSlideImageOnlySlides: pptx.fullSlideImageOnlySlides,
    uniqueSlideHashes: pptx.uniqueSlideHashes,
  };
}

function hashBuffer(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function decodeXml(value) {
  return value
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&amp;', '&');
}

async function startStaticServer(rootDir) {
  const server = createServer((req, res) => {
    const url = new URL(req.url || '/', 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    const requested = path.resolve(rootDir, `.${pathname}`);
    const file = requested.startsWith(rootDir) && existsSync(requested) && !isDirectory(requested)
      ? requested
      : path.join(rootDir, 'index.html');
    const ext = path.extname(file).toLowerCase();
    const type = ext === '.js' ? 'text/javascript'
      : ext === '.css' ? 'text/css'
        : ext === '.json' ? 'application/json'
          : ext === '.png' ? 'image/png'
            : ext === '.svg' ? 'image/svg+xml'
              : 'text/html';
    res.writeHead(200, { 'content-type': type });
    res.end(readFileSync(file));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  return {
    url: `http://127.0.0.1:${port}/`,
    close: () => new Promise(resolve => server.close(resolve)),
  };
}

async function closePage(page) {
  try { await page?.close(); } catch {}
}

function isDirectory(file) {
  try {
    return execFileSync('test', ['-d', file]).length === 0;
  } catch {
    return false;
  }
}
