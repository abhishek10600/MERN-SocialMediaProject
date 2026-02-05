export interface userProfileInfoType {
  _id: string;
  username: string;
  email: string;
  bio?: string | null;
  profileImage?: string | null;
  postCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}
