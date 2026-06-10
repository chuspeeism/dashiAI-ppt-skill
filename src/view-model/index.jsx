import React from 'react';
import { SlideViewModelProvider } from './context.jsx';

const SLIDE_MODEL_TYPE = 'dashi.slide-model';

export function createSlideModel(layout, props = {}) {
  if (!layout || typeof layout !== 'string') {
    throw new Error('Slide model requires a layout name.');
  }
  return {
    type: SLIDE_MODEL_TYPE,
    layout,
    props: props || {},
  };
}

export function isSlideModel(value) {
  return value?.type === SLIDE_MODEL_TYPE || (value?.layout && !React.isValidElement(value));
}

export function buildDeckViewModel(deck, registries) {
  const model = normalizeDeckModel(deck);
  const layoutAliases = registries.layoutAliases || {};
  const slideKeys = createSlideKeys(model.slides, layoutAliases);
  const slides = model.slides.map((slide, index) => buildSlideViewModel(
    slide,
    index,
    registries.layouts,
    registries.themePacks,
    slideKeys[index],
    layoutAliases,
    registries.defaultThemePack,
  ));
  const themePack = registries.resolveOption(
    registries.themePacks,
    model.themePack || slides[0]?.themePack,
    registries.defaultThemePack,
    'theme pack',
  );
  const state = {
    slideOrder: slides.map((slide) => slide.id),
    text: normalizeTextState(model.text, slides, layoutAliases),
    media: model.media || {},
    props: model.props || {},
  };

  return {
    model,
    themePack,
    slides,
    options: {
      themePacks: serializeThemePacks(filterThemePacksForSlides(registries.themePacks, slides)),
      current: {
        themePack: themePack.key,
      },
    },
    state,
  };
}

export function renderDeckView(viewModel) {
  return viewModel.slides.map((slide) => {
    if (slide.element) return slide.element;
    const Component = slide.component;
    return (
      <SlideViewModelProvider value={slide.context} key={slide.id}>
        <Component {...slide.props} />
      </SlideViewModelProvider>
    );
  });
}

export function serializeDeckViewModel(viewModel) {
  const toJson = createJsonSerializer();
  return {
    version: 1,
    title: viewModel.model.title,
    themePack: viewModel.themePack.key,
    slides: viewModel.slides.map((slide) => ({
      id: slide.id,
      key: slide.key,
      layout: slide.layout,
      dataLayout: slide.dataLayout,
      themePack: slide.themePack,
      label: slide.label,
      logicalIndex: slide.logicalIndex,
      props: toJson(slide.sourceProps),
      copy: toJson(slide.copy),
      media: toJson(slide.media),
    })),
    state: {
      slideOrder: viewModel.slides.map((slide) => slide.id),
      text: viewModel.state.text || {},
      media: viewModel.state.media || {},
      props: viewModel.state.props || {},
    },
  };
}

function createJsonSerializer() {
  const seen = new WeakSet();
  return function toJson(value) {
    if (value == null || ['string', 'number', 'boolean'].includes(typeof value)) return value;
    if (typeof value === 'function' || React.isValidElement(value)) return undefined;
    if (Array.isArray(value)) return value.map(toJson);
    if (typeof value !== 'object') return undefined;
    if (seen.has(value)) return undefined;
    seen.add(value);
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, item]) => [key, toJson(item)])
        .filter(([, item]) => item !== undefined),
    );
  };
}

function normalizeDeckModel(deck) {
  return {
    title: deck.title || 'Untitled Deck',
    themePack: deck.themePack,
    text: deck.text || {},
    media: deck.media || {},
    props: deck.props || {},
    slides: (deck.slides || []).map((slide, index) => normalizeSlideModel(slide, index)),
  };
}

function normalizeSlideModel(slide, index) {
  if (React.isValidElement(slide)) {
    return {
      id: `legacy-${index + 1}`,
      element: slide,
      props: {},
      legacy: true,
    };
  }
  if (typeof slide === 'string') {
    return {
      id: `${slide}-${index + 1}`,
      layout: slide,
      props: {},
    };
  }
  const layout = slide.layout || slide.layoutName;
  const props = {
    ...(slide.copy || {}),
    ...(slide.props || {}),
  };
  return {
    ...slide,
    id: slide.id || `${layout}-${index + 1}`,
    layout,
    props,
  };
}

