import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import {
  uploadToCloudinary,
  uploadVideoToCloudinary,
  removeFromCloudinary,
} from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import sanitizeHtml from "sanitize-html";
import mongoose from "mongoose";
import { io } from "../index.js";
import { redisClient } from "../config/redis.js";

export const createPost = async (req: Request, res: Response) => {
  try {
    // let imageLocalPath;
    // let createdPost;
    // if (req.file?.path) {
    //   imageLocalPath = req.file.path;
    //   image = await uploadToCloudinary(imageLocalPath);
    // }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (files["image"] && files["video"]) {
      throw new ApiError(
        400,
        "You can upload either an image or a video, not both"
      );
    }

    let image;
    let videoHlsUrl: string | undefined;
    let videoUrl: string | undefined;

    if (files["image"]?.[0]?.path) {
      image = await uploadToCloudinary(files["image"][0].path);
    }

    let videoResult;

    if (files["video"]?.[0]?.path) {
      videoResult = await uploadVideoToCloudinary(files["video"][0].path);
      console.log(
        "Full Cloudinary video result:",
        JSON.stringify(videoResult, null, 2)
      );
      console.log("Eager array:", videoResult?.eager);
      if (!videoResult) {
        throw new ApiError(500, "Failed to upload video to cloudinary");
      }
      // videoHlsUrl =
      //   videoResult.eager?.[0]?.secure_url ?? videoResult.secure_url;

      videoUrl = videoResult.playback_url ?? videoResult.secure_url;
    }

    const { content } = req.body;
    const userId = req.user?._id;

    // Sanitize HTML from TipTap
    const cleanContent = sanitizeHtml(content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      allowedAttributes: {
        a: ["href", "target", "rel"],
        img: ["src", "alt"],
        span: ["style"],
      },
      allowedStyles: {
        "*": {
          "font-size": [/^\d+(px|em|rem)$/],
        },
      },
    });

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "user not found");
    }

    const createdPost = await Post.create({
      content: cleanContent,
      owner: userId,
      ...(image && {
        image: {
          url: image.secure_url,
          public_id: image.public_id,
        },
      }),
      ...(videoUrl && {
        video: {
          url: videoUrl,
          public_id: videoResult?.public_id,
        },
      }),
    });

    // if (image === undefined) {
    //   createdPost = await Post.create({
    //     content: cleanContent,
    //     owner: userId,
    //   });
    // } else {
    //   createdPost = await Post.create({
    //     content: cleanContent,
    //     image: image.url,
    //     owner: userId,
    //   });
    // }

    const populatedPost = await Post.findById(createdPost._id)
      .populate("owner", "username profileImage")
      .lean();

    if (!populatedPost) {
      throw new ApiError(500, "failed to populate post");
    }

    const formattedPost = {
      ...populatedPost,
      likes: [],
      likeCount: 0,
      commentsCount: 0,
      comments: [],
    };

    io.emit("new_post", formattedPost);

    await redisClient.del("home:posts");
    await redisClient.del(`user:posts:${user.username}`);

    return res
      .status(201)
      .json(new ApiResponse(201, formattedPost, "post creted successfully"));
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

export const getAllPostsForHome = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
    }

    const cacheKey = "home:posts";

    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            JSON.parse(cachedData),
            "posts fetched from cache"
          )
        );
    }

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

      //ONLY NEW PART (LIKES)
      {
        $addFields: {
          commentsCount: { $size: "$comments" },
          likeCount: { $size: "$likes" },
        },
      },

      {
        $project: {
          commentUsers: 0,
          __v: 0,
          // keep likes if frontend needs it
          // remove this line if you want full likes array
          // likes: 1
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    // console.log(posts);

    await redisClient.set(cacheKey, JSON.stringify(posts), {
      EX: 60,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, posts, "posts fetched successfully"));
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

export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    if (!username) {
      throw new ApiError(404, "username not found");
    }

    const cacheKey = `user:posts:${username}`;

    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            JSON.parse(cachedData),
            "user posts fetched from cache"
          )
        );
    }

    const posts = await Post.aggregate([
      //Join owner
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      { $unwind: "$owner" },

      //Match by username
      {
        $match: {
          "owner.username": username,
        },
      },

      //Join comments
      {
        $lookup: {
          from: "comments",
          localField: "comments",
          foreignField: "_id",
          as: "comments",
        },
      },

      //Join comment users
      {
        $lookup: {
          from: "users",
          localField: "comments.commentedBy",
          foreignField: "_id",
          as: "commentUsers",
        },
      },

      // Shape comments
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

      // ensure likes always exists + counts
      {
        $addFields: {
          likes: { $ifNull: ["$likes", []] },
        },
      },
      {
        $addFields: {
          commentCount: { $size: "$comments" },
          likeCount: { $size: "$likes" },
        },
      },

      // Final projection
      {
        $project: {
          content: 1,
          image: 1,
          video: 1,
          createdAt: 1,
          commentCount: 1,
          likeCount: 1,
          likes: 1,
          comments: 1,
          owner: {
            _id: "$owner._id",
            username: "$owner.username",
            profileImage: "$owner.profileImage",
          },
        },
      },

      { $sort: { createdAt: -1 } },
    ]);

    await redisClient.set(cacheKey, JSON.stringify(posts), {
      EX: 60,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, posts, "user posts fetched successfully"));
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

