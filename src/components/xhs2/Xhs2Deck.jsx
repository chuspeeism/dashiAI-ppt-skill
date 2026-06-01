import React from 'react';
import { ShaderBackdrop } from '../blacktech/primitives.jsx';
import { Card, CardGrid, Placeholder, Split, Statement, Top, Xhs2Slide } from './primitives.jsx';

const coverStats = [
  ['视频封面 01', '6:45', '3.9w 赞', '4.9w 藏'],
  ['视频封面 02', '11:21', '1.0w 赞', '1.1w 藏'],
  ['视频封面 03', '4:38', '3.0w 赞', '3.5w 藏'],
  ['视频封面 04', '3:48', '1.5w 赞', '1.6w 藏'],
  ['视频封面 05', '2:51', '2.1w 赞', '2.7w 藏'],
  ['视频封面 06', '5:30', '3.0w 赞', '1.6w 藏'],
];

export function Xhs2_01Cover() {
  return (
    <Xhs2Slide layout="XHS2-01" footer={{ left: 'SPEAKER · @大师的AI小灶', page: '01 / 34' }}>
      <div className="xhs2-cover">
        <div className="xhs2-cover-art xhs2-shader-panel"><ShaderBackdrop variant="techBackground" /></div>
        <div className="xhs2-cover-copy">
          <div className="xhs2-top"><div className="xhs2-eyebrow yellow">AI 狂奔时</div><div className="xhs2-page">2026 / 04</div></div>
          <h1>普通人<br />需要知道的<br /><span>真相。</span></h1>
          <div className="xhs2-kicker">XHS · AI GOVERNANCE OPEN DAY 2026</div>
        </div>
      </div>
    </Xhs2Slide>
  );
}

export function Xhs2_02About() {
  return (
    <Xhs2Slide layout="XHS2-02" footer={{ left: 'INTRO', page: '02 / 34' }}>
      <Top label="§ 01 · INTRO" page="02 / 34" accent="magenta" />
      <h1 className="xhs2-title">我是谁<span>？</span></h1>
      <div className="xhs2-about-tags">
        <Card kicker="TAG / 01" title={'深耕 AI 行业的\n自媒体创作者'} tone="magenta-outline" />
        <Card kicker="TAG / 02" title={'在小红书有 6 条\n破万赞的长视频教程'} tone="cyan-outline" />
      </div>
      <div className="xhs2-cover-grid">
        {coverStats.map(([label, time, like, save]) => (
          <div key={label}>
            <Placeholder label={[label, time]} ratio="3/4" />
            <div className="xhs2-mini-stat"><span>{like}</span><span>{save}</span></div>
          </div>
        ))}
      </div>
    </Xhs2Slide>
  );
}

export function Xhs2_03Philosophy() {
  return (
    <Xhs2Slide layout="XHS2-03" footer={{ left: 'ANTI - ANXIETY', page: '03 / 34' }}>
      <div className="xhs2-half">
        <div className="xhs2-yellow-panel xhs2-shader-panel">
          <ShaderBackdrop variant="movingInto" />
          <div className="xhs2-kicker">§ 02 · 我的 AI 理念</div>
          <h1>AI 反<br />焦虑</h1>
          <div className="xhs2-kicker">ANTI - ANXIETY</div>
        </div>
        <div className="xhs2-half-copy">
          <Top label="WHY" page="03 / 34" />
          <h2>AI 的使命，是让<br />人的生活<span>更好</span>。</h2>
          <p>它诞生的初衷不是为了让人产生焦虑。今天，我不是来给大家制造焦虑的，而是带着大家以更客观的角度去看待 AI。</p>
        </div>
      </div>
    </Xhs2Slide>
  );
}

