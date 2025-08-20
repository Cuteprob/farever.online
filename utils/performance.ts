// 性能监控和优化工具

interface PerformanceMetrics {
  operation: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private enabled: boolean;
  private slowQueryThreshold: number;

  constructor() {
    this.enabled = process.env.ENABLE_PERFORMANCE_MONITORING === 'true';
    this.slowQueryThreshold = parseInt(process.env.SLOW_QUERY_THRESHOLD || '1000');
  }

  // 记录性能指标
  recordMetric(operation: string, duration: number, metadata?: Record<string, any>) {
    if (!this.enabled) return;

    const metric: PerformanceMetrics = {
      operation,
      duration,
      timestamp: Date.now(),
      metadata
    };

    this.metrics.push(metric);

    // 记录慢查询
    if (duration > this.slowQueryThreshold) {
      console.warn(`Slow query detected: ${operation} took ${duration}ms`, metadata);
    }

    // 保持指标数组大小
    if (this.metrics.length > 1000) {
      this.metrics.shift();
    }
  }

  // 获取性能统计
  getStats() {
    if (!this.enabled) return null;

    const recentMetrics = this.metrics.filter(
      m => Date.now() - m.timestamp < 300000 // 最近5分钟
    );

    const operationStats = recentMetrics.reduce((acc, metric) => {
      if (!acc[metric.operation]) {
        acc[metric.operation] = {
          count: 0,
          totalDuration: 0,
          avgDuration: 0,
          maxDuration: 0,
          minDuration: Infinity
        };
      }

      const stats = acc[metric.operation];
      stats.count++;
      stats.totalDuration += metric.duration;
      stats.maxDuration = Math.max(stats.maxDuration, metric.duration);
      stats.minDuration = Math.min(stats.minDuration, metric.duration);
      stats.avgDuration = stats.totalDuration / stats.count;

      return acc;
    }, {} as Record<string, any>);

    return {
      totalOperations: recentMetrics.length,
      operationStats,
      slowQueries: recentMetrics.filter(m => m.duration > this.slowQueryThreshold).length
    };
  }

  // 清除指标
  clearMetrics() {
    this.metrics = [];
  }
}

// 单例模式
export const performanceMonitor = new PerformanceMonitor();

// 性能测量装饰器
export function measurePerformance(operation: string, metadata?: Record<string, any>) {
  return function <T extends (...args: any[]) => Promise<any>>(
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const method = descriptor.value!;

    descriptor.value = async function (this: any, ...args: any[]) {
      const startTime = Date.now();
      try {
        const result = await method.apply(this, args);
        const duration = Date.now() - startTime;
        performanceMonitor.recordMetric(operation, duration, metadata);
        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        performanceMonitor.recordMetric(`${operation}_error`, duration, { 
          ...metadata, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
        throw error;
      }
    } as T;

    return descriptor;
  };
}

// 简单的性能测量函数
export async function measureAsync<T>(
  operation: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const startTime = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - startTime;
    performanceMonitor.recordMetric(operation, duration, metadata);
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    performanceMonitor.recordMetric(`${operation}_error`, duration, { 
      ...metadata, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    throw error;
  }
}

// 内存使用情况监控
export function getMemoryUsage() {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const usage = process.memoryUsage();
    return {
      rss: Math.round(usage.rss / 1024 / 1024), // MB
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024), // MB
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024), // MB
      external: Math.round(usage.external / 1024 / 1024), // MB
    };
  }
  return null;
}

// 缓存命中率统计
interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
}

class CacheMonitor {
  private stats = new Map<string, CacheStats>();

  recordHit(cacheKey: string) {
    const stats = this.stats.get(cacheKey) || { hits: 0, misses: 0, hitRate: 0 };
    stats.hits++;
    stats.hitRate = stats.hits / (stats.hits + stats.misses);
    this.stats.set(cacheKey, stats);
  }

  recordMiss(cacheKey: string) {
    const stats = this.stats.get(cacheKey) || { hits: 0, misses: 0, hitRate: 0 };
    stats.misses++;
    stats.hitRate = stats.hits / (stats.hits + stats.misses);
    this.stats.set(cacheKey, stats);
  }

  getStats() {
    return Object.fromEntries(this.stats.entries());
  }

  clearStats() {
    this.stats.clear();
  }
}

export const cacheMonitor = new CacheMonitor();
