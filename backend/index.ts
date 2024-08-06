import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import mongoose, { FilterQuery } from "mongoose";
import "dotenv/config";
import cors from "cors";
import jwt from "jsonwebtoken";
import dbConnect from "./config/dbconnect";
import userSchema from "./config/models/User";
import messageSchema from "./config/models/Message";
import { IOperationUser, IUser, IUserParams, IUserQuery } from "./interfaces/IUser.interface";
const User = mongoose.model("User", userSchema);
const Chat = mongoose.model("Message", messageSchema);
const app = express();
import crypto from "crypto"
import nodemailer from "nodemailer"
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { IMessage } from "./interfaces/IMessage.interface";
const server = http.createServer(app);
const io = new SocketIOServer(server);
// const PORT = process.env.PORT2 || 8000;
const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";
const PORT = 9000;
const PORT_SOCKET = 8003;
const HOST = '192.168.1.4';
app.use(cors(
    { origin: "*" }
));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

dbConnect();

app.listen(PORT, HOST, () => {
    console.log(`Server đang chạy trên cổng http://${HOST}:${PORT}`);
});

// Hàm xác thực email

const sendVerificationEmail = async (email: string, verificationToken: string) => {
    const transpoter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "huynhthanhnhan632004@gmail.com",
            pass: "iblw jygv uali spmy"
        }
    })

    const mailOptions = {
        from: "huynhthanhnhan632004@gmail.com",
        to: email,
        subject: "Xác thực email",
        text: `Làm ơn nhấn vào đường link để tiến hành xác thực http://192.168.100.167:9000/verify/${verificationToken} `
    }

    try {
        await transpoter.sendMail(mailOptions);
    } catch (error) {
        console.log("Lỗi khi xác thực email");
    }
};

app.get("/verify/:token", async (req: Request<any, {}, any>, res: Response) => {
    try {
        const token = req.params.token;
        const user = await User.findOne({ verificationToken: token });
        console.log(user);
        if (!user) {
            return res.status(404).json({ message: "Token không tồn tại" })
        }

        // Xác thực khi đúng token
        user.verified = true;
        user.verificationToken = undefined;

        await user.save();
    } catch (error) {
        console.log("Erro", error);
        res.status(500).json({ message: "Xác thực email thất bại" });
    }
})

// api chức năng đăng ký user
app.post("/register", async (req: Request<{}, {}, IUser>, res: Response) => {
    try {
        const { name, email, password, deviceToken } = req.body;
        // Kiểm tra Email đã tồn tại
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User đã tồn tại trong hệ thống" })
        }
        // tạo mới User
        const newUser = new User({
            name,
            email,
            password,
            deviceToken
        });
        // tạo mới gửi lên 1 token 
        newUser.verificationToken = crypto.randomBytes(20).toString("hex");

        // Lưu trang thái 
        await newUser.save();

        //gửi email xác thực tới email đó
        sendVerificationEmail(newUser.email, newUser.verificationToken);
        res.status(200).json({ message: "Đăng ký người dùng thành công", userId: newUser._id });
    } catch (error) {
        console.log("Lỗi khi đăng ký User");
        res.status(500).json({ message: "Lỗi khi đăng ký User", error })
    }
})

// api chức năng đăng nhập user

const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString('hex');
    return secretKey
}

const secretKey = generateSecretKey();


app.post("/login", async (req: Request<{}, {}, IUser>, res: Response) => {
    console.log("api login đã chạy");
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Email hoặc mật khảu không có trong hệ thông" });
        }

        // Check coi password
        if (user.password !== password) {
            return res.status(401).json({ message: "Sai mật khẩu" });
        }

        const token = jwt.sign({ userId: user._id, secretKey }, secretKey);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi đăng nhập User", error })

    }
})


// api chức năng thay đổi giới tính

app.put("/users/:userId/gender", async (req: Request<IUserParams, {}, IUser>, res: Response) => {
    try {
        const { userId } = req.params;
        const { gender } = req.body;


        const user = await User.findByIdAndUpdate(
            userId,
            { gender: gender },
            { new: true }
        )
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tòn tại" });
        }
        res.status(200).json({ message: "Thay đổi giới tính người dùng thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi thay đổi giới tính người dùng", error })

    }
})

