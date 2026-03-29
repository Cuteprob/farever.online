"use client"

import Link from "next/link"
import { useEffect, useState, useRef, useCallback } from "react"
import { GameProps } from "@/types/game"
import { fetchGameData, getNetworkStatus } from "@/utils/robust-fetch"
import { log } from "@/utils/logger"
import { ErrorBoundary } from "@/components/ErrorBoundary"

interface RelatedGamesProps {
  currentGameId?: string;
}

// 热门游戏静态列表作为降级内容
const FALLBACK_POPULAR_GAMES = [
  { id: 'sprunki-phase-3', title: 'Sprunki Phase 3', image: '/games/sprunki-phase-3.jpg', categories: ['Popular'] },
  { id: 'sprunki-but-alpha', title: 'Sprunki But Alpha', image: '/games/sprunki-but-alpha.jpg', categories: ['Popular'] },
  { id: 'sprunki-phase-4', title: 'Sprunki Phase 4', image: '/games/sprunki-phase-4.jpg', categories: ['Popular'] },
  { id: 'sprunki-mustard', title: 'Sprunki Mustard', image: '/games/sprunki-mustard.jpg', categories: ['Popular'] }
];

const showRecommendationDebug = process.env.NEXT_PUBLIC_SHOW_RECOMMENDATION_DEBUG === 'true';

