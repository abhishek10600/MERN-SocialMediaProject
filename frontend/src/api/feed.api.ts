import api from "../lib/axios";

export const getFeedPosts = async () => {
  const response = await api.get("posts/all-posts");
  return response.data.data;
};
