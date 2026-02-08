import api from "../lib/axios";

export const createPost = async (formData: FormData) => {
  const response = await api.post("/posts/create-post", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};
