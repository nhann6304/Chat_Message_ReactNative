import { URL_LOCAL } from "@/app/url";
import { IUser, IUserParams } from "@/interfaces/IUser.interface";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect, useNavigation } from "expo-router";
import { jwtDecode } from "jwt-decode"; // Correct import for jwtDecode
import { useCallback, useContext, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import ProfileScreen from "./ProfileScreen";
import UserChat from "@/components/userChat";
import { GlobalContext } from "@/context/context";

export default function ChatScreen() {
    const [userId, setUserId] = useState<string>("");
    const [profile, setProfile] = useState<Array<any>>([]);
    const [matches, setMatches] = useState<Array<any>>([]);
    const navigation = useNavigation<NavigationProp<any>>();
    const profiles = JSON.stringify(ProfileScreen);
    const { showCountMessage } = useContext(GlobalContext);
    console.log(showCountMessage);
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

    const fetchReceivedLikesDetails = async () => {
        try {
            const response = await axios.get(
                `${URL_LOCAL}/received-likes/${userId}/details`
            );

            console.log("fetchReceivedLikesDetails::", response);

            const receivedLikesDetails = response.data.receivedLikesDetails;

            setProfile(receivedLikesDetails);
        } catch (error) {
            console.log("Error fetching the details", error);
        }
    };

    const fetchUserMatches = async () => {
        try {
            const response = await axios.get(
                `${URL_LOCAL}/users/`
            );


            setMatches(response.data);
        } catch (error) {
            console.log("Error", error);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchReceivedLikesDetails();
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            fetchUserMatches();
        }
    }, [userId]);

    useEffect(() => {
        fetchUserMatches();
    }, [showCountMessage])


    useFocusEffect(

        useCallback(() => {
            if (userId) {
                fetchUserMatches();
            }
        }, [userId])
    );

    const filterUser = matches.filter((item: IUser) => item._id !== userId);
    return (
        <View style={{ backgroundColor: "white", flex: 1, padding: 10 }}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Text style={{ fontSize: 20, fontWeight: "500" }}>CHATS</Text>
                <Ionicons name="chatbox-ellipses-outline" size={25} color="black" />
            </View>
            <Pressable
                onPress={() =>
                    navigation.navigate("Select1", {
                        profiles: profiles,
                        userId: userId,
                    })
                }
                style={{
                    marginVertical: 12,
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor: "#E0E0E0",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Feather name="heart" size={24} color="black" />
                </View>
                <Text style={{ fontSize: 17, marginLeft: 10, flex: 1 }}>
                    You have got {profile.length} likes
                </Text>
                <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
            </Pressable>

            <View>
                {filterUser?.map((item, index) => (
                    <UserChat key={index} userId={userId} item={item} />
                ))}
            </View>
        </View>
    );
}
