// 统一的日志管理工具
// 解决生产环境console.log性能问题

interface LogContext {
  module?: string;
  operation?: string;
  gameId?: string;
  categoryId?: string;
  duration?: number;
  attempt?: number;
  maxRetries?: number;
  [key: string]: any;
}

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn', 
  INFO = 'info',
  DEBUG = 'debug'
}

class Logger {
  private isDevelopment: boolean;
  private enablePerformanceLogging: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.enablePerformanceLogging = process.env.ENABLE_PERFORMANCE_LOGGING === 'true';
  }

  /**
   * 错误日志 - 总是输出
   */
  error(message: string, error?: any, context?: LogContext) {
    console.error(this.formatMessage(LogLevel.ERROR, message, context), error);
  }

  /**
   * 警告日志 - 总是输出
   */
  warn(message: string, context?: LogContext) {
    console.warn(this.formatMessage(LogLevel.WARN, message, context));
  }

  /**
   * 信息日志 - 仅开发环境或启用性能监控时
   */
  info(message: string, context?: LogContext) {
    if (this.isDevelopment || this.enablePerformanceLogging) {
      console.log(this.formatMessage(LogLevel.INFO, message, context));
    }
  }

  /**
   * 调试日志 - 仅开发环境
   */
  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.log(this.formatMessage(LogLevel.DEBUG, message, context));
    }
  }

  /**
   * 性能日志 - API响应时间等
   */
  performance(operation: string, duration: number, context?: LogContext) {
    if (this.isDevelopment || this.enablePerformanceLogging) {
      const performanceContext = { ...context, operation, duration };
      console.log(this.formatMessage(LogLevel.INFO, `⚡ ${operation}: ${duration}ms`, performanceContext));
    }
  }

  /**
   * API日志 - 统一API调用日志格式
   */
  api(method: string, endpoint: string, duration: number, success: boolean, context?: LogContext) {
    const status = success ? '✅' : '❌';
    const message = `${status} ${method} ${endpoint}: ${duration}ms`;
    this.performance(`API ${method}`, duration, { ...context, endpoint, success });
  }

  /**
   * 数据库操作日志
   */
  db(operation: string, duration: number, result: any, context?: LogContext) {
    if (this.isDevelopment || this.enablePerformanceLogging) {
      const dbContext = { ...context, operation, duration, resultCount: Array.isArray(result) ? result.length : 1 };
      console.log(this.formatMessage(LogLevel.INFO, `🗄️  ${operation}: ${duration}ms`, dbContext));
    }
  }

  /**
   * 格式化日志消息
   */
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }
}

// 单例导出
export const logger = new Logger();

// 向后兼容的简化接口
export const log = {
  error: (message: string, error?: any, context?: LogContext) => logger.error(message, error, context),
  warn: (message: string, context?: LogContext) => logger.warn(message, context),
  info: (message: string, context?: LogContext) => logger.info(message, context),
  debug: (message: string, context?: LogContext) => logger.debug(message, context),
  performance: (operation: string, duration: number, context?: LogContext) => logger.performance(operation, duration, context),
  api: (method: string, endpoint: string, duration: number, success: boolean, context?: LogContext) => 
    logger.api(method, endpoint, duration, success, context),
  db: (operation: string, duration: number, result: any, context?: LogContext) => 
    logger.db(operation, duration, result, context)
};