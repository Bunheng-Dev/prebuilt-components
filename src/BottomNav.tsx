import React from 'react';
import './BottomNav.css';

export interface BottomNavItem {
  id: string;
  label: string;
  icon?: React.ReactNode | string;
  activeIcon?: React.ReactNode | string;
  badge?: string | number;
  disabled?: boolean;
  iconColor?: string;
  activeIconColor?: string;
  textColor?: string;
  activeTextColor?: string;
  backgroundColor?: string;
  activeBackgroundColor?: string;
  textStyle?: React.CSSProperties;
  iconStyle?: React.CSSProperties;
  // Allow additional properties for custom extensions (like route, etc.)
  [key: string]: any;
}

export interface NBottomNavProps {
  /**
   * Whether the component is visible
   */
  isShow?: boolean;
  /**
   * Array of navigation items
   */
  items: BottomNavItem[];
  
  /**
   * Currently active item id
   */
  activeId: string;
  
  /**
   * Callback when item is clicked
   */
  onItemClick: (item: BottomNavItem) => void;
  
  /**
   * Navigation bar variant
   */
  variant?: 'default' | 'filled' | 'minimal' | 'floating';
  
  /**
   * Size of the navigation bar
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Whether to show labels
   */
  showLabels?: boolean;
  
  /**
   * Whether to use haptic feedback (for mini apps)
   */
  hapticFeedback?: boolean;
  
  /**
   * Custom background color
   */
  backgroundColor?: string;
  
  /**
   * Custom active color (fallback for items without custom colors)
   */
  activeColor?: string;
  
  /**
   * Custom inactive color (fallback for items without custom colors)
   */
  inactiveColor?: string;
  
  /**
   * Safe area bottom padding for devices with notch
   */
  safeAreaPadding?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Custom styles
   */
  style?: React.CSSProperties;
  
  /**
   * Whether to show divider line at top
   */
  showDivider?: boolean;
  
  /**
   * Animation type for active state
   */
  animation?: 'scale' | 'bounce' | 'slide' | 'none';
  
  /**
   * Click animation type for user interactions
   */
  clickAnimation?: 'pulse' | 'ripple' | 'scale-bounce' | 'shake' | 'rotate' | 'none';
  
  /**
   * Animation duration in milliseconds
   */
  animationDuration?: number;
  
  /**
   * Border radius for the navigation bar
   */
  borderRadius?: number | string;
  
  /**
   * Top border radius (Tailwind-like: 4=sm, 8=md, 12=lg, 16=xl, 20=2xl, 24=3xl)
   */
  roundedTop?: number;
  
  /**
   * Custom shadow/elevation
   */
  boxShadow?: string;
  
  /**
   * Height of the navigation bar
   */
  height?: number | string;
  
  /**
   * Padding for the entire navigation
   */
  padding?: number | string;
  
  /**
   * Gap between navigation items
   */
  itemGap?: number | string;
  
  /**
   * Border width for outlined variant
   */
  borderWidth?: number | string;
  
  /**
   * Border color
   */
  borderColor?: string;
  
  /**
   * Text font family
   */
  fontFamily?: string;
  
  /**
   * Text font size
   */
  fontSize?: number | string;
  
  /**
   * Text font weight
   */
  fontWeight?: number | string;
  
  /**
   * Icon size (when using string icons)
   */
  iconSize?: number | string;
  
  /**
   * Badge styling
   */
  badgeStyle?: {
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: number | string;
    fontSize?: number | string;
    fontWeight?: number | string;
    border?: string;
    borderColor?: string;
    borderWidth?: number | string;
    minWidth?: number | string;
    height?: number | string;
    padding?: string;
    position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left';
    offset?: {
      top?: number | string;
      right?: number | string;
      bottom?: number | string;
      left?: number | string;
    };
    boxShadow?: string;
    transform?: string;
    zIndex?: number;
  };
  
  /**
   * Add top shadow/blur effect above navigation
   */
  topShadow?: boolean;
  
