import { NextRequest, NextResponse } from 'next/server';
import { fetchArticlesByCategory } from '@/lib/api/articles';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');
    const after = searchParams.get('after') || undefined;

    if (!slug) {
      return NextResponse.json(
        { 
          error: 'Category slug is required',
          articles: [],
          pageInfo: {
            hasNextPage: false,
            endCursor: null,
          }
        },
        { status: 400 }
      );
    }

    // Fetch 12 articles per page (same as initial load)
    const result = await fetchArticlesByCategory(slug, 12, after);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Category articles API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch articles',
        articles: [],
        pageInfo: {
          hasNextPage: false,
          endCursor: null,
        }
      },
      { status: 500 }
    );
  }
}

