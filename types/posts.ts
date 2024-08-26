export interface Post {
  id: number;
  created_at: string;
  posts: string;
  user_id: string;
  images: { url: string; fileId: string }[];
}

export interface PostWithUser extends Post {
  user_email: string | null;
  images: { url: string; fileId: string }[];
}


export interface PostHandlerProps {
  initialPosts: Post[];
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: string;
  content: string;
  created_at: string;
  user_email?: string;
}


export interface CommentSectionProps {
    postId: number;
    currentUserId: string | undefined;
  }

  export interface UserEmailResult {
    id: string;
    email: string | null;
  }

