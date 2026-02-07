import { useState } from "react";
import type { UserPostType } from "../../types/userPost";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Trash2, User2 } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { toast } from "react-toastify";
import { toggleLikePost } from "../../api/like.api";
import type { CommentType } from "../../types/comment";
import {
  createComment,
  deleteComment,
  getCommentsByPostId,
} from "../../api/comment.api";
import Spinner from "../General/Spinner";

interface props {
  post: UserPostType;
}

const UserPost = ({ post }: props) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [likes, setLikes] = useState<string[]>(post.likes);
  const [loading, setLoading] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(post.likeCount);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentsCount, setCommentsCount] = useState<number>(post.commentCount);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
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
    } catch (error) {
      toast.error("Failed to like post");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const data = await getCommentsByPostId(post._id);
      setComments(data);
    } catch {
      toast.error("Failed to load comments");
    } finally {
      setLoadingComments(false);
    }
  };

  const handleToggleComments = () => {
    setShowComments((prev) => !prev);
    if (!showComments) fetchComments();
  };

  const handleAddComment = async () => {
    if (!user) return toast.error("Login to comment");
    if (!commentText.trim()) return toast.error("Comment cannot be empty");

    try {
      const newComment = await createComment(post._id, commentText);
      setComments((prev) => [newComment, ...prev]);
      setCommentsCount((prev) => prev + 1);
      setCommentText("");
      toast.success("Comment posted");
    } catch (error: any) {
      toast.error(error.message || "Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(post._id, commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      setCommentsCount((prev) => prev - 1);
      toast.success("Comment deleted");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete comment");
    }
  };

  return (
    // <section className="mx-10 my-4">
    //   <div className="post-container flex flex-col gap-2">
    //     <div className="flex items-center gap-2">
    //       {post.owner?.profileImage ? (
    //         <img
    //           className="aspect-square w-8 rounded-full object-cover"
    //           src={post.owner.profileImage}
    //         />
    //       ) : (
    //         <User2 className="text-white" />
    //       )}
    //       <span className="text-white">{post.owner.username}</span>
    //     </div>
    //     <span className="text-xs text-white/60">
    //       {new Date(post.createdAt).toLocaleString()}
    //     </span>
    //     {post.image && (
    //       <div className="md:my-2">
    //         <img src={post.image} className="rounded-xl max-h-105" />
    //       </div>
    //     )}
    //     <p className="text-white">{post.content}</p>

    //     <div className="flex items-center gap-4">
    //       {/* likes */}
    //       <div className="flex items-center gap-2">
    //         <button
    //           disabled={loading}
    //           onClick={handleToggleLike}
    //           className="flex items-center gap-1 text-white hover:text-pink-500 transition disabled:opacity-50 cursor-pointer"
    //         >
    //           <Heart
    //             size={20}
    //             className={`transition ${isLikedByMe ? "fill-pink-500 text-pink-500" : ""}`}
    //           />
    //           <span className="text-sm">{likeCount}</span>
    //         </button>
    //       </div>

    //       {/* comment */}
    //       <div className="flex items-center gap-1 text-white/80 cursor-pointer hover:text-white/50 transition disabled:opacity-50">
    //         <MessageCircle size={20} />
    //         <span className="text-sm">{post.commentCount}</span>
    //       </div>
    //     </div>
    //   </div>
    // </section>
    <section className="min-w-[60vw] md:px-32 md:py-8">
      <div className="flex flex-col gap-2">
        {/* Header */}
        <div className="flex items-center gap-2">
          {post.owner?.profileImage ? (
            <Link to={`/profile/${post.owner.username}`}>
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={post.owner.profileImage}
                alt="profile"
              />
            </Link>
          ) : (
            <Link to={`/profile/${post.owner.username}`}>
              <User2 className="text-white" />
            </Link>
          )}
          <Link to={`/profile/${post.owner.username}`}>
            <span className="text-white">{post.owner.username}</span>
          </Link>
        </div>

        <span className="text-xs text-white/60">
          {new Date(post.createdAt).toLocaleString()}
        </span>

        {post.image && <img src={post.image} className="rounded-xl" />}

        <p className="text-white">{post.content}</p>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            disabled={loading}
            onClick={handleToggleLike}
            className="flex items-center gap-1 text-white hover:text-pink-500 disabled:opacity-50"
          >
            <Heart
              size={20}
              className={`cursor-pointer ${isLikedByMe ? "fill-pink-500 text-pink-500" : ""}`}
            />
            <span className="text-sm">{likeCount}</span>
          </button>

          <button
            onClick={handleToggleComments}
            className="flex items-center gap-1 text-white/80 hover:text-white cursor-pointer"
          >
            <MessageCircle size={20} />
            <span className="text-sm">{commentsCount}</span>
          </button>
        </div>

        {/* Comments */}
        {showComments && (
          <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
            {loadingComments ? (
              <Spinner />
            ) : comments.length === 0 ? (
              <p className="text-white/60 text-sm">No comments yet</p>
            ) : (
              comments.map((comment) => {
                const isPostOwner = user?._id === post.owner._id;
                const isCommentOwner = user?._id === comment.commentedBy._id;
                const canDelete = isPostOwner || isCommentOwner;

                return (
                  <div
                    key={comment._id}
                    className="flex items-start gap-2 justify-between"
                  >
                    <div className="flex gap-2">
                      <img
                        src={
                          comment.commentedBy.profileImage ||
                          "/default-avatar.png"
                        }
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm text-white font-bold">
                          {comment.commentedBy.username}
                        </p>
                        <p className="text-sm text-white/80">
                          {comment.comment}
                        </p>
                      </div>
                    </div>

                    {canDelete && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-red-400 hover:text-red-500 cursor-pointer"
                        title="Delete comment"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                );
              })
            )}

            {/* Add comment */}
            <div className="flex gap-2 pt-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-white/5 text-white px-3 py-2 rounded-md"
                placeholder="Write a comment"
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50 cursor-pointer hover:scale-[1.02] bg-[#9929EA] text-white"
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default UserPost;
