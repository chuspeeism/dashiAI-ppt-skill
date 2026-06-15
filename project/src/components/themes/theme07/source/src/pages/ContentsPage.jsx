/**
 * ContentsPage — P03 报告结构 (Chapter Contents)
 *
 * Prop-driven slide. Scoped under `.aic-toc`.
 * Shared deps: ./theme.js, ./viz.jsx (Barcode).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip, LensCluster } from '../viz.jsx';

const COPY = {
  eyebrow: 'Structure',
  title: '报告结构',
  sub: '从方法到结论的阅读路径',
  lead: '整份报告按研究方法、市场全景、横向透视、产业链、典型案例、风险展望和结论展开。',
  closing: '先建立框架，再进入数据和判断。',
  chapters: [
    { no: '01', zh: '研究方法', en: 'Methodology' },
    { no: '02', zh: '市场全景', en: 'Market Panorama' },
    { no: '03', zh: '横向透视', en: 'Cross Section' },
    { no: '04', zh: '产业链条', en: 'Value Chain' },
    { no: '05', zh: '典型案例', en: 'Case Studies' },
    { no: '06', zh: '风险展望', en: 'Risk & Outlook' },
    { no: '07', zh: '结论判断', en: 'Conclusion' },
  ],
};

export const defaultProps = {
  ...COPY,
  cardCount: 7,
  focusEnabled: true,
  focusIndex: 1,
  columns: 4,
  showDecorations: true,
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Structure' },
  { key: 'title', label: '标题', type: 'text', default: '报告结构' },
  { key: 'sub', label: '次标题', type: 'text', default: '从方法到结论的阅读路径' },
  { key: 'lead', label: '导言', type: 'text', default: '整份报告按研究方法、市场全景、横向透视、产业链、典型案例、风险展望和结论展开。' },
  { key: 'closing', label: '结语', type: 'text', default: '先建立框架，再进入数据和判断。' },
  { key: 'cardCount', label: '章节卡数量', type: 'slider', default: 7, min: 3, max: 7, step: 1,
    description: '展示的章节卡数量（3–7）。' },
  { key: 'columns', label: '每行列数', type: 'radio', default: 4,
    options: [{ value: 3, label: '3 列' }, { value: 4, label: '4 列' }],
    description: '章节卡的网格列数，影响排布节奏。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一章节卡作为阅读重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 1,
    options: [0,1,2,3,4,5,6].map((i) => ({ value: i, label: '第 ' + (i + 1) + ' 个' })),
    description: '选择被高亮的章节卡。', showWhen: (p) => p.focusEnabled },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '序号水印与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色。' },
];

const CSS = `
.aic-toc { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-toc, .aic-toc * { box-sizing: border-box; }
.aic-toc .toc-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-toc .toc-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-toc .toc-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0; }
.aic-toc .toc-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px;
  color: var(--aic-ink-dim); padding-bottom: 8px; }
.aic-toc .toc-lead { position: absolute; left: var(--pad); top: 272px; width: 1180px;
  font-family: var(--aic-font-text); font-weight: 500; font-size: 32px; line-height: 1.5;
  color: var(--aic-ink-dim); margin: 0; }

.aic-toc .toc-grid { position: absolute; left: var(--pad); right: var(--pad); top: 430px;
  display: grid; gap: 22px; }
.aic-toc .toc-card { position: relative; overflow: hidden; border-radius: 20px; padding: 30px 30px 34px;
  background: var(--aic-card); border: 1.5px solid var(--aic-hair); min-height: 234px;
  display: flex; flex-direction: column; justify-content: space-between;
  transition: background .3s, border-color .3s, transform .3s; }
.aic-toc .toc-card[data-focus="1"] { background: var(--aic-ink); border-color: var(--aic-ink); transform: translateY(-6px); }
.aic-toc .toc-card-no { font-family: var(--aic-font-display); font-weight: 700; font-size: 30px;
  color: var(--aic-accent); font-variant-numeric: lining-nums; transform: skewX(-9deg); transform-origin: left bottom; }
.aic-toc .toc-card-watermark { position: absolute; right: -10px; bottom: -42px; font-family: var(--aic-font-display);
  font-weight: 700; font-size: 150px; line-height: 1; color: var(--aic-ink); opacity: .05;
  transform: skewX(-9deg); pointer-events: none; }
.aic-toc .toc-card[data-focus="1"] .toc-card-watermark { color: var(--aic-accent); opacity: .16; }
.aic-toc .toc-card-zh { font-family: var(--aic-font-text); font-weight: 700; font-size: 36px; color: var(--aic-ink); margin: 0; }
.aic-toc .toc-card[data-focus="1"] .toc-card-zh { color: #fff; }
.aic-toc .toc-card-en { font-family: var(--aic-font-display); font-weight: 500; font-size: 20px;
  letter-spacing: .14em; text-transform: uppercase; color: var(--aic-muted); margin: 10px 0 0; }
.aic-toc .toc-card[data-focus="1"] .toc-card-en { color: rgba(255,255,255,.6); }
.aic-toc .toc-card-tag { position: absolute; top: 30px; right: 30px; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 16px; letter-spacing: .12em; text-transform: uppercase; color: var(--aic-ink);
  background: var(--aic-accent); padding: 6px 12px; border-radius: 999px; }

.aic-toc .toc-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 70px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-toc .toc-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-toc .toc-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-toc .toc-deco { width: 280px; height: 38px; }
`;

const DECO = ['pos','accent','pos','warn','pos','accent','neg','pos','warn','accent','pos','pos',
  'neg','warn','accent','pos','pos','warn','accent','pos','neg','pos','accent','pos','warn','pos',
  'accent','pos','pos','neg','warn','accent','pos','pos','warn','accent','pos','neg','pos','accent']
  .map((tone) => ({ tone }));

export default function ContentsPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...COPY, ...Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) };
  ensureFonts();
  injectScopedStyle('aic-toc', CSS);
  const vars = themeVars(p.accentColor);

  const n = Math.max(3, Math.min(7, p.cardCount));
  const chapters = copy.chapters.slice(0, n);
  const cols = p.columns === 3 ? 3 : 4;
  const focus = Math.max(0, Math.min(n - 1, p.focusIndex));

  return (
    <div className="aic-toc" style={vars}>
      <div className="toc-head">
        <div>
          <p className="toc-eyebrow">{copy.eyebrow}</p>
          <h2 className="toc-title">{copy.title}</h2>
        </div>
        <div className="toc-sub">{copy.sub}</div>
      </div>

      <p className="toc-lead">{copy.lead}</p>

      <div className="toc-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {chapters.map((c, i) => {
          const isFocus = p.focusEnabled && i === focus;
          return (
            <div className="toc-card" key={c.no} data-focus={isFocus ? '1' : '0'}>
              {p.showDecorations && <span className="toc-card-watermark">{c.no}</span>}
              {isFocus && <span className="toc-card-tag">重点</span>}
              <div className="toc-card-no">{c.no}</div>
              <div>
                <p className="toc-card-zh">{c.zh}</p>
                <p className="toc-card-en">{c.en}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="toc-foot">
        <div className="toc-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="toc-deco"><HeatStrip data={DECO} gap={4} /></div>}
      </div>
    </div>
  );
}
