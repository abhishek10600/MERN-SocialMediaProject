import type { UserPostType } from "../../types/userPost";
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
        <div
          key={post._id}
          className="rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            {post.owner.profileImage ? (
              <img
                src={post.owner.profileImage}
                alt={post.owner.username}
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              ""
            )}
            <p className="text-sm font-semibold text-white">
              @{post.owner.username}
            </p>
          </div>

          <p className="text-sm text-zinc-200 mb-2">{post.content}</p>

          {/* Image */}
          {post.image && (
            <img
              src={post.image}
              alt="post"
              className="w-full max-h-[400px] object-cover rounded-xl mb-3"
            />
          )}

          <div className="flex gap-4 text-xs text-zinc-400">
            <span>❤️ {post.likesCount}</span>
            <span>💬 {post.commentCount}</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserPosts;
