#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import https from 'node:https';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { ACCEPTED_THEME_KEYS } from '../src/accepted-themes.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PREVIEW_ROOT = path.join(ROOT, 'output/theme-preview/ppt');
const PREVIEW_INDEX = path.join(PREVIEW_ROOT, 'index.html');
const CHROME_PATH = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const THRESHOLDS = {
  minCards: 70,
  visibleCards: 6,
  openFrameMs: 140,
  firstCardMs: 180,
  firstVisibleCardsMs: 220,
  allCardsMs: 420,
  hoverMs: 50,
  dragStartMs: 80,
  dragOverMs: 50,
  dropImmediateMs: 90,
  clickMs: 90,
  closeMs: 90,
  reopenMs: 140,
  interactionWindowMs: 300,
  backgroundWindowMs: 650,
  postScrollSettleMs: 2000,
  postScrollLongTaskCount: 2,
  repeatedOpenCount: 3,
  repeatedOpenReadyMs: 900,
  repeatedOpenWindowMs: 5200,
  repeatedOpenLongTaskCount: 2,
  postDropWindowMs: 3200,
  postDropLongTaskCount: 1,
  postDropCommitDelayMs: 650,
  postDropCommitDurationMs: 180,
  postDropProbeMs: 120,
  firstVisibleThumbReadyMs: 900,
  allVisibleThumbsReadyMs: 2500,
  visibleThumbReadyWindowMs: 2500,
  cachedInteractionMin: 6,
  interactionLongTaskMaxMs: 90,
  interactionLongTaskCount: 1,
  backgroundLongTaskMaxMs: 140,
  theme03OpenLongTaskCount: 2,
  theme03OpenLongTaskMaxMs: 90,
  theme03FrameGapMaxMs: 140,
  theme03FrameGapOver100MaxCount: 2,
  cacheApproxChars: 18 * 1024 * 1024,
  frameGapMaxMs: 180,
  frameGapHardMaxMs: 220,
  frameGapOver180MaxCount: 1,
  theme03VisualReadyMs: 5000,
  theme03PlaceholderFillMs: 13000,
  theme03VisibleValidRatio: 0.75,
  theme03ForeignObjectImages: 0,
  theme03SimilaritySampleCount: 8,
  theme03SimilarityMinScore: 0.82,
  theme03SimilarityMaxMeanAbs: 0.18,
  theme03SimilarityMaxEdgeAbs: 0.18,
  theme02AnimationSampleCount: 8,
  theme02SimilarityMinScore: 0.72,
  theme02BlackRatioMax: 0.58,
  theme02VisualReadyMs: 5000,
  fullFrameFitSampleCount: 8,
  fullFrameFitMinScore: 0.82,
  fullFrameFitMaxMeanAbs: 0.2,
  fullFrameFitMaxBorderAbs: 0.24,
  dirtyImmediateMs: 80,
  deckCommitMoveCount: 2,
  cacheDomNodeCount: 16000,
};

const cliUrl = getArg('--url');

if (!existsSync(CHROME_PATH)) {
  throw new Error(`Chrome executable not found: ${CHROME_PATH}
Set CHROME_PATH to a local Chrome/Chromium executable and rerun npm run validate:overview-performance.`);
}

if (!existsSync(PREVIEW_INDEX) && !cliUrl) {
  throw new Error(`Preview file missing: ${PREVIEW_INDEX}
Run npm run render:themes first, or pass --url to an existing preview.`);
}

const server = cliUrl ? null : await startPreviewServer();
const url = cliUrl || server.url;
const browser = await chromium.launch({ headless: true, executablePath: CHROME_PATH });
let page;

