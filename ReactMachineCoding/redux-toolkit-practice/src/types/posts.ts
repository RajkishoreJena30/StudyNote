
type reactions = {
    likes: number;
    dislikes: number;
}

export interface Post {
    id: number;
    title: string;
    body: string;
    tags?: string[];
    reactions?: reactions;
    views?: number;
    userId?: number;
}
