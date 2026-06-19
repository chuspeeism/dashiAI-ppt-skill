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
const TEMPLATE = path.join(ROOT, 'assets/template-swiss.html');
const PREVIEW_INDEX = path.join(ROOT, 'output/theme-preview/ppt/index.html');
const CHROME_PATH = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const cliUrl = getArg('--url');

if (!existsSync(CHROME_PATH)) {
  throw new Error(`Chrome executable not found: ${CHROME_PATH}
Set CHROME_PATH to a local Chrome/Chromium executable and rerun the validation.`);
}

if (!cliUrl && !existsSync(PREVIEW_INDEX)) {
  throw new Error(`Preview file missing: ${PREVIEW_INDEX}
Run npm run render:themes first, or pass --url to an existing preview.`);
}

const staticChecks = runStaticChecks();
const server = cliUrl ? null : await startPreviewServer();
const url = cliUrl || server.url;
const browser = await chromium.launch({ headless: true, executablePath: CHROME_PATH });
let page;

try {
  page = await browser.newPage({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true });
  page.setDefaultTimeout(30000);
  await page.addInitScript(() => {
    window.__defaultRailLoadLongTasks = [];
    window.__defaultRailLoadFrameGaps = [];
    window.__defaultRailLoadNavStart = performance.now();
    try {
      window.__defaultRailLoadLongTaskObserver = new PerformanceObserver(list => {
        window.__defaultRailLoadLongTasks.push(...list.getEntries().map(entry => ({
          startTime: entry.startTime,
          duration: entry.duration,
        })));
      });
      window.__defaultRailLoadLongTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch {}
    let lastFrameAt = performance.now();
    const sample = now => {
      window.__defaultRailLoadFrameGaps.push(now - lastFrameAt);
      lastFrameAt = now;
      if (now - window.__defaultRailLoadNavStart < 3200) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  await page.goto(`${url}?editor_presenter_modes=${Date.now()}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#deck > .slide.active, #deck > .slide[data-deck-active]');

  const defaultRailFirstScreen = await runDefaultRailFirstScreenLoadValidation(page);
  const themeRailFirstScreens = await runThemeRailFirstScreenLoadValidation(page);
  const defaultEdit = await readEditorPresenterState(page);
  const layoutWidths = [];
  for (const width of [1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await settle(page);
    layoutWidths.push(await readLayoutState(page, width));
  }

  const editNavigation = await runEditNavigationValidation(page);
  const editCapabilities = await readEditCapabilities(page);
  const rail = await runRailValidation(page);
  const railPerformance = await runRailPerformanceValidation(page);
  const railActiveSync = await runRailActiveSyncValidation(page);
  const pageNavigationLatency = await runPageNavigationLatencyValidation(page);
  const navigationRootCauseMatrix = await runNavigationRootCauseMatrix(page);
  const editableTextCaret = await runEditableTextCaretValidation(page);
  const railThumbFit = await runRailThumbFitValidation(page);
  const themeSwitchRail = await runThemeSwitchRailValidation(page);
  const present = await runPresentValidation(page);
  const exportState = await readExportState(page);

  const result = {
    url,
    passed: false,
    staticChecks,
    defaultRailFirstScreen,
    defaultEdit,
    layoutWidths,
    editNavigation,
    editCapabilities,
    rail,
    railPerformance,
    railActiveSync,
    pageNavigationLatency,
    navigationRootCauseMatrix,
    editableTextCaret,
    railThumbFit,
    themeSwitchRail,
    themeRailFirstScreens,
    present,
    exportState,
  };
  const failures = validateResult(result);
  result.passed = failures.length === 0;
  if (failures.length) {
    console.error(JSON.stringify({ ...result, failures }, null, 2));
    throw new Error(failures.join('\n'));
  }
  console.log(JSON.stringify(result, null, 2));
} finally {
  await closePage(page);
  await closeBrowser(browser);
  if (server) await server.close();
}

function runStaticChecks() {
  const html = readFileSync(TEMPLATE, 'utf8');
  const previewController = sliceBetween(html, '/* =============== Preview Controller =============== */', '/* =============== Static HTML Export =============== */');
  const exportSource = sliceBetween(html, '/* =============== Static HTML Export =============== */', '</script>');
  const editableSource = sliceBetween(html, '/* =============== Editable Text Runtime =============== */', '</script>');
  const failures = [];

  if (!/deckMode/.test(html) || !/body\.dataset\.mode/.test(html)) {
    failures.push('Missing explicit deckMode/body.dataset.mode state model.');
  }
  if (/var\s+overviewOn|let\s+overviewOn|const\s+overviewOn|body\.overview-on|classList\.(add|remove|toggle)\(['"]overview-on['"]/.test(html)) {
    failures.push('Legacy overviewOn/body.overview-on mode state is still present.');
  }
  if (/window\.__toggleOverview\s*=|function\s+(openOverview|closeOverview|toggleOverview)\b/.test(html)) {
    failures.push('Legacy overview open/close/toggle API is still present.');
  }
  if (/id=["']preview-overview-btn["']|preview-overview-btn/.test(html)) {
    failures.push('Old preview-overview button still exists instead of a play/present button.');
  }
  if (/id=["']overview["']|\.id\s*=\s*['"]overview['"]|querySelector\(['"]#overview['"]\)/.test(html)) {
    failures.push('Legacy full-screen #overview container or export cleanup path is still present.');
  }
  if (!/id=["']slide-rail["']|data-slide-rail=["']true["']/.test(html)) {
    failures.push('Edit-mode left slide rail is missing.');
  }
  if (!/function\s+canEditDeck\b|window\.__canEditDeck\s*=/.test(html)) {
    failures.push('Missing unified edit guard for text, media, and property editing.');
  }
  if (/preview-panel-open/.test(editableSource) || /preview-panel-open/.test(sliceBetween(html, 'function isDeckEditableTextTarget', 'function isDeckInteractiveTarget'))) {
    failures.push('Editable text target detection still depends on preview-panel-open.');
  }
  if (!/enterPresentMode|exitPresentMode|__enterPresentMode|__exitPresentMode/.test(previewController + html)) {
    failures.push('Missing explicit enter/exit present mode flow.');
  }
  if (/overviewOn|overviewDisplay|#overview|overview-on/.test(exportSource)) {
    failures.push('Export capture/restore still stores or manipulates overview state.');
  }
  if (!/data-rail-card|data-slide-rail-card|dataset\.railCard/.test(html)) {
    failures.push('Rail cards are not represented as first-class catalog items.');
  }
  if (!/requestFullscreen\s*\(/.test(previewController + html) || !/fullscreenchange/.test(previewController + html)) {
    failures.push('Present mode must use the real Fullscreen API with fullscreenchange sync.');
  }
  if (/present-exit-btn/.test(html)) {
    failures.push('Present mode should not render a custom exit button.');
  }
  if (!/scrollbar-color\s*:[^;]+transparent/.test(html) || !/#slide-rail-list::-[\w-]*scrollbar-track[\s\S]{0,120}transparent/.test(html)) {
    failures.push('Rail scrollbar should use a transparent track and only show the thumb/bar.');
  }
  if (!/复制页面/.test(html) || !/duplicate|copyCatalog|cloneCatalog|copySlide/i.test(html)) {
    failures.push('Rail context menu is missing a real copy-page action.');
  }
  return failures;
}

async function readEditorPresenterState(page) {
  return page.evaluate(() => {
    const body = document.body;
    const rail = document.querySelector('#slide-rail,[data-slide-rail="true"]');
    const panel = document.getElementById('preview-panel');
    const viewport = document.getElementById('deck-viewport');
    const overview = document.getElementById('overview');
    return {
      mode: body.dataset.mode || '',
      panelOpen: body.classList.contains('preview-panel-open'),
      panelVisible: isVisible(panel),
      panelInert: Boolean(panel?.inert),
      railExists: Boolean(rail),
      railVisible: isVisible(rail),
      viewportVisible: isVisible(viewport),
      overviewExists: Boolean(overview),
      overviewVisible: isVisible(overview),
      currentIndex: window.__currentSlideIndex || 0,
      slideCount: window.__getVisibleSlides?.().length || document.querySelectorAll('#deck > .slide:not([hidden])').length,
      editableCount: document.querySelectorAll('#deck > .slide.active [contenteditable="true"]').length,
      canEdit: Boolean(window.__canEditDeck?.()),
      presentButtonExists: Boolean(document.querySelector('#preview-present-btn,[data-present-toggle="true"]')),
      oldOverviewButtonExists: Boolean(document.getElementById('preview-overview-btn')),
    };

    function isVisible(el) {
      if (!el) return false;
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 2 && rect.height > 2;
    }
  });
}

async function readLayoutState(page, width) {
  return page.evaluate((viewportWidth) => {
    const rail = document.querySelector('#slide-rail,[data-slide-rail="true"]');
    const panel = document.getElementById('preview-panel');
    const deck = document.getElementById('deck-viewport');
    const railRect = rail?.getBoundingClientRect();
    const panelRect = panel?.getBoundingClientRect();
    const deckRect = deck?.getBoundingClientRect();
    const railVisible = isVisible(rail);
    const panelVisible = isVisible(panel);
    const deckVisible = isVisible(deck);
    return {
      viewportWidth,
      mode: document.body.dataset.mode || '',
      railVisible,
      panelVisible,
      deckVisible,
      railRect: rectOf(railRect),
      panelRect: rectOf(panelRect),
      deckRect: rectOf(deckRect),
      aspect: deckRect ? deckRect.width / deckRect.height : 0,
      overlapsRail: Boolean(railVisible && deckRect && railRect && deckRect.left < railRect.right - 1),
      overlapsPanel: Boolean(panelVisible && deckRect && panelRect && deckRect.right > panelRect.left + 1),
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
  }, width);
}

async function runEditNavigationValidation(page) {
  await ensureEditMode(page);
  await page.evaluate(() => window.go?.(0, { animate: false, force: true }));
  await settle(page);
  const start = await currentIndex(page);
  await page.keyboard.press('ArrowRight');
  await settle(page);
  const afterRight = await currentIndex(page);
  await page.keyboard.press(' ');
  await settle(page);
  const afterSpace = await currentIndex(page);
  await page.mouse.click(720, 450);
  await settle(page);
  const afterClick = await currentIndex(page);
  await page.evaluate(() => document.activeElement?.blur?.());
  await page.keyboard.press('ArrowDown');
  await settle(page);
  const afterDown = await currentIndex(page);
  await page.keyboard.press('ArrowUp');
  await settle(page);
  const afterUp = await currentIndex(page);
  return { start, afterRight, afterSpace, afterClick, afterDown, afterUp };
}

async function readEditCapabilities(page) {
  await ensureEditMode(page);
  return page.evaluate(() => {
    const active = document.querySelector('#deck > .slide.active');
    const panel = document.getElementById('preview-panel');
    return {
      mode: document.body.dataset.mode || '',
      canEdit: Boolean(window.__canEditDeck?.()),
      editableCount: active?.querySelectorAll('[contenteditable="true"]').length || 0,
      editableReadyCount: active?.querySelectorAll('[data-editable-id]').length || 0,
      fileSlotCount: active?.querySelectorAll('[data-dashi-host-image-slot],image-slot,.gxn-slot,.pulse-imgframe,.acl-slot,.kx-imgslot,.dslot').length || 0,
      propControlCount: panel?.querySelectorAll('input,button,select,textarea').length || 0,
      panelVisible: isVisible(panel),
    };

    function isVisible(el) {
      if (!el) return false;
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 2 && rect.height > 2;
    }
  });
}

async function runRailValidation(page) {
  await ensureEditMode(page);
  await page.evaluate(() => window.__setActiveThemePack?.('theme01', { navigate: false }));
  await settle(page);
  await page.evaluate(() => window.go?.(0, { animate: false, force: true }));
  await settle(page);
  const initial = await getRailState(page);
  const clickJump = await clickRailCard(page, 3);
  const afterClick = await getRailState(page);
  await page.evaluate(() => window.go?.(30, { animate: false, force: true }));
  await settle(page);
  const afterScrollTarget = await getRailState(page);
  const dirty = await runRailDirtyValidation(page);
  const drag = await dragRailCard(page, 30, 33);
  await settle(page, 250);
  const afterDrag = await getRailState(page);
  const context = await runRailContextValidation(page);
  return { initial, clickJump, afterClick, afterScrollTarget, drag, afterDrag, context, dirty };
}

async function runDefaultRailFirstScreenLoadValidation(page) {
  await page.evaluate(() => {
    window.__resetOverviewPerfMarks?.();
    window.__defaultRailLoadLongTasks = [];
    window.__defaultRailLoadFrameGaps = [];
    window.__defaultRailLoadLongTaskObserver?.disconnect?.();
    try {
      window.__defaultRailLoadLongTaskObserver = new PerformanceObserver(list => {
        window.__defaultRailLoadLongTasks.push(...list.getEntries().map(entry => ({
          startTime: entry.startTime,
          duration: entry.duration,
        })));
      });
      window.__defaultRailLoadLongTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch {}
    window.__defaultRailLoadStart = performance.now();
    let lastFrameAt = performance.now();
    const sample = now => {
      window.__defaultRailLoadFrameGaps.push(now - lastFrameAt);
      lastFrameAt = now;
      if (now - window.__defaultRailLoadStart < 3000) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  const startAt = Date.now();
  const timeline = await collectRailFirstScreenTimeline(page, startAt);
  const perf = await page.evaluate(() => {
    const state = window.__getRailPerfState?.() || window.__getOverviewPerfState?.() || {};
    const marks = state.marks || {};
    const stages = (marks.stages || []).filter(stage => /queue-nearby-overview-thumbs|dom-preview-thumbnail|render-overview-thumb|fit-overview-thumbnails|observe-overview-thumbnails/.test(stage.type || ''));
    const longTasks = window.__defaultRailLoadLongTasks || [];
    const frameGaps = window.__defaultRailLoadFrameGaps || [];
    window.__defaultRailLoadLongTaskObserver?.disconnect?.();
    return {
      queueLength: state.queueLength ?? null,
      visibleOrNearCount: state.visibleOrNearCount ?? null,
      thumbnailStages: stages.map(stage => ({
        type: stage.type,
        duration: Number(stage.duration || 0),
        count: Number(stage.count || 0),
        queued: Number(stage.queued || 0),
      })),
      longTasksOver50: longTasks.filter(task => Number(task.duration || 0) > 50).length,
      maxLongTaskMs: Number(longTasks.reduce((max, task) => Math.max(max, Number(task.duration || 0)), 0).toFixed(1)),
      maxFrameGapMs: Number(frameGaps.reduce((max, gap) => Math.max(max, Number(gap || 0)), 0).toFixed(1)),
    };
  });
  const firstVisibleThumbReadyMs = firstTimelineMs(timeline, state => state.visibleRenderedCount > 0);
  const allVisibleThumbsReadyMs = firstTimelineMs(timeline, state => state.visibleRailCount > 0 && state.visibleRenderedCount === state.visibleRailCount);
  const initial = timeline[0];
  const final = timeline[timeline.length - 1];
  return {
    initial,
    final,
    timeline,
    visibleRailCount: final.visibleRailCount,
    visibleRenderedCount: final.visibleRenderedCount,
    visiblePlaceholderCount: final.visiblePlaceholderCount,
    firstVisibleThumbReadyMs,
    allVisibleThumbsReadyMs,
    ...perf,
  };
}

async function runThemeRailFirstScreenLoadValidation(page) {
  const result = {};
  const themes = await page.$$eval('#preview-theme-pack option', options => options
    .filter(option => option.value && !option.disabled)
    .map(option => option.value));
  for (const theme of themes) {
    await ensureEditMode(page);
    await page.selectOption('#preview-theme-pack', theme);
    await page.evaluate(() => {
      window.__resetOverviewPerfMarks?.();
      window.__themeRailLoadLongTasks = [];
      window.__themeRailLoadFrameGaps = [];
      window.__themeRailLoadLongTaskObserver?.disconnect?.();
      try {
        window.__themeRailLoadLongTaskObserver = new PerformanceObserver(list => {
          window.__themeRailLoadLongTasks.push(...list.getEntries().map(entry => ({
            startTime: entry.startTime,
            duration: entry.duration,
          })));
        });
        window.__themeRailLoadLongTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch {}
      window.__themeRailLoadStart = performance.now();
      let lastFrameAt = performance.now();
      const sample = now => {
        window.__themeRailLoadFrameGaps.push(now - lastFrameAt);
        lastFrameAt = now;
        if (now - window.__themeRailLoadStart < 3600) requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
    const startAt = Date.now();
    const timeline = await collectRailFirstScreenTimeline(page, startAt);
    const perf = await page.evaluate(() => {
      const state = window.__getRailPerfState?.() || window.__getOverviewPerfState?.() || {};
      const marks = state.marks || {};
      const stages = (marks.stages || []).filter(stage => /queue-nearby-overview-thumbs|dom-preview-thumbnail|render-overview-thumb|fit-overview-thumbnails|observe-overview-thumbnails/.test(stage.type || ''));
      const longTasks = window.__themeRailLoadLongTasks || [];
      const frameGaps = window.__themeRailLoadFrameGaps || [];
      window.__themeRailLoadLongTaskObserver?.disconnect?.();
      return {
        activeThemePack: document.documentElement.dataset.themePack || '',
        queueLength: state.queueLength ?? null,
        visibleOrNearCount: state.visibleOrNearCount ?? null,
        thumbnailStages: stages.map(stage => ({
          type: stage.type,
          duration: Number(stage.duration || 0),
          count: Number(stage.count || 0),
          queued: Number(stage.queued || 0),
        })),
        longTasksOver50: longTasks.filter(task => Number(task.duration || 0) > 50).length,
        maxLongTaskMs: Number(longTasks.reduce((max, task) => Math.max(max, Number(task.duration || 0)), 0).toFixed(1)),
        maxFrameGapMs: Number(frameGaps.reduce((max, gap) => Math.max(max, Number(gap || 0)), 0).toFixed(1)),
      };
    });
    const firstVisibleThumbReadyMs = firstTimelineMs(timeline, state => state.visibleRenderedCount > 0);
    const allVisibleThumbsReadyMs = firstTimelineMs(timeline, state => state.visibleRailCount > 0 && state.visibleRenderedCount === state.visibleRailCount);
    const initial = timeline[0];
    const final = timeline[timeline.length - 1];
    result[theme] = {
      initial,
      final,
      timeline,
      visibleRailCount: final.visibleRailCount,
      visibleRenderedCount: final.visibleRenderedCount,
      visiblePlaceholderCount: final.visiblePlaceholderCount,
      firstVisibleThumbReadyMs,
      allVisibleThumbsReadyMs,
      ...perf,
    };
  }
  return result;
}

async function collectRailFirstScreenTimeline(page, startAt, checkpoints = [0, 500, 1000, 2500, 5000]) {
  const timeline = [];
  for (const checkpoint of checkpoints) {
    const waitMs = Math.max(0, checkpoint - (Date.now() - startAt));
    if (waitMs > 0) await page.waitForTimeout(waitMs);
    const state = await readVisibleRailThumbState(page);
    timeline.push({
      atMs: Date.now() - startAt,
      ...state,
    });
  }
  return timeline;
}

function firstTimelineMs(timeline, predicate) {
  const item = timeline.find(predicate);
  return item ? item.atMs : null;
}

function findTimelineAt(timeline, targetMs) {
  return (timeline || []).find(item => Number(item.atMs || 0) >= targetMs)
    || (timeline || [])[timeline.length - 1]
    || null;
}

async function readVisibleRailThumbState(page) {
  return page.evaluate(() => {
    const scroller = document.querySelector('[data-rail-scroll="true"],#slide-rail-list');
    const railRect = scroller?.getBoundingClientRect();
    const cards = [...document.querySelectorAll('[data-rail-card="true"],[data-slide-rail-card="true"]')];
    const visibleCards = cards.filter(card => {
      const rect = card.getBoundingClientRect();
      return railRect
        && rect.bottom > railRect.top + 1
        && rect.top < railRect.bottom - 1
        && rect.width > 0
        && rect.height > 0;
    });
    const sampleCards = visibleCards.map(card => {
      const thumb = card.querySelector('[data-rail-thumb="true"],[data-overview-thumb="true"]');
      const rendered = thumb?.dataset.railRendered === 'true' || thumb?.dataset.overviewRendered === 'true';
      const queued = thumb?.dataset.railQueued === 'true' || thumb?.dataset.overviewQueued === 'true';
      const placeholder = Boolean(thumb?.querySelector('[data-overview-placeholder="true"],[data-rail-placeholder="true"]'));
      return {
        index: Number(card.dataset.index || 0),
        slideId: card.dataset.slideId || '',
        rendered,
        queued,
        placeholder,
        key: thumb?.dataset.overviewKey || thumb?.dataset.railKey || '',
      };
    });
    return {
      visibleRailCount: visibleCards.length,
      visibleRenderedCount: sampleCards.filter(card => card.rendered).length,
      visiblePlaceholderCount: sampleCards.filter(card => card.placeholder || !card.rendered).length,
      visibleQueuedCount: sampleCards.filter(card => card.queued).length,
      sampleCards,
    };
  });
}

async function runRailPerformanceValidation(page) {
  await ensureEditMode(page);
  await page.evaluate(() => {
    window.__setActiveThemePack?.('theme01', { navigate: false });
    window.go?.(0, { animate: false, force: true });
  });
  await settle(page);
  const click = await runRailInteractionWindow(page, async () => {
    await page.evaluate(() => {
      const card = document.querySelector('[data-rail-card="true"][data-index="5"],[data-slide-rail-card="true"][data-index="5"]');
      card?.dispatchEvent(new MouseEvent('click', {bubbles:true, cancelable:true, button:0}));
    });
  });
  const arrowDown = await runRailInteractionWindow(page, async () => {
    await page.keyboard.press('ArrowDown');
  });
  const arrowUp = await runRailInteractionWindow(page, async () => {
    await page.keyboard.press('ArrowUp');
  });
  return { click, arrowDown, arrowUp };
}

async function runRailActiveSyncValidation(page) {
  await ensureEditMode(page);
  await page.evaluate(() => {
    window.__setActiveThemePack?.('theme01', { navigate: false });
    window.go?.(0, { animate: false, force: true });
  });
  await settle(page);
  const initial = await readRailActiveSyncState(page);
  await page.keyboard.press('ArrowDown');
  await settle(page);
  const afterArrowDown = await readRailActiveSyncState(page);
  await page.keyboard.press('ArrowUp');
  await settle(page);
  const afterArrowUp = await readRailActiveSyncState(page);
  await page.evaluate(() => window.go?.(12, { animate: false, force: true }));
  await settle(page);
  const afterDirectGo = await readRailActiveSyncState(page);
  const drag = await dragRailCard(page, afterDirectGo.activeIndex, afterDirectGo.activeIndex + 2);
  await settle(page, 350);
  const afterDrag = await readRailActiveSyncState(page);
  return { initial, afterArrowDown, afterArrowUp, afterDirectGo, drag, afterDrag };
}

async function readRailActiveSyncState(page) {
  return page.evaluate(() => {
    const visibleSlides = window.__getVisibleSlides?.() || [];
    const currentIndex = window.__currentSlideIndex || 0;
    const activeSlide = visibleSlides[currentIndex] || document.querySelector('#deck > .slide.active');
    const activeSlideId = activeSlide?.dataset.vmSlideId || activeSlide?.dataset.slideId || '';
    const cards = [...document.querySelectorAll('[data-rail-card="true"],[data-slide-rail-card="true"]')];
    const activeCards = cards.filter(card => card.dataset.railActive === 'true' || card.getAttribute('aria-current') === 'true');
    const activeCard = activeCards[0] || null;
    const scroller = document.querySelector('[data-rail-scroll="true"],#slide-rail-list');
    const cardRect = activeCard?.getBoundingClientRect();
    const scrollRect = scroller?.getBoundingClientRect();
    return {
      currentIndex,
      activeIndex: activeCard ? Number(activeCard.dataset.index || -1) : -1,
      activeSlideId,
      activeCardCount: activeCards.length,
      activeCardSlideId: activeCard?.dataset.slideId || activeCard?.dataset.slideKey || '',
      activeVisible: Boolean(cardRect && scrollRect && cardRect.top >= scrollRect.top - 2 && cardRect.bottom <= scrollRect.bottom + 2),
    };
  });
}

async function runPageNavigationLatencyValidation(page) {
  const edit = {};
  await ensureEditMode(page);
  await page.evaluate(() => {
    window.__setActiveThemePack?.('theme01', { navigate: false });
    window.__setPageTransition?.('liquidMorph');
    window.go?.(0, { animate: false, force: true });
  });
  await settle(page);
  edit.arrowDown = await runNavigationActionWindow(page, async () => {
    await page.keyboard.press('ArrowDown');
  });
  await page.evaluate(() => {
    window.__setPageTransition?.('liquidMorph');
    window.go?.(1, { animate: false, force: true });
  });
  await settle(page);
  edit.arrowUp = await runNavigationActionWindow(page, async () => {
    await page.keyboard.press('ArrowUp');
  });
  await page.evaluate(() => {
    window.__setPageTransition?.('none');
    window.go?.(0, { animate: false, force: true });
  });
  await settle(page);
  edit.railClick = await runNavigationActionWindow(page, async () => {
    const locator = page.locator('[data-rail-card="true"][data-index="3"],[data-slide-rail-card="true"][data-index="3"]').first();
    await locator.click();
  });
  await page.evaluate(() => {
    window.__setPageTransition?.('liquidMorph');
    window.go?.(0, { animate: false, force: true });
  });
  await settle(page);
  edit.rapidArrowDown = await runRapidEditNavigationValidation(page);

  const present = {};
  await enterPresentAtIndex(page, 0);
  present.arrowRight = await runNavigationActionWindow(page, async () => {
    await page.keyboard.press('ArrowRight');
  });
  await exitPresentForValidation(page);
  await enterPresentAtIndex(page, 1);
  present.arrowLeft = await runNavigationActionWindow(page, async () => {
    await page.keyboard.press('ArrowLeft');
  });
  await exitPresentForValidation(page);
  await enterPresentAtIndex(page, 0);
  present.backgroundLeft = await runNavigationActionWindow(page, async () => {
    const point = await getDeckCenterPoint(page);
    await page.mouse.click(point.x, point.y, { button: 'left' });
  });
  await exitPresentForValidation(page);
  await enterPresentAtIndex(page, 1);
  present.backgroundRight = await runNavigationActionWindow(page, async () => {
    const point = await getDeckCenterPoint(page);
    await page.mouse.click(point.x, point.y, { button: 'right' });
  });
  await exitPresentForValidation(page);
  present.slotInnerLeft = await runPresentTargetNavigationLatency(page, 'slotInner', 'left');
  present.slotInnerRight = await runPresentTargetNavigationLatency(page, 'slotInner', 'right');
  present.mediaInnerLeft = await runPresentTargetNavigationLatency(page, 'mediaInner', 'left');
  present.mediaInnerRight = await runPresentTargetNavigationLatency(page, 'mediaInner', 'right');
  await exitPresentForValidation(page);

  return { edit, present };
}

async function runNavigationRootCauseMatrix(page) {
  const matrix = {};
  matrix.capabilities = await page.evaluate(() => ({
    hasDiagnosticFlagsApi: typeof window.__setDeckDiagnosticFlags === 'function',
  }));
  await ensureEditMode(page);
  await page.evaluate(() => {
    window.__setActiveThemePack?.('theme01', { navigate: false });
    window.__setPageTransition?.('liquidMorph');
    window.go?.(0, { animate: false, force: true });
  });
  matrix.editAnimationOnRailLoading = await runNavigationActionWindow(page, async () => {
    await page.keyboard.press('ArrowDown');
  });

  await ensureEditMode(page);
  await page.evaluate(() => {
    window.__setActiveThemePack?.('theme01', { navigate: false });
    window.__setPageTransition?.('none');
    window.go?.(0, { animate: false, force: true });
  });
  await settle(page, 120);
  matrix.editAnimationOff = await runNavigationActionWindow(page, async () => {
    await page.keyboard.press('ArrowDown');
  });

  await ensureEditMode(page);
  await page.evaluate(() => {
    window.__setActiveThemePack?.('theme01', { navigate: false });
    window.__setPageTransition?.('liquidMorph');
    window.go?.(0, { animate: false, force: true });
    window.__deferOverviewThumbs?.(5000, 'diagnostic-pause');
    window.__cancelOverviewThumbQueue?.();
  });
  await settle(page, 120);
  matrix.editAnimationOnThumbQueuePaused = await runNavigationActionWindow(page, async () => {
    await page.keyboard.press('ArrowDown');
  });

  await ensureEditMode(page);
  await page.evaluate(() => {
    window.__setActiveThemePack?.('theme01', { navigate: false });
    window.__setPageTransition?.('liquidMorph');
    window.go?.(0, { animate: false, force: true });
    window.__setDeckDiagnosticFlags?.({ disableThumbGeneration: true, disableAdjacentPreload: true });
  });
  await settle(page, 120);
  matrix.editAnimationOnThumbGenerationDisabled = await runNavigationActionWindow(page, async () => {
    await page.keyboard.press('ArrowDown');
  });
  await page.evaluate(() => window.__setDeckDiagnosticFlags?.({ disableThumbGeneration: false, disableAdjacentPreload: false }));

  await exitPresentForValidation(page);
  await ensureEditMode(page);
  await page.evaluate(() => {
    window.__setActiveThemePack?.('theme01', { navigate: false });
    window.__setPageTransition?.('liquidMorph');
    window.go?.(0, { animate: false, force: true });
  });
  const button = page.locator('#preview-present-btn,[data-present-toggle="true"]').first();
  await button.click();
  await settle(page, 320);
  matrix.presentAnimationOn = await runNavigationActionWindow(page, async () => {
    await page.keyboard.press('ArrowRight');
  });
  await settle(page, 720);
  await exitPresentForValidation(page);

  return matrix;
}

async function enterPresentAtIndex(page, index) {
  await ensureEditMode(page);
  await page.evaluate((targetIndex) => {
    window.__setActiveThemePack?.('theme01', { navigate: false });
    window.__setPageTransition?.('none');
    window.go?.(targetIndex, { animate: false, force: true });
  }, index);
  await settle(page, 220);
  const button = page.locator('#preview-present-btn,[data-present-toggle="true"]').first();
  await button.click();
  await settle(page, 320);
}

async function runPresentTargetNavigationLatency(page, kind, button) {
  await exitPresentForValidation(page);
  await ensureEditMode(page);
  await preparePresentClickTarget(page, kind, button === 'right' ? 1 : 0);
  const presentButton = page.locator('#preview-present-btn,[data-present-toggle="true"]').first();
  await presentButton.click();
  await settle(page, 320);
  const targetBox = await getCurrentPresentTargetBox(page, kind);
  if (!targetBox?.found) return { found: false, kind, button };
  const result = await runNavigationActionWindow(page, async () => {
    await page.mouse.click(targetBox.x, targetBox.y, { button });
  });
  await exitPresentForValidation(page);
  return { ...result, found: true, kind, button, consumedEventsProbe: targetBox.consumedEventsProbe || false };
}

async function getDeckCenterPoint(page) {
  return page.evaluate(() => {
    const rect = document.querySelector('#deck-viewport')?.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  });
}

async function runNavigationActionWindow(page, action) {
  const startState = await page.evaluate(() => {
    window.__resetOverviewPerfMarks?.();
    window.__navLatencyLongTasks = [];
    window.__navLatencyFrameGaps = [];
    window.__navLatencyObserver?.disconnect?.();
    window.__navLatencyProbeHandler && removeEventListener('swiss-slide-change', window.__navLatencyProbeHandler);
    const active = document.querySelector('#deck > .slide.active');
    const startAt = performance.now();
    const probe = {
      startAt,
      startIndex: window.__currentSlideIndex || 0,
      startActiveId: active?.dataset.vmSlideId || active?.dataset.slideId || '',
      indexChangedAt: null,
      activeChangedAt: null,
      transitionStartedAt: null,
      transitionStageVisibleAt: null,
      firstVisualChangeAt: null,
      transitionMode: '',
    };
    window.__navLatencyProbe = probe;
    window.__navLatencyOriginalTransition = window.__playPageTransition;
    if(typeof window.__playPageTransition === 'function'){
      window.__playPageTransition = function patchedPageTransition(mode, currentSlide, nextSlide, direction, commit){
        if(probe.transitionStartedAt === null){
          probe.transitionStartedAt = performance.now();
          probe.transitionMode = mode || '';
        }
        return window.__navLatencyOriginalTransition.apply(this, arguments);
      };
    }
    const observeTransitionStage = () => {
      const stage = document.querySelector('.page-transition-stage');
      const style = stage ? getComputedStyle(stage) : null;
      const rect = stage?.getBoundingClientRect();
      const visible = Boolean(stage && style && style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 0) > 0.01 && rect?.width > 1 && rect?.height > 1);
      const activeState = stage?.dataset.state || stage?.dataset.active || stage?.getAttribute('aria-hidden') === 'false';
      if(probe.transitionStageVisibleAt === null && (visible || activeState)) probe.transitionStageVisibleAt = performance.now();
      if(stage && !probe.transitionVisualBaseline){
        const current = stage.querySelector('[data-transition-role="current"]');
        const next = stage.querySelector('[data-transition-role="next"]');
        const currentStyle = current ? getComputedStyle(current) : null;
        const nextStyle = next ? getComputedStyle(next) : null;
        probe.transitionVisualBaseline = {
          currentOpacity: currentStyle?.opacity || '',
          currentTransform: currentStyle?.transform || '',
          currentFilter: currentStyle?.filter || '',
          nextClipPath: nextStyle?.clipPath || '',
          nextTransform: nextStyle?.transform || '',
          nextFilter: nextStyle?.filter || '',
        };
      } else if(stage && probe.firstVisualChangeAt === null && probe.transitionVisualBaseline){
        const current = stage.querySelector('[data-transition-role="current"]');
        const next = stage.querySelector('[data-transition-role="next"]');
        const currentStyle = current ? getComputedStyle(current) : null;
        const nextStyle = next ? getComputedStyle(next) : null;
        const changed = currentStyle?.opacity !== probe.transitionVisualBaseline.currentOpacity
          || currentStyle?.transform !== probe.transitionVisualBaseline.currentTransform
          || currentStyle?.filter !== probe.transitionVisualBaseline.currentFilter
          || nextStyle?.clipPath !== probe.transitionVisualBaseline.nextClipPath
          || nextStyle?.transform !== probe.transitionVisualBaseline.nextTransform
          || nextStyle?.filter !== probe.transitionVisualBaseline.nextFilter;
        if(changed) probe.firstVisualChangeAt = performance.now();
      }
      if(performance.now() - startAt < 520) requestAnimationFrame(observeTransitionStage);
    };
    requestAnimationFrame(observeTransitionStage);
    window.__navLatencyProbeHandler = () => {
      const nextActive = document.querySelector('#deck > .slide.active');
      if(probe.indexChangedAt === null && (window.__currentSlideIndex || 0) !== probe.startIndex) probe.indexChangedAt = performance.now();
      if(probe.activeChangedAt === null && (nextActive?.dataset.vmSlideId || nextActive?.dataset.slideId || '') !== probe.startActiveId) probe.activeChangedAt = performance.now();
    };
    addEventListener('swiss-slide-change', window.__navLatencyProbeHandler);
    try {
      window.__navLatencyObserver = new PerformanceObserver(list => {
        window.__navLatencyLongTasks.push(...list.getEntries().map(entry => ({
          startTime: entry.startTime,
          duration: entry.duration,
        })));
      });
      window.__navLatencyObserver.observe({ entryTypes: ['longtask'] });
    } catch {}
    let lastFrame = performance.now();
    const tick = now => {
      window.__navLatencyFrameGaps.push(now - lastFrame);
      lastFrame = now;
      if(now - startAt < 520) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return { startAt, startIndex: probe.startIndex };
  });
  const actionStart = Date.now();
  await action();
  const actionElapsedMs = Date.now() - actionStart;
  await page.waitForFunction(startIndex => (window.__currentSlideIndex || 0) !== startIndex, startState.startIndex, { timeout: 500 }).catch(() => {});
  await settle(page, 540);
  return page.evaluate((actionElapsedMs) => {
    const probe = window.__navLatencyProbe || {};
    const start = Number(probe.startAt || 0);
    const perf = window.__getRailPerfState?.() || window.__getOverviewPerfState?.() || {};
    const marks = perf.marks || {};
    const stages = (marks.stages || []).filter(stage => Number(stage.startAt || 0) >= start);
    const captures = (marks.captures || []).filter(capture => Number(capture.startedAt || 0) >= start);
    const layoutReads = (marks.layoutReads || []).filter(read => Number(read.at || 0) >= start);
    const longTasks = (window.__navLatencyLongTasks || []).filter(task => Number(task.startTime || 0) >= start);
    const frameGaps = (window.__navLatencyFrameGaps || []).filter(gap => Number.isFinite(gap));
    window.__navLatencyObserver?.disconnect?.();
    if(window.__navLatencyProbeHandler) removeEventListener('swiss-slide-change', window.__navLatencyProbeHandler);
    if(window.__navLatencyOriginalTransition){
      window.__playPageTransition = window.__navLatencyOriginalTransition;
      window.__navLatencyOriginalTransition = null;
    }
    return {
      actionElapsedMs,
      startIndex: probe.startIndex,
      endIndex: window.__currentSlideIndex || 0,
      indexChangeMs: probe.indexChangedAt === null ? null : Number((probe.indexChangedAt - start).toFixed(1)),
      activeChangeMs: probe.activeChangedAt === null ? null : Number((probe.activeChangedAt - start).toFixed(1)),
      transitionStartMs: probe.transitionStartedAt === null ? null : Number((probe.transitionStartedAt - start).toFixed(1)),
      transitionStageVisibleMs: probe.transitionStageVisibleAt === null ? null : Number((probe.transitionStageVisibleAt - start).toFixed(1)),
      firstVisualChangeMs: probe.firstVisualChangeAt === null ? null : Number((probe.firstVisualChangeAt - start).toFixed(1)),
      transitionMode: probe.transitionMode || '',
      longTasksOver50: longTasks.filter(task => Number(task.duration || 0) > 50).length,
      maxLongTaskMs: Number(longTasks.reduce((max, task) => Math.max(max, Number(task.duration || 0)), 0).toFixed(1)),
      maxFrameGapMs: Number(frameGaps.reduce((max, gap) => Math.max(max, Number(gap || 0)), 0).toFixed(1)),
      captureStarts: captures.length,
      scheduled: Boolean(perf.scheduled),
      queueLength: perf.queueLength ?? null,
      pauseRemainingMs: perf.pauseRemainingMs ?? 0,
      thumbnailStages: stages
        .filter(stage => /queue-nearby-overview-thumbs|fit-overview-thumbnails|observe-overview-thumbnails|dom-preview-thumbnail|overview-thumb-task/.test(stage.type || ''))
        .map(stage => stage.type),
      layoutReadCount: layoutReads.reduce((sum, read) => sum + Number(read.count || 0), 0),
    };
  }, actionElapsedMs);
}

async function runRapidEditNavigationValidation(page) {
  const start = await page.evaluate(() => {
    window.__resetOverviewPerfMarks?.();
    window.__rapidNavLongTasks = [];
    window.__rapidNavFrameGaps = [];
    window.__rapidNavObserver?.disconnect?.();
    const active = document.querySelector('#deck > .slide.active');
    const startAt = performance.now();
    const probe = {
      startAt,
      startIndex: window.__currentSlideIndex || 0,
      startActiveId: active?.dataset.vmSlideId || active?.dataset.slideId || '',
      keydowns: [],
      transitionStarts: [],
      transitionStageVisibleAt: null,
      acceptedChanges: [],
    };
    window.__rapidNavProbe = probe;
    window.__rapidNavOriginalTransition = window.__playPageTransition;
    if(typeof window.__playPageTransition === 'function'){
      window.__playPageTransition = function patchedRapidTransition(mode){
        probe.transitionStarts.push({ at: performance.now(), mode: mode || '' });
        return window.__rapidNavOriginalTransition.apply(this, arguments);
      };
    }
    window.__rapidNavHandler && removeEventListener('swiss-slide-change', window.__rapidNavHandler);
    window.__rapidNavHandler = () => {
      probe.acceptedChanges.push({ at: performance.now(), index: window.__currentSlideIndex || 0 });
    };
    addEventListener('swiss-slide-change', window.__rapidNavHandler);
    window.__rapidNavKeyHandler && removeEventListener('keydown', window.__rapidNavKeyHandler, true);
    window.__rapidNavKeyHandler = event => {
      if(event.key === 'ArrowDown') probe.keydowns.push({ at: performance.now(), index: window.__currentSlideIndex || 0 });
    };
    addEventListener('keydown', window.__rapidNavKeyHandler, true);
    const observeTransitionStage = () => {
      const stage = document.querySelector('.page-transition-stage');
      const style = stage ? getComputedStyle(stage) : null;
      const rect = stage?.getBoundingClientRect();
      const visible = Boolean(stage && style && style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 0) > 0.01 && rect?.width > 1 && rect?.height > 1);
      const activeState = stage?.dataset.state || stage?.dataset.active || stage?.getAttribute('aria-hidden') === 'false';
      if(probe.transitionStageVisibleAt === null && (visible || activeState)) probe.transitionStageVisibleAt = performance.now();
      if(performance.now() - startAt < 1200) requestAnimationFrame(observeTransitionStage);
    };
    requestAnimationFrame(observeTransitionStage);
    try {
      window.__rapidNavObserver = new PerformanceObserver(list => {
        window.__rapidNavLongTasks.push(...list.getEntries().map(entry => ({
          startTime: entry.startTime,
          duration: entry.duration,
        })));
      });
      window.__rapidNavObserver.observe({ entryTypes: ['longtask'] });
    } catch {}
    let lastFrame = performance.now();
    const tick = now => {
      window.__rapidNavFrameGaps.push(now - lastFrame);
      lastFrame = now;
      if(now - startAt < 1200) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return { startAt, startIndex: probe.startIndex };
  });
  const pressCount = 5;
  for (let i = 0; i < pressCount; i += 1) {
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(100);
  }
  await settle(page, 760);
  return page.evaluate(({ pressCount }) => {
    const probe = window.__rapidNavProbe || {};
    const startAt = Number(probe.startAt || 0);
    const perf = window.__getRailPerfState?.() || window.__getOverviewPerfState?.() || {};
    const marks = perf.marks || {};
    const stages = (marks.stages || []).filter(stage => Number(stage.startAt || 0) >= startAt);
    const captures = (marks.captures || []).filter(capture => Number(capture.startedAt || 0) >= startAt);
    const longTasks = (window.__rapidNavLongTasks || []).filter(task => Number(task.startTime || 0) >= startAt);
    const frameGaps = (window.__rapidNavFrameGaps || []).filter(gap => Number.isFinite(gap));
    window.__rapidNavObserver?.disconnect?.();
    if(window.__rapidNavHandler) removeEventListener('swiss-slide-change', window.__rapidNavHandler);
    if(window.__rapidNavKeyHandler) removeEventListener('keydown', window.__rapidNavKeyHandler, true);
    if(window.__rapidNavOriginalTransition){
      window.__playPageTransition = window.__rapidNavOriginalTransition;
      window.__rapidNavOriginalTransition = null;
    }
    const keydowns = probe.keydowns || [];
    const acceptedChanges = probe.acceptedChanges || [];
    let searchIndex = 0;
    const keyResponseDelays = keydowns.map(keydown => {
      const acceptedIndex = acceptedChanges.findIndex((change, index) => index >= searchIndex && change.at >= keydown.at);
      if(acceptedIndex < 0) return null;
      searchIndex = acceptedIndex + 1;
      return Number((acceptedChanges[acceptedIndex].at - keydown.at).toFixed(1));
    });
    return {
      pressCount,
      startIndex: probe.startIndex,
      endIndex: window.__currentSlideIndex || 0,
      acceptedCount: acceptedChanges.length,
      ignoredCount: Math.max(0, pressCount - acceptedChanges.length),
      keydownCount: keydowns.length,
      keyResponseDelays,
      maxKeyResponseDelayMs: Number(keyResponseDelays.filter(value => value !== null).reduce((max, value) => Math.max(max, Number(value || 0)), 0).toFixed(1)),
      firstTransitionStartMs: probe.transitionStarts?.[0] ? Number((probe.transitionStarts[0].at - startAt).toFixed(1)) : null,
      transitionStageVisibleMs: probe.transitionStageVisibleAt === null ? null : Number((probe.transitionStageVisibleAt - startAt).toFixed(1)),
      transitionStarts: (probe.transitionStarts || []).map(item => ({
        atMs: Number((item.at - startAt).toFixed(1)),
        mode: item.mode,
      })),
      keydowns: keydowns.map(item => ({
        atMs: Number((item.at - startAt).toFixed(1)),
        index: item.index,
      })),
      acceptedChanges: acceptedChanges.map(item => ({
        atMs: Number((item.at - startAt).toFixed(1)),
        index: item.index,
      })),
      navigationState: window.__getDeckNavigationState?.() || null,
      longTasksOver50: longTasks.filter(task => Number(task.duration || 0) > 50).length,
      maxLongTaskMs: Number(longTasks.reduce((max, task) => Math.max(max, Number(task.duration || 0)), 0).toFixed(1)),
      maxFrameGapMs: Number(frameGaps.reduce((max, gap) => Math.max(max, Number(gap || 0)), 0).toFixed(1)),
      captureStarts: captures.length,
      scheduled: Boolean(perf.scheduled),
      queueLength: perf.queueLength ?? null,
      thumbnailStages: stages
        .filter(stage => /queue-nearby-overview-thumbs|fit-overview-thumbnails|observe-overview-thumbnails|dom-preview-thumbnail|overview-thumb-task|closed-rail-thumb-prewarm/.test(stage.type || ''))
        .map(stage => stage.type),
    };
  }, { pressCount });
}

async function runEditableTextCaretValidation(page) {
  await ensureEditMode(page);
  await page.evaluate(() => {
    window.__setActiveThemePack?.('theme01', { navigate: false });
    window.go?.(0, { animate: false, force: true });
    window.__queueNearbyOverviewThumbs?.();
    window.__fitOverviewThumbnails?.();
  });
  await page.waitForFunction(() => {
    const active = document.querySelector('#deck > .slide.active');
    const slideId = active?.dataset.vmSlideId || active?.dataset.slideId || '';
    const card = [...document.querySelectorAll('[data-rail-card="true"],[data-slide-rail-card="true"]')]
      .find(item => item.dataset.slideId === slideId || item.dataset.slideKey === slideId);
    const thumb = card?.querySelector('[data-overview-thumb="true"],[data-rail-thumb="true"]');
    return thumb?.dataset.overviewRendered === 'true' || thumb?.dataset.railRendered === 'true';
  }, undefined, { timeout: 9000 }).catch(() => {});
  await settle(page);
  return page.evaluate(async () => {
    const active = document.querySelector('#deck > .slide.active');
    const editable = active?.querySelector('[data-editable-id]');
    if(!editable) return { found: false, reason: 'no editable text on active slide' };
    const slideId = active?.dataset.vmSlideId || active?.dataset.slideId || '';
    const findActiveThumb = () => {
      const card = [...document.querySelectorAll('[data-rail-card="true"],[data-slide-rail-card="true"]')]
        .find(item => item.dataset.slideId === slideId || item.dataset.slideKey === slideId);
      const thumb = card?.querySelector('[data-overview-thumb="true"],[data-rail-thumb="true"]');
      return { card, thumb };
    };
    const readThumbState = () => {
      const { thumb } = findActiveThumb();
      const perf = window.__getOverviewPerfState?.() || {};
      return {
        revision: active?.dataset.overviewThumbRevision || '0',
        rendered: thumb?.dataset.overviewRendered === 'true' || thumb?.dataset.railRendered === 'true',
        queued: thumb?.dataset.overviewQueued === 'true' || thumb?.dataset.railQueued === 'true',
        placeholderCount: thumb?.querySelectorAll?.('[data-overview-placeholder="true"]').length || 0,
        cacheKeys: (perf.cacheKeys || []).filter(key => key.includes(`|${slideId}|`)),
        queuedKeys: (perf.queuedKeys || []).filter(key => key === slideId),
      };
    };
    editable.dataset.caretProbeId = `editable-caret-${Date.now()}`;
    const beforeNodeId = editable.dataset.caretProbeId;
    const beforeHtml = editable.innerHTML;
    const beforeText = editable.textContent || '';
    const baseText = beforeText.trim().length >= 6 ? beforeText : 'abcdef';
    editable.textContent = baseText;
    editable.setAttribute('contenteditable', 'true');
    const dirtyCalls = [];
    const originalDirty = window.__markOverviewThumbDirty;
    const originalRailDirty = window.__markRailThumbDirty;
    if(typeof originalDirty === 'function'){
      window.__markOverviewThumbDirty = function patchedDirty(slide){
        dirtyCalls.push({
          slideId: slide?.dataset.vmSlideId || slide?.dataset.slideId || '',
          phase: document.activeElement === editable || editable.contains(document.activeElement) ? 'input' : 'other',
          at: performance.now(),
        });
        return originalDirty.apply(this, arguments);
      };
      window.__markRailThumbDirty = window.__markOverviewThumbDirty;
    }
    const beforeThumb = readThumbState();
    editable.focus();
    const insertAt = Math.max(1, Math.min(3, baseText.length - 1));
    const textNode = editable.firstChild;
    const selection = getSelection();
    const range = document.createRange();
    range.setStart(textNode, insertAt);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    const beforeInputElement = document.activeElement;
    const insertText = 'XYZ';
    [...insertText].forEach((char, offset) => {
      const before = editable.textContent || '';
      document.execCommand?.('insertText', false, char);
      if((editable.textContent || '') === before){
        editable.firstChild.insertData(insertAt + offset, char);
        const fallbackRange = document.createRange();
        fallbackRange.setStart(editable.firstChild, insertAt + offset + 1);
        fallbackRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(fallbackRange);
        editable.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: char }));
      }
    });
    const inputDirtyCallCount = dirtyCalls.length;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const inputThumb = readThumbState();
    const current = active.querySelector(`[data-caret-probe-id="${beforeNodeId}"]`);
    const afterInputElement = document.activeElement;
    const afterSelection = getSelection();
    const afterRange = afterSelection?.rangeCount ? afterSelection.getRangeAt(0) : null;
    const afterText = current?.textContent || '';
    current?.blur();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const afterBlurDirtyCallCount = dirtyCalls.length - inputDirtyCallCount;
    const afterBlurThumb = readThumbState();
    const textState = window.__deckViewModel?.getState?.().text || {};
    const editableId = current?.dataset.editableId || '';
    if(typeof originalDirty === 'function'){
      window.__markOverviewThumbDirty = originalDirty;
      window.__markRailThumbDirty = originalRailDirty || originalDirty;
    }
    return {
      found: true,
      editableId,
      slideId,
      beforeHtml,
      beforeText,
      afterText,
      insertedText: insertText,
      expectedCaretOffset: insertAt + insertText.length,
      afterCaretOffset: afterRange && afterRange.startContainer === current?.firstChild ? afterRange.startOffset : null,
      sameElementDuringInput: beforeInputElement === afterInputElement && current?.dataset.caretProbeId === beforeNodeId,
      activeInsideEditableDuringInput: afterInputElement === current || current?.contains(afterInputElement),
      textStateHasEditableKey: Object.prototype.hasOwnProperty.call(textState, editableId),
      persistedHtml: textState[editableId] || '',
      dirtyCalls,
      inputDirtyCallCount,
      afterBlurDirtyCallCount,
      beforeThumb,
      inputThumb,
      afterBlurThumb,
    };
  });
}

async function runRailThumbFitValidation(page) {
  await ensureEditMode(page);
  await page.evaluate(() => {
    window.__setActiveThemePack?.('theme01', { navigate: false });
    window.go?.(0, { animate: false, force: true });
    window.__queueNearbyOverviewThumbs?.();
    window.__fitOverviewThumbnails?.();
  });
  await page.waitForFunction(() => {
    const rendered = document.querySelectorAll('[data-rail-thumb="true"][data-rail-rendered="true"],[data-overview-thumb="true"][data-overview-rendered="true"]').length;
    return rendered >= 4;
  }, undefined, { timeout: 9000 });
  await settle(page);
  return page.evaluate(() => {
    const samples = [...document.querySelectorAll('[data-rail-card="true"],[data-slide-rail-card="true"]')]
      .map(card => {
        const wrap = card.querySelector('[data-rail-thumb="true"],[data-overview-thumb="true"]');
        const content = wrap?.firstElementChild;
        if(!wrap || !content) return null;
        const wrapRect = wrap.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();
        return {
          index: Number(card.dataset.index || -1),
          rendered: wrap.dataset.railRendered === 'true' || wrap.dataset.overviewRendered === 'true',
          wrapWidth: wrapRect.width,
          wrapHeight: wrapRect.height,
          wrapAspect: wrapRect.width / wrapRect.height,
          contentWidth: contentRect.width,
          contentHeight: contentRect.height,
          gapLeft: contentRect.left - wrapRect.left,
          gapTop: contentRect.top - wrapRect.top,
          gapRight: wrapRect.right - contentRect.right,
          gapBottom: wrapRect.bottom - contentRect.bottom,
        };
      })
      .filter(Boolean)
      .filter(sample => sample.rendered)
      .slice(0, 8);
    return {
      sampleCount: samples.length,
      samples,
      maxRightGap: samples.reduce((max, sample) => Math.max(max, sample.gapRight), 0),
      maxBottomGap: samples.reduce((max, sample) => Math.max(max, sample.gapBottom), 0),
      maxAspectError: samples.reduce((max, sample) => Math.max(max, Math.abs(sample.wrapAspect - 16 / 9)), 0),
    };
  });
}

async function runRailInteractionWindow(page, action) {
  await page.evaluate(() => {
    window.__resetOverviewPerfMarks?.();
    window.__editorModeLongTasks = [];
    window.__editorModeLongTaskObserver?.disconnect?.();
    try {
      window.__editorModeLongTaskObserver = new PerformanceObserver(list => {
        window.__editorModeLongTasks.push(...list.getEntries().map(entry => ({
          startTime: entry.startTime,
          duration: entry.duration,
        })));
      });
      window.__editorModeLongTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch {}
    window.__editorModeInteractionStart = performance.now();
  });
  const startedAt = Date.now();
  await action();
  const actionElapsedMs = Date.now() - startedAt;
  await settle(page, 180);
  return page.evaluate((elapsedMs) => {
    const start = window.__editorModeInteractionStart || 0;
    const perf = window.__getRailPerfState?.() || window.__getOverviewPerfState?.() || {};
    const marks = perf.marks || {};
    const stages = (marks.stages || []).filter(stage => Number(stage.startAt || 0) >= start);
    const layoutReads = (marks.layoutReads || []).filter(read => Number(read.at || 0) >= start);
    const captures = (marks.captures || []).filter(capture => Number(capture.startedAt || 0) >= start);
    const longTasks = (window.__editorModeLongTasks || []).filter(task => Number(task.startTime || 0) >= start);
    window.__editorModeLongTaskObserver?.disconnect?.();
    return {
      elapsedMs,
      currentIndex: window.__currentSlideIndex || 0,
      captureStarts: captures.length,
      longTasksOver50: longTasks.filter(task => Number(task.duration || 0) > 50).length,
      maxLongTaskMs: longTasks.reduce((max, task) => Math.max(max, Number(task.duration || 0)), 0),
      buildStages: stages.filter(stage => /build-rail-catalog/.test(stage.type || '')).length,
      heavyStageTypes: stages
        .filter(stage => /fit-overview-thumbnails|observe-overview-thumbnails|queue-nearby-overview-thumbs|dom-preview-thumbnail|dom-derived-preview/.test(stage.type || ''))
        .map(stage => stage.type),
      layoutReadCount: layoutReads.reduce((sum, read) => sum + Number(read.count || 0), 0),
      queueLength: perf.queueLength ?? null,
    };
  }, actionElapsedMs);
}

async function runThemeSwitchRailValidation(page) {
  await ensureEditMode(page);
  await page.evaluate(() => {
    window.__deckViewModel?.setSkippedSlides?.([]);
    window.__deckViewModel?.setDeletedSlides?.([]);
    window.__setActiveThemePack?.('theme01', { navigate: false });
    window.go?.(0, { animate: false, force: true });
  });
  await settle(page);
  const before = await readRailThemeState(page);
  const theme02 = await switchThemeThroughPanel(page, 'theme02');
  const theme03 = await switchThemeThroughPanel(page, 'theme03');
  return { before, theme02, theme03 };
}

async function switchThemeThroughPanel(page, themePack) {
  const select = page.locator('#preview-theme-pack').first();
  if (await select.count()) {
    await select.selectOption(themePack);
  } else {
    await page.evaluate(themePack => window.__setActiveThemePack?.(themePack), themePack);
  }
  await settle(page, 450);
  return readRailThemeState(page);
}

async function readRailThemeState(page) {
  return page.evaluate(() => {
    const activeThemePack = document.documentElement.dataset.themePack || '';
    const allThemeSlides = [...document.querySelectorAll(`#deck > .slide[data-theme-pack="${activeThemePack}"]`)];
    const cards = [...document.querySelectorAll('[data-rail-card="true"],[data-slide-rail-card="true"]')].map(card => ({
      index: Number(card.dataset.index || -1),
      slideId: card.dataset.slideId || card.dataset.slideKey || '',
      themePack: card.__overviewSlide?.dataset.themePack || '',
      cacheKey: card.querySelector('[data-overview-thumb="true"],[data-rail-thumb="true"]')?.dataset.overviewKey || '',
    }));
    const perf = window.__getRailPerfState?.() || window.__getOverviewPerfState?.() || {};
    return {
      activeThemePack,
      expectedCount: allThemeSlides.filter(slide => !slide.hidden || slide.dataset.themePack === activeThemePack).length,
      cardCount: cards.length,
      wrongThemeCards: cards.filter(card => card.themePack && card.themePack !== activeThemePack).slice(0, 8),
      theme01Cards: cards.filter(card => /^theme01/.test(card.slideId)).length,
      cards: cards.slice(0, 12),
      cacheKeys: (perf.cacheKeys || []).slice(0, 24),
      activeSlideId: perf.activeSlideId || '',
    };
  });
}

async function runPresentValidation(page) {
  await ensureEditMode(page);
  await page.evaluate(() => window.__setActiveThemePack?.('theme01', { navigate: false }));
  await settle(page);
  await page.evaluate(() => window.go?.(0, { animate: false, force: true }));
  await settle(page);
  const before = await currentIndex(page);
  const presentButton = page.locator('#preview-present-btn,[data-present-toggle="true"],#preview-overview-btn').first();
  const entered = Boolean(await presentButton.count());
  if (entered) await presentButton.click();
  await settle(page, 500);
  const presentState = await readEditorPresenterState(page);
  const fullscreenState = await readFullscreenState(page);
  const presentLayout = await readLayoutState(page, page.viewportSize()?.width || 1440);
  await page.keyboard.press('ArrowRight');
  await settle(page, 720);
  const afterRight = await currentIndex(page);
  await page.mouse.click(1000, 450);
  await settle(page, 720);
  const afterClick = await currentIndex(page);
  const presentEditing = await readPresentEditGuards(page);
  const editBypass = await runPresentEditBypassValidation(page);
  const beforeExitIndex = await currentIndex(page);
  await page.keyboard.press('Escape');
  await settle(page, 650);
  const afterEsc = await readEditorPresenterState(page);
  const afterEscFullscreen = await readFullscreenState(page);
  const afterEscIndex = await currentIndex(page);
  const clickTargets = await runPresentClickTargetsValidation(page);
  return { entered, before, presentState, fullscreenState, presentLayout, afterRight, afterClick, presentEditing, editBypass, clickTargets, beforeExitIndex, afterEsc, afterEscFullscreen, afterEscIndex };
}

async function readFullscreenState(page) {
  return page.evaluate(() => {
    const fullscreen = document.fullscreenElement;
    return {
      hasFullscreenElement: Boolean(fullscreen),
      fullscreenId: fullscreen?.id || '',
      customExitButtonExists: Boolean(document.getElementById('present-exit-btn')),
    };
  });
}

async function readPresentEditGuards(page) {
  return page.evaluate(() => {
    const active = document.querySelector('#deck > .slide.active');
    const panel = document.getElementById('preview-panel');
    const rail = document.querySelector('#slide-rail,[data-slide-rail="true"]');
    const propInputs = panel?.querySelectorAll('input,button,select,textarea') || [];
    return {
      mode: document.body.dataset.mode || '',
      canEdit: Boolean(window.__canEditDeck?.()),
      editableCount: active?.querySelectorAll('[contenteditable="true"]').length || 0,
      panelVisible: isVisible(panel),
      panelInert: Boolean(panel?.inert),
      railVisible: isVisible(rail),
      railInert: Boolean(rail?.inert),
      enabledPanelControlCount: [...propInputs].filter(el => !el.disabled && !el.closest('[hidden]')).length,
    };

    function isVisible(el) {
      if (!el) return false;
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 2 && rect.height > 2;
    }
  });
}

async function runPresentClickTargetsValidation(page) {
  const kinds = ['background', 'text', 'slot', 'slotInner', 'media', 'mediaInner'];
  const results = {};
  for (const kind of kinds) {
    results[kind] = await runPresentClickTargetValidation(page, kind);
  }
  return results;
}

async function runPresentClickTargetValidation(page, kind) {
  await exitPresentForValidation(page);
  await ensureEditMode(page);
  const target = await preparePresentClickTarget(page, kind);
  if (!target?.found) return { kind, found: false };
  const button = page.locator('#preview-present-btn,[data-present-toggle="true"]').first();
  if (!(await button.count())) return { kind, found: true, entered: false };
  await page.evaluate(() => { window.__testFilePickerClicks = 0; });
  await button.click();
  await settle(page, 350);
  const before = await currentIndex(page);
  const targetBox = await getCurrentPresentTargetBox(page, kind);
  if (!targetBox?.found) {
    await exitPresentForValidation(page);
    return { kind, found: true, entered: true, targetVisible: false };
  }
  const cursor = await page.evaluate(({ x, y }) => {
    const element = document.elementFromPoint(x, y);
    return element ? getComputedStyle(element).cursor : '';
  }, targetBox);
  await page.mouse.click(targetBox.x, targetBox.y, { button: 'left' });
  await settle(page, 720);
  const afterLeft = await currentIndex(page);
  await page.mouse.click(targetBox.x, targetBox.y, { button: 'right' });
  await settle(page, 720);
  const afterRight = await currentIndex(page);
  const filePickerClicks = await page.evaluate(() => window.__testFilePickerClicks || 0);
  await exitPresentForValidation(page);
  return {
    kind,
    found: true,
    entered: true,
    targetVisible: true,
    before,
    afterLeft,
    afterRight,
    cursor,
    filePickerClicks,
    consumedEventsProbe: targetBox.consumedEventsProbe || false,
  };
}

async function preparePresentClickTarget(page, kind, minIndex = 0) {
  const descriptor = await page.evaluate(({ kind, minIndex }) => {
    const selectorMap = {
      text: '[data-editable-id]',
      slot: '[data-dashi-host-image-slot],image-slot,.gxn-slot,.pulse-imgframe,.acl-slot,.kx-imgslot,.dslot,.bt-image-slot',
      slotInner: '[data-dashi-host-image-slot],image-slot,.gxn-slot,.pulse-imgframe,.acl-slot,.kx-imgslot,.dslot,.bt-image-slot',
      media: 'video,iframe,canvas,.bt-unicorn-frame,[data-unicorn-json-file-path],[data-unicorn-project-id]',
      mediaInner: 'video,iframe,canvas,.bt-unicorn-frame,[data-unicorn-json-file-path],[data-unicorn-project-id]',
      background: '',
    };
    const selector = selectorMap[kind] || '';
    const themePacks = [...new Set([...document.querySelectorAll('#deck > .slide')]
      .map(slide => slide.dataset.themePack || '')
      .filter(Boolean))];
    for(const themePack of themePacks){
      window.__setActiveThemePack?.(themePack, { navigate: false });
      const visibleSlides = window.__getVisibleSlides?.() || [];
      for(let index = Math.max(0, minIndex || 0); index < visibleSlides.length; index += 1){
        const slide = visibleSlides[index];
        const target = kind === 'background' ? slide : slide.querySelector(selector);
        if(!target) continue;
        window.go?.(index, { animate: false, force: true });
        return {
          found: true,
          kind,
          themePack,
          index,
          slideId: slide.dataset.vmSlideId || slide.dataset.slideId || '',
        };
      }
    }
    return { found: false, kind };
  }, { kind, minIndex });
  await settle(page, 320);
  return descriptor;
}

async function getCurrentPresentTargetBox(page, kind) {
  return page.evaluate((kind) => {
    const slide = document.querySelector('#deck > .slide.active');
    if(!slide) return { found: false };
    const selectorMap = {
      text: '[data-editable-id]',
      slot: '[data-dashi-host-image-slot],image-slot,.gxn-slot,.pulse-imgframe,.acl-slot,.kx-imgslot,.dslot,.bt-image-slot',
      slotInner: '[data-dashi-host-image-slot],image-slot,.gxn-slot,.pulse-imgframe,.acl-slot,.kx-imgslot,.dslot,.bt-image-slot',
      media: 'video,iframe,canvas,.bt-unicorn-frame,[data-unicorn-json-file-path],[data-unicorn-project-id]',
      mediaInner: 'video,iframe,canvas,.bt-unicorn-frame,[data-unicorn-json-file-path],[data-unicorn-project-id]',
    };
    let target = kind === 'background' ? slide : slide.querySelector(selectorMap[kind] || '');
    if(!target) return { found: false };
    if(kind === 'slotInner' || kind === 'mediaInner'){
      const visibleChildren = [...target.querySelectorAll('*')].filter(child => {
        const rect = child.getBoundingClientRect();
        const style = getComputedStyle(child);
        return rect.width > 4 && rect.height > 4 && style.display !== 'none' && style.visibility !== 'hidden';
      });
      if(visibleChildren.length) target = visibleChildren[visibleChildren.length - 1];
      if(!target.__presentConsumedEventsProbe){
        target.addEventListener('mousedown', event => event.stopPropagation());
        target.addEventListener('click', event => event.stopPropagation());
        target.__presentConsumedEventsProbe = true;
      }
    }
    const inputClick = HTMLInputElement.prototype.click;
    if(!HTMLInputElement.prototype.__dashiPickerProbe){
      HTMLInputElement.prototype.click = function patchedClick(){
        if(this.type === 'file') window.__testFilePickerClicks = (window.__testFilePickerClicks || 0) + 1;
        return inputClick.call(this);
      };
      HTMLInputElement.prototype.__dashiPickerProbe = true;
    }
    const rect = target.getBoundingClientRect();
    const x = Math.max(rect.left + Math.min(rect.width / 2, Math.max(8, rect.width - 8)), rect.left + 2);
    const y = Math.max(rect.top + Math.min(rect.height / 2, Math.max(8, rect.height - 8)), rect.top + 2);
    return {
      found: rect.width > 1 && rect.height > 1,
      x,
      y,
      width: rect.width,
      height: rect.height,
      consumedEventsProbe: kind === 'slotInner' || kind === 'mediaInner',
    };
  }, kind);
}

async function exitPresentForValidation(page) {
  await page.evaluate(() => {
    if(document.fullscreenElement) return document.exitFullscreen();
    if(document.body.dataset.mode === 'present') window.__exitPresentMode?.();
    return null;
  }).catch(() => {});
  await settle(page, 260);
}

async function runPresentEditBypassValidation(page) {
  return page.evaluate(async () => {
    const active = document.querySelector('#deck > .slide.active');
    const beforeEditableCount = active?.querySelectorAll('[contenteditable="true"]').length || 0;
    window.__setEditableTextMode?.(true);
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const afterForceEditableCount = active?.querySelectorAll('[contenteditable="true"]').length || 0;
    const target = active?.querySelector('[data-editable-id]');
    target?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
    target?.focus?.();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return {
      mode: document.body.dataset.mode || '',
      canEdit: Boolean(window.__canEditDeck?.()),
      beforeEditableCount,
      afterForceEditableCount,
      focusedEditable: Boolean(document.activeElement?.closest?.('[contenteditable="true"]')),
    };
  });
}

async function getRailState(page) {
  return page.evaluate(() => {
    const rail = document.querySelector('#slide-rail,[data-slide-rail="true"]');
    const scroller = document.querySelector('[data-rail-scroll="true"],#slide-rail-list') || rail;
    const cards = [...document.querySelectorAll('[data-rail-card="true"],[data-slide-rail-card="true"]')];
    const active = cards.find(card => card.dataset.railActive === 'true' || card.getAttribute('aria-current') === 'true');
    const firstThumb = cards[0]?.querySelector('[data-rail-thumb="true"],[data-overview-thumb="true"],[data-rail-frame="true"],[data-overview-frame="true"]');
    const thumbRect = firstThumb?.getBoundingClientRect();
    const activeRect = active?.getBoundingClientRect();
    const scrollRect = scroller?.getBoundingClientRect();
    const perf = window.__getRailPerfState?.() || window.__getOverviewPerfState?.() || null;
    return {
      exists: Boolean(rail),
      visible: isVisible(rail),
      cardCount: cards.length,
      activeIndex: active ? Number(active.dataset.index || -1) : -1,
      activeVisible: Boolean(activeRect && scrollRect && activeRect.top >= scrollRect.top - 2 && activeRect.bottom <= scrollRect.bottom + 2),
      thumbAspect: thumbRect ? thumbRect.width / thumbRect.height : 0,
      renderedCount: cards.filter(card => card.querySelector('[data-rail-thumb="true"][data-rail-rendered="true"],[data-overview-thumb="true"][data-overview-rendered="true"]')).length,
      placeholderCount: cards.filter(card => card.querySelector('[data-overview-placeholder="true"],[data-rail-placeholder="true"]')).length,
      cacheSize: perf?.cacheSize ?? null,
      queueLength: perf?.queueLength ?? null,
      lastDrop: perf?.lastDrop ?? null,
    };

    function isVisible(el) {
      if (!el) return false;
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 2 && rect.height > 2;
    }
  });
}

async function clickRailCard(page, index) {
  const selector = `[data-rail-card="true"][data-index="${index}"],[data-slide-rail-card="true"][data-index="${index}"]`;
  const locator = page.locator(selector).first();
  const exists = await locator.count();
  if (!exists) return { exists: false, before: await currentIndex(page), after: await currentIndex(page) };
  const before = await currentIndex(page);
  await locator.click();
  await settle(page);
  return { exists: true, before, after: await currentIndex(page) };
}

async function dragRailCard(page, fromIndex, toIndex) {
  const source = page.locator(`[data-rail-card="true"][data-index="${fromIndex}"],[data-slide-rail-card="true"][data-index="${fromIndex}"]`).first();
  const target = page.locator(`[data-rail-card="true"][data-index="${toIndex}"],[data-slide-rail-card="true"][data-index="${toIndex}"]`).first();
  if (!(await source.count()) || !(await target.count())) return { attempted: false };
  await source.scrollIntoViewIfNeeded();
  await target.scrollIntoViewIfNeeded();
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();
  if (!sourceBox || !targetBox) return { attempted: false };
  await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 5 });
  await page.mouse.up();
  await settle(page, 300);
  const perf = await page.evaluate(() => window.__getRailPerfState?.() || window.__getOverviewPerfState?.() || null);
  return { attempted: true, lastDrop: perf?.lastDrop || null };
}

async function runRailContextValidation(page) {
  await page.evaluate(() => {
    window.__deckViewModel?.setSkippedSlides?.([]);
    window.__deckViewModel?.setDeletedSlides?.([]);
    window.__refreshRailCatalog?.();
  });
  await settle(page);
  const menuProbe = await openRailContextMenu(page, { preferIndex: 6 });
  if (!menuProbe.hasCard) return { hasCard: false };
  const menuState = await page.evaluate(() => {
    const menu = document.querySelector('.rail-context-menu,.overview-context-menu');
    const buttons = [...(menu?.querySelectorAll('button') || [])].map(button => button.textContent?.trim() || '');
    return {
      hasCard: true,
      menuVisible: Boolean(menu && getComputedStyle(menu).display !== 'none'),
      hasSkip: buttons.some(text => /跳过|取消跳过/.test(text)),
      hasDelete: buttons.some(text => /删除/.test(text)),
      hasCopy: buttons.some(text => /复制/.test(text)),
    };
  });
  await page.keyboard.press('Escape').catch(() => {});
  await settle(page);

  const beforeCopy = await readRailCatalogState(page);
  const copyTarget = await chooseRailMutationTarget(page, { excludeSlideIds: [beforeCopy.activeSlideId], preferIndex: 4, requireEditable: true });
  const copy = copyTarget ? await clickRailContextAction(page, copyTarget.slideId, /复制页面|复制/) : { hasTarget: false };
  const afterCopy = await readRailCatalogState(page);
  await page.evaluate(() => window.__refreshRailCatalog?.());
  await settle(page);
  const afterCopyRefresh = await readRailCatalogState(page);
  const copiedSlideId = findCopiedSlideId(beforeCopy, afterCopy, copyTarget?.slideId);
  const copyTextIsolation = copiedSlideId ? await runCopyTextIsolation(page, copyTarget.slideId, copiedSlideId) : null;

  const beforeSkip = await readRailCatalogState(page);
  const skipTarget = await chooseRailMutationTarget(page, { excludeSlideIds: [beforeSkip.activeSlideId], preferIndex: 6 });
  const skip = skipTarget ? await clickRailContextAction(page, skipTarget.slideId, /跳过页面/) : { hasTarget: false };
  const afterSkip = await readRailCatalogState(page);
  await page.evaluate(() => window.__refreshRailCatalog?.());
  await settle(page);
  const afterSkipRefresh = await readRailCatalogState(page);

  const deleteTarget = await chooseRailMutationTarget(page, {
    excludeSlideIds: [afterSkip.activeSlideId, skipTarget?.slideId].filter(Boolean),
    preferIndex: 8,
  });
  const beforeDelete = await readRailCatalogState(page);
  const deletion = deleteTarget ? await clickRailContextAction(page, deleteTarget.slideId, /删除页面/) : { hasTarget: false };
  const afterDelete = await readRailCatalogState(page);
  await page.evaluate(() => window.__refreshRailCatalog?.());
  await settle(page);
  const afterDeleteRefresh = await readRailCatalogState(page);

  return {
    ...menuState,
    copy: {
      target: copyTarget,
      action: copy,
      before: beforeCopy,
      after: afterCopy,
      afterRefresh: afterCopyRefresh,
      copiedSlideId,
      textIsolation: copyTextIsolation,
    },
    skip: {
      target: skipTarget,
      action: skip,
      before: beforeSkip,
      after: afterSkip,
      afterRefresh: afterSkipRefresh,
    },
    delete: {
      target: deleteTarget,
      action: deletion,
      before: beforeDelete,
      after: afterDelete,
      afterRefresh: afterDeleteRefresh,
    },
  };
}

function findCopiedSlideId(before, after, sourceId) {
  if (!sourceId) return '';
  const beforeIds = new Set((before?.cards || []).map(card => card.slideId));
  const added = (after?.cards || []).filter(card => card.slideId && !beforeIds.has(card.slideId));
  if (added.length) return added[0].slideId;
  const beforeCount = (before?.cards || []).filter(card => card.slideId === sourceId).length;
  const repeated = (after?.cards || []).filter(card => card.slideId === sourceId);
  return repeated.length > beforeCount ? sourceId : '';
}

async function runCopyTextIsolation(page, sourceId, copiedId) {
  const prepare = await page.evaluate(({ sourceId, copiedId }) => {
    const visibleSlides = window.__getVisibleSlides?.() || [];
    const findIndex = id => visibleSlides.findIndex(slide => (slide.dataset.vmSlideId || slide.dataset.slideId || '') === id);
    const sourceIndex = findIndex(sourceId);
    const copyIndex = findIndex(copiedId);
    const source = visibleSlides[sourceIndex];
    const copy = visibleSlides[copyIndex];
    const sourceText = source?.querySelector('[data-editable-id]');
    const copyText = copy?.querySelector('[data-editable-id]');
    return {
      sourceIndex,
      copyIndex,
      sourceTextId: sourceText?.dataset.editableId || '',
      copyTextId: copyText?.dataset.editableId || '',
      sourceTextBefore: sourceText?.innerHTML || '',
      copyTextBefore: copyText?.innerHTML || '',
      sourceTextCount: source?.querySelectorAll('[data-editable-id]').length || 0,
      copyTextCount: copy?.querySelectorAll('[data-editable-id]').length || 0,
    };
  }, { sourceId, copiedId });
  if (prepare.sourceIndex < 0 || prepare.copyIndex < 0 || !prepare.sourceTextId || !prepare.copyTextId) {
    return { ...prepare, exercised: false };
  }
  const replacement = `COPY_ISOLATION_${Date.now()}`;
  await page.evaluate(({ copyIndex, replacement }) => {
    window.go?.(copyIndex, { animate: false, force: true });
    const active = document.querySelector('#deck > .slide.active');
    const el = active?.querySelector('[data-editable-id]');
    if(!el) return;
    el.innerHTML = replacement;
    el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: replacement }));
    el.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    window.__flushEditableTextState?.(active);
  }, { copyIndex: prepare.copyIndex, replacement });
  await settle(page);
  const after = await page.evaluate(({ sourceIndex, copyIndex }) => {
    const visibleSlides = window.__getVisibleSlides?.() || [];
    const source = visibleSlides[sourceIndex];
    const copy = visibleSlides[copyIndex];
    return {
      sourceTextAfter: source?.querySelector('[data-editable-id]')?.innerHTML || '',
      copyTextAfter: copy?.querySelector('[data-editable-id]')?.innerHTML || '',
      textStateKeys: Object.keys(window.__deckViewModel?.getState?.().text || {}),
    };
  }, { sourceIndex: prepare.sourceIndex, copyIndex: prepare.copyIndex });
  return {
    ...prepare,
    exercised: true,
    replacement,
    idsOverlap: prepare.sourceTextId === prepare.copyTextId,
    sourceChanged: after.sourceTextAfter === replacement,
    copyChanged: after.copyTextAfter === replacement,
    textStateHasCopyKey: after.textStateKeys.includes(prepare.copyTextId),
  };
}

