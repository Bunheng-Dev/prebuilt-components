import React from 'react';
import './NEmptyState.css';

export interface NEmptyStateProps {
  icon?: React.ReactNode;
  imageSrc?: string;            // url or local path
  imageAlt?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const DefaultIcon = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 8h8M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const NEmptyState: React.FC<NEmptyStateProps> = ({
  icon,
  imageSrc,
  imageAlt,
  title = 'No data',
  description = 'Try again later',
  action,
  className = '',
  style = {},
}) => {
  return (
    <div className={`n-empty-state ${className}`.trim()} style={style} role="status" aria-live="polite">
      <div className="n-empty-state__icon">
        {imageSrc ? (
          <img className="n-empty-state__image" src={imageSrc} alt={imageAlt ?? title} />
        ) : (
          icon ?? <DefaultIcon />
        )}
      </div>
      <div className="n-empty-state__title">{title}</div>
      {description && <div className="n-empty-state__description">{description}</div>}
      {action && <div className="n-empty-state__action">{action}</div>}
    </div>
  );
};

export default NEmptyState;
