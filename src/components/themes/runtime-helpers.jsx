export function normalizeRuntimePages(rawPages, { themeKey, layoutPrefix }) {
  return (rawPages || []).map((entry, index) => {
    const pageNumber = index + 1;
    const meta = entry.meta || {};
    const slot = entry.slot || entry.id || entry.key || meta.id || `page${pageNumber}`;
    const defaultProps = {
      ...(entry.defaultProps || entry.defaults || {}),
      ...(entry.initial || entry.initialProps || {}),
    };
    return {
      key: `${themeKey}_page${String(pageNumber).padStart(3, '0')}`,
      themeKey,
      pageNumber,
      layout: `${layoutPrefix}-${String(pageNumber).padStart(3, '0')}`,
      slot,
      label: entry.label || entry.name || entry.title || meta.label || meta.title || slot,
      Component: entry.Component || entry.component || entry.Comp || entry.C,
      controls: entry.controls || entry.spec?.controls || meta.controls || [],
      defaultProps,
      bgClass: entry.bgClass || entry.backgroundClass || '',
    };
  });
}