async function openRailContextMenu(page, { preferIndex = 1, slideId = '' } = {}) {
  const selector = slideId
    ? `[data-rail-card="true"][data-slide-id="${slideId}"],[data-slide-rail-card="true"][data-slide-id="${slideId}"]`
    : `[data-rail-card="true"][data-index="${preferIndex}"],[data-slide-rail-card="true"][data-index="${preferIndex}"]`;
  const fallback = '[data-rail-card="true"]:not([aria-current="true"]),[data-slide-rail-card="true"]:not([aria-current="true"])';
  let card = page.locator(selector).first();
  if (!(await card.count())) card = page.locator(fallback).first();
  if (!(await card.count())) return { hasCard: false };
  await card.scrollIntoViewIfNeeded();
  await settle(page, 80);
  await card.evaluate(el => {
    const rect = el.getBoundingClientRect();
    el.dispatchEvent(new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      button: 2,
      clientX: rect.left + Math.min(16, rect.width / 2),
      clientY: rect.top + Math.min(16, rect.height / 2),
    }));
  });
  await settle(page);
  return { hasCard: true };
}

async function clickRailContextAction(page, slideId, label) {
  const opened = await openRailContextMenu(page, { slideId });
  if (!opened.hasCard) return { hasTarget: false, clicked: false };
  const button = page.locator('.rail-context-menu button,.overview-context-menu button').filter({ hasText: label }).first();
  const count = await button.count();
  if (!count) return { hasTarget: true, clicked: false };
  await button.click();
  await settle(page);
  return { hasTarget: true, clicked: true };
}

