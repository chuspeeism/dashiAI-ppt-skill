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
    media: page.media,
  };
}

function chooseLayout(page, role, { randomSeed, index, usedLayouts, rolePools }) {
  const layouts = normalizeLayoutPool(page.layouts || page.layoutPool || page.candidates || rolePools[role]);
  if (!layouts.length) {
    throw new Error(`Unknown slide role "${page.role}". Use layout directly or choose one of: ${Object.keys(rolePools).join(', ')}`);
  }
  const available = layouts.filter(layout => !usedLayouts.has(layout));
  const pool = available.length ? available : layouts;
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
    const matched = pages.filter(page => pageMatches(page, keywords)).map(page => page.key);
    return [role, matched.length ? matched : fallbackRoleLayouts(role, allLayouts)];
  }));
}

function pageMatches(page, keywords) {
  const text = `${page.slot || ''} ${page.label || ''}`.toLowerCase();
  return keywords.some(keyword => text.includes(keyword.toLowerCase()));
}

function fallbackRoleLayouts(role, layouts) {
  if (!layouts.length) return [];
  if (role === 'cover') return [layouts[0]];
  if (role === 'closing') return [layouts[layouts.length - 1]];
  return layouts;
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
