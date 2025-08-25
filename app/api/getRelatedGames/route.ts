import { NextResponse } from 'next/server';
import { getRelatedGames } from '@/models/games';
import { ApiResponse, GameProps } from '@/types/game';
import { getCacheHeaders, CacheType } from '@/utils/cache-config';
import { log } from '@/utils/logger';

// 使用 Edge Runtime 提升性能
export const runtime = 'edge';

// 设置缓存策略
export const revalidate = 300; // 5分钟重新验证

// 请求超时控制
const REQUEST_TIMEOUT = 8000; // 8秒超时

// 超时控制装饰器
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Request timeout after ${timeoutMs}ms`)), timeoutMs);
    })
  ]);
}

export async function GET(request: Request) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');
    const limit = parseInt(searchParams.get('limit') || '16');
    
    // 参数验证
    if (!gameId) {
      log.warn('Missing gameId parameter', { url: request.url });
      return new NextResponse(JSON.stringify({
        success: false,
        error: 'gameId parameter is required',
        data: []
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...getCacheHeaders(CacheType.NO_CACHE)
        }
      });
    }

    if (limit > 50) {
      log.warn('Limit too high', { gameId, limit });
      return new NextResponse(JSON.stringify({
        success: false,
        error: 'Limit cannot exceed 50',
        data: []
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...getCacheHeaders(CacheType.NO_CACHE)
        }
      });
    }
    
    log.debug('Fetching related games', { gameId, limit });
    
    // 使用超时控制获取相关游戏
    const relatedGames = await withTimeout(
      getRelatedGames(gameId, limit),
      REQUEST_TIMEOUT
    );
    
    const duration = Date.now() - startTime;
    
    // 记录性能指标
    log.api('GET', '/api/getRelatedGames', duration, true, { 
      gameId, 
      limit, 
      resultCount: relatedGames.length 
    });
    
    const response: ApiResponse<GameProps[]> = {
      success: true,
      data: relatedGames,
      count: relatedGames.length
    };

    // 设置缓存头 - 只在有数据时缓存
    const cacheHeaders = getCacheHeaders(
      CacheType.GAMES_LIST,
      undefined,
      true,
      relatedGames.length > 0
    );

    const headers = {
      'Content-Type': 'application/json',
      'X-Response-Time': `${duration}ms`,
      'X-Game-Count': relatedGames.length.toString(),
      'X-Cache-Status': relatedGames.length > 0 ? 'cached' : 'no-cache',
      ...cacheHeaders
    };

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers
    });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    const isTimeout = error instanceof Error && error.message.includes('timeout');
    
    log.error('getRelatedGames API Error', error, { 
      duration,
      isTimeout,
      url: request.url
    });
    
    // 区分不同类型的错误
    let statusCode = 500;
    let errorMessage = 'Internal server error';
    
    if (isTimeout) {
      statusCode = 504;
      errorMessage = 'Request timeout - the server took too long to respond';
    } else if (error instanceof Error) {
      // 数据库连接错误
      if (error.message.includes('connect') || error.message.includes('ECONNREFUSED')) {
        statusCode = 503;
        errorMessage = 'Database connection error';
      } else {
        errorMessage = error.message;
      }
    }
    
    const errorResponse: ApiResponse<GameProps[]> = {
      success: false,
      error: errorMessage,
      data: [],
      meta: {
        duration,
        isTimeout,
        timestamp: new Date().toISOString()
      }
    };

    return new NextResponse(JSON.stringify(errorResponse), {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'X-Response-Time': `${duration}ms`,
        'X-Error-Type': isTimeout ? 'timeout' : 'server-error',
        ...getCacheHeaders(CacheType.NO_CACHE)
      }
    });
  }
}

// 支持 HEAD 请求用于健康检查
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=60'
    }
  });
}
