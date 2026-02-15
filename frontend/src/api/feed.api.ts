import api from "../lib/axios";

export const getFeedPosts = async () => {
  const response = await api.get("posts/all-posts");
  return response.data.data;
};

export const searchUsers = async (query: string) => {
  const response = await api.get(`users/search?query=${query}`);
  return response.data.data;
};
