import mongoose, { Model } from "mongoose";
import { IConversationDocument } from "../types/index.js";

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

conversationSchema.pre("save", function () {
  this.participants.sort((a: any, b: any) =>
    a.toString().localeCompare(b.toString())
  );
});

export const Conversation = mongoose.model<IConversationDocument>(
  "Conversation",
  conversationSchema
);
