import { useState } from "react";
import type { UserPostType } from "../../types/userPost";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, User2 } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { toast } from "react-toastify";

interface props {
  post: UserPostType;
}

const UserPost = ({ post }: props) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [likes, setLikes] = useState<string[]>(post.likes);
  const [loading, setLoading] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(post.likeCount);
  const isLikedByMe = user ? likes.includes(user._id) : false;

  const handleToggleLike = async () => {
    if (!user) {
      toast.error("Please login to like the post");
      return;
    }

    try {
      setLoading(true);

      if (isLikedByMe) {
        setLikes((prev) => prev.filter((id) => id !== user._id));
        setLikeCount((prev) => prev - 1);
      } else {
        setLikes((prev) => [...prev, user._id]);
        setLikeCount((prev) => prev + 1);
      }

      // TODO: call backend like API here
      // await toggleLike(post._id);
    } catch (error) {
      toast.error("Failed to like post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-10 my-4">
      <div className="post-container flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {post.owner?.profileImage ? (
            <Link to={`profile/${post.owner?.username}`}>
              <img
                className="aspect-square w-8 rounded-full object-cover"
                src={post.owner.profileImage}
              />
            </Link>
          ) : (
            <Link to={`profile/${post.owner.username}`}>
              <User2 className="text-white" />
            </Link>
          )}
          <Link to={`profile/${post.owner.username}`}>
            <span className="text-white">{post.owner.username}</span>
          </Link>
        </div>
        <span className="text-xs text-white/60">
          {new Date(post.createdAt).toLocaleString()}
        </span>
        {post.image && (
          <div className="md:my-2">
            <img src={post.image} className="rounded-xl max-h-105" />
          </div>
        )}
        <p className="text-white">{post.content}</p>

        <div className="flex items-center gap-4">
          {/* likes */}
          <div className="flex items-center gap-2">
            <button
              disabled={loading}
              onClick={handleToggleLike}
              className="flex items-center gap-1 text-white hover:text-pink-500 transition disabled:opacity-50 cursor-pointer"
            >
              <Heart
                size={20}
                className={`transition ${isLikedByMe ? "fill-pink-500 text-pink-500" : ""}`}
              />
              <span className="text-sm">{likeCount}</span>
            </button>
          </div>

          {/* comment */}
          <div className="flex items-center gap-1 text-white/80 cursor-pointer hover:text-white/50 transition disabled:opacity-50">
            <MessageCircle size={20} />
            <span className="text-sm">{post.commentCount}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserPost;
