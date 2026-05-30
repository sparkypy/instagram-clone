import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile } from "../../services/userService";
import { followUser, unfollowUser } from "../../services/followService";
import { loadingPageStyles, errorPageStyles } from "../../styles/classes";
import { PostModal } from "../../components/ui/PostModal";
import clsx from "clsx";

export const Profile = () => {
  const { showToast } = useOutletContext();

  const { user } = useAuth();

  const { username } = useParams();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  const [selectedPost, setSelectedPost] = useState(null);
  const [isPostOpen, setIsPostOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [followLoading, setFollowLoading] = useState(false);

  const statsCardStyles = `
  h-16
  w-28
  md:h-18
  lg:h-20
  rounded-xl
  border border-white/10
  bg-white/5
  flex
  flex-col
  items-center
  justify-center
  text-center
  backdrop-blur-xl
  transition-all
  duration-300
  hover:bg-white/10
`;

  const openPost = (post) => {
    setSelectedPost(post);
    setIsPostOpen(true);
  };

  const handleClosePost = () => {
    console.log("closing");
    setIsPostOpen(false);
  };

  const handleFollowToggle = async () => {
    try {
      setFollowLoading(true);

      if (profile.isFollowing) {
        await unfollowUser(profile._id);

        setProfile((prev) => ({
          ...prev,
          isFollowing: false,
          followerCount: prev.followerCount - 1,
        }));
      } else {
        await followUser(profile._id);

        setProfile((prev) => ({
          ...prev,
          isFollowing: true,
          followerCount: prev.followerCount + 1,
        }));
      }
    } catch (err) {
      console.log(err);

      showToast({
        type: "error",
        heading: "Action couldn't complete",
        message:
          err?.response?.data?.message || "Something unexpected happened",
      });
    } finally {
      setFollowLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const data = await getUserProfile(username);
      setProfile(data.user);
      setPosts(data.posts);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className={loadingPageStyles}>Loading profile...</div>
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

  const isOwnProfile = user?._id === profile._id;

  return (
    <div className="relative w-full overflow-hidden rounded-4xl px-4 py-8 sm:px-6 lg:px-10">
      {/* Glow Effects */}
      <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-purple-700/20 blur-3xl" />

      <div className="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6">
        {/* HERO CARD */}
        <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-2xl sm:p-4 lg:p-8">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.18),transparent_35%)]" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            {/* LEFT */}
            <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:text-left">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-2xl" />

                <img
                  src={profile.profileImage}
                  alt={profile.username}
                  className="relative h-28 w-28 rounded-full border-4 border-white/10 object-cover object-center md:h-36 md:w-36"
                />
              </div>

              {/* User Info */}
              <div className="space-y-2 lg:space-y-4">
                <div>
                  <h1 className="bg-linear-to-r from-purple-200 to-fuchsia-400 bg-clip-text text-2xl leading-normal font-black text-transparent md:text-3xl lg:text-4xl">
                    @{profile.username}
                  </h1>

                  <p className="text-sm text-zinc-500">
                    Joined {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <p className="max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
                  {profile.bio || "No bio yet."}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-center gap-5">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 md:flex md:flex-row md:gap-4">
                {/* Followers */}
                <div className={statsCardStyles}>
                  <p className="text-lg font-bold text-white lg:text-xl">
                    {profile.followerCount}
                  </p>

                  <p className="lg:mt-1 text-xs tracking-wider text-zinc-400 uppercase lg:tracking-widest">
                    Followers
                  </p>
                </div>

                {/* Following */}
                <div className={statsCardStyles}>
                  <p className="text-lg font-bold text-white lg:text-xl">
                    {profile.followingCount}
                  </p>

                  <p className="lg:mt-1 text-xs tracking-wider text-zinc-400 uppercase lg:tracking-widest">
                    Following
                  </p>
                </div>

                {/* Posts */}
                <div
                  className={clsx(
                    statsCardStyles,
                    "col-span-2 justify-self-center",
                  )}
                >
                  <p className="text-lg font-bold text-white lg:text-xl">
                    {posts.length}
                  </p>

                  <p className="lg:mt-1 text-xs tracking-wider text-zinc-400 uppercase lg:tracking-widest">
                    Posts
                  </p>
                </div>
              </div>

              {/* Follow Button */}
              {!isOwnProfile && (
                <button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={`group relative overflow-hidden rounded-2xl border px-8 py-3 text-sm font-semibold tracking-wide transition-all duration-300 ${
                    profile.isFollowing
                      ? `border-white/10 bg-white/5 text-zinc-200 hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300 `
                      : `border-purple-400/20 bg-linear-to-r from-purple-600 to-fuchsia-600 text-white hover:scale-[1.03] hover:shadow-[0_0_35px_rgba(192,132,252,0.35)] `
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <span className="relative z-10">
                    {followLoading
                      ? "Please wait..."
                      : profile.isFollowing
                        ? "Following"
                        : "Follow"}
                  </span>

                  {!profile.isFollowing && (
                    <div className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* LOWER GRID */}
        <div className="mt-2">
          {/* ACTIVITY */}
          <div className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-2xl lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Posts</h2>

                <p className="text-sm text-zinc-500">
                  {posts.length} published posts
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              {posts.length === 0 ? (
                <div className="flex h-60 items-center justify-center rounded-4xl border border-dashed border-white/10">
                  <div className="text-center">
                    <h3 className="text-lg text-white">No posts yet</h3>

                    <p className="mt-2 text-zinc-500">
                      This user hasn't shared anything yet.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {posts.map((post) => (
                    <button
                      key={post._id}
                      onClick={() => openPost(post)}
                      className="group relative aspect-square overflow-hidden rounded-3xl border border-white/10"
                    >
                      {post.image ? (
                        <div className="h-full w-full">
                          <img
                            src={post.image}
                            alt="post"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/90 to-transparent p-3">
                            <p className="line-clamp-2 text-xs text-white">
                              {post.content}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex h-full flex-col justify-center bg-linear-to-br from-purple-500/10 to-fuchsia-500/10 p-5">
                          <p className="line-clamp-4 text-sm text-zinc-300">
                            {post.content}
                          </p>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/40" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <PostModal
        post={selectedPost}
        isOpen={isPostOpen}
        onClose={handleClosePost}
      />
    </div>
  );
};
