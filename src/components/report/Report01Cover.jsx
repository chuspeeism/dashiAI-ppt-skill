import React from 'react';
import { MediaPlaceholder } from '../blacktech/primitives.jsx';
import { Mark, ReportSlide } from './primitives.jsx';

export function Report01Cover() {
  return (
    <ReportSlide layout="RP01" tone="dark" className="rp-cover-slide rp-red rp-has-right-media">
      <div className="rp-cover rp-cover-media-layout">
        <div className="rp-cover-hero">
          <Mark />
          <div>
            <div className="rp-eyebrow">市场营销 · 年终复盘</div>
            <div className="rp-cover-year">2025</div>
            <div className="rp-cover-review">年度复盘</div>
            <p>Northwind Labs 品牌重塑、管道扩张与社区建设的一年。</p>
          </div>
          <div className="rp-cover-meta">
            <span>2025 · 12 · 18</span>
            <span>MARA OKONKWO · 市场负责人</span>
          </div>
        </div>
        <MediaPlaceholder slotId="rp01-media" className="rp-media-half rp-cover-media" />
      </div>
    </ReportSlide>
  );
}
