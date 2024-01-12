import React from 'react'
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
 function TabNav(){
    return(
        <>
        <tab.Navigator
initialRouteName='cafe'
screenOptions={
    {
        headerShown:false
    }
}>
    <tab.Screen name='cafe' component={Cafescreen}/>
    <tab.Screen name='restaurant' component={Restaurantscreen}/>
    <tab.Screen name='cart' component={Cartscreen}/>
</tab.Navigator>
</>
    )
}
export default function Router(){
   return(
    <NavigationContainer>
    <StackNav/>
</NavigationContainer>
   )
}