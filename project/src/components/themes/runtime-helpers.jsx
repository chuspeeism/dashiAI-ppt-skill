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
      controls: normalizeControls(entry.controls || entry.spec?.controls || meta.controls || []),
      defaultProps,
      staticHtml: entry.staticHtml || false,
      bgClass: entry.bgClass || entry.backgroundClass || '',
    };
  });
}

const TEXT_CONTROL_TYPES = new Set(['text', 'string', 'input', 'url', 'email', 'textarea', 'multiline']);
const REMOVED_CONTROL_TYPES = new Set();

const GENERIC_CONTROL_LABELS = new Map([
  ['联系方式', '次级文案'],
  ['联系方式数量', '信息条目数量'],
  ['投资人类型数', '分类数量'],
  ['投资人类型', '分类类型'],
  ['投资人类型占比', '分类占比'],
  ['平均单笔融资金额', '平均指标'],
  ['融资金额', '数值指标'],
]);

function normalizeControls(controls) {
  return (controls || [])
    .filter(control => !isRemovedControl(control))
    .map(control => {
      const next = { ...control };
      if (typeof next.label === 'string' && GENERIC_CONTROL_LABELS.has(next.label)) {
        next.label = GENERIC_CONTROL_LABELS.get(next.label);
      }
      if (typeof next.desc === 'string') next.desc = genericControlText(next.desc);
      if (typeof next.description === 'string') next.description = genericControlText(next.description);
      return next;
    });
}

function isRemovedControl(control) {
  const type = String(control?.type || '').toLowerCase();
  return TEXT_CONTROL_TYPES.has(type) || REMOVED_CONTROL_TYPES.has(type);
}

function genericControlText(value) {
  return value
    .replaceAll('联系方式', '次级文案')
    .replaceAll('投资人类型', '分类类型')
    .replaceAll('投资人', '角色')
    .replaceAll('融资金额', '数值指标')
    .replaceAll('AI Capital', '研究机构');
}
