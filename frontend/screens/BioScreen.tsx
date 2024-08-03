import { URL_LOCAL } from "@/app/url";
import { IUserParams } from "@/interfaces/IUser.interface";
import { AntDesign, Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Alert, Button, Dimensions, FlatList, Image, Pressable, ScrollView, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Carousel from "react-native-reanimated-carousel";
const profileImages = [
    {
        image:
            "data:image/jpeg;base64,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",
    },
    {
        image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUbovtzYZoMKOAlhU0HrihosJTSwOnsuDyWJ5QupkCleXe2UyGuqqUvbTu_yqpQza6wok&usqp=CAU",
    },
    {
        image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeSUmqKylOnbwbt2yZ3V_aoIME3X2ZHRhHKhqDHgM6z-O_nyXCBE0AlrB7HCOCCXwYrJ0&usqp=CAU",
    },
];
const turnons = [
    {
        id: "0",
        name: "Dự án Phong Thủy",
        description: "Code giao diện 1",
    },
    {
        id: "10",
        name: "Dự án SeaDragon",
        description: "Code giao diện 2",
    },
    {
        id: "1",
        name: "Dự án hút mỡ ",
        description: "Code giao diện 3",


    },
    {
        id: "2",
        name: "Dự án Bác Sĩ ",
        description: "Code giao diện 4",
    },
    {
        id: "3",
        name: "Dự án .....",
        description: "Code giao diện 5",
    },
    {
        id: "4",
        name: "Dự án .....",
        description: "Code giao diện 5",
    },
    {
        id: "5",
        name: "Dự án .....",
        description: "Code giao diện 5",
    },
    {
        id: "6",
        name: "Dự án .....",
        description: "Code giao diện 5",
    },

];
const data = [
    {
        id: "0",
        name: "Casual",
        description: "Let's keep it easy and see where it goes",
    },
    {
        id: "1",
        name: "Long Term",
        description: "How about a one life stand",
    },
    {
        id: "2",
        name: "Virtual",
        description: "Let's have some virtual fun",
    },
    {
        id: "3",
        name: "Open for Anything",
        description: "Let's Vibe and see where it goes",
    },
];

export default function BioScreen() {
    const [option, setOption] = useState<string>("AD");
    const [description, setDescription] = useState<string>("");
    const [nameUser, setNameUser] = useState<string>("");
    const [activeSlide, setActiveSlide] = useState<number>(0);
    const [userId, setUserId] = useState<string | null>(null);
    const [selectedTurnOns, setSelectedTurnOns] = useState<Array<any>>([]);
    const [imageAvatar, SetImageAvatar] = useState<Array<string>>([]);
    const [LookingOptions, setLookingOptions] = useState<Array<any>>([]);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [images, setImages] = useState<Array<any>>([]);
    const width = Dimensions.get('window').width;
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
            const response = await axios.get(`${URL_LOCAL}/users/${userId}`);
            const user = response.data;
            console.log(user);
            setDescription(user?.user?.description);
            setSelectedTurnOns(user?.user?.turnOns);
            setImages(user?.user?.profileImage);
            setLookingOptions(user?.user?.lookingFor);
            setNameUser(user?.user?.name);
            SetImageAvatar(user?.user?.profileImage);

        } catch (error) {
            console.log("Có lỗi khi fetch user description", error);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUserDescription();
        }
    }, [userId])
    const updateUserDescription = async () => {
        try {
            const response = await axios.put(`${URL_LOCAL}/users/${userId}/description`, {
                description: description
            }
            );
            // console.log("response:::::", response.data);
            if (response.status === 200) {
                Alert.alert("Thành Công", "Đăng lên bảng tin thành công")
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleOption = (lookingFor: string) => {
        if (LookingOptions.includes(lookingFor)) {
            removeLookingFor(lookingFor);
        } else {
            addLookingFor(lookingFor);

        }
    }
    const handleToggleTurnOn = (turnOn: string) => {
        // console.log("turn on ", turnOn);
        if (selectedTurnOns.includes(turnOn)) {
            removeTurnOn(turnOn);
        } else {
            addTurnOn(turnOn);
        }
    }
    const addLookingFor = async (lookingFor: string) => {
        try {
            const response = await axios.put(
                `${URL_LOCAL}/users/${userId}/looking-for`,
                {
                    lookingFor: lookingFor,
                }
            );


            if (response.status == 200) {
                setLookingOptions([...LookingOptions, lookingFor]);
            }
        } catch (error) {
            console.log("Error addding looking for", error);
        }
    };
    const removeLookingFor = async (lookingFor: string) => {
        try {
            const response = await axios.put(
                `${URL_LOCAL}/users/${userId}/looking-for/remove`,
                {
                    lookingFor: lookingFor,
                }
            );


            if (response.status === 200) {
                setLookingOptions(LookingOptions.filter((item) => item !== lookingFor));
            }
        } catch (error) {
            console.error("Error removing looking for:", error);
        }
    };
    const addTurnOn = async (turnOn: string) => {
        try {
            const response = await axios.put(`${URL_LOCAL}/users/${userId}/turn-ons/add`, {
                turnOns: turnOn
            });

            if (response.status == 200) {
                console.log("vo");

                setSelectedTurnOns([...selectedTurnOns, turnOn])
            }
        } catch (error) {
            console.log(error);
        }
    }
    const removeTurnOn = async (turnOn: string) => {
        try {
            const response = await axios.put(`${URL_LOCAL}/users/${userId}/turn-ons/remove`, {
                turnOns: turnOn
            })
            console.log(response.data);
            if (response.status === 200) {
                setSelectedTurnOns(selectedTurnOns.filter((item) => item !== turnOn))
            }
        } catch (error) {
            console.log(error);
        }
    }
    const renderImageCarousel = ({ item }: any) => {
        return (
            <View>
                <Image
                    style={{
                        width: "85%",
                        resizeMode: "contain",
                        height: 290,
                        borderRadius: 10,
                        transform: [{ rotate: "-5deg" }]
                    }}
                    source={{ uri: item?.image }}
                />
                <Text style={{ position: "absolute", top: 10, right: 60, color: "black" }}>{activeSlide + 1}/{images.length}</Text>
                {/* <Text>{item?.image}</Text> */}
            </View>
        )
    }
    const handleAddImage = async () => {
        try {
            const response = await axios.post(`${URL_LOCAL}/users/${userId}/profile-images`, {
                imageUrl: imageUrl
            });
            if (response.status === 200) {
                Alert.alert("Thêm hình ảnh thành công")
                setImageUrl("");
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <ScrollView>
            <View>
                <Image
                    style={{ width: "100%", height: 200, resizeMode: "cover" }}
                    source={{
                        uri: "https://static.vecteezy.com/system/resources/previews/020/933/072/non_2x/abstract-blur-gradient-background-vector.jpg",
                    }}
                />
                <View style={{ position: "relative" }}>
                    <Pressable
                        style={{
                            padding: 10,
                            backgroundColor: "#DDA0DD",
                            width: 300,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 10,
                            position: "absolute",
                            top: -60,
                            left: "50%",
                            transform: [{ translateX: -150 }],
                        }}
                    >
                        <Image
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: 30,
                                resizeMode: "cover",
                            }}
                            source={{
                                uri: `${imageAvatar[0]}`,
                            }}
                        />
                        <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 6 }}>
                            {nameUser}
                        </Text>
                        <Text style={{ marginTop: 4, fontSize: 15 }}>
                            20 tuổi 110 days
                        </Text>
                    </Pressable>
                </View>
            </View>
            <View style={{
                marginTop: 80,
                marginHorizontal: 20,
                flexDirection: 'row',
                alignItems: "center",
                gap: 25,
                justifyContent: "center"
            }}>
                <Pressable onPress={() => setOption("AD")}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: "500",
                        color: option === "AD" ? "black" : "gray"
                    }}>Giới thiệu</Text>
                </Pressable>

                <Pressable onPress={() => setOption("Photos")}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: "500",
                        color: option === "Photos" ? "black" : "gray"

                    }}>Hình ảnh</Text>
                </Pressable>

                <Pressable onPress={() => setOption("Turn-on")}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: "500",
                        color: option === "Turn-on" ? "black" : "gray"

                    }}>Nhiệm vụ</Text>
                </Pressable>
                <Pressable onPress={() => setOption("Looking For")}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: "500",
                        color: option === "Looking For" ? "black" : "gray"

                    }}
                    >
                        Looking For
                    </Text>
                </Pressable>
            </View>
            <View style={{ marginHorizontal: 14, marginVertical: 15 }}>
                {option == "AD" && (
                    <View
                        style={{
                            borderColor: "#202020",
                            borderWidth: 1,
                            padding: 10,
                            height: 300
                        }}
                    >
                        <TextInput
                            style={{ fontSize: description ? 17 : 17 }}
                            value={description}
                            multiline
                            onChangeText={(text) => setDescription(text)}
                            placeholder="Viết mô tả về bạn cho bạn bè"

                        />
                        <Pressable
                            onPress={updateUserDescription}
                            style={{
                                marginTop: "auto",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 15,
                                backgroundColor: "black",
                                borderRadius: 5,
                                justifyContent: "center",
                                padding: 10
                            }}
                        >
                            <Text style={{ color: "white", textAlign: "center", fontSize: 15, fontWeight: "500" }}>Đăng lên bảng tin</Text>
                            <Entypo name="mask" size={24} color="white" />
                        </Pressable>
                    </View>
                )}
            </View>

            <View style={{ marginHorizontal: 14 }}>
                {option == "Photos" && (
                    <View>
                        <Carousel
                            loop
                            width={width}
                            height={width / 2}
                            autoPlay={true}
                            data={profileImages}
                            scrollAnimationDuration={1000}
                            onSnapToItem={(index) => setActiveSlide(index)}
                            renderItem={renderImageCarousel}
                        />
                        <View style={{ marginTop: 25 }}>
                            <Text>Thêm hình ảnh</Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 5,
                                    paddingVertical: 5,
                                    borderRadius: 5,
                                    marginTop: 10,
                                    backgroundColor: "#DCDCDC"
                                }}
                            >
                                <Entypo style={{ marginLeft: 8 }} name="image" size={24} color="gray" />
                                <TextInput
                                    value={imageUrl}
                                    onChangeText={(text) => setImageUrl(text)}
                                    style={{ color: "gray", marginVertical: 10, width: 300 }}
                                    placeholder=""
                                />
                            </View>
                            <Button onPress={handleAddImage} title="Thêm hình " />
                        </View>

                    </View>
                )}
            </View>
            <View style={{ marginHorizontal: 14 }}>
                {option == "Turn-on" && (
                    <View>
                        {turnons.map((item, index) => (
                            <Pressable
                                onPress={() => handleToggleTurnOn(item?.name)}
                                style={{
                                    backgroundColor: "#FFFDD0",
                                    padding: 10,
                                    marginVertical: 10,
                                }}
                                key={index}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >
                                    <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 15, flex: 1 }}>{item?.name}
                                    </Text>
                                    {selectedTurnOns.includes(item?.name) && (
                                        <AntDesign name="checkcircle" size={18} color="#17B169" />
                                    )}

                                </View>
                                <Text style={{ marginTop: 4, fontSize: 15, color: "gray", textAlign: "center" }}>{item?.description}</Text>
                            </Pressable>
                        ))}
                    </View>
                )}
            </View>

            <View style={{ marginHorizontal: 14 }}>
                {option == "Looking For" && (
                    <>
                        <View>
                            <FlatList
                                columnWrapperStyle={{ justifyContent: "space-between" }}
                                numColumns={2}
                                data={data}
                                renderItem={({ item }) => (
                                    <Pressable
                                        onPress={() => handleOption(item?.name)}
                                        style={{
                                            backgroundColor: LookingOptions.includes(item?.name) ? "#fd5c63" : "white",
                                            padding: 16,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: 150,
                                            margin: 10,
                                            borderWidth: LookingOptions.includes(item?.name) ? 0 : 0.7,
                                            borderColor: "#fd5c63",
                                            borderRadius: 5
                                        }}
                                    >
                                        <Text style={{
                                            textAlign: "center",
                                            fontWeight: "500",
                                            fontSize: 13,
                                            color: LookingOptions.includes(item?.name)
                                                ? "white"
                                                : "black"
                                        }}
                                        >
                                            {item?.name}
                                        </Text>

                                        <Text style={{
                                            textAlign: "center",
                                            width: 140,
                                            marginTop: 10,
                                            fontSize: 13,
                                            color: LookingOptions.includes(item?.name)
                                                ? "white"
                                                : "gray"
                                        }}>{item?.description}</Text>
                                    </Pressable>
                                )}

                            />
                        </View>

                    </>
                )}
            </View>
        </ScrollView >
    );
}
