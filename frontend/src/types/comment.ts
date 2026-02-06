export interface CommentUser {
  _id: string;
  username: string;
  profileImage?: string;
}

export interface CommentType {
  _id: string;
  comment: string;
  createdAt: string;
  commentedBy: CommentUser;
}
