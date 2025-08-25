// 统一的API缓存策略配置
// 解决缓存问题：开发环境禁用、分层缓存、ETag支持

interface CacheConfig {
  'Cache-Control': string;
  'ETag'?: string;
  'Vary'?: string;
  [key: string]: string | undefined;
}

export enum CacheType {
  NO_CACHE = 'no-cache',
  GAMES_LIST = 'games_list', 
  RATINGS = 'ratings',
  COMMENTS = 'comments',
  STATIC_DATA = 'static_data',
  SHORT_CACHE = 'short_cache'
}

// 缓存策略配置
const CACHE_STRATEGIES = {
  // 开发环境统一禁用缓存
  development: 'no-cache, no-store, must-revalidate',
  
  // 生产环境分层缓存
  production: {
    [CacheType.NO_CACHE]: 'no-cache, no-store, must-revalidate',
    [CacheType.GAMES_LIST]: 'public, max-age=300, stale-while-revalidate=600',    // 5分钟
    [CacheType.RATINGS]: 'private, max-age=60, must-revalidate',                   // 1分钟，必须验证
    [CacheType.COMMENTS]: 'public, max-age=600, stale-while-revalidate=1200',      // 10分钟（审核机制）
    [CacheType.STATIC_DATA]: 'public, max-age=3600, stale-while-revalidate=7200',  // 1小时
    [CacheType.SHORT_CACHE]: 'public, max-age=60, stale-while-revalidate=120'      // 1分钟
  }
};

/**
 * 获取缓存头配置
 * @param type 缓存类型
 * @param etag 可选的ETag值
 * @param onlyIfDataComplete 只在数据完整时应用缓存（默认true）
 * @param dataExists 数据是否存在/完整
 */
export function getCacheHeaders(
  type: CacheType, 
  etag?: string,
  onlyIfDataComplete: boolean = true,
  dataExists: boolean = true
): Record<string, string> {
  const headers: Record<string, string> = {
    'Cache-Control': getCacheControl(type, onlyIfDataComplete, dataExists),
    'Vary': 'Accept-Encoding'
  };

  if (etag) {
    headers['ETag'] = etag;
  }

  return headers;
}

/**
 * 获取Cache-Control字符串
 */
function getCacheControl(
  type: CacheType, 
  onlyIfDataComplete: boolean, 
  dataExists: boolean
): string {
  // 开发环境强制不缓存
  if (process.env.NODE_ENV === 'development') {
    return CACHE_STRATEGIES.development;
  }

  // 如果要求数据完整但数据不存在/不完整，则不缓存
  if (onlyIfDataComplete && !dataExists) {
    return CACHE_STRATEGIES.production[CacheType.NO_CACHE];
  }

  // 生产环境使用对应的缓存策略
  return CACHE_STRATEGIES.production[type] || CACHE_STRATEGIES.production[CacheType.NO_CACHE];
}

/**
 * 生成ETag
 * @param data 数据内容
 * @param identifier 额外标识符（如gameId）
 */
export function generateETag(data: any, identifier?: string): string {
  const content = typeof data === 'string' ? data : JSON.stringify(data);
  const hash = Buffer.from(content).toString('base64').substring(0, 16);
  return `"${identifier ? `${identifier}-` : ''}${hash}"`;
}

/**
 * 检查If-None-Match头，支持304响应
 * @param request 请求对象
 * @param etag 当前ETag
 */
export function checkIfNoneMatch(request: Request, etag: string): boolean {
  const ifNoneMatch = request.headers.get('if-none-match');
  return ifNoneMatch === etag;
}

/**
 * 创建304 Not Modified响应
 * @param etag ETag值
 * @param cacheType 缓存类型
 */
export function createNotModifiedResponse(etag: string, cacheType: CacheType) {
  return new Response(null, {
    status: 304,
    headers: new Headers(getCacheHeaders(cacheType, etag))
  });
}