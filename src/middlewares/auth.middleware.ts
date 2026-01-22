import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { AccessTokenPayload } from "../types";

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "unauthorized request");
    }

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as AccessTokenPayload;

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken -posts"
    );

    if (!user) {
      throw new ApiError(401, "invalid access token");
    }
    console.log(user);
    req.user = user;
    next();
  } catch (error: unknown) {
    console.error("Error: ", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: [],
    });
  }
};

