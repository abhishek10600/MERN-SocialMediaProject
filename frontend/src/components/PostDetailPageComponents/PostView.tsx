import { useRef, useState, useEffect } from "react";
import { Heart, MessageCircle, Trash2, User2 } from "lucide-react";
import { Link } from "react-router-dom";
import Spinner from "../General/Spinner";
import HLSVideoPlayer from "../General/HlsVideoPlayer";
import type { PostDetailType } from "../../types/feed";
import type { CommentType } from "../../types/comment";

interface Props {
  post: PostDetailType;
  likes: string[];
  likeCount: number;
  commentsCount: number;
  comments: CommentType[];
  showComments: boolean;
  loadingComments: boolean;
  isLikedByMe: boolean;
  loadingLike: boolean;
  onToggleLike: () => void;
  onToggleComments: () => void;
  onAddComment: (text: string) => void;
  onDeleteComment: (id: string) => void;
}

const PostView = ({
  post,
  likeCount,
  commentsCount,
  comments,
  showComments,
  loadingComments,
  isLikedByMe,
  loadingLike,
  onToggleLike,
  onToggleComments,
  onAddComment,
  onDeleteComment,
}: Props) => {
  const [commentText, setCommentText] = useState("");

  const contentRef = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      const el = contentRef.current;
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    }
  }, [post.content]);

  return (
    <div className="mx-auto w-full flex flex-col text-white">
      <section className="px-4 md:py-8">
        <div className="flex flex-col gap-2">
          {/* HEADER */}
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
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src="/avatar1.jpg"
                  alt="profile"
                />
              </Link>
            )}

            <Link to={`/profile/${post.owner.username}`}>
              <span className="text-white">{post.owner.username}</span>
            </Link>
          </div>

          <span className="text-xs text-white/60">
            {new Date(post.createdAt).toLocaleString()}
          </span>

          {/* IMAGE */}
          {post.image && (
            <img src={post.image.url} alt="post" className="rounded-xl" />
          )}

          {/* VIDEO */}
          {post.video?.url && <HLSVideoPlayer src={post.video.url} />}

          {/* CONTENT */}
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
                className="mt-1 text-sm text-white/60 hover:underline"
              >
                {expanded ? "Show less" : "More"}
              </button>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">
            <button
              disabled={loadingLike}
              onClick={onToggleLike}
              className="flex items-center gap-1 text-white hover:text-pink-500 disabled:opacity-50"
            >
              <Heart
                size={20}
                className={`cursor-pointer ${
                  isLikedByMe ? "fill-pink-500 text-pink-500" : ""
                }`}
              />
              <span className="text-sm">{likeCount}</span>
            </button>

            <button
              onClick={onToggleComments}
              className="flex items-center gap-1 text-white/80 hover:text-white"
            >
              <MessageCircle size={20} />
              <span className="text-sm">{commentsCount}</span>
            </button>
          </div>

          {/* COMMENTS */}
          {showComments && (
            <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
              {loadingComments ? (
                <Spinner />
              ) : comments.length === 0 ? (
                <p className="text-white/60 text-sm">No comments yet</p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex items-start gap-2 justify-between"
                  >
                    <div className="flex gap-2">
                      <img
                        src={comment.commentedBy.profileImage || "/avatar1.png"}
                        className="w-8 h-8 rounded-full object-cover"
                        alt={comment.commentedBy.username}
                      />

                      <div>
                        <p className="text-sm font-bold">
                          {comment.commentedBy.username}
                        </p>
                        <p className="text-sm text-white/80">
                          {comment.comment}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteComment(comment._id)}
                      className="text-red-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}

              {/* ADD COMMENT */}
              <div className="flex gap-2 pt-2">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-white/5 text-white px-3 py-2 rounded-md"
                  placeholder="Write a comment"
                />

                <button
                  onClick={() => {
                    onAddComment(commentText);
                    setCommentText("");
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition hover:scale-[1.02] bg-[#9929EA]"
                >
                  Post
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PostView;
