import { NextResponse } from 'next/server';
import { getAllGames } from '@/models/games';
import { ApiResponse, GameProps } from '@/types/game';

export const runtime = 'edge';

// 设置缓存策略
export const revalidate = 300; // 5分钟重新验证

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? Math.min(parseInt(searchParams.get('limit')!), 100) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;
    const categoryId = searchParams.get('categoryId') || undefined;
    const isMain = searchParams.get('isMain') ? searchParams.get('isMain') === 'true' : undefined;

    // 性能监控
    const startTime = Date.now();
    
    const games = await getAllGames({
      limit,
      offset,
      categoryId,
      isMain
    });
    
    const duration = Date.now() - startTime;
    
    // 记录性能指标
    console.log(`getAllGames API: ${duration}ms, returned ${games.length} games`);
    
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
      'X-Game-Count': games.length.toString()
    });

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers
    });
    
  } catch (error) {
    console.error('getAllGames API Error:', error);
    
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