function buildSlideViewModel(slide, index, layoutOptions, themePacks, slideKey, layoutAliases = {}, defaultThemePack) {
  if (slide.legacy) {
    return {
      id: slide.id,
      key: slideKey,
      index,
      element: slide.element,
      sourceProps: {},
      themePack: defaultThemePack,
      context: {
        id: slide.id,
        key: slideKey,
        index,
        themePack: defaultThemePack,
        legacy: true,
        textKeyPrefix: `text:${slideKey}:`,
      },
    };
  }
  const resolvedLayout = layoutAliases[slide.layout] || slide.layout;
  const option = layoutOptions[resolvedLayout];
  if (!option) {
    throw new Error(`Unknown layout "${slide.layout}". Choose one of: ${Object.keys(layoutOptions).join(', ')}`);
  }
  const slideThemePack = findLayoutThemePack(resolvedLayout, themePacks) || defaultThemePack;
  const label = slide.label || inferSlideLabel(slide, index) || option.label;
  return {
    id: slide.id,
    key: slideKey,
    index,
    layout: resolvedLayout,
    label,
    dataLayout: option.dataLayout,
    themePack: slideThemePack,
    component: option.component,
    props: slide.props || {},
    sourceProps: slide.props || {},
    copy: slide.copy || {},
    media: slide.media || {},
    logicalIndex: slide.logicalIndex,
    context: {
      id: slide.id,
      key: slideKey,
      index,
      layout: resolvedLayout,
      label,
      dataLayout: option.dataLayout,
      themePack: slideThemePack,
      logicalIndex: slide.logicalIndex,
      copy: slide.copy || {},
      media: slide.media || {},
      textKeyPrefix: `text:${slideKey}:`,
    },
  };
}

function filterThemePacksForSlides(themePacks, slides) {
  const used = new Set(slides.map(slide => slide.themePack).filter(Boolean));
  if (!used.size) return themePacks;
  return Object.fromEntries(
    Object.entries(themePacks).filter(([key]) => used.has(key)),
  );
}

function inferSlideLabel(slide, index) {
  const props = slide.props || {};
  const candidates = [
    props.head?.cn,
    props.titleCN,
    props.title,
    Array.isArray(props.titleLines) ? props.titleLines.join(' ') : null,
    props.headline,
    props.heading,
    props.bigWord,
    props.brand,
  ];
  return candidates.find(value => typeof value === 'string' && value.trim()) || `第 ${index + 1} 页`;
}

function createSlideKeys(slides, layoutAliases = {}) {
  const totals = new Map();
  slides.forEach((slide) => {
    const base = layoutAliases[slide.layout] || slide.layout || slide.id;
    totals.set(base, (totals.get(base) || 0) + 1);
  });

  const seen = new Map();
  return slides.map((slide) => {
    if (slide.key || slide.slideKey) return slide.key || slide.slideKey;
    const base = layoutAliases[slide.layout] || slide.layout || slide.id;
    const count = (seen.get(base) || 0) + 1;
    seen.set(base, count);
    return totals.get(base) > 1 ? `${base}-${count}` : base;
  });
}

function normalizeTextState(text, slides, layoutAliases = {}) {
  const entries = Object.entries(text || {});
  const firstLegacySlot = new Map();
  entries.forEach(([key]) => {
    const parsed = parseTextKey(key);
    if (!parsed || !/^\d+$/.test(parsed.slot)) return;
    const current = firstLegacySlot.get(parsed.target);
    const slot = Number(parsed.slot);
    if (current === undefined || slot < current) firstLegacySlot.set(parsed.target, slot);
  });

  const keyById = new Map(slides.map((slide) => [slide.id, slide.key]));
  const layoutToKeys = new Map();
  slides.forEach((slide) => {
    if (!slide.layout) return;
    const keys = layoutToKeys.get(slide.layout) || [];
    keys.push(slide.key);
    layoutToKeys.set(slide.layout, keys);
  });
  const stableKeys = new Set(slides.map((slide) => slide.key));

  return Object.fromEntries(entries.map(([key, value]) => {
    const parsed = parseTextKey(key);
    if (!parsed) return [key, value];
    if (stableKeys.has(parsed.target)) return [key, value];

    const aliasKey = resolveLayoutAliasKey(parsed.target, layoutAliases, layoutToKeys);
    if (aliasKey) return [`text:${aliasKey}:${parsed.slot}`, value];

    const targetKey = keyById.get(parsed.target) || resolveLegacyLayoutKey(parsed.target, layoutToKeys);
    if (!targetKey) return [key, value];

    const firstSlot = firstLegacySlot.get(parsed.target);
    const slot = firstSlot !== undefined && /^\d+$/.test(parsed.slot)
      ? String(Number(parsed.slot) - firstSlot + 1)
      : parsed.slot;
    return [`text:${targetKey}:${slot}`, value];
  }));
}

function parseTextKey(key) {
  const match = /^text:([^:]+):(.+)$/.exec(key);
  if (!match) return null;
  return {
    target: match[1],
    slot: match[2],
  };
}

function resolveLegacyLayoutKey(target, layoutToKeys) {
  const layout = target.replace(/-\d+$/, '');
  const keys = layoutToKeys.get(layout);
  return keys?.length === 1 ? keys[0] : null;
}

function resolveLayoutAliasKey(target, layoutAliases, layoutToKeys) {
  const layout = target.replace(/-\d+$/, '');
  const resolved = layoutAliases[layout];
  if (!resolved) return null;
  const keys = layoutToKeys.get(resolved);
  return keys?.length === 1 ? keys[0] : null;
}

function findLayoutThemePack(layout, themePacks = {}) {
  return Object.entries(themePacks)
    .find(([, option]) => option.layouts?.includes(layout))?.[0] || null;
}

function serializeThemePacks(registry) {
  return Object.fromEntries(
    Object.entries(registry).map(([key, option]) => [
      key,
      {
        label: option.label,
        layouts: option.layouts || [],
      },
    ]),
  );
}
