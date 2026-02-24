import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { Post } from "../models/post.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { io } from "../index.js";
import { invalidatePostCaches } from "../utils/cache.js";
import { redisClient } from "../config/redis.js";

export const togglePostLike = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { postId } = req.params;

    if (!userId) {
      throw new ApiError(404, "user id not found");
    }

    if (!postId) {
      throw new ApiError(404, "post id not found");
    }

    const post = await Post.findById(postId).populate<{
      owner: {
        _id: mongoose.Types.ObjectId;
        username: string;
      };
    }>("owner", "username");

    if (!post) {
      throw new ApiError(404, "post not found");
    }

    const ownerId = post.owner._id.toString();

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: userId },
      });

      await redisClient.del("home:posts");
      await redisClient.del(`user:posts:${(post.owner as any).username}`);

      return res
        .status(201)
        .json(new ApiResponse(201, null, `you unliked the post`));
    } else {
      await Post.findByIdAndUpdate(postId, {
        $addToSet: { likes: userId },
      });

      await redisClient.del("home:posts");
      await redisClient.del(`user:posts:${(post.owner as any).username}`);

      if (ownerId !== userId.toString()) {
        io.to(`user:${ownerId}`).emit("postLiked", {
          postId,
          likedBy: userId,
          message: "Someone liked your post",
        });

        console.log("Emitted like notification to:", ownerId);
      }
      return res
        .status(201)
        .json(new ApiResponse(201, null, `you liked the post`));
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

export const getUsersWhoLikedPost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId as string;
    const userId = req.user?._id;

    if (!postId) {
      throw new ApiError(404, "post id not found");
    }

    if (!userId) {
      throw new ApiError(404, "user id not found");
    }

    const result = await Post.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(postId),
        },
      },
      {
        $addFields: {
          likes: { $ifNull: ["$likes", []] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "likes",
          foreignField: "_id",
          as: "likedUsers",
        },
      },
      {
        $project: {
          _id: 0,
          likedUsers: {
            $map: {
              input: "$likedUsers",
              as: "user",
              in: {
                _id: "$$user._id",
                username: "$$user.username",
                profileImage: "$$user.profileImage",
              },
            },
          },
        },
      },
    ]);

    if (!result.length) {
      throw new ApiError(404, "post not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, result, "liked users fetched successfully"));
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
