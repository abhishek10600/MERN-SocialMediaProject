import { useSelector } from "react-redux";
import type { FeedPostType } from "../../types/feed";
import type { RootState } from "../../store/store";
import { useState } from "react";
import { toast } from "react-toastify";
import { toggleLikePost } from "../../api/like.api";
import { Heart, MessageCircle, User2 } from "lucide-react";
import { Link } from "react-router-dom";

interface FeedPostProps {
  post: FeedPostType;
}

const FeedPost = ({ post }: FeedPostProps) => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [likes, setLikes] = useState<string[]>(post.likes);
  const [likeCount, setLikeCount] = useState<number>(post.likeCount);
  const [loading, setLoading] = useState(false);

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

      await toggleLikePost(post._id);
    } catch (error: any) {
      toast.error(error.message || "Failed to toggle like");
      if (isLikedByMe) {
        setLikes((prev) => [...prev, user._id]);
        setLikeCount((prev) => prev + 1);
      } else {
        setLikes((prev) => prev.filter((id) => id !== user._id));
        setLikeCount((prev) => prev - 1);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-w-[60vw] md:px-32 md:py-8">
      <div className="post-container flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {post.owner?.profileImage ? (
            <Link to={`profile/${user?.username}`}>
              <img
                className="aspect-square w-8 rounded-full object-cover"
                src={post.owner.profileImage}
              />
            </Link>
          ) : (
            <Link to={`profile/${user?.username}`}>
              <User2 className="text-white" />
            </Link>
          )}
          <Link to={`profile/${user?.username}`}>
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
            <span className="text-sm">{post.commentsCount}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedPost;
