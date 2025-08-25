import { NextRequest, NextResponse } from 'next/server';
import { saveGameRating, getGameRating } from '@/models/games';
import { getCacheHeaders, CacheType, generateETag, checkIfNoneMatch, createNotModifiedResponse } from '@/utils/cache-config';
import { log } from '@/utils/logger';

// 使用 Edge Runtime 提升性能
export const runtime = 'edge';

// 禁用缓存以确保数据实时性
export const revalidate = 0; // 禁用缓存
export const dynamic = 'force-dynamic'; // 强制动态渲染

export async function POST(request: NextRequest) {
  try {
    // 性能监控
    const startTime = Date.now();
    
    const body = await request.json();
    const { gameId, rating } = body;

    const result = await saveGameRating(gameId, rating);
    const duration = Date.now() - startTime;
    
    // 记录性能指标
    log.api('POST', '/api/games/rating', duration, result.success, { gameId, success: result.success });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // 生成新的ETag用于缓存失效
    const etag = generateETag(result, gameId);
    
    // 评分更新后必须使用无缓存策略，确保实时性
    const cacheHeaders = getCacheHeaders(CacheType.NO_CACHE, etag);
    
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...cacheHeaders,
      'X-Cache-Invalidate': `rating-${gameId}`, // 自定义缓存失效标识
      'X-Response-Time': `${duration}ms`
    });

    return NextResponse.json({
      ...result,
      meta: {
        etag,
        timestamp: Date.now(),
        cacheInvalidated: true
      }
    }, {
      status: 200,
      headers
    });

  } catch (error) {
    log.error('Rating API POST Error', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // 性能监控
    const startTime = Date.now();
    
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');

    if (!gameId) {
      return NextResponse.json(
        { success: false, error: 'Game ID is required' },
        { status: 400 }
      );
    }

    const result = await getGameRating(gameId);
    const duration = Date.now() - startTime;
    
    // 记录性能指标
    log.api('GET', '/api/games/rating', duration, result.success, { gameId, success: result.success });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // 生成ETag基于数据内容
    const etag = generateETag({
      avg: result.data?.averageRating,
      total: result.data?.totalRatings,
      dist: result.data?.ratingDistribution
    }, gameId);
    
    // 检查条件请求
    if (checkIfNoneMatch(request, etag)) {
      return createNotModifiedResponse(etag, CacheType.RATINGS);
    }

    // 评分数据使用短缓存策略，必须验证
    const cacheHeaders = getCacheHeaders(CacheType.RATINGS, etag);
    
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...cacheHeaders,
      'X-Cache-Key': `rating-${gameId}`,
      'X-Response-Time': `${duration}ms`,
      'X-Cache-Status': process.env.NODE_ENV === 'development' ? 'DISABLED' : 'ENABLED'
    });

    return NextResponse.json({
      ...result,
      meta: {
        etag,
        timestamp: Date.now(),
        cached: false
      }
    }, {
      status: 200,
      headers
    });

  } catch (error) {
    log.error('Rating API GET Error', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
}
