import { api } from "../lib/axios";

export const followUser = async (userId) => {
  const response = await api.post(`/api/follows/${userId}`);
  return response.data;
};

export const unfollowUser = async (userId) => {
  const response = await api.delete(`/api/follows/${userId}`);
  return response.data;
};
