import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { sendMessageValidator, getMessagesValidator } from "../validators/message.validator.js";
import { sendMessage, getMessages } from "../controllers/message.controller.js";

const messageRouter = Router();

/**
 * @description send a message in a workspace
 * @route POST /api/message/:workspaceId
 * @access Private
 */
messageRouter.post("/:workspaceId", authMiddleware, sendMessageValidator, sendMessage);

/**
 * @description get messages for a workspace
 * @route GET /api/message/:workspaceId
 * @access Private
 */
messageRouter.get("/:workspaceId", authMiddleware, getMessagesValidator, getMessages);

export default messageRouter;
