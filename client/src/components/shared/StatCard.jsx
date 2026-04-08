import React from 'react';

/**
 * Compact stat card used in all dashboard pages.
 * Consistent styling: glass panel, icon right, label + value left.
 */
const StatCard = ({ label, value, icon: IconComponent, iconColor = 'primary', loading = false, accentBorder = false }) => (
  <div className={`bg-surface-container p-5 rounded-xl flex items-center justify-between transition-all hover:bg-surface-container-high/80 ${accentBorder ? `border-l-[3px] border-${iconColor}` : ''}`}>
    <div>
      <p className="text-[10px] font-label uppercase tracking-[0.12em] text-on-surface-variant mb-1.5">{label}</p>
      <h3 className="text-2xl font-headline font-bold text-on-surface leading-none">
        {loading ? <span className="inline-block w-8 h-6 bg-surface-container-high rounded animate-pulse" /> : value}
      </h3>
    </div>
    {IconComponent && (
      <div className={`p-2.5 bg-${iconColor}/10 rounded-lg`}>
        <IconComponent className={`text-${iconColor}`} size={18} />
      </div>
    )}
  </div>
);

export default StatCard;
