import { NavigationProp } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Image, Pressable, Text, View, Dimensions } from "react-native";
import { GlobalContext } from "@/context/context";
import { IUser } from "@/interfaces/IUser.interface";
import { io } from "socket.io-client";
import { URL_LOCAL, URL_SOCKET } from "@/app/url";
import axios from "axios";
import { IMessage } from "@/interfaces/IMessage.interface";

export default function UserChat({ userId, item }: { userId: string, item: IUser }) {
    const navigation = useNavigation<NavigationProp<any>>();
    const width = Dimensions.get('window').width;
    const [messages, setMessages] = useState<IMessage[]>([]);
    const { showCountMessage, setShowCountMessage } = useContext(GlobalContext);
    const [count, setCount] = useState<number>(0);
    const [isRead, setIsRead] = useState<boolean>(false);
    const socket = io(`${URL_SOCKET}`);

    const getLastMessage = () => {
        const n = messages.length;
        return messages[n - 1];
    }

    const lastMessage = getLastMessage();

    useEffect(() => {
        // Fetch initial messages when component mounts
        const fetchMessages = async () => {
            try {
                const senderId = userId;
                const receiverId = item?._id;
                const response = await axios.get(`${URL_LOCAL}/messages`, {
                    params: { senderId, receiverId },
                });

                setMessages(response.data);
                // Kiểm tra xem tin nhắn cuối đã được xem chưa
                if (response.data.length > 0) {
                    const lastMessage = response.data[response.data.length - 1];
                }
            } catch (error) {
                console.log("Lỗi khi lấy tin nhắn", error);
            }
        };

        fetchMessages();

        socket.on("receiveMessage", (newMessage) => {
            if (newMessage.senderId === item?._id) {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                setCount((prevCount) => prevCount + 1);
                setShowCountMessage(showCountMessage + 1);
            }
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [item?._id, showCountMessage, setShowCountMessage, userId]);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("connect");
        });
    });

    // Navigate to ChatRoom when the user presses the chat item
    const handleNavigation = () => {
        navigation.navigate('ChatRoom', {
            image: item?.profileImage && item.profileImage.length > 0 ? item.profileImage[0] : '',
            name: item?.name,
            receiverId: item?._id,
            senderId: userId,
            deviceToken: item?.deviceToken,
            timeOff: item?.lastOfflineTime,
            isRead: isRead
        });
        setCount(0);
        setIsRead(true); // Đánh dấu tin nhắn đã được xem khi nhấn vào
    };

    return (
        < Pressable
            onPress={handleNavigation}
            style={{ flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 12 }}
        >
            <View>
                <Image
                    style={{ width: 60, height: 60, borderRadius: 35 }}
                    source={{ uri: item?.profileImage && item.profileImage.length > 0 ? item.profileImage[0] : 'default-image-url' }}
                />
            </View>

            <View>
                <Text style={{ fontWeight: "700", color: "#DE3163" }}>
                    {item?.name}
                </Text>
                <View
                    style={{ width: width - 100, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}
                >
                    <Text style={{
                        fontSize: 15,
                        fontWeight: isRead ? '400' : '700',
                        marginTop: 6
                    }}>
                        {lastMessage
                            ? lastMessage.senderId === userId
                                ? `Bạn: ${lastMessage.message}`
                                : lastMessage.message
                            : `Start Chat with ${item?.name}`}
                    </Text>

                    {count > 0 && (
                        <View style=
                            {{
                                height: 18, width: 18, backgroundColor: 'red', borderRadius: 100
                            }}>
                            <Text style={{ alignItems: "center", textAlign: "center", color: "white", fontWeight: "500" }}>
                                {count}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </>
    );
}
