#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const [, , specArg, htmlArg] = process.argv;

if (!specArg || !htmlArg) {
  console.error('Usage: node scripts/validate-goal-copy.mjs <goal-spec.json> <output/ppt/index.html>');
  process.exit(2);
}

const spec = JSON.parse(readFileSync(specArg, 'utf8'));
const html = readFileSync(htmlArg, 'utf8');
const layoutManifest = readLayoutManifest();
const specText = JSON.stringify(spec, null, 2);
const errors = [];
const COUNT_ARRAY_CANDIDATES = {
  barCount: ['bars'],
  calloutCount: ['callouts'],
  cardCount: ['cards'],
  chipCount: ['chips'],
  colCount: ['columns', 'cols'],
  featureCount: ['features', 'plans[].feats'],
  itemCount: ['items', 'stats', 'data'],
  stepCount: ['steps'],
  laneCount: ['lanes'],
  phaseCount: ['phases'],
  wordCount: ['words'],
  segCount: ['segments', 'segs'],
  roundCount: ['rounds'],
  milestoneCount: ['milestones'],
  statCount: ['stats'],
  pointCount: ['points'],
  planCount: ['plans'],
  rowCount: ['rows', 'features'],
  columnCount: ['columns', 'plans'],
  tileCount: ['tiles'],
  indexCount: ['items', 'index'],
  principleCount: ['principles', 'items'],
  supportingCount: ['supporting'],
  seriesCount: ['series'],
  segmentCount: ['segments'],
};
const visibleText = extractSlideText(html);
const COMMON_TERMS = new Set([
  '一个',
  '一份',
  '制作',
  '生成',
  '演示',
  '页面',
  '主题',
  '用户',
  '目标',
  '受众',
  '团队',
  '重要',
  '展示',
  '呈现',
]);

const groups = [
  {
    name: 'AI Capital / 投融资默认文案',
    allowWhen: /AI|人工智能|资本|投资|融资|风投|VC|venture|OpenAI|xAI|估值|美元/i,
    terms: [
      'AI CAPITAL',
      'AI Capital',
      'OpenAI',
      'xAI',
      'Anthropic',
      'Databricks',
      'Scale AI',
      '融资',
      '风投',
      '资本',
      '亿美元',
      '估值',
      '大模型',
      '投资判断',
    ],
  },
  {
    name: 'SoundWave / 声浪默认文案',
    allowWhen: /SoundWave|声浪|音乐|歌曲|歌手|乐队|创作者|发行|结算|版权|巡演|唱片/i,
    terms: [
      'SoundWave',
      '声浪',
      'Independent Music',
      '音乐人',
      '创作者',
      '发行',
      '结算',
      '版权',
      '巡演',
      '录音棚',
    ],
  },
];

for (const group of groups) {
  if (group.allowWhen.test(specText)) continue;
  const hits = group.terms.filter(term => visibleText.includes(term));
  if (hits.length) {
    errors.push(`${group.name}残留: ${hits.join(', ')}`);
  }
}

const unexpectedDefaultTerms = [
  'Key Metrics',
  '关键指标',
  '全景速览',
  'Roadmap',
  '布局路线',
  '阶段推进',
  'End of Report',
].filter(term => visibleText.includes(term) && !specText.includes(term));
if (unexpectedDefaultTerms.length) {
  errors.push(`未在 goal.json 中声明的模板默认文案残留: ${unexpectedDefaultTerms.join(', ')}`);
}

const neutralPlaceholders = findNeutralPlaceholders(visibleText);
if (neutralPlaceholders.length) {
  errors.push(`中性占位文案残留: ${neutralPlaceholders.join(', ')}`);
}

const requestedTerms = pickRequestedTerms(spec);
if (requestedTerms.length && !requestedTerms.some(term => visibleText.includes(term))) {
  errors.push(`输出正文没有命中用户目标关键词: ${requestedTerms.join(', ')}`);
}

validateCountControls(html, errors);
validateCoverCandidateUsage(html, errors);

