import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import PptxGenJS from 'pptxgenjs';

const SOURCE_W = 1920;
const SOURCE_H = 1080;
const PPT_W = 16;
const PPT_H = 9;
const PX_TO_PT = 0.75;
const MAX_SHAPES_PER_SLIDE = 260;
const MAX_TEXT_PER_SLIDE = 180;

export async function exportEditablePptxFromPage(page, options = {}) {
  const outFile = path.resolve(options.outFile || 'editable-export.pptx');
  const reportFile = options.reportFile ? path.resolve(options.reportFile) : null;
  const title = options.title || 'Editable Deck Export';
  const deck = await collectEditableDeck(page, options);

  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'DASHI_WIDE', width: PPT_W, height: PPT_H });
  pptx.layout = 'DASHI_WIDE';
  pptx.author = 'Dashi PPT Skill';
  pptx.subject = 'Editable PPTX export';
  pptx.title = title;

  const warnings = [...deck.warnings];
  let textObjects = 0;
  let shapeObjects = 0;
  let imageObjects = 0;

  for (const slideData of deck.slides) {
    const slide = pptx.addSlide();
    const background = slideData.background || { color: 'FFFFFF', transparency: 0 };
    slide.background = { color: background.color || 'FFFFFF' };

    for (const shape of slideData.shapes) {
      addRect(slide, shape);
      shapeObjects += 1;
    }

    for (const image of slideData.images) {
      if (!image.data) {
        warnings.push({ slide: slideData.index, type: 'image-skipped', reason: image.reason || 'missing-data' });
        continue;
      }
      slide.addImage({
        data: image.data,
        x: image.x,
        y: image.y,
        w: image.w,
        h: image.h,
        transparency: image.transparency || 0,
      });
      imageObjects += 1;
    }

    for (const text of slideData.text) {
      slide.addText(text.value, {
        x: text.x,
        y: text.y,
        w: text.w,
        h: text.h,
        margin: 0,
        breakLine: false,
        fit: 'shrink',
        fontFace: text.fontFace || 'Arial',
        fontSize: text.fontSize,
        color: text.color || '111111',
        bold: text.bold,
        italic: text.italic,
        align: text.align,
        valign: 'mid',
        rotate: text.rotate || 0,
        transparency: text.transparency || 0,
      });
      textObjects += 1;
    }

    warnings.push(...slideData.warnings);
  }

  mkdirSync(path.dirname(outFile), { recursive: true });
  await pptx.writeFile({ fileName: outFile });

  const report = {
    slideCount: deck.slides.length,
    textObjects,
    shapeObjects,
    imageObjects,
    warnings,
  };
  if (reportFile) {
    mkdirSync(path.dirname(reportFile), { recursive: true });
    writeFileSync(reportFile, JSON.stringify(report, null, 2) + '\n');
  }
  return { outFile, reportFile, ...report };
}

export async function exportEditablePptxFromUrl(browser, url, options = {}) {
  const context = await browser.newContext({ viewport: { width: SOURCE_W, height: SOURCE_H }, ignoreHTTPSErrors: true });
  const page = await context.newPage();
  try {
    page.setDefaultTimeout(options.timeout || 45000);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#deck > .slide.active, #deck > .slide[data-deck-active]');
    return await exportEditablePptxFromPage(page, options);
  } finally {
    await page.close().catch(() => {});
    await context.close().catch(() => {});
  }
}

function addRect(slide, shape) {
  const line = shape.lineColor
    ? { color: shape.lineColor, transparency: shape.lineTransparency || 0, width: shape.lineWidth || 0.5 }
    : { color: shape.color, transparency: 100 };
  slide.addShape('rect', {
    x: shape.x,
    y: shape.y,
    w: shape.w,
    h: shape.h,
    rectRadius: shape.radius || 0,
    fill: { color: shape.color || 'FFFFFF', transparency: shape.transparency || 0 },
    line,
  });
}

