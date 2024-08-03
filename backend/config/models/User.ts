import mongoose from "mongoose";
import { IUser } from "../../interfaces/IUser.interface";


const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    verified: {
        type: Boolean,
        default: false,
    },
    verificationToken: String,
    crushes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    ],
    recievedLikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    matches: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    ],
    profileImage: [
        {
            type: String
        },
    ],
    description: {
        type: String
    },
    turnOns: [
        {
            type: String
        },
    ],
    lookingFor: [
        {
            type: String
        },
    ],
})

export default userSchema