import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server } from "socket.io";

import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import conversationRouter from './routes/conversationRoutes.js';

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("Database connected successfully");
})
.catch((err) => {
    console.log("Error in database connection", err);
});

const app = express();
const server = app.listen(process.env.PORT, () => {
    console.log("Server is running on port", process.env.PORT);
});

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

const users = [];

io.on('connection', (socket) => {
    // console.log("socked id ",socket.id);
    socket.on('addUser', (userID) => {
        users.push({userID, socketID: socket.id});
        // console.log(users);

    });

    socket.on('sendMessage', ({senderID, receiverID, message}) => {
        const receiver = users.find((user) => user.userID === receiverID);
        const sender= users.find((user) => user.userID === senderID);
        if(receiver)
        {
            // console.log(user);
            io.to(receiver.socketID).to(sender.socketID).emit('getMessage', {
                senderID,
                message
            });

        }
        else{
            console.log("User not found");
        }
        
    });
});

app.use(cors());   //to acess the api from different domain
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users",userRouter);
app.use("/messages",messageRouter);
app.use("/conversations",conversationRouter);

