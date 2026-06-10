// Slide11Risk.jsx — 风险研判 / Risk transmission.
// Risk-theme cards, each showing a transmission chain of pills → outcome. Card
// count, the chain display, any highlighted card, and caption are tweakable.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

const TONE = { red: '#e8503a', amber: '#e0a23a', violet: '#7a5ae0', blue: '#5b8def' };

export const defaultProps = {
  kicker: '# 风险研判',
  title: '风险研判 · 四条传导链',
  en: 'Key Risks & Transmission',
  cn: '纪录之下，多重风险信号不容忽视',
  risks: [
    { title: '估值泡沫与盈利困境', en: 'VALUATION BUBBLE', tone: 'red',
      chain: ['高估值泡沫', '盈利未验证', '烧钱过快', '估值回调'],
      impact: 'Anthropic 估值对应收入 P/S 超千倍，宏观收紧时回调难免。' },
    { title: '监管压力加大', en: 'REGULATION', tone: 'amber',
      chain: ['监管收紧', 'AI 安全法案', '合规成本激增'],
      impact: '欧盟 AI Act、美国各州隐私法相继生效，技术标准尚未统一。' },
    { title: '大厂挤压与开源冲击', en: 'BIG-TECH & OSS', tone: 'violet',
      chain: ['大厂自研', '开源逼近闭源', '商业壁垒降低'],
      impact: 'Google / Meta / Microsoft 降维打击，Llama / Mistral 削弱 API 收费。' },
    { title: '算力供应链卡脖子', en: 'COMPUTE SUPPLY', tone: 'blue',
      chain: ['GPU 供应紧张', '出口管制加码', '算力成本高企'],
      impact: 'NVIDIA 供应紧张叠加对华出口管制，中小公司难承受长期烧钱。' },
  ],
  caption: '估值、监管、竞争、算力四条风险链相互叠加 · 退潮后能把技术转化为收入者方能留在牌桌',
  // tweakable
  cardCount: 4,
  highlight: false,
  highlightIndex: 0,
  showChain: true,
  showCaption: true,
};

export const controls = [
  { key: 'cardCount', label: '风险卡数量', type: 'number', default: 4, min: 1, max: 4, step: 1, unit: ' 张',
    description: '展示的风险主题卡片数量。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: false,
    description: '是否高亮强调其中一张风险卡。' },
  { key: 'highlightIndex', label: '强调第几张', type: 'number', default: 0, min: 0, max: 3, step: 1,
    description: '被强调的风险卡序号（从 0 开始）。' },
  { key: 'showChain', label: '传导链', type: 'boolean', default: true,
    description: '是否显示每张卡的风险传导链（关闭则仅显示结论）。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '是否显示底部说明文案。' },
];

function Arrow({ color }) {
  return <span style={{ color: hexA(color, 0.7), fontSize: 24, fontWeight: 700, flex: '0 0 auto' }}>→</span>;
}

function RiskCard({ r, on, dim, single, showChain }) {
  const c = TONE[r.tone] || '#e8503a';
  return (
    <div style={{
      position: 'relative', display: 'flex', flexDirection: 'column', gap: 16, padding: '26px 30px',
      borderRadius: 20, opacity: dim ? 0.55 : 1,
      background: on ? `linear-gradient(150deg, ${hexA(c, 0.18)}, ${hexA(c, 0.05)})` : 'rgba(255,255,255,.46)',
      border: on ? `2px solid ${c}` : `1px solid ${hexA(c, 0.28)}`,
      boxShadow: on ? `0 1px 0 rgba(255,255,255,.7) inset, 0 22px 50px ${hexA(c, 0.26)}` : '0 1px 0 rgba(255,255,255,.6) inset, 0 14px 34px rgba(70,72,100,.1)',
      backdropFilter: 'blur(16px)', transition: 'all .3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: c, alignSelf: 'center', flex: '0 0 auto' }} />
        <span style={{ fontSize: single ? 40 : 33, fontWeight: 900, color: 'var(--aip-ink)' }}>{r.title}</span>
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 24, letterSpacing: '.06em', color: hexA(c, 0.8) }}>{r.en}</span>
      </div>

      {showChain && (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
          {r.chain.map((step, k) => (
            <React.Fragment key={k}>
              <span style={{ padding: '8px 18px', borderRadius: 10, background: hexA(c, 0.12),
                border: `1px solid ${hexA(c, 0.4)}`, color: '#3a3a42', fontSize: 25, fontWeight: 600, whiteSpace: 'nowrap' }}>{step}</span>
              {k < r.chain.length - 1 && <Arrow color={c} />}
            </React.Fragment>
          ))}
        </div>
      )}

      <div style={{ fontSize: 25, lineHeight: 1.5, color: 'var(--aip-ink-2)', textWrap: 'pretty' }}>{r.impact}</div>
    </div>
  );
}

export default function Slide11Risk(props) {
  const p = { ...defaultProps, ...props };
  const cards = p.risks.slice(0, Math.max(1, Math.min(4, p.cardCount)));
  const single = cards.length === 1;
  const cols = cards.length === 1 ? '1fr' : '1fr 1fr';

  return (
    <SlideFrame bg="a">
      <SlideHead kicker={p.kicker} tone="red" title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: cols,
        gridAutoRows: '1fr', gap: 22, marginTop: 12, minHeight: 0 }}>
        {cards.map((r, i) => (
          <RiskCard key={i} r={r} single={single} showChain={p.showChain}
            on={p.highlight && i === p.highlightIndex} dim={p.highlight && i !== p.highlightIndex} />
        ))}
      </div>

      <MonoCaption show={p.showCaption}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
