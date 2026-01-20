import mongoose, { Document, Model, Schema } from "mongoose";
import { JwtPayload } from "jsonwebtoken";

export interface IUser {
  username: string;
  email: string;
  password: string;
  bio?: string;
  profileImage?: string;
  posts: mongoose.Types.ObjectId;
  followers: mongoose.Types.ObjectId;
  following: mongoose.Types.ObjectId;
  refreshToken?: String | undefined;
}

export interface IUserMethods {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface IUserDocument extends IUser, Document, IUserMethods {}

export interface AccessTokenPayload extends JwtPayload {
  _id: string;
  user: string;
  email: string;
}
