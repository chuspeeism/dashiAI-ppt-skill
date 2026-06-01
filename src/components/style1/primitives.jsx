import React from 'react';
import { Icon } from '../decorations/index.jsx';
import { SlideShell } from '../shell/index.jsx';

const mascotIcons = {
  cloud: 'cloudy-2-line',
  drop: 'drop-line',
  star: 'sparkling-2-line',
  heart: 'heart-3-line',
  flower: 'flower-line',
};

export function Style1Slide({ layout, tone = 'light', className = '', children }) {
  return (
    <SlideShell layout={layout} tone={tone} animate="cascade" className={`style1-slide ${className}`.trim()}>
      {children}
    </SlideShell>
  );
}

export function Aura({ tone }) {
  return <div className={`st1-aura-wrap ${tone}`}><div /></div>;
}

export function GridBg() {
  return <div className="st1-grid-bg" />;
}

export function Wordmark() {
  return (
    <div className="st1-wordmark">
      <LogoMark />
      <span>果冻研究所</span>
    </div>
  );
}

export function LogoMark() {
  return (
    <Icon className="st1-mark" slotId="st1-wordmark-mark" name="sparkling-2-line" tone="ink" />
  );
}

export function Mascot({ kind, slotId, className = '' }) {
  const icon = mascotIcons[kind] || mascotIcons.cloud;
  return (
    <Icon className={`st1-mascot ${className}`.trim()} slotId={slotId || `st1-${kind}`} name={icon} tone="ink" />
  );
}
