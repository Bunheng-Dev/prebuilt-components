import React, { useEffect, useState } from 'react';
import './Toast.css';

export interface NToastProps {
  /** Whether the component is visible */
  isShow?: boolean;
  /** Whether the toast is visible */
  isVisible?: boolean;
  /** Toast message text */
  message?: string;
  /** Toast description text (optional secondary text) */
  description?: string;
  /** Toast type for styling */
  type?: 'success' | 'error' | 'warning' | 'info' | 'default';
  /** Duration in milliseconds before auto-hiding (0 = manual control) */
  duration?: number;
  /** Callback when toast should hide */
  onHide?: () => void;
  /** Toast position */
  position?: 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right' | 'center';
  /** Custom icon (React node or string) */
  icon?: React.ReactNode | string;
  /** Whether to show close button */
  showCloseButton?: boolean;
  /** Animation type */
  animation?: 'slideIn' | 'fadeIn' | 'bounceIn' | 'none';
  /** Animation duration in seconds */
  animationDuration?: number;
  /** Background color override */
  backgroundColor?: string;
  /** Text color override */
  textColor?: string;
  /** Border radius */
  borderRadius?: number;
  /** Custom CSS class */
  className?: string;
  /** Custom style object */
  style?: React.CSSProperties;
  /** Z-index for positioning */
  zIndex?: number;
  /** Maximum width */
  maxWidth?: number;
  /** Whether to pause on hover */
  pauseOnHover?: boolean;
  /** Action button text */
  actionText?: string;
  /** Action button callback */
  onActionClick?: () => void;
  /** Rich content instead of simple message */
  children?: React.ReactNode;
}

const NToast: React.FC<NToastProps> = ({
  isShow = true,
  isVisible = true,
  message = 'Notification',
  description,
  type = 'default',
  duration = 8000,
  onHide,
  position = 'top',
  icon,
  showCloseButton = true,
  animation = 'slideIn',
  animationDuration = 0.35, // in seconds
  backgroundColor,
  textColor,
  borderRadius = 8,
  className = '',
  style,
  zIndex = 10000, // in pixels
  maxWidth = 400, // in pixels
  pauseOnHover = true,
  actionText,
  onActionClick,
  children,
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const startY = React.useRef(0);
  const startTime = React.useRef(0);
  const prevVisibleRef = React.useRef(false);

  useEffect(() => {
    if (isShow && isVisible && duration > 0 && onHide && !isPaused) {
      const timer = setTimeout(() => {
        handleHide();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isShow, isVisible, duration, onHide, isPaused]);

  useEffect(() => {
    const currentVisible = isShow && isVisible;
    
    // Reset exiting state when toast becomes visible again
    if (currentVisible) {
      setIsExiting(false);
      setDragOffset(0);
      setIsDragging(false);
      
      // Increment progress key when transitioning from hidden to visible
      if (!prevVisibleRef.current) {
        setProgressKey(prev => prev + 1);
      }
    }
    
    prevVisibleRef.current = currentVisible;
  }, [isShow, isVisible]);

  if (!isShow || !isVisible) {
    return null;
  }

  const handleHide = () => {
    setIsExiting(true);
    // Small delay to allow exit animation
    setTimeout(() => {
      if (onHide) {
        onHide();
      }
    }, animationDuration * 1000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (showCloseButton) return; // Only allow swipe when close button is hidden
    startY.current = e.touches[0].clientY;
    startTime.current = Date.now();
    setIsDragging(true);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || showCloseButton) return;
    
    const currentY = e.touches[0].clientY;
    const diff = startY.current - currentY;
    
    // Only allow upward swipe for top positions, downward for bottom positions
    const isTopPosition = position.includes('top') || position === 'center';
    const isBottomPosition = position.includes('bottom');
    
    if (isTopPosition && diff > 0) {
      setDragOffset(diff);
    } else if (isBottomPosition && diff < 0) {
      setDragOffset(Math.abs(diff));
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || showCloseButton) return;
    
    const swipeTime = Date.now() - startTime.current;
    const swipeVelocity = dragOffset / swipeTime;
    
    // Dismiss if dragged more than 50px or fast swipe
    if (dragOffset > 50 || swipeVelocity > 0.3) {
      handleHide();
    } else {
      // Reset position
      setDragOffset(0);
    }
    
    setIsDragging(false);
    setIsPaused(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (showCloseButton) return;
    startY.current = e.clientY;
    startTime.current = Date.now();
    setIsDragging(true);
    setIsPaused(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || showCloseButton) return;
    
    const diff = startY.current - e.clientY;
    const isTopPosition = position.includes('top') || position === 'center';
    const isBottomPosition = position.includes('bottom');
    
    if (isTopPosition && diff > 0) {
      setDragOffset(diff);
    } else if (isBottomPosition && diff < 0) {
      setDragOffset(Math.abs(diff));
    }
  };

  const handleMouseUp = () => {
    if (!isDragging || showCloseButton) return;
    
    const swipeTime = Date.now() - startTime.current;
    const swipeVelocity = dragOffset / swipeTime;
    
    if (dragOffset > 50 || swipeVelocity > 0.3) {
      handleHide();
    } else {
      setDragOffset(0);
    }
    
    setIsDragging(false);
    setIsPaused(false);
  };

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  const getDefaultIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22,4 12,14.01 9,11.01"></polyline>
          </svg>
        );
      case 'error':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        );
      case 'warning':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <path d="m12 17 .01 0"></path>
          </svg>
        );
      case 'info':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <path d="m12 8 .01 0"></path>
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
          </svg>
        );
    }
  };

  const toastStyle: React.CSSProperties = {
    backgroundColor,
    color: textColor,
    borderRadius,
    zIndex,
    maxWidth,
    '--animation-duration': `${animationDuration}s`,
    transform: isDragging 
      ? position.includes('bottom') 
        ? `translateY(${dragOffset}px)` 
        : `translateY(-${dragOffset}px)`
      : undefined,
    transition: isDragging ? 'none' : 'transform 0.2s ease-out',
    cursor: showCloseButton ? 'default' : 'grab',
    ...style,
  } as React.CSSProperties;

  const displayIcon = icon !== undefined ? icon : getDefaultIcon();

  return (
    <div 
      className={`toast-container toast-${position} toast-${animation}`}
      style={{ zIndex }}
    >
      <div
        className={`
          toast-notification
          toast-${type}
          ${isExiting ? 'toast-exit' : 'toast-enter'}
          ${className}
        `}
        style={toastStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        role="alert"
        aria-live="polite"
      >
        {/* Icon */}
        {displayIcon && (
          <div className="toast-icon">
            {typeof displayIcon === 'string' ? (
              <span>{displayIcon}</span>
            ) : (
              displayIcon
            )}
          </div>
        )}

        {/* Content */}
        <div className="toast-content">
          {children ? (
            children
          ) : (
            <>
              <div className="toast-message">{message}</div>
              {description && (
                <div className="toast-description">{description}</div>
              )}
            </>
          )}
          
          {actionText && onActionClick && (
            <button 
              className="toast-action-button"
              onClick={onActionClick}
              type="button"
            >
              {actionText}
            </button>
          )}
        </div>

        {/* Close Button */}
        {showCloseButton && (
          <button
            className="toast-close-button"
            onClick={handleHide}
            aria-label="Close notification"
            type="button"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}

        {/* Progress Bar (if duration is set) */}
        {duration > 0 && (
          <div 
            key={`progress-${progressKey}`}
            className="toast-progress"
            style={{
              animationDuration: `${duration}ms`,
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default NToast;