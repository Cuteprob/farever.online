'use client'

import { FC, lazy, Suspense } from 'react';

// 懒加载ShareDialog组件
const ShareDialog = lazy(() => import('./ShareDialog'));

interface LazyShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  gameTitle: string;
  gameUrl?: string;
}

const LazyShareDialog: FC<LazyShareDialogProps> = (props) => {
  // 只有在对话框打开时才加载组件
  if (!props.isOpen) {
    return null;
  }

  return (
    <Suspense fallback={
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative bg-card rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl border border-border">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-gray-600">Loading share options...</span>
          </div>
        </div>
      </div>
    }>
      <ShareDialog {...props} />
    </Suspense>
  );
};

export default LazyShareDialog;
