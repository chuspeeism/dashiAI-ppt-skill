import { THEME_PAGES } from './components/themes/index.jsx';

export const COUNT_ARRAY_BINDINGS = {
  barCount: ['bars'],
  calloutCount: ['callouts'],
  cardCount: ['cards'],
  chipCount: ['chips'],
  colCount: ['columns', 'cols'],
  columnCount: ['columns', 'plans'],
  indexCount: ['items', 'index'],
  itemCount: ['items', 'stats', 'data'],
  laneCount: ['lanes'],
  milestoneCount: ['milestones'],
  phaseCount: ['phases'],
  planCount: ['plans'],
  pointCount: ['points'],
  principleCount: ['principles', 'items'],
  roundCount: ['rounds'],
  rowCount: ['rows', 'features'],
  segmentCount: ['segments'],
  segCount: ['segments', 'segs'],
  seriesCount: ['series'],
  statCount: ['stats'],
  stepCount: ['steps'],
  supportingCount: ['supporting'],
  tileCount: ['tiles'],
  wordCount: ['words'],
};

const CONTRACTS = new Map([
  ...THEME_PAGES.map(page => [page.key, createContract(page, page.themeKey)]),
]);

export function getLayoutContract(layout) {
  return CONTRACTS.get(layout) || null;
}

export function normalizeSlidePropsForLayout(layout, props = {}) {
  const contract = getLayoutContract(layout);
  const authoredProps = props || {};
  const authoredCounts = deriveAuthoredCounts(authoredProps, contract?.countBindings || []);
  const next = contract ? mergeCountBoundArrayProps(authoredProps, contract) : { ...authoredProps };
  if (!contract) return next;

  const errors = [];
  for (const binding of contract.countBindings) {
    const derived = deriveCount(next, binding);
    if (!derived) continue;

    if (derived.error) {
      errors.push(derived.error);
      continue;
    }

    const current = next[binding.key];
    if (current == null || current === '') {
      next[binding.key] = authoredCounts.get(binding.key) ?? derived.count;
      validateCountRange(binding, next[binding.key], binding.key, errors);
      continue;
    }

    const currentNumber = Number(current);
    if (!Number.isFinite(currentNumber)) {
      errors.push(`${binding.key} 不是有效数字`);
    } else {
      validateCountRange(binding, currentNumber, binding.key, errors);
      if (currentNumber > derived.count) {
        errors.push(`${binding.key}=${currentNumber},但 ${derived.source} 只有 ${derived.count} 条`);
      }
    }
  }

  if (errors.length) {
    throw new Error(`Slide props mismatch for "${layout}": ${errors.join('; ')}`);
  }
  return next;
}

export function buildLayoutManifest() {
  return {
    version: 1,
    countArrayBindings: COUNT_ARRAY_BINDINGS,
    layouts: Object.fromEntries([...CONTRACTS.entries()].map(([key, contract]) => [key, serializeContract(contract)])),
  };
}

function createContract(page, themePack) {
  const controls = normalizeControls(page);
  const countBindings = controls
    .map(control => ({
      control,
      arrays: COUNT_ARRAY_BINDINGS[control.key] || inferCountArrayBindings(control.key, page.defaultProps),
    }))
    .filter(item => item.arrays.length)
    .map(({ control, arrays }) => ({
      key: control.key,
      arrays,
      min: control.min,
      max: control.max,
    }));

  return {
    key: page.key,
    themePack,
    pageNumber: page.pageNumber,
    label: page.label,
    slot: page.slot,
    dataLayout: page.layout,
    defaultProps: serializeValue(page.defaultProps || {}) || {},
    controls,
    countBindings,
  };
}

function deriveAuthoredCounts(props, bindings) {
  const counts = new Map();
  for (const binding of bindings) {
    const derived = deriveCount(props, binding);
    if (derived && !derived.error) counts.set(binding.key, derived.count);
  }
  return counts;
}

function mergeCountBoundArrayProps(props, contract) {
  const next = { ...(props || {}) };
  const defaults = contract.defaultProps || {};
  for (const binding of contract.countBindings) {
    for (const arrayKey of binding.arrays) {
      if (!Array.isArray(props[arrayKey]) || !Array.isArray(defaults[arrayKey])) continue;
      next[arrayKey] = mergeArrayWithDefaultTail(props[arrayKey], defaults[arrayKey]);
    }
  }
  return next;
}

function mergeArrayWithDefaultTail(items, defaults) {
  if (items.length >= defaults.length) {
    return items.map((item, index) => mergeArrayItem(defaults[index], item));
  }
  return [
    ...items.map((item, index) => mergeArrayItem(defaults[index], item)),
    ...defaults.slice(items.length),
  ];
}

function mergeArrayItem(defaultItem, item) {
  if (isPlainObject(defaultItem) && isPlainObject(item)) return { ...defaultItem, ...item };
  return item;
}

function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function serializeContract(contract) {
  const { defaultProps, ...publicContract } = contract;
  return publicContract;
}

function inferCountArrayBindings(key, props = {}) {
  if (!String(key || '').endsWith('Count')) return [];
  const arrayKeys = Object.keys(props || {}).filter(propKey => Array.isArray(props[propKey]));
  if (!arrayKeys.length) return [];

  const stem = lowerFirst(String(key).slice(0, -'Count'.length));
  const candidates = buildCountArrayCandidates(stem);
  for (const candidate of candidates) {
    const exact = arrayKeys.find(propKey => propKey === candidate);
    if (exact) return [exact];
  }

  const normalizedCandidates = new Set(candidates.map(normalizeName));
  const normalized = arrayKeys.find(propKey => normalizedCandidates.has(normalizeName(propKey)));
  return normalized ? [normalized] : [];
}

