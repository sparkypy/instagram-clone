import { api } from "../lib/axios";

export const getFeedPosts = async () => {
  const response = await api.get("/api/posts/feed");
  return response.data;
};

export const createPost = async (formData) => {
  const response = await api.post("/api/posts", formData, {
    headers: {
      "Content-Type": "multipart/fomr-data",
    },
  });
  return response.data;
};
