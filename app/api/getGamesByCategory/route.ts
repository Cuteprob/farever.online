import { NextResponse } from 'next/server';
import { getProjectGamesByCategoryId } from '@/models/productGames';
export const runtime = 'edge';
export async function GET(
    request: Request,
) {
  try {
    // 从 URL 中获取查询参数
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }


    const games = await getProjectGamesByCategoryId(categoryId);


    return NextResponse.json(games);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 