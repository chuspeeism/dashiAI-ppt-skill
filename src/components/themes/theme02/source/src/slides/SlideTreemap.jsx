/**
 * SlideTreemap.jsx — 矩形树图（图表页 · Treemap）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 矩形树图：每个赛道一块矩形，面积严格 ∝ 数值。用「平衡二分 + 嵌套 flex」铺满整张
 * 画布——每次把条目按和值二分，容器在一个方向上按 flex:<和值> 切分、交替横纵，
 * 故每块面积精确正比于其数值。块数可调，任意数量都铺满且构图均衡。纯 props 驱动。
 *
 * ── Props (see slideTreemapDefaults) ────────────────────────────────────────
 *   kicker, title, titleEm, lead     strings
 *   items        Array<{label, value, note}>  赛道（按数值降序更佳）
 *   unit         string   数值单位（如 “亿美元”）
 *   itemCount    number   展示的块数量（2–n）
 *   focusEnabled boolean  辉光强调某一块（其余淡出）
 *   focusIndex   number   0-based 被强调块
 *   showValue    boolean  块内数值显隐
 *   showShare    boolean  块内占比显隐
 *   showNote     boolean  块内一句注解显隐（仅大块）
 *   gxnScheme    object?  { palette } 调色（缺省走主题调色板）
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideTreemapDefaults = {
  kicker: 'TREEMAP · 赛道版图',
  title: '资金落在 ',
  titleEm: '哪些赛道',
  lead: '把 970 亿美元按业务类型切块——面积越大，吸金越多。通用大模型独占近半壁江山。',
  // 源：报告 3.1 行业赛道融资额占比（亿美元）
  items: [
    { label: '通用大模型', value: 420, note: '押注 AGI 叙事' },
    { label: '垂直应用', value: 245, note: '寻找商业化路径' },
    { label: 'AI 基础设施', value: 158, note: '卖铲子逻辑' },
    { label: 'AI 芯片', value: 97, note: '上游硬件' },
    { label: '其他赛道', value: 50, note: '工具链 · 安全' },
  ],
  unit: '亿美元',
  itemCount: 5,
  focusEnabled: true,
  focusIndex: 0,
  showValue: true,
  showShare: true,
  showNote: true,
};

export const slideTreemapControls = [
  { key: 'itemCount', type: 'number', label: '色块数量', default: 5, min: 2, step: 1,
    maxFrom: (p) => (p.items ? p.items.length : 5), describe: '矩形树图展示的色块数量' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '辉光强调某一块（其余淡出）' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.itemCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调色块的序号' },
  { key: 'showValue', type: 'toggle', label: '数值', default: true, describe: '块内数值显隐' },
  { key: 'showShare', type: 'toggle', label: '占比', default: true, describe: '块内占比百分比显隐' },
  { key: 'showNote', type: 'toggle', label: '注解', default: true, describe: '大块内一句注解显隐' },
];

/* Balanced binary split → nested flex tree. Areas are EXACTLY proportional to
   value sums (each split divides one axis by flex ratio, full other axis). */
function splitGroup(list) {
  if (list.length === 1) return { leaf: list[0] };
  const total = list.reduce((s, d) => s + d.v, 0);
  let acc = 0, cut = 1;
  for (let i = 0; i < list.length - 1; i++) {
    acc += list[i].v;
    if (acc >= total / 2) { cut = i + 1; break; }
  }
  const a = list.slice(0, cut), b = list.slice(cut);
  return {
    a: { items: a, sum: a.reduce((s, d) => s + d.v, 0) },
    b: { items: b, sum: b.reduce((s, d) => s + d.v, 0) },
  };
}

function TreeNode({ list, horizontal, render }) {
  if (list.length === 1) return render(list[0]);
  const { a, b } = splitGroup(list);
  return (
    <div style={{ display: 'flex', flexDirection: horizontal ? 'row' : 'column',
                  gap: 12, width: '100%', height: '100%', minWidth: 0, minHeight: 0 }}>
      <div style={{ flex: a.sum, minWidth: 0, minHeight: 0 }}>
        <TreeNode list={a.items} horizontal={!horizontal} render={render} />
      </div>
      <div style={{ flex: b.sum, minWidth: 0, minHeight: 0 }}>
        <TreeNode list={b.items} horizontal={!horizontal} render={render} />
      </div>
    </div>
  );
}

