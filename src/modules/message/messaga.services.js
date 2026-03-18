import { NotFoundException } from "../../common/utils/index.js";
import {
  createOne,
  find,
  findOne,
  findOneAndDelete,
} from "../../DB/DB.repositry.js";
import { messageModel } from "../../DB/model/message.model.js";
import { usermodel } from "../../DB/model/user.model.js";

export const sendMessage = async (
  recieverId,
  { content = " " } = {},
  files,
  user
) => {
  console.log("hello");
  const account = await findOne({
    model: usermodel,
    filter: {
      _id: recieverId,
      confirmEmail: { $exists: true },
    },
  });
  if (!account) {
    throw NotFoundException({ message: "fail to find the receiver account" });
  }
  const message = await createOne({
    model: messageModel,
    data: {
      content,
      recieverId,
      attachments: files?.map((file) => file.finalPath) || [],
      senderId: user ? user._id : undefined,
    },
  });
  return message;
};

export const getMessage = async (messageId, user) => {
  const message = await findOne({
    model: messageModel,
    filter: {
      _id: messageId,
      $or: [{ senderId: user._id }, { recieverId: user._id }],
    },
    select: "-senderId",
  });
  if (!message) {
    throw NotFoundException({
      message: "invalid message or onvalid authrizing",
    });
  }
  return message;
};

export const getMessages = async (user) => {
  const messages = await find({
    model: messageModel,
    filter: {
      $or: [{ senderId: user._id }, { recieverId: user._id }],
    },
    select: "-senderId",
  });
  if (!messages.length) {
    throw NotFoundException({ message: "you don't have any message" });
  }
  return messages;
};

export const deleteMessage = async (messageId, user) => {
  const message = await findOneAndDelete({
    model: messageModel,
    filter: {
      _id: messageId,
      recieverId: user._id,
    },
    select: "-senderId",
  });
  if (!message) {
    throw NotFoundException({
      message: "invalid message or onvalid authrizing",
    });
  }
  return message;
};
