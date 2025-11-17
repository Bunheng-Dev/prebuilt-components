# React Prebuilt Components

# React Prebuilt Components

A modern, customizable React component library featuring **NBottomNav** for bottom navigation, **NLoadingComponent** for loading states, and **NSplashScreen** for Mini Apps.

## 📦 **Components Included**

- ✅ **NBottomNav** - Advanced bottom navigation with animations and customization
- ✅ **NLoadingComponent** - Circular spinner with center logo support
- ✅ **NSplashScreen** - Splash screen component for Mini Apps
- 🔄 **More Components Coming** - Toast, Header, Modal, Card, and more!

## 🎯 **Perfect for Mini Apps**

- ✅ **Telegram Mini Apps** - Optimized theme integration
- ✅ **WeChat Mini Programs** - Touch-friendly interactions
- ✅ **Mobile-First Design** - Max width 448px (28rem), centered layout
- ✅ **PWA Ready** - Safe area support for iOS devices
- ✅ **TypeScript Support** - Fully typed with IntelliSense

## 🚀 **Enhanced Features**

- ✅ **Better Defaults** - Top shadow enabled, clean badges, scale animations
- ✅ **Unlimited Customization** - Per-item colors, styles, and icons
- ✅ **Dual Icon Support** - Different icons for active/inactive states
- ✅ **Multiple Variants** - Default, filled, minimal, floating styles
- ✅ **Haptic Feedback** - Native vibration for touch interactions
- ✅ **Badges & Indicators** - Show notifications and active states
- ✅ **Accessibility** - WCAG compliant with ARIA attributes
- ✅ **Dark Mode** - Automatic theme detection
- ✅ **Animations** - Scale, bounce, slide, or no animation
- ✅ **Safe Area Support** - Perfect for devices with notch
- ✅ **Zero Dependencies** - Lightweight and performant

## 📦 **Installation**

```bash
npm install react-prebuilt-components
```

**Don't forget to import the CSS:**

```css
/* In your CSS file or index.css */
@import 'react-prebuilt-components/dist/index.css';
```

**Or in your React component:**

```jsx
// In your main App.js or component file
import 'react-prebuilt-components/dist/index.css';
```

## 🎨 **Basic Usage**

**Simple setup with great defaults:**

```jsx
import React, { useState } from 'react';
import { NBottomNav, NLoadingComponent, NSplashScreen } from 'react-prebuilt-components';
import 'react-prebuilt-components/dist/index.css'; // ✅ Import CSS

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'favorites', label: 'Favorites', icon: '❤️', badge: '3' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div>
      {/* Your app content */}
      
      <NBottomNav
        items={navItems}
        activeId={activeTab}
        onItemClick={(item) => setActiveTab(item.id)}
      />
    </div>
  );
}
```

**What you get with defaults:**
- ✅ Top shadow enabled
- ✅ Red badges with no border (#ff0000)
- ✅ Scale animation on active state
- ✅ Pulse animation on click
- ✅ Mobile-first layout (max-width: 448px)
- ✅ Auto-centered positioning

**Your simplified usage example:**
```jsx
<NBottomNav
  items={navItems}
  activeId={activeTab}
  onItemClick={(item) => setActiveTab(item.id)}
  backgroundColor="#ffffff"
  className="rounded-t-2xl mt-8"
  activeColor="#6F5D29"
  inactiveColor="#A3A3A3"
  // No need for these anymore - they're defaults!
  // topShadow={true}
  // animation="scale" 
  // badgeStyle={{border: "none", backgroundColor: "#ff0000"}}
/>
```
```

## 🔄 **LoadingComponent Usage**

**Simple loading with beautiful defaults:**

```jsx
import React, { useState } from 'react';
import { NLoadingComponent, NSplashScreen } from 'react-prebuilt-components';
import 'react-prebuilt-components/dist/index.css';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div>
      {/* Your app content */}
      
      {/* Beautiful loading with defaults: burgundy spinner, white background, default text */}
      <NLoadingComponent visible={loading} />
    </div>
  );
}
```

**Advanced loading with custom logo and styling:**

```jsx
<NLoadingComponent
  visible={loading}
  size={80}
  spinnerColor="#007aff"
  logo="/your-logo.png" // or React component
  logoSize={40}
  loadingText="Please wait..."
  backgroundColor="#ffffff"
  backgroundOpacity={0.95}
  speed={1.5}
  textColor="#333333"