export function Xhs2_04Topics() {
  return (
    <Xhs2Slide layout="XHS2-04" footer={{ left: 'COUNTER CURRENT', page: '04 / 34' }}>
      <Top label="§ 02 · 我的选题" page="04 / 34" accent="green" />
      <h1 className="xhs2-title">所以我会做一些<span>逆潮流</span>的选题</h1>
      <p className="xhs2-body">而这些选题，恰好也是大家关心的。</p>
      <CardGrid columns={3} items={[
        { kicker: '01', title: '《OpenClaw 的\n安全风险》', body: '对应目前对新工具的无脑吹捧或过度神化。', tone: 'green-badge' },
        { kicker: '02', title: '《提示词\n不是越长越好》', body: '对应那些宣称「掌握万能模板就能通关」的速成论。', tone: 'magenta-badge' },
        { kicker: '03', title: '《2 招破解\nAI 生图底层逻辑》', body: '对应「AI 已经零瑕疵」的危机言论。', tone: 'yellow-badge' },
      ]} />
    </Xhs2Slide>
  );
}

export function Xhs2_05Powerful() {
  return (
    <Xhs2Slide layout="XHS2-05" footer={{ left: 'SOURCE · GITHUB', page: '05 / 34' }}>
      <Top label="§ 03 · 当下" page="05 / 34" accent="red" />
      <h1 className="xhs2-title">AI 简直<span>太强大了。</span></h1>
      <p className="xhs2-body">几乎任何视觉素材，它都能以假乱真地生成出来。</p>
      <div className="xhs2-media-six">
        {['证件照', '微信对话', '课本笔记', '千禧年照', '票据 / 证明', '手写材料'].map((label) => <Placeholder key={label} label={label} />)}
      </div>
      <div className="xhs2-callout red"><strong>20%</strong><span>现在每天 GitHub 上的代码有 20% 由 AI 提交。</span></div>
    </Xhs2Slide>
  );
}

export function Xhs2_11WhyItMatters() {
  return <Statement layout="XHS2-11" label="边界 ① · 与你何关" page="11 / 34" title={['模型塌陷', '和我有什么关系？']} body={['模型塌陷 = 原创内容更可贵。', '信息质量的退化是渐进的，你可能不知不觉就习惯了。']} accent="magenta" footerLeft="ORIGINAL VALUE" />;
}

export function Xhs2_15PersistentDialogue() {
  return (
    <Split
      layout="XHS2-15"
      label="边界 ② · 持续对话"
      page="15 / 34"
      title={'大模型能持续跟你对话\n这件事，甚至还有些笨。'}
      body={'AI 持续对话不神奇，它只是将上下文一遍又一遍喂给自己而已。'}
      accent="blue"
      footerLeft="CONTEXT"
      side={<Card title="TURN N → TURN N+1" body="每次对话都是把过去的全部聊天记录，重新塞回模型输入里。" tone="blue-badge" />}
    />
  );
}

export function Xhs2_33OfficialSupplement() {
  return (
    <Split
      layout="XHS2-33"
      label="§ 08 · 官方补充"
      page="33 / 34"
      title={'作为科普作者，\n我如何看待平台治理？'}
      accent="cyan"
      footerLeft="OFFICIAL SUPPLEMENT"
      side={<CardGrid columns={1} items={[{ kicker: '01', title: '没有规则的内容生态，劣币会驱逐良币。', body: '劣质和虚假内容会驱逐优质内容。', tone: 'cyan-outline' }, { kicker: '02', title: '平台主动管理，是对认真创作用户的保护。', body: '明确鼓励什么、反对什么。', tone: 'yellow-badge' }]} />}
    />
  );
}

export function Xhs2_34ThankYou() {
  return (
    <Xhs2Slide layout="XHS2-34" accent="yellow" footer={{ left: 'SPEAKER · @大师的AI小灶', page: '34 / 34' }}>
      <Top label="§ 09 · 结尾" page="34 / 34" accent="yellow" />
      <div className="xhs2-thanks">
        <div className="xhs2-kicker">CLOSING THOUGHTS · 三不原则</div>
        <h1>不焦虑、<br />不神化、<br />不排斥。</h1>
        <p>—— 好好用 AI。</p>
        <strong>谢谢<br />大家</strong>
      </div>
    </Xhs2Slide>
  );
}
