/*
 * Slide02Cards — 行业赛道卡片页（左标题 + 右侧霓虹卡片行）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks。
 * CSS 前缀 xhsCd- 。可选图片槽（image-slot）数量 0–N，按上传图片自适应比例。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  cardCount       number 卡片数量          默认 4   可选 2–4
 *  focusEnabled    bool   重点突出开关       默认 false
 *  focusIndex      number 重点项序号(从1起)  默认 1
 *  showTags        bool   底部标签显隐       默认 true
 *  showDecorations bool   装饰元素显隐       默认 true
 *  mediaCount      number 图片槽数量         默认 0   可选 0–4（从左起替换为图片卡）
 *  hlStyle         enum   标题高亮样式       默认 'glass'（玻璃糖果/扁平药丸/下划线/纯文字）
 *  hlTilt          number 高亮倾斜角度       默认 2
 *
 * 迁移：import Slide02Cards, { defaults, controls } from './Slide02Cards.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

  const XHSCD_PALETTE = ['#27E021', '#FFC700', '#FF9FE2', '#15A7F0'];
  const XHSCD_CARDS = [
  { title: '通用大模型', amount: '420 亿', share: '43.3%', note: '押注「AGI 叙事」，OpenAI / Anthropic / xAI 领跑。', tags: ['明星赛道', '资本高地'] },
  { title: '垂直应用', amount: '245 亿', share: '25.3%', note: '商业化路径渐清晰，企业搜索 / 法律 AI 落地。', tags: ['落地清晰', '隐形价值'] },
  { title: 'AI 基础设施', amount: '158 亿', share: '16.3%', note: '「卖铲子」逻辑，算力云与数据平台稀缺。', tags: ['确定性强', '卖铲子'] },
  { title: 'AI 芯片', amount: '97 亿', share: '10.0%', note: '产业链上游硬件，Cerebras / Groq 等新势力。', tags: ['上游硬件', '长周期'] }];


  function CdSpark({ size = 22, color = '#fff', style }) {
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
      </svg>);

  }

  // 自适应图片槽：读取已上传图片的真实比例，反写容器 aspect-ratio
  function CdMediaSlot({ slotId, placeholder = '拖入图片' }) {
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
      const iv = setInterval(() => {if (read() || stop) clearInterval(iv);}, 500);
      return () => {stop = true;mo.disconnect();clearInterval(iv);};
    }, []);
    return (
      <div className="xhsCd-media" style={{ aspectRatio: aspect }}>
        <image-slot ref={ref} id={slotId} fit="contain" shape="rounded" radius="16" placeholder={placeholder}></image-slot>
      </div>);

  }

  
const SLIDE02CARDS_COPY = {
  text001: "占比",
};
function Slide02Cards(props) {
    const {
      copy = SLIDE02CARDS_COPY,
      cardCount = 4,
      focusEnabled = false,
      focusIndex = 1,
      showTags = true,
      showDecorations = true,
      mediaCount = 0,
      hlStyle = 'glass',
      hlTilt = 2,
      // 文案
      kicker = '行业赛道 · 资金分布格局',
      titleLine1 = '资本高度集中',
      titleKeyword1 = '通用大模型',
      titleLead2 = '占据',
      titleKeyword2 = '近半壁江山',
      sub = '按业务类型对 97 笔 ≥1 亿美元融资归类，统计各赛道吸纳资金占比。',
      mediaPlaceholder = '拖入图片',
      // 数据
      cards = XHSCD_CARDS,
    } = props;

    const count = Math.max(2, Math.min((Array.isArray(cards) ? cards.length : 4), cardCount));
    const shown = (Array.isArray(cards) ? cards : XHSCD_CARDS).slice(0, count);
    const focus = Math.max(1, Math.min(count, focusIndex)) - 1;
    const media = Math.max(0, Math.min(count, mediaCount));

    return (
      <section className="xhs-base xhsCd-root" data-label="行业赛道">
        <style>{XHSCD_CSS}</style>

        {/* 左：标题 */}
        <div className="xhsCd-left">
          <div className="xhsCd-kicker">{kicker}</div>
          <h2 className="xhsCd-head">
            <span className="xhsCd-line">{titleLine1}</span>
            <span className="xhsCd-line">
              <HL color="#FFC700" variant={hlStyle} tilt={-hlTilt}>{titleKeyword1}</HL>
            </span>
            <span className="xhsCd-line">
              <span>{titleLead2}</span>
              <HL color="#27E021" variant={hlStyle} tilt={hlTilt}>{titleKeyword2}</HL>
            </span>
          </h2>
          <p className="xhsCd-sub">{sub}</p>
          {showDecorations && <CdSpark size={26} color="#FF9FE2" style={{ marginTop: 18 }} />}
        </div>

        {/* 右：卡片行 */}
        <div className="xhsCd-row" style={{ '--n': count }}>
          {shown.map((c, i) => {
            const color = XHSCD_PALETTE[i % XHSCD_PALETTE.length];
            const dim = focusEnabled && i !== focus;
            const hot = focusEnabled && i === focus;
            const hasMedia = i < media;
            const tags = Array.isArray(c.tags) ? c.tags : String(c.tags || '').split(/[，,、\s]+/).filter(Boolean);
            return (
              <article
                key={i}
                className={'xhsCd-card' + (dim ? ' is-dim' : '') + (hot ? ' is-hot' : '')}
                style={{ '--c': color }}>
                
                {hasMedia && <CdMediaSlot slotId={`xhsCd-media-${i}`} placeholder={mediaPlaceholder} />}
                <h3 className="xhsCd-name">{c.title}</h3>
                <div className="xhsCd-metric">
                  <span className="xhsCd-amt">{c.amount}</span>
                  <span className="xhsCd-share">{copy.text001}{c.share}</span>
                </div>
                <p className="xhsCd-note">{c.note}</p>
                {showTags &&
                <div className="xhsCd-tags">
                    {tags.map((t, k) =>
                  <span key={k} className="xhsCd-chip">{t}</span>
                  )}
                  </div>
                }
              </article>);

          })}
        </div>

        {showDecorations &&
        <span aria-hidden="true" style={{ position: 'absolute', right: 90, top: 232, width: 46, height: 46, borderRadius: '50%', border: '5px solid rgba(255,255,255,.9)', boxShadow: '0 0 22px rgba(255,255,255,.22)' }} />
        }
        {showDecorations &&
        <CdSpark size={18} color="#15A7F0" style={{ position: 'absolute', right: 90, top: 150 }} />
        }
      </section>);

  }

  const XHSCD_CSS = `
  .xhsCd-root{ padding:96px 110px; position:relative; display:flex; gap:60px; align-items:center; }

  .xhsCd-left{ width:520px; flex-shrink:0; }
  .xhsCd-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em;
    color:#7c7c7c; margin-bottom:30px; }
  .xhsCd-head{ margin:0; font-weight:900; font-size:62px; line-height:1.08; color:#fff;
    display:flex; flex-direction:column; gap:30px; align-items:flex-start; }
  .xhsCd-line{ display:flex; align-items:center; gap:18px; }
  .xhsCd-sub{ margin:40px 0 0; font-size:26px; line-height:1.6; color:#9a9a9a; font-weight:500; max-width:520px; }

  .xhsCd-row{ flex:1; display:grid; grid-template-columns:repeat(var(--n),1fr); gap:26px; padding-top:6px; }
  .xhsCd-card{ position:relative; border-radius:22px; padding:26px 24px 22px;
    background:linear-gradient(168deg, color-mix(in srgb, var(--c) 94%, #fff) 0%, var(--c) 42%, color-mix(in srgb, var(--c) 72%, #000) 100%);
    color:#000; display:flex; flex-direction:column; gap:16px; align-self:start;
    box-shadow:0 18px 38px rgba(0,0,0,.5), 0 0 50px color-mix(in srgb, var(--c) 18%, transparent),
      inset 0 2px 0 rgba(255,255,255,.45);
    transition:transform .3s cubic-bezier(.2,.8,.2,1), opacity .3s ease, filter .3s ease; }
  .xhsCd-card.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsCd-card.is-hot{ transform:translateY(-14px) scale(1.04);
    box-shadow:0 32px 64px rgba(0,0,0,.7), 0 0 100px color-mix(in srgb, var(--c) 55%, transparent),
      inset 0 2px 0 rgba(255,255,255,.5); }
  .xhsCd-media{ width:100%; border-radius:16px; overflow:hidden; background:rgba(0,0,0,.12); }
  .xhsCd-media image-slot{ width:100%; height:100%; display:block; }
  .xhsCd-name{ margin:0; font-size:28px; font-weight:900; letter-spacing:.01em;
    padding-bottom:13px; border-bottom:2px solid rgba(0,0,0,.18); }
  .xhsCd-metric{ display:flex; flex-direction:column; align-items:flex-start; gap:9px; margin-top:-2px; }
  .xhsCd-amt{ font-size:54px; font-weight:900; line-height:.95; white-space:nowrap; }
  .xhsCd-share{ font-size:20px; font-weight:800; background:rgba(0,0,0,.18); padding:5px 14px;
    border-radius:999px; align-self:flex-start; white-space:nowrap; }
  .xhsCd-note{ margin:0; font-size:20px; line-height:1.5; font-weight:500; color:rgba(0,0,0,.62); }
  .xhsCd-tags{ display:flex; flex-wrap:wrap; gap:10px; margin-top:auto; padding-top:8px; }
  .xhsCd-chip{ background:#0a0a0a; color:var(--c); font-size:19px; font-weight:700;
    padding:7px 15px; border-radius:999px; box-shadow:0 4px 12px rgba(0,0,0,.3); }
  `;

  const META = {
    id: 'cards',
    label: '行业赛道',
    Component: Slide02Cards,
    defaults: {
      copy: SLIDE02CARDS_COPY,
      ...hlDefaults,
      cardCount: 4,
      focusEnabled: false,
      focusIndex: 1,
      showTags: true,
      showDecorations: true,
      mediaCount: 0,
      kicker: '行业赛道 · 资金分布格局',
      titleLine1: '资本高度集中',
      titleKeyword1: '通用大模型',
      titleLead2: '占据',
      titleKeyword2: '近半壁江山',
      sub: '按业务类型对 97 笔 ≥1 亿美元融资归类，统计各赛道吸纳资金占比。',
      mediaPlaceholder: '拖入图片',
      cards: XHSCD_CARDS,
    },
    controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }], default: SLIDE02CARDS_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    ...hlControls,
    { key: 'cardCount', type: 'slider', label: '卡片数量', min: 2, max: 4, step: 1, default: 4, desc: '赛道卡片数量' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: false, desc: '是否高亮某一张卡片' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 4, step: 1, default: 1, maxFromKey: 'cardCount', showIf: (v) => v.focusEnabled, desc: '被高亮卡片的序号' },
    { key: 'mediaCount', type: 'slider', label: '图片槽数量', min: 0, max: 4, step: 1, default: 0, maxFromKey: 'cardCount', desc: '从左起 N 张卡片加入自适应图片槽' },
    { key: 'showTags', type: 'toggle', label: '底部标签', default: true, desc: '卡片底部小标签' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
    { type: 'section', label: '文案' },
    { key: 'kicker', type: 'text', label: '眉标', default: '行业赛道 · 资金分布格局', desc: '顶部 kicker' },
    { key: 'titleLine1', type: 'text', label: '标题首行', default: '资本高度集中', desc: '标题第一行' },
    { key: 'titleKeyword1', type: 'text', label: '关键词 1', default: '通用大模型', desc: '高亮关键词(黄)' },
    { key: 'titleLead2', type: 'text', label: '第三行前缀', default: '占据', desc: '第三行关键词前文' },
    { key: 'titleKeyword2', type: 'text', label: '关键词 2', default: '近半壁江山', desc: '高亮关键词(绿)' },
    { key: 'sub', type: 'textarea', label: '副标题', rows: 2, default: '按业务类型对 97 笔 ≥1 亿美元融资归类，统计各赛道吸纳资金占比。', desc: '标题下方说明' },
    { key: 'mediaPlaceholder', type: 'text', label: '图片槽提示', default: '拖入图片', desc: '图片槽占位文案' },
    { type: 'section', label: '数据 · 赛道卡' },
    {
      key: 'cards', type: 'list', label: '赛道卡', itemLabel: '卡片', countFromKey: 'cardCount',
      fields: [{ key: 'title', label: '标题' }, { key: 'amount', label: '金额' }, { key: 'share', label: '占比' }, { key: 'note', label: '说明' }, { key: 'tags', label: '标签(逗号分隔)' }],
      default: XHSCD_CARDS, desc: '赛道卡：标题 / 金额 / 占比 / 说明 / 标签',
    }]

  };

  META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide02Cards.defaultProps = defaultProps;
export const defaults = META.defaults;
  export const controls = META.controls;
  export const meta = META;
  export default Slide02Cards;