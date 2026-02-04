import api from "../lib/axios";

export const getUserProfileInfo = async (username: string) => {
  const response = await api.get(`users/get-user-profile-data/${username}`);
  return response.data.data;
};

export const getUserProfilePosts = async (username: string) => {
  const response = await api.get(`posts/user-posts/${username}`);
  return response.data.data;
};
