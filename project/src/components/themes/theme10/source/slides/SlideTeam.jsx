// SlideTeam.jsx — 团队墙 / captioned portrait grid.
// A grid of portrait slots, each with a name + role lockup beneath, that re-flows
// to stay balanced at any count (2–6) and fills the frame uniformly (cover crop
// gracefully absorbs any uploaded ratio). Distinct from Slide04Gallery (untitled
// uniform grid), SlideFilmstrip (single ratio-true row) and SlideMosaic
// (collage): this is a labelled people wall. Standalone & migratable: depends
// only on React + DeckImageSlot (both global). Token-driven. CSS scoped `.tm-`.
//
// ── Props (canonical list in SlideTeam.META.controls) ─────────────────────────
//   memberCount  number 2..6    how many portrait cells                    (4)
//   showRole     boolean        the role line under each name              (true)
//   showIndex    boolean        the 01/02… index over each name            (false)
//   radius       number 0..28   portrait corner radius (px)                (12)
//
// Content props (authored at call-site):
//   idPrefix (persistence namespace), overline, title,
//   members:[{ name, role }]

import React from 'react';
import { DeckImageSlot } from '../components/DeckImageSlot.jsx';

function SlideTeam({
  idPrefix = 'team',
  overline = '团队 · WHO RUNS IT', title = '替你执行纪律的人',
  members = [
    { name: '林彦', role: '首席投资官 · CIO' },
    { name: '苏敏', role: '量化策略负责人' },
    { name: '陈则', role: '风险与对冲主管' },
    { name: '何静', role: '客户与规划顾问' },
    { name: '周野', role: '数据工程负责人' },
    { name: '叶霖', role: '合规与税务' },
  ],
  memberCount = 4, showRole = true, showIndex = false, radius = 12,
}) {
  React.useEffect(() => { tmInjectStyle(); }, []);
  const n = Math.max(2, Math.min(members.length, memberCount));
  const used = members.slice(0, n);
  const cols = n <= 3 ? n : Math.ceil(n / 2);

  return (
    <div className="tm-root">
      <div className="tm-head">
        <div className="tm-overline">{overline}</div>
        <h2 className="tm-title">{title}</h2>
      </div>

      <div className="tm-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {used.map((m, i) => (
          <figure className="tm-cell" key={i}>
            <div className="tm-slot" style={{ borderRadius: radius }}>
              <DeckImageSlot id={`${idPrefix}-${i}`} fit="cover" radius={radius}
                             placeholder={`MEDIA ${String(i + 1).padStart(2, '0')}`} />
            </div>
            <figcaption className="tm-cap">
              {showIndex && <span className="tm-idx">{String(i + 1).padStart(2, '0')}</span>}
              <span className="tm-name">{m.name}</span>
              {showRole && <span className="tm-role">{m.role}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

function tmInjectStyle() {
  if (document.getElementById('tm-style')) return;
  const s = document.createElement('style'); s.id = 'tm-style';
  s.textContent = `
  .tm-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .tm-head{margin-bottom:34px;}
  .tm-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .tm-title{font-size:60px;font-weight:300;margin:16px 0 0;line-height:1.06;}
  .tm-grid{flex:1;min-height:0;display:grid;gap:30px;grid-auto-rows:1fr;}
  .tm-cell{margin:0;min-height:0;display:flex;flex-direction:column;}
  .tm-slot{position:relative;flex:1;min-height:0;overflow:hidden;}
  .tm-cap{display:flex;flex-direction:column;gap:5px;padding-top:16px;}
  .tm-idx{font-family:var(--font-mono);font-size:24px;letter-spacing:.06em;color:var(--ds-accent,#6f9bd8);}
  .tm-name{font-size:30px;font-weight:300;}
  .tm-role{font-family:var(--font-mono);font-size:24px;letter-spacing:.03em;color:var(--ds-faint,rgba(242,243,246,.5));}
  `;
  document.head.appendChild(s);
}

SlideTeam.META = {
  id: 'team', title: '内容墙',
  defaults: { memberCount: 4, showRole: true, showIndex: false, radius: 12 },
  controls: [
    { key: 'memberCount', type: 'slider', label: '内容数量', default: 4, min: 2, max: 6, step: 1,
      description: '内容卡片数量（自动分列填满版面）。' },
    { key: 'showRole', type: 'toggle', label: '副标签', default: true,
      description: '主标签下方的辅助说明。' },
    { key: 'showIndex', type: 'toggle', label: '编号', default: false,
      description: '姓名上方的 01/02… 序号。' },
    { key: 'radius', type: 'slider', label: '圆角', default: 12, min: 0, max: 28, step: 2, unit: 'px',
      description: '图片格的圆角半径。' },
  ],
};

export { SlideTeam };
export const META = SlideTeam.META;
export default SlideTeam;
