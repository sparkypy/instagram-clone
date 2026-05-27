import { useEffect, useState, useRef } from "react";
import { getFeedPosts, createPost } from "../../services/postService";
import { toggleLike } from "../../services/likeService";
import { AiOutlineLike } from "react-icons/ai";

import {
  createComment,
  deleteComment,
  getPostComments,
} from "../../services/commentService";
import { GoCommentDiscussion } from "react-icons/go";

import { IoMdTrash } from "react-icons/io";

import { errorPageStyles, loadingPageStyles } from "../../styles/classes";

import { useAuth } from "../../context/AuthContext";

export const Feed = () => {
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  const textareaRef = useRef(null);

  const { user } = useAuth();
  const [commentsMap, setCommentsMap] = useState({});
  const [showComments, setShowComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  const handleToggleComments = async (postId) => {
    const currentlyOpen = showComments[postId];

    setShowComments((prev) => ({
      ...prev,
      [postId]: !currentlyOpen,
    }));

    if (currentlyOpen || commentsMap[postId]) {
      return;
    }

    try {
      const data = await getPostComments(postId);
      setCommentsMap((prev) => ({
        ...prev,
        [postId]: data.comments,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateComment = async (postId) => {
    const content = commentInputs[postId];
    if (!content?.trim()) return;

    try {
      const data = await createComment(postId, content);
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId)
            return {
              ...post,
              commentsCount: post.commentsCount + 1,
            };

          return post;
        }),
      );
      setCommentsMap((prev) => ({
        ...prev,
        [postId]: [data.comment, ...(prev[postId] || [])],
      }));
      setCommentInputs((prev) => ({
        ...prev,
        [postId]: "",
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    try {
      await deleteComment(commentId);

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId)
            return {
              ...post,
              commentsCount: post.commentsCount - 1,
            };

          return post;
        }),
      );

      setCommentsMap((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => {
          if (comment._id !== commentId) return comment;
        }),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (postId) => {
    try {
      const data = await toggleLike(postId);
      setPosts((prevPosts) => {
        return prevPosts.map((post) => {
          if (post._id !== postId) return post;
          return {
            ...post,
            isLiked: data.liked,
            likesCount: data.liked ? post.likesCount + 1 : post.likesCount - 1,
          };
        });
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setContent(value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleCreatePost = async () => {
    if (!content.trim()) return;
    try {
      setPosting(true);
      const normalizedContent = content.replace(/[ \t]+/g, " ").trim();
      const data = await createPost(normalizedContent);
      setPosts((prev) => [data.post, ...prev]);
      setContent("");
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

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
      <div className="absolute top-0 -left-40 h-96 w-96 rounded-full bg-purple-700/20 blur-3xl" />

      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-fuchsia-700/20 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-2xl flex-col gap-6">
        {/* Feed Header */}
        <div className="overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="bg-linear-to-r from-purple-200 to-fuchsia-400 bg-clip-text text-3xl font-black text-transparent sm:text-4xl">
                Your Feed
              </h1>

              <p className="mt-2 text-sm text-zinc-400">
                Stay updated with your community.
              </p>
            </div>

            <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center backdrop-blur-xl sm:block">
              <p className="text-xl font-bold text-white">{posts.length}</p>

              <p className="text-xs tracking-widest text-zinc-400 uppercase">
                Posts
              </p>
            </div>
          </div>
        </div>

        {/* Empty Feed */}
        {posts.length === 0 && (
          <div className="rounded-4xl border border-dashed border-white/10 bg-white/5 p-10 text-center shadow-xl backdrop-blur-2xl">
            <p className="text-lg font-semibold text-zinc-200">No posts yet.</p>

            <p className="mt-2 text-sm text-zinc-500">
              Once people start posting, their content will appear here.
            </p>
          </div>
        )}

        {/* text area */}
        <div className="shadow-xl' rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            placeholder="What's on your mind?"
            maxLength={500}
            style={{
              whiteSpace: "break-spaces",
            }}
            className="min-h-30 w-full resize-none overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-4 break-all text-white outline-none placeholder:text-zinc-500"
          />

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-zinc-400">{content.length}/500</p>

            <button
              onClick={handleCreatePost}
              disabled={posting || !content.trim()}
              className="rounded-xl bg-purple-500 px-5 py-2 font-medium text-white transition hover:bg-purple-600 disabled:opacity-50"
            >
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>

        {/* Posts */}
        {posts.map((post) => (
          <div
            key={post._id}
            className="group relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:border-purple-400/20 hover:bg-white/[0.07]"
          >
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
              <div className="rounded-3xl border border-white/5 bg-black/20 p-5">
                <p
                  style={{
                    whiteSpace: "break-spaces",
                  }}
                  className="overflow-hidden text-sm leading-relaxed wrap-break-word whitespace-pre-wrap text-zinc-200 sm:text-base"
                >
                  {post.content}
                </p>
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
                  onClick={() => handleToggleComments(post._id)}
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

              {showComments[post._id] && (
                <div className="mt-6 rounded-4xl border border-white/10 bg-white/3 p-4 backdrop-blur-2xl sm:p-5">
                  {/* Comment Input */}
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      value={commentInputs[post._id] || ""}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({
                          ...prev,

                          [post._id]: e.target.value,
                        }))
                      }
                      placeholder="Write a comment..."
                      className="flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white transition-all duration-300 outline-none placeholder:text-zinc-500 focus:border-fuchsia-400/20 focus:bg-white/3 focus:shadow-[0_0_30px_rgba(217,70,239,0.12)] sm:text-base"
                    />

                    <button
                      onClick={() => handleCreateComment(post._id)}
                      className="group relative overflow-hidden rounded-2xl bg-linear-to-r from-purple-600 to-fuchsia-600 px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(217,70,239,0.25)] active:scale-[0.98]"
                    >
                      <span className="relative z-10">Post</span>

                      <div className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
                    </button>
                  </div>

                  {/* Comments */}
                  <div className="mt-5 flex flex-col gap-4">
                    {commentsMap[post._id]?.length > 0 ? (
                      commentsMap[post._id]?.map((comment) => (
                        <div
                          key={comment._id}
                          className="group/comment relative overflow-hidden rounded-3xl border border-white/10 bg-black/20 p-4 transition-all duration-300 hover:border-fuchsia-400/10 hover:bg-white/3"
                        >
                          {/* Glow */}
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,70,239,0.08),transparent_40%)] opacity-0 transition-opacity duration-300 group-hover/comment:opacity-100" />

                          <div className="relative flex items-start justify-between gap-4">
                            {/* Left */}
                            <div className="flex min-w-0 flex-1 gap-3">
                              {/* Avatar */}
                              <div className="relative shrink-0">
                                <div className="absolute inset-0 rounded-full bg-fuchsia-500/20 blur-xl" />

                                <img
                                  src={comment.owner.profileImage}
                                  alt={comment.owner.username}
                                  className="relative h-10 w-10 rounded-full border border-white/10 object-cover sm:h-11 sm:w-11"
                                />
                              </div>

                              {/* Content */}
                              <div className="min-w-0">
                                <h3 className="truncate text-sm font-semibold text-white sm:text-base">
                                  @{comment.owner.username}
                                </h3>

                                <p className="mt-1 text-sm leading-relaxed wrap-break-word text-zinc-300 sm:text-[15px]">
                                  {comment.content}
                                </p>
                              </div>
                            </div>

                            {/* Delete Button */}
                            {user?._id === comment.owner._id && (
                              <button
                                onClick={() =>
                                  handleDeleteComment(comment._id, post._id)
                                }
                                className="shrink-0 rounded-xl border border-transparent p-2 text-zinc-500 transition-all duration-300 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
                              >
                                <IoMdTrash size={17} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-3xl border border-dashed border-white/10 bg-black/10 px-5 py-8 text-center">
                        <p className="text-sm text-zinc-500">
                          No comments yet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
