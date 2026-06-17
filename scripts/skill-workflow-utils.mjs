import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  createLayoutContracts,
  normalizeSlidePropsForContract,
} from '../src/prop-contract-core.mjs';
import {
  GENERATED_THEME_PACKS,
  GENERATED_THEME_PAGES,
} from '../src/components/themes/generated-metadata.js';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const THEME_PACKS = GENERATED_THEME_PACKS;
export const THEME_PAGES = GENERATED_THEME_PAGES;

const ROLE_KEYWORDS = {
  cover: ['cover', '封面', '首页'],
  statement: ['statement', 'summary', 'overview', 'manifesto', 'quote', '摘要', '主张', '观点', '结论'],
  breakdown: ['contents', 'agenda', 'index', 'directory', '目录', '结构', '纲目'],
  transition: ['section', 'chapter', 'divider', '章节', '序章', '篇章'],
  context: ['market', 'method', 'context', 'industry', '全景', '背景', '方法', '行业'],
  metrics: ['metric', 'stat', 'number', 'score', 'gauge', 'meter', '指标', '数字', '大势', '仪表'],
  trend: ['trend', 'timeline', 'curve', 'area', 'slope', 'stream', '走势', '趋势', '时间', '曲线', '季度'],
  comparison: ['compare', 'versus', 'matrix', 'quadrant', 'delta', 'dumbbell', '对比', '矩阵', '象限', '差距'],
  distribution: ['donut', 'treemap', 'heatmap', 'ranking', 'rank', 'waterfall', 'funnel', 'allocation', 'share', '分布', '占比', '排行', '瀑布', '漏斗'],
  relationship: ['chain', 'flow', 'sankey', 'network', 'orbit', 'ecosystem', 'map', '关系', '链', '流向', '生态', '网络'],
  case: ['case', 'spotlight', 'profile', 'story', '案例', '聚焦', '档案'],
  image: ['image', 'gallery', 'mosaic', 'photo', 'film', 'album', 'poster', 'showcase', '影像', '图景', '图集', '图片', '海报'],
  process: ['process', 'roadmap', 'journey', 'steps', 'gantt', '路径', '流程', '路线', '进程'],
  risks: ['risk', 'faq', 'checklist', '风险', '异议', '问答', '清单'],
  observation: ['quote', 'insight', 'takeaway', 'conclusion', 'statement', 'manifesto', '观点', '洞察', '要点', '结论'],
  actions: ['action', 'roadmap', 'plan', 'join', 'contact', 'next', '行动', '策略', '计划', '套餐'],
  result: ['result', 'outcome', 'score', 'closing', 'conclusion', '成果', '结果', '完成', '结论'],
  team: ['team', 'roster', 'testimonial', 'voice', '团队', '人物', '见证', '证言'],
  closing: ['closing', 'contact', 'join', 'end', 'colophon', '结语', '封底', '行动'],
};

const ROLE_ALIASES = {
  agenda: 'breakdown',
  summary: 'statement',
  insight: 'observation',
  quote: 'observation',
  chart: 'metrics',
  data: 'metrics',
  timeline: 'trend',
  compare: 'comparison',
  flow: 'process',
  roadmap: 'actions',
  visual: 'image',
  gallery: 'image',
  media: 'image',
  picture: 'image',
  photo: 'image',
};

const contracts = createLayoutContracts(THEME_PAGES);
const pagesByKey = new Map(THEME_PAGES.map(page => [page.key, page]));
const manifest = readManifest();

export function parseArgs(argv) {
  const args = { _: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith('--')) {
      args._.push(item);
      continue;
    }
    const key = item.slice(2);
    const next = argv[index + 1];
    if (next == null || next.startsWith('--')) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    index += 1;
  }
  return args;
}

