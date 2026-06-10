// SlideExhibit.jsx — 标的档案 / a dossier card: framed image + spec sheet.
// A tall, aspect-tolerant image frame carries a vertical "档案 / DOSSIER" filing
// label down its edge; beside it a structured spec sheet (label : value rows), a
// one-line thesis and a tag row read like a filing card. Distinct from
// SlideFeature (image + a stat row + body copy) and SlideProfile (portrait +
// quote + bio) by its records-sheet structure. Standalone & migratable: depends
// only on React + DeckImageSlot (globals). Token-driven, light/dark tone applies.
// CSS scoped `.exb-`.
//
// ── Props (canonical list in SlideExhibit.META.controls) ──────────────────────
//   imageSide   'left'|'right'  which side the image frame sits            ('left')
//   rowCount    number 3..7     spec rows shown                            (5)
//   showThesis  boolean         the one-line investment thesis             (true)
//   showTags    boolean         the tag chip row                          (true)
//   showFileLabel boolean       the vertical filing label on the frame    (true)
//   idPrefix    string          persistence namespace for the image slot
//
// Content props (authored at call-site):
//   overline, fileNo, title, subtitle, specs:[{ k, v }], thesis, tags:[string]

import React from 'react';
import { DeckImageSlot } from '../components/DeckImageSlot.jsx';

function SlideExhibit({
  overline = '标的档案 · ONE NAME, UP CLOSE',
  fileNo = 'NO.012',
  title = '长江电力',
  subtitle = '600900 · 公用事业 / 水电',
  specs = [
    { k: '纳入时间', v: '2019.04' },
    { k: '组合权重', v: '6.8%' },
    { k: '持有逻辑', v: '稳定现金流 · 类债底仓' },
    { k: '股息率', v: '3.6%' },
    { k: '与组合相关性', v: '0.21 偏低' },
    { k: '年化贡献', v: '+0.9%' },
    { k: '评级', v: 'A · 核心持有' },
  ],
  thesis = '把一条会下蛋的水坝放进组合：现金流可预期、与权益相关性低，是回撤时的压舱石。',
  tags = ['核心仓', '低波动', '高股息', '类债'],
  imageSide = 'left', rowCount = 5, showThesis = true, showTags = true, showFileLabel = true,
  idPrefix = 'exhibit',
}) {
  React.useEffect(() => { exbInjectStyle(); }, []);
  const n = Math.max(3, Math.min(specs.length, rowCount));
  const rows = specs.slice(0, n);
  const sp = n >= 7 ? 11 : n === 6 ? 15 : 20;
  const mt = n >= 6 ? 26 : 42;
  const mt2 = n >= 6 ? 22 : 38;
  const mt3 = n >= 6 ? 18 : 30;

  const Frame = (
    <div className="exb-frame">
      <DeckImageSlot id={`${idPrefix}-shot`} idPrefix={idPrefix} placeholder="标的影像" fit="cover" radius={20} />
      {showFileLabel && (
        <div className="exb-file">
          <span className="exb-file-tag">DOSSIER</span>
          <span className="exb-file-no">{fileNo}</span>
        </div>
      )}
    </div>
  );

  const Panel = (
    <div className="exb-panel" style={{ ['--exb-sp']: `${sp}px`, ['--exb-mt']: `${mt}px`, ['--exb-mt2']: `${mt2}px`, ['--exb-mt3']: `${mt3}px` }}>
      <div className="exb-overline">{overline}</div>
      <h2 className="exb-title">{title}</h2>
      <div className="exb-sub">{subtitle}</div>

      <div className="exb-specs">
        {rows.map((s, i) => (
          <div className="exb-spec" key={i}>
            <span className="exb-k">{s.k}</span>
            <span className="exb-dots" />
            <span className="exb-v">{s.v}</span>
          </div>
        ))}
      </div>

      {showThesis && (
        <div className="exb-thesis"><span className="exb-trule" />{thesis}</div>
      )}
      {showTags && (
        <div className="exb-tags">
          {tags.map((t, i) => <span className="exb-tag" key={i}>{t}</span>)}
        </div>
      )}
    </div>
  );

  return (
    <div className={`exb-root ${imageSide === 'right' ? 'is-right' : ''}`}>
      {imageSide === 'right' ? <>{Panel}{Frame}</> : <>{Frame}{Panel}</>}
    </div>
  );
}

