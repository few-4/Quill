import Message from "../models/message.model.js";

export const createMessage = async (workspaceId, senderId, content) => {
  const message = await Message.create({ workspaceId, senderId, content });

  const populated = await Message.findById(message._id)
    .populate("senderId", "username email")
    .lean();

  return populated;
};

export const getMessagesByWorkspace = async (workspaceId, limit = 50, before = null) => {
  const query = { workspaceId };

  if (before) {
    query._id = { $lt: before };
  }

  const messages = await Message.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("senderId", "username email")
    .lean();

  return messages.reverse();
};

export const getMessageById = async (messageId) => {
  return await Message.findById(messageId);
};

export const updateMessage = async (messageId, content) => {
  await Message.findByIdAndUpdate(messageId, { content });
  return await Message.findById(messageId)
    .populate("senderId", "username email")
    .lean();
};

export const deleteMessage = async (messageId) => {
  return await Message.findByIdAndDelete(messageId);
};
