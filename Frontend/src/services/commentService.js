import { api } from "../lib/axios";

export const getPostComments = async (postId) => {
  const response = await api.get(`/api/comments/${postId}`);
  return response.data;
};

export const createComment = async (postId, content) => {
  const response = await api.post(`/api/comments/${postId}`, {
    content,
  });
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await api.delete(`/api/comments/${commentId}`);
  return response.data;
};
