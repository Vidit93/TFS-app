// <===================================================================Import-Section-Start===================================================================================>

import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    TextInput, Linking, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { OrderNotification } from '../Notifications/Notifications';
import PushNotification from "react-native-push-notification";
const h = Dimensions.get('window').height;
const w = Dimensions.get('window').width;
// <===================================================================Import-Section-End===================================================================================>


// <===================================================================Logic-Section-Start===================================================================================>
export default function AddressScreen({ navigation,route }) {

    const { Refresh} = route.params;
    const [fname, setfname] = useState('')
    const [lname, setlname] = useState('')
    const [table, settable] = useState('')
    const [number, setnumber] = useState('')
    const [address, setaddress] = useState('')
    const [note, setnote] = useState('')
    const [method, setmethod] = useState('')
    const [cart, setcart] = useState([]);
    const [sum, setsum] = useState('');
    const [WTSP, setWTSP] = useState('');

    useEffect(() => {
        console.log('route ka darta',route);
        console.log('route ka under ka darta',route.params);
        Getdata()
        Cartupdate();
        return () => {
            // update();
            Cartupdate();
        };
    }, [])

    async function Cartupdate(){
        const phn = await AsyncStorage.getItem('PHN');
        
         firestore()
            .collection('cart')
            .doc(phn)
            .onSnapshot(() => {
                Getdata();
            });
    }

    async function OrderDinein() {
        const phn = await AsyncStorage.getItem('PHN');
        if (fname && lname && table) {
            try {
                const messageBody = cart.map(item => (
                    ` Name: ${item.productData.name}, 
              Rate: ${item.productData.rate}, Quantity: ${item.qty}`
                )).join('\n\n');

                const heading = ['ORDER TYPE:- DineIn', messageBody].join('\n\n')
                const message = [heading, 'Total Payment:- ' + sum + '\n'].join('\n\n\n')

                const MSG = [message, 'Contact Details:-', 'Name:- ' + fname + ' ' + lname, 'Table Number:- ' + table, 'Instructions:- ' + note,].join('\n\n')

                const phoneNumber = '+91'+WTSP;

                const whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(MSG)}`;
                console.log('timer shuru');
                setTimeout(() => {
                    console.log('delete ke liye time khtm');
                    DeleteCart(phn);
                    Refresh();
                }, 2000);
                OrderNotification()
                Linking.openURL(whatsappURL);
                navigation.navigate('Fast Food')
            } catch (error) {
                console.error('Error sending WhatsApp message:', error);
            }
        } else {
            Alert.alert('Fill all the details first')
        }

    }
    async function OrderTakeaway() {
        const phn = await AsyncStorage.getItem('PHN');
        if (fname && lname && number.length > 9) {
            try {
                const messageBody = cart.map(item => (
                    ` Name: ${item.productData.name}, 
                  Rate: ${item.productData.rate}, Quantity: ${item.qty}`
                )).join('\n\n');

                const heading = ['ORDER TYPE:- TakeAway', messageBody].join('\n\n')
                const message = [heading, 'Total Payment:- ' + sum + '\n'].join('\n\n\n')

                const MSG = [message, 'Contact Details:-', 'Name:- ' + fname + ' ' + lname, 'Phone Number:- ' + number, 'Instructions:- ' + note, 'Mode:- ' + 'TakeAway Order'].join('\n\n')

                const phoneNumber = '+91'+WTSP;

                const whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(MSG)}`;
                setTimeout(() => {
                    DeleteCart(phn);
                    Refresh();
                }, 2000);
                OrderNotification()
                Linking.openURL(whatsappURL);
                navigation.navigate('Fast Food')
            } catch (error) {
                console.error('Error sending WhatsApp message:', error);
            }
        } else {
            Alert.alert('Fill all the details first')
        }

    }
    async function OrderDelivery() {
        const phn = await AsyncStorage.getItem('PHN');
        if (fname && lname  && number.length > 9 && address) {
            try {
                const messageBody = cart.map(item => (
                    ` Name: ${item.productData.name}, 
                  Rate: ${item.productData.rate}, Quantity: ${item.qty}`
                )).join('\n\n');

                const heading = ['ORDER TYPE:- Delivery', messageBody].join('\n\n')
                const message = [heading, 'Total Payment:- ' + sum + '\n'].join('\n\n\n')

                const MSG = [message, 'Contact Details:-', 'Name:- ' + fname + ' ' + lname, 'Phone Number:- ' + number, 'Address:- ' + address, 'Instructions:- ' + note, 'Mode:- ' + 'Delivery Order'].join('\n\n')

                const phoneNumber = '+91'+WTSP;

                const whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(MSG)}`;
                setTimeout(() => {
                    DeleteCart(phn);
                    Refresh();
                }, 2000);
                OrderNotification()
                Linking.openURL(whatsappURL);
                navigation.navigate('Fast Food')
            } catch (error) {
                console.error('Error sending WhatsApp message:', error);
            }
        } else {
            Alert.alert('Fill all the details first')
        }

    }

    const DeleteCart = async (documentId) => {
        // console.log('delete function me aa gya');
        try {
            await firestore().collection('cart').doc(documentId).delete();

            // console.log(`Document with ID ${documentId} deleted successfully`);
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };


    async function Getdata() {
        const method = await AsyncStorage.getItem('Method');
        const phn = await AsyncStorage.getItem('PHN');
        setmethod(method)

        console.log('getData me aaya');
        try {

            const wtspNumber = await firestore()
                .collection('Whatsapp_Number')
                .doc('IeMxNqvGBnD1DqoxSMaU')
                .get();
                const wtsp = wtspNumber._data.Number
                setWTSP(wtsp)
                // console.log("wtsp ka document ka data",wtsp);
            const document = await firestore()
                .collection('cart')
                .doc(phn)
                .get();
            const data = document._data.products;
            // console.log('sara data ye he', data);

            const extractedData = data.map(item => ({
                Id: item.productId,
                productData: item.productData,
                qty: item.quantity,
            }));
            setcart(extractedData);
            const total = extractedData.map(item => item.productData.rate * item.qty)
            // console.log('total sbka', total);
            const sum = total.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            setsum(sum);
            // console.log('total ka sum he ye', sum);

            // console.log('Filtered food data', extractedData);
        } catch (error) {
            console.log(error);
        }
    }


    function Dinein() {
        return (<>
            <View style={styles.container}>
                <View>
                    <Text style={styles.heading}>Dinein Order</Text>
                </View>
                <View style={styles.inputview}>
                    <View>
                        <TextInput value={fname} onChangeText={(d) => setfname(d)} placeholder="First Name" style={styles.inputtext} keyboardType="default"/>
                    </View>
                    <View>
                        <TextInput value={lname} onChangeText={(d) => setlname(d)} placeholder="Last Name" style={styles.inputtext} keyboardType="default"/>
                    </View>
                    <View>
                        <TextInput value={table} onChangeText={(d) => settable(d)} placeholder="Table Number" style={styles.inputtext} keyboardType="numeric"/>
                    </View>
                    <View>
                        <TextInput value={note} onChangeText={(d) => setnote(d)} placeholder="Instructions for your order" style={styles.inputtext} keyboardType="default"/>
                    </View>
                </View>
                <View style={styles.loginview}>
                    <TouchableOpacity onPress={OrderDinein}>
                        <View style={styles.loginbtn}>
                            <Text style={styles.loginbtntext}>ORDER FOOD</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </>)
    }
    function Takeaway() {
        return (<>
            <View style={styles.container}>
                <View>
                    <Text style={styles.heading}>Takeaway Order</Text>
                </View>
                <View style={styles.inputview}>
                    <View>
                        <TextInput value={fname} onChangeText={(d) => setfname(d)} placeholder="First Name" style={styles.inputtext} />
                    </View>
                    <View>
                        <TextInput value={lname} onChangeText={(d) => setlname(d)} placeholder="Last Name" style={styles.inputtext} />
                    </View>
                    <View>
                        <TextInput value={number} onChangeText={(d) => setnumber(d)} placeholder="Contact Number" style={styles.inputtext} keyboardType="numeric"/>
                    </View>
                    <View>
                        <TextInput value={note} onChangeText={(d) => setnote(d)} placeholder="Instructions for your order" style={styles.inputtext} />
                    </View>
                </View>
                <View style={styles.loginview}>
                    <TouchableOpacity onPress={OrderTakeaway}>
                        <View style={styles.loginbtn}>
                            <Text style={styles.loginbtntext}>ORDER FOOD</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </>)
    }
    function Delivery() {
        return (<>
            <View style={styles.container}>
                <View>
                <Text style={styles.heading}>Delivery Order</Text>
                </View>
                <View style={styles.inputview}>
                    <View>
                        <TextInput value={fname} onChangeText={(d) => setfname(d)} placeholder="First Name" style={styles.inputtext} />
                    </View>
                    <View>
                        <TextInput value={lname} onChangeText={(d) => setlname(d)} placeholder="Last Name" style={styles.inputtext} />
                    </View>
                    <View>
                        <TextInput value={number} onChangeText={(d) => setnumber(d)} placeholder="Contact Number" style={styles.inputtext} keyboardType="numeric"/>
                    </View>
                    <View>
                        <TextInput value={address} onChangeText={(d) => setaddress(d)} placeholder="Your Address" style={styles.inputtext} />
                    </View>
                    <View>
                        <TextInput value={note} onChangeText={(d) => setnote(d)} placeholder="Instructions for your order" style={styles.inputtext} />
                    </View>
                </View>
                <View style={styles.loginview}>
                    <TouchableOpacity onPress={OrderDelivery}>
                        <View style={styles.loginbtn}>
                            <Text style={styles.loginbtntext}>ORDER FOOD</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </>)
    }
    // <===================================================================Logic-Section-End===================================================================================>



    // <===================================================================Frontend-Section-Start===================================================================================>
    return (
        <>
            {method == 1 ? Dinein() : null}
            {method == 2 ? Takeaway() : null}
            {method == 3 ? Delivery() : null}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff', // Background color
    },
    heading: {
        fontSize: 35,
        fontWeight: 'bold',
        marginVertical: 40, // Adjust the margin bottom as needed for spacing
        color: '#333', // Adjust the color as needed
      },
    inputview: {
        width: '100%',
        marginBottom: 20,
    },
    inputtext: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    loginview: {
        width: '100%',
        alignItems: 'center',
    },
    loginbtn: {
        backgroundColor: '#FF6347', // Button background color
        borderRadius: 5,
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    loginbtntext: {
        color: '#fff', // Button text color
        fontWeight: 'bold',
        fontSize: 18,
    },
});
// <===================================================================Frontend-Section-End===================================================================================>
