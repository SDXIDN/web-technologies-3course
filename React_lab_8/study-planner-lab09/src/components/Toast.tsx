import type { ToastVariant } from '../types/task';
import './Toast.scss';

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
  /** Якщо задано — показується смужка прогресу такої тривалості. */
  progressMs?: number;
}

function Toast({
  message,
  variant = 'success',
  actionLabel,
  onAction,
  onClose,
  progressMs,
}: ToastProps) {
  return (
    <div
      className={`toast toast--${variant}`}
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
    >
      <div className="toast__content">
        <span className="toast__message">{message}</span>
        {actionLabel && onAction && (
          <button type="button" className="toast__action" onClick={onAction}>
            {actionLabel}
          </button>
        )}
        {onClose && (
          <button type="button" className="toast__close" aria-label="Закрити" onClick={onClose}>
            ×
          </button>
        )}
      </div>

      {progressMs !== undefined && (
        <div className="toast__progress" style={{ animationDuration: `${progressMs}ms` }} />
      )}
    </div>
  );
}

export default Toast;
