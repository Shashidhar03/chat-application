import express from "express";
import { sendMessage,getMessages } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.post("/send",sendMessage);
messageRouter.get("/getmsg",getMessages);

export default messageRouter;