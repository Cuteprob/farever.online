'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    // 只在生产环境和支持Service Worker的浏览器中注册
    if (
      process.env.NODE_ENV === 'production' &&
      'serviceWorker' in navigator &&
      window.location.protocol === 'https:'
    ) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
          
          // 检查更新
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // 新版本可用，可以提示用户刷新
                  console.log('New content is available; please refresh.');
                }
              });
            }
          });
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });

      // 监听Service Worker消息
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          console.log('Cache updated:', event.data.url);
        }
      });
    }
  }, []);

  return null; // 这个组件不渲染任何内容
}

export default ServiceWorkerRegistration;
