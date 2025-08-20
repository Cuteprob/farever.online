/**
 * 缓存调试工具 - 帮助诊断缓存问题
 */

export class CacheDebugger {
  private static instance: CacheDebugger;
  private logs: Array<{
    timestamp: number;
    type: 'set' | 'get' | 'clear' | 'miss' | 'hit';
    key: string;
    gameId?: string;
    value?: any;
  }> = [];

  static getInstance(): CacheDebugger {
    if (!CacheDebugger.instance) {
      CacheDebugger.instance = new CacheDebugger();
    }
    return CacheDebugger.instance;
  }

  log(type: 'set' | 'get' | 'clear' | 'miss' | 'hit', key: string, gameId?: string, value?: any) {
    this.logs.push({
      timestamp: Date.now(),
      type,
      key,
      gameId,
      value: type === 'set' ? value : undefined
    });

    // 保持最多100条日志
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }

    // 开发环境下输出到控制台
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Cache ${type.toUpperCase()}]`, {
        key,
        gameId,
        timestamp: new Date().toISOString(),
        value: type === 'set' ? value : undefined
      });
    }
  }

  getLogsForGame(gameId: string) {
    return this.logs.filter(log => 
      log.gameId === gameId || 
      log.key.includes(gameId)
    );
  }

  getAllLogs() {
    return [...this.logs];
  }

  clear() {
    this.logs = [];
  }

  // 获取缓存命中率统计
  getStats() {
    const total = this.logs.length;
    const hits = this.logs.filter(log => log.type === 'hit').length;
    const misses = this.logs.filter(log => log.type === 'miss').length;
    const sets = this.logs.filter(log => log.type === 'set').length;
    const clears = this.logs.filter(log => log.type === 'clear').length;

    return {
      total,
      hits,
      misses,
      sets,
      clears,
      hitRate: total > 0 ? (hits / (hits + misses)) * 100 : 0
    };
  }
}

// 全局调试器实例
export const cacheDebugger = CacheDebugger.getInstance();

// 添加到window对象以便浏览器控制台调试
if (typeof window !== 'undefined') {
  (window as any).cacheDebugger = cacheDebugger;
}
