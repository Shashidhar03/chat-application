import express from "express";

import { signup, login, getAllUsers, getUser } from "../controllers/userController.js";

const userRouter =express.Router();

userRouter.post("/signup",signup);
userRouter.post("/login",login);
userRouter.get("/",getAllUsers);
userRouter.get("/find/:userID",getUser);

export default userRouter;