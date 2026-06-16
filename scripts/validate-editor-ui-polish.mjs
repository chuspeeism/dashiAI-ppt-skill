#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import https from 'node:https';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PREVIEW_INDEX = path.join(ROOT, 'output/theme-preview/ppt/index.html');
const CHROME_PATH = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const cliUrl = getArg('--url');

if (!existsSync(CHROME_PATH)) {
  throw new Error(`Chrome executable not found: ${CHROME_PATH}`);
}
if (!cliUrl && !existsSync(PREVIEW_INDEX)) {
  throw new Error(`Preview file missing: ${PREVIEW_INDEX}
Run npm run render:themes first, or pass --url to an existing preview.`);
}

const server = cliUrl ? null : await startPreviewServer();
const url = cliUrl || server.url;
const browser = await chromium.launch({ headless: true, executablePath: CHROME_PATH });
let page;

try {
  page = await browser.newPage({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true });
  page.setDefaultTimeout(30000);
  await page.goto(`${url}?editor_ui_polish=${Date.now()}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#deck > .slide.active, #deck > .slide[data-deck-active]');
  await settle(page);

  const result = {
    url,
    title: await readRailTitle(page),
    layouts: [],
    resize: null,
    activeStates: {},
    colorControls: null,
    shadows: await readPanelShadows(page),
    actionLayouts: [],
    actions: null,
    exportMenu: null,
    reset: null,
    editRailContextMenu: null,
    presentContextMenu: null,
    present: null,
  };

  for (const width of [1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await settle(page);
    result.layouts.push(await readLayout(page, width));
    result.actionLayouts.push(await readActionPriority(page, width));
  }
  result.actions = result.actionLayouts[result.actionLayouts.length - 1] || await readActionPriority(page);

  result.resize = await runRailResizeValidation(page);
  result.activeStates.initial = await readActiveRailStyle(page);
  await page.keyboard.press('ArrowDown');
  await settle(page);
  result.activeStates.afterKeyboard = await readActiveRailStyle(page);
  await clickRailCard(page, 3);
  result.activeStates.afterRailClick = await readActiveRailStyle(page);
  result.activeStates.afterDrag = await runActiveDragValidation(page);
  result.colorControls = await findAndReadColorControls(page);
  result.exportMenu = await runExportMenuValidation(page);
  result.editRailContextMenu = await runEditRailContextMenuValidation(page);
  result.presentContextMenu = await runPresentContextMenuValidation(page);
  result.reset = await runResetValidation(page);
  result.present = await runPresentValidation(page);

  const failures = validateResult(result);
  if (failures.length) {
    console.error(JSON.stringify({ ...result, failures }, null, 2));
    throw new Error(failures.join('\n'));
  }
  console.log(JSON.stringify({ ...result, passed: true }, null, 2));
} finally {
  await closePage(page);
  await closeBrowser(browser);
  if (server) await server.close();
}

async function readRailTitle(page) {
  return page.locator('.slide-rail-title').first().textContent().then(text => (text || '').trim()).catch(() => '');
}

async function readLayout(page, viewportWidth) {
  return page.evaluate((viewportWidth) => {
    const rail = document.getElementById('slide-rail');
    const panel = document.getElementById('preview-panel');
    const deck = document.getElementById('deck-viewport');
    const railRect = rail?.getBoundingClientRect();
    const panelRect = panel?.getBoundingClientRect();
    const deckRect = deck?.getBoundingClientRect();
    return {
      viewportWidth,
      railRect: rectOf(railRect),
      panelRect: rectOf(panelRect),
      deckRect: rectOf(deckRect),
      panelOverflow: Boolean(panelRect && panelRect.right > viewportWidth + 1),
      deckOverlapsRail: Boolean(deckRect && railRect && deckRect.left < railRect.right - 1),
      deckOverlapsPanel: Boolean(deckRect && panelRect && deckRect.right > panelRect.left + 1),
      deckAspect: deckRect ? deckRect.width / deckRect.height : 0,
    };

    function rectOf(rect) {
      if (!rect) return null;
      return { left: rect.left, top: rect.top, width: rect.width, height: rect.height, right: rect.right, bottom: rect.bottom };
    }
  }, viewportWidth);
}

async function runRailResizeValidation(page) {
  const before = await readLayout(page, page.viewportSize()?.width || 1440);
  const beforeThumbs = await readThumbnailFit(page);
  const handle = page.locator('[data-rail-resize-handle="true"]').first();
  if (!(await handle.count())) return { hasHandle: false, before, beforeThumbs };
  const hasBox = await dragRailResizeHandle(page, 82);
  if (!hasBox) return { hasHandle: true, hasBox: false, before, beforeThumbs };
  await settle(page, 220);
  const wide = await readLayout(page, page.viewportSize()?.width || 1440);
  const wideThumbs = await readThumbnailFit(page);
  await dragRailResizeHandle(page, -82);
  await settle(page, 260);
  const narrow = await readLayout(page, page.viewportSize()?.width || 1440);
  const narrowThumbs = await readThumbnailFit(page);
  return {
    hasHandle: true,
    hasBox: true,
    before,
    after: wide,
    narrow,
    beforeThumbs,
    thumbs: wideThumbs,
    narrowThumbs,
    widthDelta: (wide.railRect?.width || 0) - (before.railRect?.width || 0),
    shrinkDelta: (wide.railRect?.width || 0) - (narrow.railRect?.width || 0),
    frameGrowth: (wideThumbs.avgFrameWidth || 0) - (beforeThumbs.avgFrameWidth || 0),
    contentGrowth: (wideThumbs.avgContentWidth || 0) - (beforeThumbs.avgContentWidth || 0),
    frameShrink: (wideThumbs.avgFrameWidth || 0) - (narrowThumbs.avgFrameWidth || 0),
    contentShrink: (wideThumbs.avgContentWidth || 0) - (narrowThumbs.avgContentWidth || 0),
  };
}

async function dragRailResizeHandle(page, deltaX) {
  const handle = page.locator('[data-rail-resize-handle="true"]').first();
  const box = await handle.boundingBox();
  if (!box) return false;
  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + deltaX, startY, { steps: 8 });
  await page.mouse.up();
  return true;
}

async function readThumbnailFit(page) {
  await page.waitForFunction(() => {
    const scroller = document.querySelector('[data-rail-scroll="true"],#slide-rail-list');
    const railRect = scroller?.getBoundingClientRect();
    if (!railRect) return false;
    const visibleCards = [...document.querySelectorAll('[data-rail-card="true"],[data-slide-rail-card="true"]')]
      .filter(card => {
        const rect = card.getBoundingClientRect();
        return rect.bottom > railRect.top + 1 && rect.top < railRect.bottom - 1;
      });
    return visibleCards.filter(card => {
      const frame = card.querySelector('[data-rail-frame="true"],[data-overview-frame="true"]');
      const thumb = card.querySelector('[data-rail-thumb="true"],[data-overview-thumb="true"]');
      const content = thumb?.firstElementChild;
      const frameRect = frame?.getBoundingClientRect();
      const contentRect = content?.getBoundingClientRect();
      return frameRect?.width > 0 && frameRect?.height > 0 && contentRect?.width > 0 && contentRect?.height > 0;
    }).length >= 3;
  });
  await settle(page, 360);
  return page.evaluate(() => {
    const scroller = document.querySelector('[data-rail-scroll="true"],#slide-rail-list');
    const railRect = scroller?.getBoundingClientRect();
    const samples = [...document.querySelectorAll('[data-rail-card="true"],[data-slide-rail-card="true"]')]
      .filter(card => {
        const rect = card.getBoundingClientRect();
        return railRect && rect.bottom > railRect.top + 1 && rect.top < railRect.bottom - 1;
      })
      .slice(0, 6)
      .map(card => {
        const frame = card.querySelector('[data-rail-frame="true"],[data-overview-frame="true"]');
        const thumb = card.querySelector('[data-rail-thumb="true"],[data-overview-thumb="true"]');
        const content = thumb?.firstElementChild;
        const frameRect = frame?.getBoundingClientRect();
        const contentRect = content?.getBoundingClientRect();
        return {
          index: Number(card.dataset.index || -1),
          frameWidth: frameRect?.width || 0,
          frameHeight: frameRect?.height || 0,
          frameAspect: frameRect ? frameRect.width / frameRect.height : 0,
          contentWidth: contentRect?.width || 0,
          contentHeight: contentRect?.height || 0,
          widthMismatch: frameRect && contentRect ? Math.abs(frameRect.width - contentRect.width) : 0,
          heightMismatch: frameRect && contentRect ? Math.abs(frameRect.height - contentRect.height) : 0,
          rightGap: frameRect && contentRect ? frameRect.right - contentRect.right : 0,
          bottomGap: frameRect && contentRect ? frameRect.bottom - contentRect.bottom : 0,
        };
      });
    const average = (items, key) => items.length ? items.reduce((sum, item) => sum + item[key], 0) / items.length : 0;
    return {
      sampleCount: samples.length,
      samples,
      avgFrameWidth: average(samples, 'frameWidth'),
      avgFrameHeight: average(samples, 'frameHeight'),
      avgContentWidth: average(samples, 'contentWidth'),
      avgContentHeight: average(samples, 'contentHeight'),
      maxAspectError: samples.reduce((max, item) => Math.max(max, Math.abs(item.frameAspect - 16 / 9)), 0),
      maxWidthMismatch: samples.reduce((max, item) => Math.max(max, item.widthMismatch), 0),
      maxHeightMismatch: samples.reduce((max, item) => Math.max(max, item.heightMismatch), 0),
      maxRightGap: samples.reduce((max, item) => Math.max(max, item.rightGap), 0),
      maxBottomGap: samples.reduce((max, item) => Math.max(max, item.bottomGap), 0),
    };
  });
}

async function readActiveRailStyle(page) {
  return page.evaluate(() => {
    const cards = [...document.querySelectorAll('[data-rail-card="true"],[data-slide-rail-card="true"]')];
    const active = cards.find(card => card.dataset.railActive === 'true' || card.getAttribute('aria-current') === 'true');
    const label = active?.querySelector('.rail-label');
    const cardStyle = active ? getComputedStyle(active) : null;
    const labelStyle = label ? getComputedStyle(label) : null;
    const bg = cardStyle?.backgroundColor || '';
    const color = labelStyle?.color || cardStyle?.color || '';
    return {
      found: Boolean(active),
      index: active ? Number(active.dataset.index || -1) : -1,
      slideId: active?.dataset.slideId || '',
      currentIndex: window.__currentSlideIndex || 0,
      backgroundColor: bg,
      color,
      backgroundLuminance: luminance(bg),
      textLuminance: luminance(color),
      activeCardCount: cards.filter(card => card.dataset.railActive === 'true' || card.getAttribute('aria-current') === 'true').length,
    };

    function luminance(value){
      const rgb = parseRgb(value);
      if(!rgb) return null;
      const [r,g,b] = rgb.map(channel => {
        const next = channel / 255;
        return next <= 0.03928 ? next / 12.92 : Math.pow((next + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    function parseRgb(value){
      const match = String(value || '').match(/rgba?\(([^)]+)\)/);
      if(!match) return null;
      return match[1].split(',').slice(0, 3).map(item => Number(item.trim())).filter(Number.isFinite);
    }
  });
}

async function clickRailCard(page, index) {
  const card = page.locator(`[data-rail-card="true"][data-index="${index}"],[data-slide-rail-card="true"][data-index="${index}"]`).first();
  if (await card.count()) await card.click();
  await settle(page);
}

async function runActiveDragValidation(page) {
  const before = await readActiveRailStyle(page);
  const from = before.index;
  const to = Math.min(from + 2, from + 3);
  const source = page.locator(`[data-rail-card="true"][data-index="${from}"],[data-slide-rail-card="true"][data-index="${from}"]`).first();
  const target = page.locator(`[data-rail-card="true"][data-index="${to}"],[data-slide-rail-card="true"][data-index="${to}"]`).first();
  if (!(await source.count()) || !(await target.count())) return { attempted: false, before, after: before };
  await source.scrollIntoViewIfNeeded();
  await target.scrollIntoViewIfNeeded();
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();
  if (!sourceBox || !targetBox) return { attempted: false, before, after: before };
  await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 6 });
  await page.mouse.up();
  await settle(page, 420);
  return { attempted: true, before, after: await readActiveRailStyle(page) };
}

async function findAndReadColorControls(page) {
  const themes = await page.$$eval('#preview-theme-pack option', options => options
    .filter(option => option.value && !option.disabled)
    .map(option => option.value));
  for (const theme of themes) {
    await page.selectOption('#preview-theme-pack', theme).catch(() => {});
    await settle(page, 220);
    const count = await page.evaluate(() => window.__getVisibleSlides?.().length || document.querySelectorAll('#deck > .slide:not([hidden])').length);
    for (let index = 0; index < Math.min(count, 36); index += 1) {
      await page.evaluate(targetIndex => window.go?.(targetIndex, { animate: false, force: true }), index);
      await settle(page, 120);
      const colorCount = await page.locator('.preview-prop-choice-group.is-color .preview-prop-choice').count();
      if (colorCount >= 3) return readColorControls(page, { theme, index });
    }
  }
  return { found: false };
}

async function readColorControls(page, location) {
  const choices = page.locator('.preview-prop-choice-group.is-color .preview-prop-choice');
  const probe = (await choices.count()) > 1 ? choices.nth(1) : choices.first();
  await probe.hover();
  const hover = await probe.evaluate(button => {
    const style = getComputedStyle(button);
    return { transform: style.transform, boxShadow: style.boxShadow, outline: style.outline };
  });
  await page.mouse.move(8, 8);
  await settle(page, 40);
  await probe.focus();
  const focus = await probe.evaluate(button => {
    const style = getComputedStyle(button);
    return { transform: style.transform, boxShadow: style.boxShadow, outline: style.outline };
  });
  return page.evaluate((location) => {
    const group = document.querySelector('.preview-prop-choice-group.is-color');
    const panel = document.getElementById('preview-panel');
    const buttons = [...(group?.querySelectorAll('.preview-prop-choice') || [])];
    const groupRect = group?.getBoundingClientRect();
    const panelRect = panel?.getBoundingClientRect();
    const rows = [...buttons.reduce((map, button) => {
      const rect = button.getBoundingClientRect();
      const top = Math.round(rect.top);
      if(!map.has(top)) map.set(top, []);
      map.get(top).push({
        width: rect.width,
        height: rect.height,
        left: rect.left,
        right: rect.right,
        label: button.getAttribute('aria-label') || button.title || '',
        active: button.classList.contains('is-active') || button.getAttribute('aria-pressed') === 'true',
      });
      return map;
    }, new Map()).values()];
    return {
      found: Boolean(group),
      ...location,
      buttonCount: buttons.length,
      groupRect: rectOf(groupRect),
      panelRect: rectOf(panelRect),
      rows,
      maxButtonsPerRow: rows.reduce((max, row) => Math.max(max, row.length), 0),
      minButtonWidth: rows.flat().reduce((min, item) => Math.min(min, item.width), Infinity),
      minButtonHeight: rows.flat().reduce((min, item) => Math.min(min, item.height), Infinity),
      hasActive: rows.flat().some(item => item.active),
      allHaveLabels: rows.flat().every(item => item.label),
      overflowsPanel: Boolean(groupRect && panelRect && groupRect.right > panelRect.right - 12),
    };

    function rectOf(rect) {
      if (!rect) return null;
      return { left: rect.left, top: rect.top, width: rect.width, height: rect.height, right: rect.right, bottom: rect.bottom };
    }
  }, location).then(state => ({ ...state, hover, focus }));
}

async function readPanelShadows(page) {
  return page.evaluate(() => {
    const rail = document.getElementById('slide-rail');
    const panel = document.getElementById('preview-panel');
    const railStyle = rail ? getComputedStyle(rail) : null;
    const panelStyle = panel ? getComputedStyle(panel) : null;
    return {
      railBoxShadow: railStyle?.boxShadow || '',
      panelBoxShadow: panelStyle?.boxShadow || '',
      railHasLargeCanvasShadow: hasLargeShadow(railStyle?.boxShadow || ''),
      panelHasLargeCanvasShadow: hasLargeShadow(panelStyle?.boxShadow || ''),
      railBorderRight: railStyle?.borderRight || '',
      panelBorderLeft: panelStyle?.borderLeft || '',
    };

    function hasLargeShadow(value){
      if(!value || value === 'none') return false;
      const lengths = [...value.matchAll(/(-?\d+(?:\.\d+)?)px/g)].map(match => Math.abs(Number(match[1])));
      return lengths.some(length => length > 12);
    }
  });
}

async function readActionPriority(page, viewportWidth = page.viewportSize()?.width || 0) {
  return page.evaluate((viewportWidth) => {
    const actions = document.querySelector('.preview-actions');
    const panel = document.getElementById('preview-panel');
    const close = document.getElementById('preview-close');
    const present = document.getElementById('preview-present-btn');
    const exportButton = document.getElementById('preview-export-main');
    const exportWrap = document.getElementById('preview-export-wrap');
    const reset = document.getElementById('preview-reset');
    const actionsRect = actions?.getBoundingClientRect();
    const panelRect = panel?.getBoundingClientRect();
    const closeRect = close?.getBoundingClientRect();
    const closeStyle = close ? getComputedStyle(close) : null;
    const presentRect = present?.getBoundingClientRect();
    const exportRect = exportButton?.getBoundingClientRect();
    const exportWrapRect = exportWrap?.getBoundingClientRect();
    const resetRect = reset?.getBoundingClientRect();
    const presentStyle = present ? getComputedStyle(present) : null;
    const exportStyle = exportButton ? getComputedStyle(exportButton) : null;
    const resetStyle = reset ? getComputedStyle(reset) : null;
    const buttonRects = [presentRect, exportRect, resetRect].filter(Boolean);
    const sortedRects = [...buttonRects].sort((a, b) => a.left - b.left);
    const actionChildren = [...(actions?.children || [])].map(child => child.id || child.className || child.tagName);
    return {
      viewportWidth,
      actionsRect: rectOf(actionsRect),
      panelRect: rectOf(panelRect),
      closeExists: Boolean(close),
      closeVisible: Boolean(close && closeStyle?.display !== 'none' && closeStyle?.visibility !== 'hidden' && closeRect && closeRect.width > 2 && closeRect.height > 2),
      closeRect: rectOf(closeRect),
      actionChildren,
      presentExists: Boolean(present),
      exportExists: Boolean(exportButton),
      resetExists: Boolean(reset),
      presentInActions: Boolean(actions && present && actions.contains(present)),
      exportInActions: Boolean(actions && exportButton && actions.contains(exportButton)),
      resetInActions: Boolean(actions && reset && actions.contains(reset)),
      presentRect: rectOf(presentRect),
      exportRect: rectOf(exportRect),
      exportWrapRect: rectOf(exportWrapRect),
      resetRect: rectOf(resetRect),
      presentLeftOfExport: Boolean(presentRect && exportRect && presentRect.right <= exportRect.left + 1),
      exportLeftOfReset: Boolean(exportRect && resetRect && exportRect.right <= resetRect.left + 1),
      sameRow: Boolean(presentRect && exportRect && Math.abs(presentRect.top - exportRect.top) < 8),
      allThreeSameRow: Boolean(buttonRects.length === 3 && Math.max(...buttonRects.map(rect => rect.top)) - Math.min(...buttonRects.map(rect => rect.top)) < 8),
      buttonOverlap: sortedRects.some((rect, index) => index > 0 && rect.left < sortedRects[index - 1].right - 1),
      actionsOverflow: Boolean(actionsRect && buttonRects.some(rect => rect.left < actionsRect.left - 1 || rect.right > actionsRect.right + 1)),
      panelOverflow: Boolean(panelRect && buttonRects.some(rect => rect.left < panelRect.left - 1 || rect.right > panelRect.right + 1)),
      labelsFit: [present, exportButton, reset].filter(Boolean).every(button => {
        const label = button.querySelector('span');
        return !label || label.scrollWidth <= label.clientWidth + 1;
      }),
      presentBackground: presentStyle?.backgroundColor || '',
      exportBackground: exportStyle?.backgroundColor || '',
      resetBackground: resetStyle?.backgroundColor || '',
      presentColor: presentStyle?.color || '',
      exportColor: exportStyle?.color || '',
      resetColor: resetStyle?.color || '',
      presentBorder: presentStyle?.border || '',
      exportBorder: exportStyle?.border || '',
      resetBorder: resetStyle?.border || '',
      presentHeight: presentRect?.height || 0,
      exportHeight: exportRect?.height || 0,
      resetHeight: resetRect?.height || 0,
      backgroundsDiffer: presentStyle?.backgroundColor !== exportStyle?.backgroundColor,
    };

    function rectOf(rect) {
      if (!rect) return null;
      return { left: rect.left, top: rect.top, width: rect.width, height: rect.height, right: rect.right, bottom: rect.bottom };
    }
  }, viewportWidth);
}

async function runExportMenuValidation(page) {
  await page.locator('#preview-export-main').click();
  await settle(page, 120);
  const state = await page.evaluate(() => {
    const wrap = document.getElementById('preview-export-wrap');
    const menu = wrap?.querySelector('.pp-export-menu');
    const rect = menu?.getBoundingClientRect();
    const style = menu ? getComputedStyle(menu) : null;
    return {
      open: Boolean(wrap?.classList.contains('open')),
      visible: Boolean(menu && style?.display !== 'none' && rect && rect.width > 2 && rect.height > 2),
      buttonCount: menu?.querySelectorAll('button').length || 0,
    };
  });
  await page.keyboard.press('Escape').catch(() => {});
  await page.mouse.click(20, 20).catch(() => {});
  await settle(page, 80);
  return state;
}

async function runResetValidation(page) {
  await ensureEditMode(page);
  const button = page.locator('#preview-reset').first();
  if (!(await button.count())) return { hasButton: false };
  await page.evaluate(() => {
    const next = new URL(location.href);
    next.searchParams.set('deckState', 'jad137-reset-probe');
    history.replaceState(null, '', next.href);
    localStorage.setItem('dashi-ppt-preview:jad137-probe', '1');
  });
  const beforeUrl = page.url();
  const navigation = page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 6000 }).catch(() => null);
  await button.click();
  const nav = await navigation;
  await page.waitForSelector('#deck > .slide.active, #deck > .slide[data-deck-active]');
  await settle(page, 360);
  return page.evaluate(({ beforeUrl, navigated }) => {
    const current = new URL(location.href);
    return {
      hasButton: true,
      clicked: true,
      beforeUrl,
      afterUrl: location.href,
      navigated,
      deckStateCleared: !current.searchParams.has('deckState'),
      probeCleared: localStorage.getItem('dashi-ppt-preview:jad137-probe') === null,
      mode: document.body.dataset.mode || '',
    };
  }, { beforeUrl, navigated: Boolean(nav) });
}

async function runPresentValidation(page) {
  await ensureEditMode(page);
  await page.locator('#preview-present-btn').click();
  await settle(page, 420);
  const entered = await page.evaluate(() => {
    const isVisible = (el) => {
      if (!el) return false;
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 2 && rect.height > 2;
    };
    return {
      mode: document.body.dataset.mode || '',
      hasFullscreenElement: Boolean(document.fullscreenElement),
      railVisible: isVisible(document.getElementById('slide-rail')),
      panelVisible: isVisible(document.getElementById('preview-panel')),
    };
  });
  await page.keyboard.press('Escape');
  await settle(page, 500);
  const exited = await page.evaluate(() => ({
    mode: document.body.dataset.mode || '',
    hasFullscreenElement: Boolean(document.fullscreenElement),
  }));
  return { entered, exited };
}

async function runEditRailContextMenuValidation(page) {
  await ensureEditMode(page);
  const card = page.locator('[data-rail-card="true"]:not([aria-current="true"]),[data-slide-rail-card="true"]:not([aria-current="true"])').first();
  if (!(await card.count())) return { hasCard: false };
  await card.scrollIntoViewIfNeeded();
  await card.click({ button: 'right' });
  await settle(page, 120);
  const state = await page.evaluate(() => {
    const menu = document.querySelector('.rail-context-menu,.overview-context-menu');
    const rect = menu?.getBoundingClientRect();
    const style = menu ? getComputedStyle(menu) : null;
    return {
      hasCard: true,
      visible: Boolean(menu && style?.display !== 'none' && rect && rect.width > 2 && rect.height > 2),
      buttonCount: menu?.querySelectorAll('button').length || 0,
    };
  });
  await page.keyboard.press('Escape').catch(() => {});
  await settle(page, 80);
  return state;
}

async function runPresentContextMenuValidation(page) {
  const kinds = ['outsideStage', 'background', 'text', 'slotInner', 'mediaInner'];
  const targets = {};
  for (const kind of kinds) {
    targets[kind] = await runPresentContextMenuTarget(page, kind);
  }
  return { targets };
}

async function runPresentContextMenuTarget(page, kind) {
  await ensureEditMode(page);
  const target = await preparePresentContextTarget(page, kind);
  if (!target.found) return { kind, found: false };
  await page.locator('#preview-present-btn').click();
  await settle(page, 360);
  const box = await readPresentContextTargetBox(page, kind);
  if (!box.found) {
    await ensureEditMode(page);
    return { kind, found: true, targetVisible: false };
  }
  const before = await currentIndex(page);
  await installContextMenuProbe(page, kind);
  await page.mouse.click(box.x, box.y, { button: 'right' });
  await settle(page, 260);
  const after = await currentIndex(page);
  const probe = await readContextMenuProbe(page);
  await ensureEditMode(page);
  return {
    kind,
    found: true,
    targetVisible: true,
    before,
    after,
    consumedEventsProbe: box.consumedEventsProbe || false,
    contextMenuEvents: probe,
  };
}

async function preparePresentContextTarget(page, kind) {
  const themePacks = await page.evaluate(() => [...new Set([...document.querySelectorAll('#deck > .slide')]
    .map(slide => slide.dataset.themePack || '')
    .filter(Boolean))]);
  if (kind === 'outsideStage' || kind === 'background') {
    const themePack = themePacks[0] || '';
    await page.evaluate(themePack => {
      window.__setActiveThemePack?.(themePack, { navigate: false });
      window.go?.(1, { animate: false, force: true });
    }, themePack);
    await settle(page, 220);
    const found = await page.evaluate(() => Boolean((window.__getVisibleSlides?.() || [])[1]));
    return { kind, found, themePack, index: 1 };
  }

  for (const themePack of themePacks) {
    await page.evaluate(themePack => window.__setActiveThemePack?.(themePack, { navigate: false }), themePack);
    await settle(page, 80);
    const count = await page.evaluate(() => window.__getVisibleSlides?.().length || 0);
    for (let index = 1; index < count; index += 1) {
      await page.evaluate(index => window.go?.(index, { animate: false, force: true }), index);
      await settle(page, 40);
      const target = await readVisiblePresentContextTarget(page, kind);
      if (!target.found) continue;
      return { kind, found: true, themePack, index, ...target };
    }
  }
  return { kind, found: false };
}

async function readVisiblePresentContextTarget(page, kind) {
  return page.evaluate(kind => {
    const selectorMap = {
      text: '[data-editable-id]',
      slotInner: '[data-dashi-host-image-slot],image-slot,.gxn-slot,.pulse-imgframe,.acl-slot,.kx-imgslot,.dslot,.bt-image-slot',
      mediaInner: 'video,iframe,canvas,.bt-unicorn-frame,[data-unicorn-json-file-path],[data-unicorn-project-id]',
    };
    const slide = document.querySelector('#deck > .slide.active');
    const selector = selectorMap[kind] || '';
    const target = [...(slide?.querySelectorAll(selector) || [])].find(element => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 4 && rect.height > 4 && style.display !== 'none' && style.visibility !== 'hidden';
    });
    if (!target) return { found: false };
    return {
      found: true,
      slideId: slide?.dataset.vmSlideId || slide?.dataset.slideId || '',
      targetTag: target.tagName || '',
      targetClass: String(target.className || ''),
    };
  }, kind);
}

async function readPresentContextTargetBox(page, kind) {
  return page.evaluate((kind) => {
    const deck = document.getElementById('deck-viewport');
    const deckRect = deck?.getBoundingClientRect();
    if (kind === 'outsideStage') {
      if (!deckRect) return { found: false };
      const x = deckRect.left > 24 ? Math.max(8, deckRect.left / 2) : Math.min(innerWidth - 8, deckRect.right + Math.max(8, (innerWidth - deckRect.right) / 2));
      const y = Math.min(innerHeight - 8, Math.max(8, deckRect.top + 32));
      return { found: x >= 0 && x <= innerWidth && y >= 0 && y <= innerHeight, x, y };
    }
    const slide = document.querySelector('#deck > .slide.active');
    if (!slide) return { found: false };
    const selectorMap = {
      text: '[data-editable-id]',
      slotInner: '[data-dashi-host-image-slot],image-slot,.gxn-slot,.pulse-imgframe,.acl-slot,.kx-imgslot,.dslot,.bt-image-slot',
      mediaInner: 'video,iframe,canvas,.bt-unicorn-frame,[data-unicorn-json-file-path],[data-unicorn-project-id]',
    };
    let target = kind === 'background' ? slide : [...slide.querySelectorAll(selectorMap[kind] || '')].find(element => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 4 && rect.height > 4 && style.display !== 'none' && style.visibility !== 'hidden';
    });
    if (!target) return { found: false };
    let consumedEventsProbe = false;
    if (kind === 'slotInner' || kind === 'mediaInner') {
      const visibleChildren = [...target.querySelectorAll('*')].filter(child => {
        const rect = child.getBoundingClientRect();
        const style = getComputedStyle(child);
        return rect.width > 4 && rect.height > 4 && style.display !== 'none' && style.visibility !== 'hidden';
      });
      if (visibleChildren.length) target = visibleChildren[visibleChildren.length - 1];
      if (!target.__presentContextConsumedEventsProbe) {
        target.addEventListener('contextmenu', event => event.stopPropagation());
        target.__presentContextConsumedEventsProbe = true;
      }
      consumedEventsProbe = true;
    }
    const rect = target.getBoundingClientRect();
    return {
      found: rect.width > 1 && rect.height > 1,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      consumedEventsProbe,
    };
  }, kind);
}

async function installContextMenuProbe(page, kind) {
  await page.evaluate((kind) => {
    if (window.__presentContextMenuProbeHandler) {
      removeEventListener('contextmenu', window.__presentContextMenuProbeHandler, true);
    }
    window.__presentContextMenuProbe = [];
    window.__presentContextMenuProbeHandler = event => {
      const target = event.target instanceof Element ? event.target : null;
      const entry = {
        kind,
        defaultPreventedAtCapture: event.defaultPrevented,
        defaultPreventedAfterDispatch: null,
        targetTag: target?.tagName || '',
        targetClass: target?.className || '',
      };
      window.__presentContextMenuProbe.push(entry);
      setTimeout(() => {
        entry.defaultPreventedAfterDispatch = event.defaultPrevented;
      }, 0);
    };
    addEventListener('contextmenu', window.__presentContextMenuProbeHandler, true);
  }, kind);
}

async function readContextMenuProbe(page) {
  await page.waitForTimeout(80);
  return page.evaluate(() => {
    if (window.__presentContextMenuProbeHandler) {
      removeEventListener('contextmenu', window.__presentContextMenuProbeHandler, true);
      window.__presentContextMenuProbeHandler = null;
    }
    return window.__presentContextMenuProbe || [];
  });
}

async function ensureEditMode(page) {
  await page.evaluate(() => {
    if (document.fullscreenElement) return document.exitFullscreen();
    if (document.body.dataset.mode === 'present') window.__exitPresentMode?.();
    return null;
  }).catch(() => {});
  await settle(page, 240);
}

async function currentIndex(page) {
  return page.evaluate(() => window.__currentSlideIndex || 0);
}

function validateResult(result) {
  const failures = [];
  if (result.title !== '目录') failures.push(`Left rail title should be "目录", got "${result.title || '(empty)'}".`);

  for (const layout of result.layouts) {
    if (layout.panelOverflow) failures.push(`Layout ${layout.viewportWidth}: right panel overflows viewport.`);
    if (layout.deckOverlapsRail) failures.push(`Layout ${layout.viewportWidth}: deck overlaps left rail.`);
    if (layout.deckOverlapsPanel) failures.push(`Layout ${layout.viewportWidth}: deck overlaps right panel.`);
    if (Math.abs((layout.deckAspect || 0) - 16 / 9) > 0.025) failures.push(`Layout ${layout.viewportWidth}: deck is not 16:9.`);
  }

  if (!result.resize?.hasHandle) failures.push('Left rail is missing a drag resize handle.');
  else {
    if (result.resize.widthDelta < 48) failures.push(`Dragging the rail resize handle should widen the rail, got delta ${result.resize.widthDelta}px.`);
    if (result.resize.shrinkDelta < 48) failures.push(`Dragging the rail resize handle back left should narrow the rail, got delta ${result.resize.shrinkDelta}px.`);
    if (result.resize.after?.deckOverlapsRail || result.resize.after?.deckOverlapsPanel || result.resize.after?.panelOverflow) {
      failures.push(`Widened layout is unstable: ${JSON.stringify(result.resize.after)}`);
    }
    if (result.resize.narrow?.deckOverlapsRail || result.resize.narrow?.deckOverlapsPanel || result.resize.narrow?.panelOverflow) {
      failures.push(`Narrowed layout is unstable: ${JSON.stringify(result.resize.narrow)}`);
    }
    if (result.resize.frameGrowth < 36 || result.resize.contentGrowth < 36) {
      failures.push(`Rail thumbnails should grow with the widened rail: ${JSON.stringify(result.resize)}`);
    }
    if (result.resize.frameShrink < 36 || result.resize.contentShrink < 36) {
      failures.push(`Rail thumbnails should shrink with the narrowed rail: ${JSON.stringify(result.resize)}`);
    }
    for (const [phase, thumbs] of Object.entries({
      initial: result.resize.beforeThumbs,
      widened: result.resize.thumbs,
      narrowed: result.resize.narrowThumbs,
    })) {
      if ((thumbs?.sampleCount || 0) < 3) failures.push(`Rail thumbnail ${phase} sample should include visible cards: ${JSON.stringify(thumbs)}`);
      if ((thumbs?.maxAspectError || 0) > 0.025) failures.push(`Rail thumbnails should stay 16:9 when ${phase}: ${JSON.stringify(thumbs)}`);
      if ((thumbs?.maxRightGap || 0) > 2 || (thumbs?.maxBottomGap || 0) > 2 || (thumbs?.maxWidthMismatch || 0) > 2 || (thumbs?.maxHeightMismatch || 0) > 2) {
        failures.push(`Rail thumbnails should fill the ${phase} frame without blank space or crop: ${JSON.stringify(thumbs)}`);
      }
    }
  }

  for (const [name, state] of Object.entries(result.activeStates || {})) {
    const target = name === 'afterDrag' ? state.after : state;
    if (!target?.found) failures.push(`Active rail state ${name} did not find an active card.`);
    if (target?.activeCardCount !== 1) failures.push(`Active rail state ${name} should have exactly one active card.`);
    if ((target?.backgroundLuminance ?? 1) > 0.25) failures.push(`Active rail card ${name} should use a clear dark background: ${JSON.stringify(target)}`);
    if ((target?.textLuminance ?? 0) < 0.65) failures.push(`Active rail card ${name} should use light/reversed text: ${JSON.stringify(target)}`);
  }

  const color = result.colorControls || {};
  if (!color.found) failures.push('Did not find a visible right-panel color property control.');
  else {
    if (color.minButtonWidth < 36 || color.minButtonHeight < 36) failures.push(`Color swatches should be at least 36px: ${JSON.stringify(color)}`);
    if (color.maxButtonsPerRow > 3) failures.push(`Color swatches should wrap at about three per row: ${JSON.stringify(color.rows)}`);
    if (color.overflowsPanel) failures.push('Color swatch group overflows the right panel.');
    if (!color.hasActive) failures.push('Color swatch group does not expose the active option.');
    if (!color.allHaveLabels) failures.push('Color swatches should keep readable labels for assistive UI/tooltips.');
    if (!hasVisibleState(color.hover) || !hasVisibleState(color.focus)) failures.push(`Color swatches need clear hover/focus state: ${JSON.stringify({ hover: color.hover, focus: color.focus })}`);
  }

  if (result.shadows.railHasLargeCanvasShadow) failures.push(`Left rail still casts a large shadow into the canvas: ${result.shadows.railBoxShadow}`);
  if (result.shadows.panelHasLargeCanvasShadow) failures.push(`Right panel still casts a large shadow into the canvas: ${result.shadows.panelBoxShadow}`);
  if (!result.shadows.railBorderRight || result.shadows.railBorderRight === '0px none rgb(0, 0, 0)') failures.push('Left rail needs a clear boundary after removing shadow.');
  if (!result.shadows.panelBorderLeft || result.shadows.panelBorderLeft === '0px none rgb(0, 0, 0)') failures.push('Right panel needs a clear boundary after removing shadow.');

  const actions = result.actions || {};
  if (actions.closeExists || actions.closeVisible) failures.push(`Right panel header should not show a close icon: ${JSON.stringify(actions)}`);
  if (!actions.presentExists || !actions.exportExists || !actions.resetExists) failures.push('Present, export, and reset buttons must all exist.');
  if (!actions.presentInActions || !actions.exportInActions || !actions.resetInActions || !actions.allThreeSameRow) failures.push(`Present, export, and reset buttons should share the same action row: ${JSON.stringify(actions)}`);
  if (!actions.presentLeftOfExport) failures.push('Present button should be to the left of export.');
  if (!actions.exportLeftOfReset) failures.push('Export button should be to the left of reset.');
  if (actions.buttonOverlap || actions.actionsOverflow || actions.panelOverflow || !actions.labelsFit) failures.push(`Action buttons should not overlap, overflow, or truncate labels: ${JSON.stringify(actions)}`);
  for (const actionLayout of result.actionLayouts || []) {
    if (actionLayout.closeExists || actionLayout.closeVisible) failures.push(`Width ${actionLayout.viewportWidth}: right panel header should not show a close icon.`);
    if (!actionLayout.presentExists || !actionLayout.exportExists || !actionLayout.resetExists) failures.push(`Width ${actionLayout.viewportWidth}: present/export/reset buttons must all exist.`);
    if (!actionLayout.presentInActions || !actionLayout.exportInActions || !actionLayout.resetInActions || !actionLayout.allThreeSameRow) failures.push(`Width ${actionLayout.viewportWidth}: action buttons should be in one row: ${JSON.stringify(actionLayout)}`);
    if (!actionLayout.presentLeftOfExport || !actionLayout.exportLeftOfReset) failures.push(`Width ${actionLayout.viewportWidth}: action button order should be play, export, reset.`);
    if (actionLayout.buttonOverlap || actionLayout.actionsOverflow || actionLayout.panelOverflow || !actionLayout.labelsFit) failures.push(`Width ${actionLayout.viewportWidth}: action buttons should not overlap, overflow, or truncate labels: ${JSON.stringify(actionLayout)}`);
  }
  if (!actions.backgroundsDiffer || !/rgb\(13,\s*153,\s*255\)|rgb\(42,\s*165,\s*255\)/.test(actions.presentBackground)) {
    failures.push(`Present button should use the stronger primary style: ${JSON.stringify(actions)}`);
  }
  if (/rgb\(13,\s*153,\s*255\)|rgb\(42,\s*165,\s*255\)/.test(actions.exportBackground)) {
    failures.push(`Export button should be a secondary action: ${JSON.stringify(actions)}`);
  }
  if (/rgb\(13,\s*153,\s*255\)|rgb\(42,\s*165,\s*255\)/.test(actions.resetBackground)) {
    failures.push(`Reset button should be a secondary action: ${JSON.stringify(actions)}`);
  }
  if (!result.exportMenu?.open || !result.exportMenu?.visible || result.exportMenu?.buttonCount < 3) failures.push(`Export menu should still open: ${JSON.stringify(result.exportMenu)}`);
  if (!result.reset?.clicked || !result.reset?.deckStateCleared || !result.reset?.probeCleared) failures.push(`Reset button should trigger the existing reset flow: ${JSON.stringify(result.reset)}`);
  if (!result.editRailContextMenu?.visible || (result.editRailContextMenu?.buttonCount || 0) < 1) {
    failures.push(`Edit mode rail context menu should still open: ${JSON.stringify(result.editRailContextMenu)}`);
  }
  for (const [kind, target] of Object.entries(result.presentContextMenu?.targets || {})) {
    if (!target.found) {
      failures.push(`Present contextmenu target not found for ${kind}.`);
      continue;
    }
    if (!target.targetVisible) failures.push(`Present contextmenu target ${kind} was not visible.`);
    const prevented = (target.contextMenuEvents || []).some(event => event.defaultPreventedAfterDispatch === true);
    if (!prevented) failures.push(`Present contextmenu on ${kind} should be preventDefault: ${JSON.stringify(target)}`);
    if (kind !== 'outsideStage' && !(target.after < target.before)) {
      failures.push(`Present right-click on ${kind} should keep the previous-page behavior: ${JSON.stringify(target)}`);
    }
  }
  if (result.present?.entered?.mode !== 'present' || !result.present?.entered?.hasFullscreenElement) failures.push(`Present button should enter fullscreen present mode: ${JSON.stringify(result.present)}`);
  if (result.present?.exited?.mode !== 'edit' || result.present?.exited?.hasFullscreenElement) failures.push(`Escape should exit present mode: ${JSON.stringify(result.present)}`);
  return failures;
}

function hasVisibleState(state) {
  if (!state) return false;
  return Boolean(
    state.transform && state.transform !== 'none'
    || state.boxShadow && state.boxShadow !== 'none'
    || state.outline && !/^0px none/.test(state.outline)
  );
}

function rectOf(rect) {
  if (!rect) return null;
  return { left: rect.left, top: rect.top, width: rect.width, height: rect.height, right: rect.right, bottom: rect.bottom };
}

async function settle(page, ms = 180) {
  await page.waitForTimeout(ms);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

function getArg(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : '';
}

async function startPreviewServer() {
  const port = await getFreePort();
  const child = spawn(process.execPath, ['scripts/serve-preview-https.mjs', 'output/theme-preview/ppt', String(port)], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(port), HOST: '0.0.0.0' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout.on('data', chunk => { output += chunk.toString(); });
  child.stderr.on('data', chunk => { output += chunk.toString(); });
  const previewUrl = `https://127.0.0.1:${port}/`;
  await waitForServer(previewUrl, child, () => output);
  return {
    url: previewUrl,
    close: () => new Promise(resolve => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        resolve();
      };
      child.once('exit', finish);
      child.kill('SIGTERM');
      setTimeout(() => {
        if (!done) child.kill('SIGKILL');
        finish();
      }, 1500).unref();
    }),
  };
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '0.0.0.0', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      server.close(() => resolve(port));
    });
  });
}

async function waitForServer(previewUrl, child, getOutput) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`Preview server exited early:\n${getOutput()}`);
    if (await canOpen(previewUrl)) return;
    await new Promise(resolve => setTimeout(resolve, 120));
  }
  throw new Error(`Preview server did not become ready:\n${getOutput()}`);
}

function canOpen(previewUrl) {
  return new Promise(resolve => {
    const req = https.get(previewUrl, { rejectUnauthorized: false }, res => {
      res.resume();
      resolve(Boolean(res.statusCode && res.statusCode < 500));
    });
    req.on('error', () => resolve(false));
    req.setTimeout(800, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function closePage(page) {
  if (!page) return;
  await Promise.race([
    page.close({ runBeforeUnload: false }).catch(() => {}),
    new Promise(resolve => setTimeout(resolve, 2000)),
  ]);
}

async function closeBrowser(browser) {
  const browserProcess = typeof browser.process === 'function' ? browser.process() : null;
  await Promise.race([
    browser.close().catch(() => {}),
    new Promise(resolve => setTimeout(resolve, 4000)),
  ]);
  if (browserProcess && browserProcess.exitCode === null) browserProcess.kill('SIGKILL');
}
