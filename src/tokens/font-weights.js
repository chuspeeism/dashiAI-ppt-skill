const WEIGHT_STEPS = [
  '--fw-01',
  '--fw-02',
  '--fw-03',
  '--fw-04',
  '--fw-05',
  '--fw-06',
  '--fw-07',
  '--fw-08',
  '--fw-09',
  '--fw-10',
  '--fw-11',
  '--fw-12',
];

const WEIGHT_ALIASES = {
  '--weight-caption': '--fw-01',
  '--weight-body': '--fw-03',
  '--weight-label': '--fw-04',
  '--weight-strong': '--fw-06',
  '--weight-heading': '--fw-08',
  '--weight-display': '--fw-11',
  '--weight-number': '--fw-12',
};

function fontWeight(label, steps) {
  const vars = Object.fromEntries(WEIGHT_STEPS.map((name, index) => [name, String(steps[index])]));
  Object.entries(WEIGHT_ALIASES).forEach(([name, step]) => {
    vars[name] = `var(${step})`;
  });
  return { label, vars };
}

export const FONT_WEIGHT_OPTIONS = {
  light: fontWeight('轻字重', [400, 400, 400, 380, 360, 340, 320, 300, 280, 260, 250, 250]),
  regular: fontWeight('标准字重', [400, 400, 400, 450, 500, 550, 600, 650, 700, 740, 780, 800]),
  bold: fontWeight('粗字重', [450, 460, 500, 540, 600, 650, 700, 760, 820, 860, 900, 900]),
};

export const DEFAULT_FONT_WEIGHT = 'regular';