async function chooseRailMutationTarget(page, { excludeSlideIds = [], preferIndex = 1, requireEditable = false } = {}) {
  return page.evaluate(({ excludeSlideIds, preferIndex, requireEditable }) => {
    const excluded = new Set(excludeSlideIds);
    const visibleSlides = window.__getVisibleSlides?.() || [];
    const hasEditableText = slideId => {
      const slide = visibleSlides.find(item => (item.dataset.vmSlideId || item.dataset.slideId || '') === slideId);
      return Boolean(slide?.querySelector('[data-editable-id]'));
    };
    const cards = [...document.querySelectorAll('[data-rail-card="true"],[data-slide-rail-card="true"]')]
      .map(card => ({
        index: Number(card.dataset.index || -1),
        slideId: card.dataset.slideId || card.dataset.slideKey || '',
        active: card.getAttribute('aria-current') === 'true' || card.dataset.railActive === 'true',
      }))
      .filter(card => card.slideId && !card.active && !excluded.has(card.slideId) && (!requireEditable || hasEditableText(card.slideId)));
    return cards.find(card => card.index >= preferIndex) || cards[0] || null;
  }, { excludeSlideIds, preferIndex, requireEditable });
}

async function readRailCatalogState(page) {
  return page.evaluate(() => {
    const state = window.__deckViewModel?.getState?.() || {};
    const cards = [...document.querySelectorAll('[data-rail-card="true"],[data-slide-rail-card="true"]')].map(card => ({
      index: Number(card.dataset.index || -1),
      slideId: card.dataset.slideId || card.dataset.slideKey || '',
      active: card.getAttribute('aria-current') === 'true' || card.dataset.railActive === 'true',
      skippedBadge: Boolean(card.querySelector('.rail-skip-badge,.overview-skip-badge')),
    }));
    const visibleSlides = window.__getVisibleSlides?.() || [];
    const visibleSlideIds = visibleSlides.map((slide, index) => slide.dataset.vmSlideId || slide.dataset.slideId || slide.dataset.layout || `slide-${index + 1}`);
    return {
      cardCount: cards.length,
      playableCount: visibleSlides.length,
      skippedSlides: [...(state.skippedSlides || [])],
      deletedSlides: [...(state.deletedSlides || [])],
      activeSlideId: (window.__getRailPerfState?.() || window.__getOverviewPerfState?.() || null)?.activeSlideId || '',
      visibleSlideIds,
      cards,
    };
  });
}

