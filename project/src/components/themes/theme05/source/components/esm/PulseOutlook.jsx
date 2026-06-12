/* =========================================================================
   PulseOutlook — P13 timeline page ("对比 + 阶段时间轴 / Compare + Timeline").
   A generic "two-sided compare + horizontal phase timeline" slide:
     · two compare columns (e.g. 看好 / 谨慎), each a list of items;
     · a bottom phase timeline with N nodes and an optional focus marker.
   Self-contained: React + .pulse-* CSS only. Controlled entirely by props.
   See PulseOutlook.controls for the typed, documented parameter list.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "INVESTMENT OUTLOOK",
  title: "投资建议与阶段性策略",
  sheet: "OUTLOOK · 13 / 32",
  columns: [
    {
      zh: "看好方向", en: "OVERWEIGHT", sign: "＋",
      items: [
        { name: "垂直应用",     note: "嵌入刚性工作流，看付费留存与席位扩张" },
        { name: "基础设施",     note: "GPU 云与数据底座，最接近刚性预算" },
        { name: "具身智能",     note: "长周期硬科技，看供应链与量产能力" },
        { name: "数据平台",     note: "存量客户优势，商业化路径更短" },
      ],
    },
    {
      zh: "谨慎方向", en: "UNDERWEIGHT", sign: "－",
      items: [
        { name: "高估值纯模型", note: "叙事先行，后续兑现压力较高" },
        { name: "AI 包装项目",  note: "缺乏数据与工作流壁垒，易被商品化" },
        { name: "低壁垒消费应用", note: "留存与付费意愿仍待长期验证" },
        { name: "同质化工具",   note: "竞争拥挤，差异化与定价权不足" },
      ],
    },
  ],
  timelineCap: "阶段性观察 · 2024 → 2027",
  timeline: [
    { year: "2024", label: "资本大年", note: "970 亿美元 · 97 笔" },
    { year: "2025", label: "观察兑现", note: "IPO 窗口逐步开启" },
    { year: "2026", label: "收入验证", note: "看收入与毛利曲线" },
    { year: "2027", label: "格局定型", note: "兑现分化决定胜负" },
  ],
  conclusion: "看融资只是起点，看兑现才是判断。",
};

function PulseOutlook(props) {
  const p = Object.assign({}, PulseOutlook.defaults, props);
  const accent = p.accentColor;
  const nItems = Math.max(2, Math.min(4, p.listItemCount));
  const nNodes = Math.max(2, Math.min(COPY.timeline.length, p.timelineNodeCount));
  const colColors = [p.leftColor, p.rightColor];

  return (
    <div className="pulse-slide pulse-outlook" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-outlook__body">
        <div className="pulse-outlook__cols">
          {COPY.columns.map((col, ci) => {
            const c = colColors[ci] || SPECTRUM[3];
            return (
              <div className="pulse-cmp" key={ci}>
                <div className="pulse-cmp__head" style={{ background: c }}>
                  <div className="pulse-cmp__head-l">
                    <span className="pulse-cmp__sign">{col.sign}</span>
                    <span className="pulse-cmp__head-zh">{col.zh}</span>
                    <span className="pulse-cmp__head-en">{col.en}</span>
                  </div>
                  <span className="pulse-cmp__count">{String(nItems).padStart(2, "0")} 项</span>
                </div>
                <div className="pulse-cmp__list">
                  {col.items.slice(0, nItems).map((it, i) => (
                    <div className="pulse-cmp__item" key={i}>
                      <span className="pulse-cmp__item-mark" style={{ background: c }} />
                      <div className="pulse-cmp__item-body">
                        <div className="pulse-cmp__item-name">{it.name}</div>
                        <div className="pulse-cmp__item-note">{it.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {p.showTimeline && (
          <div className="pulse-timeline">
            <div className="pulse-timeline__cap">
              <span className="pulse-label">{COPY.timelineCap}</span>
              <span className="pulse-mono">PHASE TIMELINE</span>
            </div>
            <div className="pulse-timeline__row">
              {COPY.timeline.slice(0, nNodes).map((nd, i) => {
                const focus = p.focusEnabled && i + 1 === p.focusIndex;
                return (
                  <div className={"pulse-tl__node" + (focus ? " pulse-tl__node--focus" : "")} key={i}>
                    <span className="pulse-tl__node-line" />
                    <span className="pulse-tl__node-dot" />
                    <div className="pulse-tl__year">{nd.year}</div>
                    <div className="pulse-tl__label">{nd.label}</div>
                    <div className="pulse-tl__note">{nd.note}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {p.showConclusion && (
          <div className="pulse-conclusion pulse-outlook__concl">{COPY.conclusion}</div>
        )}
      </div>
    </div>
  );
}

PulseOutlook.controls = [
  { key: "listItemCount", type: "slider", label: "每栏条目数", default: 3, min: 2, max: 4, step: 1,
    description: "左右对比栏各自显示的条目数量。" },
  { key: "showTimeline", type: "toggle", label: "阶段时间轴", default: true,
    description: "是否显示底部的横向阶段时间轴。" },
  { key: "timelineNodeCount", type: "slider", label: "时间轴节点数", default: 4, min: 2, max: 4, step: 1,
    description: "时间轴上的阶段节点数量。" },
  { key: "focusEnabled", type: "toggle", label: "重点节点", default: true,
    description: "是否突出某一个时间轴节点。" },
  { key: "focusIndex", type: "slider", label: "重点节点序号", default: 2, min: 1, max: 4, step: 1,
    description: "被突出的时间轴节点序号（从 1 起）。" },
  { key: "leftColor", type: "color", label: "左栏色", default: SPECTRUM[3], options: SPECTRUM,
    description: "左侧对比栏的标题条颜色。" },
  { key: "rightColor", type: "color", label: "右栏色", default: SPECTRUM[0], options: SPECTRUM,
    description: "右侧对比栏的标题条颜色。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
    description: "眉标与时间轴重点节点的强调色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
PulseOutlook.defaults = PulseOutlook.controls.reduce(
  (o, c) => { o[c.key] = c.default; return o; }, {}
);

export default PulseOutlook;
export const controls = PulseOutlook.controls || [];
export const defaults = PulseOutlook.defaults || {};
