import type { ToastVariant } from '../types/task';
import './Toast.scss';

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onClose?: () => void;
}

function Toast({ message, variant = 'success', onClose }: ToastProps) {
  return (
    <div
      className={`toast toast--${variant}`}
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
    >
      <div className="toast__content">
        <span className="toast__message">{message}</span>
        {onClose && (
          <button type="button" className="toast__close" aria-label="Закрити" onClick={onClose}>
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export default Toast;
