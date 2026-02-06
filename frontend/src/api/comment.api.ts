import api from "../lib/axios";

export const getCommentsByPostId = async (postId: string) => {
  const response = await api.get(`comments/all/${postId}`);
  return response.data.data;
};

export const createComment = async (postId: string, comment: string) => {
  const response = await api.post(`/comments/create-comment/${postId}`, {
    comment,
  });
  return response.data.data;
};

export const deleteComment = async (postId: string, commentId: string) => {
  const response = await api.delete(
    `/comments/delete-comment/post/${postId}/comment/${commentId}`,
  );
  return response.data;
};