function exbInjectStyle() {
  if (document.getElementById('exb-style')) return;
  const s = document.createElement('style'); s.id = 'exb-style';
  s.textContent = `
  .exb-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:grid;grid-template-columns:0.92fr 1fr;gap:88px;
    align-items:stretch;font-family:var(--font-sans);}
  .exb-frame{position:relative;border-radius:20px;overflow:hidden;min-height:0;}
  .exb-file{position:absolute;top:0;left:0;height:100%;width:62px;display:flex;flex-direction:column;
    align-items:center;justify-content:space-between;padding:26px 0;
    background:linear-gradient(180deg,rgba(8,9,11,.66),rgba(8,9,11,.28));backdrop-filter:blur(2px);
    box-shadow:inset -1px 0 0 var(--ds-line,rgba(242,243,246,.16));}
  .exb-file-tag,.exb-file-no{writing-mode:vertical-rl;font-family:var(--font-mono);letter-spacing:.22em;color:#eef0f2;}
  .exb-file-tag{font-size:24px;}
  .exb-file-no{font-size:24px;color:var(--ds-accent,#6f9bd8);}
  .exb-panel{display:flex;flex-direction:column;justify-content:center;min-width:0;}
  .exb-overline{font-family:var(--font-mono);font-size:25px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .exb-title{font-size:74px;font-weight:300;margin:16px 0 0;line-height:1.04;}
  .exb-sub{font-family:var(--font-mono);font-size:24px;letter-spacing:.05em;color:var(--ds-muted,rgba(242,243,246,.62));margin-top:12px;}
  .exb-specs{display:flex;flex-direction:column;margin-top:var(--exb-mt,42px);}
  .exb-spec{display:grid;grid-template-columns:auto 1fr auto;align-items:baseline;gap:18px;padding:var(--exb-sp,20px) 0;
    border-top:1px solid var(--ds-line,rgba(242,243,246,.12));}
  .exb-spec:last-child{border-bottom:1px solid var(--ds-line,rgba(242,243,246,.12));}
  .exb-k{font-size:27px;font-weight:300;color:var(--ds-muted,rgba(242,243,246,.66));}
  .exb-dots{height:1px;align-self:center;border-bottom:2px dotted var(--ds-line,rgba(242,243,246,.3));}
  .exb-v{font-family:var(--font-mono);font-size:28px;font-variant-numeric:tabular-nums;color:var(--ds-ink,#f2f3f6);text-align:right;}
  .exb-thesis{display:flex;align-items:flex-start;gap:22px;margin-top:var(--exb-mt2,38px);font-size:28px;font-weight:300;
    line-height:1.45;text-wrap:pretty;color:var(--ds-ink,#f2f3f6);}
  .exb-trule{flex:0 0 auto;width:60px;height:2px;margin-top:18px;background:var(--ds-accent,#6f9bd8);}
  .exb-tags{display:flex;flex-wrap:wrap;gap:14px;margin-top:var(--exb-mt3,30px);}
  .exb-tag{font-family:var(--font-mono);font-size:22px;letter-spacing:.04em;padding:9px 20px;border-radius:999px;
    color:var(--ds-muted,rgba(242,243,246,.7));box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.2));}
  `;
  document.head.appendChild(s);
}

SlideExhibit.META = {
  id: 'exhibit', title: '标的档案',
  defaults: { imageSide: 'left', rowCount: 5, showThesis: true, showTags: true, showFileLabel: true },
  controls: [
    { key: 'imageSide', type: 'radio', label: '图片位置', default: 'left',
      options: [{ value: 'left', label: '左' }, { value: 'right', label: '右' }],
      description: '影像档案框位于左侧或右侧。' },
    { key: 'rowCount', type: 'slider', label: '档案行数', default: 5, min: 3, max: 7, step: 1,
      description: '右侧规格表的字段行数。' },
    { key: 'showThesis', type: 'toggle', label: '一句逻辑', default: true,
      description: '规格表下方的一句持有逻辑。' },
    { key: 'showTags', type: 'toggle', label: '标签行', default: true,
      description: '底部的属性标签胶囊。' },
    { key: 'showFileLabel', type: 'toggle', label: '档案封边', default: true,
      description: '影像框侧边的竖排「DOSSIER」编号封边。' },
  ],
};

export { SlideExhibit };
export const META = SlideExhibit.META;
export default SlideExhibit;
