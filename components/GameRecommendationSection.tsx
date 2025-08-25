"use client"

import Link from "next/link"
import { useEffect, useState, useRef, useCallback } from "react"
import { GameProps } from "@/types/game"
import { fetchGameData, getNetworkStatus } from "@/utils/robust-fetch"
import { log } from "@/utils/logger"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { GameCard } from "./game-card"

// 通用配置接口
export interface GameRecommendationConfig {
  // API配置
  endpoint: string;                    // API端点
  params: Record<string, string>;     // API参数
  
  // 显示配置
  title: string;                      // 标题
  subtitle?: string;                  // 副标题
  limit: number;                      // 显示数量
  gridCols?: {                        // 网格列数配置
    mobile: number;                   // 移动端
    tablet: number;                   // 平板端
    desktop: number;                  // 桌面端
  };
  
  // 降级策略配置
  fallbackGames: GameProps[];         // 降级游戏列表
  excludeGameId?: string;             // 需要排除的游戏ID（比如当前游戏）
  
  // 行为配置
  enableLazyLoad?: boolean;           // 是否启用懒加载
  
  // 容器样式配置
  containerClass?: string;            // 容器样式类
  showTitle?: boolean;                // 是否显示标题
}

// 默认配置
const DEFAULT_CONFIG: Partial<GameRecommendationConfig> = {
  gridCols: {
    mobile: 2,
    tablet: 3,
    desktop: 4
  },
  enableLazyLoad: true,
  containerClass: "py-10 my-10 max-w-5xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 min-h-[400px]",
  showTitle: true
};

// 热门游戏静态列表作为通用降级内容
const DEFAULT_FALLBACK_GAMES: GameProps[] = [
  { 
    id: 'sprunki-phase-3', 
    title: 'Sprunki Phase 3', 
    image: '/games/sprunki-phase-3.jpg', 
    categories: ['Popular'],
    rating: { averageRating: 4.5, totalRatings: 120 },
    iframeUrl: '/games/sprunki-phase-3',
    createdAt: '2024-01-01',
    content: 'Popular Sprunki game',
    metadata: { title: 'Sprunki Phase 3', description: 'Popular game', keywords: ['sprunki', 'popular'] }
  },
  { 
    id: 'sprunki-but-alpha', 
    title: 'Sprunki But Alpha', 
    image: '/games/sprunki-but-alpha.jpg', 
    categories: ['Popular'],
    rating: { averageRating: 4.3, totalRatings: 98 },
    iframeUrl: '/games/sprunki-but-alpha',
    createdAt: '2024-01-01',
    content: 'Popular Sprunki alpha version',
    metadata: { title: 'Sprunki But Alpha', description: 'Alpha version', keywords: ['sprunki', 'alpha'] }
  },
  { 
    id: 'sprunki-phase-4', 
    title: 'Sprunki Phase 4', 
    image: '/games/sprunki-phase-4.jpg', 
    categories: ['Popular'],
    rating: { averageRating: 4.7, totalRatings: 156 },
    iframeUrl: '/games/sprunki-phase-4',
    createdAt: '2024-01-01',
    content: 'Latest Sprunki phase',
    metadata: { title: 'Sprunki Phase 4', description: 'Latest phase', keywords: ['sprunki', 'phase4'] }
  },
  { 
    id: 'sprunki-mustard', 
    title: 'Sprunki Mustard', 
    image: '/games/sprunki-mustard.jpg', 
    categories: ['Popular'],
    rating: { averageRating: 4.2, totalRatings: 89 },
    iframeUrl: '/games/sprunki-mustard',
    createdAt: '2024-01-01',
    content: 'Sprunki mustard edition',
    metadata: { title: 'Sprunki Mustard', description: 'Mustard edition', keywords: ['sprunki', 'mustard'] }
  },
  { 
    id: 'sprunki-incredibox', 
    title: 'Sprunki Incredibox', 
    image: '/games/sprunki-incredibox.jpg', 
    categories: ['Popular'],
    rating: { averageRating: 4.6, totalRatings: 134 },
    iframeUrl: '/games/sprunki-incredibox',
    createdAt: '2024-01-01',
    content: 'Sprunki Incredibox style',
    metadata: { title: 'Sprunki Incredibox', description: 'Incredibox style', keywords: ['sprunki', 'incredibox'] }
  },
  { 
    id: 'sprunki-but-everyone-is-alive', 
    title: 'Sprunki But Everyone Is Alive', 
    image: '/games/sprunki-but-everyone-is-alive.jpg', 
    categories: ['Popular'],
    rating: { averageRating: 4.4, totalRatings: 107 },
    iframeUrl: '/games/sprunki-but-everyone-is-alive',
    createdAt: '2024-01-01',
    content: 'Sprunki everyone alive version',
    metadata: { title: 'Sprunki But Everyone Is Alive', description: 'Everyone alive version', keywords: ['sprunki', 'alive'] }
  }
];

interface GameRecommendationSectionProps {
  config: GameRecommendationConfig;
  currentGameId?: string;
}

