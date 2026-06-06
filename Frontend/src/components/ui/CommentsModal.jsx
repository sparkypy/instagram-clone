import { useEffect, useRef, useState } from "react";
import { Trash2, X } from "lucide-react";
import { AiOutlineLike } from "react-icons/ai";
import { GoCommentDiscussion } from "react-icons/go";

import {
  createComment,
  deleteComment,
  getPostComments,
} from "../../services/commentService";

import { useAuth } from "../../context/AuthContext";

export const CommentsModal = ({
  post,
  isOpen,
  onClose,
  onCommentAdd,
  onCommentDelete,
  handleLike,
}) => {
  const { user } = useAuth();
  const commentInputRef = useRef(null);

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState("");
  const [posting, setPosting] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(post?.likesCount || 0);
  const [localIsLiked, setLocalIsLiked] = useState(post?.isLiked || false);

  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);
  const [showExpand, setShowExpand] = useState(false);

  const handleCreateComment = async () => {
    if (!commentInput.trim()) return;
    try {
      setPosting(true);
      const data = await createComment(post._id, commentInput);
      setComments((prevComments) => [data.comment, ...prevComments]);
      setCommentInput("");
      onCommentAdd(post._id, data.commentsCount);
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const data = await deleteComment(commentId);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId),
      );
      onCommentDelete(post._id, data.commentsCount);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await getPostComments(post._id);
      setComments(data.comments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!post || !isOpen) return;
    fetchComments();
  }, [post, isOpen]);

  // keep local like state in sync with parent post prop
  useEffect(() => {
    setLocalLikesCount(post?.likesCount || 0);
    setLocalIsLiked(!!post?.isLiked);
  }, [post]);

  useEffect(() => {
    if (!isOpen) {
      setComments([]);
      setCommentInput("");
      setLoading(true);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!contentRef.current) return;

    setShowExpand(
      contentRef.current.scrollHeight > contentRef.current.clientHeight,
    );
  }, [post?._id]);
  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="relative h-screen w-full overflow-hidden border-white/10 bg-[#07010d] lg:h-[90vh] lg:max-h-225 lg:w-[95vw] lg:max-w-6xl lg:rounded-4xl lg:border">
        <div className="flex h-full flex-col lg:grid lg:grid-cols-[2fr_1fr]">
          {/* LEFT SIDE */}
          <div className="mink-w-0 hidden border-r border-purple-500/10 bg-black/20 lg:flex lg:flex-col">
            <div className="flex h-full min-w-0 flex-col">
              {/* Post Header */}

              {/* Content */}
              <div className="flex h-full min-w-0 flex-col p-6">
                {post.image && (
                  <div className="w-full overflow-hidden rounded-4xl border border-white/10 bg-black/30">
                    <div className="flex h-[32vh] max-h-95 min-h-55 w-full items-center justify-center">
                      <img
                        src={post.image}
                        alt={post.owner?.username || "Post Image"}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                )}

                <div
                  className={`mt-5 flex flex-col overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-4 ${post.image ? "max-h-[40vh]" : "min-h-0 justify-center"}`}
                >
                  {/* User Information */}
                  <div className="shrink-0">
                    <div className="flex items-center gap-4">
                      <img
                        src={post.owner.profileImage}
                        alt={post.owner.username}
                        className="h-12 w-12 rounded-full border border-white/10 object-cover"
                      />

                      <div>
                        <h2 className="font-semibold text-white">
                          @{post.owner.username || "not defined"}
                        </h2>

                        <p className="text-sm text-zinc-500">
                          {new Date(post.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="mt-5 min-h-0 flex-1 border-t border-white/10 pt-5">
                    <div
                      ref={contentRef}
                      className={`pretty-scrollbar overflow-hidden ${
                        isExpanded
                          ? `${post.image ? "max-h-[20vh]" : "max-h-[35vh]"} overflow-y-auto`
                          : post.image
                            ? "line-clamp-5"
                            : "line-clamp-9"
                      }`}
                    >
                      <p
                        style={{
                          whiteSpace: "pre-wrap",
                        }}
                        className={`w-full break-all text-zinc-200 ${post.image ? "leading tight text-xs" : "leading relaxed text-sm"}`}
                      >
                        {post.content}
                      </p>
                    </div>

                    {showExpand && (
                      <button
                        onClick={() => setIsExpanded((prev) => !prev)}
                        className="mt-2 text-xs text-purple-400 hover:text-purple-300"
                      >
                        {isExpanded ? "Show Less" : "Expand"}
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex shrink-0 items-center gap-3">
                  <button
                    onClick={async () => {
                      try {
                        // optimistic toggle locally
                        setLocalIsLiked((prev) => {
                          const newVal = !prev;
                          setLocalLikesCount((count) =>
                            newVal
                              ? (count || 0) + 1
                              : Math.max(0, (count || 1) - 1),
                          );
                          return newVal;
                        });

                        const data = await handleLike(post._id);

                        if (data && typeof data.likesCount === "number") {
                          setLocalLikesCount(data.likesCount);
                          setLocalIsLiked(!!data.liked);
                        }
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className={`group relative inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-300 ${
                      localIsLiked
                        ? "border-blue-500/20 bg-blue-500/10 text-blue-200"
                        : "border-white/10 bg-white/5 text-zinc-300 hover:border-purple-400/20 hover:bg-purple-500/10 hover:text-purple-200"
                    }`}
                  >
                    <AiOutlineLike
                      size={21}
                      className={`transition-transform duration-300 ${localIsLiked ? "scale-110 fill-blue-400" : ""}`}
                    />
                    <span>{localLikesCount || 0}</span>
                  </button>

                  <button
                    onClick={() => commentInputRef.current?.focus()}
                    className="group relative inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-zinc-300 transition-all duration-300 hover:border-fuchsia-400/20 hover:bg-fuchsia-500/10 hover:text-fuchsia-200"
                  >
                    <GoCommentDiscussion
                      size={21}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                    <span>{post.commentsCount || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex h-full min-h-0 flex-col bg-white/2">
            <>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 p-4 sm:p-5">
                <div>
                  <h2 className="text-lg font-bold text-white">Discussion</h2>

                  <p className="text-sm text-zinc-500">
                    {comments.length} comments
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="rounded-2xl border border-white/10 bg-white/5 p-2 text-zinc-400 transition-all duration-300 hover:bg-white/10 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Comments */}
              <div className="pretty-scrollbar min-h-0 flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.04),transparent_50%)]">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-zinc-500">Loading comments...</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 p-4 sm:p-5">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <div
                          key={comment._id}
                          className="group/comment relative overflow-hidden rounded-3xl border border-white/10 bg-black/20 p-4 transition-all duration-300 hover:border-fuchsia-400/10"
                        >
                          {/* Glow */}
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,70,239,0.08),transparent_40%)] opacity-0 transition-opacity duration-300 group-hover/comment:opacity-100" />

                          <div className="relative flex gap-3">
                            {/* Avatar */}
                            <img
                              src={comment.owner.profileImage}
                              alt={comment.owner.username}
                              className="h-10 w-10 shrink-0 rounded-full border border-white/10 object-cover"
                            />

                            {/* Content */}
                            <div className="min-w-0 flex-1 lg:w-[20vw] lg:max-w-2xs">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <h3 className="text-sm font-semibold text-white">
                                    @{comment.owner.username}
                                  </h3>

                                  <p className="mt-1 w-full text-sm leading-relaxed wrap-break-word whitespace-pre-wrap text-zinc-300">
                                    {comment.content}
                                  </p>
                                </div>

                                {/* Delete */}
                                {user?._id === comment.owner._id && (
                                  <button
                                    onClick={() =>
                                      handleDeleteComment(comment._id)
                                    }
                                    className="rounded-xl p-2 text-zinc-500 transition-all duration-300 hover:bg-red-500/10 hover:text-red-400"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex h-40 flex-col items-center justify-center rounded-4xl border border-dashed border-white/10 bg-white/2">
                        <>
                          <p className="text-base font-medium text-zinc-300">
                            No comments yet
                          </p>

                          <p className="mt-2 text-sm text-zinc-500">
                            Be the first to start the conversation.
                          </p>
                        </>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-white/10 bg-black/20 p-4">
                <div className="flex gap-3 rounded-3xl border border-white/10 bg-white/3 p-3">
                  <input
                    ref={commentInputRef}
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition-all duration-300 outline-none placeholder:text-zinc-500 focus:border-fuchsia-400/20 focus:bg-white/[0.07]"
                  />

                  <button
                    onClick={handleCreateComment}
                    disabled={posting || !commentInput.trim()}
                    className="rounded-xl bg-linear-to-r from-purple-600 to-fuchsia-600 px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Post
                  </button>
                </div>
              </div>
            </>
          </div>
        </div>
      </div>
    </div>
  );
};
