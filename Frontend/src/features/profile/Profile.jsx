/*
This is just a dummy Profile.
There are tons of ammendments to be done.
*/

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";

export const Profile = () => {
  const { user } = useAuth();
  const { username } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      const data = await getUserProfile(username);
      setProfile(data.user);
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
        <div className="animate-pulse text-lg text-zinc-300">
          Loading profile...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div
          className="
            rounded-2xl
            border border-red-500/20
            bg-red-500/10
            px-6 py-4
            text-sm
            text-red-400
            backdrop-blur-xl
          "
        >
          {error}
        </div>
      </div>
    );
  }

  const isOwnProfile = user?._id === profile._id;

  return (
    <div className="relative w-full overflow-hidden px-4 py-8 sm:px-6 lg:px-10 rounded-4xl">
      {/* Glow Effects */}
      <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-purple-700/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6">
        {/* HERO CARD */}
        <div
          className="
            relative
            overflow-hidden
            rounded-4xl
            border border-white/10
            bg-white/5
            p-5
            shadow-2xl
            backdrop-blur-2xl

            sm:p-8
            lg:p-10
          "
        >
          {/* Top Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.18),transparent_35%)]" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            {/* LEFT */}
            <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:text-left">
              {/* Avatar */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full  blur-2xl" />

                <img
                  src={profile.profileImage}
                  alt={profile.username}
                  className="
                    relative
                    h-28
                    w-28
                    rounded-full
                    border-4
                    border-white/10
                    object-cover
                    object-center

                    sm:h-36
                    sm:w-36
                  "
                />
              </div>

              {/* User Info */}
              <div className="space-y-3">
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

                      sm:text-5xl
                    "
                  >
                    @{profile.username}
                  </h1>

                  <p className="mt-2 text-sm text-zinc-400 sm:text-base">
                    Digital Explorer • Community Member
                  </p>
                </div>

                <p
                  className="
                    max-w-2xl
                    text-sm
                    leading-relaxed
                    text-zinc-300

                    sm:text-base
                  "
                >
                  {profile.bio || "No bio yet."}
                </p>

                {!isOwnProfile && (
                  <button
                    className="
                    mt-5
                    rounded-xl
                  bg-purple-500
                    px-5
                    py-2
                  "
                  >
                    {profile.isFollowing ? "Unfollow" : "Follow"}
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              {/* Followers */}
              <div
                className="
                  min-w-27.5
                  rounded-2xl
                  border border-white/10
                  bg-white/5
                  px-5 py-4
                  text-center
                  backdrop-blur-xl
                "
              >
                <p className="text-2xl font-bold text-white">
                  {profile.followerCount}
                </p>

                <p className="mt-1 text-xs uppercase tracking-widest text-zinc-400">
                  Followers
                </p>
              </div>

              {/* Following */}
              <div
                className="
                  min-w-27.5
                  rounded-2xl
                  border border-white/10
                  bg-white/5
                  px-5 py-4
                  text-center
                  backdrop-blur-xl
                "
              >
                <p className="text-2xl font-bold text-white">
                  {profile.followingCount}
                </p>

                <p className="mt-1 text-xs uppercase tracking-widest text-zinc-400">
                  Following
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* LOWER GRID */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ABOUT */}
          <div
            className="
              rounded-4xl
              border border-white/10
              bg-white/5
              p-6
              shadow-xl
              backdrop-blur-2xl
            "
          >
            <h2 className="text-lg font-bold text-white">About</h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  Username
                </p>

                <p className="mt-1 text-zinc-200">@{profile.username}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  Joined
                </p>

                <p className="mt-1 text-zinc-200">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  Bio
                </p>

                <p className="mt-1 text-zinc-300">
                  {profile.bio || "This user hasn't added a bio yet."}
                </p>
              </div>
            </div>
          </div>

          {/* ACTIVITY */}
          <div
            className="
              rounded-4xl
              border border-white/10
              bg-white/5
              p-6
              shadow-xl
              backdrop-blur-2xl

              lg:col-span-2
            "
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Activity</h2>

              <span
                className="
                  rounded-full
                  border border-purple-500/20
                  bg-purple-500/10
                  px-3 py-1
                  text-xs
                  text-purple-300
                "
              >
                Coming Soon
              </span>
            </div>

            <div
              className="
                mt-6
                flex
                min-h-62.5
                items-center
                justify-center
                rounded-3xl
                border border-dashed border-white/10
                bg-black/20
              "
            >
              <p className="text-center text-sm text-zinc-500">
                User posts, reels, comments and interactions will appear here
                later.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