export const getUserPostById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { postId } = req.params;

    if (!userId) {
      throw new ApiError(404, "user id not found");
    }

    if (!postId) {
      throw new ApiError(404, "post id not found");
    }

    // const post = await Post.find({
    //   _id: postId,
    //   owner: userId,
    // })
    //   .populate("owner", "username profileImage")
    //   .populate("comments")
    //   .populate("likes", "username profileImage");

    const post = await Post.findOne({
      _id: postId,
      owner: userId,
    })
      .populate("owner", "username profileImage")
      .populate({
        path: "comments",
        populate: {
          path: "commentedBy",
          select: "username profileImage",
        },
      })
      .populate("likes", "username profileImage")
      .lean();

    if (!post) {
      throw new ApiError(404, "Post not found or you are not the owner");
    }

    const formattedPost = {
      ...post,
      likeCount: post.likes?.length || 0,
      commentCount: post.comments?.length || 0,
    };

    return res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      data: formattedPost,
    });
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

export const getPostById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { postId } = req.params;

    if (!userId) {
      throw new ApiError(404, "user id not found");
    }

    if (!postId) {
      throw new ApiError(404, "post id not found");
    }

    const post = await Post.findById(postId)
      .populate("owner", "username profileImage")
      .populate({
        path: "comments",
        populate: {
          path: "commentedBy",
          select: "username profileImage",
        },
      })
      .populate("likes", "username profileImage")
      .lean();

    if (!post) {
      throw new ApiError(404, "Post not found or you are not the owner");
    }

    const formattedPost = {
      ...post,
      likeCount: post.likes?.length || 0,
      commentCount: post.comments?.length || 0,
    };

    return res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      data: formattedPost,
    });
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

export const updatePostContent = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || content === "") {
      throw new ApiError(400, "content is required and it cannot be empty");
    }

    // console.log({ postId });

    if (!userId) {
      throw new ApiError(404, "user id not found");
    }

    if (!postId) {
      throw new ApiError(404, "post id not found");
    }

    const post = await Post.findById(postId);

    console.log(post);

    if (!post) {
      throw new ApiError(404, "post not found");
    }

    // console.log(post.owner);

    if (!post.owner.equals(userId)) {
      throw new ApiError(401, "you are unauthorized to perform this action");
    }

    post.content = content;
    post.save({ validateBeforeSave: false });

    await redisClient.del("home:posts");
    await redisClient.del(`user:posts:${req.user?.username}`);

    return res
      .status(200)
      .json(new ApiResponse(200, post, "post updated successfully"));
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

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = req.user?._id;

    if (!postId) {
      throw new ApiError(404, "post id not found");
    }

    if (!userId) {
      throw new ApiError(404, "user id not found");
    }

    const post = await Post.findById(postId);
    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    console.log({ postToBeDeleted: post });

    console.log(post.video);
    console.log(post.image);

    if (post.video?.public_id) {
      await removeFromCloudinary(post.video.public_id, "video");
    }

    if (post.image?.public_id) {
      await removeFromCloudinary(post.image.public_id, "image");
    }

    const deletedPost = await Post.findByIdAndDelete({
      _id: postId,
      owner: userId,
    });

    if (!deletedPost) {
      throw new ApiError(401, "you are not authorized to perform this action");
    }

    await redisClient.del("home:posts");
    await redisClient.del(`user:posts:${req.user?.username}`);

    return res
      .status(203)
      .json(new ApiResponse(203, null, "post deleted successfully"));
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

export const searchPosts = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== "string") {
      throw new ApiError(400, "Search query is required");
    }

    const searchText = query.trim();

    const posts = await Post.aggregate([
      {
        $match: {
          $text: {
            $search: searchText,
          },
        },
      },
      {
        $addFields: {
          score: {
            $meta: "textScore",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $unwind: "$owner",
      },
      {
        $lookup: {
          from: "comments",
          localField: "comments",
          foreignField: "_id",
          as: "comments",
        },
      },

      // counts
      {
        $addFields: {
          likeCount: { $size: { $ifNull: ["$likes", []] } },
          commentCount: { $size: { $ifNull: ["$comments", []] } },
        },
      },

      // remove sensitive data
      {
        $project: {
          score: 1,
          content: 1,
          image: 1,
          video: 1,
          createdAt: 1,
          likeCount: 1,
          commentCount: 1,
          likes: 1,
          comments: 1,
          owner: {
            _id: "$owner._id",
            username: "$owner.username",
            profileImage: "$owner.profileImage",
          },
        },
      },

      // best matches first
      {
        $sort: {
          score: -1,
          createdAt: -1,
        },
      },

      {
        $limit: 20,
      },
    ]);

    return res
      .status(200)
      .json(new ApiResponse(200, posts, "posts fetched successfully"));
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