if (errors.length) {
  console.error('Goal copy validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Goal copy validation passed.');

function pickRequestedTerms(spec) {
  const raw = [
    spec.title,
    spec.goal,
    spec.audience,
    spec.owner,
  ].filter(Boolean).join(' ');
  const terms = new Set();
  for (const match of raw.matchAll(/[\u4e00-\u9fa5]{2,}/g)) {
    const value = match[0];
    if (value.length <= 2) terms.add(value);
    else {
      terms.add(value.slice(0, 2));
      terms.add(value.slice(-2));
    }
  }
  for (const match of raw.matchAll(/[A-Za-z][A-Za-z0-9-]{2,}/g)) {
    terms.add(match[0]);
  }
  return [...terms].filter(term => !COMMON_TERMS.has(term)).slice(0, 12);
}

function extractSlideText(html) {
  return `${extractRenderedSlideText(html)}\n${extractVisibleDeckPropsText(html)}`;
}

function extractRenderedSlideText(html) {
  const slides = [...html.matchAll(/<section\b[^>]*class="[^"]*\bslide\b[^"]*"[^>]*>[\s\S]*?<\/section>/g)]
    .map(match => match[0]);
  return decodeEntities(slides.map(slide => stripTags(slide)).join('\n'));
}

function extractVisibleDeckPropsText(markup) {
  const model = readJsonScript(markup, 'deck-view-model');
  if (!model?.slides?.length) return '';
  const sections = getSlideSections(markup);
  return JSON.stringify(model.slides.map(slide => ({
    layout: slide.layout,
    props: visiblePropsForSlide(slide, readPropControls(sections.get(slide.id) || '')),
  })));
}

function visiblePropsForSlide(slide, controls = []) {
  const props = slide?.props || {};
  const bindings = getCountBindings(slide, controls);
  const arrayCounts = new Map();
  for (const binding of bindings) {
    const count = numberOrNull(props[binding.key] ?? props[binding.publicKey]);
    if (count == null) continue;
    for (const arrayKey of binding.arrays || []) arrayCounts.set(arrayKey, count);
  }
  const fallbackCount = fallbackVisibleCount(props, bindings);
  return filterVisibleValue(props, '', arrayCounts, fallbackCount);
}

function filterVisibleValue(value, pathName, arrayCounts, fallbackCount) {
  if (Array.isArray(value)) {
    const key = lastPathKey(pathName);
    const explicitCount = arrayCounts.get(pathName) ?? arrayCounts.get(key);
    const limit = explicitCount ?? (shouldSliceByFallback(key, value, fallbackCount) ? fallbackCount : null);
    const visible = limit == null ? value : value.slice(0, limit);
    const itemPath = pathName ? `${pathName}[]` : '[]';
    return visible.map(item => filterVisibleValue(item, itemPath, arrayCounts, fallbackCount));
  }
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([childKey, childValue]) => [
    childKey,
    filterVisibleValue(childValue, pathName ? `${pathName}.${childKey}` : childKey, arrayCounts, fallbackCount),
  ]));
}

function lastPathKey(pathName) {
  return String(pathName || '')
    .split('.')
    .at(-1)
    ?.replace(/\[\]$/, '') || '';
}

function fallbackVisibleCount(props, bindings) {
  const counts = [...new Set((bindings || [])
    .map(binding => numberOrNull(props[binding.key] ?? props[binding.publicKey]))
    .filter(value => value != null))];
  return counts.length === 1 ? counts[0] : null;
}

function shouldSliceByFallback(key, value, fallbackCount) {
  if (fallbackCount == null || !Array.isArray(value) || value.length <= fallbackCount) return false;
  if (isMediaArrayKey(key)) return false;
  return /^(items|cards|stats|data|captions|labels|callouts|features|tiles)$/i.test(String(key || ''));
}

function isMediaArrayKey(key) {
  return /^(images|media|photos|pictures|logos|thumbs|imageSlots|imgs)$/i.test(String(key || ''));
}

function numberOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.round(number) : null;
}

function findNeutralPlaceholders(text) {
  const hits = new Set();
  if (String(text || '').includes('请输入文本')) hits.add('请输入文本');
  return [...hits];
}

