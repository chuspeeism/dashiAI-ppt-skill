import React from 'react';
import { useSlideViewModel } from '../../view-model/context.jsx';

export function SlideShell({ layout, tone = 'light', hero = false, animate = 'cascade', className = '', children }) {
  const viewModel = useSlideViewModel();
  const classes = ['slide', hero ? 'hero' : '', tone, className].filter(Boolean).join(' ');
  return (
    <section
      className={classes}
      data-layout={layout}
      data-animate={animate}
      data-vm-slide-id={viewModel?.id}
      data-vm-slide-key={viewModel?.key}
      data-vm-layout={viewModel?.layout}
      data-vm-index={viewModel?.index}
      data-style-variant={viewModel?.styleVariant}
      data-style-label={viewModel?.styleVariantLabel}
      data-logical-slide={viewModel?.logicalIndex}
    >
      {children}
    </section>
  );
}
