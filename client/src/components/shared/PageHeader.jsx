import React from 'react';

/**
 * Consistent page header used across all dashboard pages.
 * Provides uniform typography, spacing, and optional badge/action area.
 */
const PageHeader = ({ title, subtitle, badge, actions, icon: IconComponent }) => (
  <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
    <div className="flex items-start gap-4">
      {IconComponent && (
        <div className="hidden sm:flex w-12 h-12 rounded-xl bg-primary/10 items-center justify-center mt-1 shrink-0">
          <IconComponent className="text-primary" size={22} />
        </div>
      )}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-[28px] md:text-[32px] font-headline font-bold tracking-tight text-on-surface leading-none">
            {title}
          </h1>
          {badge && (
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-on-surface-variant mt-1.5 font-body max-w-lg">
            {subtitle}
          </p>
        )}
      </div>
    </div>
    {actions && <div className="flex items-center gap-3">{actions}</div>}
  </header>
);

export default PageHeader;
