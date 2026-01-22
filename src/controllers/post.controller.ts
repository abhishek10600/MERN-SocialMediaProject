import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { uploadToCloudinary } from "../utils/cloudinary";
import { User } from "../models/user.model";
import { Post } from "../models/post.model";
import { ApiResponse } from "../utils/ApiResponse";

export const createPost = async (req: Request, res: Response) => {
  try {
    let imageLocalPath;
    let image;
    let post;
    if (req.file?.path) {
      imageLocalPath = req.file.path;
      image = await uploadToCloudinary(imageLocalPath);
    }
    const { content } = req.body;
    const userId = req.user?._id;

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "user not found");
    }

    if (image === undefined) {
      post = await Post.create({
        content,
        owner: userId,
      });
    } else {
      post = await Post.create({
        content,
        image: image.url,
        owner: userId,
      });
    }

    return res
      .status(201)
      .json(new ApiResponse(200, post, "post creted successfully"));
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

// here I need to implement the mongodb aggregation pipeline to get the comments
export const getAllPostsForHome = async (req: Request, res: Response) => {
  try {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $unwind: {
          path: "$owner",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          "owner.password": 0,
          "owner.refreshToken": 0,
          "owner.__v": 0,
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "comments",
          foreignField: "_id",
          as: "comments",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "comments.commentedBy",
          foreignField: "_id",
          as: "commentUsers",
        },
      },
      {
        $addFields: {
          comments: {
            $map: {
              input: "$comments",
              as: "comment",
              in: {
                _id: "$$comment._id",
                comment: "$$comment.comment",
                createdAt: "$$comment.createdAt",
                commentedBy: {
                  $let: {
                    vars: {
                      user: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$commentUsers",
                              as: "user",
                              cond: {
                                $eq: ["$$user._id", "$$comment.commentedBy"],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: {
                      _id: "$$user._id",
                      username: "$$user.username",
                      profileImage: "$$user.profileImage",
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          commentsCount: { $size: "$comments" },
        },
      },
      {
        $project: {
          commentUsers: 0,
          __v: 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    console.log(posts);

    return res
      .status(200)
      .json(new ApiResponse(200, posts, "posts fetched successfully"));
  } catch (error) {
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
