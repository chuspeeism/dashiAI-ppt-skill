# Imported Deck Tokenization Notes

This file tracks source decks imported into the component system and the design details that may be weakened when the original HTML is rebuilt as token-driven React components.

## Source Inventory

| Source | Current readable pages | Imported status |
| --- | ---: | --- |
| `/Users/jadon7/Downloads/claude design 测试/0524 备份/汇报 PPT` | 16 | Imported as `rp01`-`rp16` |
| `/Users/jadon7/Downloads/claude design 测试/0524 备份/小红书分享` | 26 | Imported as `xhs01`-`xhs26` |
| `/Users/jadon7/Downloads/claude design 测试/0524 备份/小红书分享 2` | 34 | Imported as `xhs2_01`-`xhs2_34` |
| `/Users/jadon7/Downloads/claude design 测试/0524 备份/小红书分享3` | 25 | Imported as `xhs3_01`-`xhs3_25` |
| `/Users/jadon7/Downloads/claude design 测试/0524 备份/html 特性效果` | 5 in `index.zh.html` | Imported source had `hfx01`-`hfx05`; current project keeps `hfx02` only |
| `/Users/jadon7/Downloads/claude design 测试/style1` | 6 | Imported as `style1_01`-`style1_06` |
| `/Users/jadon7/Downloads/claude design 测试/style2` | 6 | Imported as `style2_01`-`style2_06` |

## `汇报 PPT` -> `rp01`-`rp16`

Source file: `/Users/jadon7/Downloads/claude design 测试/0524 备份/汇报 PPT/Year End Review v1.html`

Imported pages:

- `rp01`: cover mosaic
- `rp02`: yearly stat overview
- `rp03`: quarterly agenda
- `rp04`-`rp07`: quarterly section divider pages
- `rp08`: pipeline table
- `rp09`: channel bar chart
- `rp10`: brand-lift quote page
- `rp11`: content metric grid
- `rp12`: community mosaic
- `rp13`: worked-well card grid
- `rp14`: missed-expectations cards
- `rp15`: 2026 priorities
- `rp16`: closing mosaic

Known tokenization losses:

- Original used exact 1920x1080 pixel values and dense inline positioning; the imported version uses responsive `vw/vh` and project type tokens, so a few geometric proportions are approximate.
- Original had a large embedded custom Chinese display font; imported components use the project title/body font tokens, so the title character shape differs.
- Original Bauhaus art used slide-specific inline shape placement; imported components keep the major motifs but simplify some secondary shape positions.
- Original table and chart spacing was tuned per slide; imported components normalize table, bar, card, and footer spacing to shared `rp-*` tokens.
- Original fixed brand palette is preserved as `--rp-*` local tokens, but it is not fully mapped to the global theme options yet.

## `小红书分享` -> `xhs01`-`xhs26`

Source file: `/Users/jadon7/Downloads/claude design 测试/0524 备份/小红书分享/deck.html`

Imported pages:

- `xhs01`: cover
- `xhs02`: creator/about page with six video-cover slots
- `xhs03`: AI anti-anxiety statement
- `xhs04`: counter-current topic cards
- `xhs05`: AI capability examples
- `xhs06`: GitHub AI code contribution statement
- `xhs07`: transition into AI boundaries
- `xhs08`: FOMO answer and four boundary cards
- `xhs09`-`xhs13`: model collapse section
- `xhs14`-`xhs15`: Agent/context section
- `xhs16`-`xhs18`: token probability and capability section
- `xhs19`-`xhs20`: existing-data boundary and no-anxiety manifesto
- `xhs21`-`xhs25`: hallucination, bias, safety, deepfake, and real-world incident pages
- `xhs26`: ending

Known tokenization losses:

- Original slides use many inline one-off positions and exact 1920x1080 pixel values; imported pages normalize these into `xhs-*` grids, cards, and statement layouts.
- Original arrow/arc decorative shapes on the cover are simplified to a tokenized arc and text composition.
- Original image/video placeholders are represented as reusable placeholder blocks, not the exact source placeholder styling on every page.
- Original card heights and per-card inline padding are normalized; dense slides such as pages 21-25 are more template-driven.
- Original palette is preserved as local XHS tokens (`--xhs-*`) but is not yet fully controlled by the global theme selector.
- Some source pages use highly specific line breaks; imported components keep the main hierarchy and copy but may differ in exact wrapping.

## `小红书分享 2` -> `xhs2_01`-`xhs2_34`

Source file: `/Users/jadon7/Downloads/claude design 测试/0524 备份/小红书分享 2/AI 反焦虑.html`

Imported pages:

- `xhs2_01`: cover with yellow arrow art and dark title area
- `xhs2_02`: creator intro and six video-cover placeholders
- `xhs2_03`-`xhs2_04`: AI anti-anxiety philosophy and counter-current topics
- `xhs2_05`-`xhs2_07`: AI capability, transition, and FOMO boundary overview
- `xhs2_08`-`xhs2_13`: model collapse, slop, originality, and IP/taste section
- `xhs2_14`-`xhs2_15`: Agent/prompt-engineering and context explosion section
- `xhs2_16`-`xhs2_19`: token probability, closed system, probabilistic output, and verification cases
- `xhs2_20`-`xhs2_22`: stock-data dependency, stitched capabilities, and shadow/light summary
- `xhs2_23`-`xhs2_28`: hallucination, bias, safety, deepfake, geopolitical, and nearby-risk pages
- `xhs2_29`-`xhs2_33`: platform labeling, Image v2 deepfake list, governance, time gap, and official supplement
- `xhs2_34`: closing page

