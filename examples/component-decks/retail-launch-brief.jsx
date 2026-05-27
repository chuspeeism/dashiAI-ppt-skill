import React from 'react';
import { slide } from '../../src/options.jsx';

const metrics = [
  { label: 'Stores', value: '126', note: '首批门店覆盖' },
  { label: 'Trial', value: '38%', note: '试用转化率' },
  { label: 'Repeat', value: '2.4x', note: '复购高于旧品类' },
  { label: 'Share', value: '18%', note: '社媒自然声量' },
];

export default {
  style: 'swiss',
  theme: 'lemon',
  fontSet: 'system',
  title: '零售新品上市简报',
  slides: [
    slide('cover', {
      title: '上市简报',
      kicker: 'RETAIL LAUNCH / 30 DAYS',
      lead: '不是铺货越多越好，而是找到高试用、高复购、高传播的首批场景。',
      meta: 'Consumer Growth Team',
      issue: 'RTL · 01 / 07',
    }),
    slide('hBar', {
      page: '02 / 07',
      title: '试用发生在三类场景',
      kicker: 'TRIAL CHANNELS',
      label: 'TRIAL CONTRIBUTION',
      rows: [
        { label: '便利店冷柜', width: '88%', value: '34%', accent: true },
        { label: '健身房售卖机', width: '73%', value: '28%' },
        { label: '办公室团购', width: '61%', value: '23%' },
        { label: '社区快闪', width: '28%', value: '11%' },
        { label: '电商单买', width: '11%', value: '4%' },
      ],
    }),
    slide('kpiTower', {
      page: '03 / 07',
      title: '早期指标已经足够做选择',
      kicker: 'LAUNCH SIGNALS',
      lead: '这份简报偏增长决策，目标是决定第二阶段资源押注，而不是复盘所有动作。',
      towers: [
        { icon: 'store', label: 'Stores', value: '126', body: '首批试点门店', height: 2 },
        { icon: 'hand', label: 'Trial', value: '38%', body: '进店试用转化', height: 4, accent: true },
        { icon: 'repeat-2', label: 'Repeat', value: '2.4x', body: '复购倍率', height: 3 },
        { icon: 'megaphone', label: 'Share', value: '18%', body: '自然声量占比', height: 1 },
      ],
    }),
    slide('sixCells', {
      page: '04 / 07',
      title: '第二阶段只保留能放大的动作',
      kicker: 'GO TO MARKET FILTER',
      cells: [
        { icon: 'map-pin', title: '场景', body: '优先高频即时消费场景。' },
        { icon: 'badge-percent', title: '价格', body: '保留首购券，减少满减复杂度。' },
        { icon: 'snowflake', title: '陈列', body: '冷柜端架比货架更有效。', accent: true },
        { icon: 'users', title: '人群', body: '运动后和加班人群反应更强。' },
        { icon: 'message-square', title: '话术', body: '强调清爽，不强调功能堆叠。' },
        { icon: 'truck', title: '补货', body: '低库存门店优先周补。' },
      ],
    }),
    slide('timeline', {
      page: '05 / 07',
      title: '接下来 45 天分三段推进',
      kicker: 'NEXT 45 DAYS',
      nodes: [
        { label: 'D01', value: 'Focus', body: '砍掉低试用渠道，把预算集中到前三场景。' },
        { label: 'D15', value: 'Repeat', body: '上线二购提醒和组合装测试。', accent: true },
        { label: 'D30', value: 'Scale', body: '扩大冷柜端架与健身房售卖机合作。' },
        { label: 'D45', value: 'Review', body: '以复购和自然声量决定全国铺货节奏。' },
      ],
      metrics,
    }),
    slide('imageHero', {
      page: '06 / 07',
      title: '主视觉要服务货架识别',
      kicker: 'SHELF VISIBILITY',
      stats: metrics,
    }),
    slide('closing', {
      title: 'Win the first shelf.',
      note: '上市前 30 天的目标不是解释完整品牌，而是在真实货架上被看见、被拿起、被复购。',
      author: 'Consumer Growth Team',
      date: 'Launch +30',
      takeaways: [
        { title: '先聚焦场景', body: '试用强的场景值得扩，弱渠道先停。' },
        { title: '让货架替你说话', body: '冷柜识别度比复杂卖点更重要。' },
        { title: '复购决定铺货', body: '第二阶段资源按复购信号分配。' },
      ],
    }),
  ],
};
