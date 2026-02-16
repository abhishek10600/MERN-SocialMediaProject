import app from "./app";
import dotenv from "dotenv";
import connectDB from "./config/db";
dotenv.config({
  path: "./.env",
});
import http from "http";
import { Server } from "socket.io";
import { connectRedis } from "./config/redis";

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
    socket.join(userId);
    console.log("User joined personal room: ", userId);
  }

  socket.on("join_conversation", (conversationId) => {
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

connectDB()
  .then(async () => {
    await connectRedis();
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed: ", error);
  });
