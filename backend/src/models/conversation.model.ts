import mongoose, { Model } from "mongoose";
import { IConversationDocument } from "../types";

const conversationSchema = new mongoose.Schema<
  IConversationDocument,
  Model<IConversationDocument>
>(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ participants: 1 }, { unique: true });

export const Conversation = mongoose.model<IConversationDocument>(
  "Conversation",
  conversationSchema
);