function GameRecommendationCore({ config, currentGameId }: GameRecommendationSectionProps) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  const [games, setGames] = useState<GameProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [fromCache, setFromCache] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false); // 新增客户端渲染检测
  const componentRef = useRef<HTMLDivElement>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const maxRetries = 2;
  const loadingTimeout = 6000; // 6秒总超时
  const backgroundRetryInterval = 8000; // 8秒后台重试间隔

  // 检测客户端渲染
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!isMounted) return; // 确保在客户端渲染后才执行
    
    // 对于不启用懒加载的组件（如New Games），直接设置为可见
    if (!finalConfig.enableLazyLoad) {
      setIsVisible(true);
      return;
    }

    // 在客户端渲染后，稍微延迟以确保DOM完全准备好
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              // 一旦可见，就不再需要观察器
              if (componentRef.current) {
                observer.unobserve(componentRef.current);
              }
            }
          });
        },
        {
          rootMargin: '100px',
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
    }, 100); // 100ms延迟确保DOM准备好

    return () => {
      clearTimeout(timer);
    };
  }, [isMounted, finalConfig.enableLazyLoad]); // 添加isMounted依赖

  // 静默重试机制
  const fetchGames = useCallback(async (attemptNumber = 0): Promise<void> => {
    // 对于不需要currentGameId的API（如新游戏），只检查isVisible
    if (!isVisible) {
      setLoading(false);
      return;
    }
    
    // 对于需要currentGameId的API（如相关游戏），检查currentGameId
    if (finalConfig.endpoint.includes('getRelatedGames') && !currentGameId) {
      setLoading(false);
      return;
    }

    try {
      log.debug('Fetching games', { 
        endpoint: finalConfig.endpoint,
        gameId: currentGameId, 
        attempt: attemptNumber + 1, 
        maxRetries: maxRetries + 1 
      });
      
      // 根据API类型准备参数
      let apiParams: Record<string, string> = {};
      
      if (finalConfig.endpoint.includes('getRelatedGames') && currentGameId) {
        apiParams = { ...finalConfig.params, gameId: currentGameId };
      } else {
        apiParams = finalConfig.params;
      }
      
      const result = await fetchGameData<{success: boolean; data: GameProps[]; count: number}>(
        finalConfig.endpoint,
        apiParams,
        { 
          timeout: 4000,
          retries: 0,
          enableCache: true,
          fallbackData: { success: true, data: [], count: 0 }
        }
      );
      
      if (result.success && result.data?.success && result.data.data?.length > 0) {
        // 成功获取到数据 - 无论是首次还是重试，都要更新状态
        setGames(result.data.data);
        setFromCache(result.fromCache || false);
        setHasData(true);
        setUsingFallback(false);
        setRetryCount(attemptNumber);
        setLoading(false);
        
        // 清除后台重试定时器
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = null;
        }
        
        log.info('Games loaded successfully', {
          endpoint: finalConfig.endpoint,
          gameId: currentGameId,
          count: result.data.data.length,
          fromCache: result.fromCache,
          attempt: attemptNumber + 1,
          wasRetry: attemptNumber > 0
        });
        
        return;
      } else {
        // 没有数据，尝试重试或降级
        throw new Error('No data received');
      }
    } catch (err) {
      log.warn(`Games fetch attempt ${attemptNumber + 1} failed`, {
        endpoint: finalConfig.endpoint,
        gameId: currentGameId,
        error: err instanceof Error ? err.message : 'Unknown error',
        attempt: attemptNumber + 1,
        maxRetries: maxRetries + 1
      });
      
      // 重试逻辑
      if (attemptNumber < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attemptNumber), 3000);
        setTimeout(() => {
          fetchGames(attemptNumber + 1);
        }, delay);
        return;
      }
      
      // 所有重试都失败，执行降级策略
      handleFallbackStrategy();
    }
  }, [currentGameId, isVisible, maxRetries, finalConfig.endpoint, finalConfig.params]);

  // 降级策略处理
  const handleFallbackStrategy = useCallback(() => {
    const networkStatus = getNetworkStatus();
    
    // 使用配置的降级游戏或默认降级游戏
    const availableFallbackGames = finalConfig.fallbackGames.length > 0 
      ? finalConfig.fallbackGames 
      : DEFAULT_FALLBACK_GAMES;
    
    // 排除指定游戏（比如当前游戏）
    const fallbackGames = availableFallbackGames
      .filter(game => game.id !== finalConfig.excludeGameId)
      .slice(0, finalConfig.limit);
    
    if (fallbackGames.length > 0) {
      setGames(fallbackGames);
      setHasData(true);
      setUsingFallback(true);
      setLoading(false);
      
      log.info('Using fallback popular games', {
        endpoint: finalConfig.endpoint,
        gameId: currentGameId,
        fallbackCount: fallbackGames.length,
        networkStatus
      });
      
      // 清除任何现有的后台重试定时器
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      
      // 设置后台重试机制：8秒后再次尝试获取真实数据
      retryTimeoutRef.current = setTimeout(() => {
        log.debug('Background retry attempt for real data', {
          endpoint: finalConfig.endpoint,
          gameId: currentGameId,
          backgroundRetry: true
        });
        fetchGames(0); // 重新开始重试循环
      }, backgroundRetryInterval);
    } else {
      // 没有可用的降级内容，优雅隐藏
      setHasData(false);
      setLoading(false);
      
      log.warn('No fallback games available, hiding section', {
        endpoint: finalConfig.endpoint,
        gameId: currentGameId,
        networkStatus
      });
    }
  }, [currentGameId, finalConfig.fallbackGames, finalConfig.excludeGameId, finalConfig.limit, finalConfig.endpoint, backgroundRetryInterval, fetchGames]);

  // 设置总超时控制
  useEffect(() => {
    if (!isVisible) return;
    
    const timeoutId = setTimeout(() => {
      if (loading && !hasData) {
        log.warn('Game loading timeout', {
          endpoint: finalConfig.endpoint,
          gameId: currentGameId,
          timeout: loadingTimeout
        });
        handleFallbackStrategy();
      }
    }, loadingTimeout);

    return () => clearTimeout(timeoutId);
  }, [isVisible, loading, hasData, currentGameId, loadingTimeout, handleFallbackStrategy]);

  // 启动数据获取
  useEffect(() => {
    if (isVisible) {
      // 对于需要currentGameId的API（如相关游戏），需要currentGameId
      if (finalConfig.endpoint.includes('getRelatedGames')) {
        if (currentGameId) {
          fetchGames(0);
        }
      } else {
        // 对于不需要currentGameId的API（如新游戏），直接获取
        fetchGames(0);
      }
    }
  }, [isVisible, currentGameId, fetchGames, finalConfig.endpoint]);

  // 组件清理：清除后台重试定时器
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  // 如果没有数据且不在加载中，不显示组件
  if (!hasData && !loading) {
    return null;
  }

  return (
    <section 
      ref={componentRef}
      className={finalConfig.containerClass}
      aria-label="Game recommendations"
      role="complementary"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题部分 */}
        {finalConfig.showTitle && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {finalConfig.title}
            </h2>
            {finalConfig.subtitle && (
              <p className="text-gray-600">
                {finalConfig.subtitle}
              </p>
            )}
          </div>
        )}

        {/* 骨架屏加载状态 */}
        {loading && !hasData && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6" aria-label="Loading games">
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

        {/* 游戏网格 */}
        {hasData && games.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {games.map((game) => (
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
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600 space-y-1">
            <div><strong>Debug Info:</strong></div>
            <div>Game ID: {currentGameId || 'None'}</div>
            <div>Visible: {isVisible.toString()}</div>
            <div>Loading: {loading.toString()}</div>
            <div>Has Data: {hasData.toString()}</div>
            <div>Using Fallback: {usingFallback.toString()}</div>
            <div>Games Count: {games.length}</div>
            <div>From Cache: {fromCache.toString()}</div>
            <div>Retry Count: {retryCount}</div>
            <div>Is Mounted: {isMounted.toString()}</div>
            <div>Enable Lazy Load: {finalConfig.enableLazyLoad?.toString() || 'undefined'}</div>
          </div>
        )}
      </div>
    </section>
  );
}

// 主组件（带错误边界）
export function GameRecommendationSection({ config, currentGameId }: GameRecommendationSectionProps) {
  return (
    <ErrorBoundary
      fallback={
        <section 
          className="py-10 my-10 max-w-5xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 min-h-[200px]"
          aria-label="Game recommendations (error state)"
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
        log.error('GameRecommendationSection component error boundary triggered', error, {
          componentStack: errorInfo.componentStack,
          gameId: currentGameId
        });
      }}
    >
      <GameRecommendationCore config={config} currentGameId={currentGameId} />
    </ErrorBoundary>
  );
}

// 预设配置工厂函数
export const createGameRecommendationConfig = {
  // 相关游戏推荐配置
  relatedGames: (gameId: string): GameRecommendationConfig => ({
    endpoint: '/api/getRelatedGames',
    params: { limit: '8' },
    title: 'Other Games You Might Like',
    subtitle: 'Discover similar games and popular recommendations',
    limit: 8,
    fallbackGames: DEFAULT_FALLBACK_GAMES,
    excludeGameId: gameId
  }),

  // 最新游戏配置
  newGames: (limit: number = 16): GameRecommendationConfig => ({
    endpoint: '/api/getGamesByCategory',
    params: { categoryId: 'new-games', limit: String(limit), offset: '0' },
    title: 'Latest New Games',
    subtitle: 'Discover the newest games just added to our collection',
    limit,
    fallbackGames: DEFAULT_FALLBACK_GAMES,
    enableLazyLoad: false, // 新游戏通常在页面顶部，不需要懒加载
    containerClass: "py-10 my-10 max-w-5xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100"
  })
};