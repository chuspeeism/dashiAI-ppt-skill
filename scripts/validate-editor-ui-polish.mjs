#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import https from 'node:https';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PREVIEW_INDEX = path.join(ROOT, 'output/theme-preview/ppt/index.html');
const TEMPLATE = path.join(ROOT, 'assets/template-swiss.html');
const CHROME_PATH = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const cliUrl = getArg('--url');
const EXPECTED_PANEL_COLLAPSE_ICON = 'assets/ui-icons/sidebar.svg';
const EXPECTED_AUTHOR_LINKS = {
  github: {
    label: 'GitHub',
    icon: 'assets/social-icons/github.svg',
    href: 'https://github.com/jadon7/dashi-ppt-skill',
  },
  douyin: {
    label: '抖音',
    icon: 'assets/social-icons/douyin.svg',
    href: 'https://www.douyin.com/user/MS4wLjABAAAAohe8JB4RvITJitJ69b7cV4NTaYTMYrVI43C-3SUnPPc',
  },
  xiaohongshu: {
    label: '小红书',
    icon: 'assets/social-icons/redbook.svg',
    href: 'https://www.xiaohongshu.com/user/profile/62e0c2bb000000001501408c?xsec_token=ABrZskc1MUcZWWuuMx7Fw52HYKSmhrHM2leT3iiPnMmG8%3D&xsec_source=pc_search',
  },
  bilibili: {
    label: 'Bilibili',
    icon: 'assets/social-icons/bilibili.svg',
    href: 'https://space.bilibili.com/3537118131391269/',
  },
};

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
    themedPropControls: null,
    panelTextControls: null,
    templateTextControlRenderers: readTemplateTextControlRenderers(),
    templatePreviewToggleResidue: readTemplatePreviewToggleResidue(),
    previewToggle: null,
    theme03GlobalDark: null,
    railGutterBalance: null,
    railProgrammaticThumbs: null,
    railFocusScroll: null,
    railManualScroll: null,
    panelCollapse: null,
    authorLinks: null,
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
  result.previewToggle = await readPreviewToggleState(page);
  result.panelCollapse = await runPanelCollapseValidation(page);
  result.authorLinks = await runAuthorLinksValidation(page);

  result.resize = await runRailResizeValidation(page);
  result.activeStates.initial = await readActiveRailStyle(page);
  await page.keyboard.press('ArrowDown');
  await settle(page);
  result.activeStates.afterKeyboard = await readActiveRailStyle(page);
  await clickRailCard(page, 3);
  result.activeStates.afterRailClick = await readActiveRailStyle(page);
  result.activeStates.afterDrag = await runActiveDragValidation(page);
  result.colorControls = await findAndReadColorControls(page);
  result.themedPropControls = await runThemedPropControlValidation(page);
  result.panelTextControls = await runPanelTextControlValidation(page);
  result.theme03GlobalDark = await runTheme03GlobalDarkValidation(page);
  result.railGutterBalance = await readRailGutterBalance(page);
  result.railProgrammaticThumbs = await runRailProgrammaticThumbValidation(page);
  result.railFocusScroll = await runRailFocusScrollValidation(page);
  result.railManualScroll = await runRailManualScrollValidation(page);
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

