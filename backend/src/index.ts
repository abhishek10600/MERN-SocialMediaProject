import app from "./app";
import dotenv from "dotenv";
import connectDB from "./config/db";
dotenv.config({
  path: "./.env",
});
import http from "http";
import { Server } from "socket.io";

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

// connectDB()
// .then(() => {
//   server = app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
//   });
//   server.on("error", (error) => {
//     console.error("Server Error: ", error);
//     process.exit(1);
//   });
// })
// .catch((error) => {
//   console.error(`MongoDB connection failed: `, error);
// });

connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed: ", error);
  });
