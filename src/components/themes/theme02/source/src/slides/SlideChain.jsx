/**
 * SlideChain.jsx — Slide 09 · 产业链分层 / 上游—中游—下游（结构页）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * ── Props (see slideChainDefaults) ──────────────────────────────────────────
 *   kicker, title, titleEm           strings
 *   layers       Array<{tier,label,note,segments:[{name,companies}]}>
 *   layerCount   number    how many layers to show (2–3)
 *   focusEnabled boolean   glow-emphasise one layer
 *   focusIndex   number    0-based layer to emphasise
 *   showCompanies boolean  show representative companies per segment
 *   showFlow     boolean   show the directional flow connectors between layers
 *   showNote     boolean   show the per-layer note
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideChainDefaults = {
  kicker: 'VALUE CHAIN · 产业链分层',
  title: '上游 · 中游 · 下游 ',
  titleEm: '层级与确定性',
  layers: [
    { tier: '上游 · 基础设施', label: '算力与数据底座', note: '确定性最强 · “卖铲子”',
      segments: [
        { name: 'AI 芯片', companies: ['Cerebras', 'Groq'] },
        { name: '算力云 / 数据', companies: ['CoreWeave', 'Scale AI'] },
      ] },
    { tier: '中游 · 模型层', label: '通用与专用模型', note: '竞争最激烈 · 叙事驱动',
      segments: [
        { name: '通用大模型', companies: ['OpenAI', 'Anthropic', 'xAI'] },
        { name: '开源 / 专用', companies: ['Mistral', 'SSI'] },
      ] },
    { tier: '下游 · 应用层', label: '生产力与消费场景', note: '潜力最大 · 待验证',
      segments: [
        { name: '企业生产力', companies: ['Glean', 'Databricks'] },
        { name: '消费 / 搜索', companies: ['Perplexity'] },
        { name: '具身智能 / 机器人', companies: ['Figure AI'] },
      ] },
  ],
  layerCount: 3,
  focusEnabled: true,
  focusIndex: 0,
  showCompanies: true,
  showFlow: true,
  showNote: true,
};

export const slideChainControls = [
  { key: 'layerCount', type: 'number', label: '层级数量', default: 3, min: 2, step: 1,
    maxFrom: (p) => (p.layers ? p.layers.length : 3), describe: '展示的产业链层级数量' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '是否高亮某一层级' },
  { key: 'focusIndex', type: 'number', label: '强调层级', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.layerCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调层级的序号' },
  { key: 'showCompanies', type: 'toggle', label: '代表公司', default: true,
    describe: '显示/隐藏各环节代表公司' },
  { key: 'showFlow', type: 'toggle', label: '层级连接', default: true,
    describe: '显示/隐藏层级之间的传导箭头' },
  { key: 'showNote', type: 'toggle', label: '层级批注', default: true,
    describe: '显示/隐藏每层右上角的确定性批注' },
];

export function SlideChain(props) {
  const p = { ...slideChainDefaults, ...props };
  const count = Math.max(2, Math.min(p.layers.length, p.layerCount));
  const layers = p.layers.slice(0, count);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || "11 / 23"} />

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 34, display: 'grid', gridTemplateRows: `repeat(${count}, 1fr)`, gap: p.showFlow ? 28 : 18, minHeight: 0 }}>
          {layers.map((l, i) => {
            const isF = i === fIdx; const isDim = fIdx >= 0 && !isF;
            return (
              <div key={i} style={{ position: 'relative' }}>
                <section className={cx('gxn-panel', isF && 'is-focus')}
                         style={{ height: '100%', padding: '24px 34px', display: 'grid', gridTemplateColumns: '340px 1fr', alignItems: 'center', gap: 40,
                                  opacity: isDim ? 0.52 : 1, transition: 'opacity .3s ease' }}>
                  {/* layer identity */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderRight: '1px solid var(--gxn-line)', paddingRight: 32 }}>
                    <span className="gxn-mono" style={{ fontSize: 24, color: isF ? 'var(--gxn-accent)' : 'var(--gxn-dim)', letterSpacing: '.04em' }}>{l.tier}</span>
                    <span style={{ fontSize: 32, fontWeight: 700, color: 'var(--gxn-text)', lineHeight: 1.15 }}>{l.label}</span>
                    {p.showNote && <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-faint)' }}>{l.note}</span>}
                  </div>
                  {/* segments */}
                  <div style={{ display: 'flex', gap: 18, minWidth: 0 }}>
                    {l.segments.map((s, j) => (
                      <div key={j} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10,
                                            padding: '16px 20px', borderRadius: 16, background: 'rgba(255,255,255,0.035)', border: '1px solid var(--gxn-line)', minWidth: 0 }}>
                        <span style={{ fontSize: 26, fontWeight: 600, color: 'var(--gxn-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</span>
                        {p.showCompanies && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {s.companies.map((c, k) => (
                              <span key={k} className="gxn-mono" style={{ fontSize: 24, padding: '5px 14px', borderRadius: 999, color: isF ? 'var(--gxn-accent)' : 'var(--gxn-dim)', border: `1px solid ${isF ? 'rgba(var(--gxn-glow),0.4)' : 'var(--gxn-line)'}`, background: 'rgba(255,255,255,0.03)' }}>{c}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
                {/* flow connector to next layer */}
                {p.showFlow && i < count - 1 && (
                  <span aria-hidden="true" style={{
                    position: 'absolute', left: 150, bottom: -28, height: 28, width: 2, transform: 'translateX(-50%)',
                    background: 'linear-gradient(180deg, var(--gxn-accent), transparent)', boxShadow: '0 0 12px rgba(var(--gxn-glow),0.6)',
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SlideChain;
