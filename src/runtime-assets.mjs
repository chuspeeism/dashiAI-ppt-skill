export const RUNTIME_TEMPLATE = 'assets/template-swiss.html';

export const LOCAL_OUTPUT_ASSET_ROOTS = ['assets', 'images', 'uploads'];

export const RUNTIME_ASSET_PATHS = [
  RUNTIME_TEMPLATE,
  'assets/skill/dashiai-ppt-favicon.png',
  'assets/ui-icons/sidebar.svg',
  'assets/social-icons/github.svg',
  'assets/social-icons/douyin.svg',
  'assets/social-icons/redbook.svg',
  'assets/social-icons/bilibili.svg',
  'assets/unicorn/tech_background_remix_scene.json',
  'assets/unicorn/automations_remix_scene.json',
  'assets/unicorn/moving_into_remix_scene.json',
  'assets/unicorn/goey_balls_remix_scene.json',
];

export const GENERATED_RUNTIME_OUTPUT_ASSETS = [
  'assets/imported-theme-runtime.js',
];

export const VENDOR_RUNTIME_OUTPUT_ASSETS = [
  'assets/vendor/gsap.min.js',
  'assets/vendor/pptxgen.bundle.js',
  'assets/vendor/html-to-image.js',
];

export const REQUIRED_OUTPUT_ASSETS = [
  ...RUNTIME_ASSET_PATHS.filter(assetPath => assetPath !== RUNTIME_TEMPLATE),
  ...GENERATED_RUNTIME_OUTPUT_ASSETS,
  ...VENDOR_RUNTIME_OUTPUT_ASSETS,
];
