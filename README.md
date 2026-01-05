# Prebuilt Components

A compact, mobile‑first React UI library designed for Mini Apps, PWAs, and modern web applications.

Included components:
- **NHeader**
- **NBottomNav**
- **NBottomSheet**
- **NActionSheet**
- **Overlay**
- **NEmptyState**
- **NLoadingComponent**
- **NSplashScreen**
- **NToast**

---

## 🚀 Quick Start

```bash
npm install prebuilt-components
```

Import styles and components:

```js
import 'prebuilt-components/dist/index.css';
import { NHeader } from 'prebuilt-components';
```

Minimal usage:

```jsx
<NHeader title="Room Type" showBackButton onBack={() => history.back()} />
```

---

## 📚 Documentation

Full documentation is available in the **`docs/`** folder:

- 📘 [Usage Guide](./docs/USAGE.md)
- 🧩 [API Reference](./docs/API.md)
- 🧪 [Examples](./docs/EXAMPLES.md)
- � [Overlay Docs](./docs/OVERLAY.md)
- �📖 [Full Reference](./docs/FULL_REFERENCE.md)

> For local development and package linking (`npm link`, `npm pack`, `yalc`), see  
> 👉 [README-LOCAL.md](./README-LOCAL.md)

---

## 🧩 Components Overview

### NHeader
Mobile-style app bar with optional back button, title, and right actions.

Key props:
- `title?: string`
- `showBackButton?: boolean`
- `background?: 'solid' | 'transparent'`
- `shadow?: boolean`
- `height?: number | string`

---

### NBottomNav
Bottom navigation optimized for mobile UX.

**Main Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | BottomNavItem[] | required | Navigation items |
| activeId | string | required | Active item ID |
| onItemClick | (item) => void | required | Item click handler |
| variant | 'default' \| 'filled' \| 'minimal' \| 'floating' | default | Style variant |
| size | 'small' \| 'medium' \| 'large' | medium | Size of navigation |

**Styling Props**

| Prop | Type | Default |
|------|------|---------|
| backgroundColor | string | #ffffff |
| activeColor | string | #007aff |
| inactiveColor | string | #8e8e93 |
| borderRadius | number \| string | 0 |
| roundedTop | number | undefined |
| height | number \| string | undefined |

---

### NActionSheet
Action sheet modal for presenting a list of actions.

Basic usage:
```jsx
<NActionSheet
  actions={[
    { id: 'delete', label: 'Delete', destructive: true },
    { id: 'share', label: 'Share' },
    { id: 'cancel', label: 'Cancel', cancel: true },
  ]}
  onActionSelect={(action) => console.log('Selected action:', action.id)}
  onClose={() => setShowActionSheet(false)}
  isVisible={showActionSheet}
/>
```

---

### NBottomSheet
Slide‑up bottom sheet with backdrop; mobile-first, touch-friendly, and draggable.

Basic usage:
```jsx
<NBottomSheet open={open} onClose={() => setOpen(false)} height="60vh">
  <div>Your content here</div>
</NBottomSheet>
```

**Key props:** `open`, `onClose`, `height`, `backdrop`, `closeOnBackdrop`, `draggable`.

For the full API and additional examples, see **[API Reference](./docs/API.md#nbottomsheet)** and **[Examples](./docs/EXAMPLES.md#nbottomsheet)**.

---

### Overlay
Lightweight overlay and backdrop component used by sheets and action sheets. It provides a small API to render a backdrop, handle backdrop clicks, and host portal content.

Basic usage:
```jsx
import { Overlay } from 'prebuilt-components';

<Overlay open={open} backdrop onClose={() => setOpen(false)}>
  <div style={{ maxWidth: 520, margin: '0 auto', background: '#fff', borderRadius: 8, padding: 20 }}>
    <h3>Modal title</h3>
    <p>Modal content goes here.</p>
  </div>
</Overlay>
```

**Key props:** `open`, `backdrop`, `closeOnBackdrop`, `onClose`, `className`, `portalClassName`, `style`.

---

### NEmptyState
Simple empty state component with title, description, and optional illustration.
Basic usage:
```jsx
<NEmptyState title="No items" description="Check back later." />
```

---

### NToast
Lightweight toast notifications.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isVisible | boolean | false | Toast visibility |
| type | 'success' \| 'error' \| 'warning' \| 'info' | success | Toast type |
| message | string | required | Message text |
| duration | number | 8000 | Auto-hide duration |
| position | 'top' \| 'bottom' | bottom | Screen position |
| onHide | () => void | — | Hide callback |

---

### NLoadingComponent
Fullscreen or inline loading indicator.

| Prop | Type | Default |
|------|------|---------|
| visible | boolean | true |
| size | number | 80 |
| spinnerColor | string | #8B4513 |
| fullscreen | boolean | true |

---

### NSplashScreen
Professional splash screen with branding.

Basic usage:
```jsx
<NSplashScreen
  isVisible={showSplash}
  duration={3000}
  onHide={() => setShowSplash(false)}
/>
```



## 🤝 Contributing

Contributions are welcome!  
Please open an issue or submit a pull request.

---

## 📄 License

MIT © **MAIBUNHENG**

---

## 📝 Changelog

See GitHub releases for full change history.
