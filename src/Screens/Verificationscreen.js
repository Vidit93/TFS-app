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
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
const h = Dimensions.get('window').height;
const w = Dimensions.get('window').width;

export default function Verificationscreen() {

    const navigation = useNavigation();
    const [otp, setotp] = useState('')
    const [number, setnumber] = useState('')
    const [data, setdata] = useState('')


    async function Sendotp() {
        try {
            const mobile = '+91' + number;
            const response = await auth().signInWithPhoneNumber(mobile);
            setdata(response);
            Alert.alert('Verify your OTP');
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to send OTP. Please try again.');
        }
    }
    
    async function Verifyotp() {
        try {
            const response = await data.confirm(otp);
            console.log(response);
            Alert.alert('Success', 'Phone number verified successfully.');
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to verify OTP. Please try again.');
        }
    }
    

    return (<>
        <View>
            <Text>Verification screen</Text>
            <View>
                <TextInput value={number} onChangeText={(d) => setnumber(d)} placeholder="Enter Number" style={styles.inputtext} />
            </View>
            <TouchableOpacity onPress={Sendotp}>
                <View>
                    <Text>SEND OTP</Text>
                </View>
            </TouchableOpacity >
            <View>
                <TextInput value={otp} onChangeText={(d) => setotp(d)} placeholder="Enter OTP" style={styles.inputtext} />
            </View>
            <TouchableOpacity onPress={Verifyotp}>
                <View>
                    <Text>VERIFY OTP</Text>
                </View>
            </TouchableOpacity>
        </View>
    </>)
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