import mongoose, { Model } from "mongoose";
import { IPostDocument } from "../types";

const postSchema = new mongoose.Schema<IPostDocument, Model<IPostDocument>>(
  {
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.model<IPostDocument>("Post", postSchema);