/>
```

## 🎯 **Advanced Customization Examples**

### Per-Item Custom Styling

```jsx
const customNavItems = [
  { 
    id: 'home', 
    label: 'Home', 
    icon: '🏠',
    iconColor: '#4CAF50',
    activeIconColor: '#ffffff',
    textColor: '#4CAF50',
    activeTextColor: '#ffffff',
    activeBackgroundColor: '#4CAF50',
    textStyle: { fontWeight: 'bold' }
  },
  { 
    id: 'shop', 
    label: 'Shop', 
    icon: '🛍️',
    iconColor: '#FF9800',
    activeIconColor: '#ffffff',
    textColor: '#FF9800',
    activeTextColor: '#ffffff',
    activeBackgroundColor: '#FF9800',
    badge: 'NEW'
  },
  // ... more items
];

<NBottomNav
  items={customNavItems}
  activeId={activeTab}
  onItemClick={(item) => setActiveTab(item.id)}
  backgroundColor="#ffffff"
  borderRadius={16}
  itemGap={8}
  iconSize={22}
  fontSize={10}
  fontWeight={600}
/>
```

### React Component Icons with Active States

```jsx
import { HomeIcon, SearchIcon, HeartIcon, UserIcon } from 'lucide-react';

const iconNavItems = [
  { 
    id: 'home', 
    label: 'Home', 
    icon: <HomeIcon size={20} />,
    activeIcon: <HomeIcon size={20} color="#007aff" />
  },
  { 
    id: 'search', 
    label: 'Search', 
    icon: <SearchIcon size={20} />,
    activeIcon: <SearchIcon size={20} color="#007aff" />
  },
  { 
    id: 'favorites', 
    label: 'Favorites', 
    icon: <HeartIcon size={20} />,
    activeIcon: <HeartIcon size={20} color="#ff3b30" />,
    badge: 5 
  },
  { 
    id: 'profile', 
    label: 'Profile', 
    icon: <UserIcon size={20} />,
    activeIcon: <UserIcon size={20} color="#007aff" />
  },
];
```

### SVG Images with Local Assets

```jsx
const svgNavItems = [
  { 
    id: 'home', 
    label: 'Home', 
    icon: '/assets/home.svg',
    activeIcon: '/assets/home-active.svg' // Optional different active state
  },
  { 
    id: 'search', 
    label: 'Search', 
    icon: '/assets/search.svg' 
  },
  { 
    id: 'favorites', 
    label: 'Favorites', 
    icon: '/assets/favorites.svg',
    badge: 3,
    // Custom colors will apply filter effects to SVG images
    iconColor: '#6b7280',
    activeIconColor: '#ef4444'
  },
  { 
    id: 'profile', 
    label: 'Profile', 
    icon: '/assets/profile.svg'
  },
];

<NBottomNav
  items={svgNavItems}
  activeId={activeTab}
  onItemClick={(item) => setActiveTab(item.id)}
  iconSize={24}
  activeColor="#007aff"
/>
```

### Advanced Click Animations

```jsx
// Pulse animation on icon click
<NBottomNav
  items={navItems}
  activeId={activeTab}
  onItemClick={(item) => setActiveTab(item.id)}
  clickAnimation="pulse"
  animationDuration={200}
  hapticFeedback={true}
/>

// Scale bounce animation for icons
<NBottomNav
  items={navItems}
  activeId={activeTab}
  onItemClick={(item) => setActiveTab(item.id)}
  clickAnimation="scale-bounce"
  animationDuration={300}
  animation="scale"
/>

// Shake effect for icons (great for error states)
<NBottomNav
  items={navItems}
  activeId={activeTab}
  onItemClick={(item) => setActiveTab(item.id)}
  clickAnimation="shake"
  animationDuration={200}
/>

// Rotate animation on icons with haptic feedback
<NBottomNav
  items={navItems}
  activeId={activeTab}
  onItemClick={(item) => setActiveTab(item.id)}
  clickAnimation="rotate"
  animationDuration={300}
  hapticFeedback={true}
  activeColor="#ff6b6b"
