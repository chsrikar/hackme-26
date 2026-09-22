import React from 'react';

export default function Tag({ children, type = 'default', className = '', style = {} }) {
  let tagClass = 'ui-tag';
  if (type === 'veg') tagClass += ' diet-veg';
  else if (type === 'non-veg') tagClass += ' diet-non-veg';
  else if (type === 'vegan') tagClass += ' diet-vegan';
  else if (type === 'gluten-free') tagClass += ' diet-gluten-free';
  else if (type === 'team') tagClass += ' team-pill';

  return (
    <span className={`${tagClass} ${className}`.trim()} style={style}>
      {children}
    </span>
  );
}
