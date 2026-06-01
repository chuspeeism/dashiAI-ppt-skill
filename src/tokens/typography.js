const TYPE_STEPS = [
  ['--fs-01', 12, 0.76, 14],
  ['--fs-02', 15, 0.86, 18],
  ['--fs-03', 17, 1, 22],
  ['--fs-04', 20, 1.36, 30],
  ['--fs-05', 26, 1.85, 40],
  ['--fs-06', 32, 2.2, 52],
  ['--fs-07', 42, 3, 68],
  ['--fs-08', 52, 4, 96],
  ['--fs-09', 64, 4.8, 116],
  ['--fs-10', 80, 6.6, 152],
  ['--fs-11', 100, 8.8, 210],
  ['--fs-12', 124, 11, 260],
];

const TYPE_ALIASES = {
  '--fs-caption': '--fs-01',
  '--fs-body-sm': '--fs-02',
  '--fs-body': '--fs-03',
  '--fs-lead': '--fs-04',
  '--fs-subtitle': '--fs-05',
  '--fs-h4': '--fs-06',
  '--fs-h3': '--fs-08',
  '--fs-h2': '--fs-09',
  '--fs-h1': '--fs-10',
  '--fs-display': '--fs-11',
  '--fs-number-md': '--fs-09',
  '--fs-number-lg': '--fs-12',
};

const TYPE_FACTORS = {
  large: [1.02, 1.03, 1.04, 1.05, 1.07, 1.09, 1.11, 1.13, 1.15, 1.17, 1.2, 1.23],
  medium: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  small: [0.96, 0.95, 0.94, 0.93, 0.91, 0.89, 0.87, 0.85, 0.83, 0.81, 0.79, 0.77],
};

function scaledClamp(min, vw, max, factor) {
  if(factor === 1) return `clamp(${min}px,${vw}vw,${max}px)`;
  return `clamp(calc(${min}px * ${factor}),calc(${vw}vw * ${factor}),calc(${max}px * ${factor}))`;
}

function makeTypeScaleVars(factors) {
  const vars = Object.fromEntries(TYPE_STEPS.map(([name, min, vw, max], index) => [
    name,
    scaledClamp(min, vw, max, factors[index]),
  ]));
  Object.entries(TYPE_ALIASES).forEach(([name, step]) => {
    vars[name] = `var(${step})`;
  });
  return vars;
}

export const TYPE_SCALE_OPTIONS = {
  large: {
    label: '大字号',
    vars: makeTypeScaleVars(TYPE_FACTORS.large),
  },
  medium: {
    label: '中字号',
    vars: makeTypeScaleVars(TYPE_FACTORS.medium),
  },
  small: {
    label: '小字号',
    vars: makeTypeScaleVars(TYPE_FACTORS.small),
  },
};

export const DEFAULT_TYPE_SCALE = 'medium';