async function collectEditableDeck(page, options = {}) {
  await page.evaluate(async ({ includeAllThemePacks }) => {
    window.__editablePptxRestoreState = {
      locked: window.__deckExportLocked,
      themePack: document.documentElement.dataset.themePack || '',
    };
    if (includeAllThemePacks) window.__setActiveThemePack?.('', { navigate: false });
    window.__deckExportLocked = true;
    window.__flushEditableTextState?.();
    window.__syncDeckViewModelFromDom?.();
    window.__setEditableTextMode?.(false);
    window.__layoutDeck?.();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }, { includeAllThemePacks: options.includeAllThemePacks === true });

  try {
    const count = await page.evaluate(() => {
      const slides = window.__getVisibleSlides?.() || [...document.querySelectorAll('#deck > .slide:not([hidden])')];
      return slides.length;
    });

    await installBrowserCollector(page);
    const slides = [];
    const warnings = [];
    for (let i = 0; i < count; i += 1) {
      await page.evaluate(async index => {
        window.go?.(index, { animate: false, force: true });
        const slides = window.__getVisibleSlides?.() || [...document.querySelectorAll('#deck > .slide:not([hidden])')];
        window.__ensureRuntimeSlideRendered?.(slides[index]);
        window.__restoreEffectIframes?.(slides[index]);
        window.__layoutDeck?.();
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      }, i);
      slides.push(await page.evaluate(index => window.__collectEditablePptxSlide(index), i + 1));
    }

    return { slides, warnings };
  } finally {
    await page.evaluate(async () => {
      const restore = window.__editablePptxRestoreState || {};
      if ((document.documentElement.dataset.themePack || '') !== (restore.themePack || '')) {
        window.__setActiveThemePack?.(restore.themePack || '', { navigate: false });
      }
      window.__deckExportLocked = Boolean(restore.locked);
      window.__setEditableTextMode?.(window.__canEditDeck?.());
      delete window.__editablePptxRestoreState;
      window.__layoutDeck?.();
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }).catch(() => {});
  }
}

async function installBrowserCollector(page) {
  await page.addScriptTag({
    content: `
      window.__collectEditablePptxSlide = (() => {
        const SOURCE_W = ${SOURCE_W};
        const PPT_W = ${PPT_W};
        const PPT_H = ${PPT_H};
        const PX_TO_PT = ${PX_TO_PT};
        const MAX_SHAPES_PER_SLIDE = ${MAX_SHAPES_PER_SLIDE};
        const MAX_TEXT_PER_SLIDE = ${MAX_TEXT_PER_SLIDE};
        ${collectActiveSlide.toString()}
        ${collectText.toString()}
        ${collectShapes.toString()}
        ${collectImages.toString()}
        ${countComplexNodes.toString()}
        ${imageToDataUrl.toString()}
        ${isVisibleElement.toString()}
        ${isMediaChrome.toString()}
        ${hasTextElementChild.toString()}
        ${clippedRect.toString()}
        ${toPptRect.toString()}
        ${colorFromCss.toString()}
        ${clampColor.toString()}
        ${normalizeText.toString()}
        ${normalizeAlign.toString()}
        ${firstFont.toString()}
        ${round.toString()}
        ${dedupeRects.toString()}
        return collectActiveSlide;
      })();
    `,
  });
}

async function collectActiveSlide(slideNumber) {
  const slide = document.querySelector('#deck > .slide.active, #deck > .slide[data-deck-active]');
  if (!slide) return { index: slideNumber, background: { color: 'FFFFFF' }, text: [], shapes: [], images: [], warnings: [{ type: 'missing-slide' }] };

  const slideRect = slide.getBoundingClientRect();
  const warnings = [];
  const background = colorFromCss(getComputedStyle(slide).backgroundColor)
    || colorFromCss(getComputedStyle(document.documentElement).getPropertyValue('--paper'))
    || { color: 'FFFFFF', transparency: 0 };

  const text = collectText(slide, slideRect, warnings).slice(0, MAX_TEXT_PER_SLIDE);
  const shapes = collectShapes(slide, slideRect, warnings).slice(0, MAX_SHAPES_PER_SLIDE);
  const images = await collectImages(slide, slideRect, warnings);
  const complex = countComplexNodes(slide);
  for (const [type, count] of Object.entries(complex)) {
    if (count > 0) warnings.push({ slide: slideNumber, type: 'complex-node', node: type, count });
  }

  return {
    index: slideNumber,
    background,
    text,
    shapes,
    images,
    warnings,
  };
}

