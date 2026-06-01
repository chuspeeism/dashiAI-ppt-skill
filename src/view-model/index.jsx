import React from 'react';
import { SlideViewModelProvider } from './context.jsx';

const SLIDE_MODEL_TYPE = 'guizang.slide-model';

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
  if (deck.style && deck.style !== 'swiss') {
    throw new Error('Only style "swiss" is supported by the component workflow.');
  }

  const theme = registries.resolveOption(registries.themes, deck.theme, registries.defaultTheme, 'theme');
  const font = registries.resolveOption(registries.fonts, deck.fontSet, registries.defaultFont, 'fontSet');
  const fontWeight = registries.resolveOption(registries.fontWeights, deck.fontWeight, registries.defaultFontWeight, 'fontWeight');
  const typeScale = registries.resolveOption(registries.typeScales, deck.typeScale, registries.defaultTypeScale, 'typeScale');
  const spacing = registries.resolveOption(registries.spacings, deck.spacing, registries.defaultSpacing, 'spacing');
  const model = normalizeDeckModel(deck);
  const slideKeys = createSlideKeys(model.slides);
  const slides = model.slides.map((slide, index) => buildSlideViewModel(slide, index, registries.layouts, slideKeys[index]));
  const state = {
    slideOrder: slides.map((slide) => slide.id),
    text: normalizeTextState(model.text, slides),
    media: model.media || {},
    chart: model.chart || {},
    icon: model.icon || {},
    shader: model.shader || {},
  };

  return {
    model,
    styleVariant: model.styleVariant || 'a',
    stylePresets: model.stylePresets || {},
    tokens: {
      theme,
      font,
      fontWeight,
      typeScale,
      spacing,
    },
    slides,
    options: {
      themes: serializeOptions(registries.themes),
      fonts: serializeOptions(registries.fonts),
      fontWeights: serializeOptions(registries.fontWeights),
      typeScales: serializeOptions(registries.typeScales),
      spacings: serializeOptions(registries.spacings),
      stylePresets: model.stylePresets || {},
      current: {
        theme: theme.key,
        font: font.key,
        fontWeight: fontWeight.key,
        typeScale: typeScale.key,
        spacing: spacing.key,
        styleVariant: model.styleVariant || 'a',
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
    style: viewModel.model.style,
    styleVariant: viewModel.styleVariant,
    stylePresets: viewModel.stylePresets,
    tokens: {
      theme: viewModel.tokens.theme.key,
      font: viewModel.tokens.font.key,
      fontWeight: viewModel.tokens.fontWeight.key,
      typeScale: viewModel.tokens.typeScale.key,
      spacing: viewModel.tokens.spacing.key,
    },
    slides: viewModel.slides.map((slide) => ({
      id: slide.id,
      key: slide.key,
      layout: slide.layout,
      dataLayout: slide.dataLayout,
      label: slide.label,
      styleVariant: slide.styleVariant,
      styleVariantLabel: slide.styleVariantLabel,
      logicalIndex: slide.logicalIndex,
      props: toJson(slide.sourceProps),
      copy: toJson(slide.copy),
      media: toJson(slide.media),
      chart: toJson(slide.chart),
      icon: toJson(slide.icon),
      shader: toJson(slide.shader),
    })),
    state: {
      slideOrder: viewModel.slides.map((slide) => slide.id),
      text: viewModel.state.text || {},
      media: viewModel.state.media || {},
      chart: viewModel.state.chart || {},
      icon: viewModel.state.icon || {},
      shader: viewModel.state.shader || {},
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
    style: deck.style || 'swiss',
    styleVariant: deck.styleVariant || 'a',
    stylePresets: deck.stylePresets || {},
    title: deck.title || 'Untitled Deck',
    theme: deck.theme,
    fontSet: deck.fontSet,
    fontWeight: deck.fontWeight,
    typeScale: deck.typeScale,
    spacing: deck.spacing,
    text: deck.text || {},
    media: deck.media || {},
    chart: deck.chart || {},
    icon: deck.icon || {},
    shader: deck.shader || {},
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

function buildSlideViewModel(slide, index, layoutOptions, slideKey) {
  if (slide.legacy) {
    return {
      id: slide.id,
      key: slideKey,
      index,
      element: slide.element,
      sourceProps: {},
      context: {
        id: slide.id,
        key: slideKey,
        index,
        legacy: true,
        textKeyPrefix: `text:${slideKey}:`,
      },
    };
  }
  const option = layoutOptions[slide.layout];
  if (!option) {
    throw new Error(`Unknown layout "${slide.layout}". Choose one of: ${Object.keys(layoutOptions).join(', ')}`);
  }
  return {
    id: slide.id,
    key: slideKey,
    index,
    layout: slide.layout,
    label: option.label,
    dataLayout: option.dataLayout,
    component: option.component,
    props: slide.props || {},
    sourceProps: slide.props || {},
    copy: slide.copy || {},
    media: slide.media || {},
    chart: slide.chart || {},
    icon: slide.icon || {},
    shader: slide.shader || {},
    styleVariant: slide.styleVariant,
    styleVariantLabel: slide.styleVariantLabel,
    logicalIndex: slide.logicalIndex,
    context: {
      id: slide.id,
      key: slideKey,
      index,
      layout: slide.layout,
      label: option.label,
      dataLayout: option.dataLayout,
      styleVariant: slide.styleVariant,
      styleVariantLabel: slide.styleVariantLabel,
      logicalIndex: slide.logicalIndex,
      copy: slide.copy || {},
      media: slide.media || {},
      chart: slide.chart || {},
      icon: slide.icon || {},
      shader: slide.shader || {},
      textKeyPrefix: `text:${slideKey}:`,
    },
  };
}

function createSlideKeys(slides) {
  const totals = new Map();
  slides.forEach((slide) => {
    const base = slide.layout || slide.id;
    totals.set(base, (totals.get(base) || 0) + 1);
  });

  const seen = new Map();
  return slides.map((slide) => {
    if (slide.key || slide.slideKey) return slide.key || slide.slideKey;
    const base = slide.layout || slide.id;
    const count = (seen.get(base) || 0) + 1;
    seen.set(base, count);
    return totals.get(base) > 1 ? `${base}-${count}` : base;
  });
}

function normalizeTextState(text, slides) {
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

function serializeOptions(registry) {
  return Object.fromEntries(
    Object.entries(registry).map(([key, option]) => [
      key,
      {
        label: option.label,
        vars: option.vars,
        classes: option.classes,
        dataAnimate: option.dataAnimate,
      },
    ]),
  );
}
