import React from 'react';
import { BigStatement, CardGrid, Placeholder, XhsCard, XhsSlide, XhsTop } from './primitives.jsx';

const coverStats = [
  ['封面 1', '6:45', '3.9w 赞 · 4.9w 藏'],
  ['封面 2', '11:21', '1.0w 赞 · 1.1w 藏'],
  ['封面 3', '4:38', '3.0w 赞 · 3.5w 藏'],
  ['封面 4', '3:48', '1.5w 赞 · 1.6w 藏'],
  ['封面 5', '2:51', '2.1w 赞 · 2.7w 藏'],
  ['封面 6', '5:30', '3.0w 赞 · 1.6w 藏'],
];

export function Xhs01Cover() {
  return (
    <XhsSlide layout="XHS01" tone="dark" footer={{ left: '@大师的 AI 小灶', page: '01 / 26' }}>
      <div className="xhs-logomark">大师的 AI 小灶</div>
      <div className="xhs-cover">
        <div className="xhs-kicker">小红书 AI 治理开放日 · 2025</div>
        <div className="xhs-cover-title">AI 狂奔时，<br />普通人需要知道的<br /><span>真相。</span></div>
        <div className="xhs-page">KEYNOTE / 01</div>
      </div>
    </XhsSlide>
  );
}

export function Xhs02About() {
  return (
    <XhsSlide layout="XHS02" footer={{ left: '关于我', page: '02 / 26' }}>
      <XhsTop eyebrow="/ 我是谁" page="02 / 26" />
      <div className="xhs-about">
        <div>
          <h1 className="xhs-title">深耕 AI 行业的<br />自媒体创作者。</h1>
          <div className="xhs-tag-row">
            <span>AI 行业 · 长期观察</span>
            <span>6 条破万赞长视频教程</span>
            <span>小红书科普创作者</span>
          </div>
        </div>
        <div className="xhs-cover-grid">
          {coverStats.map(([label, time, stat]) => (
            <div key={label}>
              <Placeholder label={`${label}\n${time}`} ratio="3/4" />
              <small>{stat}</small>
            </div>
          ))}
        </div>
      </div>
    </XhsSlide>
  );
}

export function Xhs04Topics() {
  return (
    <XhsSlide layout="XHS04" footer={{ left: '逆潮流', page: '04 / 26' }}>
      <XhsTop eyebrow="/ 选题方向" page="04 / 26" />
      <h1 className="xhs-title">所以我会做一些<br /><span>逆潮流</span>的选题。</h1>
      <CardGrid
        columns={3}
        items={[
          { kicker: '/ 选题 01', title: '《OpenClaw 的安全风险》', body: '逆 — 对新工具的无脑吹捧或过度神化' },
          { kicker: '/ 选题 02', title: '《提示词不是越长越好》', body: '逆 — 「掌握万能模板就能通关」的速成论' },
          { kicker: '/ 选题 03', title: '《2 招教你破解 AI 生图的底层逻辑》', body: '逆 — 「AI 已经零瑕疵」的危机言论' },
        ]}
      />
      <p className="xhs-body bottom">而这些选题，恰恰好也是大家关心的。</p>
    </XhsSlide>
  );
}

export function Xhs12CollapseAndMe() {
  return (
    <BigStatement
      eyebrow="/ 边界 ① · 与我有关"
      title={['模型塌陷 = 原创内容', '更加可贵。']}
      body={['模型崩塌不是远在天边的科幻故事，它已经在发生了。', '信息质量退化是渐进的，发现时可能已经晚了。']}
      page={{ layout: 'XHS12', left: '边界 ① · 与我有关', page: '12 / 26' }}
    />
  );
}

export function Xhs15ContextExplosion() {
  return (
    <XhsSlide layout="XHS15" footer={{ left: '边界 ② · 上下文', page: '15 / 26' }}>
      <XhsTop eyebrow="/ 边界 ② · 现象" page="15 / 26" />
      <h1 className="xhs-title">这是它容易出现<br /><span>上下文爆炸</span>的原因。</h1>
      <div className="xhs-flow">
        <XhsCard title={'你输入\n"你好"'} body="1 Token" />
        <div className="xhs-arrow">→</div>
        <XhsCard title="实际消耗" body="~ 16,000 Tokens" tone="lime" />
      </div>
      <p className="xhs-body bottom">AI 持续对话不神奇，它只是把上下文一遍又一遍地喂给了自己。</p>
    </XhsSlide>
  );
}

