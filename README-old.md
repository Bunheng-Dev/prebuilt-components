# React BottomNav for Mini Apps

A highly customizable and touch-friendly BottomNav component specifically designed for Mini Apps, mobile React applications, and responsive web apps.

## 🎯 **Perfect for Mini Apps**

- ✅ **Telegram Mini Apps** - Optimized theme integration
- ✅ **WeChat Mini Programs** - Touch-friendly interactions
- ✅ **Mobile-First Design** - Responsive and accessible
- ✅ **PWA Ready** - Safe area support for iOS devices
- ✅ **TypeScript Support** - Fully typed with IntelliSense

## 🚀 **Features**

- ✅ **Multiple Variants** - Default, filled, minimal styles
- ✅ **Haptic Feedback** - Native vibration for touch interactions
- ✅ **Badges & Indicators** - Show notifications and active states
- ✅ **Accessibility** - WCAG compliant with ARIA attributes
- ✅ **Dark Mode** - Automatic theme detection
- ✅ **Animations** - Scale, bounce, slide, or no animation
- ✅ **Safe Area Support** - Perfect for devices with notch
- ✅ **Zero Dependencies** - Lightweight and performant

## 📦 **Installation**

```bash
npm install react-bottom-nav-mini-app
```

## 🎨 **Basic Usage**

```jsx
import React, { useState } from 'react';
import { BottomNav } from 'react-bottom-nav-mini-app';

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
      
      <BottomNav
        items={navItems}
        activeId={activeTab}
        onItemClick={(item) => setActiveTab(item.id)}
        hapticFeedback={true}
        safeAreaPadding={true}
      />
    </div>
  );
}
```

## 🎯 **Advanced Examples**

### Mini App with Custom Styling

```jsx
import { BottomNav } from 'react-bottom-nav-mini-app';

function TelegramMiniApp() {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'catalog', label: 'Catalog', icon: '📱', badge: 'NEW' },
    { id: 'cart', label: 'Cart', icon: '🛒', badge: 2 },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <BottomNav
      items={navItems}
      activeId={activeTab}
      onItemClick={(item) => {
        setActiveTab(item.id);
        // Telegram Mini App navigation
        window.Telegram?.WebApp?.HapticFeedback?.selectionChanged();
      }}
      variant="filled"
      size="large"
      hapticFeedback={true}
      activeColor="#0088cc"
      backgroundColor="var(--tg-theme-bg-color)"
      className="rbn-bottom-nav--telegram"
    />
  );
}
```

### React Component Icons

```jsx
import { BottomNav } from 'react-bottom-nav-mini-app';
import { HomeIcon, SearchIcon, HeartIcon, UserIcon } from 'lucide-react';

function AppWithIcons() {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: <HomeIcon size={20} /> 
    },
    { 
      id: 'search', 
      label: 'Search', 
      icon: <SearchIcon size={20} /> 
    },
    { 
      id: 'favorites', 
      label: 'Favorites', 
      icon: <HeartIcon size={20} />, 
      badge: 5 
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: <UserIcon size={20} /> 
    },
  ];

  return (
    <BottomNav
      items={navItems}
      activeId={activeTab}
      onItemClick={(item) => setActiveTab(item.id)}
      animation="bounce"
      showLabels={true}
    />
  );
}
```

### Minimal Style Navigation

```jsx
function MinimalNav() {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home', icon: '●' },
    { id: 'discover', label: 'Discover', icon: '◐' },
    { id: 'create', label: 'Create', icon: '◯' },
  ];

  return (
    <BottomNav
      items={navItems}
      activeId={activeTab}
      onItemClick={(item) => setActiveTab(item.id)}
      variant="minimal"
      showLabels={false}
      animation="slide"
      showDivider={false}
    />
  );
}
```

## 🔧 **Props API**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BottomNavItem[]` | **required** | Array of navigation items |
| `activeId` | `string` | **required** | Currently active item ID |
| `onItemClick` | `(item: BottomNavItem) => void` | **required** | Item click handler |
| `variant` | `'default' \| 'filled' \| 'minimal'` | `'default'` | Navigation style variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of navigation bar |
| `showLabels` | `boolean` | `true` | Whether to show item labels |
| `hapticFeedback` | `boolean` | `false` | Enable haptic feedback on touch |
| `activeColor` | `string` | `'#007aff'` | Color for active items |
| `inactiveColor` | `string` | `'#8e8e93'` | Color for inactive items |
| `backgroundColor` | `string` | `'#ffffff'` | Navigation background color |
| `safeAreaPadding` | `boolean` | `true` | Add safe area padding for notch devices |
| `showDivider` | `boolean` | `true` | Show top divider line |
| `animation` | `'scale' \| 'bounce' \| 'slide' \| 'none'` | `'scale'` | Active state animation |
| `className` | `string` | `''` | Additional CSS classes |
| `style` | `React.CSSProperties` | `undefined` | Custom inline styles |

## 📱 **BottomNavItem Interface**

```typescript
interface BottomNavItem {
  id: string;                    // Unique identifier
  label: string;                 // Display label
  icon?: React.ReactNode | string; // Icon (emoji, SVG, or component)
  badge?: string | number;       // Notification badge
  disabled?: boolean;            // Disabled state
}
```

## 🎨 **Styling & Themes**

### CSS Custom Properties

```css
:root {
  --rbn-primary-color: #007aff;
  --rbn-active-color: var(--rbn-primary-color);
  --rbn-inactive-color: #8e8e93;
  --rbn-background-color: #ffffff;
  --rbn-badge-color: #ff3b30;
}
```

### Dark Mode

The component automatically adapts to dark mode:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --rbn-background-color: #1c1c1e;
    --rbn-inactive-color: #8e8e93;
  }
}
```

### Custom CSS Classes

Override styles using CSS classes:

```css
.my-custom-nav {
  border-radius: 16px 16px 0 0;
}

.my-custom-nav .rbn-item--active {
  background-color: rgba(0, 122, 255, 0.1);
}
```

## 📱 **Mini App Integrations**

### Telegram Mini Apps

```jsx
// Use Telegram's theme colors
<BottomNav
  items={navItems}
  activeId={activeTab}
  onItemClick={handleNavigation}
  backgroundColor="var(--tg-theme-bg-color)"
  activeColor="var(--tg-theme-button-color)"
  className="rbn-bottom-nav--telegram"
/>
```

### WeChat Mini Programs

```jsx
// WeChat-optimized styling
<BottomNav
  items={navItems}
  activeId={activeTab}
  onItemClick={handleNavigation}
  activeColor="#07c160"
  hapticFeedback={true}
  className="rbn-bottom-nav--wechat"
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

## 📝 **TypeScript**

Full TypeScript support with comprehensive type definitions:

```typescript
import { BottomNav, BottomNavProps, BottomNavItem } from 'react-bottom-nav-mini-app';

const MyNav: React.FC<{ items: BottomNavItem[] }> = ({ items }) => {
  // Full type safety and IntelliSense
  return (
    <BottomNav
      items={items}
      activeId="home"
      onItemClick={(item) => {
        // `item` is fully typed
        console.log(item.id, item.label);
      }}
    />
  );
};
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

### 1.0.0
- Initial release
- BottomNav component with variants and customization
- Mini App optimizations
- TypeScript support
- Accessibility features
- Haptic feedback support
- Safe area padding
- Dark mode support