  /**
   * Custom top shadow styling
   */
  topShadowStyle?: {
    height?: number | string;
    blur?: number | string;
    color?: string;
    opacity?: number;
  };
}

// Helper function to convert hex color to CSS filter for SVG colorization
const getColorFilter = (color: string): string => {
  // This is a simplified filter generation - for more accurate color conversion,
  // you might want to use a more sophisticated color-to-filter library
  if (color.startsWith('#')) {
    // Convert hex to RGB and create a filter approximation
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    
    // Simple approximation - for production, consider using a color-to-filter library
    const brightness = (r + g + b) / 3;
    const sepia = Math.min(1, Math.max(0, (r + g - b) / 2));
    
    return `sepia(${sepia}) brightness(${brightness * 2})`;
  }
  
  // For CSS variables or other color formats, return a neutral filter
  return 'brightness(1)';
};

// Helper function to get badge positioning styles
const getBadgePosition = (position: string, offset?: any): React.CSSProperties => {
  const defaultOffset = {
    top: offset?.top || '-6px',
    right: offset?.right || '-6px',
    bottom: offset?.bottom || '-6px',
    left: offset?.left || '-6px'
  };
  
  switch (position) {
    case 'top-left':
      return { top: defaultOffset.top, left: defaultOffset.left, right: 'auto' };
    case 'top-center':
      return { top: defaultOffset.top, left: '50%', right: 'auto', transform: 'translateX(-50%)' };
    case 'top-right':
    default:
      return { top: defaultOffset.top, right: defaultOffset.right };
    case 'bottom-right':
      return { bottom: defaultOffset.bottom, right: defaultOffset.right, top: 'auto' };
    case 'bottom-left':
      return { bottom: defaultOffset.bottom, left: defaultOffset.left, top: 'auto', right: 'auto' };
  }
};