export function compactJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function listLayouts({
  theme,
  role,
  keyword,
  needsMedia = false,
  plannedImages = false,
  providedImages = false,
  imageGen = false,
  needsVisual = false,
  mediaCount = null,
  limit = 12,
} = {}) {
  const normalizedRole = role ? ROLE_ALIASES[role] || role : '';
  const keywords = normalizedRole ? ROLE_KEYWORDS[normalizedRole] || [normalizedRole] : [];
  const keywordText = String(keyword || '').trim().toLowerCase();
  const requestedMediaCount = getRequestedMediaCount({ plannedImages, providedImages, imageGen, needsVisual, mediaCount });
  const requiresMedia = needsMedia || requestedMediaCount > 0 || normalizedRole === 'image';
  let rows = THEME_PAGES
    .filter(page => !theme || page.themeKey === theme)
    .filter(page => {
      if (!normalizedRole) return true;
      if (normalizedRole === 'cover') return isCoverCandidate(page.key);
      if (normalizedRole === 'image') return inspectLayout(page.key, { compact: true })?.mediaSlots.length;
      return pageMatches(page, keywords);
    })
    .filter(page => !keywordText || pageSearchText(page).includes(keywordText))
    .map(page => inspectLayout(page.key, { compact: true }))
    .filter(Boolean)
    .filter(row => !requiresMedia || row.mediaSlots.length)
    .filter(row => !requestedMediaCount || mediaSlotsCanFit(row.mediaSlots, requestedMediaCount));

  rows = rows.sort((a, b) => scoreLayout(b, { normalizedRole, keywordText, requiresMedia, requestedMediaCount }) - scoreLayout(a, { normalizedRole, keywordText, requiresMedia, requestedMediaCount }));
  return rows.slice(0, Math.max(1, Math.min(50, Number(limit) || 12)));
}

export function inspectLayout(layout, { compact = false } = {}) {
  const record = getLayoutRecord(layout);
  if (!record) return null;
  const { page, contract, controls, countBindings, defaultProps } = record;
  const controlKeys = controls.map(control => control.key).filter(Boolean);
  const mediaSlots = getMediaSlots(record);
  const copyKeys = getCopyKeys(defaultProps, controls, mediaSlots);
  const arrayKeys = getArrayKeys(defaultProps, mediaSlots);
  const defaultVisibleCounts = Object.fromEntries(countBindings
    .map(binding => [binding.key, defaultProps[binding.key] ?? controls.find(control => control.key === binding.key)?.default])
    .filter(([, value]) => value !== undefined));

  const base = {
    layout: page.key,
    theme: page.themeKey,
    pageNumber: page.pageNumber,
    label: page.label,
    slot: page.slot,
    roles: inferRoles(page, mediaSlots),
    copyKeys,
    arrayKeys,
    mediaSlots,
    countBindings,
    controlKeys,
    defaultVisibleCounts,
  };

  if (compact) {
    return {
      layout: base.layout,
      label: base.label,
      slot: base.slot,
      roles: base.roles,
      copyKeys: base.copyKeys.slice(0, 10),
      arrayKeys: base.arrayKeys.slice(0, 8),
      mediaSlots: base.mediaSlots,
      countBindings: base.countBindings,
      defaultVisibleCounts: base.defaultVisibleCounts,
    };
  }

  return {
    ...base,
    allowedPropKeys: [...new Set([...Object.keys(defaultProps), ...controlKeys])].sort(),
  };
}

export function normalizeProps(layout, props = {}) {
  const record = getLayoutRecord(layout);
  if (!record) {
    return {
      props: props || {},
      warnings: [],
      errors: [`Unknown layout "${layout}"`],
    };
  }
  const warnings = unknownPropKeys(record, props).map(key => `Unknown prop "${key}" for ${layout}`);
  try {
    const propsWithCountSafety = normalizeSlidePropsForContract(layout, props, record.contract);
    return {
      props: mergeDefaultArrayTails(propsWithCountSafety, record.defaultProps),
      warnings,
      errors: [],
    };
  } catch (error) {
    return {
      props: props || {},
      warnings,
      errors: [error.message],
    };
  }
}

export function getMediaSlotsForLayout(layout) {
  const record = getLayoutRecord(layout);
  return record ? getMediaSlots(record) : [];
}

export function mediaSlotsCanFit(slots = [], count = 1) {
  const requested = Math.max(1, Number(count) || 1);
  return slots.some(slot => mediaSlotCapacity(slot) >= requested);
}

export function mediaSlotCapacity(slot) {
  const max = Number(slot?.max);
  if (Number.isFinite(max) && max > 0) return max;
  const defaultCount = Number(slot?.defaultCount);
  if (Number.isFinite(defaultCount) && defaultCount > 0) return defaultCount;
  return 1;
}

