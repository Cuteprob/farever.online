'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function WebVitals() {
  useEffect(() => {
    // 只在生产环境中运行
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    // 动态导入 web-vitals
    import('web-vitals').then((webVitals) => {
      const sendToGoogleAnalytics = (metric: any) => {
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: metric.name,
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            custom_parameter_1: metric.id,
            non_interaction: true,
          });
        }
      };

      webVitals.onCLS(sendToGoogleAnalytics);
      webVitals.onFCP(sendToGoogleAnalytics);
      webVitals.onLCP(sendToGoogleAnalytics);
      webVitals.onTTFB(sendToGoogleAnalytics);
      
      // 使用INP替代FID（新版本web-vitals）
      if ('onINP' in webVitals) {
        (webVitals as any).onINP(sendToGoogleAnalytics);
      }
    }).catch((error) => {
      console.warn('Failed to load web-vitals:', error);
    });
  }, []);

  return null; // 这个组件不渲染任何内容
}

export default WebVitals;
