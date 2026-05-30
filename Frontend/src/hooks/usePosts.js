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

  const handleCommentAdded = (postId) => {
    updatePost(postId, (post) => {
      return {
        ...post,
        commentsCount: post.commentsCount + 1,
      };
    });
  };

  const handleCommentDeleted = (postId) => {
    updatePost(postId, (post) => {
      return {
        ...post,
        commentsCount: Math.max(0, post.commentsCount - 1),
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

          likesCount: data.liked ? post.likesCount + 1 : post.likesCount - 1,
        };
      });
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
