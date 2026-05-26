import { api } from "../lib/axios";

export const toggleLike = async (postId) => {
  const response = await api.post(`/api/likes/${postId}`);
  return response.data;
};
