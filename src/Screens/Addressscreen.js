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
const h = Dimensions.get('window').height;
const w = Dimensions.get('window').width;
// <===================================================================Import-Section-End===================================================================================>


// <===================================================================Logic-Section-Start===================================================================================>
export default function AddressScreen({ navigation }) {

    const [fname, setfname] = useState('')
    const [lname, setlname] = useState('')
    const [table, settable] = useState('')
    const [number, setnumber] = useState('')
    const [address, setaddress] = useState('')
    const [note, setnote] = useState('')
    const [method, setmethod] = useState('')
    const [cart, setcart] = useState([]);
    const [sum, setsum] = useState('');


    useEffect(() => {
        Getdata()
        const update = firestore()
        .collection('cart')
        .doc('9414419911')
        .onSnapshot(() => {
          Getdata()
        });
      return () => {
        update();
      };
    }, [])

    async function OrderDinein() {

        if (fname && lname && table) {
            try {
                const messageBody = cart.map(item => (
                    ` Name: ${item.productData.name}, 
              Rate: ${item.productData.rate}, Quantity: ${item.qty}`
                )).join('\n\n');

                const heading = ['ORDER TYPE:- DineIn', messageBody].join('\n\n')
                const message = [heading, 'Total Payment:- ' + sum + '\n'].join('\n\n\n')

                const MSG = [message, 'Contact Details:-', 'Name:- ' + fname + ' ' + lname, 'Table Number:- ' + table, 'Instructions:- ' + note,].join('\n\n')

                const phoneNumber = '+919950110025';

                const whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(MSG)}`;
                console.log('timer shuru');
                setTimeout(() => {
                    console.log('delete ke liye time khtm');
                    DeleteCart('9414419911');
                }, 5000);

                Linking.openURL(whatsappURL);
            } catch (error) {
                console.error('Error sending WhatsApp message:', error);
            }
        } else {
            Alert.alert('Fill all the details first')
        }

    }
    async function OrderTakeaway() {
        if (fname && lname && number.length > 9) {
            try {
                const messageBody = cart.map(item => (
                    ` Name: ${item.productData.name}, 
                  Rate: ${item.productData.rate}, Quantity: ${item.qty}`
                )).join('\n\n');

                const heading = ['ORDER TYPE:- TakeAway', messageBody].join('\n\n')
                const message = [heading, 'Total Payment:- ' + sum + '\n'].join('\n\n\n')

                const MSG = [message, 'Contact Details:-', 'Name:- ' + fname + ' ' + lname, 'Phone Number:- ' + number, 'Instructions:- ' + note, 'Mode:- ' + 'TakeAway Order'].join('\n\n')

                const phoneNumber = '+919950110025';

                const whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(MSG)}`;
                setTimeout(() => {
                    DeleteCart('9414419911');
                }, 5000);

                Linking.openURL(whatsappURL);
            } catch (error) {
                console.error('Error sending WhatsApp message:', error);
            }
        } else {
            Alert.alert('Fill all the details first')
        }

    }
    async function OrderDelivery() {
        if (fname && lname && table && number.length > 9 && address) {
            try {
                const messageBody = cart.map(item => (
                    ` Name: ${item.productData.name}, 
                  Rate: ${item.productData.rate}, Quantity: ${item.qty}`
                )).join('\n\n');

                const heading = ['ORDER TYPE:- Delivery', messageBody].join('\n\n')
                const message = [heading, 'Total Payment:- ' + sum + '\n'].join('\n\n\n')

                const MSG = [message, 'Contact Details:-', 'Name:- ' + fname + ' ' + lname, 'Phone Number:- ' + number, 'Address:- ' + address, 'Instructions:- ' + note, 'Mode:- ' + 'Delivery Order'].join('\n\n')

                const phoneNumber = '+919950110025';

                const whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(MSG)}`;
                setTimeout(() => {
                    DeleteCart('9414419911');
                }, 5000);

                Linking.openURL(whatsappURL);
            } catch (error) {
                console.error('Error sending WhatsApp message:', error);
            }
        } else {
            Alert.alert('Fill all the details first')
        }

    }

    const DeleteCart = async (documentId) => {
        console.log('delete function me aa gya');
        try {
            // Delete the document with the provided ID from 'cart' collection
            await firestore().collection('cart').doc(documentId).delete();

            console.log(`Document with ID ${documentId} deleted successfully`);
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };


    async function Getdata() {
        const method = await AsyncStorage.getItem('Method');
        setmethod(method)

        console.log('getData me aaya');
        try {
            const document = await firestore()
                .collection('cart')
                .doc('9414419911')
                .get();
            const data = document._data.products;
            console.log('sara data ye he', data);

            const extractedData = data.map(item => ({
                Id: item.productId,
                productData: item.productData,
                qty: item.quantity,
            }));
            setcart(extractedData);
            const total = extractedData.map(item => item.productData.rate * item.qty)
            console.log('total sbka', total);
            const sum = total.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            setsum(sum);
            console.log('total ka sum he ye', sum);

            console.log('Filtered food data', extractedData);
        } catch (error) {
            console.log(error);
        }
    }


    function Dinein() {
        return (<>
            <View style={styles.container}>
                <View style={styles.inputview}>
                    <View>
                        <TextInput value={fname} onChangeText={(d) => setfname(d)} placeholder="First Name" style={styles.inputtext} />
                    </View>
                    <View>
                        <TextInput value={lname} onChangeText={(d) => setlname(d)} placeholder="Last Name" style={styles.inputtext} />
                    </View>
                    <View>
                        <TextInput value={table} onChangeText={(d) => settable(d)} placeholder="Table Number" style={styles.inputtext} />
                    </View>
                    <View>
                        <TextInput value={note} onChangeText={(d) => setnote(d)} placeholder="Instructions for your order" style={styles.inputtext} />
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
                <View style={styles.inputview}>
                    <View>
                        <TextInput value={fname} onChangeText={(d) => setfname(d)} placeholder="First Name" style={styles.inputtext} />
                    </View>
                    <View>
                        <TextInput value={lname} onChangeText={(d) => setlname(d)} placeholder="Last Name" style={styles.inputtext} />
                    </View>
                    <View>
                        <TextInput value={number} onChangeText={(d) => setnumber(d)} placeholder="Contact Number" style={styles.inputtext} />
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
                    <View>
                        <Text>Delivery Order</Text>
                    </View>
                </View>
                <View style={styles.inputview}>
                    <View>
                        <TextInput value={fname} onChangeText={(d) => setfname(d)} placeholder="First Name" style={styles.inputtext} />
                    </View>
                    <View>
                        <TextInput value={lname} onChangeText={(d) => setlname(d)} placeholder="Last Name" style={styles.inputtext} />
                    </View>
                    <View>
                        <TextInput value={number} onChangeText={(d) => setnumber(d)} placeholder="Contact Number" style={styles.inputtext} />
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
        // backgroundColor: '#A3A9FF',
    },
    logoview: {
        // flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 70,
    },
    line: {
        width: w * 0.3,
        height: h * 0.003,
        backgroundColor: 'white',
        borderRadius: 20,
        marginLeft: 2,
    },
    logintextview: {
        // flex:1,
        height: h * 0.05,
        // backgroundColor:'grey',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 45,
        marginTop: 5,
    },
    logintext: {
        fontSize: 27,
        marginHorizontal: 10,
        color: 'white',
    },
    inputview: {
        // flex:3,
        // backgroundColor:'yellow'
    },
    inputtext: {
        fontSize: 20,
        height: h * 0.07,
        marginHorizontal: 25,
        color: 'black',
        backgroundColor: '#C1C5FF',
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 25,
    },
    loginview: {
        // flex: 1,
        alignItems: 'center',
        // backgroundColor: 'blue',
    },
    loginbtn: {
        backgroundColor: '#FFC545',
        alignItems: 'center',
        justifyContent: 'center',
        height: h * 0.065,
        width: w * 0.85,
        borderRadius: 10,
    },
    loginbtntext: {
        fontSize: 25,
        fontWeight: '500',
        color: 'black',
    },
    forgetview: {
        // flex: 1,
        // backgroundColor: 'orange',
        alignItems: 'center',
        height: h * 0.19,
    },
    forgettext: {
        fontSize: 17,
        marginTop: 15,
        color: 'white',
    },
    line1: {
        width: w * 0.87,
        height: h * 0.003,
        backgroundColor: 'white',
        borderRadius: 20,
        marginHorizontal: 20,
    },
    signupview: {
        flex: 1,
        // backgroundColor: 'green',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    signuptext: {
        fontSize: 18,
        color: 'white',
        // marginLeft:5
    },
    signuptext1: {
        fontSize: 18,
        marginLeft: 9,
        color: '#FFC545',
    },
});
// <===================================================================Frontend-Section-End===================================================================================>
