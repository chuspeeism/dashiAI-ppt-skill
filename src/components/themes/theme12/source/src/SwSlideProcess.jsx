// SwSlideProcess.jsx — "流程 / How It Works" page.
//
// A left-to-right step flow rendered as full-height COLOUR-BLOCKED cards (one
// saturated brand colour per step) carrying a giant ghost mono numeral, with a
// connector chevron between columns and one step optionally promoted to the
// accent colour (focus). Distinct from the dated Timeline and the uniform Stack
// grid. Count (3–5), focus, connector and lede are props-controlled and map 1:1
// to `controls`; all visible copy/data defaults live in `defaultProps`.
// No global side effects.

import React from 'react';
import { swTheme, swCardPalette } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'process', index: 7, label: '流程 / How It Works' };

export const defaultProps = {
  accent: C.orange,
  stepCount: 4,            // 3–5 steps
  focus: true,             // promote one step to the accent colour
  focusIndex: 4,
  showConnector: true,     // chevrons between steps
  showLede: true,
  // —— content ——
  barMeta: '07 — How It Works',
  kicker: '工作流 / How It Works',
  title: '从一条 demo，到一笔[[到账]]。',
  steps: [
    { cn: '上传作品', en: 'Upload', d: '拖入母带与封面，元数据自动校验合规。' },
    { cn: '一键分发', en: 'Distribute', d: '同步推送到全球 30+ 流媒体与商店。' },
    { cn: '透明结算', en: 'Settle', d: '版税按平台拆解，最快 72 小时到账。' },
    { cn: '经营听众', en: 'Grow', d: '把听众沉淀为可直连、可复购的资产。' },
    { cn: '版权护盾', en: 'Protect', d: '全网监测盗用，一键存证与维权。' },
  ],
  page: '07',
  total: '82',
};

export const controls = [
  { key: 'stepCount', label: '步骤数量', type: 'slider', def: 4, min: 3, max: 5, step: 1,
    desc: '流程展示的步骤数量' },
  { key: 'focus', label: '重点强调', type: 'toggle', def: true, desc: '把某一步提升为强调色卡片' },
  { key: 'focusIndex', label: '强调第几步', type: 'slider', def: 4, min: 1, max: 5, step: 1,
    dependsOn: 'focus', desc: '被强调步骤的序号（1 起）' },
  { key: 'showConnector', label: '连接箭头', type: 'toggle', def: true, desc: '显示/隐藏步骤间的箭头' },
  { key: 'showLede', label: '显示导语', type: 'toggle', def: true, desc: '显示/隐藏标题区导语' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '焦点卡 / 导语 / 页脚强调色' },
];

function Chevron({ color }) {
  return (
    <div style={{ flex: '0 0 40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true">
      <svg width="32" height="32" viewBox="0 0 34 34" fill="none">
        <path d="M10 5 L24 17 L10 29" stroke={color} strokeWidth="4.5"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function SwSlideProcess(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(3, Math.min(5, p.stepCount));
  const focusN = p.focus ? Math.max(1, Math.min(count, p.focusIndex)) : 0;
  const steps = (p.steps || []).slice(0, count);

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 3 }}>

        {p.showLede && (
          <div style={{ flexShrink: 0, margin: '22px 0 24px' }}>
            <Kicker accent={accent}>{p.kicker}</Kicker>
            <h2 style={{ fontWeight: 900, fontSize: 56, lineHeight: 1.04, letterSpacing: '-1.5px', marginTop: 14 }}>
              {renderSwText(p.title, { hl: { tone: 'o' } })}
            </h2>
          </div>
        )}

        <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'stretch' }}>
          {steps.map((s, i) => {
            const on = (i + 1) === focusN;
            const pal = swCardPalette[i % swCardPalette.length];
            const cardBg = on ? accent : pal.bg;
            const titleC = on ? '#fff' : pal.title;
            const numC = on ? 'rgba(255,255,255,.5)' : pal.name;
            const labelC = on ? 'rgba(255,255,255,.82)' : pal.sub;
            const bodyC = on ? 'rgba(255,255,255,.92)' : pal.body;
            return (
              <React.Fragment key={s.en}>
                <div style={{ flex: 1, minWidth: 0, position: 'relative', overflow: 'hidden',
                  background: cardBg, color: bodyC, borderRadius: 24, padding: '34px 30px 30px',
                  display: 'flex', flexDirection: 'column',
                  transform: on ? 'translateY(-10px)' : 'none',
                  boxShadow: on ? '0 22px 50px rgba(20,15,16,.22)' : 'none' }}>
                  <div aria-hidden="true" style={{ position: 'absolute', top: -28, right: -8,
                    fontFamily: F.mono, fontWeight: 700, fontSize: 150, lineHeight: 0.8,
                    color: 'transparent', WebkitTextStroke: '2px ' + numC, opacity: on ? .55 : .45,
                    pointerEvents: 'none', zIndex: 0 }}>{String(i + 1).padStart(2, '0')}</div>

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 26, color: numC === 'rgba(255,255,255,.5)' ? '#fff' : pal.name }}>{String(i + 1).padStart(2, '0')}</span>
                    <div style={{ fontFamily: F.mono, fontSize: 21, letterSpacing: '.16em',
                      textTransform: 'uppercase', color: labelC, marginTop: 12 }}>{s.en}</div>
                  </div>

                  <div style={{ position: 'relative', zIndex: 1, marginTop: 'auto' }}>
                    <h3 style={{ fontWeight: 900, fontSize: 38, letterSpacing: '-.5px', color: titleC }}>{s.cn}</h3>
                    <p style={{ fontSize: 23, lineHeight: 1.55, marginTop: 12, color: bodyC }}>{s.d}</p>
                  </div>
                </div>
                {p.showConnector && i < steps.length - 1 && <Chevron color={accent} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
