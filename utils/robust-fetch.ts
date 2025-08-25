// 健壮的数据获取工具
// 解决网络超时、连接失败等问题的完整解决方案

import { log } from '@/utils/logger';

export interface FetchOptions {
  timeout?: number;                    // 超时时间（毫秒）
  retries?: number;                   // 重试次数
  retryDelay?: number;                // 重试延迟（毫秒）
  retryDelayMultiplier?: number;      // 延迟倍数（指数退避）
  fallbackData?: any;                 // 降级数据
  cacheKey?: string;                  // 缓存键
  enableCache?: boolean;              // 是否启用缓存
}

export interface NetworkStatus {
  isOnline: boolean;
  effectiveType?: string;
  downlink?: number;
}

// 网络状态检测
export function getNetworkStatus(): NetworkStatus {
  if (typeof navigator === 'undefined') {
    return { isOnline: true };
  }

  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  return {
    isOnline: navigator.onLine,
    effectiveType: connection?.effectiveType,
    downlink: connection?.downlink
  };
}

// 内存缓存实现（简单版本）
class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  set(key: string, data: any, ttl: number = 300000) { // 默认5分钟
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  // 公开方法获取过期条目
  getStale(key: string): any | null {
    const entry = this.cache.get(key);
    return entry ? entry.data : null;
  }
  
  clear() {
    this.cache.clear();
  }
}

const memoryCache = new MemoryCache();

// 超时控制
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Request timeout after ${timeoutMs}ms`)), timeoutMs);
    })
  ]);
}

// 延迟函数
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 健壮的fetch实现
export async function robustFetch<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<{
  success: boolean;
  data: T | null;
  error?: string;
  fromCache?: boolean;
  attempt?: number;
  networkStatus?: NetworkStatus;
}> {
  const {
    timeout = 5000,           // 5秒超时
    retries = 3,              // 重试3次
    retryDelay = 1000,        // 1秒延迟
    retryDelayMultiplier = 2, // 指数退避
    fallbackData = null,
    cacheKey,
    enableCache = true
  } = options;

  const networkStatus = getNetworkStatus();
  
  // 检查网络状态
  if (!networkStatus.isOnline) {
    log.warn('Network is offline, attempting to use cache', { url, cacheKey });
    
    if (cacheKey && enableCache) {
      const cachedData = memoryCache.get(cacheKey);
      if (cachedData) {
        return { 
          success: true, 
          data: cachedData, 
          fromCache: true,
          networkStatus 
        };
      }
    }
    
    return {
      success: false,
      data: fallbackData,
      error: 'No network connection available',
      networkStatus
    };
  }

  // 优先返回缓存数据
  if (cacheKey && enableCache) {
    const cachedData = memoryCache.get(cacheKey);
    if (cachedData) {
      log.debug('Returning cached data', { url, cacheKey });
      return { 
        success: true, 
        data: cachedData, 
        fromCache: true,
        networkStatus 
      };
    }
  }

  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      log.debug(`Fetch attempt ${attempt}/${retries + 1}`, { 
        url, 
        attempt, 
        timeout,
        networkStatus 
      });

      const startTime = Date.now();
      
      const response = await withTimeout(
        fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        }),
        timeout
      );

      const duration = Date.now() - startTime;
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      log.api('GET', url, duration, true, { 
        attempt, 
        fromCache: false,
        networkType: networkStatus.effectiveType 
      });

      // 缓存成功的响应
      if (cacheKey && enableCache && data) {
        memoryCache.set(cacheKey, data);
      }

      return {
        success: true,
        data,
        attempt,
        networkStatus
      };

    } catch (error) {
      lastError = error as Error;
      const duration = Date.now();
      
      log.warn(`Fetch attempt ${attempt} failed`, {
        url,
        attempt,
        error: lastError.message,
        networkStatus
      });

      // 如果不是最后一次尝试，等待后重试
      if (attempt <= retries) {
        const delayTime = retryDelay * Math.pow(retryDelayMultiplier, attempt - 1);
        log.debug(`Retrying in ${delayTime}ms...`, { url, attempt, delayTime });
        await delay(delayTime);
      }
    }
  }

  // 所有重试都失败了，尝试返回缓存或降级数据
  log.error(`All fetch attempts failed for ${url}`, lastError, {
    url,
    attempts: retries + 1,
    networkStatus
  });

  // 尝试返回过期的缓存数据
  if (cacheKey && enableCache) {
    const staleData = memoryCache.getStale(cacheKey);
    if (staleData) {
      log.warn('Returning stale cached data due to fetch failure', { url, cacheKey });
      return {
        success: true,
        data: staleData,
        fromCache: true,
        error: `Using stale data: ${lastError?.message}`,
        networkStatus
      };
    }
  }

  return {
    success: false,
    data: fallbackData,
    error: lastError?.message || 'Unknown error',
    attempt: retries + 1,
    networkStatus
  };
}

// 专用的游戏数据获取函数
export async function fetchGameData<T>(
  endpoint: string,
  params: Record<string, string> = {},
  options: Partial<FetchOptions> = {}
): Promise<{
  success: boolean;
  data: T | null;
  error?: string;
  fromCache?: boolean;
}> {
  const searchParams = new URLSearchParams(params);
  const url = `${endpoint}?${searchParams.toString()}`;
  const cacheKey = `game-data:${url}`;

  return robustFetch<T>(url, {
    timeout: 8000,      // 游戏数据允许稍长的超时
    retries: 2,         // 减少重试次数
    retryDelay: 800,    // 减少延迟
    cacheKey,
    enableCache: true,
    ...options
  });
}

// 清理缓存的工具函数
export function clearGameDataCache() {
  memoryCache.clear();
  log.info('Game data cache cleared');
}

// 预热常用数据的函数
export async function preloadGameData(gameId: string) {
  const endpoints: Array<{ endpoint: string; params: Record<string, string> }> = [
    { endpoint: '/api/getRelatedGames', params: { gameId, limit: '16' } },
    { endpoint: '/api/games/rating', params: { gameId } }
  ];

  const results = await Promise.allSettled(
    endpoints.map(({ endpoint, params }) => 
      fetchGameData(endpoint, params, { timeout: 3000 })
    )
  );

  log.debug('Preload completed', { 
    gameId, 
    successful: results.filter(r => r.status === 'fulfilled').length,
    total: results.length 
  });
}