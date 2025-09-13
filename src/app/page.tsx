"use client"

import { useState, useEffect } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Label } from "@/components/ui/label";

import Link from "next/link";
import { getPosts } from '@/lib/get-posts';
import { DisplayPost } from '@/lib/types';
import { CopyCheck, Heart, Share } from 'lucide-react';
import { CodeBlock, CodeBlockCopyButton } from "@/components/ai-elements/code-block";
import { updateLikes } from "@/lib/likes";
import SearchBar from '@/components/custom/SearchBar';

const MainPage = () => {
  const [posts, setPosts] = useState<DisplayPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sharedPosts, setSharedPosts] = useState<Set<number>>(new Set());

  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getPosts();
        if (typeof data === "undefined") {
          setError('Failed to load posts');
        } else {
          setPosts(data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const increaseLikes = async (currentLikes: number, postId: number) => {
    try {
      await updateLikes(currentLikes, postId);
      // Update the local state to reflect the new like count
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, likes: post.likes + 1 }
            : post
        )
      );
    } catch (err) {
      alert("There was an error while adding your likes, please try again later");
      console.error('Error updating likes:', err);
    }
  };

  const copyToClipboard = async (postUrl: string, postId: number) => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setSharedPosts(prev => new Set([...prev, postId]));
      setTimeout(() => {
        setSharedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      }, 2000);
    } catch {
      alert('Failed to copy URL to clipboard! :(');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div>Loading posts...</div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 flex justify-center items-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Share-A-Code Learn</h1>
          <h2 className="text-xl font-bold">Learn from Others with Their Code</h2>
        </div>
        <div className='flex justify-center items-center'>
          <Link href={"https://app.shareacode.cc"}>
            <Avatar style={{ width: '120px', height: '120px' }}>
              <AvatarImage src="/shareacode.png" alt="Share-A-Code Logo"/>
              <AvatarFallback>S-A-C</AvatarFallback>
            </Avatar>
          </Link>
        </div>
        <br />
        <br />
<div className='flex bg-white border-0 shadow-2xl hover:shadow-blue-500/20 transform hover:scale-[1.02] transition-all duration-200 items-center justify-center rounded-2xl ring-1 ring-gray-900/5 p-1'>
  <SearchBar />
</div>
        <br />
        <div className="grid grid-cols-1 gap-6">
          {posts.map((dataPoint) => (
            <Card key={dataPoint.id} className="w-full">
              <CardHeader>
                <CardTitle className="text-lg">
                  <Link href={`/users?userId=${dataPoint.authorId}`}>{dataPoint.authorName}</Link>
                </CardTitle>
                <CardDescription>
                  <Link href={`/users?userId=${dataPoint.authorId}`}>
                    <Avatar style={{ width: '40px', height: '40px' }}>
                      <AvatarImage src={dataPoint.authorImageUrl} alt="Author Avatar"/>
                      <AvatarFallback>{dataPoint.authorName.split(" ")[0][0]}</AvatarFallback>
                    </Avatar>
                  </Link>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 items-center gap-y-1.5">
                    <span className="text-sm font-semibold text-gray-600">Description:</span>
                    <CodeBlock code={dataPoint.instructions} language={"md"}>
                      <CodeBlockCopyButton/>
                    </CodeBlock>
                  </div>

                  <div>
                    <span className="text-sm font-semibold text-gray-600">Code:</span>
                    <CodeBlock code={dataPoint.code} language={dataPoint.codeLanguage}>
                      <CodeBlockCopyButton/>
                    </CodeBlock>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="grid grid-cols-1 gap-y-1.5">
                <Label>Likes: {dataPoint.likes}</Label>
                <Button
                  variant={"secondary"}
                  onClick={() => increaseLikes(dataPoint.likes, dataPoint.id)}
                >
                  <Heart/>
                  Like this post
                </Button>
                <Button
                  variant={"secondary"}
                  onClick={() => copyToClipboard(`https://learn.shareacode.cc/posts?postId=${dataPoint.id}`, dataPoint.id)}
                >
                  {!sharedPosts.has(dataPoint.id) && <Share />}
                  {sharedPosts.has(dataPoint.id) && <CopyCheck />}
                  {!sharedPosts.has(dataPoint.id) && 'Share this post'}
                  {sharedPosts.has(dataPoint.id) && 'URL Copied to Clipboard!'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MainPage;
