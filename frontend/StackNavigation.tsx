import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-reanimated';

import { BottomTabNavigation } from './components/navigation/BottomTabNavigation';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import SelectScreen from './screens/auth/SelectScreen';
import ProfileScreen from './screens/ProfileScreen';
import Select from './components/home/Select';
import ChatRoom from './components/chatRoom';


const Stack = createNativeStackNavigator();

export default function RootLayout() {

    return (
        // <NavigationContainer independent={true} >
        //     <Stack.Navigator>
        //         <Stack.Screen options={{ headerShown: false, }} name="Login" component={LoginScreen} />
        //         <Stack.Screen options={{ headerShown: false, }} name="Register" component={RegisterScreen} />
        //         <Stack.Screen options={{ headerShown: false, }} name="Select" component={SelectScreen} />
        //         <Stack.Screen options={{ headerShown: false, }} name="Bio" component={BioScreen} />
        //         <Stack.Screen options={{ headerShown: false, }} name="Profile" component={ProfileScreen} />
        //         <Stack.Screen options={{ headerShown: false, }} name="Bottom_Navigation" component={BottomTabNavigation} />
        //     </Stack.Navigator>
        // </NavigationContainer>
        <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Select" component={SelectScreen} />
                <Stack.Screen name="BottomTabNavigation" component={BottomTabNavigation} />
                <Stack.Screen name="Select1" component={Select} />
                <Stack.Screen name="ChatRoom" component={ChatRoom} options={{}} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
