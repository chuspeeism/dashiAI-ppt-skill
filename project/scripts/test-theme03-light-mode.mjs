#!/usr/bin/env node
import { createServer } from 'node:http';
import { mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { composeDeck } from '../src/deckComposer.jsx';
import { renderDeck } from '../src/renderDeck.jsx';

const ROOT = path.resolve(import.meta.dirname, '..');
const CHROME_PATH = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const LIGHT_BG = 'rgb(214, 214, 211)';

const workDir = mkdtempSync(path.join(tmpdir(), 'theme03-light-'));
const outDir = path.join(workDir, 'ppt');
const outFile = path.join(outDir, 'index.html');

let server;
let browser;

try {
  renderDeck(composeDeck(createRegressionGoal()), { outFile });
  server = await startStaticServer(outDir);
  const url = `http://127.0.0.1:${server.address().port}/`;

  browser = await chromium.launch({ headless: true, executablePath: CHROME_PATH });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(() => {
    localStorage.removeItem('rd-theme');
    localStorage.removeItem('dashi-ppt-view-model');
    Object.keys(localStorage)
      .filter(key => key.startsWith('dashi-ppt-view-model:'))
      .forEach(key => localStorage.removeItem(key));
  });
  await page.reload({ waitUntil: 'load' });
  await page.waitForSelector('#theme-toggle', { state: 'visible', timeout: 10000 });

  const initial = await readTheme03State(page, 'initial');
  if (initial.globalDark !== false) {
    await page.click('#theme-toggle');
    await page.waitForTimeout(750);
  }

  const states = [await readTheme03State(page, 'page-1')];
  for (let i = 1; i < 5; i += 1) {
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(1250);
    states.push(await readTheme03State(page, `page-${i + 1}`));
  }

  const failures = states.filter(state =>
    state.rdTheme !== 'light'
    || state.globalDark !== false
    || state.bodyDark !== false
    || state.shellDark !== false
    || state.bg !== LIGHT_BG
  );

  if (failures.length) {
    console.error(JSON.stringify({ initial, states, failures }, null, 2));
    throw new Error('theme03 light mode changed while paging');
  }

  console.log(`theme03 light mode stayed stable across ${states.length} pages.`);
} finally {
  if (browser) await browser.close();
  if (server) await new Promise(resolve => server.close(resolve));
  rmSync(workDir, { recursive: true, force: true });
}

async function readTheme03State(page, label) {
  return page.evaluate(label => {
    const slides = window.__getVisibleSlides?.() || [...document.querySelectorAll('#deck > .slide:not([hidden])')];
    const current = slides[window.__currentSlideIndex || 0];
    const rd = current?.querySelector('.rd-slide');
    const shell = current?.querySelector('.theme03-theme-shell');
    return {
      label,
      index: window.__currentSlideIndex,
      rdTheme: localStorage.getItem('rd-theme'),
      globalDark: window.__getTheme03GlobalDark?.(),
      bodyDark: document.body.classList.contains('rd-force-dark'),
      shellDark: shell?.classList.contains('theme03-force-dark') ?? null,
      bg: rd ? getComputedStyle(rd).backgroundColor : null,
      layout: current?.dataset.vmLayout || null,
    };
  }, label);
}

function startStaticServer(rootDir) {
  const server = createServer((req, res) => {
    const url = new URL(req.url || '/', 'http://127.0.0.1');
    const pathname = decodeURIComponent(url.pathname);
    const candidate = path.resolve(rootDir, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!candidate.startsWith(rootDir)) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    try {
      const stats = statSync(candidate);
      if (!stats.isFile()) throw new Error('Not a file');
      res.writeHead(200, { 'content-type': contentType(candidate) });
      res.end(readFileSync(candidate));
    } catch {
      res.writeHead(404).end('Not found');
    }
  });
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

function contentType(file) {
  if (file.endsWith('.html')) return 'text/html; charset=utf-8';
  if (file.endsWith('.js')) return 'text/javascript; charset=utf-8';
  if (file.endsWith('.css')) return 'text/css; charset=utf-8';
  if (file.endsWith('.json')) return 'application/json; charset=utf-8';
  if (file.endsWith('.png')) return 'image/png';
  if (file.endsWith('.svg')) return 'image/svg+xml';
  if (file.endsWith('.webp')) return 'image/webp';
  return 'application/octet-stream';
}

function createRegressionGoal() {
  return {
    title: 'theme03 light mode regression',
    goal: 'Verify that theme03 stays in light mode while paging through multiple slides.',
    audience: 'QA',
    owner: 'Codex',
    randomSeed: 'theme03-light-regression',
    pageCount: 5,
    themePack: 'theme03',
    slides: [
      {
        layout: 'theme03_page001',
        props: {
          eyebrow: 'QA',
          kicker: 'Light Mode',
          titlePrefix: 'Theme',
          titleAccent: '03',
          titleSuffix: 'Check',
          lead: 'Confirm light mode is not overwritten by paging or adjacent slide preload.',
          figureValue: '5',
          figureUnit: 'pages',
          figureLabel: 'Regression',
          figureCaption: 'Manual theme state should persist.',
          imageCount: 0,
        },
      },
      {
        layout: 'theme03_page006',
        props: {
          eyebrow: 'AGENDA',
          kicker: 'Paging',
          titlePre: 'State',
          titleAccent: 'Path',
          chapters: [
            { idx: '01', title: 'Toggle', en: 'Light' },
            { idx: '02', title: 'Forward', en: 'Next' },
            { idx: '03', title: 'Preload', en: 'Adjacent' },
            { idx: '04', title: 'Return', en: 'Back' },
          ],
          itemCount: 4,
        },
      },
      {
        layout: 'theme03_page007',
        props: {
          eyebrow: 'METHOD',
          kicker: 'Mount',
          leadTitle: 'Runtime',
          leadBody: 'Inactive slides are released and adjacent pages are rendered again.',
          leadNote: 'Global state must win.',
          cards: [
            { idx: 'A', name: 'Release', dim: 'Unmount', desc: 'Previous theme roots are removed after navigation.' },
            { idx: 'B', name: 'Preload', dim: 'Render', desc: 'Adjacent pages are prepared before they become active.' },
          ],
          cardCount: 2,
        },
      },
      {
        layout: 'theme03_page008',
        props: {
          eyebrow: 'OBSERVE',
          kicker: 'No Reset',
          chartTitle: 'Theme',
          figureValue: '0',
          figureUnit: 'resets',
          figureCaption: 'The slide background should remain light.',
          annotationLabel: 'Expected',
          annotationBody: 'localStorage rd-theme stays light.',
          primaryLegend: 'Light',
          secondaryLegend: 'Dark',
          data: [
            { label: 'P1', amount: 1, count: 1 },
            { label: 'P2', amount: 1, count: 1 },
            { label: 'P3', amount: 1, count: 1 },
            { label: 'P4', amount: 1, count: 1 },
          ],
        },
      },
      {
        layout: 'theme03_page009',
        props: {
          theme: 'QA',
          eyebrow: 'RESULT',
          kicker: 'Stable',
          title: 'Light',
          titleNote: 'Final page stays in the selected mode.',
          metaLabel: 'STATE',
          metaPre: 'Expected',
          metaStrong: 'light',
          metaPost: 'after continuous navigation',
          events: [
            { time: '01', title: 'Open', tag: 'Start', val: 'L', unit: 'mode' },
            { time: '02', title: 'Next', tag: 'Page', val: 'L', unit: 'mode' },
            { time: '03', title: 'End', tag: 'Final', val: 'L', unit: 'mode' },
          ],
          itemCount: 3,
        },
      },
    ],
  };
}
