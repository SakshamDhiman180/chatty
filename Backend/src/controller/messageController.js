import User from "../models/userModel.js";
import Messages from "../models/messageModel.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({_id: { $ne: userId } }).select("-password -__v -createdAt -updatedAt").sort({ lastActive: -1 });
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }

}

export const getMessages = async (req, res) => {
    try {
        const {userId:userToChatId} = req.params
        const currentUserId = req.user._id
        const messages = await Messages.find({
            $or: [
                { sender: currentUserId, receiver: userToChatId },
                { sender: userToChatId, receiver: currentUserId }
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const {content, image} = req.body
        const {id:receiver} = req.params
        const sender = req.user._id 
        
        let imageUrl;
        if (image) {
            const uploadResponse = cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new Messages({
            sender: sender,
            receiver: receiver,
            content: content,
            image: imageUrl, 
        })
        
        await newMessage.save()

        res.status(200).json({"message": "Message sent successfully", "data": newMessage});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}