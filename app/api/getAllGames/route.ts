import { NextResponse } from 'next/server';
import { getAllGames } from '@/models/productGames';
export const runtime = 'edge';
export async function GET() {
  try {
    const games = await getAllGames();
    return NextResponse.json(games);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 