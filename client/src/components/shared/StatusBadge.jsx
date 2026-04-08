import React from 'react';

const STATUS_STYLES = {
  verified:       { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', label: 'Verified' },
  approved:       { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', label: 'Approved' },
  completed:      { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', label: 'Completed' },
  pending:        { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', label: 'Pending' },
  in_review:      { bg: 'bg-secondary/10', text: 'text-secondary', border: 'border-secondary/20', label: 'In Review' },
  under_review:   { bg: 'bg-secondary/10', text: 'text-secondary', border: 'border-secondary/20', label: 'Under Review' },
  draft:          { bg: 'bg-outline-variant/10', text: 'text-on-surface-variant', border: 'border-outline-variant/20', label: 'Draft' },
  escrow:         { bg: 'bg-tertiary-container/10', text: 'text-tertiary-container', border: 'border-tertiary-container/20', label: 'In Escrow' },
  flagged:        { bg: 'bg-error/10', text: 'text-error', border: 'border-error/20', label: 'Flagged' },
  rejected:       { bg: 'bg-error/10', text: 'text-error', border: 'border-error/20', label: 'Rejected' },
  officer_review: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', label: 'Officer Review' },
  auto_pass:      { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', label: 'Passed' },
  auto_fail:      { bg: 'bg-error/10', text: 'text-error', border: 'border-error/20', label: 'Failed' },
};

const DEFAULT_STYLE = { bg: 'bg-outline-variant/10', text: 'text-on-surface-variant', border: 'border-outline-variant/20' };

const StatusBadge = ({ status, customLabel }) => {
  const style = STATUS_STYLES[status] || DEFAULT_STYLE;
  const label = customLabel || style.label || status || 'Unknown';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${style.bg} ${style.text} ${style.border}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
