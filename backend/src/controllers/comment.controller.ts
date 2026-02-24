import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { io } from "../index.js";
import { invalidatePostCaches } from "../utils/cache.js";
import { redisClient } from "../config/redis.js";
import mongoose from "mongoose";

export const createComment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { postId } = req.params;
    const { comment } = req.body;

    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }
    if (!postId) {
      throw new ApiError(400, "postId is required");
    }
    if (!comment?.trim()) {
      throw new ApiError(400, "comment is required");
    }

    const post = await Post.findById(postId).populate<{
      owner: {
        _id: mongoose.Types.ObjectId;
        username: string;
      };
    }>("owner", "username");

    if (!post) throw new ApiError(404, "post not found");

    const createdComment = await Comment.create({
      comment,
      post: postId,
      commentedBy: userId,
    });

    post.comments.push(createdComment._id);
    await post.save({ validateBeforeSave: false });

    const populatedComment = await createdComment.populate<{
      commentedBy: {
        _id: string;
        username: string;
        profileImage?: string;
      };
    }>("commentedBy", "username profileImage");

    console.log({ populatedComment });

    const populatedPost = await post.populate<{
      owner: { username: string };
    }>("owner", "username");

    // await invalidatePostCaches(populatedPost.owner.username);
    await redisClient.del("home:posts");
    await redisClient.del(
      `user:posts:${(populatedPost.owner as any).username}`
    );

    const ownerId = post.owner._id.toString();

    if (ownerId !== userId.toString()) {
      io.to(`user:${ownerId}`).emit("postCommented", {
        postId,
        commentedBy: {
          _id: userId,
          username: populatedComment.commentedBy?.username,
        },
        message: `${populatedComment.commentedBy?.username} commented on your post`,
      });

      console.log("Emitted comment notification to:", ownerId);
    }

    return res
      .status(201)
      .json(
        new ApiResponse(201, populatedComment, "comment created successfully")
      );
  } catch (error: any) {
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

export const getCommentsByPostId = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate("commentedBy", "username profileImage")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(200, comments, "comments fetched successfully"));
  } catch (error: any) {
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

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { postId, commentId } = req.params;

    if (!userId) throw new ApiError(401, "Unauthorized");

    const post = await Post.findById(postId).populate<{
      owner: {
        _id: mongoose.Types.ObjectId;
        username: string;
      };
    }>("owner", "username");

    if (!post) {
      throw new ApiError(404, "post not found");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new ApiError(404, "comment not found");
    }

    const isPostOwner = post.owner._id.toString() === userId.toString();

    const isCommentOwner = comment.commentedBy.equals(userId);

    if (!isPostOwner && !isCommentOwner) {
      throw new ApiError(403, "Not allowed");
    }

    await Comment.findByIdAndDelete(commentId);

    await Post.findByIdAndUpdate(postId, {
      $pull: { comments: commentId },
    });

    const populatedPost = await post.populate("owner", "username");

    await redisClient.del("home:posts");
    await redisClient.del(
      `user:posts:${(populatedPost.owner as any).username}`
    );

    return res
      .status(200)
      .json(new ApiResponse(200, null, "comment deleted successfully"));
  } catch (error: any) {
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
