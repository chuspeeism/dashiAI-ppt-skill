import React from 'react';
import { normalizeRuntimePages } from '../runtime-helpers.jsx';
import { SlideCoverDusk } from './source/slides/SlideCoverDusk.jsx';
import { SlideCoverField } from './source/slides/SlideCoverField.jsx';
import { SlideCoverAtmosType } from './source/slides/SlideCoverAtmosType.jsx';
import { SlideCoverHorizon } from './source/slides/SlideCoverHorizon.jsx';
import { Slide01Cover } from './source/slides/Slide01Cover.jsx';
import { SlideChapterIndex } from './source/slides/SlideChapterIndex.jsx';
import { Slide02Metrics } from './source/slides/Slide02Metrics.jsx';
import { SlideSpectrum } from './source/slides/SlideSpectrum.jsx';
import { SlideQuadrant } from './source/slides/SlideQuadrant.jsx';
import { SlideLedger } from './source/slides/SlideLedger.jsx';
import { Slide03Allocation } from './source/slides/Slide03Allocation.jsx';
import { SlideStacked } from './source/slides/SlideStacked.jsx';
import { SlideTreemap } from './source/slides/SlideTreemap.jsx';
import { SlideMarimekko } from './source/slides/SlideMarimekko.jsx';
import { SlideGrouped } from './source/slides/SlideGrouped.jsx';
import { SlideOrbit } from './source/slides/SlideOrbit.jsx';
import { SlidePlans } from './source/slides/SlidePlans.jsx';
import { SlideVersus } from './source/slides/SlideVersus.jsx';
import { SlideCompareMatrix } from './source/slides/SlideCompareMatrix.jsx';
import { SlideSlope } from './source/slides/SlideSlope.jsx';
import { SlideGoals } from './source/slides/SlideGoals.jsx';
import { SlideBullet } from './source/slides/SlideBullet.jsx';
import { SlideProfile } from './source/slides/SlideProfile.jsx';
import { SlideTeam } from './source/slides/SlideTeam.jsx';
import { SlideDashboard } from './source/slides/SlideDashboard.jsx';
import { SlideWaterfall } from './source/slides/SlideWaterfall.jsx';
import { SlideCurve } from './source/slides/SlideCurve.jsx';
import { SlideAreaStack } from './source/slides/SlideAreaStack.jsx';
import { SlideDistribution } from './source/slides/SlideDistribution.jsx';
import { SlideLadder } from './source/slides/SlideLadder.jsx';
import { SlideTimeline } from './source/slides/SlideTimeline.jsx';
import { SlideGantt } from './source/slides/SlideGantt.jsx';
import { SlideSteps } from './source/slides/SlideSteps.jsx';
import { SlideFunnel } from './source/slides/SlideFunnel.jsx';
import { SlideCycle } from './source/slides/SlideCycle.jsx';
import { SlideSwimlane } from './source/slides/SlideSwimlane.jsx';
import { SlidePrinciples } from './source/slides/SlidePrinciples.jsx';
import { SlideDivider } from './source/slides/SlideDivider.jsx';
import { SlideQuote } from './source/slides/SlideQuote.jsx';
import { SlideEditorial } from './source/slides/SlideEditorial.jsx';
import { SlideMagazine } from './source/slides/SlideMagazine.jsx';
import { SlideTriptych } from './source/slides/SlideTriptych.jsx';
import { SlideStrata } from './source/slides/SlideStrata.jsx';
import { SlideSpark } from './source/slides/SlideSpark.jsx';
import { SlideTestimonials } from './source/slides/SlideTestimonials.jsx';
import { SlideFeature } from './source/slides/SlideFeature.jsx';
import { SlideCompareImage } from './source/slides/SlideCompareImage.jsx';
import { SlidePinboard } from './source/slides/SlidePinboard.jsx';
import { SlideFilmstrip } from './source/slides/SlideFilmstrip.jsx';
import { SlideInset } from './source/slides/SlideInset.jsx';
import { SlideCoverDawn } from './source/slides/SlideCoverDawn.jsx';
import { SlideSectionStatement } from './source/slides/SlideSectionStatement.jsx';
import { SlideStatement } from './source/slides/SlideStatement.jsx';
import { Slide04Gallery } from './source/slides/Slide04Gallery.jsx';
import { SlideFAQ } from './source/slides/SlideFAQ.jsx';
import { SlideBigStat } from './source/slides/SlideBigStat.jsx';
import { SlideMegaFigure } from './source/slides/SlideMegaFigure.jsx';
import { SlideScatter } from './source/slides/SlideScatter.jsx';
import { SlideDiverging } from './source/slides/SlideDiverging.jsx';
import { SlideRange } from './source/slides/SlideRange.jsx';
import { SlidePolar } from './source/slides/SlidePolar.jsx';
import { SlideHeatmap } from './source/slides/SlideHeatmap.jsx';
import { SlideRadar } from './source/slides/SlideRadar.jsx';
import { SlideCartogram } from './source/slides/SlideCartogram.jsx';
import { SlideBoard } from './source/slides/SlideBoard.jsx';
import { SlideRanking } from './source/slides/SlideRanking.jsx';
import { SlideFlow } from './source/slides/SlideFlow.jsx';
import { SlideJourney } from './source/slides/SlideJourney.jsx';
import { SlideCalendar } from './source/slides/SlideCalendar.jsx';
import { SlideMosaic } from './source/slides/SlideMosaic.jsx';
import { SlideChecklist } from './source/slides/SlideChecklist.jsx';
import { SlideCandles } from './source/slides/SlideCandles.jsx';
import { SlideSankey } from './source/slides/SlideSankey.jsx';
import { SlideMeter } from './source/slides/SlideMeter.jsx';
import { SlideSchedule } from './source/slides/SlideSchedule.jsx';
import { SlideCollage } from './source/slides/SlideCollage.jsx';
import { SlideCaptioned } from './source/slides/SlideCaptioned.jsx';
import { SlideShowcase } from './source/slides/SlideShowcase.jsx';
import { SlidePoster } from './source/slides/SlidePoster.jsx';
import { SlideIsotype } from './source/slides/SlideIsotype.jsx';
import { SlideBump } from './source/slides/SlideBump.jsx';
import { SlidePyramid } from './source/slides/SlidePyramid.jsx';
import { SlideRadialStack } from './source/slides/SlideRadialStack.jsx';
import { SlideAnnotated } from './source/slides/SlideAnnotated.jsx';
import { SlideQuoteImage } from './source/slides/SlideQuoteImage.jsx';
import { SlideVenn } from './source/slides/SlideVenn.jsx';
import { SlideBalance } from './source/slides/SlideBalance.jsx';
import { SlideTornado } from './source/slides/SlideTornado.jsx';
import { SlideStream } from './source/slides/SlideStream.jsx';
import { SlideQuilt } from './source/slides/SlideQuilt.jsx';
import { SlideHive } from './source/slides/SlideHive.jsx';
import { SlideExhibit } from './source/slides/SlideExhibit.jsx';
import { SlideMedallions } from './source/slides/SlideMedallions.jsx';
import { SlideGlossary } from './source/slides/SlideGlossary.jsx';
import { SlideClosing } from './source/slides/SlideClosing.jsx';

