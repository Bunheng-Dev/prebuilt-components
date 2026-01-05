import React, { useEffect, useRef } from 'react';
import Overlay from './Overlay';
import './NActionSheet.css';

export interface NActionSheetAction {
  id?: string;               // optional identifier
  label: string;
  onClick?: () => void;
  danger?: boolean;          // existing alias
  destructive?: boolean;     // alias for danger
  cancel?: boolean;          // treat as cancel action (rendered separately)
  disabled?: boolean;
}

export interface NActionSheetProps {
  open?: boolean;
  isVisible?: boolean; // alias for open
  actions: NActionSheetAction[];
  onClose?: () => void;
  onActionSelect?: (action: NActionSheetAction) => void;
  backdrop?: boolean;
  closeOnBackdrop?: boolean;
  autoCloseOnAction?: boolean; // whether to auto close after any action click
  className?: string;
  style?: React.CSSProperties;
}

const BODY_OVERFLOW_KEY = 'data-nas-prev-overflow';
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

const NActionSheet: React.FC<NActionSheetProps> = ({
  open,
  isVisible,
  actions,
  onClose,
  onActionSelect,
  backdrop = true,
  closeOnBackdrop = true,
  autoCloseOnAction = false,
  className = '',
  style = {},
}) => {
  const visible = typeof open === 'boolean' ? open : Boolean(isVisible);

  useEffect(() => {
    if (!visible) {
      const prev = document.body.getAttribute(BODY_OVERFLOW_KEY) || '';
      document.body.style.overflow = prev;
      document.body.removeAttribute(BODY_OVERFLOW_KEY);
      return;
    }

    const prev = document.body.style.overflow;
    document.body.setAttribute(BODY_OVERFLOW_KEY, prev || '');
    document.body.style.overflow = 'hidden';
    incSheetCount();

    return () => {
      const prev = document.body.getAttribute(BODY_OVERFLOW_KEY) || '';
      document.body.style.overflow = prev;
      document.body.removeAttribute(BODY_OVERFLOW_KEY);
      decSheetCount();
    };
  }, [visible]);

  const handleActionClick = (action: NActionSheetAction) => {
    if (action.disabled) return;

    // central callback
    onActionSelect?.(action);

    // per-action callback
    action.onClick?.();

    // cancel actions should close by default
    if (action.cancel) {
      onClose?.();
      return;
    }

    // optionally auto close after any action
    if (autoCloseOnAction) {
      onClose?.();
    }
  };

  const pointerEventsStyle: React.CSSProperties = {
    pointerEvents: visible ? undefined : 'none',
  };

  const openClass = visible ? 'n-as-open' : '';

  return (
    <Overlay open={visible} backdrop={backdrop} closeOnBackdrop={closeOnBackdrop} onClose={onClose} className={`n-action-sheet ${openClass}`} style={pointerEventsStyle}>
      <div className={`n-as-sheet ${className}`.trim()} style={style} role="dialog" aria-modal={true}>
        <div className="n-as-actions" role="menu" aria-label="Actions">
          {actions.filter(a => !a.cancel).map((a, idx) => (
            <button
              key={a.id ?? idx}
              className={`n-as-action ${(a.danger || a.destructive) ? 'n-as-action--danger' : ''} ${a.disabled ? 'n-as-action--disabled' : ''}`.trim()}
              onClick={() => handleActionClick(a)}
              disabled={a.disabled}
              role="menuitem"
              aria-disabled={a.disabled || undefined}
            >
              {a.label}
            </button>
          ))}

          {/* Cancel actions rendered separately */}
          {actions.filter(a => a.cancel).length > 0 && (
            <div className="n-as-cancel">
              {actions.filter(a => a.cancel).map((a, idx) => (
                <button
                  key={a.id ?? `cancel-${idx}`}
                  className={`n-as-action n-as-action--cancel ${a.disabled ? 'n-as-action--disabled' : ''}`.trim()}
                  onClick={() => handleActionClick(a)}
                  disabled={a.disabled}
                  role="menuitem"
                  aria-disabled={a.disabled || undefined}
                >
                  {a.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Overlay>
  ); // fallback for SSR / tests
};

export default NActionSheet;
