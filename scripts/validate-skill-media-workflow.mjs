#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHROME_PATH = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const tests = [
  ['media contracts distinguish writable slots from count-only controls', testMediaContracts],
  ['provided image query requires initial media write support', testProvidedImageQuery],
  ['all accepted themes expose provided image candidates', testAllAcceptedThemesProvidedImages],
  ['theme09 image slots accept provided images', testTheme09ProvidedImageSlots],
  ['theme05 string image props render as media', testTheme05StringImagePropsRender],
  ['theme05 string quote props render as text', testTheme05StringQuotePropsRender],
  ['theme08 adaptive image slots render provided images', testTheme08AdaptiveImagePropsRender],
  ['video query returns only initial video-capable slots', testVideoQuery],
  ['mixed media query requires image and video capable slots', testMixedMediaQuery],
  ['stage-media preserves user media through render and preview', testStageMediaRenderPreview],
];

const failures = [];

for (const [name, fn] of tests) {
  try {
    await fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    failures.push([name, error]);
    console.error(`not ok - ${name}`);
    console.error(`  ${error.message}`);
  }
}

if (failures.length) {
  console.error(`\n${failures.length} skill media workflow validation test(s) failed.`);
  process.exit(1);
}

console.log('\nSkill media workflow validation passed.');

function testMediaContracts() {
  const theme03 = runJson('scripts/inspect-layout.mjs', ['theme03_page017']);
  const badWritableFields = new Set(['decorScale', 'layout', 'imageCount']);
  for (const slot of theme03.mediaSlots || []) {
    assert(!badWritableFields.has(slot.field), `theme03_page017 exposes count/control as writable media field: ${slot.field}`);
    if (slot.writeMode !== 'countOnly') {
      assert(slot.fieldPath !== `props.${slot.field}` || slot.initialSrcSupported === true, `theme03_page017 writable media slot missing initial support flag: ${slot.field}`);
    }
  }
  assert((theme03.mediaSlots || []).every(slot => Object.prototype.hasOwnProperty.call(slot, 'initialSrcSupported') && slot.writeMode), 'theme03_page017 media slots should expose initialSrcSupported and writeMode');

  const theme11 = runJson('scripts/inspect-layout.mjs', ['theme11_page063']);
  const imagesSlot = (theme11.mediaSlots || []).find(slot => slot.field === 'images' && slot.countKey === 'imageCount');
  assert(imagesSlot, 'theme11_page063 should expose images slot bound to imageCount');
  assert(imagesSlot.fieldPath === 'props.images', 'theme11_page063 images slot should expose fieldPath=props.images');
  assert(imagesSlot.max >= 4, 'theme11_page063 images slot should expose max capacity');
  assert(imagesSlot.initialSrcSupported === true, 'theme11_page063 images slot should support initial src');
  assert(imagesSlot.runtimeReplaceable === true, 'theme11_page063 images slot should be runtime replaceable');
  assert(imagesSlot.writeMode === 'initialProps', 'theme11_page063 images slot should use initialProps write mode');
  assert(Array.isArray(imagesSlot.acceptedKinds) && imagesSlot.acceptedKinds.includes('image') && imagesSlot.acceptedKinds.includes('video'), 'theme11_page063 images slot should accept image and video');
  assert(imagesSlot.valueShape === 'Array<string | {src,kind,type}>', 'theme11_page063 images slot should describe the array field shape');
  assert(imagesSlot.emptySlotBehavior, 'theme11_page063 images slot should describe empty slot behavior');

  const theme05Mosaic = runJson('scripts/inspect-layout.mjs', ['theme05_page088']);
  assert(!(theme05Mosaic.mediaSlots || []).some(slot => slot.field === 'media'), 'theme05_page088 should not expose props.media unless the component renders it');
  const theme06Cover = runJson('scripts/inspect-layout.mjs', ['theme06_page005']);
  assert(!(theme06Cover.mediaSlots || []).some(slot => slot.field === 'media'), 'theme06_page005 should not expose props.media unless the component renders it');
}

