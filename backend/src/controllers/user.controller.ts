import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { uploadToCloudinary, removeFromCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { AccessTokenPayload } from "../types";
import fs from "fs";
import { upload } from "../middlewares/multer.middleware";
import mongoose from "mongoose";

export const registerUser = async (req: Request, res: Response) => {
  try {
    let profileImageLocalPath;
    let profileImageUrl;
    if (req.file?.path) {
      profileImageLocalPath = req.file.path;
      const cloudinaryResult = await uploadToCloudinary(profileImageLocalPath);
      if (cloudinaryResult?.url) {
        profileImageUrl = cloudinaryResult.url;
      }
    }
    const { username, email, password } = req.body;

    if (!username || username === "") {
      throw new ApiError(400, "username is required");
    }

    if (!email || email === "") {
      throw new ApiError(400, "email is required");
    }

    if (!email.includes("@")) {
      throw new ApiError(400, "invalid email");
    }

    if (!password || password === "") {
      throw new ApiError(400, "passowrd is required");
    }

    let existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ApiError(
        409,
        "User with this email or username already exists."
      );
    }

    let user;
    if (profileImageUrl) {
      user = await User.create({
        username,
        email,
        password,
        profileImage: profileImageUrl,
      });
    } else {
      user = await User.create({
        username,
        email,
        password,
      });
    }

    const createdUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while creating the user");
    }

    const accessToken = createdUser.generateAccessToken();
    const refreshToken = createdUser.generateRefreshToken();

    createdUser.refreshToken = refreshToken;
    await createdUser.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(createdUser._id).select(
      "-password -refreshToken"
    );

    const cookiesOptions = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(201)
      .cookie("accessToken", accessToken, cookiesOptions)
      .cookie("refreshToken", refreshToken, cookiesOptions)
      .json(
        new ApiResponse(
          201,
          {
            success: true,
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User registered successfully"
        )
      );
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

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username && !email) {
      throw new ApiError(400, "username or email is required");
    }

    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      throw new ApiError(404, "user not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "invalid credentails");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const cookiesOptions = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookiesOptions)
      .cookie("refreshToken", refreshToken, cookiesOptions)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "user loggedin successfully"
        )
      );
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

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(500, "Something went wrong while logout");
    }
    // user.refreshToken = undefined;
    // user.save();
    await User.findByIdAndUpdate(
      userId,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json(new ApiResponse(200, null, "user logged out successfully"));
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

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    return res
      .status(200)
      .json(new ApiResponse(200, user, "current user fetched successfully"));
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

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const incomingRefreshTOken =
      req.cookies?.refreshToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!incomingRefreshTOken) {
      throw new ApiError(401, "unauthorized request");
    }

    const decodedToken = jwt.verify(
      incomingRefreshTOken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as AccessTokenPayload;

    const userId = decodedToken?._id;

    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(401, "invalid refresh token");
    }

    if (incomingRefreshTOken !== user?.refreshToken) {
      throw new ApiError(401, "refresh token invalid or expired");
    }

    const newRefreshToken = user.generateRefreshToken();
    const newAccessToken = user.generateAccessToken();

    user.refreshToken = newRefreshToken;
    user.save({ validateBeforeSave: false });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(201)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .cookie("accessToken", newAccessToken, cookieOptions)
      .json(
        new ApiResponse(
          201,
          {
            refreshToken: newRefreshToken,
            accessToken: newAccessToken,
          },
          "refresh token successfully created"
        )
      );
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

export const changeCurrentPassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      throw new ApiError(
        400,
        "new password and confirm new password do not match"
      );
    }

    const userId = req.user?._id;
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(401, "unauthorized request");
    }

    const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isOldPasswordCorrect) {
      throw new ApiError(401, "Your old password is not correct");
    }

    user.password = newPassword;
    user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "password successfully changed"));
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