/>

// Ripple effect for icons (Material Design style)
<NBottomNav
  items={navItems}
  activeId={activeTab}
  onItemClick={(item) => setActiveTab(item.id)}
  clickAnimation="ripple"
  animationDuration={400}
  variant="filled"
/>
```

### Professional App Style (Clean & Minimal)

```jsx
const professionalNavItems = [
  { 
    id: 'home', 
    label: 'Home', 
    icon: <HomeIcon />,
    iconColor: '#6b7280',
    activeIconColor: '#1f2937',
    textColor: '#6b7280',
    activeTextColor: '#1f2937'
  },
  { 
    id: 'booking', 
    label: 'Booking', 
    icon: '📋',
    iconColor: '#6b7280',
    activeIconColor: '#1f2937',
    textColor: '#6b7280',
    activeTextColor: '#1f2937'
  },
  { 
    id: 'faqs', 
    label: 'FAQs', 
    icon: '❓',
    iconColor: '#6b7280',
    activeIconColor: '#1f2937',
    textColor: '#6b7280',
    activeTextColor: '#1f2937'
  },
  { 
    id: 'profile', 
    label: 'Profile', 
    icon: <UserIcon />,
    iconColor: '#6b7280',
    activeIconColor: '#1f2937',
    textColor: '#6b7280',
    activeTextColor: '#1f2937'
  },
];

<NBottomNav
  items={professionalNavItems}
  activeId={activeTab}
  onItemClick={handleClick}
  backgroundColor="#ffffff"
  showDivider={true}
  animation="none"
  iconSize={22}
  fontSize={10}
  fontWeight={500}
  style={{ borderTop: '1px solid #e5e7eb' }}
/>
```

### Animation Showcase

```jsx
// Gaming App - High energy animations
<NBottomNav
  items={[
    { id: 'play', label: 'Play', icon: '🎮', iconColor: '#10b981', activeIconColor: '#ffffff' },
    { id: 'leaderboard', label: 'Rank', icon: '🏆', iconColor: '#f59e0b', activeIconColor: '#ffffff' },
    { id: 'inventory', label: 'Items', icon: '🎒', badge: 'NEW', iconColor: '#8b5cf6', activeIconColor: '#ffffff' },
    { id: 'profile', label: 'Profile', icon: '👤', iconColor: '#6b7280', activeIconColor: '#ffffff' }
  ]}
  activeId={activeTab}
  onItemClick={handleClick}
  variant="filled"
  clickAnimation="rotate"
  animation="bounce"
  hapticFeedback={true}
  backgroundColor="#1f2937"
  activeColor="#ffffff"
  borderRadius={16}
/>

// Banking App - Subtle and professional
<NBottomNav
  items={financialNavItems}
  activeId={activeTab}
  onItemClick={handleClick}
  clickAnimation="pulse"
  animation="none"
  backgroundColor="#ffffff"
  activeColor="#059669"
  className="border-t border-gray-200"
/>

// Social Media App - Engaging interactions
<NBottomNav
  items={socialNavItems}
  activeId={activeTab}
  onItemClick={handleClick}
  variant="floating"
  clickAnimation="scale-bounce"
  animation="slide"
  topShadow={true}
  hapticFeedback={true}
  backgroundColor="rgba(255,255,255,0.95)"
  activeColor="#ec4899"
  className="rounded-full mx-4 mb-4"
/>
```

### Tailwind CSS Integration

The component is designed for mobile-first layouts with automatic centering:

```jsx
// Mobile-focused navigation with rounded corners
<NBottomNav
  items={navItems}
  activeId={activeTab}
  onItemClick={handleClick}
  className="rounded-t-2xl bg-white/90 backdrop-blur-md"
  topShadow={true}
  clickAnimation="pulse"
/>

// Custom max width with Tailwind
<NBottomNav
  items={navItems}
  activeId={activeTab}
  onItemClick={handleClick}
  className="max-w-sm rounded-2xl bg-gray-900/80"
  variant="floating"
  clickAnimation="ripple"
  hapticFeedback={true}
/>

