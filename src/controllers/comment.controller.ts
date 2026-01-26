import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { Post } from "../models/post.model";
import { Comment } from "../models/comment.model";
import { ApiResponse } from "../utils/ApiResponse";

export const createComment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { postId } = req.params;
    const { comment } = req.body;

    if (!userId) {
      return new ApiError(404, "user id not found");
    }

    if (!postId) {
      return new ApiError(404, "postId not found");
    }

    if (!comment || comment === "") {
      throw new ApiError(404, "comment is required");
    }

    const post = await Post.findById(postId);

    if (!post) {
      throw new ApiError(404, "post not found");
    }

    const createdComment = await Comment.create({
      comment,
      post: postId,
      commentedBy: userId,
    });

    post.comments.push(createdComment._id);
    await post.save({ validateBeforeSave: false });

    return res
      .status(201)
      .json(
        new ApiResponse(201, createdComment, "comment created successfully")
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

export const getCommentsByPostId = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({
      post: postId,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, comments, "comments fetched successfully"));
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

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { postId, commentId } = req.params;

    if (!userId) {
      throw new ApiError(404, "user id not found");
    }

    if (!commentId) {
      throw new ApiError(404, "comment id not found");
    }

    const post = await Post.findById(postId);

    if (!post) {
      throw new ApiError(404, "post not found");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new ApiError(404, "comment not found");
    }

    if (!comment.post.equals(post._id)) {
      throw new ApiError(400, "comment does not belong to this post");
    }

    const isPostOwner = post.owner.equals(userId);
    const isCommentOwner = comment.commentedBy.equals(userId);

    if (!isPostOwner && !isCommentOwner) {
      throw new ApiError(401, "you are not authorized to perform this action");
    }

    await Comment.findByIdAndDelete(commentId);

    await Post.findByIdAndUpdate(postId, {
      $pull: { comments: commentId },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "comment deleted successfully"));
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
