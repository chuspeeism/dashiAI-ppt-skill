import { DEFAULT_THEME_PACK, THEME_PACK_OPTIONS, slide } from './options.jsx';
import { THEME_PAGES } from './components/themes/index.jsx';

export const ROLE_KEYWORDS = {
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

export const ROLE_ALIASES = {
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

const DEFAULT_ROLE_SEQUENCE = [
  'cover',
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
  'closing',
];

export const THEME_ROLE_LAYOUT_POOLS = Object.fromEntries(
  Object.keys(THEME_PACK_OPTIONS).map(themeKey => [themeKey, buildRoleLayoutPools(themeKey)]),
);

export const ROLE_LAYOUT_POOLS = THEME_ROLE_LAYOUT_POOLS[DEFAULT_THEME_PACK] || {};

export const ROLE_LAYOUTS = Object.fromEntries(
  Object.entries(ROLE_LAYOUT_POOLS).map(([role, layouts]) => [role, layouts[0]]),
);

const THEME_PAGE_BY_KEY = new Map(THEME_PAGES.map(page => [page.key, page]));

export function composeDeck(spec = {}) {
  const goal = spec.goal || spec.title || '主题汇报';
  const title = spec.title || goal;
  const randomSeed = spec.randomSeed || `${title}:${goal}`;
  const themePack = normalizeThemePack(spec.themePack) || DEFAULT_THEME_PACK;
  const sourceSlides = spec.slides?.length
    ? spec.slides
    : defaultSlides({ title, goal, pageCount: getPageCount(spec) });
  const usedLayouts = new Set();
  return {
    themePack,
    title,
    text: spec.text || {},
    media: spec.media || {},
    props: spec.props || {},
    preview: spec.preview || {},
    slides: sourceSlides.map((page, index) => composeSlide(page, {
      randomSeed,
      index,
      usedLayouts,
      rolePools: THEME_ROLE_LAYOUT_POOLS[themePack] || ROLE_LAYOUT_POOLS,
    })),
  };
}

function composeSlide(page, context) {
  if (typeof page === 'string') {
    context.usedLayouts.add(page);
    return slide(page, {});
  }
  const role = normalizeRole(page.role);
  const layout = page.layout || chooseLayout(page, role, context);
  context.usedLayouts.add(layout);
  return {
    ...slide(layout, page.props || {}),
    id: page.id,
    key: page.key || page.slideKey,
    label: page.label,
    logicalIndex: page.logicalIndex,
    copy: page.copy,
  };
}

function chooseLayout(page, role, { randomSeed, index, usedLayouts, rolePools }) {
  const layouts = normalizeLayoutPool(page.layouts || page.layoutPool || page.candidates || rolePools[role]);
  if (!layouts.length) {
    throw new Error(`Unknown slide role "${page.role}". Use layout directly or choose one of: ${Object.keys(rolePools).join(', ')}`);
  }
  const requestedMediaCount = getRequestedMediaCount(page);
  const mediaReadyLayouts = requestedMediaCount
    ? layouts.filter(layout => layoutHasMediaSlot(layout, requestedMediaCount))
    : layouts;
  if (requestedMediaCount && !mediaReadyLayouts.length) {
    throw new Error(`Slide role "${page.role || role}" requires ${requestedMediaCount} media slot(s), but no candidate layout has a usable media slot.`);
  }
  const sourceLayouts = mediaReadyLayouts.length ? mediaReadyLayouts : layouts;
  const available = sourceLayouts.filter(layout => !usedLayouts.has(layout));
  const pool = available.length ? available : sourceLayouts;
  return pool[hashSeed(`${randomSeed}:${role}:${index}`) % pool.length];
}

function normalizeLayoutPool(layouts) {
  if (!layouts) return [];
  return (Array.isArray(layouts) ? layouts : [layouts]).filter(Boolean);
}

function normalizeRole(role) {
  if (!role) return null;
  return ROLE_ALIASES[role] || role;
}

function normalizeThemePack(themePack) {
  return THEME_PACK_OPTIONS[themePack] ? themePack : null;
}

function buildRoleLayoutPools(themeKey) {
  const pages = THEME_PAGES.filter(page => page.themeKey === themeKey);
  const allLayouts = pages.map(page => page.key);
  return Object.fromEntries(Object.entries(ROLE_KEYWORDS).map(([role, keywords]) => {
    const matched = pages
      .filter(page => {
        if (role === 'cover') return page.pageNumber >= 1 && page.pageNumber <= 5;
        if (role === 'image') return pageHasMediaSlot(page);
        return pageMatches(page, keywords);
      })
      .map(page => page.key);
    return [role, matched.length ? matched : fallbackRoleLayouts(role, allLayouts)];
  }));
}

function pageMatches(page, keywords) {
  const text = `${page.slot || ''} ${page.label || ''}`.toLowerCase();
  return keywords.some(keyword => text.includes(keyword.toLowerCase()));
}

function fallbackRoleLayouts(role, layouts) {
  if (!layouts.length) return [];
  if (role === 'cover') return layouts.slice(0, 5);
  if (role === 'closing') return [layouts[layouts.length - 1]];
  return layouts;
}

function getRequestedMediaCount(page = {}) {
  const provided = countMediaItems(page.providedImages);
  if (provided) return provided;
  const planned = countMediaItems(page.plannedImages);
  if (planned) return planned;
  if (page.needsVisual === true || page.needsImageGen === true || page.imageGen === true) return 1;
  return 0;
}

function countMediaItems(value) {
  if (Array.isArray(value)) return value.length;
  if (value === true) return 1;
  const number = Number(value);
  if (Number.isFinite(number) && number > 0) return Math.round(number);
  return 0;
}

function layoutHasMediaSlot(layout, count = 1) {
  const page = THEME_PAGE_BY_KEY.get(layout);
  return page ? pageHasMediaSlot(page, count) : false;
}

function pageHasMediaSlot(page, count = 1) {
  return getMediaSlotCapacities(page).some(capacity => capacity >= Math.max(1, Number(count) || 1));
}

function getMediaSlotCapacities(page) {
  const props = page.defaultProps || {};
  const controls = page.spec?.controls || [];
  const capacities = Object.keys(props)
    .filter(key => Array.isArray(props[key]) && isMediaArrayKey(key))
    .map(key => mediaArrayCapacity(key, props, controls));

  for (const control of controls) {
    if (!isMediaControl(control)) continue;
    const key = control.prop || control.key;
    if (!key || capacities.length) continue;
    capacities.push(mediaControlCapacity(key, props, controls));
  }

  return capacities;
}

function mediaArrayCapacity(key, props, controls) {
  const countControl = controls.find(control => {
    const prop = control.prop || control.key;
    return prop && prop.endsWith('Count') && prop.toLowerCase().includes(key.replace(/s$/i, '').toLowerCase());
  });
  const max = Number(countControl?.max);
  if (Number.isFinite(max) && max > 0) return max;
  return props[key].length || 1;
}

function mediaControlCapacity(key, props, controls) {
  const countControl = controls.find(control => {
    const prop = control.prop || control.key;
    return prop && prop.endsWith('Count') && prop.toLowerCase().includes(key.replace(/s$/i, '').toLowerCase());
  });
  const max = Number(countControl?.max);
  if (Number.isFinite(max) && max > 0) return max;
  const value = props[key];
  return Array.isArray(value) ? Math.max(1, value.length) : 1;
}

function isMediaControl(control) {
  const type = String(control.type || '').toLowerCase();
  const key = String(control.prop || control.key || '').toLowerCase();
  const label = String(control.label || '').toLowerCase();
  if (['images', 'image', 'media', 'picture'].includes(type)) return true;
  if (/^(images|media|photos|pictures|logos|thumbs)$/.test(key)) return true;
  return /图片|图像|视频|媒体/.test(label) && !/^show/.test(key);
}

function isMediaArrayKey(key) {
  return /^(images|media|photos|pictures|logos|thumbs|imageSlots|imgs)$/i.test(String(key || ''));
}

function getPageCount(spec) {
  const value = Number(spec.pageCount ?? spec.pages ?? spec.slideCount);
  if (!Number.isFinite(value)) return 8;
  return Math.max(3, Math.min(30, Math.round(value)));
}

function defaultSlides({ title, goal, pageCount }) {
  const count = Math.max(3, pageCount);
  const middleCount = count - 2;
  const middle = DEFAULT_ROLE_SEQUENCE.slice(1, -1);
  const roles = ['cover'];
  for (let i = 0; i < middleCount; i += 1) roles.push(middle[i % middle.length]);
  roles.push('closing');
  return roles.map((role, index) => ({
    role,
    props: index === 0
      ? { titleLines: [title, goal].filter(Boolean).slice(0, 2) }
      : {},
  }));
}

function hashSeed(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
