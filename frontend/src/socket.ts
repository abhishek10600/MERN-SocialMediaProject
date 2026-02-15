// import { io } from "socket.io-client";

// export const socket = io("http://localhost:4000", {
//   withCredentials: true,
//   autoConnect: true,
// });

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (userId: string) => {
  if (socket) {
    return socket;
  }

  socket = io("http://localhost:4000", {
    withCredentials: true,
    query: {
      userId,
    },
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
