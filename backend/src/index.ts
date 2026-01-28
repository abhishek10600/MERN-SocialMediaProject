import app from "./app";
import dotenv from "dotenv";
import connectDB from "./config/db";
dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 4001;

connectDB()
  .then(() => {
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
    server.on("error", (error) => {
      console.error("Server Error: ", error);
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error(`MongoDB connection failed: `, error);
  });
