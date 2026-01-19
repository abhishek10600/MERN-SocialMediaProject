import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  bio?: string;
  profileImage?: string;
  posts: mongoose.Types.ObjectId;
  refreshToken?: String;
}

export interface IUserMethods {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface IUserDocument extends IUser, Document, IUserMethods {}
