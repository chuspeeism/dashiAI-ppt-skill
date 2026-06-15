import React from 'react';
import { normalizeRuntimePages } from '../runtime-helpers.jsx';
import './source/image-slot.js';
import { meta as agenda } from './source/slides/Slide01Agenda.jsx';
import { meta as cards } from './source/slides/Slide02Cards.jsx';
import { meta as charts } from './source/slides/Slide03Charts.jsx';
import { meta as ranking } from './source/slides/Slide05Ranking.jsx';
import { meta as layers } from './source/slides/Slide09Layers.jsx';
import { meta as region } from './source/slides/Slide10Region.jsx';
import { meta as quadrant } from './source/slides/Slide06Quadrant.jsx';
import { meta as caseStudy } from './source/slides/Slide07Case.jsx';
import { meta as hub } from './source/slides/Slide21Hub.jsx';
import { meta as compare } from './source/slides/Slide08Compare.jsx';
import { meta as riskChain } from './source/slides/Slide11RiskChain.jsx';
import { meta as timeline } from './source/slides/Slide12Timeline.jsx';
import { meta as statement } from './source/slides/Slide04Statement.jsx';
import { meta as section } from './source/slides/Slide13Section.jsx';
import { meta as table } from './source/slides/Slide14Table.jsx';
import { meta as bignumber } from './source/slides/Slide15BigNumber.jsx';
import { meta as imagestory } from './source/slides/Slide16ImageStory.jsx';
import { meta as gallery } from './source/slides/Slide17Gallery.jsx';
import { meta as hero } from './source/slides/Slide18Hero.jsx';
import { meta as monthchart } from './source/slides/Slide19MonthChart.jsx';
import { meta as quoteimage } from './source/slides/Slide20QuoteImage.jsx';
import { meta as donut } from './source/slides/Slide22Donut.jsx';
import { meta as chaintable } from './source/slides/Slide23ChainTable.jsx';
import { meta as trio } from './source/slides/Slide24Trio.jsx';
import { meta as spotlight } from './source/slides/Slide25Spotlight.jsx';
import { meta as method } from './source/slides/Slide26Method.jsx';
import { meta as valuechart } from './source/slides/Slide27ValueChart.jsx';
import { meta as quartertable } from './source/slides/Slide28QuarterTable.jsx';
import { meta as diptych } from './source/slides/Slide29Diptych.jsx';
import { meta as radar } from './source/slides/Slide30Radar.jsx';
import { meta as polaroid } from './source/slides/Slide31Polaroid.jsx';
import { meta as funnel } from './source/slides/Slide32Funnel.jsx';
import { meta as annotated } from './source/slides/Slide33Annotated.jsx';
import { meta as versus } from './source/slides/Slide35Versus.jsx';
import { meta as coversection } from './source/slides/Slide36CoverSection.jsx';
import { meta as bento } from './source/slides/Slide37Bento.jsx';
import { meta as heatmap } from './source/slides/Slide38Heatmap.jsx';
import { meta as scoreboard } from './source/slides/Slide39Scoreboard.jsx';
import { meta as editorial } from './source/slides/Slide40Editorial.jsx';
import { meta as filmstrip } from './source/slides/Slide41Filmstrip.jsx';
import { meta as chainflow } from './source/slides/Slide42ChainFlow.jsx';
import { meta as treemap } from './source/slides/Slide43Treemap.jsx';
import { meta as gauges } from './source/slides/Slide44Gauges.jsx';
import { meta as voices } from './source/slides/Slide45Voices.jsx';
import { meta as chapter } from './source/slides/Slide46Chapter.jsx';
import { meta as waterfall } from './source/slides/Slide47Waterfall.jsx';
import { meta as dumbbell } from './source/slides/Slide48Dumbbell.jsx';
import { meta as matrix } from './source/slides/Slide49Matrix.jsx';
import { meta as roadmap } from './source/slides/Slide50Roadmap.jsx';
import { meta as stattrio } from './source/slides/Slide51StatTrio.jsx';
import { meta as metro } from './source/slides/Slide52Metro.jsx';
import { meta as ledger } from './source/slides/Slide53Ledger.jsx';
import { meta as profile } from './source/slides/Slide54Profile.jsx';
import { meta as slope } from './source/slides/Slide55Slope.jsx';
import { meta as manifesto } from './source/slides/Slide56Manifesto.jsx';
import { meta as cover } from './source/slides/Slide57Cover.jsx';
import { meta as pyramid } from './source/slides/Slide58Pyramid.jsx';
import { meta as stacked } from './source/slides/Slide59Stacked.jsx';
import { meta as spread } from './source/slides/Slide60Spread.jsx';
import { meta as scorecards } from './source/slides/Slide61Scorecards.jsx';
import { meta as split } from './source/slides/Slide62Split.jsx';
import { meta as scatter } from './source/slides/Slide63Scatter.jsx';
import { meta as groupbars } from './source/slides/Slide64GroupBars.jsx';
import { meta as triptych } from './source/slides/Slide65Triptych.jsx';
import { meta as contents } from './source/slides/Slide66Contents.jsx';
import { meta as showcase } from './source/slides/Slide67Showcase.jsx';
import { meta as calendar } from './source/slides/Slide68Calendar.jsx';
import { meta as gantt } from './source/slides/Slide69Gantt.jsx';
import { meta as deltahero } from './source/slides/Slide70DeltaHero.jsx';
import { meta as verdict } from './source/slides/Slide71Verdict.jsx';
import { meta as numbered } from './source/slides/Slide72Numbered.jsx';
import { meta as coverHero } from './source/slides/Slide73CoverHero.jsx';
import { meta as coverIndex } from './source/slides/Slide74CoverIndex.jsx';
import { meta as coverGhost } from './source/slides/Slide75CoverGhost.jsx';
import { meta as coverBento } from './source/slides/Slide76CoverBento.jsx';

