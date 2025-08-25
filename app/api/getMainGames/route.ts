import { NextResponse } from 'next/server';
import { getMainGame } from '@/models/games';
import { ApiResponse, GameProps } from '@/types/game';
import { getCacheHeaders, CacheType, generateETag, checkIfNoneMatch, createNotModifiedResponse } from '@/utils/cache-config';
import { log } from '@/utils/logger';

// 使用 Edge Runtime 提升性能
export const runtime = 'edge';

// 设置缓存策略
export const revalidate = 300; // 5分钟重新验证

export async function GET(request: Request) {
  try {
    // 性能监控
    const startTime = Date.now();
    
    const game = await getMainGame();
    
    const duration = Date.now() - startTime;
    
    // 记录性能指标
    log.api('GET', '/api/getMainGames', duration, true, { gameFound: game ? 'yes' : 'no' });
    
    const response: ApiResponse<GameProps | null> = {
      success: true,
      data: game,
      count: game ? 1 : 0
    };

    // 生成ETag用于缓存验证
    const etag = generateETag(response);
    
    // 检查条件请求
    if (checkIfNoneMatch(request, etag)) {
      return createNotModifiedResponse(etag, CacheType.STATIC_DATA);
    }

    // 使用统一缓存策略 - 主游戏数据相对稳定，使用长缓存
    const cacheHeaders = getCacheHeaders(
      CacheType.STATIC_DATA, 
      etag, 
      true, 
      game !== null
    );

    const headers = new Headers({
      'Content-Type': 'application/json',
      ...cacheHeaders,
      'X-Response-Time': `${duration}ms`,
      'X-Game-Count': game ? '1' : '0'
    });

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers
    });
    
  } catch (error) {
    log.error('getMainGame API Error', error);
    
    const errorResponse: ApiResponse<GameProps | null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      data: null
    };

    return new NextResponse(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...getCacheHeaders(CacheType.NO_CACHE)
      }
    });
  }
}

// 支持 HEAD 请求用于健康检查
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: getCacheHeaders(CacheType.SHORT_CACHE)
  });
}
