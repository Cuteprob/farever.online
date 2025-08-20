import { NextRequest, NextResponse } from 'next/server';
import { getGameComments, submitGameComment, getCommentStats } from '@/models/games';
import type { ApiResponse } from '@/types/game';

// 使用 Edge Runtime 提升性能
export const runtime = 'edge';

// 设置缓存策略 - 短期缓存保持评论时效性
export const revalidate = 60; // 1分钟重新验证

export async function GET(request: NextRequest) {
  try {
    // 性能监控
    const startTime = Date.now();
    
    // 从URL参数获取查询选项
    const url = new URL(request.url);
    const gameId = url.searchParams.get('gameId') || undefined;
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const includeStats = url.searchParams.get('includeStats') === 'true';

    // 获取评论数据
    const comments = await getGameComments(gameId, limit, offset);
    
    // 如果需要统计信息，同时获取
    let stats = undefined;
    if (includeStats) {
      stats = await getCommentStats(gameId);
    }

    const duration = Date.now() - startTime;
    
    // 记录性能指标
    console.log(`getComments API: ${duration}ms, returned ${comments.length} comments`);

    const response: ApiResponse<typeof comments> = {
      success: true,
      data: comments,
      count: comments.length,
      stats,
      meta: {
        gameId,
        limit,
        offset,
        hasMore: comments.length === limit // 简单的分页判断
      }
    };

    // 设置缓存头 - 短期缓存
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=120', // 1分钟缓存，2分钟stale
      'X-Response-Time': `${duration}ms`,
      'X-Comment-Count': String(comments.length)
    });

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers
    });
    
  } catch (error) {
    console.error('getComments API Error:', error);
    
    const errorResponse: ApiResponse<any[]> = {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      data: [],
      count: 0
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

export async function POST(request: NextRequest) {
  try {
    // 性能监控
    const startTime = Date.now();
    
    const body = await request.json();
    const { content, nickname, email, gameId, ratingScore } = body;

    // 验证输入数据
    if (!content?.trim() || !nickname?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Content and nickname are required'
      }, { status: 400 });
    }

    // 提交评论到数据库
    const result = await submitGameComment({
      content: content.trim(),
      nickname: nickname.trim(),
      email: email?.trim(),
      gameId: gameId || undefined,
      ratingScore: ratingScore ? parseInt(ratingScore) : undefined
    });

    const duration = Date.now() - startTime;
    console.log(`submitComment API: ${duration}ms, success: ${result.success}`);

    if (result.success) {
      const response = {
        success: true,
        data: result.data,
        message: 'Comment submitted successfully! Your comment will be visible after admin approval.',
        meta: {
          submissionTime: new Date().toISOString(),
          status: 'pending'
        }
      };

      return NextResponse.json(response, {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'X-Response-Time': `${duration}ms`
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to submit comment'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('submitComment API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
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
