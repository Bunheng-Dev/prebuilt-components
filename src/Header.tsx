import React from 'react';
import './Header.css';

export interface NHeaderProps {
  title?: string;
  showTitle?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
  background?: 'solid' | 'transparent';
  shadow?: boolean;
  rightAction?: React.ReactNode;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  /** Inline styles applied to the back button (use to override background, padding, etc.) */
  backButtonStyle?: React.CSSProperties;
} 

const NHeader: React.FC<NHeaderProps> = ({
  title = '',
  showTitle = true,
  showBackButton = false,
  onBack,
  background = 'solid',
  shadow = true,
  rightAction,
  height = 56,
  className = '',
  style,
  backButtonStyle,
}) => { 
  const rootClasses = [
    'n-header',
    background === 'transparent' ? 'n-header--transparent' : 'n-header--solid',
    shadow ? 'n-header--shadow' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const heightStyle: React.CSSProperties = {
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <header
      className={rootClasses}
      style={{ ...heightStyle, ...(style || {}) }}
      role="banner"
    >
      <div className="n-header__left">
        {showBackButton && (
          <button
            type="button"
            aria-label="Back"
            className="n-header__back"
            style={backButtonStyle}
            onClick={() => {
              if (onBack) onBack();
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="n-header__center">
        {showTitle && (
          <div className="n-header__title" aria-live="polite">
            {title}
          </div>
        )}
      </div>

      <div className="n-header__right">{rightAction}</div>
    </header>
  );
};

export default NHeader;
