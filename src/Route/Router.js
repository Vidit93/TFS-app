import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import Cafescreen from '../Screens/Cafescreen';
import Restaurantscreen from '../Screens/Restaurantscreen';
import Cartscreen from '../Screens/Cartscreen';
import Menuscreen from '../Screens/Menuscreen';
import AddressScreen from '../Screens/Addressscreen';
import Verificationscreen from '../Screens/Verificationscreen';
const tab = createBottomTabNavigator();
const Stack = createStackNavigator();
 function StackNav() {
    return (
        <>
             
                <Stack.Navigator 
                initialRouteName="verification"
                screenOptions={{ headerShown: false }}>
                    {/* <Stack.Screen name="verification" component={Verificationscreen} /> */}
                    <Stack.Screen name="cafe" component={TabNav} />
                    <Stack.Screen name="menu" component={Menuscreen} />
                    <Stack.Screen name="address" component={AddressScreen} />
                </Stack.Navigator>
        </>
    )
} 
function TabNav() {
    return (
        <tab.Navigator
            initialRouteName='cafe'
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: 'orange', 
                // tabBarInactiveTintColor: 'gray',
                tabBarStyle: { backgroundColor: 'white' },
                tabBarLabelStyle: { fontSize: 13 }, 
                tabBarIcon: ({ focused, color, size }) => {
                    let iconSource;

                    if (route.name === 'Fast Food') {
                        iconSource = focused ? require('../Images/burger.png') : require('../Images/consumer.png');
                    } else if (route.name === 'Main Course') {
                        iconSource = focused ? require('../Images/restaurant1.png') : require('../Images/restaurant.png');
                    } else if (route.name === 'Cart') {
                        iconSource = focused ?require('../Images/cart.png') : require('../Images/cart.png') ;
                    }

                    return <Image source={iconSource} style={{ width: 30, height: 30 }} />;
                },
            })}
        >
            <tab.Screen name='Fast Food' component={Cafescreen} />
            <tab.Screen name='Main Course' component={Restaurantscreen} />
            <tab.Screen name='Cart' component={Cartscreen} />
        </tab.Navigator>
    )
}


export default function Router(){
   return(
    <NavigationContainer>
    <StackNav/>
</NavigationContainer>
   )
}