import { NextResponse } from 'next/server';
import { getAllGames } from '@/models/games';
import { ApiResponse, GameProps } from '@/types/game';

export const runtime = 'edge';

// 设置缓存策略
export const revalidate = 300; // 5分钟重新验证

export async function GET(request: Request) {
  try {
    // 从 URL 中获取查询参数
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const limit = searchParams.get('limit') ? Math.min(parseInt(searchParams.get('limit')!), 100) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;

    if (!categoryId) {
      const errorResponse: ApiResponse<GameProps[]> = {
        success: false,
        error: 'Category ID is required',
        data: []
      };

      return new NextResponse(JSON.stringify(errorResponse), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
    }

    // 性能监控
    const startTime = Date.now();
    
    const games = await getAllGames({
      categoryId,
      limit,
      offset
    });
    
    const duration = Date.now() - startTime;
    
    // 记录性能指标
    console.log(`getGamesByCategory API: ${duration}ms, categoryId: ${categoryId}, returned ${games.length} games`);
    
    const response: ApiResponse<GameProps[]> = {
      success: true,
      data: games,
      count: games.length
    };

    // 设置缓存头
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=600', // 5分钟缓存，10分钟stale
      'X-Response-Time': `${duration}ms`,
      'X-Game-Count': games.length.toString(),
      'X-Category-Id': categoryId
    });

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers
    });
    
  } catch (error) {
    console.error('getGamesByCategory API Error:', error);
    
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