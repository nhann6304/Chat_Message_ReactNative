import { URL_LOCAL } from "@/app/url";
import { ILocalStorege } from "@/interfaces/ILocalStorage.interface";
import { IUser, IUserParams } from "@/interfaces/IUser.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp } from "@react-navigation/native";
import axios from "axios";
import { useNavigation, useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

export default function SelectScreen() {
    const [option, setOption] = useState<IUser['gender']>("other");
    const [userId, setUserId] = useState<string | null>(null);
    const navigation = useNavigation<NavigationProp<any>>();
    const router = useRouter();
    // Lấy userId từ Storage
    useEffect(() => {
        const fetchUser = async () => {
            const token = await AsyncStorage.getItem("auth");
            if (token) {
                try {
                    const decodedToken = jwtDecode<IUserParams>(token);
                    const userId = decodedToken.userId;
                    setUserId(userId);
                } catch (error) {
                    console.error('Invalid token:', error);
                }
            } else {
                console.log('No token found');
            }
        };
        fetchUser();
    }, []);

    const handleUpdateUserGender = async () => {
        try {
            const response = await axios.put(`${URL_LOCAL}/users/${userId}/gender`, {
                gender: option
            });
            console.log(response.data);
            if (response.status === 200) {
                navigation.navigate("BottomTabNavigation", { screen: "Bio" });
                console.log("oke");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: "white", padding: 12 }}>
            {/* Nam */}
            <Pressable
                onPress={() => setOption("male")}
                style={{
                    backgroundColor: "#F0F0F0",
                    padding: 12,
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 25,
                    borderRadius: 5,
                    borderColor: option == "male" ? "#D0D0D0" : "transparent",
                    borderWidth: option == "male" ? 1 : 0
                }}
            >
                <Text style={{ fontSize: 16, fontWeight: "500" }}>Tôi là Nam!!!</Text>
                <Image
                    style={{ width: 50, height: 50 }}
                    source={{
                        uri: "https://cdn-icons-png.flaticon.com/128/12442/12442425.png",
                    }}
                />
            </Pressable>

            {/* Nữ */}
            <Pressable
                onPress={() => setOption("female")}
                style={{
                    backgroundColor: "#F0F0F0",
                    padding: 12,
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 25,
                    borderRadius: 5,
                    borderColor: option == "female" ? "#D0D0D0" : "red",
                    borderWidth: option == "female" ? 1 : 0
                }}
            >
                <Text style={{ fontSize: 16, fontWeight: "500" }}>Tôi là Nữ!!!</Text>
                <Image
                    style={{ width: 50, height: 50 }}
                    source={{
                        uri: "https://cdn-icons-png.flaticon.com/128/9844/9844179.png",
                    }}
                />
            </Pressable>
            {/* Tôi bí mật */}
            <Pressable
                onPress={() => setOption("other")}
                style={{
                    backgroundColor: "#F0F0F0",
                    padding: 12,
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 25,
                    borderRadius: 5,
                    borderColor: option == "other" ? "#D0D0D0" : "red",
                    borderWidth: option == "other" ? 1 : 0
                }}
            >
                <Text style={{ fontSize: 16, fontWeight: "500" }}>Tôi bí mật!!!</Text>
                <Image
                    style={{ width: 50, height: 50 }}
                    source={{
                        uri: "https://cdn-icons-png.flaticon.com/128/9844/9844179.png",
                    }}
                />
            </Pressable>

            {option && (
                <Pressable
                    onPress={handleUpdateUserGender}
                    style={{ marginTop: 25, backgroundColor: "black", padding: 12, borderRadius: 4 }}>
                    <Text style={{ textAlign: "center", color: "white", fontWeight: "600" }}>Done</Text>
                </Pressable>
            )}
        </View>
    )
}
