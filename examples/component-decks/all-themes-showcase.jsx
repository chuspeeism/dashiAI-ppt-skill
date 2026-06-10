import { slide, DEFAULT_THEME_PACK } from '../../src/options.jsx';
import { THEME_PAGES } from '../../src/components/themes/index.jsx';

export default {
  themePack: DEFAULT_THEME_PACK,
  title: '主题调试总览',
  preview: { themeSwitcher: true },
  slides: THEME_PAGES.map((page) => slide(page.key)),
};
