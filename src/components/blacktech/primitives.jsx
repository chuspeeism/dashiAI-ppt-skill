import React from 'react';
import UnicornScene from 'unicornstudio-react';
import { ChartSwitch as BaseChartSwitch } from '../charts/index.jsx';
import { SlideShell } from '../shell/index.jsx';

const UNICORN_SDK_URL = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.12/dist/unicornStudio.umd.js';

const UNICORN_IMAGE_SCENE = {
  jsonFilePath: 'assets/unicorn/blue_donut_remix_scene.json',
  width: '1440px',
  height: '900px',
  scale: 1,
  dpi: 1.5,
  sdkUrl: UNICORN_SDK_URL,
};

const UNICORN_SHADER_BACKDROPS = {
  movingInto: {
    label: 'Moving Into',
    type: 'unicorn',
    jsonFilePath: 'assets/unicorn/moving_into_remix_scene.json',
    width: '1440px',
    height: '900px',
    scale: 1,
    dpi: 1.5,
    sdkUrl: UNICORN_SDK_URL,
  },
  gooeyBalls: {
    label: 'Gooey Balls',
    type: 'unicorn',
    jsonFilePath: 'assets/unicorn/goey_balls_remix_scene.json',
    width: '1440px',
    height: '900px',
    scale: 1,
    dpi: 1.5,
    sdkUrl: UNICORN_SDK_URL,
  },
  techBackground: {
    label: 'Tech Background',
    type: 'unicorn',
    jsonFilePath: 'assets/unicorn/tech_background_remix_scene.json',
    width: '1440px',
    height: '900px',
    scale: 1,
    dpi: 1.5,
    sdkUrl: UNICORN_SDK_URL,
  },
  automations: {
    label: 'Automations',
    type: 'unicorn',
    jsonFilePath: 'assets/unicorn/automations_remix_scene.json',
    width: '1440px',
    height: '900px',
    scale: 1,
    dpi: 1.5,
    sdkUrl: UNICORN_SDK_URL,
  },
};

const SHADER_BACKDROP_OPTIONS = UNICORN_SHADER_BACKDROPS;

const SHADER_BACKDROP_OPTIONS_JSON = JSON.stringify(
  Object.entries(SHADER_BACKDROP_OPTIONS).map(([key, option]) => ({
    key,
    label: option.label,
    type: option.type,
    jsonFilePath: option.jsonFilePath,
    scale: option.scale,
    dpi: option.dpi,
    sdkUrl: option.sdkUrl,
  })),
);

export function BlackTechSlide({ layout, chrome, header, footer, className = '', children }) {
  const chromeHeader = header || (chrome ? { left: chrome.left, right: chrome.right } : null);
  const chromeFooter = footer || (chrome ? { left: chrome.bottomLeft, right: chrome.bottomRight } : null);

  return (
    <SlideShell layout={layout} tone="dark" animate="cascade" className={`bt-slide ${className}`.trim()}>
      {chromeHeader ? <TechHeader {...chromeHeader} /> : null}
      {chromeFooter ? <TechFooter {...chromeFooter} /> : null}
      {children}
    </SlideShell>
  );
}

export function TechChrome({ left, right, bottomLeft, bottomRight }) {
  return (
    <>
      <TechHeader left={left} right={right} />
      <TechFooter left={bottomLeft} right={bottomRight} />
    </>
  );
}

export function TechHeader({ left, right, marker = true }) {
  return (
    <header className="bt-chrome bt-chrome-head">
      <div className="tl">{marker ? <TechMark /> : null} <span>{left}</span></div>
      <div className="tr"><span>{right}</span></div>
    </header>
  );
}

export function TechFooter({ left, right }) {
  return (
    <footer className="bt-chrome bt-chrome-foot">
      <div className="bl"><span>{left}</span></div>
      <div className="br"><span>{right}</span></div>
    </footer>
  );
}

export function TechMark() {
  return (
    <div className="bt-mark" aria-hidden="true">
      <i /><i /><i /><i />
    </div>
  );
}

