import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log(`${process.env.MONGO_URI}`);
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}`
    );
    console.log(
      `\n MongoDB connected successfully!! DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB connection Error: ", error);
    process.exit(1);
  }
};

export default connectDB;
