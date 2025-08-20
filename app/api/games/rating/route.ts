import { NextRequest, NextResponse } from 'next/server';
import { saveGameRating, getGameRating } from '@/models/games';

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
    console.log(`saveGameRating API: ${duration}ms, success: ${result.success}`);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // 生成新的ETag用于缓存失效
    const etag = `"${gameId}-${Date.now()}"`;
    
    // 设置缓存头 - 关键改进：添加缓存失效指令
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate', // 强制不缓存
      'Pragma': 'no-cache', // HTTP/1.0 兼容
      'Expires': '0', // 立即过期
      'ETag': etag, // 新的ETag
      'X-Cache-Invalidate': `rating-${gameId}`, // 自定义缓存失效标识
      'X-Response-Time': `${duration}ms`,
      'Vary': 'Accept-Encoding' // 确保缓存变体
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
    console.error('Rating API POST Error:', error);
    
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
    console.log(`getGameRating API: ${duration}ms, success: ${result.success}`);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // 生成ETag基于数据内容和时间戳
    const dataHash = Buffer.from(JSON.stringify({
      avg: result.data?.averageRating,
      total: result.data?.totalRatings,
      dist: result.data?.ratingDistribution
    })).toString('base64');
    const etag = `"${gameId}-${dataHash}"`;
    
    // 检查条件请求
    const ifNoneMatch = request.headers.get('if-none-match');
    if (ifNoneMatch === etag) {
      return new NextResponse(null, { 
        status: 304,
        headers: {
          'ETag': etag,
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=120',
        }
      });
    }

    // 禁用缓存以确保数据实时性
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0', // 彻底禁用缓存
      'Pragma': 'no-cache', // HTTP/1.0 兼容
      'Expires': '0', // 立即过期
      'ETag': etag,
      'Last-Modified': new Date().toUTCString(),
      'Vary': 'Accept-Encoding',
      'X-Cache-Key': `rating-${gameId}`,
      'X-Response-Time': `${duration}ms`,
      'X-Cache-Status': 'DISABLED' // 缓存状态指示
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
    console.error('Rating API GET Error:', error);
    
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