function testProvidedImageQuery() {
  const result = runJson('scripts/layout-query.mjs', [
    '--theme', 'theme08',
    '--provided-images', '3',
    '--require-initial-media',
    '--limit', '5',
  ]);
  assert(result.mediaIntent === 'provided-images', 'expected provided-images media intent');
  assert(result.requireInitialMedia === true, 'expected requireInitialMedia=true in query output');
  assert(result.layouts.length > 0, 'expected provided image candidates');
  for (const layout of result.layouts) {
    const slots = layout.mediaSlots || [];
    assert(slots.some(slot => slot.initialSrcSupported === true && mediaSlotCapacity(slot) >= 3), `${layout.layout} lacks initial media slot for 3 images`);
    assert(slots.some(slot => slot.canPresetMedia === true && slot.presetProp), `${layout.layout} lacks canPresetMedia/presetProp hint`);
    for (const slot of slots) {
      assert(slot.field !== 'mediaCount' && slot.field !== 'imageCount', `${layout.layout} exposes count key as media field`);
      assert(slot.fieldPath, `${layout.layout} media slot missing fieldPath`);
      if (slot.canPresetMedia) assert(slot.presetProp === slot.fieldPath, `${layout.layout} presetProp should match fieldPath`);
    }
  }
}

function testAllAcceptedThemesProvidedImages() {
  const themes = Array.from({ length: 12 }, (_, index) => `theme${String(index + 1).padStart(2, '0')}`);
  for (const theme of themes) {
    const result = runJson('scripts/layout-query.mjs', [
      '--theme', theme,
      '--provided-images', '1',
      '--limit', '8',
    ]);
    assert(result.layouts.length > 0, `${theme} should expose at least one provided-image layout`);
    assert(result.layouts.some(layout => (layout.mediaSlots || []).some(slot => {
      return slot.initialSrcSupported === true
        && slot.canPresetMedia === true
        && slot.presetProp
        && (slot.acceptedKinds || []).includes('image')
        && mediaSlotCapacity(slot) >= 1;
    })), `${theme} provided-image candidates should expose a preset image slot`);
  }
}

function testTheme09ProvidedImageSlots() {
  const inspected = runJson('scripts/inspect-layout.mjs', ['theme09_page026']);
  const inspectedSlot = (inspected.mediaSlots || []).find(slot => slot.field === 'images');
  assert(inspectedSlot, 'theme09_page026 should expose props.images for initial image content');
  assert(inspectedSlot.initialSrcSupported === true, 'theme09_page026 images slot should support initial src');
  assert(inspectedSlot.canPresetMedia === true && inspectedSlot.presetProp === 'props.images', 'theme09_page026 should guide agents to write props.images');

  const result = runJson('scripts/layout-query.mjs', [
    '--theme', 'theme09',
    '--provided-images', '1',
    '--limit', '5',
  ]);
  assert(result.mediaIntent === 'provided-images', 'expected provided-images media intent');
  assert(result.requireInitialMedia === true, 'provided images should require initial media support');
  assert(result.layouts.length > 0, 'theme09 should return image layouts for provided images');
  assert(result.layouts.some(layout => (layout.mediaSlots || []).some(slot => {
    return slot.field === 'images'
      && slot.canPresetMedia === true
      && slot.presetProp === 'props.images'
      && mediaSlotCapacity(slot) >= 1;
  })), 'theme09 provided-image candidates should expose props.images preset slot');

  const safe = runJson('scripts/write-safe-props.mjs', [
    'theme09_page026',
    JSON.stringify({ title: '影像速写', shots: [{ caption: '用户素材' }] }),
    '--images',
    'assets/user-media/photo.webp',
  ]);
  assert(safe.props?.imgCount === 1, 'theme09 props:safe should set imgCount from provided images');
  assert(safe.props?.images?.[0] === 'assets/user-media/photo.webp', 'theme09 props:safe should write provided image to props.images');
}