export const addBio = async (req: Request, res: Response) => {
  try {
    const { bio } = req.body;

    if (!bio || bio === "") {
      throw new ApiError(400, "bio cannot be empty");
    }

    const userId = req.user?._id;
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(401, "user not found");
    }
    user.bio = bio.trim();
    user.save({ validateBeforeSave: false });

    return res
      .status(201)
      .json(new ApiResponse(201, null, "bio added successfully"));
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

export const updateBio = async (req: Request, res: Response) => {
  try {
    const { updatedBio } = req.body;
    if (!updatedBio || updatedBio === "") {
      throw new ApiError(400, "updated bio cannot be empty");
    }
    const userId = req.user?._id;
    await User.findByIdAndUpdate(
      userId,
      {
        $set: { bio: updatedBio },
      },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, null, "bio updated successfull"));
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

export const updateProfileImage = async (req: Request, res: Response) => {
  try {
    let profileImagePath = req.file?.path;
    if (!profileImagePath) {
      throw new ApiError(400, "profile image is required");
    }

    const userId = req.user?._id;
    if (!userId) {
      fs.unlinkSync(profileImagePath);
      throw new ApiError(500, "no user id found");
    }

    const user = await User.findById(userId);
    if (!user) {
      fs.unlinkSync(profileImagePath);
      throw new ApiError(404, "user not found");
    }

    if (!user.profileImage) {
      const profileImage = await uploadToCloudinary(profileImagePath);
      user.profileImage = profileImage?.url;
      user.save({ validateBeforeSave: false });
      return res
        .status(200)
        .json(new ApiResponse(200, null, "profile image added successfully"));
    } else {
      const oldProfileImageUrl = user.profileImage;
      await removeFromCloudinary(oldProfileImageUrl);
      const newProfileImage = await uploadToCloudinary(profileImagePath);
      user.profileImage = newProfileImage?.url;
      user.save({ validateBeforeSave: false });
      return res
        .status(201)
        .json(new ApiResponse(200, null, "profile image updated successfully"));
    }
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

// create controller to get user profile details. It should contain posts, followers and followings
// Here I need to use mongodb populate
export const getUserProfileData = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    if (!username) {
      throw new ApiError(404, "usernamenot found");
    }

    const profileData = await User.aggregate([
      {
        $match: {
          username: username,
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "owner",
          as: "posts",
        },
      },
      {
        $project: {
          username: 1,
          email: 1,
          bio: 1,
          profileImage: 1,
          postCount: {
            $size: "$posts",
          },
          followersCount: {
            $size: "$followers",
          },
          followingCount: {
            $size: "$following",
          },
        },
      },
    ]);

    if (!profileData.length) {
      throw new ApiError(404, "user not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, profileData[0], "user data fetched successfully")
      );
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

// create controller to follow and unfollow
export const followUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const loggedInUserId = req.user?._id;

    if (!loggedInUserId) {
      throw new ApiError(401, "logged in user id not found");
    }

    // const session = await mongoose.startSession();
    // session.startTransaction();

    // const userToBeFollowed = await User.findOne({ username }).session(session);

    const userToBeFollowed = await User.findOne({ username });

    if (!userToBeFollowed) {
      throw new ApiError(404, "user not found");
    }

    if (userToBeFollowed?._id.equals(loggedInUserId)) {
      throw new ApiError(400, "you cannot follow yourself");
    }

    await User.findByIdAndUpdate(
      userToBeFollowed._id,
      {
        $addToSet: {
          followers: loggedInUserId,
        },
      }
      // { session }
    );

    await User.findByIdAndUpdate(
      loggedInUserId,
      {
        $addToSet: {
          following: userToBeFollowed._id,
        },
      }
      // { session }
    );

    // await session.commitTransaction();
    // session.endSession();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          `you are following ${userToBeFollowed.username} now`
        )
      );
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

export const unfollowUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const loggedInUserId = req.user?._id;

    if (!loggedInUserId) {
      throw new ApiError(404, "logged in user id not found");
    }

    const userToUnfollow = await User.findOne({ username });
    if (!userToUnfollow) {
      throw new ApiError(404, "user not found");
    }

    if (userToUnfollow._id.equals(loggedInUserId)) {
      throw new ApiError(400, "you cannot unfollow yourself");
    }

    await User.findByIdAndUpdate(userToUnfollow._id, {
      $pull: {
        followers: loggedInUserId,
      },
    });

    await User.findByIdAndUpdate(loggedInUserId, {
      $pull: {
        following: userToUnfollow._id,
      },
    });

    res
      .status(200)
      .json(
        new ApiResponse(200, null, `you unfollowed ${userToUnfollow.username}`)
      );
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
