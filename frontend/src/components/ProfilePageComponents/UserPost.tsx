import { useEffect, useRef, useState } from "react";
import type { UserPostType } from "../../types/userPost";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Pencil,
  Trash,
  Trash2,
  User2,
} from "lucide-react";
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
import { deletePost } from "../../api/post.api";
import ConfirmModal from "../General/ConfirmModal";
import HLSVideoPlayer from "../General/HlsVideoPlayer";

interface props {
  post: UserPostType;
  onDeletePost: (postId: string) => void;
}

const UserPost = ({ post, onDeletePost }: props) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [likes, setLikes] = useState<string[]>(post.likes);
  const [loading, setLoading] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(post.likeCount);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentsCount, setCommentsCount] = useState<number>(post.commentCount);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  const isLikedByMe = user ? likes.includes(user._id) : false;
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleOpenConfirm = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await deletePost(post._id);
      onDeletePost(post._id);
      toast.success("Post deleted successfully");
      setShowConfirm(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

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

  useEffect(() => {
    if (contentRef.current) {
      const element = contentRef.current;
      setIsOverflowing(element.scrollHeight > element.clientHeight);
    }
  }, [post.content]);

  return (
    <section className="px-4 md:py-8">
      <div className="flex flex-col gap-2">
        {/* Header */}
        <div className="flex items-center justify-between">
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

          {user?.username === post.owner.username && (
            <div className="flex items-center justify-center gap-2">
              <Link
                to={`post/edit/${post._id}`}
                className="text-[#9929EA] hover:text-[#5f1792] transition"
              >
                <Pencil size={18} />
              </Link>
              <button
                onClick={handleOpenConfirm}
                className="text-red-500 cursor-pointer hover:text-red-800 transition"
              >
                <Trash size={18} />
              </button>
            </div>
          )}
        </div>

        <ConfirmModal
          isOpen={showConfirm}
          title="Delete Post?"
          message="This action cannot be undone. Are you sure you want to delete this post?"
          confirmText="Yes, delete"
          cancelText="Cancel"
          loading={deleting}
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleConfirmDelete}
        />

        <span className="text-xs text-white/60">
          {new Date(post.createdAt).toLocaleString()}
        </span>

        {/* Image */}
        {post.image && (
          <img src={post.image.url} alt="post" className="rounded-xl" />
        )}

        {/* Video — HLS player for Cloudinary .m3u8 streams */}
        {post.video?.url && <HLSVideoPlayer src={post.video?.url} />}

        {/* Post content with read more */}
        <div className="relative">
          <div
            ref={contentRef}
            className={`prose prose-invert max-w-none text-white transition-all duration-300 ${
              expanded ? "" : "line-clamp-3 overflow-hidden"
            }`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          {isOverflowing && (
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="mt-1 text-sm text-white/60 cursor-pointer hover:underline"
            >
              {expanded ? "Show less" : "More"}
            </button>
          )}
        </div>

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
                        alt={comment.commentedBy.username}
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
