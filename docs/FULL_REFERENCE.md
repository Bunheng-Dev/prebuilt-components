# Full Reference — prebuilt-components

This document preserves the **full reference and extended examples** that were previously included
in the root `README.md`.

For day-to-day development:
- 👉 Use **[API.md](./API.md)** for concise prop tables
- 👉 Use **[EXAMPLES.md](./EXAMPLES.md)** for patterns and advanced usage
- 👉 Use **[USAGE.md](./USAGE.md)** to get started

This file is intended as a **deep reference and archive**.

---

## NHeader — Full Props Reference

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
| `backButtonStyle` | `React.CSSProperties` | `undefined` | Inline styles applied to the back button |

> **Note:** `NHeader` is presentational only.  
> Navigation logic must be handled by the consumer via `onBack`.

---

## NBottomNav — Full Usage & Defaults

### What You Get by Default

- ✅ Top shadow enabled
- ✅ Red badges with no border (`#ff0000`)
- ✅ Scale animation on active state
- ✅ Pulse animation on click
- ✅ Mobile-first layout (max width ~448px)
- ✅ Auto-centered positioning

### Simplified Usage Example

---

## NBottomSheet — Full Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | **required** | Whether the sheet is visible |
| `onClose` | `() => void` | `undefined` | Close callback when sheet requests to close (backdrop click, drag threshold)
| `children` | `React.ReactNode` | — | Content rendered inside the sheet
| `height` | `number \| string` | `50vh` | Sheet height in pixels or CSS value
| `backdrop` | `boolean` | `true` | Render semi-transparent backdrop overlay
| `closeOnBackdrop` | `boolean` | `true` | Clicking backdrop triggers `onClose`
| `draggable` | `boolean` | `true` | Enable drag-to-close gestures (touch / pointer)
| `className` | `string` | `''` | Additional CSS class applied to the sheet container
| `style` | `CSSProperties` | `undefined` | Inline styles applied to the sheet container

---

## NEmptyState — Full Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `React.ReactNode` | `undefined` | Optional icon or illustration shown above the title |
| `imageSrc` | `string` | `undefined` | Optional image URL or local path, shown above the title |
| `imageAlt` | `string` | `undefined` | Alt text for `imageSrc` |
| `title` | `string` | `'No data'` | Bold title text |
| `description` | `string` | `'Try again later'` | Supporting description text |
| `action` | `React.ReactNode` | `undefined` | Optional action node (e.g., a button) |
| `className` | `string` | `''` | Extra class applied to wrapper |
| `style` | `CSSProperties` | `undefined` | Inline styles for wrapper

---

## NActionSheet — Full Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Whether the action sheet is visible (use `isVisible` alias too) |
| `isVisible` | `boolean` | `false` | Alias for `open` |
| `actions` | `NActionSheetAction[]` | **required** | List of actions with label/onClick/danger/destructive/disabled/cancel/id |
| `onClose` | `() => void` | `undefined` | Callback when backdrop is clicked (if enabled) |
| `onActionSelect` | `(action) => void` | `undefined` | Called when any action is selected (action object passed) |
| `autoCloseOnAction` | `boolean` | `false` | If true, any action click will also call `onClose` automatically |
| `backdrop` | `boolean` | `true` | Show semi-transparent backdrop |
| `closeOnBackdrop` | `boolean` | `true` | Clicking backdrop triggers `onClose` |
| `className` | `string` | `''` | Extra class applied to wrapper |
| `style` | `CSSProperties` | `undefined` | Inline styles for wrapper

---

## Overlay — Full Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Whether overlay/backdrop is visible |
| `backdrop` | `boolean` | `true` | Render semi-transparent backdrop overlay |
| `closeOnBackdrop` | `boolean` | `true` | Clicking the backdrop triggers `onClose` |
| `onClose` | `() => void` | `undefined` | Called when the backdrop is clicked (if enabled) |
| `className` | `string` | `''` | Extra class applied to wrapper |
| `portalClassName` | `string` | `''` | Class applied to the portal container |
| `style` | `CSSProperties` | `undefined` | Inline styles for wrapper |
| `children` | `React.ReactNode` | — | Content rendered within the overlay

---

---

```jsx
<NBottomNav
  items={navItems}
  activeId={activeTab}
  onItemClick={(item) => setActiveTab(item.id)}
  backgroundColor="#ffffff"
  className="rounded-t-2xl mt-8"
  activeColor="#6F5D29"
  inactiveColor="#A3A3A3"
  // Defaults already applied:
  // topShadow={true}
  // animation="scale"
  // clickAnimation="pulse"
/>