// api chức năng update mô tả user

app.put("/users/:userId/description", async (req: Request<IUserParams, {}, IUser>, res: Response) => {
    try {
        const { userId } = req.params;
        const { description } = req.body;


        const user = await User.findByIdAndUpdate(
            userId,
            { description: description },
            { new: true }
        )
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tòn tại" });
        }
        res.status(200).json({ message: "Thêm mô tả người dùng thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi thêm mô tả người dùng", error })

    }
})

// api láy thông tin người dùng

app.get("/users/:userId", async (req: Request<IUserParams, {}, any>, res: Response) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(500).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Error fetching the user details" });
    }
})

//api thêm turnon ở trang bio 
app.put("/users/:userId/turn-ons/add", async (req: Request<IUserParams, {}, IUser>, res: Response) => {
    console.log("aip chay");
    try {
        const { userId } = req.params;
        const { turnOns } = req.body;


        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { turnOns: turnOns } },
            { new: true }
        )
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tòn tại" });
        }
        res.status(200).json({ message: "Thêm Turn-ons người dùng thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi thêm Turn-ons người dùng", error })

    }
})

//api xóa turnon ở trang bio 

app.put("/users/:userId/turn-ons/remove", async (req: Request<IUserParams, {}, IUser>, res: Response) => {
    try {
        const { userId } = req.params;
        const { turnOns } = req.body;


        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { turnOns: turnOns } },
            { new: true }
        )
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tòn tại" });
        }
        res.status(200).json({ message: "Thêm Turn-ons người dùng thành công", user });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi thêm Turn-ons người dùng", error })

    }
})

// aip thông tin liên hệ
app.put("/users/:userId/looking-for", async (req: Request<IUserParams, {}, IUser>, res: Response) => {

    try {
        const { userId } = req.params;
        const { lookingFor } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            {
                $addToSet: { lookingFor: lookingFor }
            },
            {
                new: true
            },
        );
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tòn tại" });
        }
        res.status(200).json({ message: "ThêmlookingForngười dùng thành công", user });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi thêm lookingForngười dùng", error })

    }
})

// xóa
app.put("/users/:userId/looking-for/remove", async (req: Request<IUserParams, {}, IUser>, res: Response) => {
    try {
        const { userId } = req.params;
        const { lookingFor } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            {
                $pull: { lookingFor: lookingFor },
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "No user" });
        }

        return res
            .status(200)
            .json({ message: "Looking for updated succesfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error removing looking for", error });
    }

})
// update load hinh 

app.post("/users/:userId/profile-images", async (req: Request<IUserParams, {}, IUser>, res: Response) => {
    try {
        const { userId } = req.params;
        const { imageUrl } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }
        user.profileImage?.push(imageUrl);
        await user.save();
        res.status(200).json({ message: "Hình ảnh đã thêm thành công", user })
    } catch (error) {

    }
})

// api lấy profile 

app.get("/profiles", async (req: Request<{}, {}, {}, IUserQuery>, res: Response) => {
    try {
        const { userId, gender, turnOns, lookingFor } = req.query;
        let filter: FilterQuery<IUserQuery> = { gender: gender === "male" ? "female" : "male" };

        if (turnOns) {
            filter.turnOns = { $in: turnOns };
        }
        if (lookingFor) {
            filter.lookingFor = { $in: lookingFor };
        }

        const currentUser = await User.findById(userId)
            .populate("matches", "_id")
            .populate("crushes", "_id");
        console.log("friendIds:::::", currentUser?.matches);

        const friendIds = currentUser?.matches?.map((friend: any) => friend._id) || [];
        const crushIds = currentUser?.crushes?.map((crush: any) => crush._id) || [];
        // console.log("friendIds:::::", friendIds);
        // console.log("crushIds:::::", crushIds);
        const profiles = await User.find(filter)
            .where("_id")
            .nin([userId, ...friendIds, ...crushIds]);

        return res.status(200).json({ message: "Lụm", profiles });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy profile User", error });
    }
});

