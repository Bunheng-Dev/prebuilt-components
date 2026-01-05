import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Overlay.css';

export interface OverlayProps {
  open?: boolean;
  backdrop?: boolean;
  closeOnBackdrop?: boolean;
  onClose?: () => void;
  className?: string;
  portalClassName?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const Overlay: React.FC<OverlayProps> = ({
  open = false,
  backdrop = true,
  closeOnBackdrop = true,
  onClose,
  className = '',
  portalClassName = '',
  style = {},
  children,
}) => {
  const portalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const el = document.createElement('div');
    el.className = `n-overlay-portal ${portalClassName}`.trim();
    document.body.appendChild(el);
    portalRef.current = el;
    return () => {
      if (portalRef.current && portalRef.current.parentNode) {
        portalRef.current.parentNode.removeChild(portalRef.current);
      }
      portalRef.current = null;
    };
  }, [portalClassName]);

  const onBackdropClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (!closeOnBackdrop) return;
    if ((e.target as HTMLElement).classList.contains('n-overlay-backdrop')) {
      onClose?.();
    }
  };

  const pointerEventsStyle: React.CSSProperties = {
    pointerEvents: open ? undefined : 'none',
  };

  const content = (
    <div className={`n-overlay ${open ? 'n-overlay--open' : ''} ${className}`.trim()} style={{ ...pointerEventsStyle, ...style }} aria-hidden={!open}>
      {backdrop && (
        <div
          className={`n-overlay-backdrop ${open ? 'n-overlay-backdrop--visible' : ''}`}
          onMouseDown={onBackdropClick}
          onTouchStart={onBackdropClick as any}
          role="presentation"
        />
      )}

      <div className="n-overlay-content">{children}</div>
    </div>
  );

  if (portalRef.current) return createPortal(content, portalRef.current);
  return content;
};

export default Overlay;
