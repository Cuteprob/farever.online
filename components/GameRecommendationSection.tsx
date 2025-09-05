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
  containerClass: "py-theme-2xl my-theme-2xl max-w-5xl mx-auto bg-theme-dark-800 rounded-lg shadow-neon border border-theme-dark-600 min-h-[400px]",
  showTitle: true
};

// 热门游戏静态列表作为通用降级内容
const DEFAULT_FALLBACK_GAMES: GameProps[] = [
  { 
    id: 'kitty-scramble', 
    title: 'Kitty Scramble', 
    image: 'https://games.bunnymarket.app/kitty-scramble/kitty-scramble.jpg', 
    categories: [''],
    rating: { averageRating: 4.5, totalRatings: 120 },
    iframeUrl: '',
    createdAt: '',
    content: '',
    metadata: { title: '', description: '', keywords: [''] }
  },
  { 
    id: 'bunny-market', 
    title: 'Bunny Market', 
    image: 'https://games.bunnymarket.app/bunny-market/bunny-market.jpg', 
    categories: ['Popular'],
    rating: { averageRating: 4.3, totalRatings: 98 },
    iframeUrl: '/games/sprunki-but-alpha',
    createdAt: '2024-01-01',
    content: 'Popular Sprunki alpha version',
    metadata: { title: 'Sprunki But Alpha', description: 'Alpha version', keywords: ['sprunki', 'alpha'] }
  },
  { 
    id: 'the-mergest-kingdom', 
    title: 'The Mergest Kingdom', 
    image: 'https://games.bunnymarket.app/the-mergest-kingdom/the-mergest-kingdom.jpg', 
    categories: ['Popular'],
    rating: { averageRating: 4.7, totalRatings: 156 },
    iframeUrl: '/games/sprunki-phase-4',
    createdAt: '2024-01-01',
    content: 'Latest Sprunki phase',
    metadata: { title: 'Sprunki Phase 4', description: 'Latest phase', keywords: ['sprunki', 'phase4'] }
  },
  { 
    id: 'kitten-never-dies', 
    title: 'Kitten Never Dies', 
    image: 'https://games.bunnymarket.app/kitten-never-dies/kitten-never-dies.jpg', 
    categories: ['Popular'],
    rating: { averageRating: 4.2, totalRatings: 89 },
    iframeUrl: '/games/sprunki-mustard',
    createdAt: '2024-01-01',
    content: 'Sprunki mustard edition',
    metadata: { title: 'Sprunki Mustard', description: 'Mustard edition', keywords: ['sprunki', 'mustard'] }
  },
  { 
    id: 'catch-the-goose', 
    title: 'Catch The Goose', 
    image: 'https://games.bunnymarket.app/catch-the-goose/catch-the-goose.jpg', 
    categories: ['Popular'],
    rating: { averageRating: 4.6, totalRatings: 134 },
    iframeUrl: '/games/sprunki-incredibox',
    createdAt: '2024-01-01',
    content: 'Sprunki Incredibox style',
    metadata: { title: 'Sprunki Incredibox', description: 'Incredibox style', keywords: ['sprunki', 'incredibox'] }
  },
  { 
    id: 'sugar-heroes', 
    title: 'Sugar Heroes', 
    image: 'https://games.bunnymarket.app/sugar-heroes/sugar-heroes.jpg', 
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
        // 重新开始重试循环 - 这里会触发数据获取useEffect
        setUsingFallback(false);
        setLoading(true);
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
  }, [currentGameId, finalConfig.fallbackGames, finalConfig.excludeGameId, finalConfig.limit, finalConfig.endpoint, backgroundRetryInterval]);

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
  }, [currentGameId, isVisible, maxRetries, finalConfig.endpoint, finalConfig.params, handleFallbackStrategy]);

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
  }, [isVisible, loading, hasData, currentGameId, loadingTimeout, handleFallbackStrategy, finalConfig.endpoint]);

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
      <div className="max-w-3xl mx-auto px-0 sm:px-2 lg:px-0">
        {/* 标题部分 */}
        {finalConfig.showTitle && (
          <div className="text-center mb-4">
            <h2 className="text-theme-2xl font-theme-heading font-bold text-primary mb-theme-xs">
              {finalConfig.title}
            </h2>
          </div>
        )}

        {/* 骨架屏加载状态 */}
        {loading && !hasData && (
          <div className={`grid gap-3 sm:gap-4 ${
            finalConfig.gridCols 
              ? `grid-cols-${finalConfig.gridCols.mobile} sm:grid-cols-${finalConfig.gridCols.tablet} lg:grid-cols-${finalConfig.gridCols.desktop}`
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2'
          }`} aria-label="Loading games">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-theme-dark-700 rounded-xl shadow-neon overflow-hidden loading-skeleton">
                <div className="aspect-[3/2] bg-theme-dark-600"></div>
                <div className="p-4">
                  <div className="h-theme-md bg-theme-dark-600 rounded mb-theme-xs"></div>
                  <div className="h-theme-sm bg-theme-dark-600 rounded w-2/3 mb-theme-sm"></div>
                  <div className="h-theme-xl bg-theme-dark-600 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 游戏网格 */}
        {hasData && games.length > 0 && (
          <div className={`grid gap-3 sm:gap-4 ${
            finalConfig.gridCols 
              ? `grid-cols-${finalConfig.gridCols.mobile} sm:grid-cols-${finalConfig.gridCols.tablet} lg:grid-cols-${finalConfig.gridCols.desktop}`
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2'
          }`}>
            {games.map((game) => (
              <Link
                key={game.id}
                href={`/${game.id}`}
                className="group block"
                aria-label={`Play ${game.title}`}
              >
                <div className="bg-theme-dark-800 rounded-xl shadow-neon border border-theme-dark-600 overflow-hidden transition-all duration-300 group-hover:shadow-game-hover group-hover:border-theme-fire-500/20 group-hover:-translate-y-1">
                  {/* 游戏图片 */}
                  <div className="aspect-[3/2] relative overflow-hidden bg-gradient-to-br from-theme-dark-700 to-theme-dark-600">
                    <img
                      src={game.image}
                      alt={`${game.title} game screenshot`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.png';
                      }}
                    />
                    
                    {/* 评分显示 - 右上角 */}
                    {game.rating && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3 fill-yellow-400" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                          <span className="font-medium">
                            {(() => {
                              if (typeof game.rating === 'object' && game.rating?.averageRating) {
                                return game.rating.averageRating.toFixed(1);
                              }
                              if (typeof game.rating === 'number') {
                                return (game.rating as number).toFixed(1);
                              }
                              return '0.0';
                            })()}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* 悬浮遮罩效果 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* 游戏信息 */}
                  <div className="p-4">
                    <h3 className="font-theme-heading font-medium text-primary text-theme-sm group-hover:text-theme-fire-500 transition-colors line-clamp-1 truncate">
                      {game.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 开发环境调试信息 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-theme-md p-theme-sm bg-theme-dark-700 rounded text-theme-xs text-helper space-y-1">
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
          className="py-theme-2xl my-theme-2xl max-w-5xl mx-auto bg-theme-dark-800 rounded-lg shadow-neon border border-theme-dark-600 min-h-[200px]"
          aria-label="Game recommendations (error state)"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="max-w-sm mx-auto">
                <svg className="w-theme-3xl h-theme-3xl text-helper mx-auto mb-theme-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.051 0-3.969.77-5.412 2.036M15 9.5a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-theme-lg font-theme-heading font-medium text-primary mb-theme-xs">Recommendations Unavailable</h3>
                <p className="text-helper text-theme-sm">
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

  // 右侧栏相关游戏推荐配置（多列布局，适配2xl空间）
  sidebarRelatedGames: (gameId: string): GameRecommendationConfig => ({
    endpoint: '/api/getRelatedGames',
    params: { limit: '8' }, // 8个游戏，适配2列布局（4行x2列）
    title: 'Related Games',
    subtitle: undefined, // 右侧栏不显示副标题
    limit: 8,
    gridCols: {
      mobile: 1,  // 移动端单列
      tablet: 2,  // 平板双列  
      desktop: 2  // 桌面端双列布局
    },
    fallbackGames: DEFAULT_FALLBACK_GAMES,
    excludeGameId: gameId,
    containerClass: "bg-theme-dark-800 rounded-lg shadow-neon border border-theme-dark-600 p-theme-lg", // 稍微增加内边距适配更宽空间
    showTitle: true
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
    containerClass: "py-theme-2xl my-theme-2xl max-w-5xl mx-auto bg-theme-dark-800 rounded-lg shadow-neon border border-theme-dark-600"
  })
};