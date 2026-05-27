import React from 'react';
import { slide } from '../../src/options.jsx';

const stats = [
  { label: 'Sites', value: '18', note: '监测点数量' },
  { label: 'Reuse', value: '42%', note: '材料循环率' },
  { label: 'Water', value: '-19%', note: '单位用水下降' },
  { label: 'Bio', value: '+7', note: '新增物种记录' },
];

export default {
  style: 'swiss',
  theme: 'green',
  fontSet: 'compact',
  title: '城市微气候田野报告',
  slides: [
    slide('cover', {
      title: '微气候田野',
      kicker: 'FIELD NOTE / URBAN ECOLOGY',
      lead: '用现场监测、材料循环和居民行为数据，重新理解街区尺度的韧性。',
      meta: 'Urban Lab · Field Report',
      issue: 'ECO · 01 / 06',
    }),
    slide('imageHero', {
      page: '02 / 06',
      title: '先看现场，而不是先画方案',
      kicker: 'SITE OBSERVATION',
      stats,
    }),
    slide('sixCells', {
      page: '03 / 06',
      title: '六个变量决定街区体感',
      kicker: 'MICRO CLIMATE VARIABLES',
      cells: [
        { icon: 'thermometer-sun', title: '热岛', body: '午后 14:00 的地表温差。' },
        { icon: 'wind', title: '风廊', body: '建筑间隙形成的低速区。' },
        { icon: 'droplets', title: '雨洪', body: '短时强降雨的滞蓄能力。', accent: true },
        { icon: 'leaf', title: '植被', body: '树冠遮阴和蒸腾贡献。' },
        { icon: 'recycle', title: '材料', body: '可回收铺装和低碳维护。' },
        { icon: 'users', title: '行为', body: '居民停留、穿行和避暑路径。' },
      ],
    }),
    slide('hBar', {
      page: '04 / 06',
      title: '最有效的干预不是最贵的',
      kicker: 'INTERVENTION RANK',
      label: 'COMFORT GAIN / COST',
      rows: [
        { label: '连续树冠', width: '94%', value: '9.4', accent: true },
        { label: '透水铺装', width: '82%', value: '8.2' },
        { label: '可移动遮阴', width: '74%', value: '7.4' },
        { label: '雨水花园', width: '63%', value: '6.3' },
        { label: '立面喷雾', width: '38%', value: '3.8' },
      ],
    }),
    slide('timeline', {
      page: '05 / 06',
      title: '从监测到运营分三步',
      kicker: 'FIELD TO OPERATION',
      nodes: [
        { label: '01', value: 'Map', body: '先建立热、风、水、人四类基础地图。' },
        { label: '02', value: 'Test', body: '用临时装置验证一周以上的真实行为变化。', accent: true },
        { label: '03', value: 'Build', body: '只固化经过现场验证的干预。' },
        { label: '04', value: 'Care', body: '把维护成本纳入年度预算，而不是项目尾款。' },
      ],
      metrics: stats,
    }),
    slide('closing', {
      title: 'Design for the afternoon.',
      note: '街区韧性不是宏大口号，而是最热、最湿、最拥挤时还能被使用。',
      author: 'Urban Lab',
      date: 'Field Season',
      takeaways: [
        { title: '现场数据先于概念', body: '不看午后体感，就无法判断方案是否真实有效。' },
        { title: '轻量试验先于建设', body: '临时装置能暴露长期维护问题。' },
        { title: '运营决定韧性', body: '没有维护计划的绿色设计，生命周期很短。' },
      ],
    }),
  ],
};