export function getPreferredMediaSlot(layout, { kind = 'images', count = 1 } = {}) {
  const slots = getMediaSlotsForLayout(layout);
  if (!slots.length) return null;
  const requested = Math.max(1, Number(count) || 1);
  const fieldPattern = kind === 'media' ? /^(media|images)$/i : /^(images|photos|pictures|thumbs|logos|media)$/i;
  return slots.find(slot => fieldPattern.test(slot.field) && mediaSlotCapacity(slot) >= requested)
    || slots.find(slot => mediaSlotCapacity(slot) >= requested)
    || null;
}

function mergeDefaultArrayTails(props, defaults) {
  const next = { ...(props || {}) };
  for (const [key, value] of Object.entries(props || {})) {
    if (!Array.isArray(value) || !Array.isArray(defaults?.[key])) continue;
    if (value.length >= defaults[key].length) continue;
    next[key] = [
      ...value.map((item, index) => mergeArrayItem(defaults[key][index], item)),
      ...defaults[key].slice(value.length),
    ];
  }
  return next;
}

function mergeArrayItem(defaultItem, item) {
  if (isPlainObject(defaultItem) && isPlainObject(item)) return { ...defaultItem, ...item };
  return item;
}

export function getLayoutRecord(layout) {
  const page = pagesByKey.get(layout);
  if (!page) return null;
  const baseContract = contracts.get(layout);
  const manifestLayout = manifest.layouts?.[layout] || {};
  const controls = manifestLayout.controls || baseContract?.controls || [];
  const countBindings = manifestLayout.countBindings || baseContract?.countBindings || [];
  const contract = {
    ...(baseContract || {}),
    controls,
    countBindings,
  };
  return {
    page,
    contract,
    controls,
    countBindings,
    defaultProps: baseContract?.defaultProps || {},
  };
}

export function layoutExists(layout) {
  return pagesByKey.has(layout);
}

export function isCoverCandidate(layout) {
  return /^theme\d+_page00[1-5]$/.test(layout);
}

export function isCoverLikeLayout(layout) {
  const record = getLayoutRecord(layout);
  if (!record) return false;
  const slot = String(record.page.slot || '').toLowerCase();
  const label = String(record.page.label || '').toLowerCase();
  return slot.startsWith('cover') || label.startsWith('封面') || /^cover/.test(label);
}

export function getAllowedPropKeys(layout) {
  const record = getLayoutRecord(layout);
  if (!record) return new Set();
  return new Set([
    ...Object.keys(record.defaultProps || {}),
    ...record.controls.map(control => control.key).filter(Boolean),
  ]);
}

export function unknownPropKeys(record, props = {}) {
  const allowed = new Set([
    ...Object.keys(record.defaultProps || {}),
    ...record.controls.map(control => control.key).filter(Boolean),
  ]);
  return Object.keys(props || {}).filter(key => !allowed.has(key));
}

function getCopyKeys(defaultProps, controls, mediaSlots) {
  const controlKeys = new Set(controls.map(control => control.key));
  const mediaFields = new Set(mediaSlots.map(slot => slot.field));
  return Object.entries(defaultProps || {})
    .filter(([key, value]) => !controlKeys.has(key) && !mediaFields.has(key) && isCopyValue(value))
    .map(([key]) => key);
}

function getArrayKeys(defaultProps, mediaSlots) {
  const mediaFields = new Set(mediaSlots.map(slot => slot.field));
  return Object.entries(defaultProps || {})
    .filter(([key, value]) => Array.isArray(value) && !mediaFields.has(key))
    .map(([key]) => key);
}

function isCopyValue(value) {
  if (value == null) return false;
  if (['string', 'number'].includes(typeof value)) return true;
  if (Array.isArray(value)) return value.length > 0 && value.every(item => item == null || ['string', 'number'].includes(typeof item) || isPlainObject(item));
  return isPlainObject(value);
}