export function SlideTreemap(props) {
  const p = { ...slideTreemapDefaults, ...props };
  const sc = p.gxnScheme || {};
  const palette = sc.palette || ['#2fe07f', '#b9f24a', '#2fe0c4', '#4ea2ff', '#9b7dff', '#ff6fae', '#ffc24a'];
  const glow = sc.glow || '47,224,127';

  const count = Math.max(2, Math.min(p.items.length, p.itemCount));
  const items = p.items.slice(0, count).map((d, i) => ({ ...d, v: d.value, i }));
  const total = items.reduce((s, d) => s + d.v, 0) || 1;
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const focused = fIdx >= 0;

  const renderLeaf = (d) => {
    const c = palette[d.i % palette.length];
    const isF = d.i === fIdx;
    const dim = focused && !isF;
    const share = Math.round((d.v / total) * 100);
    const big = d.v / total >= 0.18;
    return (
      <div className={cx('gxn-tm-tile', isF && 'is-focus')} style={{
        '--tm-c': c,
        background: `linear-gradient(150deg, ${hexA(c, isF ? 0.30 : 0.16)}, ${hexA(c, 0.05)})`,
        borderColor: isF ? c : hexA(c, 0.4),
        opacity: dim ? 0.4 : 1,
        boxShadow: isF
          ? `inset 0 0 0 1.5px ${c}, inset 0 0 60px -10px ${hexA(c, 0.7)}, 0 0 70px -16px ${hexA(c, 0.7)}`
          : `inset 0 1px 0 ${hexA('#ffffff', 0.06)}`,
      }}>
        <div className="gxn-tm-top">
          <span className="gxn-tm-dot" style={{ background: c, boxShadow: `0 0 14px ${c}` }} />
          <span className="gxn-tm-label" style={{ color: isF ? '#fff' : 'var(--gxn-text)' }}>{d.label}</span>
        </div>
        <div className="gxn-tm-foot">
          {p.showValue && (
            <span className="gxn-num gxn-tm-val" style={{ color: isF ? c : 'var(--gxn-text)',
              textShadow: isF ? `0 0 26px ${hexA(c, 0.6)}` : 'none' }}>
              {d.v}<span className="gxn-tm-unit">{p.unit}</span>
            </span>
          )}
          {p.showShare && <span className="gxn-num gxn-tm-share" style={{ color: c }}>{share}%</span>}
        </div>
        {p.showNote && big && d.note && <div className="gxn-tm-note">{d.note}</div>}
      </div>
    );
  };

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <TreemapStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || '06 / 40'} />
        {p.lead && <p className="gxn-sub gxn-rise" style={{ marginTop: 16, maxWidth: 1240 }}>{p.lead}</p>}

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 24, minHeight: 0 }}>
          <TreeNode list={items} horizontal render={renderLeaf} />
        </div>

        <div className="gxn-rise-3" style={{ display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 24, marginTop: 22 }}>
          <span style={{ fontSize: 26, color: 'var(--gxn-dim)' }}>
            ↳ 面积 ∝ 吸纳资金，全年合计 <strong style={{ color: 'var(--gxn-accent)', fontWeight: 700 }}>{total}</strong> {p.unit}
          </span>
          {focused && (
            <span style={{ fontSize: 26, color: 'var(--gxn-dim)' }}>
              <strong style={{ color: 'var(--gxn-accent)', fontWeight: 700 }}>{items[fIdx].label}</strong>
              {' '}占 {Math.round((items[fIdx].v / total) * 100)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* small hex → rgba helper (accepts #rgb / #rrggbb) */
function hexA(hex, a) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

function TreemapStyle() {
  React.useEffect(() => {
    const id = 'gxn-treemap-style';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
.gxn-tm-tile{ position:relative; width:100%; height:100%; border-radius:18px;
  border:1px solid; overflow:hidden; padding:24px 26px; display:flex; flex-direction:column;
  justify-content:space-between; transition:opacity .3s ease, box-shadow .35s ease, transform .35s ease; }
.gxn-tm-top{ display:flex; align-items:center; gap:12px; min-width:0; }
.gxn-tm-dot{ width:14px; height:14px; border-radius:5px; flex:0 0 auto; }
.gxn-tm-label{ font-family:var(--gxn-font-sans); font-weight:700; font-size:30px; letter-spacing:-0.01em;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.gxn-tm-foot{ display:flex; align-items:baseline; gap:16px; flex-wrap:wrap; }
.gxn-tm-val{ font-size:60px; font-weight:600; line-height:0.9; letter-spacing:-0.02em; }
.gxn-tm-unit{ font-size:0.32em; margin-left:8px; color:var(--gxn-dim); font-weight:500; }
.gxn-tm-share{ font-size:30px; font-weight:600; opacity:.92; }
.gxn-tm-note{ position:absolute; left:26px; bottom:84px; font-family:var(--gxn-font-mono);
  font-size:23px; color:var(--gxn-faint); letter-spacing:.02em; }
@media (prefers-reduced-motion: no-preference){
  [data-deck-active] .gxn-tm-tile{ animation: gxn-tm-pop .6s cubic-bezier(.2,.7,.25,1) both; }
}
@keyframes gxn-tm-pop{ from{ opacity:0; transform:scale(.96); } to{ opacity:1; transform:none; } }
`;
    document.head.appendChild(el);
  }, []);
  return null;
}

export default SlideTreemap;
