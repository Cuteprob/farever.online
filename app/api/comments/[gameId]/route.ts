import { NextResponse } from 'next/server';
import { getGameComments } from '@/models/games';
import { ApiResponse, GameComment } from '@/types/game';

// 使用 Edge Runtime 提升性能
export const runtime = 'edge';

// 设置缓存策略
export const revalidate = 180; // 3分钟重新验证

export async function GET(
  request: Request,
  { params }: { params: { gameId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100); // 限制最大100个评论
    const gameId = params.gameId;

    // 验证 gameId 参数
    if (!gameId || typeof gameId !== 'string') {
      const errorResponse: ApiResponse<GameComment[]> = {
        success: false,
        error: 'Invalid game ID',
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
    
    const comments = await getGameComments(gameId, limit);
    
    const duration = Date.now() - startTime;
    
    // 记录性能指标
    console.log(`getGameComments API: ${duration}ms, gameId: ${gameId}, returned ${comments.length} comments`);
    
    const response: ApiResponse<GameComment[]> = {
      success: true,
      data: comments,
      count: comments.length
    };

    // 设置缓存头
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=180, stale-while-revalidate=360', // 3分钟缓存，6分钟stale
      'X-Response-Time': `${duration}ms`,
      'X-Comment-Count': comments.length.toString(),
      'X-Game-Id': gameId
    });

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers
    });
    
  } catch (error) {
    console.error('getGameComments API Error:', error);
    
    const errorResponse: ApiResponse<GameComment[]> = {
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
export async function HEAD(
  request: Request,
  { params }: { params: { gameId: string } }
) {
  const gameId = params.gameId;
  
  if (!gameId || typeof gameId !== 'string') {
    return new NextResponse(null, { status: 400 });
  }

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=60',
      'X-Game-Id': gameId
    }
  });
}
