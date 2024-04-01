import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    members: {
        type: Array
    }
});

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;