"use server"

import { createClient, createAdminClient } from '@/utils/supabase/server';
import { SocialPost, DisplayPost } from './types';

export async function getPosts(): Promise<undefined | DisplayPost[]> {
  const supabase = await createClient();
  const { data: posts, error: err } = await supabase.from("social").select();

  if (err) {
    console.log(err)
    return undefined
  }

  // Step 1: Sort by date (most recent first)
  const sortedByDate = posts.sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Step 2: Take random number between 10-15 posts
  const randomCount = Math.floor(Math.random() * 6) + 10; // Random between 10-15
  const topRecentPosts = sortedByDate.slice(0, randomCount);

  // Step 3: Sort those posts by likes (highest first)
  const finalOrdered = topRecentPosts.sort((a, b) => b.likes - a.likes);

  return await getDisplayPosts(finalOrdered as SocialPost[]);
}

export async function getPostById(postId: number): Promise<undefined | DisplayPost> {
  const supabase = await createClient();
  const { data: posts, error: err } = await supabase.from("social").select().eq("id", postId);

  if (err) {
    console.log(err)
    return undefined
  }

  return (await getDisplayPosts(posts as SocialPost[]))[0];
}

export async function getDisplayPosts(posts: SocialPost[]): Promise<DisplayPost[]> {
    const supabase = await createAdminClient();
    const displayPosts: DisplayPost[] = []
    for (const post of posts) {
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(post.authorId)
        if (userError) {
            continue
        } else {
            const url = userData.user.user_metadata.avatar_url! ?? "/shareacode.png"
            displayPosts.push({authorImageUrl: url, authorName: post.authorName, code: post.code, instructions: post.instructions, created_at: post.created_at, likes: post.likes, shareLink: post.shareLink, codeLanguage: post.codeLanguage, id: post.id, authorId: post.authorId} as DisplayPost)
        }
    }
    return displayPosts
}