// Different mobile widths
<NBottomNav
  items={navItems}
  activeId={activeTab}
  onItemClick={handleClick}
  className="max-w-xs rounded-full bg-blue-500/90"  // Narrow mobile
/>

<NBottomNav
  items={navItems}
  activeId={activeTab}
  onItemClick={handleClick}
  className="max-w-lg rounded-xl bg-purple-600/80"  // Wider mobile
/>
```

**Note**: The navigation automatically centers itself and maintains mobile-friendly proportions on all screen sizes.

## 🔧 **Complete Props API**

### LoadingComponent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | `true` | Whether the loading component is visible |
| `size` | `number` | `80` | Size of the loading spinner (in pixels) |
| `spinnerColor` | `string` | `'#8B4513'` | Color of the loading spinner |
| `speed` | `number` | `2` | Speed of the loading animation (in seconds) |
| `logo` | `React.ReactNode \| string` | `'https://www.nealika.com/img/logo-master.png'` | Logo/image to display in center |
| `logoSize` | `number` | `40` | Size of the center logo/image (in pixels) |
| `backgroundColor` | `string` | `'#ffffff'` | Background color of the loading overlay |
| `backgroundOpacity` | `number` | `0.9` | Opacity of the background overlay |
| `loadingText` | `string` | `undefined` | Text to display below the spinner |
| `textColor` | `string` | `'#666666'` | Custom text color |
| `textSize` | `number` | `14` | Font size of the loading text |
| `strokeWidth` | `number` | `3` | Thickness of the spinner stroke |
| `fullscreen` | `boolean` | `true` | Whether to show as fullscreen overlay |
| `zIndex` | `number` | `9999` | Z-index for the loading overlay |
| `className` | `string` | `''` | Additional CSS classes |
| `style` | `React.CSSProperties` | `undefined` | Custom styles |

### NBottomNav Props

#### Main Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BottomNavItem[]` | **required** | Array of navigation items |
| `activeId` | `string` | **required** | Currently active item ID |
| `onItemClick` | `(item: BottomNavItem) => void` | **required** | Item click handler |
| `variant` | `'default' \| 'filled' \| 'minimal' \| 'floating'` | `'default'` | Navigation style variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of navigation bar |

### Styling Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `backgroundColor` | `string` | `'#ffffff'` | Navigation background color |
| `activeColor` | `string` | `'#007aff'` | Default color for active items |
| `inactiveColor` | `string` | `'#8e8e93'` | Default color for inactive items |
| `borderRadius` | `number \| string` | `0` | Border radius for navigation bar |
| `roundedTop` | `number` | `undefined` | Top border radius (4=sm, 8=md, 12=lg, 16=xl, 20=2xl, 24=3xl) |
| `boxShadow` | `string` | `undefined` | Custom shadow/elevation |
| `height` | `number \| string` | `undefined` | Height of navigation bar |
| `padding` | `number \| string` | `undefined` | Padding for entire navigation |
| `itemGap` | `number \| string` | `undefined` | Gap between navigation items |
| `borderWidth` | `number \| string` | `undefined` | Border width |
| `borderColor` | `string` | `undefined` | Border color |

### Typography Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fontFamily` | `string` | `system-ui` | Text font family |
| `fontSize` | `number \| string` | `10px` | Text font size |
| `fontWeight` | `number \| string` | `500` | Text font weight |
| `iconSize` | `number \| string` | `20px` | Icon size |
| `topShadow` | `boolean` | `true` | Add top shadow/blur effect above navigation |
| `topShadowStyle` | `TopShadowStyle` | `undefined` | Custom top shadow styling |

### Badge Styling

| Prop | Type | Description |
|------|------|-------------|
| `badgeStyle` | `BadgeStyle` | Comprehensive badge styling options |

```typescript
interface BadgeStyle {
  backgroundColor?: string;         // Badge background color
  textColor?: string;              // Badge text color
  borderRadius?: number | string;   // Badge border radius
  fontSize?: number | string;       // Badge font size
  fontWeight?: number | string;     // Badge font weight
  border?: string;                 // Complete border shorthand
  borderColor?: string;            // Border color only
  borderWidth?: number | string;   // Border width only
  minWidth?: number | string;      // Minimum badge width
  height?: number | string;        // Badge height
  padding?: string;               // Badge padding
  position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left';
  offset?: {                      // Fine-tune badge position
    top?: number | string;
    right?: number | string;
    bottom?: number | string;
    left?: number | string;
  };
  boxShadow?: string;             // Badge shadow/elevation
  transform?: string;             // Custom transform
  zIndex?: number;               // Stack order
}
```

