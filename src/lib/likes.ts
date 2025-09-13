"use server"

import { createClient } from '@/utils/supabase/server';

export async function updateLikes(currentLikes: number, postId: number): Promise<void> {
  const supabase = await createClient();
  const { error: err } = await supabase.from("social").update({likes: currentLikes + 1}).eq("id", postId);

  if (err) {
    throw err
  }
}