Known tokenization losses:

- Original has many inline decorative arrow constructions, corner ticks, dotted lines, and exact block offsets; imported components preserve the page roles and major motifs but reduce one-off geometry into reusable `xhs2-*` primitives.
- Original uses six accent colors with per-slide manual emphasis; imported pages map these to local tokens and a single active accent per slide.
- Original placeholder areas use source-specific labels, borders, and ratios; imported pages normalize them into reusable media placeholders.
- Original pages 23-30 include dense legal/risk examples and image/video slots; imported pages retain the structure and copy but use consistent risk-card grids rather than exact source spacing.
- Original line breaks and 1920px typography are approximated with responsive type tokens, so some large statement pages wrap differently.

## `小红书分享3` -> `xhs3_01`-`xhs3_25`

Source file: `/Users/jadon7/Downloads/claude design 测试/0524 备份/小红书分享3/小红书AI开放日.html`

Imported pages:

- `xhs3_01`: cover for XHS AI Open Day
- `xhs3_02`: speaker introduction
- `xhs3_03`: six-video metrics page using imported image assets
- `xhs3_04`-`xhs3_05`: anti-anxiety belief and counter-current topics
- `xhs3_06`-`xhs3_09`: part dividers, AI strength examples, and boundary transition
- `xhs3_10`-`xhs3_18`: model collapse, SLOP, originality, expertise, Agent/context, token prediction, tests, and shadow/source conclusion
- `xhs3_19`-`xhs3_24`: AI risk section, hallucination, bias, Agent security, deepfake, timing gap, and governance
- `xhs3_25`: closing page

Known tokenization losses:

- Original deck-stage authored every slide at fixed 1920x1080 with inline pixel positions; imported components use responsive `xhs3-*` grids and type clamps.
- Original has exact header/footer offsets, scanline overlays, gradient fields, and per-slide noise; imported pages preserve the major field/noise/ink/accent motifs but simplify secondary texture placement.
- Original image crops were slide-specific inline `object-fit`/`object-position`; imported image assets are reused through a common `MediaCard`, so some crop windows are approximate.
- Original dense risk pages used hand-tuned spacing for legal/security examples; imported pages normalize them into reusable card/list columns.
- Original page numbering had some `022/025` inconsistencies; imported pages normalize the sequence to `001/025` through `025/025`.
- Local image assets are copied into `assets/imported/xhs3/` and then into rendered output, rather than relying on the original Downloads directory.

## `html 特性效果` -> `hfx02`

Source file: `/Users/jadon7/Downloads/claude design 测试/0524 备份/html 特性效果/index.zh.html`

Imported pages:

- `hfx02`: Orbit Runner game intro with arcade copy, stats, and game visual area

Known tokenization losses:

- The user target says 235 pages, but the current readable source directory only contains 5 `<section>` slides in `index.zh.html` and `index.html`; no 235-page source artifact was found in this directory during import.
- `hfx01`, `hfx03`, `hfx04`, and `hfx05` were removed from the active component registry and demo after review.
- Original `hfx02` wires a live Rive runtime and 13 MB `.riv`/data files. The imported page keeps the layout and game-card affordance but replaces the live game with tokenized CSS orbital visuals.
- Source pages used exact 1920x1080 pixel CSS and embedded subset fonts; imported components use project font/type tokens and responsive CSS, so exact letterform, line break, and object placement will differ.

## `style1` -> `style1_01`-`style1_06`

Source file: `/Users/jadon7/Downloads/claude design 测试/style1/index.html`

Imported pages:

- `style1_01`: color trend report cover
- `style1_02`: five-color bar chart
- `style1_03`: color naming typography page
- `style1_04`: brand mood matrix
- `style1_05`: mascot cast lineup
- `style1_06`: ending page

Known tokenization losses:

- Original uses embedded SVG symbols and exact 1920x1080 CSS; imported pages redraw mascot/logo primitives inline and map typography to project font tokens.
- Original imported directory includes an upload image, but the source HTML does not reference it; no unused image resource was copied into the component system.
- Original has Google font choices for Chinese serif/sans and Instrument Serif; imported pages approximate them with current title/body/number/mono tokens.
- Original chip shadows, aura blur, and per-row offsets are preserved directionally but normalized into prefixed `st1-*` CSS.

## `style2` -> `style2_01`-`style2_06`

Source file: `/Users/jadon7/Downloads/claude design 测试/style2/幕間 2026 影像年鑑.html`

Imported pages:

- `style2_01`: dark blue editorial cover
- `style2_02`: manifesto quote page
- `style2_03`: image-consumption data chart
- `style2_04`: editorial article spread
- `style2_05`: visual chapter divider
- `style2_06`: closing credits page

Known tokenization losses:

- Original uses Noto Serif TC, Noto Sans TC, and JetBrains Mono; imported pages map these roles to the project font tokens.
- Original includes several uploaded image files, but the inspected HTML does not reference them; the imported visual page keeps the source placeholder-style canvas rather than copying unused uploads.
- Original fixed pixel spacing is converted to responsive CSS with prefixed `st2-*` classes, so exact line breaks and article column balance can differ.
- Original brushwash/grain effects are recreated with CSS gradients and repeating lines, not the deck-stage runtime.
