
import GlobalState from '@/context/context';
import StackNavigation from '@/StackNavigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
export default function RootLayout() {

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });


  return (
    <GlobalState>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StackNavigation />
      </GestureHandlerRootView>
    </GlobalState>
  );
}

// import { Text, View } from "react-native";

// export default function ChatScreen() {
//     return (
//         <View>
//             <Text>ChatScreen</Text>
//         </View>
//     )
// }
