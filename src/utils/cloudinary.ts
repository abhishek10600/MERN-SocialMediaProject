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

export const removeFromCloudinary = async (imageUrl: string) => {
  try {
    const urlArray = imageUrl.split("/");
    const imageNameWithExtension = urlArray[urlArray.length - 1];
    const imageNameArray = imageNameWithExtension.split(".");
    const imageName = imageNameArray[0];

    await cloudinary.uploader.destroy(imageName);
  } catch (error) {
    console.log("Cloudinary Error: ", error);
  }
};
