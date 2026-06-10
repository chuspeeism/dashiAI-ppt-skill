// swTheme.js — design tokens for the 声浪 / SoundWave slide system.
// Plain data, no global side effects. Components read these for inline styles
// so nothing is written to :root. Override any value by passing an `accent`
// prop (or your own merged theme) — see each slide's `controls`.

export const swTheme = {
  color: {
    blush: '#f5e1e3',
    paper: '#ffffff',
    ink: '#1b1518',
    dark: '#1c1416',
    inkMut: '#7d7176',

    purple: '#5a138e', magenta: '#d61fb5', plum: '#f3b8ec',
    cyan: '#3bb6ec', navy: '#143049',
    green: '#1f6b2a', lime: '#baf04f',
    orange: '#f15a29', peach: '#fdddc6', rust: '#7a3a18',

    hlO: '#fbb24d', hlP: '#c44ee0', hlC: '#74d2f0', hlG: '#bcee54',

    line: 'rgba(27,21,24,.16)',
    line2: 'rgba(27,21,24,.30)',
    lineD: 'rgba(245,225,227,.16)',
    lineD2: 'rgba(245,225,227,.32)',
  },
  font: {
    sans: "'Noto Sans SC', system-ui, sans-serif",
    mono: "'Space Mono', ui-monospace, monospace",
  },
  type: { hero: 124, h1: 74, h2: 64, h3: 33, body: 25, label: 24 },
  pad: { x: 96, t: 54, b: 48 },
  radius: 30,
};

// Curated accent options surfaced as a universal "accent color" control.
export const swAccents = ['#f15a29', '#5a138e', '#3bb6ec', '#1f6b2a'];

// The product-card colour set used by the matrix slide. Generic, reorderable.
export const swCardPalette = [
  { bg: '#5a138e', title: '#ffffff', name: '#f3b8ec', sub: '#b885cc', body: '#e7cdf0', tagBg: '#d61fb5', tagFg: '#ffffff', deco: ['#d61fb5', '#f3b8ec'] },
  { bg: '#3bb6ec', title: '#143049', name: '#143049', sub: '#1c5b82', body: '#143049', tagBg: '#143049', tagFg: '#ffffff', deco: ['#bfe8fa', '#7cc8ee', '#143049'] },
  { bg: '#1f6b2a', title: '#ffffff', name: '#baf04f', sub: '#7fc089', body: '#cdeccf', tagBg: '#baf04f', tagFg: '#234d12', deco: ['#3f9e54', '#baf04f'] },
  { bg: '#fdddc6', title: '#a8330f', name: '#f15a29', sub: '#b06b3e', body: '#7a3a18', tagBg: '#f15a29', tagFg: '#ffffff', deco: ['#f15a29'] },
];

// Stat accent cycle for the metrics slide.
export const swStatColors = ['#f15a29', '#74d2f0', '#baf04f', '#c44ee0'];

// Generic data-series accent cycle, reused by table / timeline / big-number
// supporting visuals. Stable order so a host can rely on index → colour.
export const swSeriesColors = ['#f15a29', '#3bb6ec', '#baf04f', '#c44ee0', '#1f6b2a'];