### Advanced Badge Examples

```jsx
// Custom border and positioning
<NBottomNav
  items={[
    { 
      id: 'messages', 
      label: 'Messages', 
      icon: '💬', 
      badge: '12',
    }
  ]}
  badgeStyle={{
    backgroundColor: '#ff0000',
    border: '2px solid #ffffff',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 'bold',
    boxShadow: '0 2px 8px rgba(255,0,0,0.3)'
  }}
/>

// Different positions and custom styling
<NBottomNav
  items={[
    { id: 'home', label: 'Home', icon: '🏠', badge: '!' },
    { id: 'shop', label: 'Shop', icon: '🛍️', badge: 'NEW' },
    { id: 'cart', label: 'Cart', icon: '🛒', badge: '3' },
  ]}
  badgeStyle={{
    position: 'top-left',
    backgroundColor: '#10b981',
    textColor: '#ffffff',
    borderRadius: '4px',
    padding: '2px 6px',
    fontSize: '9px',
    fontWeight: '600',
    offset: {
      top: '-8px',
      left: '-8px'
    }
  }}
/>

// Floating badge with gradient
<NBottomNav
  items={navItems}
  badgeStyle={{
    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
    minWidth: '20px',
    height: '20px',
    fontSize: '10px',
    fontWeight: 'bold',
    boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
    position: 'bottom-right',
    offset: { bottom: '-4px', right: '-4px' }
  }}
/>
```

### Feature Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showLabels` | `boolean` | `true` | Whether to show item labels |
| `hapticFeedback` | `boolean` | `false` | Enable haptic feedback |
| `safeAreaPadding` | `boolean` | `true` | Add safe area padding |
| `showDivider` | `boolean` | `true` | Show top divider line |
| `animation` | `'scale' \| 'bounce' \| 'slide' \| 'none'` | `'scale'` | Active state animation |
| `clickAnimation` | `'pulse' \| 'ripple' \| 'scale-bounce' \| 'shake' \| 'rotate' \| 'none'` | `'pulse'` | Icon-only click interaction animation |
| `animationDuration` | `number` | `200` | Animation duration in milliseconds |

### Badge Styling

| Prop | Type | Description |
|------|------|-------------|
| `badgeStyle` | `BadgeStyle` | Custom badge styling |

```typescript
interface BadgeStyle {
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number | string;
  fontSize?: number | string;
}
```

### Top Shadow Styling

| Prop | Type | Description |
|------|------|-------------|
| `topShadowStyle` | `TopShadowStyle` | Custom top shadow styling |

```typescript
interface TopShadowStyle {
  height?: number | string;        // Height of the shadow area
  blur?: number | string;          // Blur amount
  color?: string;                  // Shadow color
  opacity?: number;                // Shadow opacity
}
```

## 📱 **Enhanced BottomNavItem Interface**

```typescript
interface BottomNavItem {
  id: string;                           // Unique identifier
  label: string;                        // Display label
  icon?: React.ReactNode | string;      // Icon (emoji, SVG path, or React component)
  activeIcon?: React.ReactNode | string; // Different icon for active state
  badge?: string | number;              // Notification badge
  disabled?: boolean;                   // Disabled state
  
  // Per-item color customization
  iconColor?: string;                   // Custom icon color (applies filter to images)
  activeIconColor?: string;             // Custom active icon color (applies filter to images)
  textColor?: string;                   // Custom text color
  activeTextColor?: string;             // Custom active text color
  backgroundColor?: string;             // Custom background color
  activeBackgroundColor?: string;       // Custom active background color
  
  // Per-item styling
  textStyle?: React.CSSProperties;      // Custom text styles
  iconStyle?: React.CSSProperties;      // Custom icon styles
  
  // Extensible - allows additional custom properties
  [key: string]: any;                   // For custom extensions like 'route', 'url', etc.
}
```