export function Xhs17LearnedVsAbility() {
  return (
    <XhsSlide layout="XHS17" footer={{ left: '边界 ③ · 拆解', page: '17 / 26' }}>
      <XhsTop eyebrow="/ 边界 ③ · 拆解" page="17 / 26" />
      <h1 className="xhs-title">它学到的是「语言」，<br />没学到「能力」。</h1>
      <CardGrid
        columns={2}
        items={[
          { kicker: '/ 学到了 · 语言', title: '怎么表达\n怎么解释\n怎么模仿推理', tone: 'lime' },
          { kicker: '/ 没学到 · 能力', title: '真正的计算\n操作系统\n调用外部世界', tone: 'outline' },
          { kicker: '/ 封闭系统', title: '输入：文本 → 输出：文本', body: '没有外部接口，无法作用世界' },
          { kicker: '/ 概率采样', title: '不是确定计算', body: '数学会错 · 逻辑会漂 · 每次结果都不同' },
        ]}
      />
    </XhsSlide>
  );
}

export function Xhs18ThreeCases() {
  return (
    <XhsSlide layout="XHS18" footer={{ left: '边界 ③ · 验证', page: '18 / 26' }}>
      <XhsTop eyebrow="/ 边界 ③ · 怎么验证" page="18 / 26" />
      <h1 className="xhs-title">三个一眼就能看出来的破绽。</h1>
      <CardGrid
        columns={3}
        items={[
          { kicker: '/ 案例 01', title: 'AI 不清楚人类有几根手指', body: '手指数不对' },
          { kicker: '/ 案例 02', title: 'AI 画不出跳了 10 米高的人', body: '物理感缺失' },
          { kicker: '/ 案例 03', title: '大象和杯子的比例问题', body: '比例失衡' },
        ]}
      />
    </XhsSlide>
  );
}

export function Xhs19ExistingData() {
  return (
    <XhsSlide layout="XHS19" tone="indigo" accent="cream" footer={{ left: '边界 ④', page: '19 / 26' }}>
      <XhsTop eyebrow="/ 边界 ④" page="19 / 26" />
      <h1 className="xhs-title">它没办法生成<br />没见过的东西。</h1>
      <p className="xhs-body">AI 至今非常依赖人类供给的存量数据。</p>
      <CardGrid
        columns={2}
        tone="outline"
        items={[
          { kicker: '/ 案例 · 劳力士', title: '桌子上的劳力士', body: 'AI 默认生成的表，永远指向 10:10。' },
          { kicker: '/ 案例 · 6:02', title: '指向 6:02 的手表', body: '让它生成 6:02，时间大概率是错的。' },
        ]}
      />
    </XhsSlide>
  );
}

export function Xhs22Bias() {
  return (
    <XhsSlide layout="XHS22" footer={{ left: '偏见', page: '22 / 26' }}>
      <XhsTop eyebrow="/ 章节 三" page="22 / 26" />
      <h1 className="xhs-title">算法偏见与歧视。</h1>
      <CardGrid
        columns={3}
        items={[
          ['招聘', 'Amazon AI 系统性歧视女性候选人'],
          ['信贷', '信贷评分 AI 对少数族裔不公'],
          ['司法', '犯罪风险评估 AI 对黑人有偏见'],
          ['性别', 'Apple Card 信用额度性别争议'],
          ['医疗', '全美 2 亿人的产品存在医疗偏见'],
          ['人脸识别', '公开 8 起人脸识别错捕，其中 7 起受害人是黑人'],
        ].map(([kicker, title], index) => ({ kicker: `/ ${kicker}`, title, tone: index === 5 ? 'lime' : '' }))}
      />
    </XhsSlide>
  );
}

export function Xhs25AlreadyHappened() {
  return (
    <XhsSlide layout="XHS25" footer={{ left: '已经发生', page: '25 / 26' }}>
      <XhsTop eyebrow="/ 章节 三 · 已经发生" page="25 / 26" />
      <h1 className="xhs-title">从五角大楼，到你家长辈。</h1>
      <CardGrid
        columns={3}
        items={[
          { kicker: '/ 2023.05 · 政治地缘', title: '五角大楼「爆炸」图', body: 'AI 假图疯传，标普 500 一度盘中跳水。' },
          { kicker: '/ 2022.03 · 政治地缘', title: '泽连斯基「投降」视频', body: '伪造视频在被入侵的电视台播出。' },
          { kicker: '/ 2023.03 · 政治地缘', title: '特朗普「被捕」系列图', body: '骗过数百万网民。' },
          { kicker: '/ 离你很近 · 01', title: '「美国教授怒骂 AI」', body: '点赞数十万，但视频本身就是 AI 生成的。', tone: 'lime' },
          { kicker: '/ 离你很近 · 02', title: '「俄罗斯积雪 9 层楼高」', body: '转发破百万，最后被证实完全是 AI 伪造。', tone: 'lime' },
          { kicker: '/ 离你很近 · 03', title: 'AI「后悔视频」催婚', body: '用 AI 生成后悔没结婚视频施压，形成情感操控。', tone: 'lime' },
        ]}
      />
    </XhsSlide>
  );
}
