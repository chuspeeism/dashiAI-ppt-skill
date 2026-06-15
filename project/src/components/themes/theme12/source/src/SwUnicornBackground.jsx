import React from 'react';
import SwImageSlot from './SwImageSlot.jsx';

export const SW_UNICORN_SCENES = [
  { value: 'tech', label: '科技', file: 'assets/unicorn/tech_background_remix_scene.json' },
  { value: 'automations', label: '自动化', file: 'assets/unicorn/automations_remix_scene.json' },
  { value: 'moving', label: '流动', file: 'assets/unicorn/moving_into_remix_scene.json' },
  { value: 'goey', label: '黏球', file: 'assets/unicorn/goey_balls_remix_scene.json' },
];

const DEFAULT_UNICORN_SCENE = 'tech';

export const SW_UNICORN_BACKGROUND_CONTROL = {
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

export const SW_UNICORN_SCENE_CONTROL = {
  key: 'unicornScene',
  label: '动态场景',
  type: 'segment',
  def: DEFAULT_UNICORN_SCENE,
  options: SW_UNICORN_SCENES.map(({ value, label }) => ({ value, label })),
  dependsOn: 'backgroundMode',
  dependsOnValue: 'unicorn',
  desc: '选择固定 Unicorn shader 场景',
};

export function createSwUnicornSceneControl(def = DEFAULT_UNICORN_SCENE) {
  return { ...SW_UNICORN_SCENE_CONTROL, def };
}

function getSwUnicornSceneFile(scene) {
  return SW_UNICORN_SCENES.find(item => item.value === scene)?.file || SW_UNICORN_SCENES[0].file;
}

export function SwBackgroundLayer({ mode = 'unicorn', scene = DEFAULT_UNICORN_SCENE, media = [], onMediaChange = () => {}, fit = 'cover', accent, placeholder, tone = 'dark' }) {
  const value = Array.isArray(media) ? media[0] : media;
  if (mode === 'unicorn') return <SwUnicornBackground accent={accent} scene={scene} />;
  return (
    <SwImageSlot value={value || null} onChange={(s) => onMediaChange(0, s)}
      fit={fit} accent={accent} radius={0} tone={tone} placeholder={placeholder} />
  );
}

export default function SwUnicornBackground({ accent = '#f15a29', scene = DEFAULT_UNICORN_SCENE }) {
  const filePath = getSwUnicornSceneFile(scene);
  return (
    <div key={filePath} className="bt-unicorn-frame sw-unicorn-frame"
      data-unicorn-json-file-path={filePath}
      data-unicorn-scale="1"
      data-unicorn-dpi="1.5"
      data-unicorn-sdk-url="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.12/dist/unicornStudio.umd.js"
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden', background: '#05070b', ['--sw-unicorn-accent']: accent }}>
      <div className="bt-unicorn-scene" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
    </div>
  );
}
