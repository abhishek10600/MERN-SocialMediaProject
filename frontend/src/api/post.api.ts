import api from "../lib/axios";

export const createPost = async (formData: FormData) => {
  const response = await api.post("/posts/create-post", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};

export const deletePost = async (postId: string) => {
  const response = await api.delete(`posts/delete-post/${postId}`);
  return response.data;
};

export const getUserPostById = async (postId: string) => {
  const response = await api.get(`posts/user/${postId}`);
  return response.data.data;
};

export const updatePostContent = async (postId: string, content: string) => {
  const response = await api.patch(`/posts/update-post-content/${postId}`, {
    content,
  });

  return response.data.data;
};

export const getPostById = async (postId: string) => {
  const response = await api.get(`/posts/${postId}`);
  return response.data.data;
};

export const searchPosts = async (query: string) => {
  const response = await api.get(`posts/search/post?query=${query}`);
  return response.data.data;
};
