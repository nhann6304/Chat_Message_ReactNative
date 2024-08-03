import { URL_LOCAL } from "@/app/url";
import { IUser } from "@/interfaces/IUser.interface";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp } from "@react-navigation/native";
import axios from "axios";
import { useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
// import "dotenv";

import { Alert, Image, KeyboardAvoidingView, Pressable, SafeAreaView, Text, TextInput, View } from "react-native";
export default function LoginScreen() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const router = useRouter();
    const navigation = useNavigation<NavigationProp<any>>();


    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem("auth");
                if (token) {
                    navigation.navigate("BottomTabNavigation", { screen: "Profile" });
                }
            } catch (error) {
                console.log("Erro", error);
            }
        }
        checkLoginStatus();
    }, [])

    const handleLogin = () => {
        const user: Partial<IUser> = {
            email: email,
            password: password
        };

        axios.post(`${URL_LOCAL}/login`, user)
            .then((response) => {
                console.log(response);
                const token = response.data.token;
                AsyncStorage.setItem("auth", token);
                navigation.navigate("BottomTabNavigation");
                // navigation.navigate("Select")
            })
            .catch((error) => {
                Alert.alert("Tài khoản hoặc mật khẩu sai vui lòng thử lại")
            })
        // navigation.navigate("Select");

    }
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
                            Log in to your Account
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
                        <View style={{ marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <Text>Keep me login</Text>
                            <Text style={{ color: "#007FFF", fontWeight: "500" }}>Forgot password</Text>
                        </View>

                        <View style={{ marginTop: 50 }} />

                        <Pressable
                            onPress={handleLogin}
                            style={{
                                width: 200,
                                backgroundColor: "#FFC0CB",
                                borderRadius: 6,
                                marginLeft: "auto",
                                marginRight: "auto",
                                padding: 15
                            }}
                        >
                            <Text style={{ textAlign: "center", color: "white", fontSize: 16, fontWeight: "bold" }}>Login</Text>
                        </Pressable>

                        <Pressable onPress={() => navigation.navigate("Register")} style={{ marginTop: 12 }}>
                            <Text style={{ textAlign: "center", color: "gray" }}>Don't have an account? Sign Up</Text>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    )
}
