import { NavigationProp, useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Entypo, Feather } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { URL_LOCAL, URL_SOCKET } from "@/app/url";
import axios from "axios";
import { IMessage } from "@/interfaces/IMessage.interface";
import { GlobalContext } from "@/context/context";

interface RouteParams {
    image: string;
    name: string;
    receiverId: string;
    senderId: string;
}

export default function ChatRoom() {
    const [message, setMessage] = useState<string>("");
    const [messageArr, setMessageArr] = useState<IMessage[]>([]);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [typingMessage, setTypingMessage] = useState<string>("");

    const route = useRoute();
    const { image, name, receiverId, senderId } = route.params as RouteParams;
    const socket = io(`${URL_SOCKET}`);
    const { setShowCountMessage, showCountMessage } = useContext(GlobalContext);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("connect");
        });

        socket.on("receiveMessage", async (newMessage: IMessage) => {
            const timeStamp = new Date().toISOString();
            const messageWithTime = { ...newMessage, timeStamp };
            setMessageArr(prevMessages => [...prevMessages, messageWithTime]);
        });

        socket.on("typing", (typingUserId: string) => {
            if (typingUserId !== senderId) {
                setTypingMessage("Đang soạn tin...");
                setTimeout(() => {
                    setTypingMessage("");
                    socket.on("stopTyping", (typingUserId: string) => {
                        if (typingUserId !== senderId) {
                            setTypingMessage("");
                        }
                    });
                }, 5000);
            }
        });

        // socket.on("stopTyping", (typingUserId: string) => {
        //     if (typingUserId !== senderId) {
        //         setTypingMessage("");
        //     }
        // });

        return () => {
            socket.off("receiveMessage");
            socket.off("typing");
            socket.off("stopTyping");
        };
    }, []);

    useEffect(() => {
        const unreadMessages = messageArr.filter((item) => item._id !== receiverId);
        setShowCountMessage(unreadMessages.length);
    }, [messageArr]);

    const fetchMessage = async () => {
        try {
            const response = await axios.get(`${URL_LOCAL}/messages`, {
                params: { senderId, receiverId }
            });
            setMessageArr(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const markAsRead = async () => {
        try {
            await axios.post(`${URL_LOCAL}/markAsRead`, { senderId, receiverId });
        } catch (error) {
            console.error("Error marking messages as read:", error);
        }
    };

    useEffect(() => {
        fetchMessage();
        markAsRead();
    }, [senderId, receiverId]);

    useEffect(() => {
        if (message.trim()) {
            setIsTyping(true);
            socket.emit("typing", senderId);
        } else {
            setIsTyping(false);
            socket.emit("stopTyping", senderId);
        }
    }, [message]);

    const handleMessage = async () => {
        const timestamp = new Date().toISOString();
        if (message.trim()) {
            try {
                await axios.post(`${URL_LOCAL}/addMessages`, {
                    senderId,
                    receiverId,
                    message,
                    timestamp,
                });
                socket.emit("sendMessage", { senderId, receiverId, message });
                setMessage("");
                socket.emit("stopTyping", senderId);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const formatTime = (time: string | Date): string => {
        const date = new Date(time);
        if (isNaN(date.getTime())) {
            return "Invalid date";
        }
        const options: Intl.DateTimeFormatOptions = {
            hour: "numeric",
            minute: "numeric",
            hour12: true
        };
        return date.toLocaleString("en-VN", options);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 40 }} keyboardShouldPersistTaps="handled">
                {messageArr.map((item, index) => (
                    <Pressable
                        key={index}
                        style={[
                            item.senderId === senderId
                                ? {
                                    alignSelf: "flex-end",
                                    backgroundColor: "#F08080",
                                    padding: 8,
                                    maxWidth: "60%",
                                    borderRadius: 7,
                                    margin: 10,
                                }
                                : {
                                    alignSelf: "flex-start",
                                    backgroundColor: "#DB7093",
                                    padding: 8,
                                    margin: 10,
                                    borderRadius: 7,
                                    maxWidth: "60%",
                                },
                        ]}
                    >
                        <Text style={{ fontSize: 13, textAlign: "left", color: "white", fontWeight: "500" }}>
                            {item.message}
                        </Text>
                        <Text style={{ fontSize: 9, textAlign: "right", color: "#F0F0F0", marginTop: 5 }}>{formatTime(item.timestamp)}</Text>
                    </Pressable>
                ))}
                {typingMessage && (
                    <View style={{ paddingHorizontal: 10, paddingBottom: 10 }}>
                        <Text style={{ fontStyle: "italic", color: "gray" }}>{typingMessage}</Text>
                    </View>
                )}
            </ScrollView>
            <View style={{ flexDirection: "row", alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10, borderTopWidth: 1, borderColor: "#dddddd" }}>
                <Entypo name="emoji-happy" size={24} color="black" />
                <TextInput
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                    style={{ flex: 1, height: 40, borderWidth: 1, borderColor: "#dddddd", borderRadius: 20, paddingHorizontal: 10 }}
                    placeholder="Nhập tin nhắn"
                />
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginHorizontal: 8 }}>
                    <Entypo name="camera" size={24} color="gray" />
                    <Feather name="mic" size={24} color="gray" />
                    <Pressable
                        onPress={handleMessage}
                        style={{
                            backgroundColor: "#007bff",
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 20
                        }}
                    >
                        <Text style={{ textAlign: 'center', color: "white" }}>Gửi</Text>
                    </Pressable>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