async function runPanelCollapseValidation(page) {
  await ensureEditMode(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await settle(page);
  await page.evaluate(() => {
    window.__setActiveThemePack?.('theme02', { navigate: false });
    window.go?.(2, { animate: false, force: true });
  });
  await settle(page, 260);
  const before = await readPanelCollapseState(page, 'before');
  const button = page.locator('#preview-panel-collapse').first();
  if (!(await button.count())) return { hasButton: false, before };
  await button.click();
  await settle(page, 320);
  const collapsed = await readPanelCollapseState(page, 'collapsed');
  await button.click();
  await settle(page, 340);
  const restored = await readPanelCollapseState(page, 'restored');
  return {
    hasButton: true,
    before,
    collapsed,
    restored,
    indexPreserved: before.currentIndex === restored.currentIndex,
    activeRailPreserved: before.activeRailIndex === restored.activeRailIndex,
    propControlsPreserved: before.propControlCount === restored.propControlCount,
  };
}

async function readPanelCollapseState(page, phase) {
  return page.evaluate(async ({ phase, expectedIcon }) => {
    const rail = document.getElementById('slide-rail');
    const panel = document.getElementById('preview-panel');
    const deck = document.getElementById('deck-viewport');
    const button = document.getElementById('preview-panel-collapse');
    const activeRail = document.querySelector('[data-rail-card="true"][aria-current="true"],[data-slide-rail-card="true"][aria-current="true"]');
    const deckRect = deck?.getBoundingClientRect();
    const buttonRect = button?.getBoundingClientRect();
    const buttonStyle = button ? getComputedStyle(button) : null;
    const buttonSvg = button?.querySelector('svg');
    const buttonIcon = button?.querySelector('img[data-ui-icon="sidebar-collapse"]');
    const buttonIconStyle = buttonIcon ? getComputedStyle(buttonIcon) : null;
    const iconRect = buttonIcon?.getBoundingClientRect();
    const iconSrc = buttonIcon?.getAttribute('src') || '';
    const iconAbsoluteSrc = buttonIcon?.src || '';
    return {
      phase,
      mode: document.body.dataset.mode || '',
      collapsedClass: document.body.classList.contains('editor-panels-collapsed'),
      panelOpenClass: document.body.classList.contains('preview-panel-open'),
      railVisible: isVisible(rail),
      panelVisible: isVisible(panel),
      deckVisible: isVisible(deck),
      deckRect: rectOf(deckRect),
      deckAspect: deckRect ? deckRect.width / deckRect.height : 0,
      currentIndex: window.__currentSlideIndex || 0,
      activeRailIndex: Number(activeRail?.dataset.index || -1),
      propControlCount: panel?.querySelectorAll('#preview-props input,#preview-props button,#preview-props select,#preview-props textarea').length || 0,
      editableCount: document.querySelectorAll('#deck > .slide.active [contenteditable="true"]').length,
      canEdit: Boolean(window.__canEditDeck?.()),
      buttonVisible: isVisible(button),
      buttonHasIcon: Boolean(buttonSvg || buttonIcon),
      buttonHasInlineSvg: Boolean(buttonSvg),
      buttonHasAssetIcon: Boolean(buttonIcon),
      buttonIconAttr: buttonIcon?.dataset.uiIcon || '',
      buttonIconSrc: iconSrc,
      buttonIconSrcMatches: iconSrc === expectedIcon,
      buttonIconComplete: Boolean(buttonIcon?.complete),
      buttonIconNaturalWidth: buttonIcon?.naturalWidth || 0,
      buttonIconNaturalHeight: buttonIcon?.naturalHeight || 0,
      buttonIconFetchOk: iconAbsoluteSrc ? await fetch(iconAbsoluteSrc).then(response => response.ok).catch(() => false) : false,
      buttonIconVisible: isVisible(buttonIcon),
      buttonIconRect: rectOf(iconRect),
      buttonAriaLabel: button?.getAttribute('aria-label') || '',
      buttonTitle: button?.getAttribute('title') || '',
      buttonExpanded: button?.getAttribute('aria-expanded') || '',
      buttonRect: rectOf(buttonRect),
      buttonInViewport: Boolean(buttonRect && buttonRect.left >= -1 && buttonRect.top >= -1 && buttonRect.right <= innerWidth + 1 && buttonRect.bottom <= innerHeight + 1),
      buttonOverlapsDeck: Boolean(buttonRect && deckRect && buttonRect.left < deckRect.right - 1 && buttonRect.right > deckRect.left + 1 && buttonRect.top < deckRect.bottom - 1 && buttonRect.bottom > deckRect.top + 1),
      buttonDisplay: buttonStyle?.display || '',
      buttonBackground: buttonStyle?.backgroundColor || '',
      buttonIconFilter: buttonIconStyle?.filter || '',
      buttonIconOpacity: buttonIconStyle?.opacity || '',
      buttonIconTransform: buttonIconStyle?.transform || '',
    };

    function isVisible(el) {
      if (!el) return false;
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 2 && rect.height > 2;
    }

    function rectOf(rect) {
      if (!rect) return null;
      return { left: rect.left, top: rect.top, width: rect.width, height: rect.height, right: rect.right, bottom: rect.bottom };
    }
  }, { phase, expectedIcon: EXPECTED_PANEL_COLLAPSE_ICON });
}

async function runAuthorLinksValidation(page) {
  await ensureEditMode(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await settle(page);
  const before = await readAuthorLinks(page, EXPECTED_AUTHOR_LINKS);
  await page.locator('#preview-panel-collapse').click();
  await settle(page, 220);
  await page.locator('#preview-panel-collapse').click();
  await settle(page, 260);
  const afterRestore = await readAuthorLinks(page, EXPECTED_AUTHOR_LINKS);
  return {
    expected: EXPECTED_AUTHOR_LINKS,
    before,
    afterRestore,
    restoredMatches: JSON.stringify(before.links) === JSON.stringify(afterRestore.links),
  };
}

async function readAuthorLinks(page, expected) {
  return page.evaluate(async (expected) => {
    const container = document.querySelector('.preview-author-links');
    const links = {};
    for (const [platform, config] of Object.entries(expected)) {
      const anchor = container?.querySelector(`a[data-platform="${platform}"]`);
      const img = anchor?.querySelector('img[data-social-icon]');
      const svg = anchor?.querySelector(':scope > svg');
      const rect = anchor?.getBoundingClientRect();
      const imgRect = img?.getBoundingClientRect();
      const href = anchor?.getAttribute('href') || '';
      const src = img?.getAttribute('src') || '';
      const absoluteSrc = img?.src || '';
      links[platform] = {
        exists: Boolean(anchor),
        href,
        label: anchor?.getAttribute('aria-label') || anchor?.getAttribute('title') || '',
        hasInlineSvg: Boolean(svg),
        hasImg: Boolean(img),
        iconAttr: img?.dataset.socialIcon || '',
        src,
        srcMatches: src === config.icon,
        complete: Boolean(img?.complete),
        naturalWidth: img?.naturalWidth || 0,
        naturalHeight: img?.naturalHeight || 0,
        fetchOk: absoluteSrc ? await fetch(absoluteSrc).then(response => response.ok).catch(() => false) : false,
        rect: rectOf(rect),
        imgRect: rectOf(imgRect),
        iconFitsAnchor: Boolean(rect && imgRect && imgRect.left >= rect.left - 1 && imgRect.right <= rect.right + 1 && imgRect.top >= rect.top - 1 && imgRect.bottom <= rect.bottom + 1),
      };
    }
    return {
      visible: isVisible(container),
      linkCount: container?.querySelectorAll('a[data-platform]').length || 0,
      links,
    };

    function isVisible(el) {
      if (!el) return false;
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 2 && rect.height > 2;
    }

    function rectOf(rect) {
      if (!rect) return null;
      return { left: rect.left, top: rect.top, width: rect.width, height: rect.height, right: rect.right, bottom: rect.bottom };
    }
  }, expected);
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

async function runThemedPropControlValidation(page) {
  return {
    theme02Scheme: await findThemedPropControl(page, { theme: 'theme02', label: '配色方案' }),
    theme03Accent: await findThemedPropControl(page, { theme: 'theme03', label: '强调色' }),
    theme04AccentTone: await findThemedPropControl(page, { theme: 'theme04', label: '主色调' }),
  };
}

async function findThemedPropControl(page, { theme, label }) {
  const hasTheme = await page.evaluate(theme => Boolean(document.querySelector(`#preview-theme-pack option[value="${theme}"]:not(:disabled)`)), theme);
  if (!hasTheme) return { found: false, theme, label, reason: 'theme not available' };
  await page.selectOption('#preview-theme-pack', theme).catch(() => {});
  await settle(page, 260);
  const count = await page.evaluate(() => window.__getVisibleSlides?.().length || document.querySelectorAll('#deck > .slide:not([hidden])').length);
  for (let index = 0; index < count; index += 1) {
    await page.evaluate(targetIndex => window.go?.(targetIndex, { animate: false, force: true }), index);
    await settle(page, 140);
    const control = await readPropControl(page, label);
    if (control.found) return { ...control, theme, label, index };
  }
  return { found: false, theme, label, scanned: count };
}

async function readPropControl(page, label) {
  return page.evaluate(label => {
    const rows = [...document.querySelectorAll('#preview-props .preview-prop-row')];
    const row = rows.find(item => {
      const labelEl = item.querySelector(':scope > span');
      return (labelEl?.textContent || '').trim() === label;
    });
    if (!row) return { found: false };
    const group = row.querySelector('.preview-prop-choice-group');
    const buttons = [...(group?.querySelectorAll('.preview-prop-choice') || [])];
    const groupRect = group?.getBoundingClientRect();
    const rowsByTop = [...buttons.reduce((map, button) => {
      const rect = button.getBoundingClientRect();
      const top = Math.round(rect.top);
      if (!map.has(top)) map.set(top, []);
      map.get(top).push({
        width: rect.width,
        height: rect.height,
        text: (button.textContent || '').trim(),
        label: button.getAttribute('aria-label') || button.title || '',
        active: button.classList.contains('is-active') || button.getAttribute('aria-pressed') === 'true',
        background: getComputedStyle(button).backgroundColor,
      });
      return map;
    }, new Map()).values()];
    return {
      found: true,
      rowClass: row.className,
      hasChoiceGroup: Boolean(group),
      isColor: Boolean(group?.classList.contains('is-color')),
      buttonCount: buttons.length,
      maxButtonsPerRow: rowsByTop.reduce((max, items) => Math.max(max, items.length), 0),
      minButtonWidth: rowsByTop.flat().reduce((min, item) => Math.min(min, item.width), Infinity),
      minButtonHeight: rowsByTop.flat().reduce((min, item) => Math.min(min, item.height), Infinity),
      hasActive: rowsByTop.flat().some(item => item.active),
      allHaveLabels: rowsByTop.flat().every(item => item.label),
      hasVisibleTextButtons: rowsByTop.flat().some(item => item.text.length > 0),
      groupRect: rectOf(groupRect),
      rows: rowsByTop,
    };

    function rectOf(rect) {
      if (!rect) return null;
      return { left: rect.left, top: rect.top, width: rect.width, height: rect.height, right: rect.right, bottom: rect.bottom };
    }
  }, label);
}

async function runTheme03GlobalDarkValidation(page) {
  const first = await findThemedPropControl(page, { theme: 'theme03', label: '全局深色' });
  if (!first.found) return { found: false, first };
  await setTheme03DarkSwitch(page, true);
  await setTheme03DarkSwitch(page, false);
  const current = await readTheme03DarkSwitch(page);
  const count = await page.evaluate(() => window.__getVisibleSlides?.().length || 0);
  const targetIndex = Math.min(count - 1, first.index + 1);
  await page.evaluate(targetIndex => window.go?.(targetIndex, { animate: false, force: true }), targetIndex);
  await settle(page, 260);
  const next = await readTheme03DarkSwitch(page);
  const global = await page.evaluate(() => ({
    bodyDark: document.body.classList.contains('rd-force-dark'),
    storedTheme: localStorage.getItem('rd-theme'),
  }));
  return {
    found: true,
    firstIndex: first.index,
    nextIndex: targetIndex,
    expectedChecked: false,
    current,
    next,
    global,
  };
}

async function runPanelTextControlValidation(page) {
  await ensureEditMode(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await settle(page);
  const themeKeys = await page.evaluate(() => [...document.querySelectorAll('#preview-theme-pack option:not(:disabled)')]
    .map(option => option.value)
    .filter(Boolean));
  const targets = themeKeys.length ? themeKeys : [''];
  const textMatches = [];
  const scannedSamples = [];
  const nonTextControls = {
    range: 0,
    toggle: 0,
    choice: 0,
    iconChoice: 0,
    imagePicker: 0,
    filePicker: 0,
  };
  let scannedCount = 0;

  for (const theme of targets) {
    if (theme) await page.selectOption('#preview-theme-pack', theme).catch(() => {});
    await settle(page, 260);
    const count = await page.evaluate(() => window.__getVisibleSlides?.().length || document.querySelectorAll('#deck > .slide:not([hidden])').length);
    for (const index of panelTextControlScanIndices(count)) {
      await page.evaluate(targetIndex => window.go?.(targetIndex, { animate: false, force: true }), index);
      await settle(page, 45);
      const state = await readPanelTextControlState(page, { theme, index });
      scannedCount += 1;
      if (scannedSamples.length < 12) scannedSamples.push({
        theme: state.theme,
        index: state.index,
        slideId: state.slideId,
        label: state.label,
        propRows: state.propRows,
        nonTextTotal: Object.values(state.nonTextControls).reduce((sum, value) => sum + value, 0),
      });
      for (const [key, value] of Object.entries(state.nonTextControls)) {
        nonTextControls[key] += value;
      }
      if (state.textElements.length) {
        textMatches.push({
          theme: state.theme,
          index: state.index,
          slideId: state.slideId,
          label: state.label,
          propRows: state.propRows,
          textElements: state.textElements,
        });
      }
    }
  }

  return {
    themes: targets,
    scannedCount,
    scannedSamples,
    textMatchCount: textMatches.reduce((sum, item) => sum + item.textElements.length, 0),
    textMatches: textMatches.slice(0, 12),
    nonTextControls,
    hasNonTextControl: Object.values(nonTextControls).some(value => value > 0),
  };
}

function panelTextControlScanIndices(count) {
  const max = Math.max(0, Number(count) || 0);
  if (!max) return [];
  return [...new Set([
    0,
    1,
    2,
    3,
    Math.floor(max * 0.25),
    Math.floor(max * 0.5),
    Math.floor(max * 0.75),
    max - 4,
    max - 3,
    max - 2,
    max - 1,
  ].filter(index => index >= 0 && index < max))];
}

function readTemplateTextControlRenderers() {
  const source = readFileSync(TEMPLATE, 'utf8');
  const markers = [
    '.pp-text{',
    '.pp-textarea{',
    '.pp-json{',
    "input.className = controlType === 'textarea' ? 'pp-textarea' : 'pp-text'",
    "textarea.className = 'pp-json'",
  ];
  const matches = markers.filter(marker => source.includes(marker));
  return {
    checkedFile: path.relative(ROOT, TEMPLATE),
    matches,
    matchCount: matches.length,
  };
}

function readTemplatePreviewToggleResidue() {
  const source = readFileSync(TEMPLATE, 'utf8');
  const markers = [
    '#preview-toggle',
    'id="preview-toggle"',
    "document.getElementById('preview-toggle')",
    "toggle.addEventListener('click'",
    '打开控制台',
  ];
  const matches = markers.filter(marker => source.includes(marker));
  return {
    checkedFile: path.relative(ROOT, TEMPLATE),
    matches,
    matchCount: matches.length,
  };
}

async function readPreviewToggleState(page) {
  return page.evaluate(() => {
    const toggle = document.getElementById('preview-toggle');
    if (!toggle) return { exists: false };
    const rect = toggle.getBoundingClientRect();
    const style = getComputedStyle(toggle);
    return {
      exists: true,
      visible: style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0.01 && rect.width > 2 && rect.height > 2,
      ariaLabel: toggle.getAttribute('aria-label') || '',
      title: toggle.getAttribute('title') || '',
      hasInlineSvg: Boolean(toggle.querySelector('svg')),
      rect: rectOf(rect),
      background: style.backgroundColor,
      color: style.color,
      borderRadius: style.borderRadius,
      opacity: style.opacity,
      pointerEvents: style.pointerEvents,
    };

    function rectOf(targetRect) {
      return { left: targetRect.left, top: targetRect.top, width: targetRect.width, height: targetRect.height, right: targetRect.right, bottom: targetRect.bottom };
    }
  });
}

async function readPanelTextControlState(page, location) {
  return page.evaluate(({ theme, index }) => {
    const panel = document.getElementById('preview-panel');
    const props = document.getElementById('preview-props');
    const slide = window.__getVisibleSlides?.()[window.__currentSlideIndex || 0] || document.querySelector('#deck > .slide[data-deck-active]');
    const textElements = [...(props?.querySelectorAll('input[type="text"],textarea,[role="textbox"],.pp-text,.pp-textarea,.pp-json') || [])]
      .map(element => {
        const row = element.closest('.preview-prop-row');
        return {
          tag: element.tagName.toLowerCase(),
          type: element.getAttribute('type') || '',
          role: element.getAttribute('role') || '',
          className: element.className || '',
          label: (row?.querySelector(':scope > span')?.textContent || '').trim(),
        };
      });
    const nonTextControls = {
      range: props?.querySelectorAll('input[type="range"],.pp-slider').length || 0,
      toggle: props?.querySelectorAll('input[type="checkbox"],.pp-switch').length || 0,
      choice: props?.querySelectorAll('.preview-prop-choice').length || 0,
      iconChoice: props?.querySelectorAll('.preview-prop-icon-choice').length || 0,
      imagePicker: props?.querySelectorAll('.pp-image-preview,.pp-image-slot-btn').length || 0,
      filePicker: props?.querySelectorAll('input[type="file"]').length || 0,
    };
    return {
      theme: theme || slide?.dataset.themePack || '',
      index,
      slideId: slide?.dataset.vmSlideId || '',
      label: slide?.dataset.label || '',
      panelExists: Boolean(panel),
      propsExists: Boolean(props),
      propRows: props?.querySelectorAll('.preview-prop-row').length || 0,
      textElements,
      nonTextControls,
    };
  }, location);
}

async function readTheme03DarkSwitch(page) {
  return page.evaluate(() => {
    const rows = [...document.querySelectorAll('#preview-props .preview-prop-row')];
    const row = rows.find(item => (item.querySelector(':scope > span')?.textContent || '').trim() === '全局深色');
    const input = row?.querySelector('input[type="checkbox"]');
    const slide = window.__getVisibleSlides?.()[window.__currentSlideIndex || 0] || document.querySelector('#deck > .slide[data-deck-active]');
    return {
      found: Boolean(input),
      checked: Boolean(input?.checked),
      index: window.__currentSlideIndex || 0,
      slideId: slide?.dataset.vmSlideId || '',
      themePack: slide?.dataset.themePack || '',
    };
  });
}

async function setTheme03DarkSwitch(page, checked) {
  for (let attempts = 0; attempts < 3; attempts += 1) {
    const state = await readTheme03DarkSwitch(page);
    if (!state.found) return state;
    if (state.checked === checked) return state;
    await page.locator('#preview-props .preview-prop-row', { hasText: '全局深色' }).locator('.pp-switch').click();
    await settle(page, 340);
  }
  return readTheme03DarkSwitch(page);
}

async function readRailGutterBalance(page) {
  await ensureEditMode(page);
  await page.evaluate(() => {
    window.__setActiveThemePack?.('theme02', { navigate: false });
    window.go?.(0, { animate: false, force: true });
    window.__refreshRailCatalog?.();
  });
  await settle(page, 420);
  return page.evaluate(() => {
    const scroller = document.querySelector('[data-rail-scroll="true"],#slide-rail-list');
    const railRect = scroller?.getBoundingClientRect();
    const card = [...document.querySelectorAll('[data-rail-card="true"],[data-slide-rail-card="true"]')]
      .find(item => {
        const rect = item.getBoundingClientRect();
        return railRect && rect.bottom > railRect.top + 1 && rect.top < railRect.bottom - 1;
      });
    const frame = card?.querySelector('[data-rail-frame="true"],[data-overview-frame="true"]');
    const frameRect = frame?.getBoundingClientRect();
    const scrollbarWidth = scroller ? scroller.offsetWidth - scroller.clientWidth : 0;
    const leftGap = railRect && frameRect ? frameRect.left - railRect.left : 0;
    const rightGap = railRect && frameRect ? railRect.right - frameRect.right : 0;
    return {
      found: Boolean(scroller && card && frame),
      scrollbarWidth,
      leftGap,
      rightGap,
      difference: Math.abs(leftGap - rightGap),
      railRect: rectOf(railRect),
      frameRect: rectOf(frameRect),
    };

    function rectOf(rect) {
      if (!rect) return null;
      return { left: rect.left, top: rect.top, width: rect.width, height: rect.height, right: rect.right, bottom: rect.bottom };
    }
  });
}

async function runRailFocusScrollValidation(page) {
  await ensureEditMode(page);
  await page.evaluate(() => {
    window.__setActiveThemePack?.('theme02', { navigate: false });
    window.go?.(0, { animate: false, force: true });
    window.__refreshRailCatalog?.();
    const scroller = document.querySelector('[data-rail-scroll="true"],#slide-rail-list');
    if (scroller) scroller.scrollTop = 0;
  });
  await settle(page, 260);
  const before = await readActiveRailVisibility(page);
  for (let i = 0; i < 24; i += 1) {
    await page.keyboard.press('ArrowDown');
    await settle(page, 70);
  }
  await settle(page, 420);
  const after = await readActiveRailVisibility(page);
  return { before, after };
}

async function runRailProgrammaticThumbValidation(page) {
  return {
    keyboard: await runRailProgrammaticThumbScenario(page, { kind: 'keyboard', preferredIndex: 32 }),
    presentReturn: await runRailProgrammaticThumbScenario(page, { kind: 'presentReturn', preferredIndex: 40 }),
  };
}

async function runRailProgrammaticThumbScenario(page, { kind, preferredIndex }) {
  await prepareRailProgrammaticThumbScenario(page);
  const targetIndex = await chooseUnrenderedRailTarget(page, preferredIndex);
  const before = await readRailThumbState(page, targetIndex);
  await page.evaluate(() => window.__resetOverviewPerfMarks?.());
  if (kind === 'keyboard') {
    for (let index = 0; index < targetIndex; index += 1) {
      await page.keyboard.press('ArrowDown');
      await settle(page, 55);
    }
  } else {
    await page.locator('#preview-present-btn').click();
    await settle(page, 360);
    await page.evaluate(targetIndex => window.go?.(targetIndex, { animate: false, force: true }), targetIndex);
    await settle(page, 220);
    await ensureEditMode(page);
  }
  const visible = await readActiveRailThumbState(page);
  const after = await waitForActiveRailThumbRendered(page);
  return { kind, targetIndex, before, visible, after };
}

async function prepareRailProgrammaticThumbScenario(page) {
  await ensureEditMode(page);
  await page.evaluate(() => {
    window.__setActiveThemePack?.('theme02', { navigate: false });
    window.go?.(0, { animate: false, force: true });
    window.__refreshRailCatalog?.();
    const scroller = document.querySelector('[data-rail-scroll="true"],#slide-rail-list');
    if (scroller) scroller.scrollTop = 0;
  });
  await settle(page, 420);
}

async function chooseUnrenderedRailTarget(page, preferredIndex) {
  return page.evaluate(preferredIndex => {
    const cards = [...document.querySelectorAll('[data-rail-card="true"],[data-slide-rail-card="true"]')];
    if (!cards.length) return 0;
    const preferred = Math.max(1, Math.min(cards.length - 1, preferredIndex));
    const candidates = [];
    for (let index = preferred; index < cards.length; index += 1) candidates.push(cards[index]);
    for (let index = preferred - 1; index >= 1; index -= 1) candidates.push(cards[index]);
    const unrendered = candidates.find(card => card.querySelector('[data-overview-thumb="true"],[data-rail-thumb="true"]')?.dataset.overviewRendered !== 'true');
    return Number((unrendered || cards[preferred]).dataset.index || preferred);
  }, preferredIndex);
}

async function waitForActiveRailThumbRendered(page, timeoutMs = 4500) {
  const startedAt = Date.now();
  let state = await readActiveRailThumbState(page);
  while (Date.now() - startedAt < timeoutMs) {
    if (state.found && state.visible && state.rendered && state.queueTriggered) break;
    await settle(page, 180);
    state = await readActiveRailThumbState(page);
  }
  return { ...state, waitedMs: Date.now() - startedAt };
}

async function readRailThumbState(page, index) {
  return page.evaluate(index => {
    const card = document.querySelector(`[data-rail-card="true"][data-index="${index}"],[data-slide-rail-card="true"][data-index="${index}"]`);
    return readThumbState(card);

    function readThumbState(card) {
      const scroller = document.querySelector('[data-rail-scroll="true"],#slide-rail-list');
      const railRect = scroller?.getBoundingClientRect();
      const cardRect = card?.getBoundingClientRect();
      const wrap = card?.querySelector('[data-overview-thumb="true"],[data-rail-thumb="true"]');
      const perf = window.__getRailPerfState?.() || window.__getOverviewPerfState?.() || {};
      const stages = perf.marks?.stages || [];
      const queueStages = stages.filter(stage => stage.type === 'queue-nearby-overview-thumbs');
      const thumbStages = stages.filter(stage => /dom-preview-thumbnail|dom-cache-restore|overview-thumb-task/.test(stage.type || ''));
      return {
        found: Boolean(card && wrap),
        index: Number(card?.dataset.index || -1),
        currentIndex: window.__currentSlideIndex || 0,
        slideId: card?.dataset.slideId || card?.dataset.slideKey || '',
        visible: Boolean(railRect && cardRect && cardRect.top >= railRect.top + 4 && cardRect.bottom <= railRect.bottom - 4),
        rendered: wrap?.dataset.overviewRendered === 'true',
        queued: wrap?.dataset.overviewQueued === 'true',
        placeholder: Boolean(wrap?.querySelector('[data-overview-placeholder="true"]')),
        scrollTop: scroller?.scrollTop || 0,
        queueTriggered: queueStages.length > 0,
        queueStageCount: queueStages.length,
        thumbStageCount: thumbStages.length,
        visibleRenderedCount: perf.visibleRenderedCount ?? null,
        visibleMissingCount: perf.visibleMissingCount ?? null,
        queuedKeys: perf.queuedKeys || [],
      };
    }
  }, index);
}

async function readActiveRailThumbState(page) {
  return page.evaluate(() => {
    const cards = [...document.querySelectorAll('[data-rail-card="true"],[data-slide-rail-card="true"]')];
    const active = cards.find(card => card.dataset.railActive === 'true' || card.getAttribute('aria-current') === 'true');
    return readThumbState(active);

    function readThumbState(card) {
      const scroller = document.querySelector('[data-rail-scroll="true"],#slide-rail-list');
      const railRect = scroller?.getBoundingClientRect();
      const cardRect = card?.getBoundingClientRect();
      const wrap = card?.querySelector('[data-overview-thumb="true"],[data-rail-thumb="true"]');
      const perf = window.__getRailPerfState?.() || window.__getOverviewPerfState?.() || {};
      const stages = perf.marks?.stages || [];
      const queueStages = stages.filter(stage => stage.type === 'queue-nearby-overview-thumbs');
      const thumbStages = stages.filter(stage => /dom-preview-thumbnail|dom-cache-restore|overview-thumb-task/.test(stage.type || ''));
      return {
        found: Boolean(card && wrap),
        index: Number(card?.dataset.index || -1),
        currentIndex: window.__currentSlideIndex || 0,
        slideId: card?.dataset.slideId || card?.dataset.slideKey || '',
        visible: Boolean(railRect && cardRect && cardRect.top >= railRect.top + 4 && cardRect.bottom <= railRect.bottom - 4),
        rendered: wrap?.dataset.overviewRendered === 'true',
        queued: wrap?.dataset.overviewQueued === 'true',
        placeholder: Boolean(wrap?.querySelector('[data-overview-placeholder="true"]')),
        scrollTop: scroller?.scrollTop || 0,
        queueTriggered: queueStages.length > 0,
        queueStageCount: queueStages.length,
        thumbStageCount: thumbStages.length,
        visibleRenderedCount: perf.visibleRenderedCount ?? null,
        visibleMissingCount: perf.visibleMissingCount ?? null,
        queuedKeys: perf.queuedKeys || [],
      };
    }
  });
}

async function runRailManualScrollValidation(page) {
  await ensureEditMode(page);
  await page.evaluate(() => {
    window.__setActiveThemePack?.('theme02', { navigate: false });
    window.go?.(0, { animate: false, force: true });
    window.__refreshRailCatalog?.();
  });
  await settle(page, 300);
  const before = await page.evaluate(() => {
    const scroller = document.querySelector('[data-rail-scroll="true"],#slide-rail-list');
    if (!scroller) return { found: false };
    scroller.scrollTop = Math.min(scroller.scrollHeight - scroller.clientHeight, 720);
    return {
      found: true,
      scrollTop: scroller.scrollTop,
      scrollHeight: scroller.scrollHeight,
      clientHeight: scroller.clientHeight,
    };
  });
  await settle(page, 220);
  await page.evaluate(() => window.__refreshRailCatalog?.());
  await settle(page, 460);
  const after = await page.evaluate(() => {
    const scroller = document.querySelector('[data-rail-scroll="true"],#slide-rail-list');
    return {
      found: Boolean(scroller),
      scrollTop: scroller?.scrollTop || 0,
      scrollHeight: scroller?.scrollHeight || 0,
      clientHeight: scroller?.clientHeight || 0,
    };
  });
  return { before, after, delta: Math.abs((after.scrollTop || 0) - (before.scrollTop || 0)) };
}

async function readActiveRailVisibility(page) {
  return page.evaluate(() => {
    const scroller = document.querySelector('[data-rail-scroll="true"],#slide-rail-list');
    const railRect = scroller?.getBoundingClientRect();
    const cards = [...document.querySelectorAll('[data-rail-card="true"],[data-slide-rail-card="true"]')];
    const active = cards.find(card => card.dataset.railActive === 'true' || card.getAttribute('aria-current') === 'true');
    const activeRect = active?.getBoundingClientRect();
    return {
      found: Boolean(scroller && active),
      index: Number(active?.dataset.index || -1),
      currentIndex: window.__currentSlideIndex || 0,
      scrollTop: scroller?.scrollTop || 0,
      visible: Boolean(railRect && activeRect && activeRect.top >= railRect.top + 4 && activeRect.bottom <= railRect.bottom - 4),
      railRect: rectOf(railRect),
      activeRect: rectOf(activeRect),
    };

    function rectOf(rect) {
      if (!rect) return null;
      return { left: rect.left, top: rect.top, width: rect.width, height: rect.height, right: rect.right, bottom: rect.bottom };
    }
  });
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
    const actions = document.querySelector('.preview-actions') || document.querySelector('.pp-topbar-actions');
    const isTopbarActions = actions?.classList.contains('pp-topbar-actions') || false;
    const panel = document.getElementById('preview-panel');
    const topbar = document.getElementById('deck-topbar');
    const close = document.getElementById('preview-close');
    const present = document.getElementById('preview-present-btn');
    const exportButton = document.getElementById('preview-export-main');
    const exportWrap = document.getElementById('preview-export-wrap');
    const reset = document.getElementById('preview-reset');
    const actionsRect = actions?.getBoundingClientRect();
    const panelRect = panel?.getBoundingClientRect();
    const topbarRect = topbar?.getBoundingClientRect();
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
      topbarRect: rectOf(topbarRect),
      actionContainer: isTopbarActions ? 'topbar' : 'panel',
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
      panelOverflow: Boolean((isTopbarActions ? topbarRect : panelRect) && buttonRects.some(rect => rect.left < (isTopbarActions ? topbarRect : panelRect).left - 1 || rect.right > (isTopbarActions ? topbarRect : panelRect).right + 1)),
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

  for (const [name, control] of Object.entries(result.themedPropControls || {})) {
    if (!control?.found) {
      failures.push(`${name} property control was not found: ${JSON.stringify(control)}`);
      continue;
    }
    if (!control.isColor) failures.push(`${name} should render as a color swatch group, got ${JSON.stringify(control)}`);
    if (control.minButtonWidth < 36 || control.minButtonHeight < 36) failures.push(`${name} swatches should keep large click targets: ${JSON.stringify(control)}`);
    if (control.maxButtonsPerRow > 3) failures.push(`${name} swatches should wrap at about three per row: ${JSON.stringify(control.rows)}`);
    if (!control.hasActive) failures.push(`${name} should expose the selected swatch: ${JSON.stringify(control)}`);
    if (!control.allHaveLabels) failures.push(`${name} swatches should keep accessible labels/tooltips: ${JSON.stringify(control)}`);
    if (control.hasVisibleTextButtons) failures.push(`${name} should use swatches, not visible text choice buttons: ${JSON.stringify(control)}`);
  }

  const panelText = result.panelTextControls || {};
  if ((panelText.textMatchCount || 0) > 0) {
    failures.push(`Right panel property controls should not render text-like inputs: ${JSON.stringify(panelText)}`);
  }
  if (!panelText.hasNonTextControl) {
    failures.push(`Right panel property controls should keep non-text controls available: ${JSON.stringify(panelText)}`);
  }
  if ((result.templateTextControlRenderers?.matchCount || 0) > 0) {
    failures.push(`Swiss template should not keep right-panel text editor renderers: ${JSON.stringify(result.templateTextControlRenderers)}`);
  }
  if ((result.templatePreviewToggleResidue?.matchCount || 0) > 0) {
    failures.push(`Swiss template should not keep stale #preview-toggle residue: ${JSON.stringify(result.templatePreviewToggleResidue)}`);
  }
  if (result.previewToggle?.exists) {
    failures.push(`Preview should not render the stale #preview-toggle sliders button: ${JSON.stringify(result.previewToggle)}`);
  }

  const dark = result.theme03GlobalDark || {};
  if (!dark.found) failures.push(`Theme03 global dark control was not found: ${JSON.stringify(dark)}`);
  else {
    if (!dark.current?.found || !dark.next?.found) failures.push(`Theme03 global dark switch should exist on both pages: ${JSON.stringify(dark)}`);
    if (dark.current?.checked !== dark.expectedChecked || dark.next?.checked !== dark.expectedChecked) {
      failures.push(`Theme03 global dark switch should stay synchronized across pages: ${JSON.stringify(dark)}`);
    }
    if (dark.global?.bodyDark !== dark.expectedChecked || dark.global?.storedTheme !== 'light') {
      failures.push(`Theme03 global dark visual/global state should match the panel switch: ${JSON.stringify(dark)}`);
    }
  }

  const gutter = result.railGutterBalance || {};
  if (!gutter.found) failures.push(`Rail gutter balance sample was not found: ${JSON.stringify(gutter)}`);
  else if (gutter.difference > 3) failures.push(`Rail thumbnail visual gutters should be balanced left/right: ${JSON.stringify(gutter)}`);

  const focus = result.railFocusScroll || {};
  if (!focus.before?.found || !focus.after?.found) failures.push(`Rail focus scroll validation did not find active rail cards: ${JSON.stringify(focus)}`);
  else if (!focus.after.visible) failures.push(`Keyboard page navigation should scroll the active rail card into view: ${JSON.stringify(focus)}`);

  for (const [name, state] of Object.entries(result.railProgrammaticThumbs || {})) {
    if (!state?.before?.found || !state?.visible?.found || !state?.after?.found) {
      failures.push(`Rail programmatic thumbnail ${name} did not find the target active thumbnail: ${JSON.stringify(state)}`);
      continue;
    }
    if (state.before.rendered) failures.push(`Rail programmatic thumbnail ${name} should start from an unrendered far thumbnail: ${JSON.stringify(state)}`);
    if (!state.visible.visible) failures.push(`Rail programmatic thumbnail ${name} should first scroll the active card into view: ${JSON.stringify(state)}`);
    if (!state.after.queueTriggered) failures.push(`Rail programmatic thumbnail ${name} should trigger the visible thumbnail queue after automatic scroll: ${JSON.stringify(state)}`);
    if (!state.after.rendered || state.after.placeholder) {
      failures.push(`Rail programmatic thumbnail ${name} should render the active thumbnail without manual scrolling: ${JSON.stringify(state)}`);
    }
  }

  const manual = result.railManualScroll || {};
  if (!manual.before?.found || !manual.after?.found) failures.push(`Rail manual-scroll validation did not find the rail scroller: ${JSON.stringify(manual)}`);
  else if (manual.before.scrollTop > 24 && manual.delta > 36) {
    failures.push(`Rail refresh should not pull the user's manual scroll back to the active page: ${JSON.stringify(manual)}`);
  }

  const collapse = result.panelCollapse || {};
  if (!collapse.hasButton) failures.push(`Right panel is missing the panel collapse icon button: ${JSON.stringify(collapse)}`);
  else {
    const before = collapse.before || {};
    const collapsed = collapse.collapsed || {};
    const restored = collapse.restored || {};
    if (!before.buttonVisible || !before.buttonHasIcon) failures.push(`Collapse button should be visible as an icon in the open right panel: ${JSON.stringify(before)}`);
    if (before.buttonHasInlineSvg || !before.buttonHasAssetIcon || !before.buttonIconSrcMatches || !before.buttonIconFetchOk) {
      failures.push(`Collapse button should use project-local SVG asset ${EXPECTED_PANEL_COLLAPSE_ICON}: ${JSON.stringify(before)}`);
    }
    if (!before.buttonIconVisible || before.buttonIconNaturalWidth < 12 || before.buttonIconNaturalHeight < 12) {
      failures.push(`Collapse button asset icon should load visibly in the open right panel: ${JSON.stringify(before)}`);
    }
    if (!/收起/.test(before.buttonAriaLabel) || !/收起/.test(before.buttonTitle) || before.buttonExpanded !== 'true') {
      failures.push(`Collapse button should expose the open-state label and expanded state: ${JSON.stringify(before)}`);
    }
    if (!collapsed.collapsedClass || collapsed.panelOpenClass || collapsed.railVisible || collapsed.panelVisible) {
      failures.push(`Clicking collapse should hide both side panels: ${JSON.stringify(collapsed)}`);
    }
    if (!collapsed.buttonVisible || !collapsed.buttonHasIcon || !/展开/.test(collapsed.buttonAriaLabel) || collapsed.buttonExpanded !== 'false') {
      failures.push(`Collapsed mode should keep a visible expand icon button: ${JSON.stringify(collapsed)}`);
    }
    if (collapsed.buttonHasInlineSvg || !collapsed.buttonHasAssetIcon || !collapsed.buttonIconSrcMatches || !collapsed.buttonIconFetchOk || !collapsed.buttonIconVisible) {
      failures.push(`Collapsed mode should keep the project-local SVG asset icon visible: ${JSON.stringify(collapsed)}`);
    }
    if (!isUnrotatedIconTransform(collapsed.buttonIconTransform)) {
      failures.push(`Collapsed panel icon should not rotate: ${JSON.stringify(collapsed)}`);
    }
    if (!isSemiTransparentBlack(collapsed.buttonBackground)) {
      failures.push(`Collapsed panel button should use a semi-transparent black background block: ${JSON.stringify(collapsed)}`);
    }
    if (!/invert\(/.test(collapsed.buttonIconFilter || '')) {
      failures.push(`Collapsed panel icon should be inverted/white on the dark block: ${JSON.stringify(collapsed)}`);
    }
    if (!collapsed.buttonInViewport || collapsed.buttonOverlapsDeck) failures.push(`Collapsed button should stay in a safe viewport position: ${JSON.stringify(collapsed)}`);
    if (Math.abs((collapsed.deckAspect || 0) - 16 / 9) > 0.025) failures.push(`Collapsed deck should stay 16:9: ${JSON.stringify(collapsed)}`);
    if (!restored.railVisible || !restored.panelVisible || !restored.panelOpenClass || restored.collapsedClass) {
      failures.push(`Clicking the collapsed icon should restore the three-panel edit layout: ${JSON.stringify(restored)}`);
    }
    if (!collapse.indexPreserved || !collapse.activeRailPreserved || !collapse.propControlsPreserved) {
      failures.push(`Panel collapse/restore should preserve page, rail, and property-panel state: ${JSON.stringify(collapse)}`);
    }
    if (!restored.canEdit || (before.editableCount || 0) !== (restored.editableCount || 0)) {
      failures.push(`Panel collapse/restore should preserve editability: ${JSON.stringify({ before, restored })}`);
    }
  }

  const author = result.authorLinks || {};
  if (!author.before?.visible || (author.before?.linkCount || 0) !== 4) {
    failures.push(`Author links should show four platform links in the right panel: ${JSON.stringify(author.before)}`);
  }
  for (const [platform, config] of Object.entries(EXPECTED_AUTHOR_LINKS)) {
    const before = author.before?.links?.[platform] || {};
    const restored = author.afterRestore?.links?.[platform] || {};
    if (!before.exists) {
      failures.push(`Author link ${platform} is missing.`);
      continue;
    }
    if (before.href !== config.href) failures.push(`Author link ${platform} URL changed: ${JSON.stringify(before)}`);
    if (before.label !== config.label) failures.push(`Author link ${platform} label should be ${config.label}: ${JSON.stringify(before)}`);
    if (before.hasInlineSvg || !before.hasImg || before.iconAttr !== platform || !before.srcMatches || !before.fetchOk) {
      failures.push(`Author link ${platform} should use project-local SVG asset ${config.icon}: ${JSON.stringify(before)}`);
    }
    if (before.naturalWidth < 12 || before.naturalHeight < 12 || !before.iconFitsAnchor) {
      failures.push(`Author link ${platform} icon should load and fit the existing author-link button: ${JSON.stringify(before)}`);
    }
    if (restored.src !== config.icon || restored.href !== config.href || !restored.fetchOk) {
      failures.push(`Author link ${platform} should survive panel collapse/restore: ${JSON.stringify({ before, restored })}`);
    }
  }
  if (!author.restoredMatches) failures.push(`Author links changed after collapse/restore: ${JSON.stringify(author)}`);

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
  if (!actions.backgroundsDiffer || !/rgb\(13,\s*153,\s*255\)|rgb\(42,\s*165,\s*255\)|rgb\(14,\s*159,\s*110\)|rgb\(52,\s*206,\s*152\)/.test(actions.presentBackground)) {
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

function isUnrotatedIconTransform(value) {
  if (!value || value === 'none') return true;
  const numbers = value.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi)?.map(Number) || [];
  return numbers.length >= 6
    && Math.abs(numbers[0] - 1) < 0.01
    && Math.abs(numbers[1]) < 0.01
    && Math.abs(numbers[2]) < 0.01
    && Math.abs(numbers[3] - 1) < 0.01;
}

function isSemiTransparentBlack(value) {
  const numbers = value.match(/[\d.]+/g)?.map(Number) || [];
  if (numbers.length < 4) return false;
  const [r, g, b, a] = numbers;
  return r <= 12 && g <= 12 && b <= 12 && a >= 0.35 && a <= 0.85;
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
