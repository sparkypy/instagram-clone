import { useEffect, useState, useRef } from "react";
import { PostCard } from "../../components/ui/PostCard";
import { CommentsModal } from "../../components/ui/CommentsModal";
import { getFeedPosts, createPost } from "../../services/postService";
import { errorPageStyles, loadingPageStyles } from "../../styles/classes";
import { usePosts } from "../../hooks/usePosts";

export const Feed = () => {
  const {
    posts,
    setPosts,
    addPost,
    handleLike,
    handleCommentAdded,
    handleCommentDeleted,
  } = usePosts();

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const selectedPost = posts.find((post) => post._id === selectedPostId);
  const [selectedImage, setSelectedImage] = useState(null);

  const openComments = (post) => {
    setSelectedPostId(post._id);
    setIsCommentsOpen(true);
  };

  const closeComments = () => {
    setIsCommentsOpen(false);
    setSelectedPostId(null);
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
    if (!content.trim() && !selectedImage) return;
    try {
      setPosting(true);
      const normalizedContent = content.replace(/[ \t]+/g, " ").trim();

      const formData = new FormData();
      formData.append("content", normalizedContent);

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const data = await createPost(formData);
      addPost(data.post);
      setContent("");
      setSelectedImage(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      fileInputRef.current.value = "";
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
    <>
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
              <p className="text-lg font-semibold text-zinc-200">
                No posts yet.
              </p>

              <p className="mt-2 text-sm text-zinc-500">
                Once people start posting, their content will appear here.
              </p>
            </div>
          )}

          {/* text area */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl">
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

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                setSelectedImage(e.target.files[0]);
              }}
              className="mt-4 text-sm text-zinc-400"
            />

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-zinc-400">{content.length}/500</p>

              <button
                onClick={handleCreatePost}
                disabled={posting || (!content.trim() && !selectedImage)}
                className="rounded-xl bg-purple-500 px-5 py-2 font-medium text-white transition hover:bg-purple-600 disabled:opacity-50"
              >
                {posting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>

          {/* Posts */}
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              handleLike={handleLike}
              openComments={openComments}
            />
          ))}
        </div>
      </div>
      <CommentsModal
        post={selectedPost}
        isOpen={isCommentsOpen}
        onClose={closeComments}
        onCommentAdd={handleCommentAdded}
        onCommentDelete={handleCommentDeleted}
        handleLike={handleLike}
      />
    </>
  );
};
