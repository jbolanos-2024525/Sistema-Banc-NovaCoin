// src/shared/hooks/useToast.js

import { useState, useCallback } from 'react';

let toastListeners = [];

export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, visible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return { toast, showToast, hideToast };
};

// Funciones globales para mostrar toasts desde cualquier lugar
export const toast = {
  success: (message) => {
    toastListeners.forEach(listener => listener(message, 'success'));
  },
  error: (message) => {
    toastListeners.forEach(listener => listener(message, 'error'));
  },
  warning: (message) => {
    toastListeners.forEach(listener => listener(message, 'warning'));
  },
  info: (message) => {
    toastListeners.forEach(listener => listener(message, 'info'));
  },
};

export const registerToastListener = (listener) => {
  toastListeners.push(listener);
  return () => {
    toastListeners = toastListeners.filter(l => l !== listener);
  };
};
