import { NextResponse } from 'next/server';
import { getGameById } from '@/models/productGames';
export const runtime = 'edge';

export async function GET(
  _request: Request,
  { params }: { params: { game_id: string } }
) {
  try {
    const game = await getGameById(params.game_id);
    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(game);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 