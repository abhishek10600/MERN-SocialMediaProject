import api from "../lib/axios";

export const getUserProfileInfo = async (username: string) => {
  const response = await api.get(`users/get-user-profile-data/${username}`);
  return response.data.data;
};

export const getUserProfilePosts = async (username: string) => {
  const response = await api.get(`posts/user-posts/${username}`);
  return response.data.data;
};

export const followUser = async (username: string) => {
  const response = await api.post(`users/follow/${username}`);
  return response.data;
};

export const unfollowUser = async (username: string) => {
  const response = await api.post(`users/unfollow/${username}`);
  return response.data;
};

export const updateProfileImage = async (formData: FormData) => {
  const response = await api.patch("users/update-profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const addBio = async (bio: string) => {
  const response = await api.post("/users/add-bio", { bio });
  return response.data;
};

export const updateBio = async (updatedBio: string) => {
  const response = await api.patch("/users/update-bio", { updatedBio });
  return response.data;
};
