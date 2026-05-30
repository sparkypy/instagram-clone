import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { AiOutlineLike } from "react-icons/ai";
import { GoCommentDiscussion } from "react-icons/go";
import {
  createComment,
  deleteComment,
  getPostComments,
} from "../../services/commentService";
import { Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const PostModal = ({ post, isOpen, onClose, handleLike }) => {
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState("");
  const [posting, setPosting] = useState(false);
  const [expandedPost, setExpandedPost] = useState(false);

  const handleCreateComment = async () => {
    if (!commentInput.trim()) return;
    try {
      setPosting(true);
      const data = await createComment(post._id, commentInput);
      setComments((prevComments) => [data.comment, ...prevComments]);
      setCommentInput("");
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId),
      );
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
    setExpandedPost(false);
  }, [post]);

  useEffect(() => {
    if (!post || !isOpen) return;
    fetchComments();
  }, [post, isOpen]);

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
    if (!isOpen) {
      setComments([]);
      setLoading(true);
      setCommentInput("");
    }
  }, [isOpen]);

  if (!post || !isOpen) return null;
  const shouldShowExpand = post.content?.length > 180;
  const displayContent = expandedPost
    ? post.content
    : `${post.content.slice(0, 180)}${shouldShowExpand ? "..." : ""}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="h-screen w-full overflow-hidden bg-[#07010d] lg:h-[80vh] lg:w-[90vw] lg:max-w-6xl lg:rounded-4xl lg:border lg:border-white/10">
        <div className="flex h-full flex-col lg:grid lg:grid-cols-[1fr_380px]">
          <div className="hidden border-r border-white/10 bg-black/20 lg:block">
            <div className="flex h-full min-h-75 items-center justify-center p-4 lg:h-full">
              {post.image ? (
                <img
                  src={post.image}
                  alt="Post"
                  className="max-h-[45vh] max-w-full rounded-3xl object-contain lg:max-h-[65vh]"
                />
              ) : (
                <div
                  className={`pretty-scrollbar w-full rounded-4xl border border-white/10 bg-white/5 p-10 ${expandedPost ? "h-full overflow-y-auto" : ""} `}
                >
                  <p
                    className={`text-center text-xl leading-relaxed break-all whitespace-pre-wrap text-zinc-200 ${expandedPost ? "" : "line-clamp-8"} `}
                  >
                    {post.content}
                  </p>
                  {post.content.length > 180 && (
                    <button
                      onClick={() => setExpandedPost((prev) => !prev)}
                      className="mt-4 text-sm text-purple-400 hover:text-purple-300"
                    >
                      {expandedPost ? "Show less" : "...click to expand"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex h-full min-h-0 flex-col">
            {/* Header */}
            <div className="border-b border-white/10 p-5">
              <div className="flex items-center gap-4">
                <img
                  src={post.owner.profileImage}
                  alt={post.owner.username}
                  className="h-12 w-12 rounded-full border border-white/10 object-cover"
                />

                <div className="min-w-0">
                  <p className="text-[10px] tracking-[0.25em] text-purple-400 uppercase">
                    Post
                  </p>

                  <h2 className="truncate font-semibold text-white">
                    @{post.owner.username}
                  </h2>

                  <p className="text-xs text-zinc-500">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 rounded-2xl border border-white/10 bg-white/5 p-2 text-zinc-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Post */}
            <div className="border-b border-white/10 p-4 lg:hidden">
              {post.image ? (
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/20">
                  <img
                    src={post.image}
                    alt="Post"
                    className="min-h-[25vh] max-h-[30vh] w-full object-contain"
                  />
                  <div className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/90 via-black/60 to-transparent p-4">
                    <div
                      className={`border-t border-white/10 bg-black/40 transition-all duration-300 ${
                        expandedPost
                          ? "max-h-30 overflow-y-auto"
                          : "max-h-16 overflow-hidden"
                      } `}
                    >
                      <p
                        style={{
                          whiteSpace: "break-spaces",
                          overflowWrap: "anywhere",
                        }}
                        className={`text-sm text-white transition-all duration-300 ${expandedPost ? "" : "line-clamp-2"} `}
                      >
                        {post.content}
                      </p>
                    </div>
                    {shouldShowExpand && (
                      <button
                        onClick={() => setExpandedPost((prev) => !prev)}
                        className="mt-2 text-xs font-medium text-purple-300"
                      >
                        {expandedPost ? "Show less" : "More"}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className={`rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-300 ${
                    expandedPost ? "" : "max-h-[25vh] overflow-hidden"
                  } `}
                >
                  <p
                    style={{ whiteSpace: "break-spaces" }}
                    className={`text-center leading-relaxed wrap-break-word whitespace-pre-wrap text-zinc-200 ${expandedPost ? "" : "line-clamp-4"} `}
                  >
                    {post.content}
                  </p>
                  {post.content.length > 180 && (
                    <button
                      onClick={() => setExpandedPost((prev) => !prev)}
                      className="mt-4 text-sm text-purple-400 hover:text-purple-300"
                    >
                      {expandedPost ? "Show less" : "...click to expand"}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Body */}
            {post.image && post.content && (
              <div className="hidden shrink-0 border-b border-white/10 p-5 lg:block">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p
                    style={{
                      whiteSpace: "break-spaces",
                    }}
                    className="text-xs leading-relaxed wrap-break-word whitespace-pre-wrap text-zinc-200"
                  >
                    {displayContent}
                  </p>

                  {shouldShowExpand && (
                    <button
                      onClick={() => setExpandedPost((prev) => !prev)}
                      className="mt-3 text-sm text-purple-400 hover:text-purple-300"
                    >
                      {expandedPost ? "Show less" : "...click to expand"}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Comments */}
            <div id="comments-section" className="min-h-0 flex-1">
              <div className="pretty-scrollbar h-full overflow-y-auto overscroll-contain bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.04),transparent_50%)]">
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
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <h3 className="text-sm font-semibold text-white">
                                    @{comment.owner.username}
                                  </h3>

                                  <p className="mt-1 text-sm leading-relaxed break-all whitespace-pre-wrap text-zinc-300">
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
            </div>
            {/* Footer */}
            <div className="shrink-0 space-y-3 border-t border-white/10 p-5">
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Like Button */}
                <button
                  onClick={() => handleLike(post._id)}
                  className={`group relative flex items-center justify-center gap-1.5 overflow-hidden rounded-2xl border px-3 py-2 font-medium backdrop-blur-xl transition-all duration-300 sm:px-4 sm:py-3 ${
                    post.isLiked
                      ? `border-blue-500/20 bg-blue-500/10 text-blue-200 shadow-[0_0_25px_rgba(59,130,246,0.15)]`
                      : `border-white/10 bg-white/5 text-zinc-300 hover:border-purple-400/20 hover:bg-purple-500/10 hover:text-purple-200`
                  } `}
                >
                  {/* Glow */}
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(168,85,247,0.12),transparent_70%)]" />
                  </div>

                  <AiOutlineLike
                    size={19}
                    className={`relative transition-all duration-300 ${post.isLiked ? "scale-110 fill-blue-400" : ""} `}
                  />

                  <span className="relative text-sm">{post.likesCount}</span>
                </button>

                {/* Comment Button */}
                <button
                  onClick={() => {
                    const commentsSection =
                      document.getElementById("comments-section");

                    commentsSection?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="group/comment relative flex items-center justify-center gap-1.5 overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-zinc-300 backdrop-blur-xl transition-all duration-300 hover:border-fuchsia-400/20 hover:bg-fuchsia-500/10 hover:text-fuchsia-200 sm:px-4 sm:py-3"
                >
                  {/* Glow */}
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/comment:opacity-100">
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(217,70,239,0.12),transparent_70%)]" />
                  </div>

                  <GoCommentDiscussion
                    size={19}
                    className="relative transition-transform duration-300 group-hover/comment:scale-110"
                  />

                  <span className="relative text-sm">{comments.length}</span>
                </button>
              </div>

              {/* Input */}
              <div className="flex gap-1.5 rounded-3xl border border-white/10 bg-white/3 p-1.5 sm:gap-3 sm:p-3">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition-all duration-300 outline-none placeholder:text-zinc-500 focus:border-fuchsia-400/20 focus:bg-white/[0.07] sm:px-5 sm:py-3"
                />

                <button
                  onClick={handleCreateComment}
                  disabled={posting || !commentInput.trim()}
                  className="rounded-xl bg-linear-to-r from-purple-600 to-fuchsia-600 px-3 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 sm:px-5 sm:py-3"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