function collectText(slide, slideRect, warnings) {
  const out = [];
  const protectedRoots = new Set([...slide.querySelectorAll('[data-editable-id]')]);
  const candidates = [
    ...protectedRoots,
    ...slide.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,span,small,strong,b,em,i,td,th,blockquote,label,figcaption,button,div'),
  ];
  const seen = new Set();
  for (const el of candidates) {
    if (seen.has(el) || !isVisibleElement(el, slideRect)) continue;
    seen.add(el);
    if (![...protectedRoots].includes(el) && el.closest('[data-editable-id]')) continue;
    if (![...protectedRoots].includes(el) && hasTextElementChild(el)) continue;
    if (isMediaChrome(el)) continue;
    const value = normalizeText(el.innerText || el.textContent || '');
    if (!value) continue;
    const rect = clippedRect(el.getBoundingClientRect(), slideRect);
    if (!rect) continue;
    const style = getComputedStyle(el);
    const color = colorFromCss(style.color);
    const fontSize = Math.max(4, Math.min(96, parseFloat(style.fontSize || '16') * PX_TO_PT));
    out.push({
      value,
      ...toPptRect(rect, slideRect),
      fontFace: firstFont(style.fontFamily),
      fontSize,
      color: color?.color || '111111',
      bold: Number.parseInt(style.fontWeight, 10) >= 600 || style.fontWeight === 'bold',
      italic: style.fontStyle === 'italic',
      align: normalizeAlign(style.textAlign),
      transparency: color?.transparency || 0,
    });
  }
  if (candidates.length > MAX_TEXT_PER_SLIDE) warnings.push({ type: 'text-limit', count: candidates.length, exported: MAX_TEXT_PER_SLIDE });
  return out;
}

function collectShapes(slide, slideRect, warnings) {
  const out = [];
  const elements = [slide, ...slide.querySelectorAll('div,section,article,aside,header,footer,main,figure,ul,ol,li,span')];
  for (const el of elements) {
    if (!isVisibleElement(el, slideRect) || isMediaChrome(el)) continue;
    if (el.tagName === 'SPAN' && normalizeText(el.textContent || '')) continue;
    const rect = clippedRect(el.getBoundingClientRect(), slideRect);
    if (!rect || rect.width < 4 || rect.height < 4) continue;
    const style = getComputedStyle(el);
    const fill = colorFromCss(style.backgroundColor);
    const border = colorFromCss(style.borderTopColor);
    const borderWidth = parseFloat(style.borderTopWidth || '0') || 0;
    if (!fill && !(border && borderWidth > 0)) continue;
    if (rect.width >= slideRect.width * 0.995 && rect.height >= slideRect.height * 0.995 && el !== slide) continue;
    const pptRect = toPptRect(rect, slideRect);
    out.push({
      ...pptRect,
      color: fill?.color || 'FFFFFF',
      transparency: fill ? fill.transparency : 100,
      lineColor: border && borderWidth > 0 ? border.color : null,
      lineTransparency: border?.transparency || 0,
      lineWidth: Math.max(0.25, Math.min(4, borderWidth * 0.5)),
      radius: Math.min(parseFloat(style.borderTopLeftRadius || '0') || 0, 24) / SOURCE_W * PPT_W,
    });
  }
  if (elements.length > MAX_SHAPES_PER_SLIDE) warnings.push({ type: 'shape-limit', count: elements.length, exported: MAX_SHAPES_PER_SLIDE });
  return dedupeRects(out);
}

async function collectImages(slide, slideRect, warnings) {
  const out = [];
  const images = [...slide.querySelectorAll('img')];
  for (const img of images) {
    if (!isVisibleElement(img, slideRect)) continue;
    const rect = clippedRect(img.getBoundingClientRect(), slideRect);
    if (!rect || rect.width < 4 || rect.height < 4) continue;
    const src = img.currentSrc || img.src || img.getAttribute('src') || '';
    const data = await imageToDataUrl(img, src);
    if (!data) {
      warnings.push({ type: 'image-skipped', src: src.slice(0, 160), reason: 'unreadable-resource' });
      continue;
    }
    out.push({ ...toPptRect(rect, slideRect), data });
  }
  return out;
}

