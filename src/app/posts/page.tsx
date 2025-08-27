// app/posts/page.tsx
'use client';

import { getPostById } from '@/lib/get-posts';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DisplayPost } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Button,
} from "@/components/ui/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Label } from "@/components/ui/label";
import { ArrowBigLeft, Heart } from 'lucide-react';
import { CodeBlock, CodeBlockCopyButton } from "@/components/ai-elements/code-block";
import { updateLikes } from "@/lib/likes";
import Link from 'next/link';

export default function PostsPage() {
  const searchParams = useSearchParams();
  const postIdParam = searchParams.get('postId');
  const [post, setPost] = useState<DisplayPost | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (postIdParam) {
      const postId = parseInt(postIdParam);
      
      if (isNaN(postId)) {
        setError('Invalid post ID');
        return;
      }

      setLoading(true);
      setError(null);
      
      getPostById(postId)
        .then((postToDisplay) => {
          setPost(postToDisplay);
        })
        .catch((err) => {
          setError('Failed to load post');
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [postIdParam]);

  if (!postIdParam) {
    return <div>Please provide a postId</div>;
  }
  
  if (loading) {
    return <div>Loading post...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  if (!post) {
    return <div>Post not found</div>;
  }

  const increaseLikes = async (currentLikes: number, postId: number) => {
    try {
      await updateLikes(currentLikes, postId);
      // Update the local state to reflect the new like count
      setPost({...post, likes: post.likes+1});
    } catch (err) {
      alert("There was an error while adding your likes, please try again later");
      console.error('Error updating likes:', err);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
            <Card key={post.id} className="w-full">
              <CardHeader>
                <CardTitle className="text-lg">
                  {post.authorName}
                </CardTitle>
                <CardDescription>
                  <Avatar style={{ width: '40px', height: '40px' }}>
                    <AvatarImage src={post.authorImageUrl} alt="Author Avatar"/>
                    <AvatarFallback>{post.authorName.split(" ")[0][0]}</AvatarFallback>
                  </Avatar>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 items-center gap-y-1.5">
                    <span className="text-sm font-semibold text-gray-600">Description:</span>
                    <CodeBlock code={post.instructions} language={"md"}>
                      <CodeBlockCopyButton/>
                    </CodeBlock>
                  </div>
                  
                  <div>
                    <span className="text-sm font-semibold text-gray-600">Code:</span>
                    <CodeBlock code={post.code} language={post.codeLanguage}>
                      <CodeBlockCopyButton/>
                    </CodeBlock>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="grid grid-cols-1 gap-y-1.5">
                <Label>Likes: {post.likes}</Label>
                <Button 
                  variant={"secondary"} 
                  onClick={() => increaseLikes(post.likes, post.id)}
                >
                  <Heart/>
                  Like this post
                </Button>
              </CardFooter>
            </Card>
            <div className='items-center justify-center'>
                <Link href={"/"}>
                    <Button variant={"default"} >
                        <ArrowBigLeft/>
                        Back to the Feed
                    </Button>
                </Link>
            </div>
            
        </div>
  );
}