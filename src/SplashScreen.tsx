import React, { useEffect } from 'react';
import './SplashScreen.css';

export interface NSplashScreenProps {
  /** Whether the component is visible */
  isShow?: boolean;
  /** Whether the splash screen is visible */
  isVisible?: boolean;
  /** Duration in milliseconds before auto-hiding (0 = manual control) */
  duration?: number;
  /** Callback when splash screen should hide */
  onHide?: () => void;
  /** Logo image source URL */
  logoSrc?: string;
  /** Logo alt text */
  logoAlt?: string;
  /** Logo width in pixels */
  logoWidth?: number;
  /** Logo height in pixels */
  logoHeight?: number;
  /** Company name for "Power by" text */
  companyName?: string;
  /** Background color */
  backgroundColor?: string;
  /** Logo style object */
  logoStyle?: React.CSSProperties;
  /** Power by text color */
  powerByColor?: string;
  /** Power by font size */
  powerByFontSize?: number;
  /** Custom power by text (replaces "Power by: {companyName}") */
  powerByText?: string;
  /** Animation type for logo */
  logoAnimation?: 'fadeIn' | 'slideUp' | 'bounce' | 'none';
  /** Animation duration in seconds */
  animationDuration?: number;
  /** Custom CSS class name */
  className?: string;
  /** Custom style object */
  style?: React.CSSProperties;
  /** Z-index for splash screen */
  zIndex?: number;
}

const NSplashScreen: React.FC<NSplashScreenProps> = ({
  isShow = true,
  isVisible = true,
  duration = 3000,
  onHide,
  logoSrc = 'https://via.placeholder.com/120x120/007bff/ffffff?text=Logo',
  logoAlt = 'App Logo',
  logoWidth = 120,
  logoHeight = 120,
  companyName = 'Nealika Co., Ltd',
  backgroundColor = '#ffffff',
  logoStyle,
  powerByColor = '#666666',
  powerByFontSize = 14,
  powerByText,
  logoAnimation = 'fadeIn',
  animationDuration = 1,
  className = '',
  style,
  zIndex = 9999,
}) => {
  useEffect(() => {
    if (isVisible && duration > 0 && onHide) {
      const timer = setTimeout(() => {
        onHide();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onHide]);

  if (!isShow || !isVisible) {
    return null;
  }

  const splashScreenStyle: React.CSSProperties = {
    backgroundColor,
    zIndex,
    ...style,
  };

  const logoContainerStyle: React.CSSProperties = {
    '--animation-duration': `${animationDuration}s`,
  } as React.CSSProperties;

  const finalLogoStyle: React.CSSProperties = {
    width: logoWidth,
    height: logoHeight,
    ...logoStyle,
  };

  const powerByStyle: React.CSSProperties = {
    color: powerByColor,
    fontSize: powerByFontSize,
  };

  const displayPowerByText = powerByText || `Power by: ${companyName}`;

  return (
    <div 
      className={`splash-screen ${className}`}
      style={splashScreenStyle}
    >
      <div className="splash-content">
        <div 
          className={`splash-logo-container splash-logo-${logoAnimation}`}
          style={logoContainerStyle}
        >
          <img
            src={logoSrc}
            alt={logoAlt}
            className="splash-logo"
            style={finalLogoStyle}
          />
        </div>
        
        <div className="splash-power-by" style={powerByStyle}>
          {displayPowerByText}
        </div>
      </div>
    </div>
  );
};

export default NSplashScreen;