function RelatedGamesCore({ currentGameId }: RelatedGamesProps) {
  const [relatedGames, setRelatedGames] = useState<GameProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [fromCache, setFromCache] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [shouldShowSection, setShouldShowSection] = useState(true); // 默认显示结构
  const componentRef = useRef<HTMLDivElement>(null);
  const maxRetries = 2;
  const loadingTimeout = 6000; // 6秒总超时

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      {
        rootMargin: '100px', // 提前100px开始加载
        threshold: 0.1
      }
    );

    const currentRef = componentRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isVisible]);

  // 降级策略处理
  const handleFallbackStrategy = useCallback(() => {
    const networkStatus = getNetworkStatus();
    
    // 策略2: 显示热门游戏（排除当前游戏）
    const fallbackGames = FALLBACK_POPULAR_GAMES
      .filter(game => game.id !== currentGameId)
      .slice(0, 4);
    
    if (fallbackGames.length > 0) {
      setRelatedGames(fallbackGames as GameProps[]);
      setHasData(true);
      setFromCache(false);
      
      log.info('Using fallback popular games', {
        gameId: currentGameId,
        fallbackCount: fallbackGames.length,
        networkOnline: networkStatus.isOnline
      });
    } else {
      // 策略3: 完全隐藏区域
      setShouldShowSection(false);
      
      log.info('Hiding related games section due to no fallback data', {
        gameId: currentGameId,
        networkOnline: networkStatus.isOnline
      });
    }
    
    setLoading(false);
  }, [currentGameId]);

  // 静默重试机制
  const fetchRelatedGames = useCallback(async (attemptNumber = 0): Promise<void> => {
    if (!currentGameId || !isVisible) {
      setLoading(false);
      return;
    }

    try {
      log.debug('Fetching related games', { 
        gameId: currentGameId, 
        attempt: attemptNumber + 1, 
        maxRetries: maxRetries + 1 
      });
      
      const result = await fetchGameData<{success: boolean; data: GameProps[]; count: number}>(
        '/api/getRelatedGames',
        { gameId: currentGameId, limit: '8' }, // 减少到8个提高加载速度
        { 
          timeout: 7000, // 7秒超时，避免边缘网络下的误判
          retries: 0, // 禁用内部重试，由外部控制
          enableCache: true,
          logFinalFailureAsError: false,
          fallbackData: { success: true, data: [], count: 0 }
        }
      );
      
      if (result.success && result.data?.success && result.data.data?.length > 0) {
        // 成功获取到数据
        setRelatedGames(result.data.data);
        setFromCache(result.fromCache || false);
        setHasData(true);
        setRetryCount(attemptNumber);
        
        log.info('Related games loaded successfully', {
          gameId: currentGameId,
          count: result.data.data.length,
          fromCache: result.fromCache,
          attempt: attemptNumber + 1
        });
      } else {
        // 没有数据，尝试重试或降级
        throw new Error('No data received');
      }
    } catch (err) {
      log.warn(`Related games fetch attempt ${attemptNumber + 1} failed`, {
        gameId: currentGameId,
        error: err instanceof Error ? err.message : 'Unknown error',
        attempt: attemptNumber + 1,
        maxRetries: maxRetries + 1
      });
      
      // 重试逻辑
      if (attemptNumber < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attemptNumber), 3000); // 指数退避，最多3秒
        setTimeout(() => {
          fetchRelatedGames(attemptNumber + 1);
        }, delay);
        return;
      }
      
      // 所有重试都失败，执行降级策略
      handleFallbackStrategy();
    } finally {
      // 只在最后一次尝试时设置loading状态
      if (attemptNumber >= maxRetries || hasData) {
        setLoading(false);
      }
    }
  }, [currentGameId, isVisible, maxRetries, hasData, handleFallbackStrategy]);

  // 设置总超时控制
  useEffect(() => {
    if (!isVisible) return;
    
    const timeoutId = setTimeout(() => {
      if (loading && !hasData) {
        log.warn('Related games loading timeout', {
          gameId: currentGameId,
          timeout: loadingTimeout
        });
        handleFallbackStrategy();
      }
    }, loadingTimeout);

    return () => clearTimeout(timeoutId);
  }, [isVisible, loading, hasData, currentGameId, loadingTimeout, handleFallbackStrategy]);

  useEffect(() => {
    if (isVisible && currentGameId) {
      fetchRelatedGames();
    }
  }, [isVisible, currentGameId, fetchRelatedGames]);

  // 如果不应该显示区域，返回 null
  if (!shouldShowSection) {
    return null;
  }

  return (
    <section 
      ref={componentRef} 
      className="py-10 my-10 max-w-5xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 min-h-[400px]"
      aria-label="Related games recommendations"
      role="complementary"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题部分 - SEO友好 */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Other Games You Might Like
          </h2>
          <p className="text-gray-600 sr-only">
            Discover similar games and popular recommendations
          </p>
          {fromCache && hasData && (
            <p className="text-sm text-blue-600" aria-label="Content from cache">
              📱 Recently viewed recommendations
            </p>
          )}
        </div>

        {/* 骨架屏加载状态 */}
        {loading && !hasData && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6" aria-label="Loading related games">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 条件渲染：只在有数据时显示游戏网格 */}
        {hasData && relatedGames.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedGames.map((game) => (
              <Link
                key={game.id}
                href={`/${game.id}`}
                className="group block"
                aria-label={`Play ${game.title}`}
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                  {/* 游戏图片 */}
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={game.image}
                      alt={`${game.title} game screenshot`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.png';
                      }}
                    />
                  </div>
                  
                  {/* 游戏信息 */}
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-gray-500 text-xs mb-3">
                      {game.categories?.includes('New Games') ? 'New Games' : 
                       game.categories?.includes('Hot Games') ? 'Popular Games' : 
                       game.categories?.includes('Popular') ? 'Popular Games' :
                       game.categories?.length > 0 ? game.categories[0] : 'Games'}
                    </p>
                    
                    {/* 播放按钮 */}
                    <button className="w-full px-4 py-2 bg-white text-gray-900 text-sm font-medium rounded-lg group-hover:bg-primary group-hover:text-white transition-colors border border-gray-300 group-hover:border-primary">
                      Play Now
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {/* 开发环境调试信息 */}
        {showRecommendationDebug && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600 space-y-1">
            <div><strong>Debug Info:</strong></div>
            <div>Game ID: {currentGameId || 'None'}</div>
            <div>Visible: {isVisible.toString()}</div>
            <div>Loading: {loading.toString()}</div>
            <div>Has Data: {hasData.toString()}</div>
            <div>Games Count: {relatedGames.length}</div>
            <div>From Cache: {fromCache.toString()}</div>
            <div>Retry Count: {retryCount}</div>
            <div>Should Show: {shouldShowSection.toString()}</div>
          </div>
        )}
      </div>
    </section>
  );
}

// 使用错误边界包装组件
export function RelatedGames(props: RelatedGamesProps) {
  return (
    <ErrorBoundary
      fallback={
        <section 
          className="py-10 my-10 max-w-5xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 min-h-[200px]"
          aria-label="Related games section (error state)"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="max-w-sm mx-auto">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.051 0-3.969.77-5.412 2.036M15 9.5a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Recommendations Unavailable</h3>
                <p className="text-gray-500 text-sm">
                  Game recommendations are temporarily unavailable.
                </p>
              </div>
            </div>
          </div>
        </section>
      }
      onError={(error, errorInfo) => {
        log.error('RelatedGames component error boundary triggered', error, {
          componentStack: errorInfo.componentStack,
          currentGameId: props.currentGameId
        });
      }}
    >
      <RelatedGamesCore {...props} />
    </ErrorBoundary>
  );
}
