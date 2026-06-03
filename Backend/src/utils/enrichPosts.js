import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";

const enrichPost = async (post, userId) => {
  const likesCount = await Like.countDocuments({
    post: post._id,
  });

  const commentsCount = await Comment.countDocuments({
    post: post._id,
  });

  let isLiked = false;
  if (userId) {
    const likeExists = await Like.findOne({
      user: userId,
      post: post._id,
    });
    isLiked = !!likeExists;
  }
  return {
    ...post.toObject(),
    isLiked,
    likesCount,
    commentsCount,
  };
};

export { enrichPost };
