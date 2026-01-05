import React, { useEffect, useRef, useState } from 'react';
import Overlay from './Overlay';
import './NBottomSheet.css';

export interface NBottomSheetProps {
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  height?: number | string;
  backdrop?: boolean;
  closeOnBackdrop?: boolean;
  draggable?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const BODY_OVERFLOW_KEY = 'data-nbs-prev-overflow';
const SHEET_COUNT_KEY = '__n_sheet_open_count';

// Defensive cleanup on module load (handles hot reloads / commented-out components)
if (typeof document !== 'undefined') {
  const hasOpen = !!document.querySelector('.n-action-sheet.n-as-open, .n-bottom-sheet.nbs-open');
  if (!hasOpen) {
    document.body.classList.remove('n-sheet-open');
    (window as any)[SHEET_COUNT_KEY] = 0;
  }
}

const incSheetCount = () => {
  if (typeof window === 'undefined') return;
  const w = window as any;
  w[SHEET_COUNT_KEY] = (w[SHEET_COUNT_KEY] || 0) + 1;
  document.body.classList.add('n-sheet-open');
};

const decSheetCount = () => {
  if (typeof window === 'undefined') return;
  const w = window as any;
  w[SHEET_COUNT_KEY] = Math.max(0, (w[SHEET_COUNT_KEY] || 0) - 1);
  if (w[SHEET_COUNT_KEY] === 0) {
    document.body.classList.remove('n-sheet-open');
  }
};

const NBottomSheet: React.FC<NBottomSheetProps> = ({
  open,
  onClose,
  children,
  height = '50vh',
  backdrop = true,
  closeOnBackdrop = true,
  draggable = true,
  className = '',
  style = {},
}) => {
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const startYRef = useRef<number | null>(null);
  const currentTranslateRef = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!open) {
      // ensure we aren't leaving any side-effects when closed
      const prev = document.body.getAttribute(BODY_OVERFLOW_KEY) || '';
      document.body.style.overflow = prev;
      document.body.removeAttribute(BODY_OVERFLOW_KEY);
      return;
    }

    // Open -> set overflow and increment open-sheet counter
    const prev = document.body.style.overflow;
    document.body.setAttribute(BODY_OVERFLOW_KEY, prev || '');
    document.body.style.overflow = 'hidden';
    incSheetCount();

    return () => {
      // Cleanup on close or unmount
      const prev = document.body.getAttribute(BODY_OVERFLOW_KEY) || '';
      document.body.style.overflow = prev;
      document.body.removeAttribute(BODY_OVERFLOW_KEY);
      decSheetCount();
    };
  }, [open]);

  // Reset translate when open changes
  useEffect(() => {
    if (!open && sheetRef.current) {
      // clear inline transforms to fall back to CSS (centering + hidden state)
      sheetRef.current.style.transform = '';
      currentTranslateRef.current = 0;
      setIsDragging(false);
    }
  }, [open]);

  // Helpers for dragging
  const getSheetHeight = () => sheetRef.current?.getBoundingClientRect().height || 0;

  const handleTouchStart = (clientY: number) => {
    startYRef.current = clientY;
    currentTranslateRef.current = 0;
    setIsDragging(true);
    if (sheetRef.current) sheetRef.current.style.transition = 'none';
  };

  const handleTouchMove = (clientY: number) => {
    if (startYRef.current == null) return;
    const delta = clientY - startYRef.current;
    if (delta < 0) return; // only drag downwards
    currentTranslateRef.current = delta;
    if (sheetRef.current) {
      // keep horizontal centering via translateX(-50%) and apply vertical translate
      sheetRef.current.style.transform = `translate(-50%, ${delta}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (!sheetRef.current) return;
    const sheetHeight = getSheetHeight();
    const threshold = Math.min(120, sheetHeight * 0.25);
    const translate = currentTranslateRef.current;
    sheetRef.current.style.transition = '';
    setIsDragging(false);
    startYRef.current = null;
    currentTranslateRef.current = 0;
    if (translate > threshold) {
      // close
      onClose?.();
    } else {
      // reset back to CSS-controlled transformed position (centered + visible)
      sheetRef.current.style.transform = '';
    }
  };

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    if (!draggable) return;
    handleTouchStart(e.touches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!draggable) return;
    handleTouchMove(e.touches[0].clientY);
  };

  const onTouchEndWrap = () => {
    if (!draggable) return;
    handleTouchEnd();
  };

  // Pointer (mouse) handlers for desktop
  const onPointerDown = (e: React.PointerEvent) => {
    if (!draggable) return;
    // only left click or touch
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    handleTouchStart(e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggable) return;
    handleTouchMove(e.clientY);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!draggable) return;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    handleTouchEnd();
  };

  const openClass = open ? 'nbs-open' : '';
  const pointerEventsStyle: React.CSSProperties = {
    pointerEvents: open ? undefined : 'none',
  };

  const sheetHeightStyle: React.CSSProperties = {
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <Overlay open={open} backdrop={backdrop} closeOnBackdrop={closeOnBackdrop} onClose={onClose} className={`n-bottom-sheet ${openClass}`} style={pointerEventsStyle} portalClassName="n-bottom-sheet-portal">
      <div
        className={`nbs-sheet ${className}`.trim()}
        ref={sheetRef}
        style={{ ...sheetHeightStyle, ...style }}
        role="dialog"
        aria-modal={true}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEndWrap}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div className="nbs-handle" aria-hidden>
          <div className="nbs-handle__bar" />
        </div>
        <div className="nbs-body">{children}</div>
      </div>
    </Overlay>
  ); // fallback for SSR / tests
};

export default NBottomSheet;
