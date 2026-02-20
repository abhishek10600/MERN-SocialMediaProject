export interface SearchPost {
  _id: string;
  content: string;
  image?: {
    url: string;
    public_id: string;
  };
  video?: {
    url: string;
    public_id: string;
  };
  owner: {
    _id: string;
    username: string;
    profileImage?: string;
  };
  likeCount: number;
  commentCount: number;
  createdAt: string;
}
