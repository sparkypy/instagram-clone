import { api } from "../lib/axios";

export const getFeedPosts = async () => {
  const response = await api.get("/api/posts/feed");
  return response.data;
};

export const createPost = async (formData) => {
  // Let the browser set the correct multipart boundary header for FormData
  const response = await api.post("/api/posts", formData);
  return response.data;
};