const NBottomNav: React.FC<NBottomNavProps> = ({
  isShow = true,
  items,
  activeId,
  onItemClick,
  variant = 'default',
  size = 'medium',
  showLabels = true,
  hapticFeedback = false,
  backgroundColor = '#ffffff',
  activeColor,
  inactiveColor,
  safeAreaPadding = true,
  className = '',
  style,
  showDivider = true,
  animation = 'scale',
  borderRadius,
  roundedTop,
  boxShadow,
  height,
  padding,
  itemGap,
  borderWidth,
  borderColor,
  fontFamily,
  fontSize,
  fontWeight,
  iconSize,
  badgeStyle,
  topShadow = true,
  topShadowStyle,
  clickAnimation = 'pulse',
  animationDuration = 300,
  ...props
}) => {
  const [clickedItem, setClickedItem] = React.useState<string | null>(null);
  
  // Hide component if isShow is false
  if (!isShow) {
    return null;
  }
  
  const handleItemClick = (item: BottomNavItem) => {
    if (item.disabled) return;
    
    // Trigger click animation
    if (clickAnimation !== 'none') {
      setClickedItem(item.id);
      setTimeout(() => setClickedItem(null), animationDuration);
    }
    
    // Haptic feedback for mini apps
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    onItemClick(item);
  };

  const navClasses = [
    'rbn-bottom-nav',
    `rbn-bottom-nav--${variant}`,
    `rbn-bottom-nav--${size}`,
    `rbn-bottom-nav--${animation}`,
    clickAnimation !== 'none' && `rbn-bottom-nav--click-${clickAnimation}`,
    !showLabels && 'rbn-bottom-nav--no-labels',
    safeAreaPadding && 'rbn-bottom-nav--safe-area',
    showDivider && 'rbn-bottom-nav--divider',
    topShadow && 'rbn-bottom-nav--top-shadow',
    className,
  ].filter(Boolean).join(' ');

  const navStyles: React.CSSProperties = {
    ...style,
    ...(backgroundColor && { backgroundColor }),
    ...(borderRadius && { borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius }),
    ...(roundedTop && { borderTopLeftRadius: `${roundedTop}px`, borderTopRightRadius: `${roundedTop}px` }),
    ...(boxShadow && { boxShadow }),
    ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
    ...(padding && { padding: typeof padding === 'number' ? `${padding}px` : padding }),
    ...(borderWidth && { borderWidth: typeof borderWidth === 'number' ? `${borderWidth}px` : borderWidth }),
    ...(borderColor && { borderColor }),
    ...(activeColor && { '--rbn-active-color': activeColor } as React.CSSProperties),
    ...(inactiveColor && { '--rbn-inactive-color': inactiveColor } as React.CSSProperties),
    ...(fontFamily && { '--rbn-font-family': fontFamily } as React.CSSProperties),
    ...(fontSize && { '--rbn-font-size': typeof fontSize === 'number' ? `${fontSize}px` : fontSize } as React.CSSProperties),
    ...(fontWeight && { '--rbn-font-weight': fontWeight } as React.CSSProperties),
    ...(iconSize && { '--rbn-icon-size': typeof iconSize === 'number' ? `${iconSize}px` : iconSize } as React.CSSProperties),
    ...(itemGap && { '--rbn-item-gap': typeof itemGap === 'number' ? `${itemGap}px` : itemGap } as React.CSSProperties),
  };

  const containerStyles: React.CSSProperties = {
    ...(itemGap && { gap: typeof itemGap === 'number' ? `${itemGap}px` : itemGap }),
  };

  // Default badge style with user overrides
  const defaultBadgeStyle = {
    border: 'none',
    backgroundColor: '#ff0000',
    ...badgeStyle
  };

  const renderIcon = (icon: React.ReactNode | string | undefined, item: BottomNavItem, isActive: boolean) => {
    if (!icon) return null;
    
    // Use active icon if provided and item is active
    const currentIcon = isActive && item.activeIcon ? item.activeIcon : icon;
    
    const iconStyles: React.CSSProperties = {
      ...item.iconStyle,
      color: isActive 
        ? (item.activeIconColor || activeColor || 'var(--rbn-active-color)')
        : (item.iconColor || inactiveColor || 'var(--rbn-inactive-color)'),
    };
    
    if (typeof currentIcon === 'string') {
      // Check if it's an image file (svg, png, jpg, etc.)
      const isImageFile = /\.(svg|png|jpg|jpeg|gif|webp)$/i.test(currentIcon);
      
      if (isImageFile) {
        return (
          <img 
            src={currentIcon}
            alt={item.label}
            className="rbn-item__image" 
            style={{
              width: iconSize ? (typeof iconSize === 'number' ? `${iconSize}px` : iconSize) : 'var(--rbn-icon-size)',
              height: iconSize ? (typeof iconSize === 'number' ? `${iconSize}px` : iconSize) : 'var(--rbn-icon-size)',
              objectFit: 'contain',
              filter: isActive && !item.activeIconColor && !item.iconColor 
                ? `brightness(0) saturate(100%) ${getColorFilter(isActive ? (activeColor || 'var(--rbn-active-color)') : (inactiveColor || 'var(--rbn-inactive-color)'))}`
                : undefined,
              ...item.iconStyle,
            }}
          />
        );
      }
      
      // Fallback for emoji or text icons
      return (
        <span 
          className="rbn-item__emoji" 
          style={{
            ...iconStyles,
            fontSize: iconSize ? (typeof iconSize === 'number' ? `${iconSize}px` : iconSize) : undefined,
          }}
        >
          {currentIcon}
        </span>
      );
    }
    
    return (
      <div 
        className="rbn-item__icon" 
        style={{
          ...iconStyles,
          fontSize: iconSize ? (typeof iconSize === 'number' ? `${iconSize}px` : iconSize) : undefined,
        }}
      >
        {currentIcon}
      </div>
    );
  };

  return (
    <>
      {topShadow && (
        <div 
          className="rbn-bottom-nav__top-shadow" 
          style={{
            height: topShadowStyle?.height || '40px',
            background: `linear-gradient(to bottom, transparent, ${topShadowStyle?.color || 'rgba(0, 0, 0, 0.1)'})`,
            opacity: topShadowStyle?.opacity || 1,
            filter: `blur(${topShadowStyle?.blur || '10px'})`,
          }}
        />
      )}
      <nav className={navClasses} style={navStyles} {...props}>
        <div className="rbn-bottom-nav__container" style={containerStyles}>
        {items.map((item) => {
          const isActive = item.id === activeId;
          const itemClasses = [
            'rbn-item',
            isActive && 'rbn-item--active',
            item.disabled && 'rbn-item--disabled',
            clickedItem === item.id && 'rbn-item--clicked',
          ].filter(Boolean).join(' ');

          const itemStyles: React.CSSProperties = {
            backgroundColor: isActive 
              ? (item.activeBackgroundColor || 'transparent')
              : (item.backgroundColor || 'transparent'),
          };

          const labelStyles: React.CSSProperties = {
            ...item.textStyle,
            color: isActive 
              ? (item.activeTextColor || activeColor || 'var(--rbn-active-color)')
              : (item.textColor || inactiveColor || 'var(--rbn-inactive-color)'),
            fontFamily: fontFamily || 'var(--rbn-font-family)',
            fontSize: fontSize ? (typeof fontSize === 'number' ? `${fontSize}px` : fontSize) : undefined,
            fontWeight: fontWeight || 'var(--rbn-font-weight)',
          };

          const badgeStyles: React.CSSProperties = {
            backgroundColor: defaultBadgeStyle?.backgroundColor || 'var(--rbn-badge-color)',
            color: defaultBadgeStyle?.textColor || '#ffffff',
            borderRadius: defaultBadgeStyle?.borderRadius ? 
              (typeof defaultBadgeStyle.borderRadius === 'number' ? `${defaultBadgeStyle.borderRadius}px` : defaultBadgeStyle.borderRadius) 
              : undefined,
            fontSize: defaultBadgeStyle?.fontSize ? 
              (typeof defaultBadgeStyle.fontSize === 'number' ? `${defaultBadgeStyle.fontSize}px` : defaultBadgeStyle.fontSize) 
              : undefined,
            fontWeight: defaultBadgeStyle?.fontWeight || undefined,
            border: defaultBadgeStyle?.border || undefined,
            borderColor: defaultBadgeStyle?.borderColor || undefined,
            borderWidth: defaultBadgeStyle?.borderWidth ? 
              (typeof defaultBadgeStyle.borderWidth === 'number' ? `${defaultBadgeStyle.borderWidth}px` : defaultBadgeStyle.borderWidth) 
              : undefined,
            minWidth: defaultBadgeStyle?.minWidth ? 
              (typeof defaultBadgeStyle.minWidth === 'number' ? `${defaultBadgeStyle.minWidth}px` : defaultBadgeStyle.minWidth) 
              : undefined,
            height: defaultBadgeStyle?.height ? 
              (typeof defaultBadgeStyle.height === 'number' ? `${defaultBadgeStyle.height}px` : defaultBadgeStyle.height) 
              : undefined,
            padding: defaultBadgeStyle?.padding || undefined,
            boxShadow: defaultBadgeStyle?.boxShadow || undefined,
            transform: defaultBadgeStyle?.transform || undefined,
            zIndex: defaultBadgeStyle?.zIndex || undefined,
            ...(defaultBadgeStyle?.position && getBadgePosition(defaultBadgeStyle.position, defaultBadgeStyle.offset)),
          };

          return (
            <button
              key={item.id}
              className={itemClasses}
              style={itemStyles}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              aria-label={item.label}
              role="tab"
              aria-selected={isActive}
              type="button"
            >
              <div className="rbn-item__content">
                {renderIcon(item.icon, item, isActive)}
                {item.badge && (
                  <div className="rbn-item__badge" style={badgeStyles}>
                    {item.badge}
                  </div>
                )}
              </div>
              
              {showLabels && (
                <span className="rbn-item__label" style={labelStyles}>
                  {item.label}
                </span>
              )}
              
              {isActive && (
                <div className="rbn-item__indicator" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
    </>
  );
};

export default NBottomNav;