// api chức năng gửi like 

app.post("/send-like", async (req: Request<{}, {}, IOperationUser>, res: Response) => {
    try {
        const { currentUserId, selectedUserId } = req.body;

        await User.findByIdAndUpdate(selectedUserId, {
            $push: { recievedLikes: currentUserId }
        });

        await User.findByIdAndUpdate(currentUserId, {
            $push: { crushes: selectedUserId }
        });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Lỗi server khi update sending like", error })
    }
})

// api lấy thông tin likes đã nhận

app.get("/received-likes/:userId/details", async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        // Tìm user bằng ID
        const user: IUser | null = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User không tồn tại" });
        }

        // Kiểm tra nếu receivedLikes không xác định hoặc rỗng
        if (!user.recievedLikes || user.recievedLikes.length === 0) {
            return res.status(200).json({ receivedLikesDetails: [] });
        }
        const receivedLikesDetails: IUser[] = [];
        for (const likedUserId of user.recievedLikes) {
            const likedUser: IUser | null = await User.findById(likedUserId);
            if (likedUser) {
                receivedLikesDetails.push(likedUser);
            }
        }

        res.status(200).json({ receivedLikesDetails });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy chi tiết likes đã nhận",
            error: (error as Error).message,
        });
    }
});


app.get("/users", async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng", error });
    }
});



io.on("connection", (socket) => {

    socket.on("sendMessage", async (data) => {
        console.log(data);
        try {
            // JSON.stringify({ abc: "123" }) 
            io.emit("receiveMessage", data);

            // const { senderId, receiverId, message } = data;
            // const newMessage = new Chat({ senderId, receiverId, message });
            // await newMessage.save();

        } catch (error) {
            console.error("Error sending message:", error);
        }
        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
    socket.on('typing', (senderId) => {
        socket.broadcast.emit('typing', senderId);
    });

    socket.on('stopTyping', (senderId) => {
        socket.broadcast.emit('stopTyping', senderId);
    });
});

server.listen(PORT_SOCKET, HOST, () => {
    console.log(`socket io  đang chạy trên cổng http://${HOST}:${PORT_SOCKET}`);
})

app.get("/messages", async (req: Request, res: Response) => {
    console.log("Chạy api messages");
    try {
        const { senderId, receiverId } = req.query;

        if (!senderId || !receiverId) {
            return res.status(400).json({ message: "Sender ID and Receiver ID are required" });
        }

        const messages = await Chat.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).populate("senderId", "_id name");

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
});


app.post('/addMessages', async (req, res) => {
    try {
        const { senderId, receiverId, message, timestamp } = req.body;
        const newMessage = new Chat({ senderId, receiverId, message, timestamp });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: "Lỗi" });
    }
});



app.post('/markAsRead', async (req, res) => {
    const { senderId, receiverId } = req.body;
    try {
        await Chat.updateMany(
            { senderId: receiverId, receiverId: senderId, isRead: false },
            { isRead: true }
        );
        res.status(200).send("Messages marked as read");
    } catch (error) {
        res.status(500).send("Error marking messages as read");
    }
});


app.get('/unreadMessages', async (req, res) => {
    const { userId } = req.query;
    try {
        const unreadCounts = await Chat.aggregate([
            { $match: { receiverId: userId, isRead: false } },
            { $group: { _id: "$senderId", count: { $sum: 1 } } }
        ]);
        res.status(200).json(unreadCounts);
    } catch (error) {
        res.status(500).send("Error fetching unread messages count");
    }
});


app.post('/delete', async (req, res) => {
    try {
        const { message } = req.body;
        if (!Array.isArray(message) || message.length == 0) {
            return res.status(400).json({ message: "Không có tin nhắn đẻ xóa" });
        }

        for (const messageID of message) {
            await Chat.findByIdAndUpdate(messageID);
        }
        res.status(200).json({ message: "Xóa tin nhắn thành công" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ messagge: "Xóa tin nhắn thất bại", error })
    }
})