**Icon Support:**
- **Emoji**: `icon: "🏠"`
- **SVG Images**: `icon: "/assets/home.svg"`
- **PNG/JPG Images**: `icon: "/images/home.png"`
- **React Components**: `icon: <HomeIcon size={20} />`

## 🌟 **NSplashScreen Component**

Perfect for Mini Apps! Create professional splash screens with logo and company branding.

### Basic Usage

```jsx
import { NSplashScreen } from 'react-prebuilt-components';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <NSplashScreen
        isVisible={showSplash}
        duration={3000}
        onHide={() => setShowSplash(false)}
      />
      {/* Your main app content */}
    </>
  );
}
```

### Custom Branding

```jsx
<NSplashScreen
  isVisible={showSplash}
  duration={4000}
  logoSrc="/your-logo.png"
  logoWidth={150}
  logoHeight={150}
  companyName="Your Company Name"
  backgroundColor="#f8f9fa"
  logoAnimation="bounce"
  onHide={() => setShowSplash(false)}
/>
```

### Advanced Customization

```jsx
<NSplashScreen
  isVisible={showSplash}
  logoSrc="/assets/app-logo.svg"
  logoWidth={180}
  logoHeight={120}
  powerByText="Powered by Your Brand"
  powerByColor="#007bff"
  powerByFontSize={16}
  backgroundColor="#ffffff"
  logoAnimation="slideUp"
  animationDuration={1.5}
  logoStyle={{
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  }}
  onHide={() => setShowSplash(false)}
/>
```

### NSplashScreenProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isVisible` | `boolean` | `true` | Whether splash screen is visible |
| `duration` | `number` | `3000` | Auto-hide duration in ms (0 = manual) |
| `onHide` | `() => void` | `undefined` | Callback when hiding |
| `logoSrc` | `string` | `placeholder` | Logo image URL |
| `logoAlt` | `string` | `'App Logo'` | Logo alt text |
| `logoWidth` | `number` | `120` | Logo width in pixels |
| `logoHeight` | `number` | `120` | Logo height in pixels |
| `companyName` | `string` | `'Nealika Co., Ltd'` | Company name for "Power by" |
| `backgroundColor` | `string` | `'#ffffff'` | Background color |
| `logoStyle` | `CSSProperties` | `undefined` | Custom logo styling |
| `powerByColor` | `string` | `'#666666'` | Power by text color |
| `powerByFontSize` | `number` | `14` | Power by font size |
| `powerByText` | `string` | `undefined` | Custom power by text |
| `logoAnimation` | `'fadeIn' \| 'slideUp' \| 'bounce' \| 'none'` | `'fadeIn'` | Logo animation type |
| `animationDuration` | `number` | `1` | Animation duration in seconds |
| `className` | `string` | `''` | Custom CSS class |
| `style` | `CSSProperties` | `undefined` | Custom styling |
| `zIndex` | `number` | `9999` | Z-index for positioning |

## 🎨 **Complete Styling Examples**

### Dark Theme

```jsx
<NBottomNav
  items={navItems}
  activeId={activeTab}
  onItemClick={handleClick}
  backgroundColor="#2d3748"
  activeColor="#63b3ed"
  inactiveColor="#a0aec0"
  borderRadius={12}
/>
```

### Colorful Gradient

```jsx
<NBottomNav
  items={navItems}
  activeId={activeTab}
  onItemClick={handleClick}
  backgroundColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  activeColor="#ffffff"
  inactiveColor="rgba(255,255,255,0.7)"
  borderRadius={20}
  height={60}
  style={{ 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }}
/>
```

### Custom Heights & Spacing

```jsx
<NBottomNav
  items={navItems}
  activeId={activeTab}
  onItemClick={handleClick}
  height={70}
  itemGap={20}
  iconSize={28}
  fontSize={12}
  fontWeight={700}
  backgroundColor="#ffffff"
  activeColor="#e53e3e"
  borderRadius="20px 20px 0 0"
  boxShadow="0 -8px 30px rgba(229, 62, 62, 0.2)"
/>
```

### Icons Only (No Labels)

