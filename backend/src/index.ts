import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
dotenv.config({
  path: "./.env",
});
import http from "http";
import { Server } from "socket.io";
import { connectRedis } from "./config/redis.js";

const port = process.env.PORT || 4001;

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  const userId = socket.handshake.query.userId as string;

  if (userId) {
    socket.join(`user:${userId}`);
    console.log("User joined personal room:", `user:${userId}`);
    console.log("Rooms:", Array.from(socket.rooms));
  }

  socket.on("join_conversation", (conversationId: string) => {
    socket.join(conversationId);
    console.log(`User joined conversation: ${conversationId}`);
  });

  socket.on("leave_conversation", (conversationId: string) => {
    socket.leave(conversationId);
    console.log(`Left room: ${conversationId}`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: `, socket.id);
  });
});

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Startup error:", error);
    process.exit(1);
  }
};

startServer();
