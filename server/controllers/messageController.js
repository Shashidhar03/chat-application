import Message from "../models/messageModel.js";

const sendMessage = async (req, res) => {
    try {
        const { senderID, receiverID, conversationID, message } = req.body;
        const newMessage = new Message({     //new msg is created in db
            senderID,
            receiverID,
            conversationID,
            message
        });
        await newMessage.save();
        res.status(201).json("Message sent successfully");
    }
    catch (error) {
        res.status(500).json(error);
    }
}


const getMessages = async (req, res) => {
    const { senderID, convoID,receiverID } = req.query;
    try {
        const messages = await Message.find({   //finds all the messages between sender and receiver
            $or: [
                { $and: [{ senderID: senderID }, { receiverID: receiverID }] },
                { $and: [{ senderID: receiverID }, { receiverID: senderID }] }
            ]
        });
        console.log(messages);
        const messageArray = messages.map((message) => {
            return {message: message.message, senderID: message.senderID, conversationID: message.conversationID}
        });
        console.log(typeof messageArray);
        res.status(200).json(messageArray);
    }
    catch (error) {
        res.status(500).json(error);
    }
}

export { sendMessage, getMessages};