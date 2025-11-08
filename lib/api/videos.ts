import apolloClient from '@/lib/client/ApolloClient';
import { GET_LATEST_VIDEOS, GET_VIDEO_BY_SLUG, GET_VIDEOS } from '@/lib/queries/videos/videoQueries';

export interface Video {
  id: number;
  title: string;
  thumbnail: string;
  date: string;
  duration: string;
  views: string;
  category: string;
  categoryCount?: number;
  slug?: string;
  videoSource?: string;
  youtubeUrl?: string;
  image?: string;
  content?: string;
}

interface VideoNode {
  databaseId: number;
  title: string;
  slug: string;
  date: string;
  content?: string;
  videoOptions: {
    videoSource: string[] | string; // Can be array or string
    youtubeUrl: string;
    image: string;
  };
  videoCategories?: {
    nodes: Array<{
      name: string;
      count?: number;
    }>;
  };
}

/**
 * Fetch latest videos from WordPress
 */
export async function fetchLatestVideos(limit: number = 4): Promise<Video[]> {
  try {
    const result = await apolloClient.query<{
      videos: {
        nodes: VideoNode[];
      };
    }>({
      query: GET_LATEST_VIDEOS,
      fetchPolicy: 'network-only',
    });

    if (result.error) {
      console.error('GraphQL query error:', result.error);
      return [];
    }

    if (!result.data?.videos?.nodes || result.data.videos.nodes.length === 0) {
      return [];
    }

    // Transform WordPress video data to Video interface
    const transformedVideos = result.data.videos.nodes.map((node) => {
      // videoSource can be an array, so extract first element if it is
      const videoSource: string = Array.isArray(node.videoOptions?.videoSource) 
        ? (node.videoOptions.videoSource[0] || '')
        : (node.videoOptions?.videoSource || '');
      
      return {
        id: node.databaseId,
        title: node.title || 'Untitled Video',
        slug: node.slug || '',
        thumbnail: node.videoOptions?.image || '',
        date: node.date || '',
        duration: '', // You can add this field to WordPress if needed
        views: '', // You can add this field to WordPress if needed
        category: node.videoCategories?.nodes?.[0]?.name || '',
        videoSource,
        youtubeUrl: node.videoOptions?.youtubeUrl || '',
        image: node.videoOptions?.image || '',
      };
    }).slice(0, limit);
    
    return transformedVideos;
  } catch (error) {
    console.error('Error fetching latest videos:', error);
    return [];
  }
}

/**
 * Fetch a single video by slug
 */
export async function fetchVideoBySlug(slug: string): Promise<Video | null> {
  try {
    const result = await apolloClient.query<{
      video: VideoNode;
    }>({
      query: GET_VIDEO_BY_SLUG,
      variables: { slug },
      fetchPolicy: 'network-only',
    });

    if (result.error) {
      console.error('GraphQL query error:', result.error);
      return null;
    }

    if (!result.data?.video) {
      return null;
    }

    const node = result.data.video;

    // videoSource can be an array, so extract first element if it is
    const videoSource: string = Array.isArray(node.videoOptions?.videoSource) 
      ? (node.videoOptions.videoSource[0] || '')
      : (node.videoOptions?.videoSource || '');

    return {
      id: node.databaseId,
      title: node.title || 'Untitled Video',
      slug: node.slug || '',
      thumbnail: node.videoOptions?.image || '',
      date: node.date || '',
      duration: '',
      views: '',
      category: node.videoCategories?.nodes?.[0]?.name || '',
      videoSource,
      youtubeUrl: node.videoOptions?.youtubeUrl || '',
      image: node.videoOptions?.image || '',
      content: node.content || '',
    };
  } catch (error) {
    console.error('Error fetching video by slug:', error);
    return null;
  }
}

/**
 * Fetch total count of all videos
 */
export async function fetchTotalVideosCount(): Promise<number> {
  try {
    // Fetch with a large limit to get all videos and count them
    const result = await apolloClient.query<{
      videos: {
        nodes: VideoNode[];
        pageInfo: {
          hasNextPage: boolean;
          endCursor: string | null;
        };
      };
    }>({
      query: GET_VIDEOS,
      variables: { first: 100, after: null },
      fetchPolicy: 'network-only',
    });

    if (result.error || !result.data?.videos?.nodes) {
      return 0;
    }

    let totalCount = result.data.videos.nodes.length;
    let hasNextPage = result.data.videos.pageInfo.hasNextPage;
    let endCursor = result.data.videos.pageInfo.endCursor;

    // If there are more pages, continue fetching to get the total count
    while (hasNextPage && endCursor) {
      const nextResult = await apolloClient.query<{
        videos: {
          nodes: VideoNode[];
          pageInfo: {
            hasNextPage: boolean;
            endCursor: string | null;
          };
        };
      }>({
        query: GET_VIDEOS,
        variables: { first: 100, after: endCursor },
        fetchPolicy: 'network-only',
      });

      if (nextResult.error || !nextResult.data?.videos?.nodes) {
        break;
      }

      totalCount += nextResult.data.videos.nodes.length;
      hasNextPage = nextResult.data.videos.pageInfo.hasNextPage;
      endCursor = nextResult.data.videos.pageInfo.endCursor;
    }

    return totalCount;
  } catch (error) {
    console.error('Error fetching total videos count:', error);
    return 0;
  }
}

/**
 * Fetch videos with pagination
 */
export async function fetchVideos(limit: number = 10, after?: string): Promise<{ videos: Video[], hasMore: boolean, endCursor: string | null, totalCount?: number }> {
  try {
    const result = await apolloClient.query<{
      videos: {
        nodes: VideoNode[];
        pageInfo: {
          hasNextPage: boolean;
          endCursor: string | null;
        };
      };
    }>({
      query: GET_VIDEOS,
      variables: { first: limit, after: after || null },
      fetchPolicy: 'network-only',
    });

    if (result.error) {
      console.error('GraphQL query error:', result.error);
      return { videos: [], hasMore: false, endCursor: null };
    }

    if (!result.data?.videos?.nodes || result.data.videos.nodes.length === 0) {
      return { videos: [], hasMore: false, endCursor: null };
    }

    // Transform WordPress video data to Video interface
    const transformedVideos = result.data.videos.nodes.map((node) => {
      const videoSource: string = Array.isArray(node.videoOptions?.videoSource) 
        ? (node.videoOptions.videoSource[0] || '')
        : (node.videoOptions?.videoSource || '');
      
      return {
        id: node.databaseId,
        title: node.title || 'Untitled Video',
        slug: node.slug || '',
        thumbnail: node.videoOptions?.image || '',
        date: node.date || '',
        duration: '',
        views: '',
        category: node.videoCategories?.nodes?.[0]?.name || '',
        categoryCount: node.videoCategories?.nodes?.[0]?.count,
        videoSource,
        youtubeUrl: node.videoOptions?.youtubeUrl || '',
        image: node.videoOptions?.image || '',
      };
    });

    // Remove duplicates based on id
    const uniqueVideos = transformedVideos.filter((video, index, self) =>
      index === self.findIndex((v) => v.id === video.id)
    );

    return {
      videos: uniqueVideos,
      hasMore: result.data.videos.pageInfo.hasNextPage,
      endCursor: result.data.videos.pageInfo.endCursor,
    };
  } catch (error) {
    console.error('Error fetching videos:', error);
    return { videos: [], hasMore: false, endCursor: null };
  }
}