```jsx
<NBottomNav
  items={navItems}
  activeId={activeTab}
  onItemClick={handleClick}
  showLabels={false}
  iconSize={26}
  backgroundColor="#ffffff"
  borderRadius={16}
/>
```

### Top Rounded Corners (Tailwind-like)

```jsx
// Small rounded top (4px)
<NBottomNav
  items={navItems}
  activeId={activeTab}
  onItemClick={handleClick}
  roundedTop={4}
  backgroundColor="#ffffff"
/>

// Medium rounded top (8px) 
<NBottomNav
  items={navItems}
  activeId={activeTab}
  onItemClick={handleClick}
  roundedTop={8}
  backgroundColor="#ffffff"
/>

// Large rounded top (12px)
<NBottomNav
  items={navItems}
  activeId={activeTab}
  onItemClick={handleClick}
  roundedTop={12}
  backgroundColor="#ffffff"
/>

// Extra large rounded top (16px) - like Tailwind rounded-t-2xl
<NBottomNav
  items={navItems}
  activeId={activeTab}
  onItemClick={handleClick}
  roundedTop={16}
  backgroundColor="#ffffff"
/>

// 2XL rounded top (20px)
<NBottomNav
  items={navItems}
  activeId={activeTab}
  onItemClick={handleClick}
  roundedTop={20}
  backgroundColor="#ffffff"
/>

// 3XL rounded top (24px)
<NBottomNav
  items={navItems}
  activeId={activeTab}
  onItemClick={handleClick}
  roundedTop={24}
  backgroundColor="#ffffff"
/>
```

## 🔄 **React Router Integration**

Perfect integration with React Router for single-page applications:

```jsx
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { BottomNav, BottomNavItem } from "react-prebuilt-components";
import 'react-prebuilt-components/dist/index.css'; // ✅ Import CSS

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active tab based on current route
  const getActiveTab = () => {
    switch (location.pathname) {
      case "/":
        return "home";
      case "/booking":
        return "booking";
      case "/faq":
        return "faq";
      case "/profile":
        return "profile";
      default:
        return "home";
    }
  };

  // Navigation items with route property (extensible interface)
  const navItems: BottomNavItem[] = [
    {
      id: "home",
      label: "Home",
      icon: "/home.svg",
      activeIcon: "/ahome.svg",
      iconColor: "#4C4C4C",
      activeIconColor: "#6F5D29",
      route: "/", // Custom property - works thanks to [key: string]: any
    },
    {
      id: "booking",
      label: "Booking",
      icon: "/booking.svg",
      activeIcon: "/abooking.svg",
      iconColor: "#4C4C4C",
      activeIconColor: "#6F5D29",
      badge: "3",
      route: "/booking", // Custom property
    },
    {
      id: "faq",
      label: "FAQ",
      icon: "/faq.svg",
      activeIcon: "/afaq.svg",
      iconColor: "#4C4C4C",
      activeIconColor: "#6F5D29",
      route: "/faq",
    },
    {
      id: "profile",
      label: "Profile",
      icon: "/profile.svg",
      iconColor: "#4C4C4C",
      activeIconColor: "#6F5D29",
      activeIcon: "/aprofile.svg",
      route: "/profile",
    },
  ];

  const handleNavClick = (item: BottomNavItem) => {
    if (item.route) {
      navigate(item.route);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-md w-full">
        <NBottomNav
          items={navItems}
          activeId={getActiveTab()}
          onItemClick={handleNavClick}
          activeColor="#6F5D29"
          inactiveColor="#A3A3A3"
          roundedTop={16}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
```

## 📱 **Mini App Integrations**

### Telegram Mini Apps

```jsx
<NBottomNav
  items={navItems}
  activeId={activeTab}
  onItemClick={handleNavigation}
  backgroundColor="var(--tg-theme-bg-color)"
  activeColor="var(--tg-theme-button-color)"
  inactiveColor="var(--tg-theme-hint-color)"
  className="rbn-bottom-nav--telegram"
/>
```

### WeChat Mini Programs

```jsx
<NBottomNav
  items={navItems}
  activeId={activeTab}
  onItemClick={handleNavigation}
  activeColor="#07c160"
  hapticFeedback={true}
  className="rbn-bottom-nav--wechat"
/>
```

### E-commerce App Example

