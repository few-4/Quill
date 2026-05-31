import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { sendMessageValidator, getMessagesValidator, editMessageValidator, deleteMessageValidator } from "../validators/message.validator.js";
import { sendMessage, getMessages, editMessage, deleteMessage } from "../controllers/message.controller.js";

const messageRouter = Router();

messageRouter.post("/:workspaceId", authMiddleware, sendMessageValidator, sendMessage);
messageRouter.get("/:workspaceId", authMiddleware, getMessagesValidator, getMessages);
messageRouter.put("/:messageId", authMiddleware, editMessageValidator, editMessage);
messageRouter.delete("/:messageId", authMiddleware, deleteMessageValidator, deleteMessage);

export default messageRouter;
