import api from "../lib/axios";

export const getMyFollowers = async () => {
  const response = await api.get("/users/get-followers", {
    withCredentials: true,
  });
  return response.data.data.followers;
};
