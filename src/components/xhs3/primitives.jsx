import React from 'react';
import { MediaPlaceholder } from '../blacktech/primitives.jsx';
import { SlideShell } from '../shell/index.jsx';

export const xhs3Image = (name) => `assets/imported/xhs3/images/${name}`;

export function Xhs3Slide({ layout, tone = 'paper', children, footer, className = '' }) {
  const chromeTone = tone === 'paper' ? 'light' : 'dark';
  return (
    <SlideShell layout={layout} tone={chromeTone} animate="cascade" className={`xhs3-slide xhs3-${tone} ${className}`.trim()}>
      <div className="xhs3-frame">
        {children}
        {footer ? <Footer {...footer} /> : null}
      </div>
    </SlideShell>
  );
}

export function Top({ left, center, right, ink = false }) {
  return (
    <div className={`xhs3-top ${ink ? 'on-ink' : ''}`}>
      <div>{left}</div>
      <div>{center}</div>
      <div>{right}</div>
    </div>
  );
}

export function Footer({ left, center, right, ink = false }) {
  return (
    <div className={`xhs3-footer ${ink ? 'on-ink' : ''}`}>
      <div>{left}</div>
      <div>{center}</div>
      <div>{right}</div>
    </div>
  );
}

export function Lines({ lines }) {
  const value = Array.isArray(lines) ? lines : String(lines || '').split('\n');
  return (
    <>
      {value.map((line, index) => (
        <React.Fragment key={`${line}-${index}`}>
          {line}
          {index < value.length - 1 ? <br /> : null}
        </React.Fragment>
      ))}
    </>
  );
}

export function Card({ kicker, title, body, tone = '', children }) {
  return (
    <div className={`xhs3-card ${tone}`.trim()}>
      {kicker ? <div className="xhs3-kicker">{kicker}</div> : null}
      {title ? <h3><Lines lines={title} /></h3> : null}
      {body ? <p><Lines lines={body} /></p> : null}
      {children}
    </div>
  );
}

export function MediaCard({ src, label, meta, ratio = '3/4', tone = '', className = '' }) {
  const slotId = label || src;
  return (
    <figure
      className={`xhs3-media ${tone} ${className}`.trim()}
      style={{ aspectRatio: ratio }}
      data-media-slot={slotId}
      data-media-kind="image-video"
      role="button"
      tabIndex={0}
    >
      <img src={src} alt="" draggable={false} />
      {label || meta ? (
        <figcaption>
          {label ? <span>{label}</span> : null}
          {meta ? <small><Lines lines={meta} /></small> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function PlaceholderMediaCard({ label, meta, ratio = '3/4', tone = '', className = '' }) {
  const slotLabel = label || meta || ratio;
  const slotId = `xhs3-media-${String(Array.isArray(slotLabel) ? slotLabel.join('-') : slotLabel).replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <figure className={`xhs3-media xhs3-media-placeholder-card ${tone} ${className}`.trim()} style={{ aspectRatio: ratio }}>
      <MediaPlaceholder slotId={slotId} className="xhs3-media-placeholder" />
      {label || meta ? (
        <figcaption>
          {label ? <span>{label}</span> : null}
          {meta ? <small><Lines lines={meta} /></small> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function Metric({ label, value, tone = '' }) {
  return (
    <div className={`xhs3-metric ${tone}`.trim()}>
      <div>{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

export function NumberRail({ section, label, ink = false }) {
  return (
    <div className={`xhs3-number-rail ${ink ? 'on-ink' : ''}`}>
      <div className="xhs3-kicker">{section}</div>
      <strong>{label}</strong>
    </div>
  );
}
