type User = {
  _id: string;
  username: string;
  profileImage?: string;
};

export type Conversation = {
  _id: string;
  participants: User[];
  lastMessage?: {
    text?: string;
    image?: string;
    sender: User;
  };
  unreadCount: number;
};

export type Message = {
  _id: string;
  text?: string;
  image?: string;
  sender: {
    _id: string;
    username: string;
    profileImage?: string;
  };
  createdAt: Date;
};
