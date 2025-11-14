import { draftMode } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Exit Preview API Route Handler
 * 
 * This endpoint disables Next.js Draft Mode
 * Can be called from a preview banner or directly
 * 
 * Usage:
 * - GET /api/preview/exit
 * - Optionally provide redirect query param: /api/preview/exit?redirect=/
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const redirectPath = searchParams.get('redirect') || '/';

  console.log('🚪 Exit preview request received');

  try {
    // Disable draft mode
    const draft = await draftMode();
    draft.disable();
    
    console.log('✅ Draft mode disabled');

    // Redirect to the specified path or homepage
    const redirectUrl = new URL(redirectPath, request.url);
    
    return NextResponse.redirect(redirectUrl, {
      status: 307,
    });
  } catch (error) {
    console.error('❌ Error exiting preview:', error);
    return NextResponse.json(
      { 
        error: 'Failed to exit preview mode',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

