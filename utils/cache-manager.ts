/**
 * 智能缓存管理器
 * 提供统一的缓存管理，支持多层缓存失效
 */

interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  etag?: string;
  dependencies?: string[];
  customTTL?: number; // 自定义TTL，优先级高于默认TTL
}

class CacheManager {
  private memoryCache = new Map<string, CacheEntry>();
  private readonly DEFAULT_TTL = 30 * 60 * 1000; // 30分钟默认TTL
  
  // 不同类型数据的TTL配置
  private readonly TTL_CONFIGS = {
    // 游戏数据：30分钟（数据相对稳定）
    games: 30 * 60 * 1000,
    mainGame: 30 * 60 * 1000,
    gameDetail: 30 * 60 * 1000,
    
    // 分类数据：60分钟（很少变动）
    categories: 60 * 60 * 1000,
    
    // 评分数据：15分钟（需要相对及时更新）
    ratings: 15 * 60 * 1000,
    
    // 评论数据：10分钟（用户交互频繁）
    comments: 10 * 60 * 1000,
    
    // 搜索结果：5分钟（实时性要求较高）
    search: 5 * 60 * 1000,
    
    // 性能数据：1分钟（需要实时监控）
    performance: 1 * 60 * 1000
  };

  /**
   * 设置缓存
   */
  set<T>(key: string, data: T, dependencies?: string[], etag?: string, customTTL?: number): void {
    this.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      etag,
      dependencies,
      customTTL
    });
  }

  /**
   * 设置缓存（带类型）- 自动选择合适的TTL
   */
  setWithType<T>(key: string, data: T, type: keyof typeof this.TTL_CONFIGS, dependencies?: string[], etag?: string): void {
    const customTTL = this.TTL_CONFIGS[type];
    this.set(key, data, dependencies, etag, customTTL);
  }

  /**
   * 获取缓存
   */
  get<T>(key: string): T | null {
    const entry = this.memoryCache.get(key);
    
    if (!entry) {
      return null;
    }

    // 获取适用的TTL（优先使用自定义TTL）
    const ttl = entry.customTTL || this.DEFAULT_TTL;

    // 检查是否过期
    if (Date.now() - entry.timestamp > ttl) {
      this.memoryCache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * 删除特定缓存
   */
  delete(key: string): boolean {
    return this.memoryCache.delete(key);
  }

  /**
   * 批量删除缓存（根据模式匹配）
   */
  invalidate(pattern: string): number {
    let deleted = 0;
    
    this.memoryCache.forEach((entry, key) => {
      if (key.includes(pattern)) {
        this.memoryCache.delete(key);
        deleted++;
      }
    });
    
    return deleted;
  }

  /**
   * 根据依赖关系清除缓存
   */
  invalidateByDependency(dependency: string): number {
    let deleted = 0;
    
    this.memoryCache.forEach((entry, key) => {
      if (entry.dependencies?.includes(dependency)) {
        this.memoryCache.delete(key);
        deleted++;
      }
    });
    
    return deleted;
  }

  /**
   * 清除所有缓存
   */
  clear(): void {
    this.memoryCache.clear();
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    const now = Date.now();
    let expired = 0;
    let valid = 0;

    this.memoryCache.forEach((entry, key) => {
      const ttl = entry.customTTL || this.DEFAULT_TTL;
      if (now - entry.timestamp > ttl) {
        expired++;
      } else {
        valid++;
      }
    });

    return {
      total: this.memoryCache.size,
      valid,
      expired,
      keys: Array.from(this.memoryCache.keys())
    };
  }

  /**
   * 清理过期缓存
   */
  cleanup(): number {
    const now = Date.now();
    let cleaned = 0;

    this.memoryCache.forEach((entry, key) => {
      const ttl = entry.customTTL || this.DEFAULT_TTL;
      if (now - entry.timestamp > ttl) {
        this.memoryCache.delete(key);
        cleaned++;
      }
    });

    return cleaned;
  }

  /**
   * 检查浏览器缓存并清除
   */
  async clearBrowserCache(pattern?: string): Promise<boolean> {
    if (typeof window === 'undefined' || !('caches' in window)) {
      return false;
    }

    try {
      const cacheNames = await caches.keys();
      
      if (pattern) {
        // 清除特定模式的缓存
        await Promise.all(
          cacheNames.map(async cacheName => {
            const cache = await caches.open(cacheName);
            const requests = await cache.keys();
            
            await Promise.all(
              requests
                .filter(request => request.url.includes(pattern))
                .map(request => cache.delete(request))
            );
          })
        );
      } else {
        // 清除所有缓存
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      return true;
    } catch (error) {
      console.warn('Failed to clear browser cache:', error);
      return false;
    }
  }

  /**
   * 生成基于内容的ETag
   */
  generateETag(data: any, prefix = ''): string {
    const content = JSON.stringify(data);
    const timestamp = Date.now();
    const hash = Buffer.from(content).toString('base64').slice(0, 10);
    
    return `"${prefix}${hash}-${timestamp}"`;
  }

  /**
   * 验证ETag是否匹配
   */
  validateETag(requestETag: string | null, currentETag: string): boolean {
    return requestETag === currentETag;
  }
}

// 单例模式
export const cacheManager = new CacheManager();

// 定期清理过期缓存
if (typeof window !== 'undefined') {
  setInterval(() => {
    const cleaned = cacheManager.cleanup();
    if (cleaned > 0) {
      console.log(`Cleaned ${cleaned} expired cache entries`);
    }
  }, 60 * 1000); // 每分钟清理一次
}

export default cacheManager;

