import { URL_LOCAL } from "@/app/url";
import Profile from "@/components/home/Profile";
import { IUser, IUserParams } from "@/interfaces/IUser.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

export default function ProfileScreen() {
    interface IUserResponse {
        user: IUser;
    }
    const [userId, setUserId] = useState<string>("");
    const [user, setUser] = useState<IUser | null>(null);
    const [profiles, setProfiles] = useState<Array<any>>([]);
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

    const fetchUserDescription = async () => {
        try {
            const response = await axios.get<IUserResponse>(`${URL_LOCAL}/users/${userId}`);
            const user = response.data;
            setUser(user?.user);
        } catch (error) {
            console.log("Có lỗi khi fetch user description", error);
        }
    };

    useEffect(() => {
        if (userId && user) {
            fetchProfiles();
        }
    }, [userId, user]);
    // lấy api Profiles
    console.log(profiles);
    const fetchProfiles = async () => {
        try {
            const response = await axios.get<any>(`${URL_LOCAL}/profiles`, {
                params: {
                    userId: userId,
                    gender: user?.gender,
                    turnOns: user?.turnOns,
                    lookingFor: user?.lookingFor
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchUserDescription();
    }, [userId])
    // console.log(profiles);
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={profiles}
                keyExtractor={(item) => item._id}
                renderItem={({ item, index }: { item: IUser; index: number }) => {
                    return (
                        <Profile key={index} item={item} userId={userId} setProfiles={setProfiles} isEven={index % 2 === 0} />
                    )
                }
                }
            />
        </View >
    )
}
