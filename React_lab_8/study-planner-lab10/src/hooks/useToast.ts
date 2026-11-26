import { useCallback, useEffect, useRef, useState } from 'react';
import { TOAST_DURATION_MS } from '../constants';
import type { ToastMessage, ToastVariant } from '../types/task';

export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const counter = useRef(0);

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    counter.current += 1;
    setToast({ id: counter.current, message, variant });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  // Toast зникає сам; cleanup скидає таймер при новому Toast або unmount.
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  return { toast, showToast, dismissToast };
}
