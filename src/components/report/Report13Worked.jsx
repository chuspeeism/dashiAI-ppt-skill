import React from 'react';
import { Icon } from '../decorations/index.jsx';
import { Footer, Lines, ReportSlide, TopBar } from './primitives.jsx';

const items = [
  ['rp13-narrative', 'lightbulb-flash-line', 'red', '更清晰的叙事', '“实践者优先” 定位让销售和产品有了统一主线。信息测试推动 CTR 提升 31%。'],
  ['rp13-lifecycle', 'mail-send-line', 'blue', '生命周期成为渠道', '把邮件当作需求渠道，而不是培育补充，贡献了 $7.2M 来源管道额。'],
  ['rp13-offline', 'map-pin-2-line', 'amber', '重回线下', '线下活动转化率是线上活动的 3.4 倍。2026 财年应继续加码。'],
  ['rp13-research', 'bar-chart-box-line', 'ink', '旗舰研究', 'Practitioner Index 带来 Q3 入站的 47%。一个大投入胜过几十个小项目。'],
  ['rp13-system', 'layout-grid-line', 'red', '真正的设计系统', '交付模板而不是一次性素材，把活动周期从 6.1 周缩短到 2.4 周。'],
  ['rp13-partner', 'team-line', 'blue', '伙伴联合营销', '与伙伴共创报告，让触达翻倍，同时生产成本只有原来的 40%。'],
];

export function Report13Worked() {
  const columns = [items.slice(0, 3), items.slice(3)];

  return (
    <ReportSlide layout="RP13" className="rp-cream">
      <div className="rp-page rp-pad">
        <TopBar eyebrow="章节 · 03 · 复盘" />
        <h1 className="rp-title compact">有效做法。</h1>
        <div className="rp-worked-list">
          {columns.map((column, columnIndex) => (
            <div className="rp-worked-col" key={columnIndex}>
              {column.map(([slotId, icon, tone, title, body]) => (
                <div className="rp-worked-item" key={title}>
                  <Icon className="rp-worked-icon" slotId={slotId} name={icon} tone={tone} />
                  <div>
                    <h3>{title}</h3>
                    <p><Lines lines={body} /></p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <Footer left="07 · 有效做法" right="市场营销 · 2025 年终" />
      </div>
    </ReportSlide>
  );
}
