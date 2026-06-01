import React from 'react';

export function Icon({ name = 'sparkling-2-line', slotId, tone = 'red', className = '' }) {
  const iconName = name.startsWith('ri-') ? name.slice(3) : name;

  return (
    <button
      type="button"
      className={`remix-icon-slot tone-${tone} ${className}`.trim()}
      data-icon-slot={slotId || iconName}
      data-remix-icon={iconName}
      aria-label="替换图标"
    >
      <i className={`ri-${iconName}`} aria-hidden="true" />
    </button>
  );
}
