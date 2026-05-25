import { useEffect, useState } from "react";
import { getFeedPosts, createPost } from "../../services/postService";

import { errorPageStyles, loadingPageStyles } from "../../styles/classes";

export const Feed = () => {
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const fetchFeed = async () => {
    try {
      const data = await getFeedPosts();

      setPosts(data.posts);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className={loadingPageStyles}>Loading feed...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className={errorPageStyles}>{error}</div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      {/* Background Glow */}
      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-purple-700/20 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-fuchsia-700/20 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-2xl flex-col gap-6">
        {/* Feed Header */}
        <div
          className="
            overflow-hidden
            rounded-4xl
            border border-white/10
            bg-white/5
            p-6
            shadow-2xl
            backdrop-blur-2xl
          "
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1
                className="
                  bg-linear-to-r
                  from-purple-200
                  to-fuchsia-400
                  bg-clip-text
                  text-3xl
                  font-black
                  text-transparent

                  sm:text-4xl
                "
              >
                Your Feed
              </h1>

              <p className="mt-2 text-sm text-zinc-400">
                Stay updated with your community.
              </p>
            </div>

            <div
              className="
                hidden
                rounded-2xl
                border border-white/10
                bg-white/5
                px-4 py-3
                text-center
                backdrop-blur-xl

                sm:block
              "
            >
              <p className="text-xl font-bold text-white">{posts.length}</p>

              <p className="text-xs uppercase tracking-widest text-zinc-400">
                Posts
              </p>
            </div>
          </div>
        </div>

        {/* Empty Feed */}
        {posts.length === 0 && (
          <div
            className="
              rounded-4xl
              border border-dashed border-white/10
              bg-white/5
              p-10
              text-center
              shadow-xl
              backdrop-blur-2xl
            "
          >
            <p className="text-lg font-semibold text-zinc-200">No posts yet.</p>

            <p className="mt-2 text-sm text-zinc-500">
              Once people start posting, their content will appear here.
            </p>
          </div>
        )}

        {/* Posts */}
        {posts.map((post) => (
          <div
            key={post._id}
            className="
              group
              relative
              overflow-hidden
              rounded-4xl
              border border-white/10
              bg-white/5
              p-5
              shadow-2xl
              backdrop-blur-2xl
              transition-all
              duration-300

              hover:border-purple-400/20
              hover:bg-white/[0.07]
            "
          >
            {/* Card Glow */}
            <div
              className="
                absolute
                inset-0
                bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.12),transparent_30%)]
                opacity-0
                transition-opacity
                duration-300

                group-hover:opacity-100
              "
            />

            {/* Content */}
            <div className="relative">
              {/* Top */}
              <div
                className="
                  mb-5
                  flex
                  items-start
                  justify-between
                  gap-4
                "
              >
                {/* User */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl" />

                    <img
                      src={post.owner.profileImage}
                      alt={post.owner.username}
                      className="
                        relative
                        h-12
                        w-12
                        rounded-full
                        border border-white/10
                        object-cover
                        object-center

                        sm:h-14
                        sm:w-14
                      "
                    />
                  </div>

                  <div>
                    <h2
                      className="
                        text-base
                        font-semibold
                        text-white

                        sm:text-lg
                      "
                    >
                      @{post.owner.username}
                    </h2>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-zinc-500

                        sm:text-sm
                      "
                    >
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Dot Menu Placeholder */}
                <button
                  className="
                    rounded-xl
                    border border-white/10
                    bg-white/5
                    px-3 py-2
                    text-zinc-400
                    transition-all
                    duration-300

                    hover:bg-white/10
                    hover:text-white
                  "
                >
                  •••
                </button>
              </div>

              {/* Post Content */}
              <div
                className="
                  rounded-3xl
                  border border-white/5
                  bg-black/20
                  p-5
                "
              >
                <p
                  className="
                    whitespace-pre-wrap
                    wrap-break-word
                    text-sm
                    leading-relaxed
                    text-zinc-200

                    sm:text-base
                  "
                >
                  {post.content}
                </p>
              </div>

              {/* Bottom Actions */}
              <div
                className="
                  mt-5
                  flex
                  items-center
                  gap-3
                "
              >
                <button
                  className="
                    rounded-2xl
                    border border-white/10
                    bg-white/5
                    px-4 py-2
                    text-sm
                    text-zinc-300
                    transition-all
                    duration-300

                    hover:border-purple-400/20
                    hover:bg-purple-500/10
                    hover:text-purple-200
                  "
                >
                  Like
                </button>

                <button
                  className="
                    rounded-2xl
                    border border-white/10
                    bg-white/5
                    px-4 py-2
                    text-sm
                    text-zinc-300
                    transition-all
                    duration-300

                    hover:border-fuchsia-400/20
                    hover:bg-fuchsia-500/10
                    hover:text-fuchsia-200
                  "
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