async function testTheme05StringImagePropsRender() {
  assert(existsSync(CHROME_PATH), `Chrome executable not found: ${CHROME_PATH}`);
  const tmp = mkdtempSync(path.join(tmpdir(), 'dashi-theme05-media-'));
  try {
    const outDir = path.join(tmp, 'ppt');
    const mediaDir = path.join(outDir, 'assets/user-media');
    mkdirSync(mediaDir, { recursive: true });
    const mediaPath = path.join(mediaDir, 'theme05-string.png');
    writeFileSync(mediaPath, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=', 'base64'));

    const goalPath = path.join(tmp, 'goal.json');
    writeFileSync(goalPath, JSON.stringify({
      title: 'Theme05 Media Smoke',
      goal: 'verify theme05 string image props render',
      themePack: 'theme05',
      slides: [{
        layout: 'theme05_page006',
        props: {
          imageCount: 1,
          images: ['assets/user-media/theme05-string.png'],
        },
      }],
    }, null, 2));

    const htmlPath = path.join(outDir, 'index.html');
    execFileSync('npm', ['run', 'render:goal', '--', goalPath, htmlPath], { cwd: ROOT, stdio: 'pipe' });

    const browser = await chromium.launch({ headless: true, executablePath: CHROME_PATH });
    const page = await browser.newPage({ viewport: { width: 1365, height: 768 } });
    const errors = [];
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', error => errors.push(error.message));
    try {
      await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle' });
      await page.waitForSelector('.pulse-imgframe img', { timeout: 5000 });
      const src = await page.locator('.pulse-imgframe img').first().getAttribute('src');
      assert(src && src.includes('assets/user-media/theme05-string.png'), 'theme05 did not render the string image prop');
      assert(errors.length === 0, `theme05 rendered with console errors: ${errors.slice(0, 3).join(' | ')}`);
    } finally {
      await browser.close();
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

async function testTheme05StringQuotePropsRender() {
  assert(existsSync(CHROME_PATH), `Chrome executable not found: ${CHROME_PATH}`);
  const tmp = mkdtempSync(path.join(tmpdir(), 'dashi-theme05-quote-'));
  try {
    const outDir = path.join(tmp, 'ppt');
    mkdirSync(outDir, { recursive: true });
    const goalPath = path.join(tmp, 'goal.json');
    writeFileSync(goalPath, JSON.stringify({
      title: 'Theme05 Quote Smoke',
      goal: 'verify theme05 string quote props render',
      themePack: 'theme05',
      slides: [{
        layout: 'theme05_page037',
        props: {
          copy: {
            kicker: '最终结论',
            index: '18',
            sheet: '18 / Final',
            quote: '出海上半场拼规模，下半场拼本地经营',
            sub: '品牌、渠道、补能一起做成当地经营能力。',
            keywords: ['品牌资产', '渠道效率', '服务体验'],
          },
        },
      }],
    }, null, 2));

    const htmlPath = path.join(outDir, 'index.html');
    execFileSync('npm', ['run', 'render:goal', '--', goalPath, htmlPath], { cwd: ROOT, stdio: 'pipe' });

    const browser = await chromium.launch({ headless: true, executablePath: CHROME_PATH });
    const page = await browser.newPage({ viewport: { width: 1365, height: 768 } });
    const errors = [];
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', error => errors.push(error.message));
    try {
      await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle' });
      const bodyText = await page.locator('body').innerText({ timeout: 5000 });
      assert(bodyText.includes('出海上半场拼规模，下半场拼本地经营'), 'theme05 did not render the string quote prop');
      assert(errors.length === 0, `theme05 quote rendered with console errors: ${errors.slice(0, 3).join(' | ')}`);
    } finally {
      await browser.close();
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

async function testTheme08AdaptiveImagePropsRender() {
  assert(existsSync(CHROME_PATH), `Chrome executable not found: ${CHROME_PATH}`);
  const tmp = mkdtempSync(path.join(tmpdir(), 'dashi-theme08-media-'));
  try {
    const outDir = path.join(tmp, 'ppt');
    const mediaDir = path.join(outDir, 'assets/user-media');
    mkdirSync(mediaDir, { recursive: true });
    const mediaPath = path.join(mediaDir, 'theme08-adaptive.png');
    writeFileSync(mediaPath, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=', 'base64'));

    const goalPath = path.join(tmp, 'goal.json');
    writeFileSync(goalPath, JSON.stringify({
      title: 'Theme08 Media Smoke',
      goal: 'verify theme08 adaptive image slots render provided images',
      themePack: 'theme08',
      slides: [{
        layout: 'theme08_page005',
        props: {
          mediaCount: 1,
          images: ['assets/user-media/theme08-adaptive.png'],
        },
      }],
    }, null, 2));

    const htmlPath = path.join(outDir, 'index.html');
    execFileSync('npm', ['run', 'render:goal', '--', goalPath, htmlPath], { cwd: ROOT, stdio: 'pipe' });

    const browser = await chromium.launch({ headless: true, executablePath: CHROME_PATH });
    const page = await browser.newPage({ viewport: { width: 1365, height: 768 } });
    const errors = [];
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', error => errors.push(error.message));
    try {
      await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle' });
      await page.waitForSelector('.acl-slot__img', { timeout: 5000 });
      const src = await page.locator('.acl-slot__img').first().getAttribute('src');
      assert(src && src.includes('assets/user-media/theme08-adaptive.png'), 'theme08 AdaptiveImageSlot did not render props.images');
      assert(errors.length === 0, `theme08 rendered with console errors: ${errors.slice(0, 3).join(' | ')}`);
    } finally {
      await browser.close();
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

function testVideoQuery() {
  const result = runJson('scripts/layout-query.mjs', [
    '--media-kind', 'video',
    '--require-initial-media',
    '--media-count', '1',
    '--limit', '8',
  ]);
  assert(result.mediaKind === 'video', 'expected mediaKind=video');
  assert(result.requireInitialMedia === true, 'expected requireInitialMedia=true');
  assert(result.layouts.length > 0, 'expected video-capable initial media candidates');
  for (const layout of result.layouts) {
    assert((layout.mediaSlots || []).some(slot => slot.initialSrcSupported === true && slot.canPresetMedia === true && slot.presetProp && (slot.acceptedKinds || []).includes('video')), `${layout.layout} lacks initial video-capable slot`);
  }
}

function testMixedMediaQuery() {
  const result = runJson('scripts/layout-query.mjs', [
    '--provided-media', '2',
    '--require-initial-media',
    '--limit', '8',
  ]);
  assert(result.mediaKind === 'mixed', 'expected mediaKind=mixed');
  assert(result.requireInitialMedia === true, 'expected requireInitialMedia=true');
  assert(result.layouts.length > 0, 'expected mixed media candidates');
  for (const layout of result.layouts) {
    assert((layout.mediaSlots || []).some(slot => {
      const kinds = slot.acceptedKinds || [];
      return slot.initialSrcSupported === true && kinds.includes('image') && kinds.includes('video') && mediaSlotCapacity(slot) >= 2;
    }), `${layout.layout} lacks mixed image/video initial slot`);
  }
}

function testStageMediaRenderPreview() {
  assert(existsSync(path.join(ROOT, 'scripts/stage-media.mjs')), 'scripts/stage-media.mjs is missing');
  const tmp = mkdtempSync(path.join(tmpdir(), 'dashi-stage-media-'));
  let previewState = null;
  try {
    const sourceDir = path.join(tmp, 'source');
    const outDir = path.join(tmp, 'ppt');
    mkdirSync(sourceDir, { recursive: true });
    mkdirSync(outDir, { recursive: true });
    const png = path.join(sourceDir, 'Key Visual 01.png');
    const mp4 = path.join(sourceDir, 'Recap Clip 01.mp4');
    writeFileSync(png, Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex'));
    writeFileSync(mp4, Buffer.from('00000018667479706d70343200000000', 'hex'));

    const staged = runJson('scripts/stage-media.mjs', [outDir, png, mp4]);
    assert(staged.items?.length === 2, 'stage-media should return two items');
    assert(staged.items[0].relative === 'assets/user-media/key-visual-01.png', 'stage-media should slugify image name');
    assert(staged.items[1].relative === 'assets/user-media/recap-clip-01.mp4', 'stage-media should slugify video name');
    assert(staged.items[0].kind === 'image' && staged.items[1].kind === 'video', 'stage-media should identify media kind');

    const goalPath = path.join(tmp, 'goal.json');
    writeFileSync(goalPath, JSON.stringify({
      title: 'Media Stage Smoke',
      goal: 'verify staged media survives render',
      themePack: 'theme11',
      slides: [{
        layout: 'theme11_page063',
        props: {
          headingHtml: 'Media Stage Smoke',
          lede: 'Staged image and video should remain available after render.',
          imageCount: 2,
          images: [
            { src: staged.items[0].relative, kind: 'image', type: staged.items[0].mime },
            { src: staged.items[1].relative, kind: 'video', type: staged.items[1].mime },
          ],
        },
      }],
    }, null, 2));

    execFileSync('npm', ['run', 'render:goal', '--', goalPath, path.join(outDir, 'index.html')], { cwd: ROOT, stdio: 'pipe' });
    assert(existsSync(path.join(outDir, staged.items[0].relative)), 'staged image should survive render');
    assert(existsSync(path.join(outDir, staged.items[1].relative)), 'staged video should survive render');

    const port = 49200 + (process.pid % 500);
    const output = execFileSync('npm', ['run', 'preview:start', '--', outDir, String(port)], {
      cwd: ROOT,
      env: { ...process.env, DASHI_PPT_PREVIEW_HOST: '127.0.0.1', DASHI_PPT_PREVIEW_NAME: 'jadon' },
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    assert(output.includes(`https://jadon.local:${port}/`), 'preview:start should print jadon.local URL');
    previewState = JSON.parse(readFileSync(path.join(outDir, '.preview-server.json'), 'utf8'));
    fetchHttpsWithRetry(`https://localhost:${port}/${staged.items[0].relative}`);
    fetchHttpsWithRetry(`https://localhost:${port}/${staged.items[1].relative}`);
  } finally {
    if (previewState?.pid) cleanupPreviewProcess(previewState.pid);
    rmSync(tmp, { recursive: true, force: true });
  }
}

function runJson(script, args) {
  const stdout = execFileSync('node', [script, ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return JSON.parse(stdout);
}

function mediaSlotCapacity(slot) {
  const max = Number(slot?.max);
  if (Number.isFinite(max) && max > 0) return max;
  const defaultCount = Number(slot?.defaultCount);
  if (Number.isFinite(defaultCount) && defaultCount > 0) return defaultCount;
  return 1;
}

function fetchHttpsWithRetry(url) {
  let lastError = null;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      return fetchHttps(url);
    } catch (error) {
      lastError = error;
      sleep(150);
    }
  }
  throw new Error(`Failed to fetch ${url}: ${lastError?.message || 'unknown error'}`);
}

function fetchHttps(url) {
  let result = null;
  let error = null;
  const marker = path.join(tmpdir(), `dashi-fetch-${process.pid}-${Math.random().toString(36).slice(2)}`);
  try {
    const code = `
      const https = require('https');
      https.get(${JSON.stringify(url)}, { rejectUnauthorized: false }, response => {
        response.resume();
        response.on('end', () => process.exit(response.statusCode === 200 ? 0 : 2));
      }).on('error', () => process.exit(1));
    `;
    execFileSync(process.execPath, ['-e', code], { stdio: 'pipe' });
    result = true;
  } catch (caught) {
    error = caught;
  } finally {
    rmSync(marker, { force: true });
  }
  if (result) return true;
  throw error || new Error('request failed');
}

function cleanupPreviewProcess(pid) {
  const value = Number(pid);
  if (!Number.isFinite(value) || value <= 0) return;
  try {
    process.kill(value, 'SIGTERM');
  } catch {}
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
