import type { ReactNode } from 'react';
import './StatusMessage.scss';

interface StatusMessageProps {
  variant: 'loading' | 'error' | 'empty';
  children: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

function StatusMessage({ variant, children, actionLabel, onAction }: StatusMessageProps) {
  return (
    <div
      className={`status-message status-message--${variant}`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <p className="status-message__text">{children}</p>
      {actionLabel && onAction && (
        <button type="button" className="status-message__action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default StatusMessage;