const THEME10_BASE_CSS = "@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500&family=Noto+Sans+SC:wght@300;400;500&display=swap');\n.deck-theme,.deck-theme *{box-sizing:border-box;}\n@keyframes ds-rise{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:none;}}\n  @keyframes ds-fadein{from{opacity:0;}to{opacity:1;}}\n  @media (prefers-reduced-motion:no-preference){\n    [data-deck-active] .ds-anim{\n      animation:ds-rise 640ms cubic-bezier(.22,.61,.36,1) both;\n      animation-delay:var(--ds-d,0ms);will-change:opacity,transform;}\n    [data-deck-active] .ds-fade{\n      animation:ds-fadein 720ms ease both;\n      animation-delay:var(--ds-d,0ms);will-change:opacity;}\n  }\n\n.deck-theme{\n    --ds-bg:radial-gradient(120% 95% at 86% -8%, rgba(92,128,234,.26) 0%, rgba(92,128,234,0) 52%), radial-gradient(115% 95% at -2% 108%, rgba(199,144,98,.24) 0%, rgba(199,144,98,0) 54%), linear-gradient(157deg,#13161d 0%,#0c0d11 56%,#090a0d 100%);\n    --ds-bg-soft:#16181d;\n    --ds-panel:#f3f3f0;\n    --ds-panel-ink:#101216;\n    --ds-ink:#f2f3f6;\n    --ds-muted:rgba(242,243,246,.74);\n    --ds-faint:rgba(242,243,246,.54);\n    --ds-line:rgba(242,243,246,.2);\n    --ds-card:rgba(255,255,255,.06);\n    --ds-accent:#5479e8;\n    --ds-accent-2:#8fa8e6;\n    /* Categorical series palette — a harmonious cool→warm sweep along the brand's\n       own blue→copper axis (plus one periwinkle) so multi-series charts get\n       variety without leaving the family. Tuned luminous for near-black bg. */\n    --ds-c1:#5b80ea;\n    --ds-c2:#46a6d0;\n    --ds-c3:#3fb39a;\n    --ds-c4:#d7a85b;\n    --ds-c5:#d27d58;\n    --ds-c6:#9a82dc;\n    /* Soft (translucent) companions for fills/areas/cells. */\n    --ds-c1-soft:rgba(91,128,234,.22);\n    --ds-c2-soft:rgba(70,166,208,.22);\n    --ds-c3-soft:rgba(63,179,154,.22);\n    --ds-c4-soft:rgba(215,168,91,.22);\n    --ds-c5-soft:rgba(210,125,88,.22);\n    --ds-c6-soft:rgba(154,130,220,.22);\n    /* Vertical gradient for hero bars/areas — accent deepening downward. */\n    --ds-grad-bar:linear-gradient(180deg,#6f93ef 0%,#5479e8 52%,#3f57b8 100%);\n    --ds-grad-cool:linear-gradient(120deg,#5b80ea 0%,#46a6d0 50%,#3fb39a 100%);\n    --ds-grad-warm:linear-gradient(120deg,#d7a85b 0%,#d27d58 100%);\n    /* warm blue→copper gradient kept for cover / section card backgrounds */\n    --ds-grad:linear-gradient(118deg,#1c2740 0%,#33405c 28%,#6f5a4c 66%,#c8966b 100%);\n    --ds-grad-soft:linear-gradient(118deg,rgba(51,64,92,.32) 0%,rgba(111,90,76,.30) 60%,rgba(200,150,107,.34) 100%);\n    --font-mono:'IBM Plex Mono',ui-monospace,SFMono-Regular,monospace;\n    --font-sans:'IBM Plex Sans','Noto Sans SC',system-ui,-apple-system,sans-serif;\n    /* slide frame scale (1920×1080) */\n    --pad-x:120px;\n    --pad-y:96px;\n  }\n\n  /* Light surface: overrides the token set locally so any token-driven slide flips\n     to a warm off-white with dark ink. Applied by the controller via a wrapper. */\n  .deck-theme.tone-light{\n    --ds-bg:radial-gradient(110% 90% at 90% -6%, rgba(98,130,192,.22) 0%, rgba(98,130,192,0) 52%), radial-gradient(110% 90% at 0% 108%, rgba(199,144,98,.26) 0%, rgba(199,144,98,0) 54%), linear-gradient(157deg,#f5f4f0 0%,#ece9e3 100%);\n    --ds-bg-soft:#e4e3de;\n    --ds-ink:#15161a;\n    --ds-muted:rgba(21,22,26,.62);\n    --ds-faint:rgba(21,22,26,.42);\n    --ds-line:rgba(21,22,26,.13);\n    --ds-card:rgba(21,22,26,.05);\n    --ds-panel:#15161a;\n    --ds-panel-ink:#f1f0ec;\n    --ds-accent:#3457c4;\n    --ds-accent-2:#5d7fc8;\n    --ds-c1:#3a5fc8;\n    --ds-c2:#1f86ad;\n    --ds-c3:#1f9277;\n    --ds-c4:#b5852f;\n    --ds-c5:#bd6236;\n    --ds-c6:#7459bf;\n    --ds-c1-soft:rgba(58,95,200,.18);\n    --ds-c2-soft:rgba(31,134,173,.18);\n    --ds-c3-soft:rgba(31,146,119,.18);\n    --ds-c4-soft:rgba(181,133,47,.18);\n    --ds-c5-soft:rgba(189,98,54,.18);\n    --ds-c6-soft:rgba(116,89,191,.18);\n    --ds-grad-bar:linear-gradient(180deg,#4a6dd0 0%,#3457c4 52%,#283f93 100%);\n    --ds-grad-cool:linear-gradient(120deg,#3a5fc8 0%,#1f86ad 50%,#1f9277 100%);\n    --ds-grad-warm:linear-gradient(120deg,#b5852f 0%,#bd6236 100%);\n    --ds-grad:linear-gradient(118deg,#2b3650 0%,#4a4a52 30%,#8a6849 68%,#bd824a 100%);\n  }\n  .ds-slidewrap{width:100%;height:100%;}\n";
const THEMED = new Set(['coverdusk', 'coverfield', 'coveratmostype', 'coverhorizon', 'coverdawn', 'cover', 'chapter', 'sectionstatement', 'quote', 'imagequote', 'fullimg', 'statement', 'bigstat', 'closing', 'showcase', 'poster', 'megafigure', 'divider']);
const TONE_DEFAULTS = { ledger: 'light', plans: 'light', principles: 'light', spark: 'light', journey: 'light', capmatrix: 'light', funnel: 'light', checklist: 'light', grouped: 'light', swimlane: 'light', schedule: 'light', pyramid: 'light', glossary: 'light', spectrum: 'light', allocation: 'light', bullet: 'light', team: 'light', steps: 'light', editorial: 'light', magazine: 'light', feature: 'light', faq: 'light', heatmap: 'light', exhibit: 'light', dumbbell: 'light', slope: 'light', curve: 'light', waterfall: 'light', gantt: 'light', ranking: 'light', calendar: 'light', radar: 'light', meter: 'light', mosaic: 'light', cartogram: 'light', board: 'light' };
const TONE_CONTROL = { key: 'tone', type: 'radio', label: '页面底色', default: 'dark', options: [['dark', '深色'], ['light', '浅色']], description: '整页深色或浅色底。' };
const SECTION_LABELS = [
  "暮光对角",
  "渐变色场分栏",
  "满版渐变大字",
  "地平线渐变",
  "封面",
  "章节索引",
  "核心数据",
  "风险光谱",
  "策略象限",
  "账本表",
  "配置明细",
  "构成对比",
  "占比树图",
  "份额矩阵",
  "分组柱图",
  "核心卫星",
  "方案对照",
  "抉择双栏",
  "能力对照",
  "排名变化",
  "目标进度",
  "目标子弹图",
  "人物特写",
  "团队墙",
  "数据仪表盘",
  "收益归因",
  "净值曲线",
  "堆叠面积",
  "收益分布",
  "复利阶梯",
  "横向时间轴",
  "排期甘特",
  "运作机制",
  "转化漏斗",
  "闭环循环",
  "职责泳道",
  "投资原则",
  "序号分章",
  "引言",
  "编排图文",
  "杂志图文",
  "三联影像",
  "横向影像带",
  "持仓小图集",
  "客户实证",
  "图文特写",
  "图像对照",
  "影像贴墙",
  "影像长卷",
  "满版角嵌",
  "晨光卡",
  "宣言章节",
  "声明金句",
  "影像集",
  "常见问题",
  "大字指标",
  "巨幅数字",
  "风险气泡",
  "年度盈亏",
  "区间对比",
  "极坐标花瓣",
  "相关性热力",
  "因子雷达",
  "区域敞口",
  "行情板",
  "排行榜",
  "资金流向",
  "旅程进度",
  "回报日历",
  "图文马赛克",
  "行动清单",
  "K线蜡烛",
  "资金桑基",
  "半环量规",
  "条款明细",
  "拼贴影像",
  "图注精读",
  "沉浸大图",
  "主视觉海报",
  "象形占比",
  "名次走势",
  "财富金字塔",
  "同心环",
  "标注影像",
  "影像金句",
  "策略交集",
  "权衡天平",
  "敏感性分析",
  "主题河流",
  "资产拼花",
  "蜂窝指标",
  "标的档案",
  "影像勋章",
  "名词释义",
  "结束"
];
const SLIDES = [
  { C: SlideCoverDusk,        id: 'coverdusk' },      // NEW6 · 暮光对角封面
  { C: SlideCoverField,       id: 'coverfield' },     // NEW6 · 渐变色场分栏封面
  { C: SlideCoverAtmosType,   id: 'coveratmostype' }, // NEW6 · 满版渐变大字封面
  { C: SlideCoverHorizon,     id: 'coverhorizon' },   // NEW6 · 地平线渐变封面
  { C: Slide01Cover,          id: 'cover' },
  { C: SlideChapterIndex,     id: 'chapter' },
  { C: Slide02Metrics,        id: 'metrics' },
  { C: SlideSpectrum,         id: 'spectrum' },
  { C: SlideQuadrant,         id: 'quadrant' },
  { C: SlideLedger,           id: 'ledger' },
  { C: Slide03Allocation,     id: 'allocation' },
  { C: SlideStacked,          id: 'stacked' },
  { C: SlideTreemap,          id: 'treemap' },     // NEW · 占比树图
  { C: SlideMarimekko,        id: 'mekko' },        // NEW2 · 份额矩阵
  { C: SlideGrouped,          id: 'grouped' },      // NEW · 分组柱图
  { C: SlideOrbit,            id: 'orbit' },        // NEW · 核心卫星
  { C: SlidePlans,            id: 'plans' },
  { C: SlideVersus,           id: 'versus' },       // NEW · 抉择双栏
  { C: SlideCompareMatrix,    id: 'capmatrix' },     // NEW · 能力对照
  { C: SlideSlope,            id: 'slope' },         // NEW · 排名变化
  { C: SlideGoals,            id: 'goals' },         // NEW · 目标进度
  { C: SlideBullet,           id: 'bullet' },        // NEW · 目标子弹图
  { C: SlideProfile,          id: 'profile' },
  { C: SlideTeam,             id: 'team' },          // NEW · 团队墙
  { C: SlideDashboard,        id: 'dashboard' },
  { C: SlideWaterfall,        id: 'waterfall' },
  { C: SlideCurve,            id: 'curve' },         // NEW · 净值曲线
  { C: SlideAreaStack,        id: 'areastack' },     // NEW · 堆叠面积
  { C: SlideDistribution,     id: 'distribution' },  // NEW · 收益分布
  { C: SlideLadder,           id: 'ladder' },       // NEW · 复利阶梯
  { C: SlideTimeline,         id: 'timeline' },
  { C: SlideGantt,            id: 'gantt' },         // NEW · 排期甘特
  { C: SlideSteps,            id: 'steps' },         // NEW · 运作机制
  { C: SlideFunnel,           id: 'funnel' },        // NEW · 转化漏斗
  { C: SlideCycle,            id: 'cycle' },         // NEW · 闭环循环
  { C: SlideSwimlane,         id: 'swimlane' },      // NEW · 职责泳道
  { C: SlidePrinciples,       id: 'principles' },
  { C: SlideDivider,          id: 'divider' },      // NEW2 · 序号分章
  { C: SlideQuote,            id: 'quote' },
  { C: SlideEditorial,        id: 'editorial' },
  { C: SlideMagazine,         id: 'magazine' },      // NEW · 杂志图文
  { C: SlideTriptych,         id: 'triptych' },      // NEW · 三联影像
  { C: SlideStrata,           id: 'strata' },        // NEW2 · 横向影像带
  { C: SlideSpark,            id: 'spark' },         // NEW · 持仓小图集
  { C: SlideTestimonials,     id: 'testimonials' },
  { C: SlideFeature,          id: 'feature' },
  { C: SlideCompareImage,     id: 'compareimg' },
  { C: SlidePinboard,         id: 'pinboard' },      // NEW2 · 影像贴墙
  { C: SlideFilmstrip,        id: 'filmstrip' },     // NEW · 影像长卷
  { C: SlideInset,            id: 'inset' },         // NEW2 · 满版角嵌
  { C: SlideCoverDawn,        id: 'coverdawn' },      // NEW5 · 晨光卡封面
  { C: SlideSectionStatement, id: 'sectionstatement' },
  { C: SlideStatement,        id: 'statement' },
  { C: Slide04Gallery,        id: 'gallery2', content: { /* gallery instance */ } },
  { C: SlideFAQ,              id: 'faq' },
  { C: SlideBigStat,          id: 'bigstat' },
  { C: SlideMegaFigure,       id: 'megafigure' },   // NEW2 · 巨幅数字
  { C: SlideScatter,          id: 'scatter' },
  { C: SlideDiverging,        id: 'diverging' },     // NEW · 年度盈亏
  { C: SlideRange,            id: 'range' },         // NEW · 区间对比
  { C: SlidePolar,            id: 'polar' },         // NEW · 极坐标花瓣
  { C: SlideHeatmap,          id: 'heatmap' },
  { C: SlideRadar,            id: 'radar' },
  { C: SlideCartogram,        id: 'cartogram' },     // NEW · 区域敞口
  { C: SlideBoard,            id: 'board' },
  { C: SlideRanking,          id: 'ranking' },      // NEW2 · 排行榜
  { C: SlideFlow,             id: 'flow' },
  { C: SlideJourney,          id: 'journey' },       // NEW · 旅程进度
  { C: SlideCalendar,         id: 'calendar' },
  { C: SlideMosaic,           id: 'mosaic' },
  { C: SlideChecklist,        id: 'checklist' },     // NEW · 行动清单
  { C: SlideCandles,          id: 'candles' },       // NEW · K线蜡烛
  { C: SlideSankey,           id: 'sankey' },        // NEW · 资金桑基
  { C: SlideMeter,            id: 'meter' },         // NEW · 半环量规
  { C: SlideSchedule,         id: 'schedule' },      // NEW · 条款明细
  { C: SlideCollage,          id: 'collage' },       // NEW · 拼贴影像
  { C: SlideCaptioned,        id: 'captioned' },     // NEW · 图注精读
  { C: SlideShowcase,         id: 'showcase' },      // NEW · 沉浸大图
  { C: SlidePoster,           id: 'poster' },        // NEW · 主视觉海报
  { C: SlideIsotype,          id: 'isotype' },     // NEW3 · 象形占比
  { C: SlideBump,             id: 'bump' },        // NEW3 · 名次走势
  { C: SlidePyramid,          id: 'pyramid' },     // NEW3 · 财富金字塔
  { C: SlideRadialStack,      id: 'radialstack' }, // NEW3 · 同心环
  { C: SlideAnnotated,        id: 'annotated' },   // NEW3 · 标注影像
  { C: SlideQuoteImage,       id: 'quoteimg' },    // NEW3 · 影像金句
  { C: SlideVenn,             id: 'venn' },        // NEW3 · 策略交集
  { C: SlideBalance,          id: 'balance' },     // NEW3 · 权衡天平
  { C: SlideTornado,          id: 'tornado' },    // NEW4 · 敏感性龙卷风图
  { C: SlideStream,           id: 'stream' },     // NEW4 · 主题河流图
  { C: SlideQuilt,            id: 'quilt' },      // NEW4 · 资产收益拼花
  { C: SlideHive,             id: 'hive' },       // NEW4 · 蜂窝指标
  { C: SlideExhibit,          id: 'exhibit' },    // NEW4 · 标的档案
  { C: SlideMedallions,       id: 'medallions' }, // NEW4 · 影像勋章
  { C: SlideGlossary,         id: 'glossary' },   // NEW4 · 名词释义
  { C: SlideClosing,          id: 'closing' },
];

