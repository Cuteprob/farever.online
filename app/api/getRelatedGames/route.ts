import { NextResponse } from 'next/server';
import { getRelatedGames } from '@/models/games';
import { ApiResponse, GameProps } from '@/types/game';

// 使用 Edge Runtime 提升性能
export const runtime = 'edge';

// 设置缓存策略
export const revalidate = 300; // 5分钟重新验证

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');
    const limit = parseInt(searchParams.get('limit') || '16');
    
    if (!gameId) {
      return new NextResponse(JSON.stringify({
        success: false,
        error: 'gameId parameter is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 性能监控
    const startTime = Date.now();
    
    const relatedGames = await getRelatedGames(gameId, limit);
    
    const duration = Date.now() - startTime;
    
    // 记录性能指标
    console.log(`getRelatedGames API: ${duration}ms, returned ${relatedGames.length} games`);
    
    const response: ApiResponse<GameProps[]> = {
      success: true,
      data: relatedGames,
      count: relatedGames.length
    };

    // 设置缓存头
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=600', // 5分钟缓存，10分钟stale
      'X-Response-Time': `${duration}ms`,
      'X-Game-Count': relatedGames.length.toString()
    });

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers
    });
    
  } catch (error) {
    console.error('getRelatedGames API Error:', error);
    
    const errorResponse: ApiResponse<GameProps[]> = {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      data: []
    };

    return new NextResponse(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
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
