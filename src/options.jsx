import { createSlideModel } from './view-model/index.jsx';
import { THEME_PAGES, THEME_PACK_OPTIONS, makeImportedThemePage } from './components/themes/index.jsx';
import { normalizeSlidePropsForLayout } from './propContracts.jsx';

export const DEFAULT_THEME_PACK = 'theme01';
export { THEME_PACK_OPTIONS };

export const LAYOUT_ALIASES = Object.fromEntries(
  THEME_PAGES.map((page) => [`${page.themeKey}_${String(page.slot).replaceAll('-', '_')}`, page.key]),
);

export const LAYOUT_OPTIONS = Object.fromEntries([
  ...THEME_PAGES.map((page) => [
    page.key,
    {
      label: `${page.themeKey} · ${String(page.pageNumber).padStart(3, '0')} · ${page.label}`,
      dataLayout: page.layout,
      component: makeImportedThemePage(page.key),
    },
  ]),
]);

export function resolveLayoutName(layoutName) {
  return LAYOUT_ALIASES[layoutName] || layoutName;
}

export function slide(layoutName, props) {
  const resolvedLayout = resolveLayoutName(layoutName);
  const option = LAYOUT_OPTIONS[resolvedLayout];
  if (!option) {
    throw new Error(`Unknown layout "${layoutName}". Choose one of: ${Object.keys(LAYOUT_OPTIONS).join(', ')}`);
  }
  return createSlideModel(resolvedLayout, normalizeSlidePropsForLayout(resolvedLayout, props));
}

export function resolveOption(registry, name, fallback, label) {
  const key = name ?? fallback;
  const option = registry[key];
  if (!option) {
    throw new Error(`Unknown ${label} "${key}". Choose one of: ${Object.keys(registry).join(', ')}`);
  }
  return { key, option };
}
