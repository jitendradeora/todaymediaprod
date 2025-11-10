import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  console.log('🔔 Revalidation webhook received at:', new Date().toISOString());
  
  try {
    const secret = process.env.REVALIDATE_SECRET;
    const token = req.headers.get('x-secret');

    console.log('🔐 Secret configured:', !!secret);
    console.log('🔑 Token received:', !!token);
    console.log('📍 Request from:', req.headers.get('user-agent'));

    if (!secret) {
      console.error('❌ REVALIDATE_SECRET not configured in .env.local');
      return NextResponse.json(
        { message: 'REVALIDATE_SECRET not configured' }, 
        { status: 500 }
      );
    }

    if (token !== secret) {
      console.error('❌ Invalid secret token');
      console.log('Expected secret length:', secret.length);
      console.log('Received token length:', token?.length || 0);
      return NextResponse.json(
        { message: 'Invalid secret' }, 
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log('📦 Webhook payload:', JSON.stringify(body, null, 2));

    const { action, post_type, slug, post_id } = body;

    // CRITICAL: Clear all WordPress data cache using path revalidation
    // This will clear Next.js fetch cache for all WordPress GraphQL requests
    console.log('🔄 Starting revalidation process...');

    // Revalidate based on action type
    if (action === 'menu_update') {
      // Menu changes affect the entire layout (header/footer)
      revalidatePath('/', 'layout');
      console.log('✅ Revalidated entire layout (menu update)');
    }
    else if (action === 'create' || action === 'update' || action === 'publish') {
      // Revalidate homepage
      revalidatePath('/');
      console.log('✅ Revalidated homepage');
      
      // If it's a post, revalidate related pages
      if (post_type === 'post') {
        // Revalidate all article pages (dynamic route pattern)
        revalidatePath('/[category]/[id]', 'page');
        console.log('✅ Revalidated all article pages');
        
        // Revalidate all category pages
        revalidatePath('/category/[category]', 'page');
        console.log('✅ Revalidated category pages');
        
        // Revalidate all tag pages
        revalidatePath('/tag/[tag]', 'page');
        console.log('✅ Revalidated tag pages');
        
        // Revalidate tags listing page
        revalidatePath('/tags', 'page');
        console.log('✅ Revalidated tags listing page');
        
        // Revalidate search
        revalidatePath('/search', 'page');
        console.log('✅ Revalidated search page');
      }
      
      // If it's a page, revalidate that specific page
      if (post_type === 'page') {
        if (slug) {
          revalidatePath(`/${slug}`, 'page');
          console.log(`✅ Revalidated page: /${slug}`);
          
          // Special handling for specific pages
          if (slug === 'about') {
            revalidatePath('/about', 'page');
            console.log('✅ Revalidated about page');
          }
          if (slug === 'contact') {
            revalidatePath('/contact', 'page');
            console.log('✅ Revalidated contact page');
          }
          if (slug === 'privacy-policy') {
            revalidatePath('/privacy-policy', 'page');
            console.log('✅ Revalidated privacy policy page');
          }
        }
        // Pages might affect layout (like home page config)
        revalidatePath('/', 'layout');
        console.log('✅ Revalidated layout');
      }
      
      // If it's a video, revalidate video pages
      if (post_type === 'video') {
        revalidatePath('/video-category', 'page');
        console.log('✅ Revalidated video category page');
        revalidatePath('/');
        console.log('✅ Revalidated homepage for video updates');
      }
    } 
    else if (action === 'delete' || action === 'unpublish') {
      // On delete/unpublish, do a full revalidation
      revalidatePath('/', 'layout');
      console.log('✅ Full site revalidation (delete/unpublish)');
    }
    else if (action === 'media_update') {
      // Media changes might affect any page with images
      revalidatePath('/', 'layout');
      console.log('✅ Revalidated layout (media update)');
    }
    else if (action === 'theme_settings_update') {
      // Theme settings affect the entire site (header, footer, layout, etc.)
      revalidatePath('/', 'layout');
      revalidatePath('/');
      console.log('✅ Revalidated entire site (theme settings update)');
    }
    else {
      // Default: revalidate homepage and layout
      revalidatePath('/');
      revalidatePath('/', 'layout');
      console.log('✅ Default revalidation');
    }

    const duration = Date.now() - startTime;
    console.log(`⏱️  Revalidation completed in ${duration}ms`);

    return NextResponse.json({ 
      success: true,
      revalidated: true, 
      action,
      post_type,
      slug,
      post_id,
      duration_ms: duration,
      now: Date.now() 
    });
  } catch (error) {
    console.error('❌ Revalidation error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      success: false,
      error: message 
    }, { status: 500 });
  }
}

// GET method for manual testing
export async function GET(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const token = req.nextUrl.searchParams.get('secret');

  if (!secret || token !== secret) {
    return NextResponse.json(
      { message: 'Invalid secret' }, 
      { status: 401 }
    );
  }

  try {
    revalidatePath('/', 'layout');
    console.log('✅ Manual revalidation via GET');
    
    return NextResponse.json({ 
      success: true,
      revalidated: true, 
      now: Date.now() 
    });
  } catch (error) {
    console.error('❌ Revalidation error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      success: false,
      error: message 
    }, { status: 500 });
  }
}
