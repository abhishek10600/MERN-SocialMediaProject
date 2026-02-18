export interface PostOwner {
  _id: string;
  username: string;
  profileImage?: string;
}

export interface PostCommentedBy {
  _id: string;
  username: string;
  profileImage?: string;
}

export interface PostComment {
  _id: string;
  comment: string;
  createdAt: string;
  commentedBy: PostCommentedBy;
}

export interface UserPostType {
  _id: string;
  content: string;
  image?: {
    url?: string;
    public_id?: string;
  };
  video?: {
    url?: string;
    public_id?: string;
  };
  owner: PostOwner;
  comments: PostComment[];
  likes: string[];
  createdAt: string;
  updatedAt: string;
  commentCount: number;
  likeCount: number;
}
