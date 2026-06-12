// ============================================================================
// _single.jsx — PREVIEW-ONLY single-slide harness (demo tool).
// Loaded by preview.html via the ESM loader. NOT part of the component set.
//
// Renders one slide at a time into #frame. Use from the console:
//   __show('rounds')                       → defaults
//   __show('investor')                     → reusable Donut w/ investor preset
//   __show('dealstruct', { chartType:'segments', mediaSlotCount:0 })
//   __show('chapter', SlideChapter.presetCh04)
// or open preview.html#rounds to deep-link a slide.
// ============================================================================
import SlideCover from './SlideCover.jsx';
import SlideSummary from './SlideSummary.jsx';
import SlideContents from './SlideContents.jsx';
import SlideMethod from './SlideMethod.jsx';
import SlideTrend from './SlideTrend.jsx';
import SlideChapter from './SlideChapter.jsx';
import SlideDealMap from './SlideDealMap.jsx';
import SlideQuarter from './SlideQuarter.jsx';
import SlidePeakMedia from './SlidePeakMedia.jsx';
import SlideTimeline from './SlideTimeline.jsx';
import SlidePeakTrough from './SlidePeakTrough.jsx';
import SlideWaterfall from './SlideWaterfall.jsx';
import SlideSizeSplit from './SlideSizeSplit.jsx';
import SlideCumulative from './SlideCumulative.jsx';
import SlideRadar from './SlideRadar.jsx';
import SlideSegment from './SlideSegment.jsx';
import SlideRanking from './SlideRanking.jsx';
import SlideValueChain from './SlideValueChain.jsx';
import SlideCases from './SlideCases.jsx';
import SlideQuadrant from './SlideQuadrant.jsx';
import SlideRisk from './SlideRisk.jsx';
import SlideOutlook from './SlideOutlook.jsx';
import SlideBigNumber from './SlideBigNumber.jsx';
import SlideBranch from './SlideBranch.jsx';
import SlideDonut from './SlideDonut.jsx';
import SlideFlow from './SlideFlow.jsx';
import SlideFunnel from './SlideFunnel.jsx';
import SlideConvert from './SlideConvert.jsx';
import SlideRounds from './SlideRounds.jsx';
import SlideDealStruct from './SlideDealStruct.jsx';
import SlideResource from './SlideResource.jsx';
import SlideAlliance from './SlideAlliance.jsx';
import SlideGeoCluster from './SlideGeoCluster.jsx';
import SlideCaseStudy from './SlideCaseStudy.jsx';
import SlideSpotlight from './SlideSpotlight.jsx';
import SlideMeter from './SlideMeter.jsx';
import SlideMatrix from './SlideMatrix.jsx';
import SlideStrategy from './SlideStrategy.jsx';
import SlideQuote from './SlideQuote.jsx';
import SlideCoverA from './SlideCoverA.jsx';
import SlideCoverB from './SlideCoverB.jsx';
import SlideCoverC from './SlideCoverC.jsx';
import SlideCoverD from './SlideCoverD.jsx';

const MAP = {
  cover: SlideCover, summary: SlideSummary, contents: SlideContents, method: SlideMethod,
  trend: SlideTrend, chapter: SlideChapter, dealmap: SlideDealMap, quarter: SlideQuarter,
  peakmedia: SlidePeakMedia, timeline: SlideTimeline, peaktrough: SlidePeakTrough,
  waterfall: SlideWaterfall, sizesplit: SlideSizeSplit, cumulative: SlideCumulative,
  ranking: SlideRanking, chain: SlideValueChain, cases: SlideCases,
  quadrant: SlideQuadrant, risk: SlideRisk, outlook: SlideOutlook,
  radar: SlideRadar, segment: SlideSegment, branch: SlideBranch, donut: SlideDonut,
  flow: SlideFlow, funnel: SlideFunnel, convert: SlideConvert,
  rounds: SlideRounds, dealstruct: SlideDealStruct,
  resource: SlideResource, alliance: SlideAlliance,
  geo: SlideGeoCluster,
  casestudy: SlideCaseStudy,
  spotlight: SlideSpotlight,
  meter: SlideMeter,
  matrix: SlideMatrix,
  strategy: SlideStrategy,
  big: SlideBigNumber, quote: SlideQuote,
  coverA: SlideCoverA, coverB: SlideCoverB, coverC: SlideCoverC, coverD: SlideCoverD,
};

const root = ReactDOM.createRoot(document.getElementById('frame'));
window.__show = (key, props) => {
  const C = MAP[key]; if (!C) { console.warn('unknown slide: ' + key); return; }
  root.render(React.createElement(C, { ...C.defaults, ...(props || {}) }));
};

window.__show((location.hash || '#rounds').slice(1));
