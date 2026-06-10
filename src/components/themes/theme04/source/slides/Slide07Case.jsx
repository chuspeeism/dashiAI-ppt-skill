/*
 * Slide07Case — 典型案例深剖（自适应图片槽 + 里程碑时间轴）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsCa- 。
 *
 * 图片槽（image-slot）：数量 0–2，按用户上传图片的真实宽高比自适应，
 * 并通过 mediaLayout 在「并排 / 堆叠」间切换，保证不同数量下构图美观。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  mediaCount       number 图片槽数量          默认 1   可选 0–2
 *  mediaLayout      enum   多图排布           默认 'stack'  可选 'stack' | 'row'
 *  milestoneCount   number 里程碑数量          默认 4   可选 2–4
 *  focusEnabled     bool   重点突出开关         默认 true
 *  focusIndex       number 重点里程碑序号(从1起) 默认 4
 *  showQuote        bool   引言显隐            默认 true
 *  showDecorations  bool   装饰元素显隐         默认 true
 *
 * 文本写死在组件内，不做参数化。
 * 迁移：import Slide07Case, { defaults, controls } from './Slide07Case.jsx'
 */
import React from 'react';

const XHSCA_ACCENT = '#27E021';
const XHSCA_MILESTONES = [
  { date: '2024 · 5月', title: 'Series G', metric: '融资 280 亿 · 估值 600 亿' },
  { date: '2024 · 8月', title: 'Series H 首轮', metric: '融资 180 亿 · 估值 830 亿' },
  { date: '2024 · 11月', title: 'Series H 扩轮', metric: '融资 190 亿 · 估值 9650 亿' },
  { date: '2026 · 6月', title: '递交 IPO 申请', metric: '估值登顶 · 预计年内上市' },
];

function CaSpark({ size = 20, color = '#fff', style }) {
  const gid = React.useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 104 104" aria-hidden="true"
      style={{ filter: `drop-shadow(0 0 5px ${color}aa)`, ...style }}>
      <defs>
        <radialGradient id={gid} cx="50%" cy="50%" r="58%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="48%" stopColor="#ffffff" />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
      </defs>
      <path fill={`url(#${gid})`} d="M47.283 12.469C48.906 8.146 55.022 8.146 56.645 12.469L65.349 35.655C65.856 37.006 66.922 38.072 68.273 38.579L91.459 47.283C95.782 48.906 95.782 55.022 91.459 56.645L68.273 65.349C66.922 65.856 65.856 66.922 65.349 68.273L56.645 91.459C55.022 95.782 48.906 95.782 47.283 91.459L38.579 68.273C38.072 66.922 37.006 65.856 35.655 65.349L12.469 56.645C8.146 55.022 8.146 48.906 12.469 47.283L35.655 38.579C37.006 38.072 38.072 37.006 38.579 35.655L47.283 12.469Z" />
    </svg>
  );
}

// 自适应图片槽：读取已上传图片真实比例，反写容器 aspect-ratio（夹在 0.62–1.9）
function CaMediaSlot({ slotId, placeholder }) {
  const ref = React.useRef(null);
  const [aspect, setAspect] = React.useState('4 / 3');
  React.useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let stop = false;
    const read = () => {
      try {
        const img = host.shadowRoot && host.shadowRoot.querySelector('.frame img');
        if (host.hasAttribute('data-filled') && img && img.naturalWidth && img.naturalHeight) {
          let r = img.naturalWidth / img.naturalHeight;
          r = Math.max(0.62, Math.min(1.9, r));
          setAspect(String(r.toFixed(4)));
          return true;
        }
      } catch (e) {}
      return false;
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(host, { attributes: true, attributeFilter: ['data-filled'] });
    const iv = setInterval(() => { if (read() || stop) clearInterval(iv); }, 500);
    return () => { stop = true; mo.disconnect(); clearInterval(iv); };
  }, []);
  return (
    <div className="xhsCa-slot" style={{ aspectRatio: aspect }}>
      <image-slot ref={ref} id={slotId} fit="contain" shape="rounded" radius="18"
        placeholder={placeholder || '拖入图片'}></image-slot>
    </div>
  );
}