async function runRailDirtyValidation(page) {
  await page.evaluate(() => {
    window.__queueNearbyOverviewThumbs?.();
  });
  await page.waitForFunction(() => {
    const perf = window.__getRailPerfState?.() || window.__getOverviewPerfState?.() || null;
    if (!perf?.activeSlideId || !perf?.cacheKeys?.length) return false;
    return perf.cacheKeys.some(key => key.includes(`|${perf.activeSlideId}|`));
  }, undefined, { timeout: 8000 });
  return page.evaluate(async () => {
    const perfBefore = window.__getRailPerfState?.() || window.__getOverviewPerfState?.() || null;
    const active = document.querySelector('#deck > .slide.active');
    const beforeKeys = perfBefore?.cacheKeys || [];
    window.__markRailThumbDirty?.(active);
    if (!window.__markRailThumbDirty && window.__markOverviewThumbDirty) window.__markOverviewThumbDirty(active);
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const perfAfter = window.__getRailPerfState?.() || window.__getOverviewPerfState?.() || null;
    const afterKeys = perfAfter?.cacheKeys || [];
    return {
      hasDirtyApi: typeof window.__markRailThumbDirty === 'function',
      fallbackOverviewDirtyApi: typeof window.__markOverviewThumbDirty === 'function',
      beforeCacheSize: perfBefore?.cacheSize ?? null,
      afterCacheSize: perfAfter?.cacheSize ?? null,
      removedCount: beforeKeys.filter(key => !afterKeys.includes(key)).length,
      activeSlideId: perfAfter?.activeSlideId || '',
      queueLength: perfAfter?.queueLength ?? null,
    };
  });
}

