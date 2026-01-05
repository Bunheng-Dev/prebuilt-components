# Examples & Advanced Customizations

This document collects **advanced usage patterns and customization examples** for building
production-ready UIs with **prebuilt-components**.

---

## Per-item Custom Styling (NBottomNav)

You can customize styles per navigation item, including colors, text styles, and active states.

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
  // ...
];

<NBottomNav
  items={customNavItems}
  activeId={activeTab}
  onItemClick={(item) => setActive(item.id)}
/>

---

## NBottomSheet

### Basic usage

```jsx
import React, { useState } from 'react';
import { NBottomSheet } from 'prebuilt-components';

function SheetDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open sheet</button>
      <NBottomSheet open={open} onClose={() => setOpen(false)} height="60vh">
        <div style={{ padding: 16 }}>
          <h3>Sheet Title</h3>
          <p>Content goes here.</p>
        </div>
      </NBottomSheet>
    </>
  );
}
```

### Close on backdrop disabled

```jsx
<NBottomSheet open={open} onClose={() => setOpen(false)} closeOnBackdrop={false}>
  <div>Backdrop clicks will not close this sheet.</div>
</NBottomSheet>
```

### Draggable (touch/pointer) example

```jsx
<NBottomSheet open={open} onClose={() => setOpen(false)} draggable={true}>
  <div>Drag down to close (mobile-friendly)</div>
</NBottomSheet>
```

---

## NActionSheet

### Basic usage

```jsx
import { NActionSheet } from 'prebuilt-components';

const actions = [
  { label: 'Save', onClick: () => console.log('save') },
  { label: 'Delete', danger: true, onClick: () => console.log('delete') },
  { label: 'Cancel', onClick: () => console.log('cancel') },
];

<NActionSheet open={open} actions={actions} onClose={() => setOpen(false)} />
```

### Disabled and danger

```jsx
<NActionSheet
  open={open}
  actions={[
    { label: 'Share', onClick: () => {} },
    { label: 'Remove', danger: true, onClick: () => {} },
    { label: 'Disabled', disabled: true }
  ]}
  onClose={() => setOpen(false)}
/>
```

---

### Cancel and onActionSelect example

```jsx
const actions = [
  { id: 'delete', label: 'Delete', destructive: true },
  { id: 'share', label: 'Share' },
  { id: 'cancel', label: 'Cancel', cancel: true }
];

<NActionSheet
  isVisible={show}
  actions={actions}
  onActionSelect={(action) => console.log('Selected:', action.id)}
  onClose={() => setShow(false)}
/>
```

---

## NEmptyState

### Basic usage

```jsx
import { NEmptyState } from 'prebuilt-components';

<NEmptyState title="No items" description="Check back later." />
```

### With an icon and action

```jsx
<NEmptyState
  icon={<svg width={40} height={40} viewBox="0 0 24 24">/* svg */</svg>}
  title="No data"
  description="Try again later"
  action={<button onClick={() => retry()}>Retry</button>}
/>
```

### With an image (URL or local path)

```jsx
<NEmptyState
  imageSrc="https://via.placeholder.com/150"
  title="No Data Available"
  description="There is currently no data to display. Please check back later."
/>
```

---

## NEmptyState

### Basic usage

```jsx
import { NEmptyState } from 'prebuilt-components';

<NEmptyState title="No items" description="Check back later." />
```

### With an icon and action

```jsx
<NEmptyState
  icon={<svg width={40} height={40} viewBox="0 0 24 24">/* svg */</svg>}
  title="No data"
  description="Try again later"
  action={<button onClick={() => retry()}>Retry</button>}
/>
```