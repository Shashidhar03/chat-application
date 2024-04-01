import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderID:{
        type: String,
        required: true
    },
    conversationID: {
        type: String,
        required: true
    },
    receiverID:{
        type: String,
        required: true
    },
    message:{
        type: String
    }
});

const Message= mongoose.model('Message', messageSchema);
export default Message;