import api from "../lib/axios";
import type { RegisterUserFormData } from "../schemas/auth.schema";
import { backendUrl } from "../utils/constants";

export const registerUser = async (data: RegisterUserFormData) => {
  console.log({ backendUrl });
  const formData = new FormData();

  formData.append("username", data.username);
  formData.append("email", data.email);
  formData.append("password", data.password);

  if (data.profileImage && data.profileImage.length > 0) {
    formData.append("profileImage", data.profileImage[0]);
  }

  const response = await api.post("/users/register", formData, {
    headers: {
      "Content-Type": "multipart/formdata",
    },
  });

  return response.data;
};
