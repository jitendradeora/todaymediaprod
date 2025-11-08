import { NextRequest, NextResponse } from 'next/server';
import { fetchVideos } from '@/lib/api/videos';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const after = searchParams.get('after');
    const limit = parseInt(searchParams.get('limit') || '12');

    const result = await fetchVideos(limit, after || undefined);

    return NextResponse.json({
      videos: result.videos,
      hasMore: result.hasMore,
      endCursor: result.endCursor,
    });
  } catch (error) {
    console.error('Error in videos API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
