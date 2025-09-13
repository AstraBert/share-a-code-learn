'use client';

import { getUserDetailsById } from '@/lib/get-users';
import { Badge } from "@/components/ui/badge"
import { Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DisplayUser } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardAction,
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
import { ArrowBigLeft, Github, Telescope } from 'lucide-react';
import Link from 'next/link';
import { validate as uuidValidate } from 'uuid';

function getUserUserName(userName: string) {
  if (userName === "") {
    return userName
  } else {
    return `@${userName}`
  }
}

export function isValidUUID(uuid: string): boolean {
  return uuidValidate(uuid);
}

function UsersPage() {
  const searchParams = useSearchParams();
  const userIdParam = searchParams.get('userId');
  const [user, setUser] = useState<DisplayUser | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userIdParam) {

      const userId = userIdParam;

      if (userId === "" || !(isValidUUID(userId))) {
        setError('Invalid user ID');
        return;
      }

      setLoading(true);
      setError(null);

      getUserDetailsById(userId)
        .then((userToDisplay) => {
          setUser(userToDisplay);
        })
        .catch((err) => {
          setError('Failed to load user details: ' + err.message);
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userIdParam]);

  if (!userIdParam) {
    return <div>Please provide a userId</div>;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div>Loading user details...</div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg">
                  {user.name}
                </CardTitle>
                <CardAction className='text-lg text-gray-400 gap-y-2'>
                    <Link href={user.hasGithub ? `https://github.com/${user.userName}` : '#'}>{getUserUserName(user.userName ?? "")}</Link>
                    {user.hasGithub && <Link href={`https://github.com/${user.userName}`}><Github /></Link>}
                </CardAction>
                <CardDescription>
                  <Avatar style={{ width: '40px', height: '40px' }}>
                    <AvatarImage src={user.avatarUrl ?? "/shareacode.png"} alt="Author Avatar"/>
                    <AvatarFallback>{user.name?.split(" ")[0][0] ?? "U"}</AvatarFallback>
                  </Avatar>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 items-center gap-y-2.5">
                    <span className="text-sm font-semibold text-gray-600">Posts</span>
                    {user.postsNumber ?? 0}
                  </div>

                  <div className='grid grid-cols-1 items-center gap-y-1'>
                    <span className="text-sm font-semibold text-gray-600">Most Used Language</span>
                    <Link href={`/search?language=${user.mostUsedLanguage}`}>
                    <Badge className='bg-green-700 text-white text-shadow-lg'>{user.mostUsedLanguage ?? 'No Language'}</Badge>
                    </Link>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="grid grid-cols-1 gap-y-1.5">
                <Link href={`/search?userId=${userIdParam}`}>
                  <Button
                  variant={"secondary"}
                  className='bg-gray-50 hover:bg-black text-gray-500 hover:text-gray-50 border border-gray-200'
                  >
                    <Telescope />
                    See this user&apos;s posts
                  </Button>
                </Link>
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

function UsersLoadingSkeleton() {
  return (
      <div className="flex flex-col items-center space-y-4">
        <div>Loading user details...</div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
  )
}

export default function UsersSuspendedPage() {
  return (
    <Suspense fallback={<UsersLoadingSkeleton />}>
      <UsersPage />
    </Suspense>
  );
}
