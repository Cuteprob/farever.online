// React错误边界组件
// 用于捕获组件渲染错误并提供友好的错误恢复界面

"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { log } from '@/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      retryCount: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误到日志系统
    log.error('React Error Boundary caught an error', error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
      retryCount: this.state.retryCount
    });

    // 调用外部错误处理函数
    this.props.onError?.(error, errorInfo);

    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: prevState.retryCount + 1
    }));

    // 防止无限重试
    if (this.state.retryCount >= 3) {
      log.warn('Max retry attempts reached for error boundary', {
        retryCount: this.state.retryCount,
        error: this.state.error?.message
      });
      return;
    }
  };

  handleAutoRetry = () => {
    // 3秒后自动重试
    this.retryTimeoutId = setTimeout(() => {
      if (this.state.retryCount < 2) {
        this.handleRetry();
      }
    }, 3000);
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    // 如果刚发生错误且是第一次，启动自动重试
    if (!prevState.hasError && this.state.hasError && this.state.retryCount === 0) {
      this.handleAutoRetry();
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render() {
    if (this.state.hasError) {
      // 使用自定义fallback或默认错误UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[200px] flex items-center justify-center p-8">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-6">
              <svg className="w-16 h-16 text-theme-fire-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.081 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-theme-lg font-theme-heading font-semibold text-primary mb-theme-xs">
                Something went wrong
              </h3>
              <p className="text-secondary mb-theme-md">
                {this.state.retryCount > 0 
                  ? `We're having trouble loading this content. (Attempt ${this.state.retryCount + 1})`
                  : "We're having trouble loading this content."
                }
              </p>
            </div>

            {/* 错误详情（仅开发环境） */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 text-left bg-theme-fire-50 p-3 rounded border">
                <summary className="cursor-pointer font-medium text-theme-fire-700 mb-2">
                  Error Details (Dev Mode)
                </summary>
                <div className="text-xs text-theme-fire-600 space-y-2">
                  <div>
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  <div>
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap text-xs mt-1">
                      {this.state.error.stack}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap text-xs mt-1">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* 操作按钮 */}
            <div className="space-y-3">
              {this.state.retryCount < 3 && (
                <button
                  onClick={this.handleRetry}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Try Again
                </button>
              )}
              
              <button
                onClick={() => window.location.reload()}
                className="w-full px-theme-md py-theme-xs bg-theme-dark-600 text-secondary rounded-lg hover:bg-theme-dark-500 transition-colors"
              >
                Refresh Page
              </button>

              <button
                onClick={() => window.history.back()}
                className="w-full px-theme-md py-theme-xs text-helper hover:text-secondary transition-colors"
              >
                Go Back
              </button>
            </div>

            {/* 重试信息 */}
            {this.state.retryCount > 0 && (
              <p className="text-theme-sm text-helper mt-theme-md">
                Retry attempts: {this.state.retryCount}/3
              </p>
            )}

            {this.state.retryCount >= 3 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-700">
                  If this problem persists, please refresh the page or contact support.
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 高阶组件包装器
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const ComponentWithErrorBoundary = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

  return ComponentWithErrorBoundary;
}

// Hook版本的错误处理
export function useErrorHandler() {
  const handleError = React.useCallback((error: Error, errorInfo?: any) => {
    log.error('Manual error report', error, errorInfo);
    
    // 可以在这里添加错误上报到外部服务
    // 比如 Sentry, LogRocket 等
    
  }, []);

  return { handleError };
}