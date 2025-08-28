export interface SocialPost {
    id: number,
    created_at: string,
    code: string,
    instructions: string,
    authorName: string,
    authorId: string,
    likes: number,
    shareLink: string,
    codeLanguage: string,
}

export interface DisplayPost {
    id: number,
    created_at: string,
    code: string,
    instructions: string,
    authorName: string,
    authorImageUrl: string,
    likes: number,
    shareLink: string,
    authorId: string,
    codeLanguage: string,
}

export interface DisplayUser {
    name: string,
    userName: string,
    avatarUrl: string,
    postsNumber: number,
    mostUsedLanguage: string,
}