import express from "express";

import { addConversation, getConversations } from "../controllers/conversationController.js";

const conversationRouter = express.Router();

conversationRouter.get("/:senderID",getConversations);
conversationRouter.post("/add",addConversation);

export default conversationRouter;