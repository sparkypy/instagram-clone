import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { AiOutlineLike } from "react-icons/ai";
import { GoCommentDiscussion } from "react-icons/go";

export const PostModal = ({ post, isOpen, onClose }) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="h-screen w-full bg-[#07010d] lg:h-[80vh] lg:w-[90vw] lg:max-w-6xl lg:rounded-4xl lg:border lg:border-white/10">
        <div className="flex h-full flex-col lg:grid lg:grid-cols-[1fr_380px]">
          <div className="border-r border-white/10 bg-black/20">
            <div className="flex h-full min-h-75 items-center justify-center p-4 lg:h-full">
              {post.image ? (
                <img
                  src={post.image}
                  alt="Post"
                  className="max-h-[45vh] max-w-full rounded-3xl object-contain lg:max-h-[65vh]"
                />
              ) : (
                <div className="flex h-full min-h-[45vh] w-full items-center justify-center rounded-4xl border border-white/10 bg-white/5 p-10">
                  <p className="max-w-2xl text-center text-xl leading-relaxed text-zinc-200 sm:text-2xl">
                    {post.content}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex h-full flex-col">
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
            </div>

            {/* Body */}
            <div className="flex-1 p-5">
              <div className="pretty-scrollbar h-full overflow-y-auto">
                {post.image && (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p
                      style={{
                        whiteSpace: "break-spaces",
                      }}
                      className="leading-relaxed wrap-break-word whitespace-pre-wrap text-zinc-200"
                    >
                      {post.content}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 p-5">
              <div className="flex items-center gap-4">
                {/* Like Button */}
                <button
                  onClick={() => {}}
                  className={`group relative flex items-center justify-center gap-1.5 overflow-hidden rounded-2xl border px-4 py-3 text-sm font-medium backdrop-blur-xl transition-all duration-300 ${
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
                    size={22}
                    className={`relative transition-all duration-300 ${post.isLiked ? "scale-110 fill-blue-400" : ""} `}
                  />

                  <span className="relative text-base">{post.likesCount}</span>
                </button>

                {/* Comment Button */}
                <button
                  onClick={() => {}}
                  className="group/comment relative flex items-center justify-center gap-1.5 overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-300 backdrop-blur-xl transition-all duration-300 hover:border-fuchsia-400/20 hover:bg-fuchsia-500/10 hover:text-fuchsia-200"
                >
                  {/* Glow */}
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/comment:opacity-100">
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(217,70,239,0.12),transparent_70%)]" />
                  </div>

                  <GoCommentDiscussion
                    size={22}
                    className="relative transition-transform duration-300 group-hover/comment:scale-110"
                  />

                  <span className="relative text-base">
                    {post.commentsCount}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-2xl border border-white/10 bg-white/5 p-2 text-zinc-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};
