import { AiOutlineLike } from "react-icons/ai";
import { GoCommentDiscussion } from "react-icons/go";

export const PostCard = ({ post, handleLike, openComments }) => {
  return (
    <div className="group relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:border-purple-400/20 hover:bg-white/[0.07]">
      {/* Card Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.12),transparent_30%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Content */}
      <div className="relative">
        {/* Top */}
        <div className="mb-5 flex items-start justify-between gap-4">
          {/* User */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl" />

              <img
                src={post.owner.profileImage}
                alt={post.owner.username}
                className="relative h-12 w-12 rounded-full border border-white/10 object-cover object-center sm:h-14 sm:w-14"
              />
            </div>

            <div>
              <h2 className="text-base font-semibold text-white sm:text-lg">
                @{post.owner.username || "undefined"}
              </h2>

              <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Dot Menu Placeholder */}
          <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-zinc-400 transition-all duration-300 hover:bg-white/10 hover:text-white">
            •••
          </button>
        </div>

        {/* Post Content */}
        <div className="rounded-2xl border border-white/5 bg-black/20 p-3.5 md:rounded-3xl md:p-5">
          <p
            style={{
              whiteSpace: "break-spaces",
            }}
            className="overflow-hidden text-sm leading-relaxed wrap-break-word whitespace-pre-wrap text-zinc-200 sm:text-base"
          >
            {post.content}
          </p>

          {post.image && (
            <img
              src={post.image}
              alt="Post image"
              className="mt-5 max-h-150 w-full rounded-3xl object-cover"
            />
          )}
        </div>

        {/* Bottom Actions */}
        <div className="mt-5 flex items-center gap-3">
          {/* Like Button */}
          <button
            onClick={() => handleLike(post._id)}
            className={`group relative flex items-center justify-center gap-1.5 overflow-hidden rounded-2xl border px-3 py-2 text-sm font-medium backdrop-blur-xl transition-all duration-300 ${
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
            onClick={() => openComments(post)}
            className="group/comment relative flex items-center justify-center gap-1.5 overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-zinc-300 backdrop-blur-xl transition-all duration-300 hover:border-fuchsia-400/20 hover:bg-fuchsia-500/10 hover:text-fuchsia-200"
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
  );
};
