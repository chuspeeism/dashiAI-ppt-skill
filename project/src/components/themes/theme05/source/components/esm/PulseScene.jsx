/* =========================================================================
   PulseScene — P32 page ("场景占比 / Scene Composition" archetype).
   A generic scene/share composition: a part-to-whole donut (switchable to a
   full pie) with a centered focus readout, a scene legend (value + %), an
   OPTIONAL adaptive image under the donut, and a segment eyebrow/title. The
   reusable template for "one segment → where the use-cases sit".
   Image slots are prop-driven (`images` + `onImageChange`); everything else by
   props. See PulseScene.controls for the typed, documented parameter list.
   ========================================================================= */
import React from 'react';
import PulseImageFrame from './PulseImageFrame.jsx';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "FINANCE AI",
  en: "FINANCE AI",
  title: "投研、风控与合规",
  sub: "金融 AI 赛道",
  sheet: "SCENE · 32 / 32",
  unit: "SCENE SHARE",
  scenes: [
    { name: "投研", v: 31, c: SPECTRUM[5] },
    { name: "合规", v: 28, c: SPECTRUM[0] },
    { name: "风控", v: 24, c: SPECTRUM[3] },
    { name: "客服", v: 17, c: SPECTRUM[1] },
  ],
  mediaUnit: "DROP IMAGE",
  conclusion: "高价值行业需要更强可信度。",
};

const R = 40, C = 2 * Math.PI * R;

function PulseScene(props) {
  const p = Object.assign({}, PulseScene.defaults, props);
  const accent = p.accentColor;
  const n = Math.max(2, Math.min(COPY.scenes.length, p.sceneCount));
  const scenes = COPY.scenes.slice(0, n);
  const total = scenes.reduce((a, s) => a + s.v, 0);
  const focusIdx = p.focusEnabled ? Math.min(p.focusIndex, n) - 1 : 0;
  const focus = scenes[focusIdx] || scenes[0];
  const ringW = p.chartType === "pie" ? R : 15; // pie = full radius stroke

  const nImg = Math.max(0, Math.min(1, p.imageCount));
  const images = p.images || [];
  const Frame = PulseImageFrame;
  const hasMedia = nImg > 0 && Frame;

  const isPie = p.chartType === "pie";
  // Pie = thick stroke from center (r = R/2, strokeWidth = R, circumference = πR).
  // Donut = thin ring at r = R (circumference = C).
  const ringR = isPie ? R / 2 : R;
  const ringC = isPie ? Math.PI * R : C;
  let acc = 0;

  return (
    <div className="pulse-slide pulse-scene" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-scene__body">
        <div className="pulse-scene__viz">
          <div className="pulse-scene__donut">
            <svg viewBox="0 0 100 100">
              {scenes.map((s, i) => {
                const frac = s.v / total;
                const len = frac * ringC;
                const off = -acc * ringC;
                acc += frac;
                const isFocus = p.focusEnabled && i === focusIdx;
                const w = isPie ? R : (isFocus ? 20 : 15);
                return (
                  <circle key={i} className="pulse-scene__donut-seg" cx="50" cy="50"
                    r={ringR} stroke={s.c} strokeWidth={w}
                    strokeDasharray={`${len} ${ringC - len}`} strokeDashoffset={off} />
                );
              })}
            </svg>
            {!isPie && (
              <div className="pulse-scene__donut-center">
                <div className="pulse-scene__donut-num" style={{ color: accent }}>{focus.v}%</div>
                <div className="pulse-scene__donut-cap">{focus.name}</div>
              </div>
            )}
          </div>

          {hasMedia && (
            <div className="pulse-scene__media">
              <Frame
                src={(images[0] || {}).src || null}
                ar={(images[0] || {}).ar || null}
                fill={true}
                editable={p.editable !== false}
                label="IMG.1"
                placeholder="拖入图片"
                onChange={(src, ar) => p.onImageChange && p.onImageChange(0, src, ar)}
              />
            </div>
          )}
        </div>

        <div className="pulse-scene__side">
          <div className="pulse-scene__head">
            <span className="pulse-scene__en">{COPY.en}</span>
            <span className="pulse-scene__zh">{COPY.sub}</span>
          </div>
          <div className="pulse-label" style={{ display: "flex", justifyContent: "space-between" }}>
            <span>场景占比</span><span className="pulse-mono">{COPY.unit}</span>
          </div>
          {p.showLegend && (
            <div className="pulse-scene__legend">
              {scenes.map((s, i) => {
                const isFocus = p.focusEnabled && i === focusIdx;
                return (
                  <div key={i} className={"pulse-scene__leg" + (isFocus ? " pulse-scene__leg--focus" : "")}>
                    <span className="pulse-scene__leg-dot" style={{ background: s.c }} />
                    <span className="pulse-scene__leg-name">{s.name}</span>
                    <span className="pulse-scene__leg-v">{s.v}%</span>
                  </div>
                );
              })}
            </div>
          )}
          {p.showConclusion && <div className="pulse-conclusion">{COPY.conclusion}</div>}
        </div>
      </div>
    </div>
  );
}

PulseScene.controls = [
  { key: "chartType", type: "radio", label: "图表类型", default: "donut",
    options: [{ value: "donut", label: "环形" }, { value: "pie", label: "饼图" }],
    description: "占比图呈现方式：环形（中心显示重点）/ 饼图。" },
  { key: "sceneCount", type: "slider", label: "场景数量", default: 4, min: 2, max: 4, step: 1,
    description: "参与占比拆分的场景数量。" },
  { key: "imageCount", type: "slider", label: "图片槽数量", default: 0, min: 0, max: 1, step: 1,
    description: "环图下方的图片槽（0–1），按比例自适应；为 0 时隐藏。" },
  { key: "focusEnabled", type: "toggle", label: "重点场景", default: true,
    description: "是否突出某一个场景（环形中心显示该项）。" },
  { key: "focusIndex", type: "slider", label: "重点场景序号", default: 1, min: 1, max: 4, step: 1,
    description: "被突出的场景序号（从 1 起）。" },
  { key: "showLegend", type: "toggle", label: "图例列表", default: true,
    description: "右侧带占比的场景图例。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[5], options: SPECTRUM,
    description: "眉标与环形中心数字的强调色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "右下角的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
PulseScene.defaults = PulseScene.controls.reduce(
  (o, c) => { o[c.key] = c.default; return o; }, {}
);

export default PulseScene;
export const controls = PulseScene.controls || [];
export const defaults = PulseScene.defaults || {};
