import { NextRequest, NextResponse } from 'next/server';
import { searchArticles } from '@/lib/actions/blog/searchActions';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    const result = await searchArticles(query);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search articles',
        articles: [],
        pageInfo: {
          startCursor: '',
          hasPreviousPage: false,
          hasNextPage: false,
          endCursor: '',
        }
      },
      { status: 500 }
    );
  }
}
