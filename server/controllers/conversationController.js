import Conversation from "../models/conversationModel.js";

const getConversations = async (req, res) => {
    const senderID = req.params.senderID;
    try {
        const conversation = await Conversation.find({
            members: { $in: [senderID] }            //gives all the conversations which includes the senderID is present
        });
        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json(error);
    }
}

const addConversation = async (req, res) => {
    await Conversation.find({members: [req.body.senderID, req.body.receiverID]})
    .then(async (result) => {
        if(result.length === 0){
            const newConversation = new Conversation({
                members: [req.body.senderID, req.body.receiverID]
            });
            await newConversation.save()
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((error) => {
                res.status(500).json(error);
            })
        }
        else{
            res.status(200).json("Conversation already exists");
        }
    })
    .catch((error) => {
        res.status(500).json(error);
    })
}

export { getConversations, addConversation};