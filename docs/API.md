# API Reference

This document provides a concise reference for the main props of each core component in **prebuilt-components**.

Use this as a quick lookup while developing. Detailed usage and examples are available in other docs files.

---

## NHeader Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `''` | Centered title text |
| `showTitle` | `boolean` | `true` | Whether to render the title |
| `showBackButton` | `boolean` | `false` | Show the back button on the left |
| `onBack` | `() => void` | `undefined` | Called when back button is clicked |
| `background` | `'solid' \| 'transparent'` | `'solid'` | Header background type |
| `shadow` | `boolean` | `true` | Add subtle bottom divider or shadow |
| `rightAction` | `React.ReactNode` | `undefined` | Custom node aligned to the right |
| `height` | `number \| string` | `56` | Header height in px or CSS value |
| `className` | `string` | `''` | Additional CSS class |
| `style` | `React.CSSProperties` | `undefined` | Inline styles |
| `backButtonStyle` | `React.CSSProperties` | `undefined` | Inline style applied to the back button |

> **Note:** `NHeader` is a presentational component and does not perform navigation.  
> Consumers must handle navigation via the `onBack` callback.

---

## NLoadingComponent Props (Summary)

For full typing details, see the source file.

**Key props:**
- `isShow` / `isVisible`: `boolean`
- `size`: `number`
- `spinnerColor`: `string`
- `logo`: `string | React.ReactNode`
- `logoSize`: `number`
- `backgroundColor`: `string`
- `backgroundOpacity`: `number`
- `loadingText`: `string`

Source: `src/LoadingComponent.tsx`

---

## NToast Props (Summary)

For the complete and latest prop list, refer to the source.

**Main props include:**
- `isShow` / `isVisible`: `boolean`
- `message`: `string`
- `description`: `string`
- `type`: `'success' | 'error' | 'warning' | 'info' | 'default'`
- `duration`: `number`
- `position`: `'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'`
- `backgroundColor`: `string`
- `textColor`: `string`
- `borderRadius`: `number | string`

Source: `src/Toast.tsx`

---

## NBottomNav Props (Summary)

This component has a large API surface. Below are the most important props.

**Required:**
- `items: BottomNavItem[]`
- `activeId: string`
- `onItemClick: (item: BottomNavItem) => void`

**Common styling & behavior props:**
- `variant`
- `size`
- `backgroundColor`
- `activeColor`
- `inactiveColor`
- `badgeStyle`
- `animation`
- `clickAnimation`

Source: `src/BottomNav.tsx`

---

## NBottomSheet Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | **required** | Whether the sheet is open and visible |
| `onClose` | `() => void` | `undefined` | Called when the sheet requests to close (backdrop click, drag) |
| `children` | `React.ReactNode` | — | Content render inside the sheet |
| `height` | `number \| string` | `50vh` | Sheet height (px or CSS units) |
| `backdrop` | `boolean` | `true` | Render semi-transparent backdrop overlay |
| `closeOnBackdrop` | `boolean` | `true` | Clicking the backdrop triggers `onClose` |
| `draggable` | `boolean` | `true` | Enable drag-to-close gestures (touch & pointer) |
| `className` | `string` | `''` | Additional className applied to the sheet container |
| `style` | `React.CSSProperties` | `undefined` | Inline styles applied to the sheet container |

Source: `src/NBottomSheet.tsx`

> **Note:** `NBottomSheet` uses the shared `Overlay` component internally for its backdrop and portal behavior.

---

## NEmptyState Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `React.ReactNode` | `undefined` | Optional icon or graphic to show above the title |
| `title` | `string` | `'No data'` | Title text shown in bold |
| `description` | `string` | `'Try again later'` | Supporting descriptive text |
| `action` | `React.ReactNode` | `undefined` | Optional action node (e.g., button) |
| `imageSrc` | `string` | `undefined` | Optional image URL or local path, shown above the title |
| `imageAlt` | `string` | `undefined` | Alt text for `imageSrc` image |
| `className` | `string` | `''` | Additional class name applied to wrapper |
| `style` | `React.CSSProperties` | `undefined` | Inline styles applied to wrapper |

Source: `src/NEmptyState.tsx`

---

## NActionSheet Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Whether the action sheet is visible (use `isVisible` alias too) |
| `isVisible` | `boolean` | `false` | Alias for `open` (optional) |
| `actions` | `NActionSheetAction[]` | **required** | Array of actions to render (label, onClick, danger/destructive, disabled, cancel, id) |
| `onClose` | `() => void` | `undefined` | Called when the backdrop is clicked (if enabled) |
| `onActionSelect` | `(action) => void` | `undefined` | Called when any action is selected (action object passed) |
| `backdrop` | `boolean` | `true` | Render backdrop overlay |
| `closeOnBackdrop` | `boolean` | `true` | Clicking the backdrop triggers `onClose` |
| `autoCloseOnAction` | `boolean` | `false` | If true, any action click will also call `onClose` automatically |
| `className` | `string` | `''` | Extra class applied to the sheet container |
| `style` | `React.CSSProperties` | `undefined` | Inline styles applied to the sheet container |

**NActionSheetAction** supports:
- `id?: string` (optional identifier)
- `label: string` (display text)
- `onClick?: () => void` (action handler)
- `danger?: boolean` or `destructive?: boolean` (visual emphasis)
- `cancel?: boolean` (rendered in a separated cancel group)
- `disabled?: boolean` (disabled state)

Source: `src/NActionSheet.tsx`

> **Note:** `NActionSheet` uses the shared `Overlay` component internally for its backdrop and portal behavior.

---

## Overlay Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Whether the overlay/backdrop is visible |
| `backdrop` | `boolean` | `true` | Render semi-transparent backdrop overlay |
| `closeOnBackdrop` | `boolean` | `true` | Clicking the backdrop triggers `onClose` |
| `onClose` | `() => void` | `undefined` | Called when the backdrop is clicked (if enabled) |
| `className` | `string` | `''` | Extra class applied to the overlay wrapper |
| `portalClassName` | `string` | `''` | Class applied to the portal container |
| `style` | `React.CSSProperties` | `undefined` | Inline styles applied to wrapper |
| `children` | `React.ReactNode` | — | Content rendered within the overlay |

Source: `src/Overlay.tsx`

---

> ℹ️ If you need deeper explanations or examples for a specific prop, please open an issue or request per-component documentation.  
> Detailed examples may be added to `docs/EXAMPLES.md` over time.
