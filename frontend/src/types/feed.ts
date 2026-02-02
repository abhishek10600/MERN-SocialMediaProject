export interface FeedOwner {
  _id: string;
  username: string;
  profileImage: string;
}

export interface CommentedBy {
  _id: string;
  username: string;
  profileImage: string;
}

export interface FeedComment {
  _id: string;
  comment: string;
  createdAt: string;
  commentedBy: CommentedBy;
}

export interface FeedPostType {
  _id: string;
  content: string;
  image?: string;
  owner: FeedOwner;
  comments: FeedComment[];
  likes: string[];
  createdAt: string;
  updatedAt: string;
  commentsCount: number;
  likeCount: number;
}