const THEME04_BASE_CSS = ".xhs-base{width:1920px;height:1080px;position:relative;overflow:hidden;box-sizing:border-box;font-family:\"Noto Sans SC\",-apple-system,\"PingFang SC\",\"Microsoft YaHei\",sans-serif;background:#000;color:#fff;-webkit-font-smoothing:antialiased}.xhs-base *{box-sizing:border-box}";
const THEME04_REMOVED_CONTROL_TYPES = new Set(['text', 'string', 'input', 'url', 'email', 'textarea', 'multiline', 'list', 'section']);
const rawPages = [
  coverHero, coverIndex, coverGhost, coverBento,
  agenda, contents, method, section, cards, donut, scatter, slope, treemap, waterfall, groupbars, bento, charts, monthchart, stacked, gauges, heatmap, calendar, quartertable, table, spread, scoreboard, ledger, matrix, bignumber, stattrio, deltahero, scorecards, versus, funnel,
  chapter, ranking, layers, chaintable, chainflow, region, gallery, filmstrip, quadrant, cover, coversection,
  trio, editorial, triptych, radar, caseStudy, profile, valuechart, dumbbell, pyramid, hero, annotated, imagestory, spotlight, showcase, polaroid,
  split, compare, diptych, riskChain, roadmap, gantt, metro, timeline, numbered, voices, manifesto, verdict, quoteimage, statement,
].map(entry => ({
  ...entry,
  Component: withTheme04Base(entry.Component),
  controls: cleanTheme04Controls(entry.controls || []),
}));

export const runtimePages = normalizeRuntimePages(rawPages, { themeKey: 'theme04', layoutPrefix: 'THEME04' });

function cleanTheme04Controls(controls) {
  return controls.filter(control => !THEME04_REMOVED_CONTROL_TYPES.has(String(control?.type || '').toLowerCase()));
}

function withTheme04Base(Component) {
  return function Theme04Page(props) {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement('style', null, THEME04_BASE_CSS),
      React.createElement(Component, props),
    );
  };
}
