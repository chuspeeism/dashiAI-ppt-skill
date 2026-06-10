import React from 'react';
import { useSlideViewModel } from '../../view-model/context.jsx';
import { GENERATED_THEME_PAGES, GENERATED_THEME_PACKS } from './generated-metadata.js';
import { PRESET_3D as THEME03_PRESET_3D } from './theme03/source/src/preset3d.js';

export const THEME_PAGES = GENERATED_THEME_PAGES.map(applyThemePageDefaults);
export const THEME_PACK_OPTIONS = Object.fromEntries(
  GENERATED_THEME_PACKS.map(theme => [
    theme.key,
    {
      label: theme.label,
      layouts: THEME_PAGES.filter(page => page.themeKey === theme.key).map(page => page.key),
    },
  ]),
);

const PAGES_BY_KEY = new Map(THEME_PAGES.map(page => [page.key, page]));

function applyThemePageDefaults(page) {
  if (page.themeKey !== 'theme03') return page;
  return {
    ...page,
    defaultProps: {
      ...(page.defaultProps || {}),
      ...(THEME03_PRESET_3D[page.slot] || {}),
    },
  };
}

export function makeImportedThemePage(layoutKey) {
  const page = PAGES_BY_KEY.get(layoutKey);
  if (!page) throw new Error(`Unknown imported theme page "${layoutKey}"`);
  return function ImportedThemePage(props) {
    const viewModel = useSlideViewModel();
    const defaults = serializeDefaults(page.defaultProps);
    const controls = normalizeControls(page.controls, defaults);
    return (
      <section
        className={`slide imported-theme-slide ${page.bgClass || ''}`}
        data-layout={page.layout}
        data-vm-slide-id={viewModel?.id}
        data-vm-slide-key={viewModel?.key}
        data-vm-layout={viewModel?.layout}
        data-vm-index={viewModel?.index}
        data-theme-pack={viewModel?.themePack}
        data-logical-slide={viewModel?.logicalIndex}
        data-label={viewModel?.label || page.label}
      >
        <div
          className="imported-theme-root"
          data-theme-key={page.themeKey}
          data-page-key={page.key}
          data-prop-controls={JSON.stringify(controls)}
          data-prop-defaults={JSON.stringify({ ...defaults, ...(props || {}) })}
        />
      </section>
    );
  };
}

function normalizeControls(controls, defaults) {
  return (controls || [])
    .map(control => {
      const key = control.key || control.prop;
      if (!key) return null;
      const type = normalizeType(control.type);
      const next = {
        key,
        label: control.label || key,
        type,
        default: serializeValue(control.default ?? control.def ?? defaults[key]),
        min: serializeValue(resolveValue(control.min, defaults)),
        max: serializeValue(resolveValue(control.max, defaults)),
        step: serializeValue(control.step),
        options: serializeValue(control.options),
      };
      if (type === 'select' && (control.type === 'color' || control.type === 'palette')) {
        next.display = 'color';
      }
      return next;
    })
    .filter(Boolean);
}

function normalizeType(type) {
  if (type === 'slider' || type === 'number') return 'range';
  if (['enum', 'radio', 'select', 'segment', 'color', 'palette', 'labelType'].includes(type)) return 'select';
  if (['toggle', 'boolean', 'focus'].includes(type)) return 'toggle';
  return type || 'range';
}

function resolveValue(value, defaults) {
  if (typeof value === 'function') return value(defaults);
  return value;
}

function serializeDefaults(defaultProps) {
  return Object.fromEntries(
    Object.entries(defaultProps || {})
      .map(([key, value]) => [key, serializeValue(value)])
      .filter(([, value]) => value !== undefined),
  );
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
