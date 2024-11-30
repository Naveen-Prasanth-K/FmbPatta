import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../Components/Screens/HomeScreen';
import { Colors } from "../Utilities/GlobalStyles/Colors"
import FMBSketch from '../Components/Screens/FMBSketch';

const Stack = createNativeStackNavigator();

export default function NativeStackNav() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: { backgroundColor: Colors.primary55 },
                    headerTintColor: 'black',
                }}>
                <Stack.Screen
                    name="Home Screen"
                    component={HomeScreen}
                    options={{ headerShown: true }}
                />
                <Stack.Screen
                    name="FMBSketch"
                    component={FMBSketch}
                    options={{ headerShown: true }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
