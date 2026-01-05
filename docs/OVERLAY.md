# Overlay

`Overlay` is a lightweight component that provides a portal container and an optional backdrop. It is used internally by `NBottomSheet` and `NActionSheet` but is exported for advanced consumer use cases (e.g., custom modals, dialogs, toasts that need a backdrop and portal).

## Props

- `open?: boolean` — Whether the overlay is visible.
- `backdrop?: boolean` — Render a semi-transparent backdrop (default `true`).
- `closeOnBackdrop?: boolean` — Clicking the backdrop will call `onClose` when `true` (default `true`).
- `onClose?: () => void` — Called when the backdrop is clicked and `closeOnBackdrop` is `true`.
- `className?: string` — Additional class applied to the overlay wrapper.
- `portalClassName?: string` — Class applied to the portal container.
- `style?: React.CSSProperties` — Inline style applied to the overlay wrapper.
- `children?: React.ReactNode` — Content rendered inside the overlay.

## Example

```jsx
import React, { useState } from 'react';
import { Overlay } from 'prebuilt-components';

function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open overlay</button>
      <Overlay open={open} onClose={() => setOpen(false)} backdrop>
        <div style={{ maxWidth: 560, margin: '0 auto', background: '#fff', borderRadius: 8, padding: 20 }}>
          <h3>Centered modal</h3>
          <p>Content inside overlay</p>
        </div>
      </Overlay>
    </>
  );
}
```
