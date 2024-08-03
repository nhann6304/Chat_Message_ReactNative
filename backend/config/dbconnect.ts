import mongoose from "mongoose";
import "dotenv/config"

export default async function dbConnect() {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
        if (conn.connection.readyState === 1) {
            console.log("Kết nối database thành công");
        } else {
            console.log("Kết nối database thất bại");
        }
    } catch (error) {
        console.log(error);
    }
}
