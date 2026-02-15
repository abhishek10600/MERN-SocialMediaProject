import api from "../lib/axios";

export const getUserConversations = async () => {
  const response = await api.get("/chats/conversations");
  return response.data.data;
};

export const getOrCreateConversation = async (receiverId: string) => {
  const response = await api.post("/chats/conversation", { receiverId });
  return response.data.data;
};

export const getMessages = async (conversationId: string) => {
  const response = await api.get(`/chats/messages/${conversationId}`);
  return response.data.data;
};

export const sendMessage = async (data: FormData) => {
  const response = await api.post(`/chats/message`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
};

export const markSeen = async (conversationId: string) => {
  const response = await api.patch(`/chats/seen/${conversationId}`);
  return response.data.data;
};
