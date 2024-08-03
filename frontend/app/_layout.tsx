
import GlobalState from '@/context/context';
import StackNavigation from '@/StackNavigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
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