async function readExportState(page) {
  return page.evaluate(() => ({
    hasCaptureExportViewState: document.documentElement.outerHTML.includes('captureExportViewState'),
    htmlContainsOverviewExportState: /function captureExportViewState[\s\S]{0,700}(overviewOn|overviewDisplay|#overview|overview-on)/.test(document.documentElement.outerHTML)
      || /function restoreExportViewState[\s\S]{0,900}(overviewOn|overviewDisplay|#overview|overview-on)/.test(document.documentElement.outerHTML),
  }));
}

function validateResult(result) {
  const failures = [...result.staticChecks];
  const defaultEdit = result.defaultEdit;
  if (defaultEdit.mode !== 'edit') failures.push(`Default mode should be edit, got "${defaultEdit.mode || '(empty)'}".`);
  if (!defaultEdit.railExists || !defaultEdit.railVisible) failures.push('Default edit mode should show the left slide rail.');
  if (!defaultEdit.panelOpen || !defaultEdit.panelVisible) failures.push('Right panel should be open and visible by default in edit mode.');
  if (!defaultEdit.viewportVisible) failures.push('Deck viewport is not visible in default edit mode.');
  if (defaultEdit.overviewExists || defaultEdit.overviewVisible || defaultEdit.oldOverviewButtonExists) failures.push('Legacy overview UI must not exist in the user path.');
  if (!defaultEdit.canEdit || defaultEdit.editableCount < 1) failures.push('Edit mode should enable text editing independently of panel-open state.');
  if (!defaultEdit.presentButtonExists) failures.push('Play/present button is missing.');

  const defaultRail = result.defaultRailFirstScreen || {};
  if ((defaultRail.visibleRailCount || 0) < 4) failures.push(`Default rail first-screen validation did not find enough visible rail cards: ${JSON.stringify(defaultRail)}`);
  if (defaultRail.firstVisibleThumbReadyMs === null || defaultRail.firstVisibleThumbReadyMs > 500) {
    failures.push(`Default rail should start rendering visible thumbnails within 500ms without manual queue calls: ${JSON.stringify(defaultRail)}`);
  }
  if (defaultRail.allVisibleThumbsReadyMs === null || defaultRail.allVisibleThumbsReadyMs > 2500) {
    failures.push(`Default rail should load all visible first-screen thumbnails within 2500ms without manual queue calls: ${JSON.stringify(defaultRail)}`);
  }
  if ((findTimelineAt(defaultRail.timeline, 500)?.visibleRenderedCount || 0) < 1) failures.push(`Default rail still has no rendered visible thumbnail at 500ms: ${JSON.stringify(defaultRail)}`);
  if ((findTimelineAt(defaultRail.timeline, 5000)?.visiblePlaceholderCount || 0) > 0) failures.push(`Default rail still has visible placeholders at 5s: ${JSON.stringify(defaultRail)}`);
  if ((defaultRail.visiblePlaceholderCount || 0) > 0) failures.push(`Default rail first-screen thumbnails still show placeholders: ${JSON.stringify(defaultRail)}`);
  if (defaultRail.longTasksOver50 > 0 || defaultRail.maxLongTaskMs > 50) failures.push(`Default rail first-screen load caused a long task: ${JSON.stringify(defaultRail)}`);
  if (defaultRail.maxFrameGapMs > 120) failures.push(`Default rail first-screen load caused a large frame gap: ${JSON.stringify(defaultRail)}`);
  if (
    defaultRail.queueLength !== null
    && defaultRail.visibleOrNearCount !== null
    && defaultRail.queueLength > defaultRail.visibleOrNearCount + 2
  ) {
    failures.push(`Default rail first-screen load queued beyond visible/near range: ${JSON.stringify(defaultRail)}`);
  }
  for (const [theme, state] of Object.entries(result.themeRailFirstScreens || {})) {
    if ((state.visibleRailCount || 0) < 4) failures.push(`${theme} first-screen rail validation did not find enough visible cards: ${JSON.stringify(state)}`);
    if (state.activeThemePack !== theme) failures.push(`${theme} first-screen rail validation did not switch to the requested theme: ${JSON.stringify(state)}`);
    if (state.firstVisibleThumbReadyMs === null || state.firstVisibleThumbReadyMs > 900) {
      failures.push(`${theme} rail should load the first visible thumbnail within 900ms after theme switch: ${JSON.stringify(state)}`);
    }
    if (state.allVisibleThumbsReadyMs === null || state.allVisibleThumbsReadyMs > 5000) {
      failures.push(`${theme} rail should load all visible first-screen thumbnails within 5000ms after theme switch: ${JSON.stringify(state)}`);
    }
    if ((findTimelineAt(state.timeline, 1000)?.visibleRenderedCount || 0) < 1) failures.push(`${theme} rail still has no rendered visible thumbnail at 1s: ${JSON.stringify(state)}`);
    if ((findTimelineAt(state.timeline, 5000)?.visiblePlaceholderCount || 0) > 0) failures.push(`${theme} rail still has visible placeholders at 5s: ${JSON.stringify(state)}`);
    if ((state.visiblePlaceholderCount || 0) > 0) failures.push(`${theme} rail first-screen thumbnails still show placeholders: ${JSON.stringify(state)}`);
    if (
      state.queueLength !== null
      && state.visibleOrNearCount !== null
      && state.queueLength > state.visibleOrNearCount + 2
    ) {
      failures.push(`${theme} rail first-screen load queued beyond visible/near range: ${JSON.stringify(state)}`);
    }
  }

  for (const layout of result.layoutWidths) {
    if (layout.mode !== 'edit') failures.push(`Layout ${layout.viewportWidth}: expected edit mode.`);
    if (!layout.railVisible || !layout.panelVisible || !layout.deckVisible) failures.push(`Layout ${layout.viewportWidth}: rail, panel, and deck must all be visible.`);
    if (Math.abs(layout.aspect - 16 / 9) > 0.025) failures.push(`Layout ${layout.viewportWidth}: deck stage is not 16:9 (${layout.aspect}).`);
    if (layout.overlapsRail) failures.push(`Layout ${layout.viewportWidth}: deck overlaps left rail.`);
    if (layout.overlapsPanel) failures.push(`Layout ${layout.viewportWidth}: deck overlaps right panel.`);
    if (layout.panelRect && layout.panelRect.right > layout.viewportWidth + 1) failures.push(`Layout ${layout.viewportWidth}: right panel overflows the viewport.`);
  }

  if (result.editNavigation.afterRight <= result.editNavigation.start) failures.push('Edit mode ArrowRight should advance one page.');
  if (result.editNavigation.afterSpace !== result.editNavigation.afterRight) failures.push('Edit mode Space should not change page.');
  if (result.editNavigation.afterClick !== result.editNavigation.afterSpace) failures.push('Edit mode deck click should not advance page.');
  if (result.editNavigation.afterDown <= result.editNavigation.afterClick) failures.push('Edit mode ArrowDown should advance one page.');
  if (result.editNavigation.afterUp !== result.editNavigation.afterClick) failures.push('Edit mode ArrowUp should return to the previous page.');

  if (!result.editCapabilities.canEdit || result.editCapabilities.editableCount < 1) failures.push('Edit mode text editing capability is unavailable.');
  if (!result.editCapabilities.panelVisible || result.editCapabilities.propControlCount < 1) failures.push('Edit mode right-side property controls are unavailable.');

  for (const [name, perf] of Object.entries(result.railPerformance || {})) {
    if (perf.elapsedMs > 180) failures.push(`Rail ${name} interaction is too slow: ${perf.elapsedMs}ms.`);
    if (perf.longTasksOver50 > 0 || perf.maxLongTaskMs > 50) failures.push(`Rail ${name} interaction caused a long task: ${JSON.stringify(perf)}.`);
    if (perf.captureStarts > 0) failures.push(`Rail ${name} interaction started thumbnail capture work.`);
    if (perf.buildStages > 0) failures.push(`Rail ${name} interaction rebuilt the rail catalog.`);
    if (perf.heavyStageTypes?.length) failures.push(`Rail ${name} interaction triggered heavy thumbnail stages: ${perf.heavyStageTypes.join(', ')}`);
    if (perf.layoutReadCount >= result.rail.initial.cardCount) failures.push(`Rail ${name} interaction performed full catalog layout reads.`);
  }

  for (const [name, state] of Object.entries(result.railActiveSync || {})) {
    if (name === 'drag') continue;
    if (!state?.activeSlideId) failures.push(`Rail active sync ${name} did not report the active slide id.`);
    if (state?.activeCardCount !== 1) failures.push(`Rail active sync ${name} should have exactly one active rail card, got ${state?.activeCardCount}.`);
    if (state?.activeSlideId && state.activeCardSlideId !== state.activeSlideId) {
      failures.push(`Rail active sync ${name} mismatch: active slide ${state.activeSlideId}, rail card ${state.activeCardSlideId || '(none)'}.`);
    }
    if ((name === 'afterDirectGo' || name === 'afterDrag') && !state?.activeVisible) failures.push(`Rail active sync ${name} should keep the active card visible.`);
  }

  for (const [name, perf] of Object.entries(result.pageNavigationLatency?.edit || {})) {
    if (name === 'rapidArrowDown') continue;
    const shouldAnimate = name === 'arrowDown' || name === 'arrowUp';
    if (shouldAnimate) {
      if (perf.transitionStartMs === null || perf.transitionStartMs > 80) failures.push(`Edit navigation ${name} should start page transition within 80ms: ${JSON.stringify(perf)}`);
      if (perf.transitionStageVisibleMs === null || perf.transitionStageVisibleMs > 100) failures.push(`Edit navigation ${name} should make the transition stage visible within 100ms: ${JSON.stringify(perf)}`);
      if (perf.firstVisualChangeMs === null || perf.firstVisualChangeMs > 100) failures.push(`Edit navigation ${name} should show a visible response within 100ms: ${JSON.stringify(perf)}`);
      if (perf.activeChangeMs === null || perf.activeChangeMs > 320) failures.push(`Edit navigation ${name} should commit the active slide without visible delay: ${JSON.stringify(perf)}`);
      if (perf.transitionMode !== 'liquidMorph') failures.push(`Edit navigation ${name} should use the configured page transition: ${JSON.stringify(perf)}`);
    } else {
      if (perf.indexChangeMs === null || perf.indexChangeMs > 80) failures.push(`Edit navigation ${name} changed index too slowly: ${JSON.stringify(perf)}`);
      if (perf.activeChangeMs === null || perf.activeChangeMs > 80) failures.push(`Edit navigation ${name} changed active slide too slowly: ${JSON.stringify(perf)}`);
    }
    if (perf.longTasksOver50 > 0 || perf.maxLongTaskMs > 50) failures.push(`Edit navigation ${name} caused a long task: ${JSON.stringify(perf)}`);
    if (perf.maxFrameGapMs > 100) failures.push(`Edit navigation ${name} caused a large frame gap: ${JSON.stringify(perf)}`);
    if (perf.captureStarts > 0 || perf.scheduled || perf.thumbnailStages?.length || perf.queueLength > 0) {
      failures.push(`Edit navigation ${name} should not trigger thumbnail refresh/prewarm work: ${JSON.stringify(perf)}`);
    }
  }
  const rapid = result.pageNavigationLatency?.edit?.rapidArrowDown;
  if (!rapid) failures.push('Missing rapid edit ArrowDown navigation validation.');
  else {
    if (rapid.firstTransitionStartMs === null || rapid.firstTransitionStartMs > 80) failures.push(`Rapid edit navigation should start the first transition quickly: ${JSON.stringify(rapid)}`);
    if (rapid.transitionStageVisibleMs === null || rapid.transitionStageVisibleMs > 100) failures.push(`Rapid edit navigation should show a visible response quickly: ${JSON.stringify(rapid)}`);
    if (rapid.keydownCount !== rapid.pressCount) failures.push(`Rapid edit navigation did not observe every keydown: ${JSON.stringify(rapid)}`);
    if (rapid.acceptedCount < rapid.pressCount - 1) failures.push(`Rapid edit navigation swallowed too many ArrowDown presses: ${JSON.stringify(rapid)}`);
    if (rapid.endIndex < rapid.startIndex + rapid.pressCount - 1) failures.push(`Rapid edit navigation did not advance for rapid repeated input: ${JSON.stringify(rapid)}`);
    if ((rapid.keyResponseDelays || []).filter(value => value === null).length > 1) failures.push(`Rapid edit navigation left repeated inputs unaccepted: ${JSON.stringify(rapid)}`);
    if (rapid.maxKeyResponseDelayMs > 120) failures.push(`Rapid edit navigation kept input blocked too long: ${JSON.stringify(rapid)}`);
    if (rapid.longTasksOver50 > 0 || rapid.maxLongTaskMs > 50) failures.push(`Rapid edit navigation caused a long task: ${JSON.stringify(rapid)}`);
    if (rapid.maxFrameGapMs > 120) failures.push(`Rapid edit navigation caused a large frame gap: ${JSON.stringify(rapid)}`);
    if (rapid.captureStarts > 0 || rapid.scheduled || rapid.thumbnailStages?.length || rapid.queueLength > 0) {
      failures.push(`Rapid edit navigation should not trigger thumbnail/prewarm work: ${JSON.stringify(rapid)}`);
    }
  }
  const matrix = result.navigationRootCauseMatrix || {};
  if (!matrix.capabilities?.hasDiagnosticFlagsApi) failures.push('Navigation root-cause matrix requires diagnostic flags API to isolate thumbnail/prewarm work.');
  const editOn = matrix.editAnimationOnRailLoading || {};
  const editOff = matrix.editAnimationOff || {};
  const presentOn = matrix.presentAnimationOn || {};
  if (editOn.activeChangeMs === null || editOn.activeChangeMs > 320) failures.push(`Edit animation-on navigation commits too late in the real default path: ${JSON.stringify(editOn)}`);
  if (editOff.activeChangeMs === null || editOff.activeChangeMs > 120) failures.push(`Edit animation-off navigation should commit quickly: ${JSON.stringify(editOff)}`);
  if (presentOn.firstVisualChangeMs !== null && editOn.firstVisualChangeMs !== null && editOn.firstVisualChangeMs - presentOn.firstVisualChangeMs > 120) {
    failures.push(`Edit visual response is much slower than present mode: ${JSON.stringify({ editOn, presentOn })}`);
  }
  if (editOn.activeChangeMs !== null && editOff.activeChangeMs !== null && editOn.activeChangeMs - editOff.activeChangeMs > 250) {
    failures.push(`Edit navigation delay is dominated by the animation commit path: ${JSON.stringify({ editOn, editOff })}`);
  }
  for (const [name, perf] of Object.entries(result.pageNavigationLatency?.present || {})) {
    if (perf?.found === false) failures.push(`Present navigation ${name} did not find its click target.`);
    if (perf.indexChangeMs === null || perf.indexChangeMs > 120) failures.push(`Present navigation ${name} changed index too slowly: ${JSON.stringify(perf)}`);
    if (perf.activeChangeMs === null || perf.activeChangeMs > 120) failures.push(`Present navigation ${name} changed active slide too slowly: ${JSON.stringify(perf)}`);
    if (perf.longTasksOver50 > 0 || perf.maxLongTaskMs > 50) failures.push(`Present navigation ${name} caused a long task: ${JSON.stringify(perf)}`);
    if (perf.maxFrameGapMs > 120) failures.push(`Present navigation ${name} caused a large frame gap: ${JSON.stringify(perf)}`);
  }

  if (!result.editableTextCaret?.found) {
    failures.push(`Editable text caret validation did not exercise an in-slide text target: ${result.editableTextCaret?.reason || 'unknown'}.`);
  } else {
    if (!result.editableTextCaret.sameElementDuringInput) failures.push('Editable text node was replaced or lost focus during input.');
    if (!result.editableTextCaret.activeInsideEditableDuringInput) failures.push('Editable text lost active focus during input.');
    if (result.editableTextCaret.afterCaretOffset !== result.editableTextCaret.expectedCaretOffset) {
      failures.push(`Editable text caret moved during input: ${JSON.stringify(result.editableTextCaret)}`);
    }
    if (!result.editableTextCaret.afterText?.includes(result.editableTextCaret.insertedText || 'XYZ')) failures.push('Editable text did not keep the inserted value.');
    if (result.editableTextCaret.inputDirtyCallCount !== 0) failures.push(`Editable text input should not dirty thumbnails before blur: ${JSON.stringify(result.editableTextCaret)}`);
    if (result.editableTextCaret.beforeThumb?.revision !== result.editableTextCaret.inputThumb?.revision) {
      failures.push(`Editable text input changed thumbnail revision before blur: ${JSON.stringify(result.editableTextCaret)}`);
    }
    if (result.editableTextCaret.beforeThumb?.rendered && !result.editableTextCaret.inputThumb?.rendered) {
      failures.push(`Editable text input replaced the active rail thumbnail with a placeholder: ${JSON.stringify(result.editableTextCaret)}`);
    }
    if ((result.editableTextCaret.inputThumb?.placeholderCount || 0) > (result.editableTextCaret.beforeThumb?.placeholderCount || 0)) {
      failures.push(`Editable text input increased active rail thumbnail placeholders: ${JSON.stringify(result.editableTextCaret)}`);
    }
    if (result.editableTextCaret.inputThumb?.queued || (result.editableTextCaret.inputThumb?.queuedKeys || []).length) {
      failures.push(`Editable text input queued active thumbnail work before blur: ${JSON.stringify(result.editableTextCaret)}`);
    }
    if (result.editableTextCaret.afterBlurDirtyCallCount !== 1) failures.push(`Editable text blur should dirty the current slide once: ${JSON.stringify(result.editableTextCaret)}`);
    if (!result.editableTextCaret.dirtyCalls?.every(call => call.slideId === result.editableTextCaret.slideId)) {
      failures.push(`Editable text dirty calls should only target the active slide: ${JSON.stringify(result.editableTextCaret)}`);
    }
    if (!result.editableTextCaret.textStateHasEditableKey || !result.editableTextCaret.persistedHtml?.includes(result.editableTextCaret.insertedText || 'XYZ')) {
      failures.push(`Editable text change did not persist under its stable text key: ${JSON.stringify(result.editableTextCaret)}`);
    }
  }

  if ((result.railThumbFit?.sampleCount || 0) < 4) failures.push('Rail thumbnail fit validation did not collect enough rendered thumbnail samples.');
  if ((result.railThumbFit?.maxAspectError || 0) > 0.02) failures.push(`Rail thumbnail wrap should stay 16:9: ${JSON.stringify(result.railThumbFit)}`);
  if ((result.railThumbFit?.maxRightGap || 0) > 1.2 || (result.railThumbFit?.maxBottomGap || 0) > 1.2) {
    failures.push(`Rail thumbnail content does not fill its frame: ${JSON.stringify(result.railThumbFit)}`);
  }

  for (const theme of ['theme02', 'theme03']) {
    const state = result.themeSwitchRail?.[theme];
    if (!state) {
      failures.push(`Missing rail theme switch validation for ${theme}.`);
      continue;
    }
    if (state.activeThemePack !== theme) failures.push(`Theme switch expected ${theme}, got ${state.activeThemePack || '(empty)'}.`);
    if (state.cardCount !== state.expectedCount) failures.push(`${theme} rail card count mismatch: got ${state.cardCount}, expected ${state.expectedCount}.`);
    if (state.wrongThemeCards?.length) failures.push(`${theme} rail still has cards bound to another theme: ${JSON.stringify(state.wrongThemeCards)}`);
    if (state.theme01Cards > 0) failures.push(`${theme} rail still shows theme01 slide ids after theme switch.`);
    const wrongCache = (state.cacheKeys || []).filter(key => key && !key.startsWith(`${theme}|`) && state.cards.some(card => card.cacheKey === key));
    if (wrongCache.length) failures.push(`${theme} rail restored cache keys from the wrong theme: ${wrongCache.join(', ')}`);
  }

  const rail = result.rail;
  if (!rail.initial.exists || !rail.initial.visible) failures.push('Rail is missing or hidden.');
  if (rail.initial.cardCount < 70) failures.push(`Rail should contain the slide catalog, got ${rail.initial.cardCount} card(s).`);
  if (Math.abs(rail.initial.thumbAspect - 16 / 9) > 0.04) failures.push(`Rail thumbnails must be full 16:9, got aspect ${rail.initial.thumbAspect}.`);
  if (!rail.clickJump.exists || rail.clickJump.after !== 3) failures.push('Rail card click should jump to the clicked page.');
  if (!rail.afterScrollTarget.activeVisible) failures.push('Rail should scroll the active card into view.');
  if (!rail.drag.attempted || Number(rail.drag.lastDrop?.deckMoveCount || 0) !== 1) failures.push('Rail drag reorder should commit the real deck with one moved slide.');
  if (!rail.context.menuVisible || !rail.context.hasSkip || !rail.context.hasDelete || !rail.context.hasCopy) failures.push('Rail context menu should expose copy, skip, and delete actions.');
  if (!rail.context.copy?.target || !rail.context.copy?.action?.clicked) failures.push('Rail context copy action was not exercised.');
  else {
    const sourceId = rail.context.copy.target.slideId;
    const copiedId = rail.context.copy.copiedSlideId;
    if (!copiedId || copiedId === sourceId) failures.push('Rail copy action did not create a new stable vmSlideId.');
    if (rail.context.copy.after.cardCount !== rail.context.copy.before.cardCount + 1) failures.push('Rail copy action did not add one rail card.');
    const sourceIndex = rail.context.copy.after.cards.findIndex(card => card.slideId === sourceId);
    const copyIndex = rail.context.copy.after.cards.findIndex(card => card.slideId === copiedId);
    if (sourceIndex < 0 || copyIndex !== sourceIndex + 1) failures.push('Copied slide should be inserted immediately after the source slide.');
    if (!rail.context.copy.afterRefresh.cards.some(card => card.slideId === copiedId)) failures.push('Copied slide did not survive rail refresh.');
    const isolation = rail.context.copy.textIsolation || {};
    if (!isolation.exercised) failures.push('Copy text isolation validation was not exercised.');
    if (isolation.idsOverlap) failures.push('Copied slide text IDs overlap with the source slide.');
    if (!isolation.copyChanged || isolation.sourceChanged) failures.push('Editing copied slide text should not change the source slide.');
    if (!isolation.textStateHasCopyKey) failures.push('Copied slide text edit did not persist under the copy text key.');
  }
  if (!rail.context.skip?.target || !rail.context.skip?.action?.clicked) failures.push('Rail context skip action was not exercised.');
  else {
    const skippedId = rail.context.skip.target.slideId;
    if (!rail.context.skip.after.skippedSlides.includes(skippedId)) failures.push('Rail skip action did not persist skippedSlides.');
    if (rail.context.skip.after.playableCount !== rail.context.skip.before.playableCount - 1) failures.push('Rail skip action did not reduce playable slide count.');
    if (rail.context.skip.after.visibleSlideIds.includes(skippedId)) failures.push('Skipped slide remains reachable through playable slide navigation.');
    const skippedCard = rail.context.skip.afterRefresh.cards.find(card => card.slideId === skippedId);
    if (!skippedCard?.skippedBadge) failures.push('Rail skip action did not show a skipped badge after rail refresh.');
  }
  if (!rail.context.delete?.target || !rail.context.delete?.action?.clicked) failures.push('Rail context delete action was not exercised.');
  else {
    const deletedId = rail.context.delete.target.slideId;
    if (!rail.context.delete.after.deletedSlides.includes(deletedId)) failures.push('Rail delete action did not persist deletedSlides.');
    if (rail.context.delete.after.cardCount !== rail.context.delete.before.cardCount - 1) failures.push('Rail delete action did not remove one rail card.');
    if (rail.context.delete.after.visibleSlideIds.includes(deletedId)) failures.push('Deleted slide remains reachable through playable slide navigation.');
    if (rail.context.delete.afterRefresh.cards.some(card => card.slideId === deletedId)) failures.push('Rail delete action did not survive rail refresh.');
  }
  if (!rail.dirty.hasDirtyApi || rail.dirty.removedCount < 1) failures.push('Rail dirty invalidation should expose rail API and invalidate only the active slide cache.');

  const present = result.present;
  if (!present.entered) failures.push('Present button could not be clicked.');
  if (present.presentState.mode !== 'present') failures.push(`Clicking play should enter present mode, got "${present.presentState.mode || '(empty)'}".`);
  if (!present.fullscreenState.hasFullscreenElement) failures.push('Present mode must enter real browser fullscreen.');
  if (present.fullscreenState.customExitButtonExists) failures.push('Present mode should not render a custom exit button.');
  if (present.presentState.railVisible || present.presentState.panelVisible) failures.push('Present mode should hide rail and right panel.');
  if (present.presentState.canEdit || present.presentEditing.canEdit || present.presentEditing.editableCount > 0) failures.push('Present mode must disable text editing.');
  if (present.editBypass.afterForceEditableCount > 0 || present.editBypass.focusedEditable) failures.push('Present mode editable text guard can be bypassed through __setEditableTextMode(true).');
  if (present.presentEditing.enabledPanelControlCount > 0 && present.presentEditing.panelVisible) failures.push('Present mode must not expose enabled panel controls.');
  if (Math.abs(present.presentLayout.aspect - 16 / 9) > 0.025) failures.push('Present mode deck stage must remain 16:9.');
  if (present.presentLayout.deckRect && (present.presentLayout.deckRect.width < 1200 || present.presentLayout.deckRect.height < 675)) failures.push('Present mode deck should use the full viewport fit.');
  if (present.afterRight <= present.before) failures.push('Present mode ArrowRight should advance.');
  if (present.afterClick <= present.afterRight) failures.push('Present mode click should advance.');
  if (present.afterEsc.mode !== 'edit') failures.push('Escape should return from present mode to edit mode.');
  if (present.afterEscFullscreen?.hasFullscreenElement) failures.push('Pressing Escape should exit real browser fullscreen.');
  if (present.afterEscIndex !== present.afterClick) failures.push('Exiting present mode should preserve the current page.');
  for (const [kind, target] of Object.entries(present.clickTargets || {})) {
    if (!target.found) failures.push(`Present click target not found for ${kind}.`);
    if (!target.entered || !target.targetVisible) failures.push(`Present click target ${kind} was not clickable in present mode.`);
    if (target.afterLeft <= target.before) failures.push(`Present left-click on ${kind} did not advance.`);
    if (target.afterRight >= target.afterLeft) failures.push(`Present right-click on ${kind} did not go back.`);
    if (target.filePickerClicks > 0) failures.push(`Present click on ${kind} triggered file picker/edit behavior.`);
    if (/pointer|text|grab|move/i.test(target.cursor || '')) failures.push(`Present ${kind} cursor still looks editable: ${target.cursor}`);
  }

  if (result.exportState.htmlContainsOverviewExportState) failures.push('Export capture/restore still contains legacy overview fields.');
  return failures;
}

async function ensureEditMode(page) {
  const state = await readEditorPresenterState(page);
  if (state.mode === 'present') {
    await page.keyboard.press('Escape');
    await settle(page);
  }
}

async function currentIndex(page) {
  return page.evaluate(() => window.__currentSlideIndex || 0);
}

async function settle(page, ms = 280) {
  await page.waitForTimeout(ms);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

function getArg(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : '';
}

function sliceBetween(source, startNeedle, endNeedle) {
  const start = source.indexOf(startNeedle);
  if (start < 0) return '';
  const end = source.indexOf(endNeedle, start + startNeedle.length);
  return end > start ? source.slice(start, end) : source.slice(start);
}

async function startPreviewServer() {
  const port = await getFreePort();
  const child = spawn(process.execPath, ['scripts/serve-preview-https.mjs', 'output/theme-preview/ppt', String(port)], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(port), HOST: '127.0.0.1' },
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
    server.listen(0, '127.0.0.1', () => {
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
