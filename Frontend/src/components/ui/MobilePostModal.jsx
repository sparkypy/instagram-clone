import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { AiOutlineLike } from "react-icons/ai";
import { GoCommentDiscussion } from "react-icons/go";

export const MobilePostModal = ({
  post,
  isOpen,
  onClose,
  handleLike,
  openComments,
}) => {
  const [expandedPost, setExpandedPost] = useState(false);

  useEffect(() => {
    setExpandedPost(false);
  }, [post]);

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

  if (!post || !isOpen) return null;
  const shouldShowExpand = post.content?.length > 180;
  const displayContent = expandedPost
    ? post.content
    : `${post.content.slice(0, 180)}${shouldShowExpand ? "..." : ""}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="relative h-screen w-full overflow-hidden bg-[#07010d] lg:h-[80vh] lg:w-[90vw] lg:max-w-6xl lg:rounded-4xl lg:border lg:border-white/10">
        <div className="flex h-full flex-col lg:grid lg:grid-cols-[1fr_380px]">
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
                    className="max-h-[45vh] min-h-[25vh] w-full object-contain"
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
                    className={`text-center text-base leading-relaxed wrap-break-word whitespace-pre-wrap text-zinc-200 ${expandedPost ? "" : "line-clamp-4"} `}
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
                    onClose();
                    openComments(post);
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

                  <span className="relative text-sm">{post.commentsCount}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