```jsx
<NBottomNav
  items={[
    { id: 'shop', label: 'Shop', icon: '🛍️' },
    { id: 'cart', label: 'Cart', icon: '🛒', badge: '3' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'account', label: 'Account', icon: '👤' },
  ]}
  activeId={activeTab}
  onItemClick={handleClick}
  hapticFeedback={true}
  activeColor="#ff6b6b"
  backgroundColor="#ffffff"
  borderRadius={16}
/>
```

## ♿ **Accessibility**

- ✅ **ARIA Attributes** - Proper roles and labels
- ✅ **Keyboard Navigation** - Full keyboard support
- ✅ **Screen Reader** - Compatible with assistive technology
- ✅ **Focus Management** - Clear focus indicators
- ✅ **Touch Targets** - Minimum 44px touch areas

## 🎯 **Performance**

- ✅ **Lightweight** - < 15KB gzipped
- ✅ **Zero Dependencies** - Only React peer dependency
- ✅ **Tree Shakeable** - Import only what you need
- ✅ **CSS Variables** - Efficient theme switching
- ✅ **GPU Accelerated** - Smooth animations

## 🌐 **Browser Support**

- ✅ iOS Safari ≥ 12
- ✅ Chrome ≥ 60
- ✅ Firefox ≥ 60
- ✅ Samsung Internet ≥ 8
- ✅ Edge ≥ 79

## 📝 **Full TypeScript Support**

```typescript
import { BottomNav, BottomNavProps, BottomNavItem } from 'react-prebuilt-components';
import 'react-prebuilt-components/dist/index.css'; // ✅ Import CSS

// Extended interface for React Router integration
interface NavItemWithRoute extends BottomNavItem {
  route: string; // Required route property
}

const MyNav: React.FC<{ items: BottomNavItem[] }> = ({ items }) => {
  return (
    <NBottomNav
      items={items}
      activeId="home"
      onItemClick={(item) => {
        // Full type safety with all customization options
        console.log(item.iconColor, item.activeBackgroundColor);
        
        // Access custom properties (type-safe with casting)
        const routeItem = item as NavItemWithRoute;
        if (routeItem.route) {
          console.log('Navigate to:', routeItem.route);
        }
      }}
      // Complete IntelliSense for all styling props
      borderRadius={16}
      iconSize={24}
      badgeStyle={{ backgroundColor: '#ff4757' }}
    />
  );
};

// Alternative: Direct typing with custom properties
const navItemsWithRoutes: NavItemWithRoute[] = [
  {
    id: 'home',
    label: 'Home',
    icon: '/home.svg',
    route: '/', // Type-safe custom property
  },
  // ... more items
];
```

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

MIT © [maibunheng]

## 🚀 **Changelog**

### 2.0.0 - React Prebuilt Components (Package Renamed)
- **🎉 PACKAGE RENAMED**: `react-bottom-nav-mini-app` → `react-prebuilt-components`
- **✨ NEW COMPONENT**: LoadingComponent with circular spinner and center logo support
- **NEW**: Per-item color customization (`iconColor`, `activeIconColor`, `textColor`, `activeTextColor`)
- **NEW**: Per-item background colors (`backgroundColor`, `activeBackgroundColor`)
- **NEW**: Dual icon support with `activeIcon` for different active/inactive states
- **NEW**: Per-item styling with `textStyle` and `iconStyle` props
- **NEW**: `floating` variant with modern blur effect design
- **NEW**: Advanced typography controls (`fontFamily`, `fontSize`, `fontWeight`, `iconSize`)
- **NEW**: Custom `badgeStyle` configuration
- **NEW**: Layout controls (`itemGap`, `borderRadius`, `height`, `padding`)
- **NEW**: `roundedTop` prop for Tailwind-like top border radius
- **IMPROVED**: Enhanced TypeScript definitions with full customization support
- **IMPROVED**: Better responsive design and accessibility
- **IMPROVED**: React Router integration examples

### 1.0.0 - Initial Release
- Basic BottomNav component with variants and customization
- Mini App optimizations (Telegram, WeChat)
- TypeScript support and accessibility features
- TypeScript support and accessibility features
- Haptic feedback and safe area padding
- Dark mode support
