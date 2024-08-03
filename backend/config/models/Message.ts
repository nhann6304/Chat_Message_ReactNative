import mongoose from "mongoose";
import { IMessage } from "../../interfaces/IMessage.interface";

const messageSchema = new mongoose.Schema<IMessage>({
    senderId: {
        type: String,
        required: true,
    },
    receiverId: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    isRead: {
        type: Boolean,
        default: false
    }
});

export default messageSchema