import { api } from "../lib/axios";

export const getFeedPosts = async () => {
  const response = await api.get("/api/posts/feed");
  return response.data;
};

export const createPost = async (content) => {
  const response = await api.post("/api/posts", { content });
  return response.data;
};
