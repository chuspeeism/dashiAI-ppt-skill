/**
 * CrossPage — P06 横向透视 · 赛道与轮次 (Cross-Section · Tracks & Rounds)
 *
 * Two-panel analytical slide: a primary share chart (tracks) plus an optional
 * secondary panel (average ticket by round) that evidences winner-take-all.
 *
 * Self-contained & prop-driven. Scoped under `.aic-cross`.
 * Shared deps: ./theme.js, ./viz.jsx (Donut, BarRow, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { Donut, BarRow, HeatStrip } from '../viz.jsx';

const COPY = {
  eyebrow: 'Cross-Section',
  title: '横向透视',
  titleTail: '赛道与轮次',
  sub: '钱流向哪些赛道和阶段',
  lead: '通用大模型仍是最大吸金赛道，后期轮和未披露轮次体现头部赢家通吃。',
  closing: '融资额排名背后，是资本对叙事和兑现的双重押注。',
  shareTitle: '赛道融资占比',
  roundTitle: '各轮次平均单笔',
  roundUnit: '亿美元',
  tracks: [
    { label: '通用大模型', pct: 43.3 },
    { label: '垂直应用', pct: 25.3 },
    { label: '基础设施', pct: 16.3 },
    { label: 'AI 芯片', pct: 10.0 },
    { label: '其他', pct: 5.1 },
  ],
  rounds: [
    { label: '早期轮 Seed–A', avg: 2.1 },
    { label: '成长轮 B–C', avg: 4.8 },
    { label: '后期轮 D+', avg: 14.2 },
    { label: '未披露轮次', avg: 18.6 },
  ],
};
const TRACK_COLORS = ['var(--aic-accent)', 'var(--aic-ink)', '#9AA08F', 'var(--aic-warn)', 'var(--aic-faint)'];

export const defaultProps = {
  copy: COPY,
  chartType: 'donut',    // 'donut' | 'bars'
  focusEnabled: true,
  focusIndex: 0,         // which track is the focus
  showSecondary: true,   // show the round-structure panel
  showDecorations: true,
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'chartType', label: '图表类型', type: 'radio', default: 'donut',
    options: [{ value: 'donut', label: '环形图' }, { value: 'bars', label: '占比条' }],
    description: '主图（赛道占比）的呈现方式。' },
  { key: 'showSecondary', label: '辅助面板', type: 'toggle', default: true,
    description: '右侧轮次结构面板的显隐；关闭后主图占据更大空间。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一赛道作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [0, 1, 2, 3, 4].map((i) => ({ value: i, label: '第 ' + (i + 1) + ' 个' })),
    description: '选择被高亮的赛道。', showWhen: (p) => p.focusEnabled },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与底部条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色。' },
];

const CSS = `
.aic-cross { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-cross, .aic-cross * { box-sizing: border-box; }
.aic-cross .cx-glow { position: absolute; left: -6%; bottom: -12%; width: 54%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-cross .cx-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-cross .cx-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-cross .cx-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0;
  display: flex; align-items: baseline; gap: 22px; }
.aic-cross .cx-title em { font-style: normal; font-weight: 500; font-size: 34px; color: var(--aic-ink-dim); letter-spacing: .02em; }
.aic-cross .cx-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px;
  color: var(--aic-ink-dim); padding-bottom: 8px; }

.aic-cross .cx-lead { position: absolute; left: var(--pad); top: 286px; width: 1320px;
  font-family: var(--aic-font-text); font-weight: 500; font-size: 34px; line-height: 1.5; color: var(--aic-ink); margin: 0; }
.aic-cross .cx-lead em { font-style: normal; font-weight: 900;
  background: linear-gradient(transparent 62%, color-mix(in srgb, var(--aic-accent) 55%, transparent) 0); }

.aic-cross .cx-body { position: absolute; left: var(--pad); right: var(--pad); top: 420px; bottom: 150px;
  display: grid; gap: 72px; align-content: start; }
.aic-cross .cx-panel-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 20px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 30px;
  display: flex; align-items: center; justify-content: space-between; }
.aic-cross .cx-panel-t span:last-child { color: var(--aic-faint); }

.aic-cross .cx-donut-wrap { display: flex; align-items: center; gap: 56px; }
.aic-cross .cx-legend { display: flex; flex-direction: column; gap: 20px; }
.aic-cross .cx-leg { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-size: 26px; color: var(--aic-ink-dim); transition: opacity .3s; white-space: nowrap; }
.aic-cross .cx-leg i { width: 18px; height: 18px; border-radius: 5px; flex: none; }
.aic-cross .cx-leg b { font-family: var(--aic-font-display); font-weight: 700; margin-left: auto;
  color: var(--aic-ink); font-variant-numeric: tabular-nums; min-width: 110px; text-align: right; }
.aic-cross .cx-leg[data-focus="1"] { color: var(--aic-ink); font-weight: 700; }

.aic-cross .cx-rounds { display: flex; flex-direction: column; gap: 24px; }
.aic-cross .cx-rowwrap { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 6px 18px; }
.aic-cross .cx-rowwrap .lbl { font-family: var(--aic-font-text); font-weight: 600; font-size: 24px; color: var(--aic-ink-dim); white-space: nowrap; }
.aic-cross .cx-rowwrap[data-focus="1"] .lbl { color: var(--aic-ink); font-weight: 700; }
.aic-cross .cx-rowwrap .val { font-family: var(--aic-font-display); font-weight: 700; font-size: 30px;
  color: var(--aic-ink); font-variant-numeric: tabular-nums; }
.aic-cross .cx-rowwrap .val u { text-decoration: none; font-size: 17px; font-weight: 600; color: var(--aic-muted); margin-left: 5px; }
.aic-cross .cx-rowwrap .track { grid-column: 1 / -1; height: 14px; border-radius: 999px; background: var(--aic-hair); overflow: hidden; }
.aic-cross .cx-rowwrap .fill { height: 100%; border-radius: 999px; transition: width .5s cubic-bezier(.3,.7,.4,1); }

.aic-cross .cx-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 70px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-cross .cx-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-cross .cx-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-cross .cx-deco { width: 300px; height: 32px; }
`;

const DECO = ['pos','accent','pos','warn','neg','pos','accent','pos','warn','accent','pos','pos',
  'neg','warn','accent','pos','pos','warn','accent','pos','neg','pos','accent','pos','warn','pos',
  'accent','pos','pos','neg','warn','accent','pos','pos','warn','accent'].map((tone) => ({ tone }));

export default function CrossPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = p.copy || COPY;
  ensureFonts();
  injectScopedStyle('aic-cross', CSS);
  const vars = themeVars(p.accentColor);

  const tracks = copy.tracks;
  const focus = Math.max(0, Math.min(tracks.length - 1, p.focusIndex));
  const maxPct = Math.max(...tracks.map((t) => t.pct));
  const roundMax = Math.max(...copy.rounds.map((r) => r.avg));
  const roundFocus = copy.rounds.reduce((mi, r, i, a) => (r.avg > a[mi].avg ? i : mi), 0);

  const cols = p.showSecondary ? '1.15fr 1px 0.85fr' : '1fr';

  return (
    <div className="aic-cross" style={vars}>
      {p.showDecorations && <div className="cx-glow" />}

      <div className="cx-head">
        <div>
          <p className="cx-eyebrow">{copy.eyebrow}</p>
          <h2 className="cx-title">{copy.title}<em>· {copy.titleTail}</em></h2>
        </div>
        <div className="cx-sub">{copy.sub}</div>
      </div>

      <p className="cx-lead">
        通用大模型仍是<em>最大吸金赛道</em>，后期轮和未披露轮次体现头部<em>赢家通吃</em>。
      </p>

      <div className="cx-body" style={{ gridTemplateColumns: cols }}>
        {/* primary: track share */}
        <div>
          <p className="cx-panel-t"><span>{copy.shareTitle}</span><span>SHARE</span></p>
          {p.chartType === 'donut' ? (
            <div className="cx-donut-wrap">
              <Donut size={340} thickness={50}
                focusIndex={p.focusEnabled ? focus : -1}
                segments={tracks.map((t, i) => ({ value: t.pct, color: TRACK_COLORS[i] }))}
                centerTop={tracks[p.focusEnabled ? focus : 0].pct + '%'}
                centerBottom={tracks[p.focusEnabled ? focus : 0].label} />
              <div className="cx-legend">
                {tracks.map((t, i) => (
                  <div className="cx-leg" key={t.label} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
                    <i style={{ background: TRACK_COLORS[i] }} />{t.label}<b>{t.pct}%</b>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {tracks.map((t, i) => (
                <BarRow key={t.label} label={t.label} display={t.pct + '%'}
                  value={(t.pct / maxPct) * 100} color={TRACK_COLORS[i]}
                  focus={p.focusEnabled && i === focus} />
              ))}
            </div>
          )}
        </div>

        {/* divider + secondary: rounds */}
        {p.showSecondary && (
          <>
            <div style={{ background: 'var(--aic-hair)' }} />
            <div>
              <p className="cx-panel-t"><span>{copy.roundTitle}</span><span>AVG TICKET</span></p>
              <div className="cx-rounds">
                {copy.rounds.map((r, i) => {
                  const isF = i === roundFocus;
                  return (
                    <div className="cx-rowwrap" key={r.label} data-focus={isF ? '1' : '0'}>
                      <div className="lbl">{r.label}</div>
                      <div className="val">{r.avg}<u>{copy.roundUnit}</u></div>
                      <div className="track">
                        <div className="fill" style={{ width: (r.avg / roundMax) * 100 + '%',
                          background: isF ? 'var(--aic-accent)' : 'var(--aic-ink)' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="cx-foot">
        <div className="cx-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="cx-deco"><HeatStrip data={DECO} gap={4} /></div>}
      </div>
    </div>
  );
}
