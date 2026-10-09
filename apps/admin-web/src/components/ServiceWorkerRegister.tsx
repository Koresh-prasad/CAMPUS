'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('✅ ServiceWorker registered: Campus Helper is offline-ready', registration.scope);
          })
          .catch((err) => {
            console.warn('ServiceWorker registration note:', err);
          });
      });
    }
  }, []);

  return null;
}
