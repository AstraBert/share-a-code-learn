"use server"

import { createClient } from '@/utils/supabase/server';
import { getDisplayPosts } from './get-posts';
import { SocialPost, DisplayPost } from './types';

export async function searchByUser(userId: string): Promise<undefined | DisplayPost[]> {
  const supabase = await createClient();
  const { error: err, data: postData } = await supabase.from("social").select("*").eq("authorId", userId);

  if (err) {
    return undefined
  }
  if (postData) {
    return (await getDisplayPosts(postData as SocialPost[]))
  }
}

export async function searchByLanguage(language: string): Promise<undefined | DisplayPost[]> {
  const supabase = await createClient();
  const { error: err, data: postData } = await supabase.from("social").select("*").eq("codeLanguage", language);

  if (err) {
    return undefined
  }
  if (postData) {
    return (await getDisplayPosts(postData as SocialPost[]))
  }
}

export async function searchCodeByKeywords(keywords: string): Promise<undefined | DisplayPost[]> {
    const fts = keywords.replaceAll(" ", " or ")
    const query = `'${fts}'`
    const supabase = await createClient();
    const { error: err, data: postData } = await supabase.from("social").select("*").textSearch("code", query, {
        type: "websearch",
    });

    if (err) {
        return undefined
    }
    if (postData) {
        return (await getDisplayPosts(postData as SocialPost[]))
    }
}

export async function searchDesByKeywords(keywords: string): Promise<undefined | DisplayPost[]> {
    const fts = keywords.replaceAll(" ", " or ")
    const query = `'${fts}'`
    const supabase = await createClient();
    const { error: err, data: postData } = await supabase.from("social").select("*").textSearch("instructions", query, {
        type: "websearch",
    });

    if (err) {
        return undefined
    }
    if (postData) {
        return (await getDisplayPosts(postData as SocialPost[]))
    }
}

export async function search(userId: string | null, language: string | null, keywords: string | null): Promise<DisplayPost[]> {
    let userPosts: DisplayPost[] = []
    let languagePosts: DisplayPost[] = []
    let keywordPosts: DisplayPost[] = []

    if (userId) {
        userPosts = await searchByUser(userId) ?? []
    }

    if (language) {
        languagePosts = await searchByLanguage(language) ?? []
    }

    if (keywords) {
        const keywordCodePosts = await searchCodeByKeywords(keywords) ?? []
        const keywordDesPosts = await searchDesByKeywords(keywords) ?? []
        // Remove duplicates from code posts that are already in description posts
        const keywordFilteredPosts = keywordCodePosts.filter(post =>
            !keywordDesPosts.some(desPost => desPost.id === post.id)
        )
        keywordPosts = [...keywordFilteredPosts, ...keywordDesPosts]
    }

    // Combine all results and remove duplicates
    let finalPosts: DisplayPost[] = []

    // If we have multiple search criteria, find intersection
    if ((userId ? 1 : 0) + (language ? 1 : 0) + (keywords ? 1 : 0) > 1) {
        // Start with the first non-empty array
        if (userId) {
            finalPosts = userPosts
        } else if (language) {
            finalPosts = languagePosts
        } else if (keywords) {
            finalPosts = keywordPosts
        }

        // Filter by language if specified
        if (language && userId) {
            finalPosts = finalPosts.filter(post =>
                languagePosts.some(langPost => langPost.id === post.id)
            )
        }

        // Filter by keywords if specified
        if (keywords && (userId || language)) {
            finalPosts = finalPosts.filter(post =>
                keywordPosts.some(keywordPost => keywordPost.id === post.id)
            )
        }
    } else {
        // Single search criterion - just use that result
        finalPosts = [...userPosts, ...languagePosts, ...keywordPosts]
    }

    // Remove any remaining duplicates and sort by creation date (newest first)
    const uniquePosts = finalPosts.filter((post, index, self) =>
        index === self.findIndex(p => p.id === post.id)
    )

    return uniquePosts.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
}
