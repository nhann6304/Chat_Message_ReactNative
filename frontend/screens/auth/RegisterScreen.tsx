import { URL_LOCAL } from "@/app/url";
import { IUser } from "@/interfaces/IUser.interface";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import axios from "axios";
import { useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Pressable, SafeAreaView, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import * as Notifications from 'expo-notifications';

export default function RegisterScreen() {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigation = useNavigation<NavigationProp<any>>();
    const timeNow = new Date().toISOString();
    const handleRegister = async () => {
        const token = (await Notifications.getExpoPushTokenAsync({ projectId: "7e22201e-0179-47dd-bdc2-56a72c4c2d1a" })).data;
        console.log(typeof token);
        const user: Partial<IUser> = {
            name: name,
            email: email,
            password: password,
            deviceToken: token,
            lastOfflineTime: timeNow
        };

        try {
            const response = await axios.post(`${URL_LOCAL}/register`, user);
            console.log(response);
            Alert.alert(
                "Đăng ký thành công",
                "Bạn đã đăng ký thành công hãy qua trang đăng nhập",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => navigation.navigate("Select") }
                ]
            );
            setName("");
            setEmail("");
            setPassword("");
        } catch (error) {
            console.log("Lỗi FrontEnd khi đăng ký ", error);
            Alert.alert("Đăng ký thất bại", "Đăng ký thất bại vui lòng thử lại");
        }
    };

    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}>
                <View style={{ height: 200, backgroundColor: "pink", width: "100%" }}>
                    <View style={{ marginTop: 40, justifyContent: "center", alignItems: "center", }}>
                        <Image
                            style={{ width: 150, height: 80, resizeMode: "contain" }}
                            source={{
                                uri: "https://cdn-icons-png.flaticon.com/128/6655/6655045.png",
                            }}
                        />
                    </View>
                    <Text style={{ marginTop: 20, textAlign: "center", fontSize: 20, }}>Match Mate</Text>
                </View>

                <KeyboardAvoidingView>
                    <View style={{ alignItems: "center" }}>
                        <Text style={{
                            fontSize: 17,
                            fontWeight: "bold",
                            marginTop: 25,
                            color: "#f9629f"
                        }}>
                            Register to your Account
                        </Text>
                    </View>

                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 20,
                        }}
                    >
                        <Image
                            style={{ width: 100, height: 80, resizeMode: "cover" }}
                            source={{
                                uri: "https://cdn-icons-png.flaticon.com/128/2509/2509078.png",
                            }}
                        />
                    </View>

                    <View style={{ marginTop: 20 }}>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 5,
                                backgroundColor: "#FFC0CB",
                                paddingVertical: 5,
                                borderRadius: 5,
                                marginTop: 30
                            }}
                        >
                            <Ionicons style={{ marginLeft: 8 }} name="person-sharp" size={24} color="white" />
                            <TextInput
                                value={name}
                                onChangeText={(text) => setName(text)}
                                placeholder="Enter your name"
                                placeholderTextColor={"white"}
                                style={{ color: "white", marginVertical: 10, width: 300, fontSize: email ? 17 : 17 }}
                            />
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 5,
                                backgroundColor: "#FFC0CB",
                                paddingVertical: 5,
                                borderRadius: 5,
                                marginTop: 30
                            }}
                        >
                            <MaterialIcons style={{ marginLeft: 8 }} name="email" size={24} color="white" />
                            <TextInput
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                                placeholder="Enter your email"
                                placeholderTextColor={"white"}
                                style={{ color: "white", marginVertical: 10, width: 300, fontSize: email ? 17 : 17 }}
                            />
                        </View>

                        <View
                            style={{ marginTop: 10 }} >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 5,
                                    backgroundColor: "#FFC0CB",
                                    paddingVertical: 5,
                                    borderRadius: 5,
                                    marginTop: 30
                                }}
                            >
                                <AntDesign style={{ marginLeft: 8 }} name="lock1" size={24} color="white" />
                                <TextInput
                                    value={password}
                                    onChangeText={(text) => setPassword(text)}
                                    secureTextEntry={true}
                                    placeholder="Enter your password"
                                    placeholderTextColor={"white"}
                                    style={{ color: "white", marginVertical: 10, width: 300, fontSize: password ? 17 : 17 }}
                                />
                            </View>
                        </View>

                        <View style={{ marginTop: 50 }} />

                        <Pressable
                            onPress={handleRegister}
                            style={{
                                width: 200,
                                backgroundColor: "#FFC0CB",
                                borderRadius: 6,
                                marginLeft: "auto",
                                marginRight: "auto",
                                padding: 15
                            }}
                        >
                            <Text style={{ textAlign: "center", color: "white", fontSize: 16, fontWeight: "bold" }}>Register</Text>
                        </Pressable>

                        <Pressable onPress={() => navigation.navigate("Login")} style={{ marginTop: 12 }}>
                            <Text style={{ textAlign: "center", color: "gray" }}>Already have an account? Sign In</Text>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    )
}
