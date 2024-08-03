import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign, Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View, Modal, Button } from "react-native";
import { useNavigation } from "expo-router";
import { NavigationProp } from "@react-navigation/native";
import HomeScreen from "@/screens/HomeScreen";
import ChatScreen from "@/screens/ChatScreen";
import BioScreen from "@/screens/BioScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Tab = createBottomTabNavigator();
const screenOptions = {
    tabBarHideOnKeyboard: true,
    tabBarItemStyle: {
        paddingBottom: 10,
    },
};

const Stack = createNativeStackNavigator();
export function BottomTabNavigation() {

    return (
        <Tab.Navigator initialRouteName="Profile" screenOptions={screenOptions}>
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{

                    title: "Home",
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <Feather name="eye" size={24} color="black" />
                        ) : (
                            <Feather name="eye" size={24} color="gray" />
                        ),
                }}
            />
            <Tab.Screen
                name="Chat"
                component={ChatScreen}
                options={{
                    title: "Chat",
                    headerShown: false,
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
                        ) : (
                            <Ionicons name="chatbox-ellipses-outline" size={24} color="gray" />
                        ),
                }}
            />
            <Tab.Screen
                name="Bio"
                component={BioScreen}
                options={{
                    title: "Bio",
                    headerShown: false,
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <MaterialCommunityIcons name="guy-fawkes-mask" size={24} color="black" />
                        ) : (
                            <MaterialCommunityIcons name="guy-fawkes-mask" size={24} color="gray" />
                        ),
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    avatar: {
        height: 24,
        width: 24,
        borderRadius: 100,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "500",
    },
    headerLeft: {
        flexDirection: "row",
        marginHorizontal: 14,
    },
    modalView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
    },
});
