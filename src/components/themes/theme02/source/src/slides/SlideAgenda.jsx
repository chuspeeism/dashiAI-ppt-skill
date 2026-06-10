/**
 * SlideAgenda.jsx — 目录 / 议程（结构页 · 章节索引）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 章节导航：左侧导语立柱（章节总数大字 + 导语），右侧编号章节卡片网格
 * （描边巨号 + 标题 + 小节说明），卡片均分纵向空间、可高亮“当前章节”。
 * 与「章节分隔页」不同——这是全篇的目录总览。纯 props，无运行时依赖。
 *
 * ── Props (see slideAgendaDefaults) ─────────────────────────────────────────
 *   kicker, title, titleEm, lead     strings
 *   items        Array<{title, sub}>   每个章节的标题 + 小节说明
 *   itemCount    number   章节条数（2–n）
 *   columns      number   卡片列数（1 或 2）
 *   focusEnabled boolean  高亮“当前/重点”章节
 *   focusIndex   number   0-based 被强调章节
 *   showSub      boolean  小节说明显隐
 *   showRail     boolean  单列时竖向光轨 + 发光节点显隐
 *   showLead     boolean  左侧导语立柱显隐
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideAgendaDefaults = {
  kicker: 'CONTENTS · 报告目录',
  title: '六个章节 ',
  titleEm: '读完这一年',
  lead: '从市场全景到风险研判，沿着资本流向逐层拆解 2024 年美国大额融资 AI 公司的真实图景。',
  items: [
    { title: '市场全景与资本节奏', sub: '总量、季度趋势与月度热力' },
    { title: '赛道结构与头部榜单', sub: '行业占比、融资排名与产业链分层' },
    { title: '估值地形与轮次结构', sub: '估值散点、资本漏斗与轮次分布' },
    { title: '地区分布与公司图谱', sub: '地理集中度与代表性公司' },
    { title: '能力评估与判断框架', sub: '能力雷达、四象限与评级矩阵' },
    { title: '核心结论与风险研判', sub: '关键判断、潜在风险与展望' },
  ],
  itemCount: 6,
  columns: 2,
  focusEnabled: true,
  focusIndex: 0,
  showSub: true,
  showRail: true,
  showLead: true,
};

export const slideAgendaControls = [
  { key: 'itemCount', type: 'number', label: '章节条数', default: 6, min: 2, step: 1,
    maxFrom: (p) => (p.items ? p.items.length : 6), describe: '目录展示的章节条数' },
  { key: 'columns', type: 'number', label: '卡片列数', default: 2, min: 1, max: 2, step: 1,
    describe: '章节卡片的列数（1 或 2）' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '高亮“当前 / 重点”章节' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.itemCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调章节的序号' },
  { key: 'showSub', type: 'toggle', label: '小节说明', default: true,
    describe: '章节下方小节说明显隐' },
  { key: 'showRail', type: 'toggle', label: '清单光轨', default: true,
    describe: '单列时竖向光轨与发光节点显隐' },
  { key: 'showLead', type: 'toggle', label: '左侧导语', default: true,
    describe: '左侧导语立柱显隐' },
];

export function SlideAgenda(props) {
  const p = { ...slideAgendaDefaults, ...props };
  const count = Math.max(2, Math.min(p.items.length, p.itemCount));
  const items = p.items.slice(0, count).map((it, i) => ({ ...it, n: i }));
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const cols = Math.max(1, Math.min(2, p.columns));
  const num = (i) => String(i + 1).padStart(2, '0');
  const useRail = p.showRail && cols === 1;

  const Card = ({ it }) => {
    const isF = it.n === fIdx;
    return (
      <li className={cx('gxn-panel', 'gxn-ag-card', isF && 'is-focus')}
        style={{ listStyle: 'none', position: 'relative', display: 'flex', alignItems: 'center',
          gap: 26, padding: useRail ? '0 38px 0 80px' : '0 32px',
          opacity: fIdx >= 0 && !isF ? 0.84 : 1, transition: 'opacity .3s ease' }}>
        {useRail && (
          <span aria-hidden="true" className="gxn-ag-node" style={{
            background: isF ? 'var(--gxn-accent)' : 'rgba(var(--gxn-glow),0.45)',
            boxShadow: isF
              ? '0 0 0 5px rgba(var(--gxn-glow),0.16), 0 0 22px 1px rgba(var(--gxn-glow),0.9)'
              : '0 0 0 4px rgba(var(--gxn-glow),0.08)' }} />
        )}
        <span className={cx('gxn-num', 'gxn-ag-idx', isF && 'gxn-aurora-num')} style={{
          color: isF ? 'var(--gxn-accent)' : 'transparent',
          textShadow: isF ? '0 0 30px rgba(var(--gxn-glow),0.5)' : 'none',
          WebkitTextStroke: isF ? '0' : '1.5px rgba(var(--gxn-glow),0.62)' }}>{num(it.n)}</span>
        <span aria-hidden="true" className="gxn-ag-sep" style={{
          background: isF
            ? 'linear-gradient(180deg, transparent, rgba(var(--gxn-glow),0.85), transparent)'
            : 'linear-gradient(180deg, transparent, var(--gxn-line), transparent)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: 33, fontWeight: 700, lineHeight: 1.14,
            color: 'var(--gxn-text)', textWrap: 'balance' }}>{it.title}</h3>
          {p.showSub && it.sub && (
            <p style={{ margin: 0, fontSize: 24, lineHeight: 1.4, color: 'var(--gxn-dim)',
              textWrap: 'pretty' }}>{it.sub}</p>
          )}
        </div>
      </li>
    );
  };

  const listArea = (
    <div style={{ position: 'relative', minWidth: 0, minHeight: 0 }}>
      {useRail && items.length > 1 && (
        <span aria-hidden="true" className="gxn-ag-rail" />
      )}
      <ol className="gxn-ag-grid" style={{ margin: 0, padding: 0,
        gridTemplateColumns: cols === 2 ? '1fr 1fr' : '1fr' }}>
        {items.map((it) => <Card key={it.n} it={it} />)}
      </ol>
    </div>
  );

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <style>{AGENDA_CSS}</style>
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || '02 / 35'} />

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 46, minHeight: 0,
          display: 'grid', gridTemplateColumns: p.showLead ? '300px 1fr' : '1fr',
          gap: p.showLead ? 70 : 0 }}>
          {p.showLead && (
            <aside className="gxn-ag-lead">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <span className="gxn-mono" style={{ fontSize: 24, letterSpacing: '.16em',
                  textTransform: 'uppercase', color: 'var(--gxn-faint)' }}>SECTIONS · 章节</span>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
                  <span className="gxn-num" style={{ fontSize: 150, fontWeight: 600, lineHeight: 0.78,
                    letterSpacing: '-0.04em', color: 'var(--gxn-accent)',
                    textShadow: '0 0 52px rgba(var(--gxn-glow),0.45)' }}>{String(count).padStart(2, '0')}</span>
                  <span className="gxn-num" style={{ fontSize: 30, fontWeight: 500, lineHeight: 1,
                    color: 'var(--gxn-faint)', paddingBottom: 14 }}>章</span>
                </div>
              </div>
              {p.lead && (
                <p style={{ margin: 0, fontSize: 25, lineHeight: 1.64, color: 'var(--gxn-dim)',
                  textWrap: 'pretty' }}>{p.lead}</p>
              )}
            </aside>
          )}
          {listArea}
        </div>
      </div>
    </div>
  );
}

const AGENDA_CSS = `
.gxn-ag-lead{
  display:flex; flex-direction:column; justify-content:space-between;
  min-width:0; padding-right:46px; position:relative;
}
.gxn-ag-lead::after{
  content:''; position:absolute; top:6%; bottom:6%; right:0; width:1px;
  background:linear-gradient(180deg, transparent, var(--gxn-line) 18%, var(--gxn-line) 82%, transparent);
}
.gxn-ag-grid{
  list-style:none; height:100%; display:grid;
  grid-auto-rows:1fr; gap:20px; align-content:stretch;
}
.gxn-ag-card{ min-height:0; }
.gxn-ag-idx{
  flex:0 0 auto; width:104px; text-align:left;
  font-size:62px; font-weight:600; line-height:0.9; letter-spacing:-0.02em;
}
.gxn-ag-sep{ flex:0 0 auto; width:1.5px; align-self:stretch; margin:18px 0; border-radius:2px; }
.gxn-ag-rail{
  position:absolute; left:36px; top:7%; bottom:7%; width:2px; border-radius:2px;
  background:linear-gradient(180deg, transparent, rgba(var(--gxn-glow),0.5) 10%, rgba(var(--gxn-glow),0.5) 90%, transparent);
  box-shadow:0 0 16px rgba(var(--gxn-glow),0.4);
}
.gxn-ag-node{
  position:absolute; left:30px; top:50%; width:14px; height:14px; margin-top:-7px;
  border-radius:50%;
}
`;

export default SlideAgenda;