function countComplexNodes(slide) {
  return {
    svg: slide.querySelectorAll('svg').length,
    canvas: slide.querySelectorAll('canvas').length,
    video: slide.querySelectorAll('video').length,
    iframe: slide.querySelectorAll('iframe').length,
  };
}

async function imageToDataUrl(img, src) {
  if (!src) return null;
  if (src.startsWith('data:image/')) return src;
  if (src.startsWith('data:video/')) return null;
  try {
    const canvas = document.createElement('canvas');
    const width = img.naturalWidth || Math.max(1, Math.round(img.getBoundingClientRect().width));
    const height = img.naturalHeight || Math.max(1, Math.round(img.getBoundingClientRect().height));
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL('image/png');
  } catch {}
  try {
    const response = await fetch(src);
    const blob = await response.blob();
    if (!blob.type.startsWith('image/')) return null;
    return await new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function isVisibleElement(el, slideRect) {
  if (!(el instanceof Element)) return false;
  const style = getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity || 1) <= 0.01) return false;
  const rect = el.getBoundingClientRect();
  if (rect.width <= 1 || rect.height <= 1) return false;
  if (rect.right < slideRect.left || rect.left > slideRect.right || rect.bottom < slideRect.top || rect.top > slideRect.bottom) return false;
  return true;
}

function isMediaChrome(el) {
  return !!el.closest('script,style,noscript,template,#nav,#preview-panel,#slide-rail,.theme03-theme-toggle');
}

function hasTextElementChild(el) {
  return [...el.children].some(child => {
    const tag = child.tagName?.toLowerCase();
    if (!['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'span', 'small', 'strong', 'b', 'em', 'i', 'td', 'th', 'blockquote', 'label', 'figcaption', 'button', 'div'].includes(tag)) return false;
    return normalizeText(child.innerText || child.textContent || '');
  });
}

function clippedRect(rect, slideRect) {
  const left = Math.max(rect.left, slideRect.left);
  const top = Math.max(rect.top, slideRect.top);
  const right = Math.min(rect.right, slideRect.right);
  const bottom = Math.min(rect.bottom, slideRect.bottom);
  if (right <= left || bottom <= top) return null;
  return { left, top, width: right - left, height: bottom - top };
}

function toPptRect(rect, slideRect) {
  return {
    x: round((rect.left - slideRect.left) / slideRect.width * PPT_W),
    y: round((rect.top - slideRect.top) / slideRect.height * PPT_H),
    w: round(rect.width / slideRect.width * PPT_W),
    h: round(rect.height / slideRect.height * PPT_H),
  };
}

function colorFromCss(value) {
  const raw = String(value || '').trim();
  if (!raw || raw === 'transparent') return null;
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(raw)) {
    const hex = raw.slice(1);
    return { color: (hex.length === 3 ? hex.replace(/./g, c => c + c) : hex).toUpperCase(), transparency: 0 };
  }
  const rgba = raw.match(/rgba?\(([^)]+)\)/i);
  if (!rgba) return null;
  const parts = rgba[1].split(',').map(part => part.trim());
  const r = clampColor(parts[0]);
  const g = clampColor(parts[1]);
  const b = clampColor(parts[2]);
  const alpha = parts[3] == null ? 1 : Math.max(0, Math.min(1, Number(parts[3])));
  if (alpha <= 0.01) return null;
  return {
    color: [r, g, b].map(n => n.toString(16).padStart(2, '0')).join('').toUpperCase(),
    transparency: Math.round((1 - alpha) * 100),
  };
}

function clampColor(value) {
  return Math.max(0, Math.min(255, Math.round(Number.parseFloat(value) || 0)));
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function normalizeAlign(value) {
  if (value === 'center' || value === 'right' || value === 'justify') return value;
  return 'left';
}

function firstFont(value) {
  return String(value || 'Arial').split(',')[0].replace(/^["']|["']$/g, '').trim() || 'Arial';
}

function round(value) {
  return Math.round(value * 10000) / 10000;
}

function dedupeRects(shapes) {
  const seen = new Set();
  return shapes.filter(shape => {
    const key = [shape.x, shape.y, shape.w, shape.h, shape.color, shape.transparency].join(':');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
