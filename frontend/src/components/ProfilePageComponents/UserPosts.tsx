import type { UserPostType } from "../../types/userPost";
import UserPost from "./UserPost";
interface Props {
  userPosts: UserPostType[];
  onDeletePost: (postId: string) => void;
}

const UserPosts = ({ userPosts, onDeletePost }: Props) => {
  if (!userPosts.length) {
    return <div className="text-zinc-400 text-center my-4">No Posts Yet.</div>;
  }
  return (
    <div className="flex flex-col gap-4">
      {userPosts.map((post) => (
        <UserPost key={post._id} post={post} onDeletePost={onDeletePost} />
      ))}
    </div>
  );
};

export default UserPosts;
