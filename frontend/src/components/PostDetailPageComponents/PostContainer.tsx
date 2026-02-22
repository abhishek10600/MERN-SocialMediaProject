import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import type { RootState } from "../../store/store";
import type { PostDetailType } from "../../types/feed";
import type { CommentType } from "../../types/comment";
import {
  createComment,
  deleteComment,
  getCommentsByPostId,
} from "../../api/comment.api";
import { toggleLikePost } from "../../api/like.api";
import PostView from "./PostView";

interface Props {
  post: PostDetailType;
}

const PostContainer = ({ post }: Props) => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [likes, setLikes] = useState<string[]>([]);
  const [likeCount, setLikeCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);

  const [comments, setComments] = useState<CommentType[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  const [loadingLike, setLoadingLike] = useState(false);

  // Sync state when post changes
  useEffect(() => {
    setLikes(post.likes?.map((l) => l._id) ?? []);
    setLikeCount(post.likeCount ?? 0);
    setCommentsCount(post.commentCount ?? 0);
  }, [post]);

  const isLikedByMe = useMemo(
    () => (user ? likes.includes(user._id) : false),
    [likes, user],
  );

  // Like
  const toggleLike = async () => {
    if (!user) return toast.error("Login first");

    try {
      setLoadingLike(true);

      if (isLikedByMe) {
        setLikes((p) => p.filter((id) => id !== user._id));
        setLikeCount((c) => c - 1);
      } else {
        setLikes((p) => [...p, user._id]);
        setLikeCount((c) => c + 1);
      }

      await toggleLikePost(post._id);
    } catch {
      toast.error("Failed to like post");
    } finally {
      setLoadingLike(false);
    }
  };

  // Comments
  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const data = await getCommentsByPostId(post._id);
      setComments(data);
    } catch {
      toast.error("Failed loading comments");
    } finally {
      setLoadingComments(false);
    }
  };

  const toggleComments = () => {
    setShowComments((p) => !p);
    if (!showComments) fetchComments();
  };

  const addComment = async (text: string) => {
    if (!user) return toast.error("Login required");

    const newComment = await createComment(post._id, text);
    setComments((p) => [newComment, ...p]);
    setCommentsCount((c) => c + 1);
  };

  const removeComment = async (commentId: string) => {
    await deleteComment(post._id, commentId);
    setComments((p) => p.filter((c) => c._id !== commentId));
    setCommentsCount((c) => c - 1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col overflow-x-hidden">
      <PostView
        post={post}
        likes={likes}
        likeCount={likeCount}
        commentsCount={commentsCount}
        comments={comments}
        showComments={showComments}
        loadingComments={loadingComments}
        isLikedByMe={isLikedByMe}
        loadingLike={loadingLike}
        onToggleLike={toggleLike}
        onToggleComments={toggleComments}
        onAddComment={addComment}
        onDeleteComment={removeComment}
      />
    </div>
  );
};

export default PostContainer;
