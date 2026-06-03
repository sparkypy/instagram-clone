import { useState } from "react";
import { toggleLike } from "../services/likeService";

export const usePosts = () => {
  const [posts, setPosts] = useState([]);

  const addPost = (post) => {
    setPosts((prevPosts) => [post, ...prevPosts]);
  };

  const updatePost = (postId, updater) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post._id === postId ? updater(post) : post)),
    );
  };

  const handleCommentAdded = (postId, serverCount) => {
    updatePost(postId, (post) => {
      return {
        ...post,
        commentsCount:
          typeof serverCount === "number"
            ? serverCount
            : (post.commentsCount || 0) + 1,
      };
    });
  };

  const handleCommentDeleted = (postId, serverCount) => {
    updatePost(postId, (post) => {
      return {
        ...post,
        commentsCount:
          typeof serverCount === "number"
            ? serverCount
            : Math.max(0, (post.commentsCount || 0) - 1),
      };
    });
  };

  const handleLike = async (postId) => {
    try {
      const data = await toggleLike(postId);

      updatePost(postId, (post) => {
        return {
          ...post,
          isLiked: data.liked,
          // Prefer server-provided count when available to avoid drift
          likesCount:
            typeof data.likesCount === "number"
              ? data.likesCount
              : data.liked
                ? (post.likesCount || 0) + 1
                : Math.max(0, (post.likesCount || 1) - 1),
        };
      });
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  return {
    posts,
    setPosts,
    addPost,
    updatePost,
    handleCommentAdded,
    handleCommentDeleted,
    handleLike,
  };
};
