import { useEffect, useState } from "react";
import { Trash2, X } from "lucide-react";

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
}) => {
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState("");
  const [posting, setPosting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCreateComment = async () => {
    if (!commentInput.trim()) return;
    try {
      setPosting(true);
      const data = await createComment(post._id, commentInput);
      setComments((prevComments) => [data.comment, ...prevComments]);
      setCommentInput("");
      onCommentAdd(post._id);
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
      onCommentDelete(post._id);
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

  if (!isOpen || !post) return null;

  const MAX_CONTENT_LENGTH = 180;

  const isLongContent = post.content.length > MAX_CONTENT_LENGTH;

  const displayContent =
    isExpanded || !isLongContent
      ? post.content
      : `${post.content.slice(0, MAX_CONTENT_LENGTH)}...`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="relative h-screen w-full overflow-hidden border-white/10 bg-[#07010d] lg:h-[90vh] lg:max-h-225 lg:w-[95vw] lg:max-w-6xl lg:rounded-4xl lg:border">
        <div className="flex h-full flex-col lg:grid lg:grid-cols-[1.35fr_430px]">
          {/* LEFT SIDE */}
          <div className="hidden min-w-0 border-r border-purple-500/10 bg-black/20 lg:flex lg:flex-col">
            <div className="flex h-full min-w-0 flex-col">
              {/* Post Header */}

              {/* Content */}
              <div className="pretty-scrollbar min-w-0 flex-1 overflow-y-auto p-6">
                {post.image && (
                  <div className="flex h-[50vh] max-h-125 items-center justify-center overflow-hidden rounded-4xl border border-white/10 bg-black/30">
                    <img
                      src={post.image}
                      alt="Post Image"
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}

                <div className="mx-auto mt-5 max-w-2xl min-w-0 overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-6">
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

                  <div
                    className={`mt-5 min-w-0 border-t border-white/10 pt-5 ${isExpanded ? "max-h-[20vh] overflow-y-auto" : ""} `}
                  >
                    <p
                      style={{
                        whiteSpace: "break-spaces",
                      }}
                      className="max-w-full text-xs leading-relaxed wrap-break-word whitespace-pre-wrap text-zinc-200"
                    >
                      {displayContent}
                    </p>
                    {isLongContent && (
                      <button
                        onClick={() => setIsExpanded((prev) => !prev)}
                        className="mt-3 text-sm text-purple-400 hover:text-purple-300"
                      >
                        {isExpanded ? "Show Less" : "Expand"}
                      </button>
                    )}
                  </div>
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
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <h3 className="text-sm font-semibold text-white">
                                    @{comment.owner.username}
                                  </h3>

                                  <p className="mt-1 text-sm leading-relaxed wrap-break-word whitespace-pre-wrap text-zinc-300">
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