try {
  page = await browser.newPage({ viewport: { width: 1500, height: 950 }, ignoreHTTPSErrors: true });
  page.setDefaultTimeout(30000);
  await page.goto(`${url}?overview_perf=${Date.now()}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#deck > .slide.active, #deck > .slide[data-deck-active]');
  await installLongTaskObserver(page);
  await assertPerfApi(page);
  await page.evaluate(async () => {
    window.__setActiveThemePack?.('theme01', { navigate: false });
    window.go?.(0, { animate: false, force: true });
    window.__resetOverviewPerfMarks?.();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });

  const openStart = await now(page);
  await openRailForValidation(page);
  await nextFrame(page);
  const openFrameEnd = await now(page);

  await page.waitForFunction(() => document.querySelectorAll('[data-overview-card="true"]').length > 0);
  const firstCardAt = await now(page);

  await page.waitForFunction((minimumVisible) => {
    return getVisibleOverviewCardCount() >= minimumVisible;

    function getVisibleOverviewCardCount() {
      const overview = document.getElementById('slide-rail-list');
      if (!overview) return 0;
      const rootRect = overview.getBoundingClientRect();
      return [...document.querySelectorAll('[data-overview-card="true"]')]
        .filter(card => {
          const rect = card.getBoundingClientRect();
          return rect.bottom >= rootRect.top && rect.top <= rootRect.bottom;
        }).length;
    }
  }, THRESHOLDS.visibleCards);
  const firstVisibleCardsAt = await now(page);

  await page.waitForFunction((minimumCards) => window.__getOverviewPerfState?.().cardCount >= minimumCards, THRESHOLDS.minCards);
  const allCardsAt = await now(page);
  const coldVisibleThumbs = await measureVisibleThumbReadiness(page, openStart, THRESHOLDS.visibleThumbReadyWindowMs);

  const backgroundStart = await now(page);
  await page.waitForTimeout(THRESHOLDS.backgroundWindowMs);
  const backgroundEnd = await now(page);
  const stateAfterBackground = await getState(page);
  const progressAfterBackground = await getOverviewProgressState(page);

  const scrollMid = await measureInteraction(page, 'scrollMid', async () => {
    await scrollOverviewTo(page, 0.5);
  });
  const stateAfterScrollMid = await getState(page);

  const scrollBottom = await measureInteraction(page, 'scrollBottom', async () => {
    await scrollOverviewTo(page, 1);
  });
  const stateAfterScrollBottom = await getState(page);

  const scrollTop = await measureInteraction(page, 'scrollTop', async () => {
    await scrollOverviewTo(page, 0);
  });
  const stateAfterScrollTop = await getState(page);

  const postScrollStart = await now(page);
  await page.waitForTimeout(THRESHOLDS.postScrollSettleMs);
  const postScrollEnd = await now(page);
  const stateAfterScrollStable = await getState(page);
  const loadedStateAfterScroll = await getOverviewLoadedState(page);

  const hoverBox = await page.locator('[data-overview-card="true"]').first().boundingBox();
  if (!hoverBox) throw new Error('Hover card box missing');
  const hover = await measureInteraction(page, 'hover', async () => {
    await page.mouse.move(hoverBox.x + hoverBox.width / 2, hoverBox.y + hoverBox.height / 2);
    await nextFrame(page);
  });
  const stateAfterHover = await getState(page);

  const source = page.locator('[data-overview-card="true"][data-index="2"]');
  await source.scrollIntoViewIfNeeded();
  const sourceBox = await source.boundingBox();
  if (!sourceBox) throw new Error('Source overview card box missing');
  const dragStart = await measureInteraction(page, 'dragStart', async () => {
    await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(sourceBox.x + sourceBox.width / 2 + 10, sourceBox.y + sourceBox.height / 2 + 10, { steps: 2 });
    await nextFrame(page);
  });
  const stateDuringDrag = await getState(page);

  const dragOverSamples = [];
  const target = page.locator('[data-overview-card="true"][data-index="7"]');
  await target.scrollIntoViewIfNeeded();
  const targetBox = await target.boundingBox();
  if (!targetBox) throw new Error('Target overview card box missing');
  for (let step = 0; step < 4; step += 1) {
    const dragOver = await measureImmediate(page, `dragOver${step}`, async () => {
      await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2 + step * 5, { steps: 1 });
      await nextFrame(page);
    });
    dragOverSamples.push(dragOver.durationMs);
  }

  const drop = await measureInteraction(page, 'drop', async () => {
    await page.mouse.up();
    await nextFrame(page);
  });
  const stateAfterDropFrame = await getState(page);

  await page.waitForFunction(() => {
    const state = window.__getOverviewPerfState?.();
    return state?.lastDrop?.deckCommittedAt && state.lastDrop.deckCommittedAt > state.lastDrop.localDomCommittedAt;
  }, undefined, { timeout: 2500 });
  const stateAfterDropCommit = await getState(page);

  const click = await measureInteraction(page, 'click', async () => {
    await page.locator('[data-overview-card="true"][data-index="1"]').click();
    await nextFrame(page);
  });
  const stateAfterClick = await getState(page);

  const reopenStart = await now(page);
  await openRailForValidation(page);
  await nextFrame(page);
  const reopenEnd = await now(page);
  await page.waitForFunction((minimumCards) => window.__getOverviewPerfState?.().cardCount >= minimumCards, THRESHOLDS.minCards);
  await page.waitForTimeout(THRESHOLDS.backgroundWindowMs);
  const stateAfterReopen = await getState(page);

  const dirtyResult = await runDirtyValidation(page);

  const close = await measureInteraction(page, 'close', async () => {
    await closeRailForValidation(page);
    await nextFrame(page);
  });
  const stateAfterClose = await getState(page);
  const repeatedOpen = await runRepeatedOpenValidation(page);
  const repeatedDrop = await runRepeatedDropValidation(page);
  const sortReturnCache = await runSortReturnCacheValidation(page);
  const fullFrameFit = await runFullFrameFitValidation(page);
  await page.goto(`${url}?overview_perf=${Date.now()}&phase=visual`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#deck > .slide.active, #deck > .slide[data-deck-active]');
  await installLongTaskObserver(page);
  await assertPerfApi(page);
  const theme03Visual = await runTheme03VisualValidation(page);
  const theme02Visual = await runTheme02AnimationValidation(page);
  const staticChecks = runStaticImplementationChecks();

  const result = {
    url,
    cards: stateAfterBackground.cardCount,
    timings: {
      openFrameMs: round(openFrameEnd - openStart),
      firstCardMs: round(firstCardAt - openStart),
      firstVisibleCardsMs: round(firstVisibleCardsAt - openStart),
      allCardsMs: round(allCardsAt - openStart),
      hoverMs: hover.durationMs,
      scrollMaxMs: Math.max(scrollMid.durationMs, scrollBottom.durationMs, scrollTop.durationMs),
      dragStartMs: dragStart.durationMs,
      dragOverMaxMs: Math.max(...dragOverSamples),
      dropImmediateMs: drop.durationMs,
      clickMs: click.durationMs,
      reopenMs: round(reopenEnd - reopenStart),
      closeMs: close.durationMs,
    },
    longTasks: {
      open: summarizeLongTasks(await longTasksInWindow(page, openStart, allCardsAt)),
      background: summarizeLongTasks(await longTasksInWindow(page, backgroundStart, backgroundEnd)),
      postScrollSettle: summarizeLongTasks(await longTasksInWindow(page, postScrollStart, postScrollEnd)),
      scrollMid: scrollMid.longTasks,
      scrollBottom: scrollBottom.longTasks,
      scrollTop: scrollTop.longTasks,
      hover: hover.longTasks,
      dragStart: dragStart.longTasks,
      drop: drop.longTasks,
      click: click.longTasks,
      close: close.longTasks,
    },
    captureStarts: {
      background: await captureStartsInWindow(page, backgroundStart, backgroundEnd),
      postScrollSettle: await captureStartsInWindow(page, postScrollStart, postScrollEnd),
      scrollMid: scrollMid.captureStarts,
      scrollBottom: scrollBottom.captureStarts,
      scrollTop: scrollTop.captureStarts,
      hover: hover.captureStarts,
      dragStart: dragStart.captureStarts,
      drop: drop.captureStarts,
      click: click.captureStarts,
      close: close.captureStarts,
    },
    states: {
      afterBackground: pickState(stateAfterBackground),
      afterScrollMid: pickState(stateAfterScrollMid),
      afterScrollBottom: pickState(stateAfterScrollBottom),
      afterScrollTop: pickState(stateAfterScrollTop),
      afterScrollStable: pickState(stateAfterScrollStable),
      afterHover: pickState(stateAfterHover),
      duringDrag: pickState(stateDuringDrag),
      afterDropFrame: pickState(stateAfterDropFrame),
      afterDropCommit: pickState(stateAfterDropCommit),
      afterClick: pickState(stateAfterClick),
      afterReopen: pickState(stateAfterReopen),
      afterClose: pickState(stateAfterClose),
    },
    loadedStateAfterScroll,
    progressAfterBackground,
    coldVisibleThumbs,
    dirtyResult,
    dragOverSamples,
    repeatedOpen,
    repeatedDrop,
    sortReturnCache,
    fullFrameFit,
    theme03Visual,
    theme02Visual,
    staticChecks,
  };

  const failures = validateResult(result, stateAfterReopen);
  if (failures.length) {
    console.error(JSON.stringify(result, null, 2));
    throw new Error(failures.join('\n'));
  }
  console.log(JSON.stringify(result, null, 2));
} finally {
  await closePage(page);
  await closeBrowser(browser);
  if (server) await server.close();
}

function getArg(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : '';
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
    await wait(120);
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
  await page.evaluate(() => window.__overviewPerfLongTaskObserver?.disconnect?.()).catch(() => {});
  await Promise.race([
    page.close({ runBeforeUnload: false }).catch(() => {}),
    wait(2000),
  ]);
}

async function closeBrowser(browser) {
  const browserProcess = typeof browser.process === 'function' ? browser.process() : null;
  await Promise.race([
    browser.close().catch(() => {}),
    wait(4000),
  ]);
  if (browserProcess && browserProcess.exitCode === null) browserProcess.kill('SIGKILL');
}

async function installLongTaskObserver(page) {
  await page.evaluate(() => {
    window.__overviewPerfLongTasks = [];
    if (!('PerformanceObserver' in window)) return;
    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        window.__overviewPerfLongTasks.push({
          name: entry.name,
          startTime: entry.startTime,
          duration: entry.duration,
        });
      }
    });
    observer.observe({ type: 'longtask', buffered: true });
    window.__overviewPerfLongTaskObserver = observer;
  });
}

async function assertPerfApi(page) {
  const hasApi = await page.evaluate(() => ({
    getState: typeof window.__getOverviewPerfState === 'function',
    reset: typeof window.__resetOverviewPerfMarks === 'function',
  }));
  if (!hasApi.getState || !hasApi.reset) {
    throw new Error('Overview perf debug API missing: expected window.__getOverviewPerfState and window.__resetOverviewPerfMarks');
  }
}

async function getState(page) {
  return page.evaluate(() => window.__getOverviewPerfState());
}

async function now(page) {
  return page.evaluate(() => performance.now());
}

async function nextFrame(page) {
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function openRailForValidation(page) {
  await page.evaluate(() => {
    window.__refreshRailCatalog?.();
  });
  await nextFrame(page);
}

async function closeRailForValidation(page) {
  await page.evaluate(() => {
    window.__cancelOverviewThumbQueue?.();
    window.__deferOverviewThumbs?.(650, 'validation-close');
  });
  await nextFrame(page);
}

async function scrollOverviewTo(page, ratio) {
  await page.evaluate(async (scrollRatio) => {
    const overview = document.getElementById('slide-rail-list');
    if (!overview) throw new Error('Overview element missing');
    const maxScroll = Math.max(0, overview.scrollHeight - overview.clientHeight);
    overview.scrollTop = Math.round(maxScroll * scrollRatio);
    overview.dispatchEvent(new Event('scroll', { bubbles: true }));
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }, ratio);
}

async function measureImmediate(page, label, fn) {
  const start = await now(page);
  await fn();
  const end = await now(page);
  return {
    label,
    start,
    end,
    durationMs: round(end - start),
    longTasks: summarizeLongTasks(await longTasksInWindow(page, start, end)),
    captureStarts: await captureStartsInWindow(page, start, end),
  };
}

async function measureInteraction(page, label, fn) {
  const start = await now(page);
  await fn();
  const immediateEnd = await now(page);
  await page.waitForTimeout(THRESHOLDS.interactionWindowMs);
  const windowEnd = await now(page);
  return {
    label,
    start,
    immediateEnd,
    windowEnd,
    durationMs: round(immediateEnd - start),
    longTasks: summarizeLongTasks(await longTasksInWindow(page, start, windowEnd)),
    captureStarts: await captureStartsInWindow(page, start, windowEnd),
  };
}

async function longTasksInWindow(page, start, end) {
  return page.evaluate(({ start, end }) => {
    return (window.__overviewPerfLongTasks || []).filter(task => {
      const taskStart = task.startTime;
      const taskEnd = task.startTime + task.duration;
      return taskEnd >= start && taskStart <= end;
    });
  }, { start, end });
}

async function captureStartsInWindow(page, start, end) {
  return page.evaluate(({ start, end }) => {
    const captures = window.__getOverviewPerfState?.().marks?.captures || [];
    return captures
      .map(capture => ({
        slideId: capture.slideId || capture.key || '',
        trigger: capture.trigger || capture.reason || '',
        startedAt: Number(capture.startedAt ?? capture.startAt ?? capture.start ?? 0),
      }))
      .filter(capture => capture.startedAt >= start && capture.startedAt <= end);
  }, { start, end });
}

function summarizeLongTasks(tasks) {
  const durations = tasks.map(task => Math.round(task.duration));
  return {
    count: durations.length,
    countOver50: durations.filter(ms => ms >= 50).length,
    maxMs: durations.length ? Math.max(...durations) : 0,
  };
}

function pickState(state) {
  return {
    overviewOn: state.overviewOn,
    cardCount: state.cardCount,
    renderedCount: state.renderedCount,
    visibleOrNearCount: state.visibleOrNearCount,
    queueLength: state.queueLength,
    processing: state.processing,
    scheduled: state.scheduled,
    pauseRemainingMs: Math.round(state.pauseRemainingMs || 0),
    cacheSize: state.cacheSize,
    cacheLimit: state.cacheLimit,
    cacheApproxChars: state.cacheApproxChars,
    cacheDomNodeCount: state.cacheDomNodeCount,
    cacheDomEntryCount: state.cacheDomEntryCount,
    activeSlideId: state.activeSlideId,
    cacheKeys: state.cacheKeys,
    queuedKeys: state.queuedKeys,
    lastDrop: state.lastDrop,
    layoutReads: state.marks?.layoutReads || [],
    captureCount: state.marks?.captures?.length || 0,
  };
}

async function getOverviewLoadedState(page) {
  return page.evaluate(() => {
    const overview = document.getElementById('slide-rail-list');
    const state = window.__getOverviewPerfState?.() || {};
    if (!overview) {
      return {
        fullLoaded: false,
        visibleViewportLoaded: false,
        visibleViewportRendered: 0,
        visibleViewportCount: 0,
        visibleOrNearLoaded: false,
        visibleOrNearRendered: 0,
        visibleOrNearCount: 0,
      };
    }
    const rootRect = overview.getBoundingClientRect();
    const nearMargin = 720;
    const viewportWraps = [...overview.querySelectorAll('[data-overview-thumb="true"]')].filter(wrap => {
      const rect = wrap.getBoundingClientRect();
      return rect.bottom >= rootRect.top && rect.top <= rootRect.bottom;
    });
    const nearWraps = [...overview.querySelectorAll('[data-overview-thumb="true"]')].filter(wrap => {
      const rect = wrap.getBoundingClientRect();
      return rect.bottom >= rootRect.top - nearMargin && rect.top <= rootRect.bottom + nearMargin;
    });
    const visibleViewportRendered = viewportWraps.filter(wrap => wrap.dataset.overviewRendered === 'true').length;
    const visibleOrNearRendered = nearWraps.filter(wrap => wrap.dataset.overviewRendered === 'true').length;
    const queueEmpty = Number(state.queueLength || 0) === 0 && !state.processing && !state.scheduled;
    return {
      fullLoaded: Number(state.renderedCount || 0) === Number(state.cardCount || 0) && queueEmpty,
      visibleViewportLoaded: viewportWraps.length > 0 && visibleViewportRendered === viewportWraps.length && queueEmpty,
      visibleViewportRendered,
      visibleViewportCount: viewportWraps.length,
      visibleOrNearLoaded: nearWraps.length > 0 && visibleOrNearRendered === nearWraps.length && queueEmpty,
      visibleOrNearRendered,
      visibleOrNearCount: nearWraps.length,
      queueEmpty,
    };
  });
}

async function measureVisibleThumbReadiness(page, openStart, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let firstAt = null;
  let allAt = null;
  let stats = await getVisibleThumbStats(page);
  while (Date.now() < deadline) {
    stats = await getVisibleThumbStats(page);
    const current = await now(page);
    if (!firstAt && stats.visibleCount > 0 && stats.visibleRenderedCount > 0) firstAt = current;
    if (stats.visibleCount > 0 && stats.visibleRenderedCount === stats.visibleCount) {
      allAt = current;
      break;
    }
    await page.waitForTimeout(80);
  }
  stats = await getVisibleThumbStats(page);
  return {
    ...stats,
    visibleViewportCount: stats.visibleCount,
    visibleViewportRenderedCount: stats.visibleRenderedCount,
    visibleViewportMissingCount: stats.visibleMissingCount,
    visibleViewportRenderedRatioAt2s: stats.visibleCount ? round(stats.visibleRenderedCount / stats.visibleCount) : 0,
    firstVisibleThumbReadyMs: firstAt ? round(firstAt - openStart) : null,
    allVisibleThumbsReadyMs: allAt ? round(allAt - openStart) : null,
    firstVisibleViewportThumbReadyMs: firstAt ? round(firstAt - openStart) : null,
    allVisibleViewportThumbsReadyMs: allAt ? round(allAt - openStart) : null,
    timeoutMs,
  };
}

async function getVisibleThumbStats(page) {
  return page.evaluate(() => {
    const state = window.__getOverviewPerfState?.();
    return {
      visibleCount: Number(state?.visibleCount || 0),
      visibleRenderedCount: Number(state?.visibleRenderedCount || 0),
      visibleMissingCount: Number(state?.visibleMissingCount || 0),
      renderedCount: Number(state?.visibleRenderedCount || 0),
    };
  });
}

async function getVisibleThumbVisualStats(page) {
  return page.evaluate(() => {
    const overview = document.getElementById('slide-rail-list');
    if (!overview) return { visibleCount: 0, validCount: 0, invalidCount: 0, brokenCount: 0, svgImageCount: 0, foreignObjectImageCount: 0, samples: [] };
    const rootRect = overview.getBoundingClientRect();
    const visibleWraps = [...overview.querySelectorAll('[data-overview-thumb="true"]')].filter(wrap => {
      const rect = wrap.getBoundingClientRect();
      return rect.bottom >= rootRect.top && rect.top <= rootRect.bottom;
    });
    const samples = visibleWraps.map((wrap, index) => inspectOverviewThumb(wrap, index));
    return {
      visibleCount: samples.length,
      validCount: samples.filter(sample => sample.valid).length,
      invalidCount: samples.filter(sample => !sample.valid).length,
      brokenCount: samples.filter(sample => sample.broken).length,
      svgImageCount: samples.filter(sample => sample.svgImage).length,
      foreignObjectImageCount: samples.filter(sample => sample.foreignObjectImage).length,
      samples,
    };

    function inspectOverviewThumb(wrap, index) {
      const img = wrap.querySelector('img');
      const src = img?.currentSrc || img?.src || '';
      if (!img) {
        const mode = wrap.dataset.overviewMode || '';
        const canvas = wrap.querySelector('[data-overview-thumb-canvas="true"]');
        if (canvas) {
          return inspectCanvasThumb(canvas, index, mode);
        }
        if (mode === 'dom-preview') {
          const images = [...wrap.querySelectorAll('img')];
          const loadedImages = images.filter(image => image.complete && image.naturalWidth > 0 && image.naturalHeight > 0).length;
          const textLength = (wrap.textContent || '').replace(/\s+/g, '').length;
          const elementCount = wrap.querySelectorAll('*').length;
          return { index, valid: false, reason: 'summary-card-rejected', mode, loadedImages, imageCount: images.length, textLength, elementCount };
        }
        if (mode === 'dom-clone' || mode === 'dom-fallback' || mode === 'dom-derived') {
          const images = [...wrap.querySelectorAll('img')];
          const loadedImages = images.filter(image => image.complete && image.naturalWidth > 0 && image.naturalHeight > 0).length;
          const textLength = (wrap.textContent || '').replace(/\s+/g, '').length;
          const elementCount = wrap.querySelectorAll('*').length;
          const hasDerivedPreview = !!wrap.querySelector('[data-overview-derived="true"]');
          const hasRuntimeRoot = hasDerivedPreview || !!wrap.querySelector('.imported-theme-root, .theme03-theme-shell, .rd-slide');
          const svgCount = wrap.querySelectorAll('svg').length;
          const visualElementCount = wrap.querySelectorAll('img,svg,canvas,video,[style*="background"],[style*="gradient"],[class*="chart"],[class*="visual"],[class*="image"],[class*="hero"],[class*="figure"],[class*="scene"]').length;
          const visualBoxCount = [...wrap.querySelectorAll('*')].filter(node => {
            const style = getComputedStyle(node);
            const hasPaint = style.backgroundImage !== 'none'
              || (style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent')
              || parseFloat(style.borderTopWidth) > 0
              || parseFloat(style.borderLeftWidth) > 0;
            const rect = node.getBoundingClientRect();
            return hasPaint && rect.width >= 8 && rect.height >= 8;
          }).length;
          const valid = hasRuntimeRoot && elementCount >= 12 && (loadedImages > 0 || svgCount > 0 || visualElementCount >= 4 || visualBoxCount >= 6);
          return { index, valid, reason: valid ? 'dom-preview-ok' : 'dom-preview-low-detail', mode, loadedImages, imageCount: images.length, svgCount, hasRuntimeRoot, hasDerivedPreview, visualElementCount, visualBoxCount, textLength, elementCount };
        }
        return { index, valid: false, reason: 'missing-img', mode };
      }
      const svgImage = /^data:image\/svg\+xml/i.test(src);
      const foreignObjectImage = svgImage && /foreignObject/i.test(safeDecode(src.slice(0, 8000)));
      if (!img.complete || img.naturalWidth <= 0 || img.naturalHeight <= 0) {
        return { index, valid: false, broken: true, reason: 'not-loaded', svgImage, foreignObjectImage, mode: wrap.dataset.overviewMode || '' };
      }
      try {
        const canvas = document.createElement('canvas');
        const width = 96;
        const height = 54;
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        context.drawImage(img, 0, 0, width, height);
        const data = context.getImageData(0, 0, width, height).data;
        let nonWhite = 0;
        let nonTransparent = 0;
        let min = 255;
        let max = 0;
        for (let offset = 0; offset < data.length; offset += 16) {
          const r = data[offset];
          const g = data[offset + 1];
          const b = data[offset + 2];
          const a = data[offset + 3];
          if (a > 8) nonTransparent += 1;
          const value = (r + g + b) / 3;
          min = Math.min(min, value);
          max = Math.max(max, value);
          if (a > 8 && !(r > 246 && g > 246 && b > 246)) nonWhite += 1;
        }
        const nonWhiteRatio = nonTransparent ? nonWhite / nonTransparent : 0;
        const contrast = max - min;
        const valid = !foreignObjectImage && nonTransparent > 100 && nonWhiteRatio >= 0.025 && contrast >= 18;
        return {
          index,
          valid,
          reason: valid ? 'ok' : 'blank-or-low-detail',
          broken: false,
          svgImage,
          foreignObjectImage,
          nonWhiteRatio: Math.round(nonWhiteRatio * 1000) / 1000,
          contrast: Math.round(contrast * 10) / 10,
          mode: wrap.dataset.overviewMode || '',
        };
      } catch (error) {
        return {
          index,
          valid: false,
          broken: true,
          reason: `pixel-read-failed:${String(error?.message || error)}`,
          svgImage,
          foreignObjectImage,
          mode: wrap.dataset.overviewMode || '',
        };
      }
    }

    function inspectCanvasThumb(canvas, index, mode) {
      try {
        const width = Math.min(96, canvas.width || 96);
        const height = Math.min(54, canvas.height || 54);
        const sample = document.createElement('canvas');
        sample.width = width;
        sample.height = height;
        const context = sample.getContext('2d', { willReadFrequently: true });
        context.drawImage(canvas, 0, 0, width, height);
        const data = context.getImageData(0, 0, width, height).data;
        let nonWhite = 0;
        let nonTransparent = 0;
        let min = 255;
        let max = 0;
        for (let offset = 0; offset < data.length; offset += 16) {
          const r = data[offset];
          const g = data[offset + 1];
          const b = data[offset + 2];
          const a = data[offset + 3];
          if (a > 8) nonTransparent += 1;
          const value = (r + g + b) / 3;
          min = Math.min(min, value);
          max = Math.max(max, value);
          if (a > 8 && !(r > 246 && g > 246 && b > 246)) nonWhite += 1;
        }
        const nonWhiteRatio = nonTransparent ? nonWhite / nonTransparent : 0;
        const contrast = max - min;
        const valid = nonTransparent > 100 && nonWhiteRatio >= 0.025 && contrast >= 18;
        return {
          index,
          valid,
          reason: valid ? 'canvas-ok' : 'canvas-blank-or-low-detail',
          broken: false,
          svgImage: false,
          foreignObjectImage: false,
          nonWhiteRatio: Math.round(nonWhiteRatio * 1000) / 1000,
          contrast: Math.round(contrast * 10) / 10,
          mode,
        };
      } catch (error) {
        return {
          index,
          valid: false,
          broken: true,
          reason: `canvas-read-failed:${String(error?.message || error)}`,
          svgImage: false,
          foreignObjectImage: false,
          mode,
        };
      }
    }

    function safeDecode(value) {
      try {
        return decodeURIComponent(value);
      } catch {
        return value;
      }
    }
  });
}

async function waitForVisibleThumbVisualStats(page, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let stats = await getVisibleThumbVisualStats(page);
  while (Date.now() < deadline) {
    stats = await getVisibleThumbVisualStats(page);
    if (stats.visibleCount > 0 && stats.validCount === stats.visibleCount) break;
    await page.waitForTimeout(120);
  }
  return getVisibleThumbVisualStats(page);
}

async function waitForVisibleThumbsRendered(page, timeoutMs) {
  return page.evaluate(timeout => new Promise(resolve => {
    if (!window.__getOverviewPerfState) {
      resolve({ visibleCount: 0, renderedCount: 0 });
      return;
    }
    const snapshot = () => {
      const state = window.__getOverviewPerfState?.() || {};
      return {
        visibleCount: Number(state.visibleCount || 0),
        renderedCount: Number(state.visibleRenderedCount || 0),
      };
    };
    const finish = value => {
      clearInterval(interval);
      clearTimeout(timer);
      resolve(value);
    };
    const check = () => {
      const state = snapshot();
      if (state.visibleCount > 0 && state.renderedCount === state.visibleCount) finish(state);
    };
    const interval = setInterval(check, 80);
    const timer = setTimeout(() => finish(snapshot()), timeout);
    check();
  }), timeoutMs);
}

async function runTheme03SimilarityValidation(page, sampleCount = THRESHOLDS.theme03SimilaritySampleCount) {
  const result = await runThemeSimilarityValidation(page, { sampleCount, stableWaitMs: 220 });
  const failed = result.samples.filter(sample =>
    sample.score < THRESHOLDS.theme03SimilarityMinScore
    || sample.meanAbs > THRESHOLDS.theme03SimilarityMaxMeanAbs
    || sample.edgeAbs > THRESHOLDS.theme03SimilarityMaxEdgeAbs
  );
  return { ...result, failedCount: failed.length, failed };
}

async function runThemeSimilarityValidation(page, { sampleCount, stableWaitMs = 220 } = {}) {
  const indices = await page.evaluate((limit) => {
    const overview = document.getElementById('slide-rail-list');
    if (!overview) return [];
    const rootRect = overview.getBoundingClientRect();
    return [...overview.querySelectorAll('[data-overview-card="true"]')]
      .filter(card => {
        const frame = card.querySelector('[data-overview-frame="true"]');
        if (!frame) return false;
        const rect = frame.getBoundingClientRect();
        return rect.bottom >= rootRect.top && rect.top <= rootRect.bottom;
      })
      .slice(0, limit)
      .map(card => Number(card.dataset.index))
      .filter(Number.isFinite);
  }, sampleCount || THRESHOLDS.theme03SimilaritySampleCount);

  const samples = [];
  for (const index of indices) {
    await ensureOverviewClosed(page);
    await page.evaluate((slideIndex) => {
      window.go?.(slideIndex, { animate: false, force: true });
    }, index);
    await page.waitForFunction((slideIndex) => {
      const active = document.querySelector('#deck > .slide.active');
      return active && window.__currentSlideIndex === slideIndex;
    }, index);
    await page.waitForTimeout(stableWaitMs);
    const slideBuffer = await page.locator('#deck > .slide.active').screenshot({ type: 'png' });

    await ensureOverviewOpen(page);
    await page.waitForFunction((slideIndex) => {
      const card = document.querySelector(`[data-overview-card="true"][data-index="${slideIndex}"]`);
      const wrap = card?.querySelector('[data-overview-thumb="true"]');
      return wrap?.dataset.overviewRendered === 'true';
    }, index);
    const thumbBuffer = await page.locator(`[data-overview-card="true"][data-index="${index}"] [data-overview-frame="true"]`).screenshot({ type: 'png' });
    const metrics = await comparePngBuffers(page, slideBuffer, thumbBuffer);
    samples.push({ index, ...metrics });
  }
  const averageScore = samples.length ? samples.reduce((sum, sample) => sum + sample.score, 0) / samples.length : 0;
  return {
    sampleCount: samples.length,
    averageScore: round(averageScore),
    minScore: round(samples.reduce((min, sample) => Math.min(min, sample.score), samples.length ? 1 : 0)),
    maxMeanAbs: round(samples.reduce((max, sample) => Math.max(max, sample.meanAbs), 0)),
    maxEdgeAbs: round(samples.reduce((max, sample) => Math.max(max, sample.edgeAbs), 0)),
    maxBorderAbs: round(samples.reduce((max, sample) => Math.max(max, sample.borderAbs || 0), 0)),
    maxCandidateBlackRatio: round(samples.reduce((max, sample) => Math.max(max, sample.candidateBlackRatio || 0), 0)),
    samples,
  };
}

async function comparePngBuffers(page, referenceBuffer, candidateBuffer) {
  const reference = `data:image/png;base64,${referenceBuffer.toString('base64')}`;
  const candidate = `data:image/png;base64,${candidateBuffer.toString('base64')}`;
  return page.evaluate(async ({ reference, candidate }) => {
    const width = 96;
    const height = 54;
    const ref = await imageDataFromUrl(reference, width, height);
    const cand = await imageDataFromUrl(candidate, width, height);
    const refGray = grayscale(ref.data);
    const candGray = grayscale(cand.data);
    const referenceBlackRatio = blackRatio(ref.data);
    const candidateBlackRatio = blackRatio(cand.data);
    let meanAbs = 0;
    for (let index = 0; index < refGray.length; index += 1) {
      meanAbs += Math.abs(refGray[index] - candGray[index]);
    }
    meanAbs /= refGray.length * 255;
    const refEdge = edgeMap(refGray, width, height);
    const candEdge = edgeMap(candGray, width, height);
    let edgeAbs = 0;
    for (let index = 0; index < refEdge.length; index += 1) {
      edgeAbs += Math.abs(refEdge[index] - candEdge[index]);
    }
    edgeAbs /= refEdge.length * 255;
    let borderAbs = 0;
    let borderCount = 0;
    const borderX = 10;
    const borderY = 6;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (x >= borderX && x < width - borderX && y >= borderY && y < height - borderY) continue;
        const index = y * width + x;
        borderAbs += Math.abs(refGray[index] - candGray[index]);
        borderCount += 1;
      }
    }
    borderAbs = borderCount ? borderAbs / (borderCount * 255) : 0;
    const score = Math.max(0, 1 - (meanAbs * 0.62 + edgeAbs * 0.38));
    return {
      score: roundLocal(score),
      meanAbs: roundLocal(meanAbs),
      edgeAbs: roundLocal(edgeAbs),
      borderAbs: roundLocal(borderAbs),
      referenceBlackRatio: roundLocal(referenceBlackRatio),
      candidateBlackRatio: roundLocal(candidateBlackRatio),
    };

    async function imageDataFromUrl(url, targetWidth, targetHeight) {
      const image = new Image();
      image.decoding = 'sync';
      image.src = url;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.fillStyle = '#fff';
      context.fillRect(0, 0, targetWidth, targetHeight);
      context.drawImage(image, 0, 0, targetWidth, targetHeight);
      return context.getImageData(0, 0, targetWidth, targetHeight);
    }

    function grayscale(data) {
      const out = new Float32Array(data.length / 4);
      for (let offset = 0, index = 0; offset < data.length; offset += 4, index += 1) {
        out[index] = data[offset] * 0.299 + data[offset + 1] * 0.587 + data[offset + 2] * 0.114;
      }
      return out;
    }

    function blackRatio(data) {
      let black = 0;
      let total = 0;
      for (let offset = 0; offset < data.length; offset += 4) {
        if (data[offset + 3] <= 8) continue;
        total += 1;
        if (data[offset] < 24 && data[offset + 1] < 24 && data[offset + 2] < 24) black += 1;
      }
      return total ? black / total : 1;
    }

    function edgeMap(gray, width, height) {
      const out = new Float32Array(gray.length);
      for (let y = 1; y < height - 1; y += 1) {
        for (let x = 1; x < width - 1; x += 1) {
          const index = y * width + x;
          const gx = -gray[index - width - 1] - 2 * gray[index - 1] - gray[index + width - 1]
            + gray[index - width + 1] + 2 * gray[index + 1] + gray[index + width + 1];
          const gy = -gray[index - width - 1] - 2 * gray[index - width] - gray[index - width + 1]
            + gray[index + width - 1] + 2 * gray[index + width] + gray[index + width + 1];
          out[index] = Math.min(255, Math.sqrt(gx * gx + gy * gy) / 4);
        }
      }
      return out;
    }

    function roundLocal(value) {
      return Math.round(value * 1000) / 1000;
    }
  }, { reference, candidate });
}

async function sampleFrameGaps(page, durationMs) {
  return page.evaluate((duration) => new Promise(resolve => {
    const gaps = [];
    const samples = [];
    const start = performance.now();
    let last = start;
    function step(now) {
      const gap = now - last;
      gaps.push(gap);
      samples.push({ at: now - start, gap });
      last = now;
      if (now - start >= duration) {
        const maxSample = samples.reduce((best, sample) => !best || sample.gap > best.gap ? sample : best, null);
        resolve({
          durationMs: Math.round((now - start) * 10) / 10,
          maxGapMs: gaps.length ? Math.round(Math.max(...gaps) * 10) / 10 : 0,
          maxGapAtMs: maxSample ? Math.round(maxSample.at * 10) / 10 : 0,
          over100Count: gaps.filter(gap => gap >= 100).length,
          over180Count: gaps.filter(gap => gap >= 180).length,
          sampleCount: gaps.length,
        });
        return;
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }), durationMs);
}

async function getOverviewProgressState(page) {
  return page.evaluate(() => {
    const overview = document.getElementById('slide-rail-list');
    if (!overview) return { visible: false, blocksViewport: false, text: '', height: 0 };
    const progress = overview.querySelector('[data-overview-progress="true"]')
      || [...overview.children].find(child => /目录缩略图|当前视图/.test(child.textContent || ''));
    if (!progress) return { visible: false, blocksViewport: false, text: '', height: 0 };
    const rect = progress.getBoundingClientRect();
    const style = getComputedStyle(progress);
    const visible = !progress.hidden
      && style.display !== 'none'
      && style.visibility !== 'hidden'
      && Number(style.opacity || 1) > 0.01
      && rect.width > 0
      && rect.height > 0;
    const overviewRect = overview.getBoundingClientRect();
    return {
      visible,
      blocksViewport: visible && rect.bottom > overviewRect.top + 8,
      text: (progress.textContent || '').replace(/\s+/g, ' ').trim(),
      height: Math.round(rect.height),
      top: Math.round(rect.top - overviewRect.top),
      bottom: Math.round(rect.bottom - overviewRect.top),
    };
  });
}

async function runDirtyValidation(page) {
  await page.waitForFunction(() => {
    const state = window.__getOverviewPerfState?.();
    if (!state?.activeSlideId || !Array.isArray(state.cacheKeys)) return false;
    const activeKeyPart = `|${state.activeSlideId}|`;
    return state.cacheKeys.some(key => key.includes(activeKeyPart))
      && state.cacheKeys.some(key => !key.includes(activeKeyPart));
  }, undefined, { timeout: 5000 });

  const start = await now(page);
  const dirtyState = await page.evaluate(() => {
    const before = window.__getOverviewPerfState();
    const activeId = before.activeSlideId;
    const activeKeyPart = `|${activeId}|`;
    const beforeKeys = before.cacheKeys || [];
    const activeKeysBefore = beforeKeys.filter(key => key.includes(activeKeyPart));
    const otherKeysBefore = beforeKeys.filter(key => !key.includes(activeKeyPart));
    const activeSlide = document.querySelector('#deck > .slide.active');
    window.__markOverviewThumbDirty?.(activeSlide);
    const after = window.__getOverviewPerfState();
    const afterKeys = after.cacheKeys || [];
    const removed = beforeKeys.filter(key => !afterKeys.includes(key));
    return {
      activeId,
      beforeKeys,
      afterKeys,
      activeKeysBefore,
      otherKeysBefore,
      removed,
      otherKeysStillPresent: otherKeysBefore.every(key => afterKeys.includes(key)),
      captureCountBefore: before.marks?.captures?.length || 0,
      captureCountAfter: after.marks?.captures?.length || 0,
      stageCountBefore: before.marks?.stages?.length || 0,
      stageCountAfter: after.marks?.stages?.length || 0,
    };
  });
  const immediateEnd = await now(page);
  await page.waitForTimeout(THRESHOLDS.interactionWindowMs);
  const windowEnd = await now(page);
  return {
    ...dirtyState,
    immediateMs: round(immediateEnd - start),
    frameGaps: await sampleFrameGaps(page, 350),
    longTasks: summarizeLongTasks(await longTasksInWindow(page, start, windowEnd)),
    captureStarts: await captureStartsInWindow(page, start, windowEnd),
  };
}

async function runRepeatedOpenValidation(page) {
  const cycles = [];
  await warmVisibleViewportThumbs(page);
  await ensureOverviewClosed(page);
  for (let index = 0; index < THRESHOLDS.repeatedOpenCount; index += 1) {
    await page.evaluate(() => {
      window.__resetOverviewPerfMarks?.();
      window.__overviewPerfLongTasks = [];
    });
    const start = await now(page);
    await openRailForValidation(page);
    await page.waitForFunction(({ minCards, visibleCards }) => {
      const state = window.__getOverviewPerfState?.();
      const root = document.getElementById('slide-rail-list');
      if(!state?.overviewOn || !root || state.cardCount < minCards) return false;
      const rootRect = root.getBoundingClientRect();
      const visible = [...document.querySelectorAll('[data-overview-card="true"]')].filter(card => {
        const rect = card.getBoundingClientRect();
        return rect.bottom >= rootRect.top && rect.top <= rootRect.bottom;
      }).length;
      return visible >= visibleCards;
    }, { minCards: THRESHOLDS.minCards, visibleCards: THRESHOLDS.visibleCards });
    await nextFrame(page);
    const readyAt = await now(page);
    const hoverBox = await page.locator('[data-overview-card="true"]').first().boundingBox();
    if (!hoverBox) throw new Error('Repeated-open hover card box missing');
    const hover = await measureInteraction(page, `repeatedOpen${index}Hover`, async () => {
      await page.mouse.move(hoverBox.x + hoverBox.width / 2, hoverBox.y + hoverBox.height / 2);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
    });
    const windowStart = await now(page);
    await page.waitForTimeout(THRESHOLDS.repeatedOpenWindowMs);
    const windowEnd = await now(page);
    const state = await getState(page);
    const stages = await stagesInWindow(page, start, windowEnd);
    cycles.push({
      index,
      readyMs: round(readyAt - start),
      hoverMs: hover.durationMs,
      longTasks: summarizeLongTasks(await longTasksInWindow(page, start, windowEnd)),
      captureStarts: await captureStartsInWindow(page, start, windowEnd),
      state: pickState(state),
      progress: await getOverviewProgressState(page),
      stages: summarizeStages(stages),
      layoutReads: layoutReadsInWindow(state, start, windowEnd),
      windowMs: round(windowEnd - windowStart),
    });
    await ensureOverviewClosed(page);
  }
  return cycles;
}

async function warmVisibleViewportThumbs(page) {
  await ensureOverviewOpen(page);
  await page.evaluate(() => window.__queueNearbyOverviewThumbs?.());
  await page.waitForFunction(() => {
    const overview = document.getElementById('slide-rail-list');
    if (!overview) return false;
    const rootRect = overview.getBoundingClientRect();
    const visibleWraps = [...overview.querySelectorAll('[data-overview-thumb="true"]')].filter(wrap => {
      const rect = wrap.getBoundingClientRect();
      return rect.bottom >= rootRect.top && rect.top <= rootRect.bottom;
    });
    return visibleWraps.length > 0 && visibleWraps.every(wrap => wrap.dataset.overviewRendered === 'true');
  }, undefined, { timeout: 10000 }).catch(() => {});
  await ensureOverviewClosed(page);
}

async function runRepeatedDropValidation(page) {
  await ensureOverviewOpen(page);
  await page.evaluate(() => {
    window.__resetOverviewPerfMarks?.();
    window.__overviewPerfLongTasks = [];
  });
  await page.waitForFunction((minimumCards) => window.__getOverviewPerfState?.().cardCount >= minimumCards, THRESHOLDS.minCards);
  await nextFrame(page);
  const dropCountBefore = await page.evaluate(() => window.__getOverviewPerfState?.().marks?.drops?.length || 0);

  const sourceCard = page.locator('[data-overview-card="true"][data-index="30"]');
  const targetCard = page.locator('[data-overview-card="true"][data-index="33"]');
  await sourceCard.scrollIntoViewIfNeeded();
  await targetCard.scrollIntoViewIfNeeded();
  const sourceBox = await sourceCard.boundingBox();
  const targetBox = await targetCard.boundingBox();
  if (!sourceBox || !targetBox) throw new Error('Repeated-drop source/target card box missing');
  await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2 + 12, { steps: 2 });
  await nextFrame(page);
  await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 3 });
  await nextFrame(page);

  const dropStart = await now(page);
  const frameGapsDuringDrop = sampleFrameGaps(page, THRESHOLDS.postDropWindowMs);
  await page.mouse.up();
  await nextFrame(page);
  const immediateEnd = await now(page);
  const immediateHoverBox = await page.locator('[data-overview-card="true"]').first().boundingBox();
  if (!immediateHoverBox) throw new Error('Immediate post-drop hover card box missing');
  const postDropImmediateHover = await measureInteraction(page, 'postDropImmediateHover', async () => {
    await page.mouse.move(immediateHoverBox.x + immediateHoverBox.width / 2, immediateHoverBox.y + immediateHoverBox.height / 2);
    await nextFrame(page);
  });
  await page.waitForFunction((expectedIndex) => {
    const state = window.__getOverviewPerfState?.();
    const targetDrop = state?.marks?.drops?.[expectedIndex];
    return targetDrop?.deckCommittedAt && targetDrop.deckCommittedAt > targetDrop.localDomCommittedAt;
  }, dropCountBefore, { timeout: 3000 });
  const committedState = await getState(page);
  const targetDropAfterCommit = committedState.marks?.drops?.[dropCountBefore] || committedState.lastDrop || {};
  const commitAt = Number(targetDropAfterCommit.deckCommittedAt || 0);

  const immediateDragProbeBox = await page.locator('[data-overview-card="true"][data-index="31"]').boundingBox();
  if (!immediateDragProbeBox) throw new Error('Immediate post-drop drag probe card box missing');
  const postDropImmediateDrag = await measureInteraction(page, 'postDropImmediateDragStart', async () => {
    await page.mouse.move(immediateDragProbeBox.x + immediateDragProbeBox.width / 2, immediateDragProbeBox.y + immediateDragProbeBox.height / 2);
    await page.mouse.down();
    await nextFrame(page);
    await page.mouse.up();
    await nextFrame(page);
  });

  await page.waitForTimeout(THRESHOLDS.postDropWindowMs);
  const windowEnd = await now(page);
  const stateAfterWindow = await getState(page);
  const targetDropAfterWindow = stateAfterWindow.marks?.drops?.[dropCountBefore] || targetDropAfterCommit;

  const hoverBox = await page.locator('[data-overview-card="true"]').first().boundingBox();
  if (!hoverBox) throw new Error('Post-drop hover card box missing');
  const postDropHover = await measureInteraction(page, 'postDropHover', async () => {
    await page.mouse.move(hoverBox.x + hoverBox.width / 2, hoverBox.y + hoverBox.height / 2);
    await nextFrame(page);
  });

  const dragProbeBox = await page.locator('[data-overview-card="true"][data-index="31"]').boundingBox();
  if (!dragProbeBox) throw new Error('Post-drop drag probe card box missing');
  const postDropDrag = await measureInteraction(page, 'postDropDragStart', async () => {
    await page.mouse.move(dragProbeBox.x + dragProbeBox.width / 2, dragProbeBox.y + dragProbeBox.height / 2);
    await page.mouse.down();
    await nextFrame(page);
    await page.mouse.up();
    await nextFrame(page);
  });

  const stages = await stagesInWindow(page, dropStart, windowEnd);
  const dropCountAfterProbes = await page.evaluate(() => window.__getOverviewPerfState?.().marks?.drops?.length || 0);
  return {
    dropImmediateMs: round(immediateEnd - dropStart),
    commitDelayMs: round(commitAt - dropStart),
    deckCommitDurationMs: round(targetDropAfterCommit.deckCommitDurationMs || 0),
    deckAppendDurationMs: round(targetDropAfterCommit.deckAppendDurationMs || 0),
    deckMutationDurationMs: round(targetDropAfterCommit.deckMutationDurationMs || 0),
    deckMoveCount: Number(targetDropAfterWindow.deckMoveCount ?? targetDropAfterCommit.deckMoveCount ?? NaN),
    targetDropIndex: dropCountBefore,
    dropCountBefore,
    dropCountAfterProbes,
    targetDropAfterCommit,
    targetDropAfterWindow,
    postDropWindowMs: round(windowEnd - dropStart),
    postDropImmediateHoverMs: postDropImmediateHover.durationMs,
    postDropImmediateHoverLongTasks: postDropImmediateHover.longTasks,
    postDropImmediateHoverCaptureStarts: postDropImmediateHover.captureStarts,
    postDropImmediateDragStartMs: postDropImmediateDrag.durationMs,
    postDropImmediateDragLongTasks: postDropImmediateDrag.longTasks,
    postDropImmediateDragCaptureStarts: postDropImmediateDrag.captureStarts,
    postDropHoverMs: postDropHover.durationMs,
    postDropDragStartMs: postDropDrag.durationMs,
    longTasks: summarizeLongTasks(await longTasksInWindow(page, dropStart, windowEnd)),
    frameGaps: await frameGapsDuringDrop,
    captureStarts: await captureStartsInWindow(page, dropStart, windowEnd),
    stateAfterWindow: pickState(stateAfterWindow),
    stages: summarizeStages(stages),
    layoutReads: layoutReadsInWindow(stateAfterWindow, dropStart, windowEnd),
  };
}

async function runSortReturnCacheValidation(page) {
  await ensureOverviewOpen(page);
  await page.waitForFunction(() => {
    const overview = document.getElementById('slide-rail-list');
    if (!overview) return false;
    const rootRect = overview.getBoundingClientRect();
    const visibleWraps = [...overview.querySelectorAll('[data-overview-thumb="true"]')].filter(wrap => {
      const rect = wrap.getBoundingClientRect();
      return rect.bottom >= rootRect.top && rect.top <= rootRect.bottom;
    });
    const state = window.__getOverviewPerfState?.();
    return visibleWraps.length > 0
      && visibleWraps.some(wrap => wrap.dataset.overviewRendered === 'true')
      && (state?.cacheSize || 0) > 0;
  }, undefined, { timeout: 12000 });
  const before = await page.evaluate(() => {
    const overview = document.getElementById('slide-rail-list');
    const rootRect = overview.getBoundingClientRect();
    const cards = [...overview.querySelectorAll('[data-overview-card="true"]')];
    const visibleCards = cards.filter(card => {
      const frame = card.querySelector('[data-overview-frame="true"]');
      const rect = frame?.getBoundingClientRect();
      return rect && rect.bottom >= rootRect.top && rect.top <= rootRect.bottom;
    });
    const state = window.__getOverviewPerfState?.();
    return {
      visibleCount: visibleCards.length,
      renderedCount: visibleCards.filter(card => card.querySelector('[data-overview-thumb="true"]')?.dataset.overviewRendered === 'true').length,
      placeholderCount: visibleCards.filter(card => card.querySelector('[data-overview-placeholder="true"]')).length,
      order: cards.slice(0, 12).map(card => card.dataset.slideId || card.dataset.slideKey || ''),
      activeSlideId: state?.activeSlideId || '',
      cacheKeys: state?.cacheKeys || [],
    };
  });
  await page.evaluate(() => {
    window.__resetOverviewPerfMarks?.();
    window.__overviewPerfLongTasks = [];
  });
  const clickStart = await now(page);
  await page.locator('[data-overview-card="true"]').first().click();
  await closeRailForValidation(page);
  await nextFrame(page);
  const previewState = await getState(page);
  await openRailForValidation(page);
  await page.waitForFunction(() => window.__getOverviewPerfState?.().overviewOn);
  await nextFrame(page);
  const reopenAt = await now(page);
  const immediate = await page.evaluate(() => {
    const overview = document.getElementById('slide-rail-list');
    const rootRect = overview.getBoundingClientRect();
    const cards = [...overview.querySelectorAll('[data-overview-card="true"]')];
    const visibleCards = cards.filter(card => {
      const frame = card.querySelector('[data-overview-frame="true"]');
      const rect = frame?.getBoundingClientRect();
      return rect && rect.bottom >= rootRect.top && rect.top <= rootRect.bottom;
    });
    const active = cards.find(card => card.style.outline.includes('3px') || card.matches('[aria-current="true"]'));
    const state = window.__getOverviewPerfState?.();
    return {
      visibleCount: visibleCards.length,
      renderedCount: visibleCards.filter(card => card.querySelector('[data-overview-thumb="true"]')?.dataset.overviewRendered === 'true').length,
      placeholderCount: visibleCards.filter(card => card.querySelector('[data-overview-placeholder="true"]')).length,
      order: cards.slice(0, 12).map(card => card.dataset.slideId || card.dataset.slideKey || ''),
      activeCardSlideId: active?.dataset.slideId || active?.dataset.slideKey || '',
      activeSlideId: state?.activeSlideId || '',
      cacheKeys: state?.cacheKeys || [],
      queueLength: state?.queueLength || 0,
      processing: !!state?.processing,
      scheduled: !!state?.scheduled,
    };
  });
  await page.waitForTimeout(500);
  const windowEnd = await now(page);
  const afterWindowState = await getState(page);
  return {
    clickToReopenMs: round(reopenAt - clickStart),
    before,
    previewState: pickState(previewState),
    immediate,
    afterWindow: pickState(afterWindowState),
    captureStarts: await captureStartsInWindow(page, reopenAt, windowEnd),
    longTasks: summarizeLongTasks(await longTasksInWindow(page, reopenAt, windowEnd)),
    stages: summarizeStages(await stagesInWindow(page, reopenAt, windowEnd)),
  };
}

async function runFullFrameFitValidation(page) {
  const results = [];
  for (const theme of ACCEPTED_THEME_KEYS) {
    await ensureOverviewClosed(page);
    await page.evaluate(async (themePack) => {
      window.__setActiveThemePack?.(themePack);
      window.go?.(0, { animate: false, force: true });
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      await new Promise(resolve => setTimeout(resolve, 1200));
      window.__resetOverviewPerfMarks?.();
      window.__overviewPerfLongTasks = [];
    }, theme);
    await ensureOverviewOpen(page);
    await page.waitForFunction(() => window.__getOverviewPerfState?.().overviewOn);
    await page.waitForTimeout(theme === 'theme03' ? THRESHOLDS.theme03VisualReadyMs : 800);
    const similarity = await runThemeSimilarityValidation(page, {
      sampleCount: THRESHOLDS.fullFrameFitSampleCount,
      stableWaitMs: theme === 'theme02' ? 2500 : 250,
    });
    const failed = similarity.samples.filter(sample =>
      sample.score < THRESHOLDS.fullFrameFitMinScore
      || sample.meanAbs > THRESHOLDS.fullFrameFitMaxMeanAbs
      || sample.borderAbs > THRESHOLDS.fullFrameFitMaxBorderAbs
    );
    results.push({ theme, ...similarity, failedCount: failed.length, failed });
  }
  return results;
}

async function runTheme03VisualValidation(page) {
  await ensureOverviewClosed(page);
  await page.evaluate(async () => {
    window.__setActiveThemePack?.('theme03');
    window.go?.(0, { animate: false, force: true });
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await new Promise(resolve => setTimeout(resolve, 2500));
    window.__resetOverviewPerfMarks?.();
    window.__overviewPerfLongTasks = [];
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  const openStart = await now(page);
  const openWindowEnd = openStart + 5000;
  const frameGapsDuringOpen = sampleFrameGaps(page, 5000);
  await openRailForValidation(page);
  const frameGaps = await frameGapsDuringOpen;
  const renderedState = await getVisibleThumbStats(page);
  const visualStats = await getVisibleThumbVisualStats(page);
  const end = await now(page);
  const placeholderFill = await waitForVisibleThumbFill(page, openStart, THRESHOLDS.theme03PlaceholderFillMs);
  const progress = await getOverviewProgressState(page);
  const stages = await stagesInWindow(page, openStart, openWindowEnd);
  const longTaskEntries = await longTasksInWindow(page, openStart, openWindowEnd);
  const similarity = await runTheme03SimilarityValidation(page);
  return {
    openToVisualCheckMs: round(end - openStart),
    renderedState,
    visualStats,
    placeholderFill,
    similarity,
    progress,
    longTasks: summarizeLongTasks(longTaskEntries),
    longTaskEntries: longTaskEntries.map(task => ({
      startMs: round(task.startTime - openStart),
      durationMs: round(task.duration),
    })),
    frameGaps,
    captureStarts: await captureStartsInWindow(page, openStart, openWindowEnd),
    stages: summarizeStages(stages),
    thumbnailTasks: summarizeStageTasks(stages, ['overview-thumb-task', 'runtime-slide-prepare', 'dom-derived-preview', 'dom-preview-thumbnail']),
    state: pickState(await getState(page)),
  };
}

async function waitForVisibleThumbFill(page, openStart, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let filledAt = null;
  let stats = await getVisibleThumbStats(page);
  while (Date.now() < deadline) {
    stats = await getVisibleThumbStats(page);
    if (stats.visibleCount > 0 && stats.visibleRenderedCount === stats.visibleCount) {
      filledAt = await now(page);
      break;
    }
    await page.waitForTimeout(160);
  }
  stats = await getVisibleThumbStats(page);
  return {
    visibleCount: stats.visibleCount,
    renderedCount: stats.visibleRenderedCount,
    missingCount: stats.visibleMissingCount,
    renderedRatio: stats.visibleCount ? round(stats.visibleRenderedCount / stats.visibleCount) : 0,
    allVisibleFilledMs: filledAt ? round(filledAt - openStart) : null,
    timeoutMs,
  };
}

async function runTheme02AnimationValidation(page) {
  await ensureOverviewClosed(page);
  await page.evaluate(async () => {
    window.__setActiveThemePack?.('theme02');
    window.go?.(0, { animate: false, force: true });
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await new Promise(resolve => setTimeout(resolve, 2500));
    window.__resetOverviewPerfMarks?.();
    window.__overviewPerfLongTasks = [];
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  const openStart = await now(page);
  const openWindowEnd = openStart + 5000;
  const frameGapsDuringOpen = sampleFrameGaps(page, 5000);
  await openRailForValidation(page);
  const frameGaps = await frameGapsDuringOpen;
  const renderedState = await getVisibleThumbStats(page);
  const visualStats = await getVisibleThumbVisualStats(page);
  const similarity = await runThemeSimilarityValidation(page, {
    sampleCount: THRESHOLDS.theme02AnimationSampleCount,
    stableWaitMs: 2500,
  });
  const failed = similarity.samples.filter(sample =>
    sample.score < THRESHOLDS.theme02SimilarityMinScore
    || (
      sample.candidateBlackRatio > THRESHOLDS.theme02BlackRatioMax
      && sample.candidateBlackRatio > (sample.referenceBlackRatio || 0) + 0.18
    )
  );
  return {
    renderedState,
    visualStats,
    similarity: { ...similarity, failedCount: failed.length, failed },
    longTasks: summarizeLongTasks(await longTasksInWindow(page, openStart, openWindowEnd)),
    frameGaps,
    captureStarts: await captureStartsInWindow(page, openStart, openWindowEnd),
    stages: summarizeStages(await stagesInWindow(page, openStart, openWindowEnd)),
    state: pickState(await getState(page)),
  };
}

function runStaticImplementationChecks() {
  const templatePath = path.join(ROOT, 'assets/template-swiss.html');
  const template = readFileSync(templatePath, 'utf8');
  const dirtyStart = template.indexOf('function markOverviewThumbDirty');
  const dirtyEnd = dirtyStart >= 0 ? template.indexOf('function createOverviewThumbPlaceholder', dirtyStart) : -1;
  const dirtySource = dirtyStart >= 0 && dirtyEnd > dirtyStart ? template.slice(dirtyStart, dirtyEnd) : '';
  const commitStart = template.indexOf('function scheduleOverviewDeckCommit');
  const commitEnd = commitStart >= 0 ? template.indexOf('function processOverviewDragOver', commitStart) : -1;
  const commitSource = commitStart >= 0 && commitEnd > commitStart ? template.slice(commitStart, commitEnd) : '';
  const renderStart = template.indexOf('async function renderOverviewThumbDomPreview');
  const renderEnd = renderStart >= 0 ? template.indexOf('function getOverviewPreviewCost', renderStart) : -1;
  const renderSource = renderStart >= 0 && renderEnd > renderStart ? template.slice(renderStart, renderEnd) : '';
  const fallbackStart = template.indexOf('function renderOverviewThumbFallback');
  const fallbackEnd = fallbackStart >= 0 ? template.indexOf('async function renderOverviewThumb', fallbackStart) : -1;
  const fallbackSource = fallbackStart >= 0 && fallbackEnd > fallbackStart ? template.slice(fallbackStart, fallbackEnd) : '';
  const scheduleStart = template.indexOf('function scheduleOverviewThumbQueue');
  const scheduleEnd = scheduleStart >= 0 ? template.indexOf('function queueOverviewThumb', scheduleStart) : -1;
  const scheduleSource = scheduleStart >= 0 && scheduleEnd > scheduleStart ? template.slice(scheduleStart, scheduleEnd) : '';
  const placeholderStart = template.indexOf('function createOverviewThumbPlaceholder');
  const placeholderEnd = placeholderStart >= 0 ? template.indexOf('function getOverviewStructureSignature', placeholderStart) : -1;
  const placeholderSource = placeholderStart >= 0 && placeholderEnd > placeholderStart ? template.slice(placeholderStart, placeholderEnd) : '';
  const sourceSizeStart = template.indexOf('function getOverviewSourceSize');
  const sourceSizeEnd = sourceSizeStart >= 0 ? template.indexOf('function fitOverviewThumb', sourceSizeStart) : -1;
  const sourceSizeSource = sourceSizeStart >= 0 && sourceSizeEnd > sourceSizeStart ? template.slice(sourceSizeStart, sourceSizeEnd) : '';
  return {
    dirtyCallsSyncSvg: /makeOverviewThumbSvg\s*\(/.test(dirtySource),
    captureUsesForeignObjectSvgFastPath: /makeOverviewThumbSvg\s*\(/.test(renderSource) || /foreignObject/.test(renderSource),
    commitUsesFullAppendLoop: /orderedSlides\.forEach\s*\(\s*slide\s*=>\s*deck\.appendChild\(slide\)/.test(commitSource),
    litePreviewDisablesImages: /const\s+imageUrl\s*=\s*['"]{2}/.test(renderSource),
    syntheticOverviewThumbPath: /visualSlots|textSlots|fillText\s*\(/.test(renderSource),
    placeholderMarkedRendered: /overviewRendered\s*=\s*['"]true['"]/.test(placeholderSource),
    domCloneMissingScriptRemoval: !/querySelectorAll\(['"]script,style,template,noscript['"]\)/.test(renderSource),
    domCloneMissingMediaStatic: !/querySelectorAll\(['"]iframe,video['"]\)/.test(renderSource),
    domCloneMissingAnimationStatic: !/style\.animation\s*=\s*['"]none['"]/.test(renderSource) || !/style\.transition\s*=\s*['"]none['"]/.test(renderSource),
    domCloneMissingContainment: !/contain:layout paint style/.test(renderSource),
    domCloneMissingCache: !/rememberOverviewThumbFromDom/.test(renderSource),
    fallbackUsesRawRenderedClone: /cloneNode\(true\)/.test(fallbackSource) && /overviewRendered\s*=\s*['"]true['"]/.test(fallbackSource),
    fakeIdleDeadline: /timeRemaining\s*:\s*\(\)\s*=>\s*16/.test(scheduleSource),
    overviewQueueClaimsIdle: /requestIdleCallback/.test(scheduleSource) && !/time-sliced/.test(scheduleSource),
    overviewSourceCapsImportedCanvas: /Math\.min\(\s*deckW\s*\|\|\s*innerWidth\s*,\s*960\s*\)/.test(sourceSizeSource),
  };
}

async function ensureOverviewClosed(page) {
  const open = await page.evaluate(() => !!window.__getOverviewPerfState?.().overviewOn);
  if (open) {
    await closeRailForValidation(page);
    await nextFrame(page);
  }
}

async function ensureOverviewOpen(page) {
  const open = await page.evaluate(() => !!window.__getOverviewPerfState?.().overviewOn);
  if (!open) {
    await openRailForValidation(page);
    await nextFrame(page);
  }
}

async function stagesInWindow(page, start, end) {
  return page.evaluate(({ start, end }) => {
    const stages = window.__getOverviewPerfState?.().marks?.stages || [];
    return stages.filter(stage => {
      const stageStart = Number(stage.startAt || 0);
      const stageEnd = Number(stage.endAt || stageStart);
      return stageEnd >= start && stageStart <= end;
    });
  }, { start, end });
}

function summarizeStages(stages) {
  const byType = {};
  for (const stage of stages) {
    const type = stage.type || 'unknown';
    const summary = byType[type] || {
      count: 0,
      totalMs: 0,
      maxMs: 0,
      maxItemCount: 0,
      maxCandidateCount: 0,
      maxRectReadCount: 0,
      maxStyleReadCount: 0,
      slowestSlideId: '',
      slowestDurationMs: 0,
    };
    const duration = Number(stage.duration || 0);
    summary.count += 1;
    summary.totalMs = round(summary.totalMs + duration);
    summary.maxMs = Math.max(summary.maxMs, round(duration));
    summary.maxItemCount = Math.max(summary.maxItemCount, Number(stage.count || 0));
    summary.maxCandidateCount = Math.max(summary.maxCandidateCount, Number(stage.candidateCount || 0));
    summary.maxRectReadCount = Math.max(summary.maxRectReadCount, Number(stage.rectReadCount || 0));
    summary.maxStyleReadCount = Math.max(summary.maxStyleReadCount, Number(stage.styleReadCount || 0));
    if (duration > summary.slowestDurationMs) {
      summary.slowestDurationMs = round(duration);
      summary.slowestSlideId = stage.slideId || '';
    }
    if (stage.appendMs !== undefined) summary.maxAppendMs = Math.max(summary.maxAppendMs || 0, round(Number(stage.appendMs || 0)));
    if (stage.mutationMs !== undefined) summary.maxMutationMs = Math.max(summary.maxMutationMs || 0, round(Number(stage.mutationMs || 0)));
    byType[type] = summary;
  }
  return byType;
}

function summarizeStageTasks(stages, types) {
  return stages
    .filter(stage => types.includes(stage.type || ''))
    .map(stage => ({
      type: stage.type || '',
      slideId: stage.slideId || '',
      durationMs: round(Number(stage.duration || 0)),
      candidateCount: Number(stage.candidateCount || 0),
      rectReadCount: Number(stage.rectReadCount || 0),
      styleReadCount: Number(stage.styleReadCount || 0),
      trigger: stage.trigger || '',
      startAt: round(Number(stage.startAt || 0)),
      endAt: round(Number(stage.endAt || 0)),
    }));
}

function layoutReadsInWindow(state, start, end) {
  return (state.marks?.layoutReads || []).filter(read => {
    const at = Number(read.at || 0);
    return at >= start && at <= end;
  });
}

function validateResult(result, finalState) {
  const failures = [];
  const t = result.timings;
  const s = result.states;
  const afterBackground = s.afterBackground;
  const drop = s.afterDropCommit.lastDrop;
  const allCacheKeys = finalState.cacheKeys || [];

  if (result.cards < THRESHOLDS.minCards) failures.push(`expected at least ${THRESHOLDS.minCards} cards, got ${result.cards}`);
  if (t.openFrameMs > THRESHOLDS.openFrameMs) failures.push(`overview open too slow: ${t.openFrameMs}ms`);
  if (t.firstCardMs > THRESHOLDS.firstCardMs) failures.push(`first card too slow: ${t.firstCardMs}ms`);
  if (t.firstVisibleCardsMs > THRESHOLDS.firstVisibleCardsMs) failures.push(`first visible cards too slow: ${t.firstVisibleCardsMs}ms`);
  if (t.allCardsMs > THRESHOLDS.allCardsMs) failures.push(`all overview cards too slow: ${t.allCardsMs}ms`);
  if (t.hoverMs > THRESHOLDS.hoverMs) failures.push(`hover too slow: ${t.hoverMs}ms`);
  if (t.scrollMaxMs > THRESHOLDS.hoverMs) failures.push(`scroll response too slow: ${t.scrollMaxMs}ms`);
  if (t.dragStartMs > THRESHOLDS.dragStartMs) failures.push(`dragstart too slow: ${t.dragStartMs}ms`);
  if (t.dragOverMaxMs > THRESHOLDS.dragOverMs) failures.push(`dragover too slow: ${t.dragOverMaxMs}ms`);
  if (t.dropImmediateMs > THRESHOLDS.dropImmediateMs) failures.push(`drop immediate too slow: ${t.dropImmediateMs}ms`);
  if (t.clickMs > THRESHOLDS.clickMs) failures.push(`click too slow: ${t.clickMs}ms`);
  if (t.reopenMs > THRESHOLDS.reopenMs) failures.push(`reopen too slow: ${t.reopenMs}ms`);
  if (t.closeMs > THRESHOLDS.closeMs) failures.push(`close too slow: ${t.closeMs}ms`);

  for (const name of ['scrollMid', 'scrollBottom', 'scrollTop', 'hover', 'dragStart', 'drop', 'click', 'close']) {
    const stat = result.longTasks[name];
    if (stat.countOver50 > THRESHOLDS.interactionLongTaskCount || stat.maxMs > THRESHOLDS.interactionLongTaskMaxMs) {
      failures.push(`${name} has interaction long tasks: ${JSON.stringify(stat)}`);
    }
    if (result.captureStarts[name].length) {
      failures.push(`${name} started thumbnail captures inside the interaction window`);
    }
  }
  if (result.longTasks.background.maxMs > THRESHOLDS.backgroundLongTaskMaxMs) {
    failures.push(`background thumbnail long task too high: ${JSON.stringify(result.longTasks.background)}`);
  }
  if (result.longTasks.postScrollSettle.countOver50 > THRESHOLDS.postScrollLongTaskCount || result.longTasks.postScrollSettle.maxMs > THRESHOLDS.backgroundLongTaskMaxMs) {
    failures.push(`post-scroll background work still blocks the main thread: ${JSON.stringify(result.longTasks.postScrollSettle)}`);
  }

  if (afterBackground.queueLength >= afterBackground.cardCount) failures.push('thumbnail queue enqueued all cards');
  if (afterBackground.queueLength > afterBackground.visibleOrNearCount + 2) failures.push('thumbnail queue exceeds visible/near range');
  for (const name of ['afterScrollMid', 'afterScrollBottom', 'afterScrollTop', 'afterScrollStable']) {
    const state = s[name];
    if (state.queueLength > state.visibleOrNearCount + 2) {
      failures.push(`${name} thumbnail queue exceeds current visible/near range: queue=${state.queueLength}, visibleOrNear=${state.visibleOrNearCount}`);
    }
  }
  if (s.afterScrollStable.cacheSize < Math.min(THRESHOLDS.cachedInteractionMin, Math.max(1, s.afterScrollStable.visibleOrNearCount))) {
    failures.push(`post-scroll interactions were not tested with enough cached thumbnails: cacheSize=${s.afterScrollStable.cacheSize}`);
  }
  const visibleViewportAlmostLoaded = result.loadedStateAfterScroll.visibleViewportCount > 0
    && result.loadedStateAfterScroll.visibleViewportRendered >= result.loadedStateAfterScroll.visibleViewportCount - 1;
  if (s.afterScrollStable.queueLength === 0 && !result.loadedStateAfterScroll.fullLoaded && !result.loadedStateAfterScroll.visibleViewportLoaded && !visibleViewportAlmostLoaded) {
    failures.push(`loaded/stable state is not well defined: ${JSON.stringify(result.loadedStateAfterScroll)}`);
  }
  if (result.progressAfterBackground?.blocksViewport) {
    failures.push(`overview progress blocks viewport after visible thumbnails are ready: ${JSON.stringify(result.progressAfterBackground)}`);
  }
  if (s.afterHover.pauseRemainingMs < 200) failures.push('hover did not defer thumbnail captures');
  if (s.duringDrag.queueLength !== 0 && s.duringDrag.pauseRemainingMs < 200) failures.push('dragstart did not pause/defer thumbnail queue');
  if (s.afterDropFrame.queueLength !== 0 && s.afterDropFrame.pauseRemainingMs < 200) failures.push('drop did not pause/defer thumbnail queue');
  if (s.afterClick.queueLength > s.afterClick.visibleOrNearCount + 2) failures.push('rail click queued thumbnails outside the current visible range');
  if (s.afterClose.queueLength !== 0) failures.push('close did not cancel thumbnail queue');

  if (!drop) failures.push('drop perf mark missing');
  else {
    if (!drop.localDomCommittedAt || !drop.deckCommittedAt) failures.push('drop local/deck commit timestamps missing');
    if (drop.deckCommittedAt <= drop.localDomCommittedAt) failures.push('deck commit was not delayed after local overview update');
    if (drop.deckOrderBeforeDrop !== drop.deckOrderAfterLocalDom) failures.push('real deck order changed before delayed commit');
    if (drop.overviewOrderBeforeDrop === drop.overviewOrderAfterLocalDom) failures.push('overview order did not update immediately on drop');
    if (drop.deckOrderAfterCommit === drop.deckOrderBeforeDrop) failures.push('real deck order did not commit after drop');
    if (drop.queueAfterDrop !== 0) failures.push('drop left thumbnail queue running');
  }

  const layoutReads = s.afterDropCommit.layoutReads || [];
  const dragStartReads = layoutReads.filter(read => read.phase === 'dragstart' && (read.kind === 'all-card-rects' || read.kind === 'visible-card-rects'));
  const dragOverFullReads = layoutReads.filter(read => read.phase === 'dragover' && Number(read.count || 0) >= result.cards);
  const dragOverCacheReads = layoutReads.filter(read => read.phase === 'dragover' && read.kind === 'cached-card-rects');
  if (!dragStartReads.length) failures.push('dragstart did not record one cached rect read');
  if (dragStartReads.some(read => read.kind === 'all-card-rects' || Number(read.count || 0) > s.afterDropCommit.visibleOrNearCount + 2)) {
    failures.push('dragstart read more rail card rects than the visible/near range');
  }
  if (dragOverFullReads.length) failures.push('dragover repeatedly read all card rects instead of using cached rects');
  if (!dragOverCacheReads.length) failures.push('dragover did not record cached rect usage');

  if (!allCacheKeys.length) failures.push('cache keys are empty; cache validation cannot pass without real thumbnails');
  const invalidKeys = allCacheKeys.filter(key => !/^[^|]+\|[^|]+\|r\d+\|\d+x\d+$/.test(key) || /overview-\d+/.test(key));
  if (invalidKeys.length) failures.push(`cache keys are not stable: ${invalidKeys.slice(0, 5).join(', ')}`);
  if (finalState.cacheSize > finalState.cacheLimit) failures.push('cache exceeds LRU limit');
  if (finalState.cacheApproxChars > THRESHOLDS.cacheApproxChars) failures.push(`cache approx size too high: ${finalState.cacheApproxChars}`);
  if ((finalState.cacheDomNodeCount || 0) > THRESHOLDS.cacheDomNodeCount) {
    failures.push(`DOM thumbnail cache node count too high: ${finalState.cacheDomNodeCount}`);
  }

  const visibleThumbs = result.coldVisibleThumbs;
  if (!visibleThumbs.visibleCount) {
    failures.push('cold open visible thumbnail readiness could not find visible thumbnails');
  } else {
    if (visibleThumbs.firstVisibleThumbReadyMs === null || visibleThumbs.firstVisibleThumbReadyMs > THRESHOLDS.firstVisibleThumbReadyMs) {
      failures.push(`cold open first visible thumbnail too slow: ${visibleThumbs.firstVisibleThumbReadyMs}ms`);
    }
    if (visibleThumbs.allVisibleThumbsReadyMs === null || visibleThumbs.allVisibleThumbsReadyMs > THRESHOLDS.allVisibleThumbsReadyMs) {
      failures.push(`cold open visible thumbnails not ready fast enough: rendered=${visibleThumbs.visibleRenderedCount}/${visibleThumbs.visibleCount}, allReadyMs=${visibleThumbs.allVisibleThumbsReadyMs}`);
    }
  }

  result.repeatedOpen.forEach(cycle => {
    if (cycle.readyMs > THRESHOLDS.repeatedOpenReadyMs) {
      failures.push(`repeated open ${cycle.index} interactive ready too slow: ${cycle.readyMs}ms`);
    }
    if (cycle.hoverMs > THRESHOLDS.hoverMs) {
      failures.push(`repeated open ${cycle.index} hover probe too slow: ${cycle.hoverMs}ms`);
    }
    if (cycle.longTasks.countOver50 > THRESHOLDS.repeatedOpenLongTaskCount || cycle.longTasks.maxMs > THRESHOLDS.backgroundLongTaskMaxMs) {
      failures.push(`repeated open ${cycle.index} remains busy after opening: ${JSON.stringify(cycle.longTasks)}`);
    }
    if (cycle.captureStarts.length) {
      failures.push(`warm repeated open ${cycle.index} started thumbnail captures: ${cycle.captureStarts.map(capture => capture.slideId).join(', ')}`);
    }
    const fit = cycle.stages['fit-overview-thumbnails'];
    const observe = cycle.stages['observe-overview-thumbnails'];
    const queueRead = cycle.stages['queue-nearby-overview-thumbs'];
    if (fit?.maxItemCount >= cycle.state.cardCount) {
      failures.push(`repeated open ${cycle.index} synchronously fit all overview thumbnails: ${fit.maxItemCount}`);
    }
    if (observe?.maxItemCount >= cycle.state.cardCount) {
      failures.push(`repeated open ${cycle.index} synchronously observed all overview thumbnails: ${observe.maxItemCount}`);
    }
    if (queueRead?.maxItemCount >= cycle.state.cardCount) {
      failures.push(`repeated open ${cycle.index} read layout for all overview thumbnails while opening: ${queueRead.maxItemCount}`);
    }
    if (cycle.state.queueLength > cycle.state.visibleOrNearCount + 2) {
      failures.push(`repeated open ${cycle.index} queue exceeds current visible/near range: queue=${cycle.state.queueLength}, visibleOrNear=${cycle.state.visibleOrNearCount}`);
    }
    if (cycle.progress?.blocksViewport) {
      failures.push(`warm repeated open ${cycle.index} shows blocking progress: ${JSON.stringify(cycle.progress)}`);
    }
  });

  const repeatedDrop = result.repeatedDrop;
  if (repeatedDrop.commitDelayMs > THRESHOLDS.postDropCommitDelayMs) {
    failures.push(`post-drop deck commit delay too high: ${repeatedDrop.commitDelayMs}ms`);
  }
  if (repeatedDrop.deckCommitDurationMs > THRESHOLDS.postDropCommitDurationMs) {
    failures.push(`post-drop deck commit duration too high: ${repeatedDrop.deckCommitDurationMs}ms`);
  }
  if (repeatedDrop.longTasks.countOver50 > THRESHOLDS.postDropLongTaskCount || repeatedDrop.longTasks.maxMs > THRESHOLDS.backgroundLongTaskMaxMs) {
    failures.push(`post-drop window remains busy: ${JSON.stringify(repeatedDrop.longTasks)}`);
  }
  if (repeatedDrop.postDropHoverMs > THRESHOLDS.postDropProbeMs) {
    failures.push(`post-drop hover probe too slow: ${repeatedDrop.postDropHoverMs}ms`);
  }
  if (repeatedDrop.postDropDragStartMs > THRESHOLDS.postDropProbeMs) {
    failures.push(`post-drop drag probe too slow: ${repeatedDrop.postDropDragStartMs}ms`);
  }
  if (repeatedDrop.postDropImmediateHoverMs > THRESHOLDS.postDropProbeMs) {
    failures.push(`immediate post-drop hover probe too slow: ${repeatedDrop.postDropImmediateHoverMs}ms`);
  }
  if (repeatedDrop.postDropImmediateDragStartMs > THRESHOLDS.postDropProbeMs) {
    failures.push(`immediate post-drop drag probe too slow: ${repeatedDrop.postDropImmediateDragStartMs}ms`);
  }
  if (repeatedDrop.postDropImmediateHoverLongTasks.countOver50 > THRESHOLDS.interactionLongTaskCount || repeatedDrop.postDropImmediateHoverLongTasks.maxMs > THRESHOLDS.interactionLongTaskMaxMs) {
    failures.push(`immediate post-drop hover window blocked: ${JSON.stringify(repeatedDrop.postDropImmediateHoverLongTasks)}`);
  }
  if (repeatedDrop.postDropImmediateDragLongTasks.countOver50 > THRESHOLDS.interactionLongTaskCount || repeatedDrop.postDropImmediateDragLongTasks.maxMs > THRESHOLDS.interactionLongTaskMaxMs) {
    failures.push(`immediate post-drop drag window blocked: ${JSON.stringify(repeatedDrop.postDropImmediateDragLongTasks)}`);
  }
  if (repeatedDrop.postDropImmediateHoverCaptureStarts.length) {
    failures.push('immediate post-drop hover started thumbnail captures');
  }
  if (repeatedDrop.postDropImmediateDragCaptureStarts.length) {
    failures.push('immediate post-drop drag started thumbnail captures');
  }
  const postDropFit = repeatedDrop.stages['fit-overview-thumbnails'];
  const postDropObserve = repeatedDrop.stages['observe-overview-thumbnails'];
  const postDropQueueRead = repeatedDrop.stages['queue-nearby-overview-thumbs'];
  if (postDropFit?.maxItemCount >= repeatedDrop.stateAfterWindow.cardCount) {
    failures.push(`post-drop synchronously fit all overview thumbnails: ${postDropFit.maxItemCount}`);
  }
  if (postDropObserve?.maxItemCount >= repeatedDrop.stateAfterWindow.cardCount) {
    failures.push(`post-drop synchronously observed all overview thumbnails: ${postDropObserve.maxItemCount}`);
  }
  if (postDropQueueRead?.maxItemCount > repeatedDrop.stateAfterWindow.visibleOrNearCount + 2) {
    failures.push(`post-drop read too many thumbnail layouts: count=${postDropQueueRead.maxItemCount}, visibleOrNear=${repeatedDrop.stateAfterWindow.visibleOrNearCount}`);
  }

  const dirty = result.dirtyResult;
  if (!dirty.beforeKeys.length) failures.push('dirty validation had no cache keys before invalidation');
  if (!dirty.activeKeysBefore.length) failures.push('dirty validation had no active slide cache key before invalidation');
  if (!dirty.otherKeysBefore.length) failures.push('dirty validation had no non-active slide cache key before invalidation');
  if (!dirty.removed.length) failures.push('dirty invalidation removed no cache keys');
  if (dirty.removed.some(key => !key.includes(`|${dirty.activeId}|`))) failures.push(`dirty invalidation removed other slides: ${dirty.removed.join(', ')}`);
  if (!dirty.otherKeysStillPresent) failures.push('dirty invalidation did not preserve non-active slide cache keys');
  if (dirty.immediateMs > THRESHOLDS.dirtyImmediateMs) failures.push(`dirty invalidation blocked immediate interaction: ${dirty.immediateMs}ms`);
  if (dirty.longTasks.countOver50 > THRESHOLDS.interactionLongTaskCount || dirty.longTasks.maxMs > THRESHOLDS.interactionLongTaskMaxMs) {
    failures.push(`dirty invalidation caused long tasks: ${JSON.stringify(dirty.longTasks)}`);
  }
  if (dirty.captureStarts.length || dirty.captureCountAfter > dirty.captureCountBefore) {
    failures.push('dirty invalidation synchronously started thumbnail capture');
  }
  if (dirty.frameGaps.maxGapMs > THRESHOLDS.frameGapMaxMs) {
    failures.push(`dirty invalidation caused frame gap: ${JSON.stringify(dirty.frameGaps)}`);
  }

  if (Number.isNaN(repeatedDrop.deckMoveCount)) {
    failures.push('post-drop validation did not record deckMoveCount');
  } else if (repeatedDrop.deckMoveCount > THRESHOLDS.deckCommitMoveCount) {
    failures.push(`post-drop deck commit moved too many slides: ${repeatedDrop.deckMoveCount}`);
  }
  if (repeatedDrop.dropCountAfterProbes !== repeatedDrop.dropCountBefore + 1) {
    failures.push(`post-drop probes polluted drop records: before=${repeatedDrop.dropCountBefore}, after=${repeatedDrop.dropCountAfterProbes}`);
  }
  const postDropCommit = repeatedDrop.stages['deck-commit'];
  if (postDropCommit?.maxItemCount > THRESHOLDS.deckCommitMoveCount) {
    failures.push(`post-drop deck commit still records full deck work: ${postDropCommit.maxItemCount}`);
  }
  if (repeatedDrop.frameGaps.maxGapMs > THRESHOLDS.frameGapMaxMs) {
    failures.push(`post-drop frame gap too high: ${JSON.stringify(repeatedDrop.frameGaps)}`);
  }

  const sortCache = result.sortReturnCache;
  if (!sortCache?.before?.visibleCount || !sortCache?.immediate?.visibleCount) {
    failures.push('sort-return cache validation had no visible cards');
  } else {
    if (sortCache.immediate.renderedCount < sortCache.before.renderedCount) {
      failures.push(`sort-return overview lost cached visible thumbnails: before=${sortCache.before.renderedCount}, immediate=${sortCache.immediate.renderedCount}`);
    }
    if (sortCache.immediate.placeholderCount > Math.max(0, sortCache.immediate.visibleCount - sortCache.before.renderedCount)) {
      failures.push(`sort-return overview showed extra placeholders after cached thumbnails existed: ${sortCache.immediate.placeholderCount}`);
    }
    if (sortCache.immediate.order.join('|') !== sortCache.before.order.join('|')) {
      failures.push(`sort-return overview order changed unexpectedly: before=${sortCache.before.order.join(',')}, after=${sortCache.immediate.order.join(',')}`);
    }
  }
  if ((sortCache?.stages?.['dom-preview-thumbnail']?.count || 0) > 1 || (sortCache?.stages?.['overview-thumb-task']?.count || 0) > 1) {
    failures.push(`sort-return overview regenerated cached thumbnails: ${JSON.stringify(sortCache.stages)}`);
  }
  if (sortCache?.captureStarts?.length) {
    failures.push('sort-return overview started thumbnail capture despite cache');
  }

  for (const fit of result.fullFrameFit || []) {
    if (!fit.sampleCount) {
      failures.push(`${fit.theme} full-frame fit validation had no samples`);
      continue;
    }
    if (fit.failedCount > 0) {
      failures.push(`${fit.theme} thumbnails do not show the complete 16:9 slide frame: ${JSON.stringify({
        failedCount: fit.failedCount,
        minScore: fit.minScore,
        maxMeanAbs: fit.maxMeanAbs,
        maxBorderAbs: fit.maxBorderAbs,
        failed: fit.failed,
      })}`);
    }
  }

  const theme03 = result.theme03Visual;
  const theme03Stats = theme03.visualStats;
  const theme03SimilarityPassed = !!theme03.similarity?.sampleCount && theme03.similarity.failedCount === 0;
  if (!theme03Stats.visibleCount) {
    failures.push('theme03 visual validation found no visible thumbnails');
  } else {
    const validRatio = theme03Stats.validCount / theme03Stats.visibleCount;
    if (validRatio < THRESHOLDS.theme03VisibleValidRatio && !theme03SimilarityPassed) {
      failures.push(`theme03 visible thumbnails are blank/broken: valid=${theme03Stats.validCount}/${theme03Stats.visibleCount}`);
    }
  }
  if (theme03Stats.brokenCount) failures.push(`theme03 has broken thumbnail images: ${theme03Stats.brokenCount}`);
  if (theme03Stats.foreignObjectImageCount > THRESHOLDS.theme03ForeignObjectImages) {
    failures.push(`theme03 rendered thumbnails still use SVG foreignObject images: ${theme03Stats.foreignObjectImageCount}`);
  }
  if (!theme03.similarity?.sampleCount) {
    failures.push('theme03 similarity validation had no samples');
  } else if (theme03.similarity.failedCount > 0) {
    failures.push(`theme03 thumbnails do not match real slide screenshots: ${JSON.stringify(theme03.similarity)}`);
  }
  if (theme03.longTasks.countOver50 > THRESHOLDS.theme03OpenLongTaskCount || theme03.longTasks.maxMs > THRESHOLDS.theme03OpenLongTaskMaxMs) {
    failures.push(`theme03 overview open keeps main thread busy: longTasks=${JSON.stringify(theme03.longTasks)}, stages=${JSON.stringify(theme03.stages)}`);
  }
  if (theme03.frameGaps.over100Count > THRESHOLDS.theme03FrameGapOver100MaxCount || theme03.frameGaps.maxGapMs > THRESHOLDS.theme03FrameGapMaxMs) {
    failures.push(`theme03 overview open has visible frame gaps: ${JSON.stringify(theme03.frameGaps)}`);
  }
  const theme03HeavyTasks = (theme03.thumbnailTasks || [])
    .filter(task => (task.type === 'runtime-slide-prepare' || task.type === 'dom-derived-preview') && task.durationMs >= 50);
  if (theme03HeavyTasks.length > THRESHOLDS.theme03OpenLongTaskCount) {
    failures.push(`theme03 generated too many heavy thumbnails during open: ${JSON.stringify(theme03HeavyTasks.slice(0, 8))}`);
  }
  const theme03RuntimePrepare = theme03.stages?.['runtime-slide-prepare'];
  const theme03Derived = theme03.stages?.['dom-derived-preview'];
  if ((theme03RuntimePrepare?.count || 0) >= theme03.renderedState.renderedCount && theme03RuntimePrepare?.maxMs >= 50) {
    failures.push(`theme03 prepared visible slides on the open path: ${JSON.stringify(theme03RuntimePrepare)}`);
  }
  if ((theme03Derived?.count || 0) >= theme03.renderedState.renderedCount && theme03Derived?.maxMs >= 50) {
    failures.push(`theme03 derived visible thumbnails on the open path: ${JSON.stringify(theme03Derived)}`);
  }
  if (theme03.frameGaps.maxGapMs > THRESHOLDS.frameGapHardMaxMs || theme03.frameGaps.over180Count > THRESHOLDS.frameGapOver180MaxCount) {
    failures.push(`theme03 overview open caused frame gap: ${JSON.stringify(theme03.frameGaps)}`);
  }
  if (theme03.progress?.blocksViewport) {
    failures.push(`theme03 overview progress blocks viewport: ${JSON.stringify(theme03.progress)}`);
  }
  if (!theme03.placeholderFill?.visibleCount) {
    failures.push('theme03 placeholder fill validation had no visible cards');
  } else if (theme03.placeholderFill.allVisibleFilledMs === null) {
    failures.push(`theme03 placeholders did not finish filling: ${JSON.stringify(theme03.placeholderFill)}`);
  }

  const theme02 = result.theme02Visual;
  if (!theme02?.similarity?.sampleCount) {
    failures.push('theme02 animation-state validation had no samples');
  } else if (theme02.similarity.failedCount > 0) {
    failures.push(`theme02 thumbnails are black/initial animation frames or do not match stable slides: ${JSON.stringify(theme02.similarity)}`);
  }
  if (theme02?.visualStats?.brokenCount) failures.push(`theme02 has broken thumbnail images: ${theme02.visualStats.brokenCount}`);

  const staticChecks = result.staticChecks;
  if (staticChecks.captureUsesForeignObjectSvgFastPath) failures.push('thumbnail capture still uses SVG foreignObject as the fast path');
  if (staticChecks.dirtyCallsSyncSvg) failures.push('dirty invalidation still synchronously creates SVG thumbnails');
  if (staticChecks.commitUsesFullAppendLoop) failures.push('drop commit still uses a full deck appendChild loop');
  if (staticChecks.litePreviewDisablesImages) failures.push('thumbnail preview still disables page imagery with imageUrl=""');
  if (staticChecks.syntheticOverviewThumbPath) failures.push('overview thumbnail main path still synthesizes thumbnails with fixed visual/text slots instead of real page rendering');
  if (staticChecks.placeholderMarkedRendered) failures.push('overview placeholder can be marked as a rendered thumbnail');
  if (staticChecks.domCloneMissingScriptRemoval) failures.push('DOM clone thumbnail path does not remove script/style/template nodes');
  if (staticChecks.domCloneMissingMediaStatic) failures.push('DOM clone thumbnail path does not staticize iframe/video content');
  if (staticChecks.domCloneMissingAnimationStatic) failures.push('DOM clone thumbnail path does not force animation/transition static state');
  if (staticChecks.domCloneMissingContainment) failures.push('DOM clone thumbnail path does not contain layout/paint/style work');
  if (staticChecks.domCloneMissingCache) failures.push('DOM clone thumbnail path is not cached for reuse');
  if (staticChecks.fallbackUsesRawRenderedClone) failures.push('overview fallback can mark an unsanitized raw DOM clone as rendered');
  if (staticChecks.fakeIdleDeadline) failures.push('overview thumbnail queue fakes an idle deadline with timeRemaining() => 16');
  if (staticChecks.overviewQueueClaimsIdle) failures.push('overview thumbnail queue claims requestIdleCallback semantics without using the time-sliced queue contract');
  if (staticChecks.overviewSourceCapsImportedCanvas) failures.push('overview thumbnail source size still caps imported theme canvas to 960px and can crop full-frame slides');

  return failures;
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function round(value) {
  return Math.round(value * 10) / 10;
}
