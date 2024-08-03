import React from "react";
import { Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";

export default function SelectScreen() {
    const route = useRoute();
    console.log(route);
    const params = useLocalSearchParams();
    console.log(params);



    return (
        <View>
            {/* <Text>User ID: {userId}</Text>
            <Text>Profiles: {JSON.stringify(profilesData, null, 2)}</Text> */}
        </View>
    );
}