export function CaptionBlock({ label, value, tone = 'dark' }) {
  return (
    <div className={`bt-caption ${tone === 'light' ? 'light' : ''}`}>
      <div className="k">{label}</div>
      <div className="v">{value}</div>
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

export function Poster({ variant = 'halftone', slotId, children, className = '' }) {
  return (
    <MediaPlaceholder variant={variant} slotId={slotId} className={`bt-poster ${className}`.trim()}>
      {children}
    </MediaPlaceholder>
  );
}

export function MediaPlaceholder({ slotId, children, className = '', style }) {
  return (
    <div
      className={`bt-media-slot bt-image-slot bt-unicorn-frame ${className}`.trim()}
      data-media-slot={slotId}
      data-image-slot={slotId}
      data-media-kind="image-video"
      data-unicorn-json-file-path={UNICORN_IMAGE_SCENE.jsonFilePath}
      data-unicorn-scale={UNICORN_IMAGE_SCENE.scale}
      data-unicorn-dpi={UNICORN_IMAGE_SCENE.dpi}
      data-unicorn-sdk-url={UNICORN_IMAGE_SCENE.sdkUrl}
      data-unicorn-theme-color="focus"
      role="button"
      tabIndex={0}
      style={style}
    >
      <UnicornImageScene />
      {children}
    </div>
  );
}

export const ImagePlaceholder = MediaPlaceholder;

export function UnicornImageScene() {
  return (
    <UnicornScene
      jsonFilePath={UNICORN_IMAGE_SCENE.jsonFilePath}
      width={UNICORN_IMAGE_SCENE.width}
      height={UNICORN_IMAGE_SCENE.height}
      scale={UNICORN_IMAGE_SCENE.scale}
      dpi={UNICORN_IMAGE_SCENE.dpi}
      sdkUrl={UNICORN_IMAGE_SCENE.sdkUrl}
      lazyLoad={false}
      className="bt-unicorn-scene"
    />
  );
}

export function ShaderVisual({ variant }) {
  return <div className={`bt-visual ${variant}`} aria-hidden="true" />;
}

export function ShaderBackdrop({ variant = 'warp' }) {
  const option = SHADER_BACKDROP_OPTIONS[variant] || SHADER_BACKDROP_OPTIONS.movingInto;
  const current = SHADER_BACKDROP_OPTIONS[variant] ? variant : 'movingInto';
  const attrs = {
    'data-shader-backdrop': 'true',
    'data-shader-current': current,
    'data-shader-options': SHADER_BACKDROP_OPTIONS_JSON,
  };

  return (
    <div
      className="bt-shader-backdrop bt-unicorn-frame"
      {...attrs}
      data-unicorn-json-file-path={option.jsonFilePath}
      data-unicorn-scale={option.scale}
      data-unicorn-dpi={option.dpi}
      data-unicorn-sdk-url={option.sdkUrl}
    >
      <UnicornScene
        jsonFilePath={option.jsonFilePath}
        width={option.width}
        height={option.height}
        scale={option.scale}
        dpi={option.dpi}
        sdkUrl={option.sdkUrl}
        lazyLoad={false}
        className="bt-unicorn-scene"
      />
    </div>
  );
}

export function ChartSwitch({ title, rows }) {
  return <BaseChartSwitch title={title} rows={rows} className="bt-chart-switch" />;
}

export function BayerGrid() {
  const values = [
    0,48,12,60,3,51,15,63,
    32,16,44,28,35,19,47,31,
    8,56,4,52,11,59,7,55,
    40,24,36,20,43,27,39,23,
    2,50,14,62,1,49,13,61,
    34,18,46,30,33,17,45,29,
    10,58,6,54,9,57,5,53,
    42,26,38,22,41,25,37,21,
  ];

  return (
    <div className="bt-bayer-grid">
      {values.map((value, index) => (
        <div key={`${value}-${index}`} style={{ '--v': value / 63 }}>{value}</div>
      ))}
    </div>
  );
}

export function BottomRule({ left, right }) {
  return (
    <div className="bt-bottom-rule">
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}
