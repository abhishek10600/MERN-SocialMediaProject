import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (localFilePath: string) => {
  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log("Cloudinary Error: ", error);
    fs.unlinkSync(localFilePath);
  }
};

export const uploadVideoToCloudinary = async (localFilePath: string) => {
  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "video",
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log("Cloudinary Video Upload Error: ", error);
    fs.unlinkSync(localFilePath);
  }
};

export const removeFromCloudinary = async (
  publicId: string,
  resourceType: "image" | "video"
) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.log("Cloudinary Delete Error:", error);
  }
};
