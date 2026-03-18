import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      maxLength: 10000,
      minLength: 1,
      required: function () {
        return !this.attachments?.length;
      },
    },
    attachments: { type: [String] },
    recieverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    collection: "sara7a_message",
    timestamps: true,
  }
);

export const messageModel = mongoose.models.message || mongoose.model("message", messageSchema);
