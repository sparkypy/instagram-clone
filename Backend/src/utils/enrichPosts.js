import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";

const enrichPost = async (post, userId) => {
  const likesCount = await Like.countDocuments({
    post: post._id,
  });

  const commentsCount = await Comment.countDocuments({
    post: post._id,
  });

  const isLiked = !!(await Like.findOne({
    user: userId,
    post: post._id,
  }));
  return {
    ...post.toObject(),
    isLiked,
    likesCount,
    commentsCount,
  };
};

export { enrichPost };
