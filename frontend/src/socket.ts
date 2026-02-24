import { io, Socket } from "socket.io-client";
import { socketUrl } from "./utils/constants";

let socket: Socket | null = null;

export const connectSocket = (userId: string) => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(socketUrl, {
    withCredentials: true,
    query: {
      userId,
    },
    transports: ["websocket"],
  });

  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