const SLIDE07CASE_COPY = {
  text001: "“",
};
function Slide07Case(props) {
  const {
      copy = SLIDE07CASE_COPY,
    mediaCount = 1,
    mediaLayout = 'stack',
    milestoneCount = 4,
    focusEnabled = true,
    focusIndex = 4,
    showQuote = true,
    showDecorations = true,
    // 文案
    kicker = '典型案例 · CASE STUDY',
    name = 'Anthropic',
    tagline = '从追赶到反超 · 估值登顶',
    pill = '估值 9650 亿美元 · 全球最高',
    quote = '通过 Constitutional AI 构建可解释、可控的系统，比单纯追求规模更符合长远利益。',
    quoteCite = '— Dario Amodei，CEO',
    mediaPlaceholder1 = '公司 Logo',
    mediaPlaceholder2 = '创始人 / 团队',
    // 数据
    milestones = XHSCA_MILESTONES,
  } = props;

  const media = Math.max(0, Math.min(2, mediaCount));
  const mList = Array.isArray(milestones) ? milestones : XHSCA_MILESTONES;
  const steps = mList.slice(0, Math.max(2, Math.min(mList.length, milestoneCount)));
  const focus = Math.max(1, Math.min(steps.length, focusIndex)) - 1;
  const slotPlaceholders = [mediaPlaceholder1, mediaPlaceholder2];

  return (
    <section className="xhs-base xhsCa-root" data-label="典型案例">
      <style>{XHSCA_CSS}</style>

      <div className="xhsCa-left">
        <div className="xhsCa-kicker">{kicker}</div>
        <h2 className="xhsCa-name">{name}</h2>
        <div className="xhsCa-tagline">{tagline}</div>
        <div className="xhsCa-pill" style={{ '--c': XHSCA_ACCENT }}>{pill}</div>

        {media > 0 && (
          <div className={'xhsCa-media' + (mediaLayout === 'row' ? ' is-row' : ' is-stack')}>
            {Array.from({ length: media }).map((_, i) => (
              <CaMediaSlot key={i} slotId={`xhsCa-media-${i}`} placeholder={slotPlaceholders[i]} />
            ))}
          </div>
        )}

        {showQuote && (
          <blockquote className="xhsCa-quote">
            <span className="xhsCa-quote-mark">{copy.text001}</span>
            {quote}
            <cite className="xhsCa-cite">{quoteCite}</cite>
          </blockquote>
        )}
      </div>

      <div className="xhsCa-right">
        <div className="xhsCa-timeline">
          <span className="xhsCa-axis" />
          {steps.map((m, i) => {
            const hot = focusEnabled && i === focus;
            const dim = focusEnabled && i !== focus;
            return (
              <div
                key={i}
                className={'xhsCa-node' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
                style={{ '--c': XHSCA_ACCENT }}
              >
                <span className="xhsCa-marker" />
                <div className="xhsCa-card">
                  <div className="xhsCa-date">{m.date}</div>
                  <div className="xhsCa-mtitle">{m.title}</div>
                  <div className="xhsCa-metric">{m.metric}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showDecorations && (
        <React.Fragment>
          <span aria-hidden="true" style={{ position: 'absolute', right: 96, top: 202, width: 46, height: 46, borderRadius: '50%', border: '5px solid rgba(255,255,255,.9)', boxShadow: '0 0 22px rgba(255,255,255,.22)' }} />
          <CaSpark size={24} color="#FFC700" style={{ position: 'absolute', right: 96, top: 120 }} />
          <CaSpark size={16} color="#FF9FE2" style={{ position: 'absolute', left: 60, bottom: 70 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSCA_CSS = `
  .xhsCa-root{ padding:84px 110px 70px; position:relative; display:flex; gap:74px; align-items:stretch; }

  .xhsCa-left{ width:720px; flex-shrink:0; display:flex; flex-direction:column; }
  .xhsCa-kicker{ font-family:"Space Mono",monospace; font-size:23px; letter-spacing:.14em;
    color:#7c7c7c; margin-bottom:18px; }
  .xhsCa-name{ margin:0; font-size:96px; font-weight:900; color:#fff; line-height:1; letter-spacing:-.01em; }
  .xhsCa-tagline{ margin-top:16px; font-size:30px; font-weight:700; color:#27E021; }
  .xhsCa-pill{ align-self:flex-start; margin-top:22px; font-size:24px; font-weight:800; color:#000;
    background:var(--c); padding:9px 24px; border-radius:999px;
    box-shadow:0 10px 28px color-mix(in srgb, var(--c) 34%, transparent), inset 0 2px 0 rgba(255,255,255,.6), inset 0 0 18px rgba(255,255,255,.45); }

  .xhsCa-media{ margin-top:34px; display:flex; gap:18px; }
  .xhsCa-media.is-row{ flex-direction:row; }
  .xhsCa-media.is-stack{ flex-direction:column; }
  .xhsCa-slot{ flex:1; min-width:0; width:100%; max-height:300px; border-radius:18px; overflow:hidden;
    background:#101010; border:1.5px solid rgba(255,255,255,.08); }
  .xhsCa-media.is-stack .xhsCa-slot{ max-height:240px; }
  .xhsCa-slot image-slot{ width:100%; height:100%; display:block; }

  .xhsCa-quote{ margin:auto 0 0; padding:26px 30px; position:relative;
    background:linear-gradient(160deg, rgba(39,224,33,.12), rgba(255,255,255,.02));
    border:1.5px solid color-mix(in srgb, #27E021 34%, transparent); border-radius:16px;
    font-size:25px; line-height:1.6; font-weight:600; color:#dcdcdc; }
  .xhsCa-quote-mark{ font-family:"Space Mono",monospace; font-size:46px; font-weight:700; color:#27E021;
    margin-right:6px; line-height:0; vertical-align:-12px; }
  .xhsCa-cite{ display:block; margin-top:14px; font-size:21px; font-style:normal; font-weight:700; color:#8f8f8f; }

  .xhsCa-right{ flex:1; min-width:0; display:flex; align-items:center; }
  .xhsCa-timeline{ position:relative; width:100%; display:flex; flex-direction:column; justify-content:center; gap:30px;
    padding-left:46px; }
  .xhsCa-axis{ position:absolute; left:13px; top:14px; bottom:14px; width:3px;
    background:linear-gradient(180deg, #27E021, rgba(39,224,33,.15)); border-radius:2px; }
  .xhsCa-node{ position:relative; transition:opacity .3s ease, filter .3s ease, transform .3s cubic-bezier(.2,.8,.2,1); }
  /* 深化只作用在卡片，标记圆保持不透明才能干净遮住轴线（否则线会从圆里透出） */
  .xhsCa-node.is-dim{ filter:saturate(.7); }
  .xhsCa-node.is-dim .xhsCa-card{ opacity:.5; }
  .xhsCa-marker{ position:absolute; left:-39px; top:18px; width:20px; height:20px; border-radius:50%;
    background:#0a0a0a; border:4px solid var(--c); box-sizing:border-box;
    transition:transform .3s cubic-bezier(.2,.8,.2,1), box-shadow .3s ease, background .3s ease; }
  .xhsCa-node.is-hot .xhsCa-marker{ background:var(--c); transform:scale(1.18);
    box-shadow:0 0 0 4px #000, 0 0 40px color-mix(in srgb, var(--c) 65%, transparent); }
  .xhsCa-card{ background:linear-gradient(160deg,#1a1a1a,#101010); border:1.5px solid rgba(255,255,255,.07);
    border-radius:18px; padding:22px 30px; transition:background .3s ease, border-color .3s ease, box-shadow .3s ease, transform .3s cubic-bezier(.2,.8,.2,1); }
  /* 重点突出：复用「估值 9650 亿美元」糖果胶囊的玻璃高光填充效果 */
  .xhsCa-node.is-hot .xhsCa-card{ border-color:transparent; transform:translateX(2px) scale(1.015);
    background:linear-gradient(162deg, color-mix(in srgb, var(--c) 86%, #fff) 0%, var(--c) 48%, color-mix(in srgb, var(--c) 84%, #000) 100%);
    box-shadow:0 16px 40px color-mix(in srgb, var(--c) 40%, transparent), inset 0 3px 0 rgba(255,255,255,.62), inset 0 0 26px rgba(255,255,255,.42), inset 0 -12px 24px rgba(0,0,0,.16); }
  .xhsCa-date{ font-family:"Space Mono",monospace; font-size:22px; font-weight:700; color:var(--c); }
  .xhsCa-mtitle{ margin-top:8px; font-size:34px; font-weight:900; color:#fff; }
  .xhsCa-metric{ margin-top:8px; font-size:23px; font-weight:600; color:#9e9e9e; }
  .xhsCa-node.is-hot .xhsCa-date{ color:#06140f; opacity:.72; }
  .xhsCa-node.is-hot .xhsCa-mtitle{ color:#06140f; text-shadow:0 1px 0 rgba(255,255,255,.25); }
  .xhsCa-node.is-hot .xhsCa-metric{ color:#06140f; opacity:.82; font-weight:700; }
`;

const META = {
  id: 'case',
  label: '典型案例',
  Component: Slide07Case,
  defaults: {
      copy: SLIDE07CASE_COPY,
    mediaCount: 1,
    mediaLayout: 'stack',
    milestoneCount: 4,
    focusEnabled: true,
    focusIndex: 4,
    showQuote: true,
    showDecorations: true,
    kicker: '典型案例 · CASE STUDY',
    name: 'Anthropic',
    tagline: '从追赶到反超 · 估值登顶',
    pill: '估值 9650 亿美元 · 全球最高',
    quote: '通过 Constitutional AI 构建可解释、可控的系统，比单纯追求规模更符合长远利益。',
    quoteCite: '— Dario Amodei，CEO',
    mediaPlaceholder1: '公司 Logo',
    mediaPlaceholder2: '创始人 / 团队',
    milestones: XHSCA_MILESTONES,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }], default: SLIDE07CASE_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'mediaCount', type: 'slider', label: '图片槽数量', min: 0, max: 2, step: 1, default: 1, desc: '自适应图片槽数量(按上传图片比例)' },
    { key: 'mediaLayout', type: 'radio', label: '多图排布', options: ['stack', 'row'], optionLabels: ['堆叠', '并排'], default: 'stack', showIf: (v) => v.mediaCount > 1, desc: '多张图片的排列方式' },
    { key: 'milestoneCount', type: 'slider', label: '里程碑数量', min: 2, max: 4, step: 1, default: 4, desc: '时间轴节点数量' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一里程碑' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 4, step: 1, default: 4, maxFromKey: 'milestoneCount', showIf: (v) => v.focusEnabled, desc: '被高亮里程碑的序号' },
    { key: 'showQuote', type: 'toggle', label: '引言显示', default: true, desc: '底部人物引言' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
    { type: 'section', label: '文案' },
    { key: 'kicker', type: 'text', label: '眉标', default: '典型案例 · CASE STUDY', desc: '顶部 kicker' },
    { key: 'name', type: 'text', label: '公司名', default: 'Anthropic', desc: '案例公司名' },
    { key: 'tagline', type: 'text', label: '标语', default: '从追赶到反超 · 估值登顶', desc: '公司名下标语' },
    { key: 'pill', type: 'text', label: '胶囊数据', default: '估值 9650 亿美元 · 全球最高', desc: '糖果胶囊文案' },
    { key: 'quote', type: 'textarea', label: '引言', rows: 3, default: '通过 Constitutional AI 构建可解释、可控的系统，比单纯追求规模更符合长远利益。', desc: '人物引言', showIf: (v) => v.showQuote },
    { key: 'quoteCite', type: 'text', label: '引言署名', default: '— Dario Amodei，CEO', desc: '引言署名', showIf: (v) => v.showQuote },
    { key: 'mediaPlaceholder1', type: 'text', label: '图槽 1 提示', default: '公司 Logo', desc: '第 1 个图片槽占位文案' },
    { key: 'mediaPlaceholder2', type: 'text', label: '图槽 2 提示', default: '创始人 / 团队', desc: '第 2 个图片槽占位文案' },
    { type: 'section', label: '数据 · 里程碑' },
    {
      key: 'milestones', type: 'list', label: '里程碑', itemLabel: '节点', countFromKey: 'milestoneCount',
      fields: [{ key: 'date', label: '日期' }, { key: 'title', label: '标题' }, { key: 'metric', label: '数据' }],
      default: XHSCA_MILESTONES, desc: '里程碑：日期 / 标题 / 数据',
    },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide07Case.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide07Case;
