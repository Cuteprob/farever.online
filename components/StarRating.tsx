"use client"

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';

// 简单的防抖函数
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

interface StarRatingProps {
  gameId: string;
  averageRating: number;
  totalRatings: number;
  onRatingChange?: (newRating: number, newTotal: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  showDetails?: boolean;
}

export function StarRating({
  gameId,
  averageRating,
  totalRatings,
  onRatingChange,
  size = 'md',
  readonly = false,
  showDetails = true
}: StarRatingProps) {
  const [currentRating, setCurrentRating] = useState(averageRating);
  const [currentTotal, setCurrentTotal] = useState(totalRatings);
  
  // 监听prop变化，确保组件状态与最新数据同步
  useEffect(() => {
    setCurrentRating(averageRating);
    setCurrentTotal(totalRatings);
  }, [averageRating, totalRatings]);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 尺寸配置
  const sizeConfig = {
    sm: { star: 'w-3 h-3', text: 'text-xs' },
    md: { star: 'w-4 h-4', text: 'text-sm' },
    lg: { star: 'w-5 h-5', text: 'text-base' }
  };

  // 防抖的评分提交函数
  const debouncedSubmitRating = useMemo(
    () => debounce(async (rating: number) => {
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/games/rating', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache', // 强制不使用缓存
            'Pragma': 'no-cache'
          },
          body: JSON.stringify({
            gameId,
            rating
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to submit rating');
        }

        const data = await response.json();
        
        // 更新评分数据 - 增强版：彻底清除缓存并同步状态
        if (data.success) {
          // 立即更新本地状态
          setCurrentRating(data.data.averageRating);
          setCurrentTotal(data.data.totalRatings);
          onRatingChange?.(data.data.averageRating, data.data.totalRatings);
          
          // 彻底清除所有相关缓存
          await clearAllCaches(gameId);
          // 立即拉取一次最新评分，确保与服务器一致
          try {
            const res = await fetch(`/api/games/rating?gameId=${gameId}`, {
              method: 'GET',
              headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
              }
            });
            if (res.ok) {
              const latest = await res.json();
              if (latest?.success && latest.data) {
                setCurrentRating(latest.data.averageRating);
                setCurrentTotal(latest.data.totalRatings);
                onRatingChange?.(latest.data.averageRating, latest.data.totalRatings);
              }
            }
          } catch {}
          
          // 触发全局状态更新事件
          window.dispatchEvent(new CustomEvent('ratingUpdated', {
            detail: { 
              gameId, 
              averageRating: data.data.averageRating, 
              totalRatings: data.data.totalRatings,
              timestamp: Date.now(),
              etag: data.meta?.etag
            }
          }));
          
          // 强制刷新相关数据
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('invalidateCache', {
              detail: { gameId }
            }));
          }, 100);
        }
      } catch (error) {
        console.error('Error submitting rating:', error);
        // 错误处理：恢复到最新的prop值
        setCurrentRating(averageRating);
        setCurrentTotal(totalRatings);
      } finally {
        setIsSubmitting(false);
      }
    }, 300), // 减少防抖时间以提升响应速度
    [gameId, averageRating, totalRatings, onRatingChange]
  );
  
  // 彻底清除所有缓存的辅助函数
  const clearAllCaches = async (gameId: string) => {
    try {
      // 1. 清除浏览器HTTP缓存
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(async cacheName => {
            const cache = await caches.open(cacheName);
            const requests = await cache.keys();
            
            // 删除所有相关的缓存请求
            await Promise.all(
              requests
                .filter(request => 
                  request.url.includes(`rating`) && 
                  request.url.includes(gameId)
                )
                .map(request => cache.delete(request))
            );
          })
        );
      }
      
      // 2. 清除内存缓存 (如果有全局缓存管理器)
      if (typeof window !== 'undefined' && (window as any).cacheManager) {
        (window as any).cacheManager.invalidate(gameId);
        (window as any).cacheManager.invalidateByDependency(`game:${gameId}`);
      }
      
    } catch (error) {
      console.warn('Failed to clear caches:', error);
    }
  };

  // 处理点击评分 - 修复版：禁用乐观更新，等待服务器响应
  const handleRatingClick = useCallback((rating: number) => {
    if (readonly || isSubmitting) return;

    // 不进行乐观更新，直接提交评分并等待服务器响应
    // 这样可以避免缓存不一致导致的数据跳跃问题
    debouncedSubmitRating(rating);
  }, [readonly, isSubmitting, debouncedSubmitRating]);

  // 渲染星星
  const renderStars = () => {
    const stars = [];
    const displayRating = hoverRating || currentRating;

    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= Math.floor(displayRating);
      const isHalfFilled = !isFilled && i <= Math.ceil(displayRating);
      
      stars.push(
        <button
          key={i}
          type="button"
          disabled={readonly || isSubmitting}
          className={`${sizeConfig[size].star} transition-colors duration-150 ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          } disabled:opacity-50`}
          onMouseEnter={() => !readonly && setHoverRating(i)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          onClick={() => handleRatingClick(i)}
          aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
        >
          <svg
            viewBox="0 0 24 24"
            className={`${sizeConfig[size].star} ${
              isFilled 
                ? 'text-yellow-400 fill-current' 
                : isHalfFilled
                ? 'text-yellow-400'
                : hoverRating >= i
                ? 'text-yellow-300 fill-current'
                : 'text-gray-400'
            }`}
          >
            {isHalfFilled ? (
              <defs>
                <linearGradient id={`half-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
            ) : null}
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={isHalfFilled ? `url(#half-${i})` : undefined}
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        </button>
      );
    }

    return stars;
  };

  return (
    <div className="flex items-center space-x-2">
      {/* 星星 */}
      <div className="flex items-center space-x-1">
        {renderStars()}
      </div>

      {/* 评分详情 */}
      {showDetails && (
        <div className={`${sizeConfig[size].text} text-gray-300 whitespace-nowrap`}>
          <span className="font-medium">
            {currentRating.toFixed(1)}/5
          </span>
          <span className="text-gray-400 ml-1">
            ( {currentTotal} votes )
          </span>
        </div>
      )}

      {/* 加载指示器 */}
      {isSubmitting && (
        <div className={`${sizeConfig[size].star} animate-spin`}>
          <svg viewBox="0 0 24 24" className="text-yellow-400">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray="32"
              strokeDashoffset="32"
              className="animate-spin"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

export default StarRating;