function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function getMediaSlots({ controls, countBindings, defaultProps }) {
  const slots = [];
  for (const binding of countBindings || []) {
    const mediaArrays = (binding.arrays || []).filter(isMediaArrayKey);
    for (const field of mediaArrays) {
      slots.push(mediaSlot(field, binding.key, controls, defaultProps, binding));
    }
  }
  for (const control of controls || []) {
    if (!isMediaControl(control)) continue;
    const field = isMediaArrayKey(control.key) ? control.key : firstMediaArray(defaultProps) || control.key;
    slots.push(mediaSlot(field, control.countKey, controls, defaultProps, control));
  }
  for (const field of Object.keys(defaultProps || {}).filter(key => Array.isArray(defaultProps[key]) && isMediaArrayKey(key))) {
    slots.push(mediaSlot(field, undefined, controls, defaultProps, {}));
  }
  return dedupeSlots(slots).filter(slot => slot.field);
}

function mediaSlot(field, countKey, controls, defaultProps, source) {
  const countControl = controls.find(control => control.key === countKey);
  const fieldControl = controls.find(control => control.key === field);
  const defaultCount = countKey ? defaultProps[countKey] ?? countControl?.default : Array.isArray(defaultProps[field]) ? defaultProps[field].length : undefined;
  return {
    field,
    countKey: countKey || fieldControl?.countKey || null,
    defaultCount: defaultCount ?? null,
    min: source.min ?? countControl?.min ?? null,
    max: source.max ?? countControl?.max ?? null,
    controlKey: fieldControl?.key || null,
  };
}

function dedupeSlots(slots) {
  const seen = new Set();
  return slots.filter(slot => {
    const key = `${slot.field}:${slot.countKey || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function firstMediaArray(defaultProps = {}) {
  return Object.keys(defaultProps).find(key => Array.isArray(defaultProps[key]) && isMediaArrayKey(key));
}

function isMediaControl(control) {
  const type = String(control.type || '').toLowerCase();
  const key = String(control.key || '').toLowerCase();
  const label = String(control.label || '').toLowerCase();
  if (['images', 'image', 'media', 'picture'].includes(type)) return true;
  if (/^(images|media|photos|pictures|logos|thumbs)$/.test(key)) return true;
  return /图片|图像|视频|媒体/.test(label) && !/^show/.test(key);
}

function isMediaArrayKey(key) {
  return /^(images|media|photos|pictures|logos|thumbs|imageSlots|imgs)$/i.test(String(key || ''));
}

function inferRoles(page, mediaSlots = []) {
  return Object.entries(ROLE_KEYWORDS)
    .filter(([role, keywords]) => {
      if (role === 'cover') return isCoverCandidate(page.key);
      if (role === 'image') return mediaSlots.length > 0;
      return pageMatches(page, keywords);
    })
    .map(([role]) => role)
    .slice(0, 6);
}

function pageMatches(page, keywords) {
  const text = pageSearchText(page);
  return keywords.some(keyword => text.includes(keyword.toLowerCase()));
}

function pageSearchText(page) {
  return `${page.key} ${page.slot || ''} ${page.label || ''}`.toLowerCase();
}

function scoreLayout(layout, { normalizedRole, keywordText, requiresMedia, requestedMediaCount }) {
  let score = 0;
  if (normalizedRole && layout.roles.includes(normalizedRole)) score += 20;
  if (keywordText && `${layout.label} ${layout.slot}`.toLowerCase().includes(keywordText)) score += 10;
  if (requiresMedia && layout.mediaSlots.length) score += 8;
  if (requestedMediaCount && layout.mediaSlots.some(slot => Number(slot.defaultCount) === requestedMediaCount)) score += 3;
  score -= layout.pageNumber / 1000;
  return score;
}

function getRequestedMediaCount({ plannedImages, providedImages, imageGen, needsVisual, mediaCount }) {
  const explicit = Number(mediaCount);
  if (Number.isFinite(explicit) && explicit > 0) return Math.round(explicit);
  const provided = mediaIntentCount(providedImages);
  if (provided) return provided;
  const planned = mediaIntentCount(plannedImages);
  if (planned) return planned;
  if (imageGen || needsVisual) return 1;
  return 0;
}

function mediaIntentCount(value) {
  if (Array.isArray(value)) return value.length;
  if (value === true) return 1;
  const number = Number(value);
  if (Number.isFinite(number) && number > 0) return Math.round(number);
  return 0;
}

function readManifest() {
  const file = path.join(ROOT, 'layout-manifest.json');
  if (!existsSync(file)) return { layouts: {} };
  return JSON.parse(readFileSync(file, 'utf8'));
}
