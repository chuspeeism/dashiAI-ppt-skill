import React from 'react';

export const UNICORN_SCENES = [
  { value: 'tech', label: '科技', file: 'assets/unicorn/tech_background_remix_scene.json' },
  { value: 'automations', label: '自动化', file: 'assets/unicorn/automations_remix_scene.json' },
  { value: 'moving', label: '流动', file: 'assets/unicorn/moving_into_remix_scene.json' },
  { value: 'goey', label: '黏球', file: 'assets/unicorn/goey_balls_remix_scene.json' },
];

export const DEFAULT_UNICORN_SCENE = 'tech';

export const UNICORN_BACKGROUND_CONTROL = {
  key: 'backgroundMode',
  label: '背景替换',
  type: 'segment',
  def: 'unicorn',
  options: [
    { value: 'unicorn', label: '动态' },
    { value: 'media', label: '上传' },
  ],
  desc: '动态 shader 或自定义背景媒体',
};

export const UNICORN_SCENE_CONTROL = {
  key: 'unicornScene',
  label: '动态场景',
  type: 'segment',
  def: DEFAULT_UNICORN_SCENE,
  options: UNICORN_SCENES.map(({ value, label }) => ({ value, label })),
  dependsOn: 'backgroundMode',
  dependsOnValue: 'unicorn',
  desc: '选择固定 Unicorn shader 场景',
};

export function createUnicornSceneControl(def = DEFAULT_UNICORN_SCENE) {
  return { ...UNICORN_SCENE_CONTROL, def };
}

function getUnicornSceneFile(scene) {
  return UNICORN_SCENES.find(item => item.value === scene)?.file || UNICORN_SCENES[0].file;
}

export default function UnicornBackground({ accent = '#15A7F0', scene = DEFAULT_UNICORN_SCENE }) {
  const filePath = getUnicornSceneFile(scene);
  return (
    <div key={filePath} className="bt-unicorn-frame"
      data-unicorn-json-file-path={filePath}
      data-unicorn-scale="1"
      data-unicorn-dpi="1.5"
      data-unicorn-sdk-url="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.12/dist/unicornStudio.umd.js"
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden', background: '#05070b', ['--unicorn-accent']: accent }}>
      <div className="bt-unicorn-scene" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
    </div>
  );
}
