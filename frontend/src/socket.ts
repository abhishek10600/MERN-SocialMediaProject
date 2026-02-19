import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (userId: string) => {
  if (socket?.connected) {
    return socket;
  }

  socket = io("http://localhost:4000", {
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