function buildCountArrayCandidates(stem) {
  const explicit = {
    agenda: ['agenda', 'items'],
    annotation: ['annotations'],
    asset: ['assets'],
    axis: ['axes'],
    block: ['blocks'],
    branch: ['branches'],
    bubble: ['bubbles'],
    cat: ['categories', 'data'],
    category: ['categories'],
    chain: ['chains', 'chain'],
    conclusion: ['conclusions'],
    criterion: ['criteria'],
    dim: ['dims', 'dimensions'],
    dimension: ['dimensions', 'dims'],
    exp: ['experiences'],
    factor: ['factors'],
    feature: ['features'],
    field: ['fields'],
    flowStage: ['flow', 'stages'],
    frame: ['frames', 'media'],
    funnelStage: ['funnel', 'stages'],
    group: ['groups', 'layers'],
    image: ['images', 'media'],
    imageSlot: ['images', 'imageSlots', 'media'],
    img: ['images', 'imgs', 'media'],
    info: ['infoList', 'infos'],
    lab: ['labs'],
    leaf: ['leaves', 'branches'],
    line: ['lines'],
    logo: ['logos', 'images'],
    media: ['media', 'images'],
    member: ['members', 'avatars', 'media'],
    meta: ['meta'],
    objective: ['objectives'],
    petal: ['petals', 'items'],
    photo: ['photos', 'media', 'images'],
    region: ['regions', 'data'],
    ring: ['rings'],
    scene: ['scenes'],
    secondary: ['secondaries'],
    set: ['sets'],
    skill: ['skills'],
    stack: ['stacks', 'stackLabels', 'items'],
    takeaway: ['takeaways'],
    task: ['tasks'],
    thumb: ['thumbs', 'images'],
    track: ['tracks', 'media'],
  };
  return [
    stem,
    pluralize(stem),
    `${stem}List`,
    `${stem}Items`,
    ...(explicit[stem] || []),
  ];
}

function lowerFirst(value) {
  return value ? value[0].toLowerCase() + value.slice(1) : value;
}

function pluralize(value) {
  if (!value) return value;
  if (value.endsWith('y')) return `${value.slice(0, -1)}ies`;
  if (value.endsWith('s')) return value;
  return `${value}s`;
}

function normalizeName(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function normalizeControls(page) {
  if (page.spec?.controls) {
    const defaults = {};
    page.spec.controls.forEach(control => {
      if (control.prop) defaults[control.prop] = control.default;
    });
    return page.spec.controls.map(control => normalizeControl({
      key: control.prop,
      label: control.label,
      type: control.type,
      defaultValue: control.default,
      min: control.min,
      max: control.max,
      step: control.step,
      options: control.options,
    }, defaults));
  }

  return (page.controls || []).map(control => normalizeControl({
    key: control.key || control.prop,
    label: control.label,
    type: control.type,
    defaultValue: control.default ?? control.def,
    min: control.min,
    max: control.max,
    step: control.step,
    options: control.options,
  }, page.defaultProps || {}));
}

function normalizeControl(control, defaults) {
  return {
    key: control.key,
    label: control.label || control.key,
    type: normalizeControlType(control.type),
    default: serializeValue(control.defaultValue),
    min: resolveControlValue(control.min, defaults),
    max: resolveControlValue(control.max, defaults),
    step: serializeValue(control.step),
    options: serializeValue(control.options),
  };
}

function normalizeControlType(type) {
  if (type === 'slider' || type === 'number') return 'range';
  if (type === 'radio' || type === 'enum' || type === 'labelType' || type === 'segment' || type === 'color' || type === 'palette') return 'select';
  if (type === 'focus' || type === 'boolean') return 'toggle';
  return type || 'range';
}

function deriveCount(props, binding) {
  if (binding.key === 'phaseCount') return derivePhaseCount(props);

  const counts = binding.arrays
    .filter(key => Array.isArray(props[key]))
    .map(key => ({ source: key, count: props[key].length }));

  if (!counts.length) return null;
  return collapseCounts(counts);
}

function derivePhaseCount(props) {
  const counts = [];
  if (Array.isArray(props.phases)) counts.push({ source: 'phases', count: props.phases.length });
  if (Array.isArray(props.lanes)) {
    props.lanes.forEach((lane, index) => {
      if (Array.isArray(lane?.items)) {
        counts.push({ source: `lanes[${index}].items`, count: lane.items.length });
      }
    });
  }
  if (!counts.length) return null;
  return collapseCounts(counts);
}

function collapseCounts(counts) {
  const unique = [...new Set(counts.map(item => item.count))];
  if (unique.length > 1) {
    return {
      error: counts.map(item => `${item.source}=${item.count}`).join(', ') + ' 数量不一致',
    };
  }
  return {
    count: unique[0],
    source: counts.map(item => item.source).join('/'),
  };
}

function validateCountRange(binding, count, source, errors) {
  const min = Number(binding.min);
  const max = Number(binding.max);
  if (Number.isFinite(min) && count < min) {
    errors.push(`${source} 的数量 ${count} 小于 ${binding.key} 最小值 ${min}`);
  }
  if (Number.isFinite(max) && count > max) {
    errors.push(`${source} 的数量 ${count} 大于 ${binding.key} 最大值 ${max}`);
  }
}

function resolveControlValue(value, defaults) {
  if (typeof value === 'function') return serializeValue(value(defaults));
  return serializeValue(value);
}

function serializeValue(value) {
  if (value == null || ['string', 'number', 'boolean'].includes(typeof value)) return value;
  if (Array.isArray(value)) return value.map(serializeValue);
  if (typeof value !== 'object') return undefined;
  return Object.fromEntries(
    Object.entries(value)
      .map(([key, item]) => [key, serializeValue(item)])
      .filter(([, item]) => item !== undefined),
  );
}
