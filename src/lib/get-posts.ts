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

  return await getDisplayPosts(posts as SocialPost[]);
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
            displayPosts.push({authorImageUrl: url, authorName: post.authorName, code: post.code, instructions: post.instructions, created_at: post.created_at, likes: post.likes, shareLink: post.shareLink, codeLanguage: post.codeLanguage, id: post.id} as DisplayPost)
        }
    } 
    return displayPosts
}