'use server';

import { fetchArticlesByAuthorId } from '@/lib/api/articles';

export async function loadMoreAuthorArticles(
  authorId: string,
  first: number = 9,
  after?: string
) {
  return await fetchArticlesByAuthorId(Number(authorId), first, after);
}
