import { NextResponse } from 'next/server';
import { getGameById } from '@/models/games';
import { ApiResponse, GameProps } from '@/types/game';

export const runtime = 'edge';

// 设置缓存策略
export const revalidate = 600; // 10分钟重新验证

export async function GET(
  _request: Request,
  { params }: { params: { game_id: string } }
) {
  try {
    const gameId = params.game_id;

    // 验证 gameId 参数
    if (!gameId || typeof gameId !== 'string') {
      const errorResponse: ApiResponse<GameProps | null> = {
        success: false,
        error: 'Invalid game ID',
        data: null
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
    
    const game = await getGameById(gameId);
    
    const duration = Date.now() - startTime;
    
    // 记录性能指标
    console.log(`getGameById API: ${duration}ms, gameId: ${gameId}, found: ${game ? 'yes' : 'no'}`);
    
    if (!game) {
      const errorResponse: ApiResponse<GameProps | null> = {
        success: false,
        error: 'Game not found',
        data: null
      };

      return new NextResponse(JSON.stringify(errorResponse), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60', // 短缓存404响应
          'X-Response-Time': `${duration}ms`,
          'X-Game-Id': gameId
        }
      });
    }

    const response: ApiResponse<GameProps> = {
      success: true,
      data: game
    };

    // 设置缓存头
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=600, stale-while-revalidate=1200', // 10分钟缓存，20分钟stale
      'X-Response-Time': `${duration}ms`,
      'X-Game-Id': gameId
    });

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers
    });
    
  } catch (error) {
    console.error('getGameById API Error:', error);
    
    const errorResponse: ApiResponse<GameProps | null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      data: null
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