const rawPages = SLIDES.map((entry, index) => {
  const meta = entry.C?.META || {};
  const themed = THEMED.has(entry.id);
  const tone = TONE_DEFAULTS[entry.id] || 'dark';
  return {
    id: entry.id || meta.id,
    label: SECTION_LABELS[index] || meta.title || entry.id || meta.id,
    Component: withTheme10Base(entry.C),
    controls: withTheme10Controls(themed ? (meta.controls || []) : [{ ...TONE_CONTROL, default: tone }, ...(meta.controls || [])]),
    defaultProps: {
      ...(meta.defaults || {}),
      ...(entry.content || {}),
      idPrefix: entry.id,
      ...(themed ? {} : { tone }),
    },
  };
});

export const runtimePages = normalizeRuntimePages(rawPages, { themeKey: 'theme10', layoutPrefix: 'THEME10' });

function withTheme10Controls(controls) {
  const backgroundControls = controls.filter(control => control.key === 'backgroundMode' || control.key === 'unicornScene');
  const rest = controls.filter(control => control.key !== 'backgroundMode' && control.key !== 'unicornScene');
  return backgroundControls.length ? [...backgroundControls, ...rest] : controls;
}

function withTheme10Base(Component) {
  return function Theme10Page(props = {}) {
    const { tone, ...componentProps } = props;
    return React.createElement(
      React.Fragment,
      null,
      React.createElement('style', null, THEME10_BASE_CSS),
      React.createElement(
        'div',
        { className: 'ds-slidewrap deck-theme' + (tone === 'light' ? ' tone-light' : '') },
        React.createElement(Component, componentProps),
      ),
    );
  };
}