function stripTags(markup) {
  return markup
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeEntities(value) {
  return value
    .replaceAll('&quot;', '"')
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&#x27;', "'")
    .replaceAll('&#39;', "'");
}

function validateCountControls(html, errors) {
  const model = readJsonScript(html, 'deck-view-model');
  if (!model?.slides?.length) return;
  const sections = getSlideSections(html);
  for (const slide of model.slides) {
    const section = sections.get(slide.id);
    if (!section) continue;
    const controls = readPropControls(section);
    for (const control of getCountBindings(slide, controls)) {
      const key = control.key;
      const candidates = control.arrays || COUNT_ARRAY_CANDIDATES[key];
      if (!candidates?.length) continue;
      const props = slide.props || {};
      const derived = deriveCount(props, key, candidates);
      if (!derived) continue;
      if (derived.error) errors.push(`${slide.label || slide.layout}: ${derived.error}`);
      else validateCountValue(slide, control, derived, props, errors);
    }
  }
}

function validateCoverCandidateUsage(html, errors) {
  const model = readJsonScript(html, 'deck-view-model');
  if (!model?.slides?.length) return;
  const coverSlides = model.slides.filter(slide => /^theme\d+_page00[1-5]$/.test(slide.layout));
  if (coverSlides.length > 1) {
    errors.push(`同一个 deck 只能使用 1 个封面候选页,当前使用了 ${coverSlides.length} 个: ${coverSlides.map(slide => slide.layout).join(', ')}`);
  }
}

function readLayoutManifest() {
  try {
    return JSON.parse(readFileSync('layout-manifest.json', 'utf8'));
  } catch {
    return null;
  }
}

function getCountBindings(slide, controls = []) {
  const manifestBindings = layoutManifest?.layouts?.[slide.layout]?.countBindings;
  const fallbackBindings = controls
    .filter(control => COUNT_ARRAY_CANDIDATES[control.key])
    .map(control => ({ ...control, arrays: COUNT_ARRAY_CANDIDATES[control.key] }));
  return mergeCountBindings(manifestBindings, fallbackBindings);
}

function mergeCountBindings(primary = [], fallback = []) {
  const result = [];
  const seen = new Set();
  for (const binding of [...(primary || []), ...(fallback || [])]) {
    if (!binding?.key || seen.has(binding.key)) continue;
    seen.add(binding.key);
    result.push(binding);
  }
  return result;
}

function deriveCount(props, key, candidates) {
  const counts = [];
  if (key === 'phaseCount' && Array.isArray(props.lanes)) {
    props.lanes.forEach((lane, index) => {
      if (Array.isArray(lane.items)) counts.push({ source: `lanes[${index}].items`, count: lane.items.length });
    });
  }
  for (const arrayKey of candidates) {
    counts.push(...collectArrayCounts(props, arrayKey));
  }
  if (!counts.length) return null;
  if (candidates.some(isNestedArrayPath)) return collapseNestedCounts(counts);
  return collapseCounts(counts);
}

function collectArrayCounts(value, pathName, sourcePrefix = '') {
  if (!value || typeof value !== 'object') return [];
  const [segment, ...restParts] = String(pathName || '').split('.');
  const rest = restParts.join('.');
  const arraySegment = segment.endsWith('[]');
  const key = arraySegment ? segment.slice(0, -2) : segment;
  const next = value[key];
  const source = sourcePrefix ? `${sourcePrefix}.${key}` : key;

  if (arraySegment) {
    if (!Array.isArray(next)) return [];
    if (!rest) return [{ source, count: next.length }];
    return next.flatMap((item, index) => collectArrayCounts(item, rest, `${source}[${index}]`));
  }

  if (!rest) {
    return Array.isArray(next) ? [{ source, count: next.length }] : [];
  }
  return collectArrayCounts(next, rest, source);
}

function isNestedArrayPath(pathName) {
  return String(pathName || '').includes('[].');
}

function collapseCounts(counts) {
  const unique = [...new Set(counts.map(item => item.count))];
  if (unique.length > 1) {
    return { error: `${counts.map(item => `${item.source}=${item.count}`).join(', ')} 数量不一致` };
  }
  return {
    count: unique[0],
    source: counts.map(item => item.source).join('/'),
  };
}

function collapseNestedCounts(counts) {
  return {
    count: Math.min(...counts.map(item => item.count)),
    source: counts.map(item => `${item.source}=${item.count}`).join('/'),
  };
}

function validateCountValue(slide, control, derived, props, errors) {
  const current = Number(props[control.key]);
  if (!Number.isFinite(current)) {
    errors.push(`${slide.label || slide.layout}: ${control.key} 缺失或不是有效数字,但 ${derived.source} 有 ${derived.count} 条`);
    return;
  }
  if (current > derived.count) {
    errors.push(`${slide.label || slide.layout}: ${control.key}=${current},但 ${derived.source} 只有 ${derived.count} 条`);
  }
  const min = Number(control.min);
  const max = Number(control.max);
  if (Number.isFinite(min) && current < min) {
    errors.push(`${slide.label || slide.layout}: ${control.key}=${current} 小于最小值 ${min}`);
  }
  if (Number.isFinite(max) && current > max) {
    errors.push(`${slide.label || slide.layout}: ${control.key}=${current} 大于最大值 ${max}`);
  }
}

function readJsonScript(html, id) {
  const match = html.match(new RegExp(`<script[^>]*id="${id}"[^>]*>([\\s\\S]*?)<\\/script>`));
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function getSlideSections(html) {
  const sections = new Map();
  for (const match of html.matchAll(/<section\b[\s\S]*?<\/section>/g)) {
    const markup = match[0];
    const id = getAttr(markup, 'data-vm-slide-id');
    if (id) sections.set(id, markup);
  }
  return sections;
}

function readPropControls(section) {
  const raw = getAttr(section, 'data-prop-controls');
  if (!raw) return [];
  try {
    return JSON.parse(decodeEntities(raw));
  } catch {
    return [];
  }
}

function getAttr(markup, name) {
  const match = markup.match(new RegExp(`${name}="([^"]*)"`));
  return match ? match[1] : '';
}
