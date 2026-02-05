import type { UserPostType } from "../../types/userPost";
import UserPost from "./UserPost";
interface Props {
  userPosts: UserPostType[];
}

const UserPosts = ({ userPosts }: Props) => {
  if (!userPosts.length) {
    return <div className="text-zinc-400 text-center">No Posts Yet.</div>;
  }
  return (
    <div className="flex flex-col gap-4">
      {userPosts.map((post) => (
        <UserPost key={post._id} post={post} />
      ))}
    </div>
  );
};

export default UserPosts;
