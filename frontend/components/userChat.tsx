import { NavigationProp } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Image, Pressable, Text, View, Dimensions } from "react-native";
import { GlobalContext } from "@/context/context";
import { IUser } from "@/interfaces/IUser.interface";
import { io } from "socket.io-client";
import { URL_SOCKET } from "@/app/url";

export default function UserChat({ userId, item }: { userId: string, item: IUser }) {
    const navigation = useNavigation<NavigationProp<any>>();
    const width = Dimensions.get('window').width;
    const { showCountMessage, setShowCountMessage } = useContext(GlobalContext);
    const [count, setCount] = useState<number>(0);
    const socket = io(`${URL_SOCKET}`);

    useEffect(() => {
        socket.on("receiveMessage", (newMessage) => {
            if (newMessage.senderId === item?._id) {
                setCount((prevCount) => prevCount + 1);
                setShowCountMessage(showCountMessage + 1);
            }
        });
        return () => {
            socket.off("receiveMessage");
        };
    }, [showCountMessage, setShowCountMessage, userId]);
    // function nhấn vào chuyển qua trang phòng chat 

    console.log(item?.name);
    return (
        <Pressable
            onPress={() =>
                navigation.navigate('ChatRoom', {
                    image: item?.profileImage && item.profileImage.length > 0 ? item.profileImage[0] : '',
                    name: item?.name,
                    receiverId: item?._id,
                    senderId: userId,
                    deviceToken: item?.deviceToken,
                })
            }
            style={{ flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 12 }}
        >
            <View>
                <Image
                    style={{ width: 60, height: 60, borderRadius: 35 }}
                    source={{ uri: item?.profileImage && item.profileImage.length > 0 ? item.profileImage[0] : 'default-image-url' }}
                />
            </View>

            <View>
                <Text style={{ fontWeight: "500", color: "#DE3163" }}>
                    {item?.name}
                </Text>
                <View
                    style={{ width: width - 100, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}
                >
                    <Text style={{ fontSize: 15, fontWeight: "500", marginTop: 6 }}>
                        Hãy chat với {item?.name}
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
        </Pressable>
    );
}
