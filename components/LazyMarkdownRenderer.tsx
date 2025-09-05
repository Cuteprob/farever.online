'use client';

import React, { lazy, Suspense } from 'react';
import { MarkdownRendererProps } from '@/types/game';

// 懒加载MarkdownRenderer组件
const MarkdownRenderer = lazy(() => import('./MarkdownRenderer'));

const LazyMarkdownRenderer: React.FC<MarkdownRendererProps> = (props) => {
  return (
    <Suspense fallback={
      <div className={`animate-pulse ${props.className || ''}`}>
        <div className="h-theme-md bg-theme-dark-700 rounded w-3/4 mb-theme-md"></div>
        <div className="h-theme-md bg-theme-dark-700 rounded w-1/2 mb-theme-md"></div>
        <div className="h-theme-md bg-theme-dark-700 rounded w-5/6 mb-theme-md"></div>
        <div className="h-theme-md bg-theme-dark-700 rounded w-2/3 mb-theme-md"></div>
        <div className="flex justify-center items-center py-4">
          <span className="text-theme-sm text-helper">Loading content...</span>
        </div>
      </div>
    }>
      <MarkdownRenderer {...props} />
    </Suspense>
  );
};

export default LazyMarkdownRenderer;
