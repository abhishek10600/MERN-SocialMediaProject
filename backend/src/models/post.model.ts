import mongoose, { Model } from "mongoose";
import { IPostDocument } from "../types/index.js";

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema<IPostDocument, Model<IPostDocument>>(
  {
    content: {
      type: String,
      required: true,
    },
    image: {
      type: mediaSchema,
      required: false,
    },
    video: {
      type: mediaSchema,
      required: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

postSchema.index({
  content: "text",
});

export const Post = mongoose.model<IPostDocument>("Post", postSchema);
