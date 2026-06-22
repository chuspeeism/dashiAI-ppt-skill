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
    localStorage.clear();
  });
  await page.goto(`${url}?dynamic_page_numbers=${Date.now()}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#deck > .slide.active, #deck > .slide[data-deck-active]');
  await settle(page, 500);

  const probes = [];
  for (const theme of ACCEPTED_THEME_KEYS) {
    probes.push(await probeThemeForSlots(page, theme));
  }

  const theme12 = await runTheme12Scenario(page);
  const theme07 = await probeThemeForSlots(page, 'theme07');
  const result = {
    url,
    passed: false,
    staticChecks,
    probes,
    theme12,
    theme07,
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
  const files = [
    'assets/template-swiss.html',
    'src/components/themes/client-runtime.jsx',
    'src/components/themes/runtime-helpers.jsx',
    'src/components/themes/theme12/source/src/swBase.jsx',
    'src/components/themes/theme07/source/src/pages/CoverBizPlanPage.jsx',
    'src/components/themes/theme07/source/src/pages/CoverSupplyStrategyPage.jsx',
    'src/components/themes/theme07/source/src/pages/CoverRetailTrainingPage.jsx',
  ];
  const failures = [];
  for (const file of files) {
    const full = path.join(ROOT, file);
    if (!existsSync(full)) continue;
    const source = readFileSync(full, 'utf8');
    if (/theme\d{2}_page\d{3}['"]?\s*:\s*['"]?\d+/.test(source)) {
      failures.push(`${file} contains a themeXX_pageYYY to number mapping.`);
    }
  }
  return { files, failures };
}

async function probeThemeForSlots(page, theme) {
  await switchTheme(page, theme);
  const samples = [];
  const limit = await page.evaluate(() => Math.min(6, window.__getVisibleSlides?.().length || 0));
  for (let index = 0; index < limit; index += 1) {
    await go(page, index);
    const state = await readActivePageNumber(page);
    samples.push({
      index,
      layout: state.layout,
      slotCount: state.slots.length,
      slots: state.slots.map(slot => slot.text),
    });
    if (state.slots.length) break;
  }
  const found = samples.some(sample => sample.slotCount > 0);
  return {
    theme,
    status: found ? 'covered' : 'skipped',
    reason: found ? '' : 'No explicit current-page page-number slot was found in the sampled slides.',
    samples,
  };
}

async function runTheme12Scenario(page) {
  await switchTheme(page, 'theme12');
  const initial = await assertActivePageNumber(page, { expectedCurrent: 1, label: 'theme12 initial' });
  const drag = await dragRailCard(page, 0, 4);
  await settle(page, 900);
  const afterDrag = await assertActivePageNumber(page, { label: 'after rail drag reorder' });

  await clickRailMenuAction(page, 0, '删除页面');
  await settle(page, 900);
  const afterDelete = await assertActivePageNumber(page, { label: 'after delete' });

  await clickRailMenuAction(page, 0, '跳过页面');
  await settle(page, 900);
  const afterSkip = await assertActivePageNumber(page, { label: 'after skip' });

  const beforeCopy = await readActivePageNumber(page);
  const activeCatalogIndex = await page.evaluate(() => {
    const active = window.__getVisibleSlides?.()[window.__currentSlideIndex || 0];
    const cards = [...document.querySelectorAll('[data-overview-card="true"]')];
    return cards.findIndex(card => card.dataset.slideId === active?.dataset.vmSlideId);
  });
  await clickRailMenuAction(page, activeCatalogIndex, '复制页面');
  await settle(page, 1000);
  await go(page, beforeCopy.currentIndex + 1);
  const afterCopy = await assertActivePageNumber(page, {
    expectedCurrent: beforeCopy.currentIndex + 2,
    label: 'after copy navigated to duplicate',
  });

  const internalKeys = await page.evaluate(() => {
    const active = window.__getVisibleSlides?.()[window.__currentSlideIndex || 0];
    const root = active?.querySelector?.('.imported-theme-root');
    return {
      slideId: active?.dataset.vmSlideId || '',
      slideKey: active?.dataset.vmSlideKey || '',
      vmLayout: active?.dataset.vmLayout || '',
      pageKey: root?.dataset.pageKey || '',
      stableTheme12PageKey: /^theme12_page\d{3}$/.test(root?.dataset.pageKey || ''),
    };
  });

  return {
    status: 'covered',
    skipSemantics: 'Skipped slides are excluded from the playable visible slide set, so they do not count in displayed current page or total.',
    initial,
    drag,
    afterDrag,
    afterDelete,
    afterSkip,
    beforeCopy,
    afterCopy,
    internalKeys,
  };
}

async function switchTheme(page, theme) {
  await page.evaluate(themeKey => {
    window.__setActiveThemePack?.(themeKey, { navigate: false });
    window.go?.(0, { animate: false, force: true, skipThumbPause: true });
    window.__refreshRailCatalog?.();
  }, theme);
  await settle(page, 700);
}

async function go(page, index) {
  await page.evaluate(target => window.go?.(target, { animate: false, force: true, skipThumbPause: true }), index);
  await settle(page, 420);
}

async function assertActivePageNumber(page, { expectedCurrent = null, label }) {
  const state = await readActivePageNumber(page);
  if (!state.slots.length) {
    throw new Error(`${label}: active slide has no explicit dynamic page-number slot.`);
  }
  const expected = {
    current: expectedCurrent ?? state.currentIndex + 1,
    total: state.total,
  };
  const mismatches = state.slots.filter(slot => {
    if (slot.current !== expected.current) return true;
    return slot.kind !== 'current' && slot.total !== expected.total;
  });
  if (mismatches.length) {
    throw new Error(`${label}: page-number mismatch ${JSON.stringify({ expected, slots: state.slots })}`);
  }
  if (state.editableSlotCount > 0) {
    throw new Error(`${label}: page-number slots must not be editable text.`);
  }
  return { ...state, expected };
}

async function readActivePageNumber(page) {
  return page.evaluate(() => {
    const visible = window.__getVisibleSlides?.() || [...document.querySelectorAll('#deck > .slide:not([hidden])')];
    const currentIndex = window.__currentSlideIndex || 0;
    const active = visible[currentIndex] || document.querySelector('#deck > .slide.active');
    window.__ensureRuntimeSlideRendered?.(active);
    window.__syncDeckPageNumbers?.();
    const slots = [...(active?.querySelectorAll?.('[data-dashi-page-number]') || [])].map(slot => {
      const currentEl = slot.querySelector('[data-dashi-page-current]');
      const totalEl = slot.querySelector('[data-dashi-page-total]');
      const text = normalizedText(slot);
      const kind = slot.dataset.dashiPageNumber || 'fraction';
      return {
        kind,
        text,
        currentText: normalizedText(currentEl),
        totalText: normalizedText(totalEl),
        current: Number(currentEl?.textContent || text.match(/\d+/)?.[0] || NaN),
        total: kind === 'current'
          ? visible.length
          : Number(totalEl?.textContent || [...text.matchAll(/\d+/g)].at(-1)?.[0] || NaN),
      };
    });
    return {
      currentIndex,
      total: visible.length,
      layout: active?.dataset.vmLayout || active?.dataset.layout || '',
      slideId: active?.dataset.vmSlideId || '',
      slots,
      editableSlotCount: active?.querySelectorAll?.('[data-dashi-page-number][contenteditable="true"], [data-dashi-page-number] [contenteditable="true"], [data-dashi-page-number][data-editable-id], [data-dashi-page-number] [data-editable-id]').length || 0,
    };

    function normalizedText(el) {
      return (el?.textContent || '').replace(/\s+/g, ' ').trim();
    }
  });
}

async function dragRailCard(page, fromIndex, toIndex) {
  await page.evaluate(() => window.__refreshRailCatalog?.());
  await settle(page, 300);
  const cards = page.locator('[data-overview-card="true"]');
  const count = await cards.count();
  if (count <= Math.max(fromIndex, toIndex)) throw new Error(`Not enough rail cards for drag: ${count}`);
  const from = await cards.nth(fromIndex).boundingBox();
  const to = await cards.nth(toIndex).boundingBox();
  if (!from || !to) throw new Error('Rail card bounding boxes unavailable for drag.');
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 14 });
  await page.mouse.up();
  return { fromIndex, toIndex };
}

async function clickRailMenuAction(page, cardIndex, actionText) {
  await page.evaluate(() => window.__refreshRailCatalog?.());
  await settle(page, 260);
  const card = page.locator('[data-overview-card="true"]').nth(cardIndex);
  const box = await card.boundingBox();
  if (!box) throw new Error(`Rail card ${cardIndex} is not available for ${actionText}.`);
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2, { button: 'right' });
  const action = page.locator('.rail-context-menu button', { hasText: actionText }).first();
  await action.waitFor({ state: 'visible' });
  await action.click();
}

function validateResult(result) {
  const failures = [...(result.staticChecks.failures || [])];
  const required = new Set(ACCEPTED_THEME_KEYS);
  for (const theme of required) {
    if (!result.probes.some(probe => probe.theme === theme)) failures.push(`Missing probe for ${theme}.`);
  }
  if (result.theme12.status !== 'covered') failures.push('theme12 dynamic page-number scenario did not run.');
  if (!result.theme12.internalKeys?.stableTheme12PageKey) failures.push('theme12 internal page key was not preserved.');
  return failures;
}

async function settle(page, ms = 280) {
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
