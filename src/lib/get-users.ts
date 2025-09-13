"use server"

import { DisplayUser } from './types';
import { createAdminClient, createClient } from '@/utils/supabase/server';

function mostFrequent<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;

  const frequency = new Map<T, number>();
  let maxCount = 0;
  let mostFrequentElement: T = arr[0];

  for (const element of arr) {
    const count = (frequency.get(element) || 0) + 1;
    frequency.set(element, count);

    if (count > maxCount) {
      maxCount = count;
      mostFrequentElement = element;
    }
  }

  return mostFrequentElement;
}

export async function getUserDetailsById(userId: string): Promise<DisplayUser> {
  const supabaseAdmin = await createAdminClient();
  const supabaseClient = await createClient();
  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)
  let postNumber: number = 0
  let mostUsedLanguage: string | undefined = undefined

  if (userError) {
    // Throw a plain error object instead of the Supabase error
    console.error(userError)
    throw new Error(`Failed to get user: ${userError.message || 'Unknown error'}`);
  } else {
    const { data: postData, error: postError } = await supabaseClient.from("social").select().eq("authorId", userId);
    if (postError) {
      postNumber = 0
      mostUsedLanguage = "No Coding Data"
    } else {
      postNumber = postData.length
      const languages: string[] = []
      for (const post of postData) {
        languages.push(post.codeLanguage)
      }
      mostUsedLanguage = mostFrequent(languages)
      if (typeof mostUsedLanguage === "undefined") {
        mostUsedLanguage = "No Coding Data"
      }
    }
    return {
      name: userData.user.user_metadata.name,
      userName: userData.user.user_metadata.user_name! ?? "",
      avatarUrl: userData.user.user_metadata.avatar_url,
      postsNumber: postNumber,
      mostUsedLanguage: mostUsedLanguage,
      hasGithub: userData.user.user_metadata.iss === "https://api.github.com"
    } as DisplayUser;
  }
}
