#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  compactJson,
  isCoverCandidate,
  listLayouts,
  parseArgs,
} from './skill-workflow-utils.mjs';
import { validateGoalSpec } from './validate-goal-spec.mjs';

const DEFAULT_BODY_ROLES = [
  'statement',
  'breakdown',
  'context',
  'metrics',
  'comparison',
  'distribution',
  'relationship',
  'case',
  'image',
  'trend',
  'process',
  'risks',
  'actions',
  'result',
];

const args = parseArgs(process.argv.slice(2));

if (args.help || args.h) {
  printUsage();
  process.exit(0);
}

try {
  run();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

function run() {
  const title = String(args.title || '').trim() || 'PPT';
  const goal = String(args.goal || '').trim() || title;
  const themePack = String(args.theme || args.themePack || '').trim();
  const pageCount = Math.max(1, Math.min(50, Number(args.pages || args.pageCount || args['page-count']) || 0));
  const chunkSize = Number(args.chunkSize || args['chunk-size']) || 0;
  const out = String(args.out || '').trim();

  if (!themePack) throw new Error('Missing --theme <themePack>');
  if (!pageCount) throw new Error('Missing --pages <n>');
  if (!out) throw new Error('Missing --out <goal.json>');

  const roles = parseRoles(args.roles);
  const slides = buildSlides({ themePack, pageCount, roles });
  const spec = {
    title,
    goal,
    themePack,
    pageCount,
    slides,
  };
  const errors = validateGoalSpec(spec);
  if (errors.length) throw new Error(`Scaffold failed goal spec validation:\n- ${errors.join('\n- ')}`);

  writeJson(out, spec);
  writeChunks(out, spec, chunkSize);
  process.stdout.write(compactJson({
    out: path.resolve(out),
    themePack,
    pageCount,
    slideCount: slides.length,
    chunkSize: chunkSize || null,
  }));
}

function buildSlides({ themePack, pageCount, roles }) {
  const used = new Set();
  return Array.from({ length: pageCount }, (_, index) => {
    const role = index === 0
      ? 'cover'
      : index === pageCount - 1 && pageCount > 2
        ? 'closing'
        : roles[(index - 1) % roles.length];
    const layout = pickLayout({ themePack, role, used, body: index > 0 });
    used.add(layout);
    return { layout, props: {} };
  });
}

function pickLayout({ themePack, role, used, body }) {
  const roleCandidates = listLayouts({ theme: themePack, role, limit: 80 });
  const fallbackCandidates = listLayouts({ theme: themePack, limit: 200 });
  const seen = new Set();
  const candidates = [...roleCandidates, ...fallbackCandidates]
    .map(item => item.layout)
    .filter(Boolean)
    .filter(layout => {
      if (seen.has(layout)) return false;
      seen.add(layout);
      return true;
    })
    .filter(layout => !used.has(layout))
    .filter(layout => !body || !isCoverCandidate(layout));
  const layout = candidates[0];
  if (!layout) throw new Error(`No unused ${body ? 'body' : 'cover'} layout available for role "${role}" in ${themePack}`);
  return layout;
}

function parseRoles(value) {
  const roles = String(value || '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
    .filter(role => role !== 'cover');
  return roles.length ? roles : DEFAULT_BODY_ROLES;
}

function writeChunks(out, spec, chunkSize) {
  if (!Number.isFinite(chunkSize) || chunkSize <= 0) return;
  const size = Math.max(1, Math.round(chunkSize));
  const total = Math.ceil(spec.slides.length / size);
  const parsed = path.parse(out);
  for (let index = 0; index < total; index += 1) {
    const start = index * size;
    const end = Math.min(spec.slides.length, start + size);
    writeJson(path.join(parsed.dir, `${parsed.name}.part-${String(index + 1).padStart(2, '0')}.json`), {
      title: spec.title,
      goal: spec.goal,
      themePack: spec.themePack,
      pageCount: spec.pageCount,
      part: {
        index: index + 1,
        total,
        startSlide: start + 1,
        endSlide: end,
      },
      slides: spec.slides.slice(start, end),
    });
  }
}

function writeJson(file, value) {
  mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
  writeFileSync(file, compactJson(value));
}

function printUsage() {
  console.error('Usage: node scripts/goal-scaffold.mjs --title <title> --goal <goal> --theme <themeXX> --pages <n> --out output/<deck>/goal.json [--roles statement,metrics,case] [--chunk-size 5]');
}
