import React, { useState, useEffect } from 'react';
import {
    View, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Text, Animated
    , Easing, Dimensions, Image
} from 'react-native';
import SendIntentAndroid from 'react-native-send-intent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OTPNotification } from '../Notifications/Notifications';
import PushNotification from "react-native-push-notification";
import { useNavigation } from '@react-navigation/native';
import user from '../Images/user.png'
const h = Dimensions.get('window').height;
const w = Dimensions.get('window').width;
// import SendSMS from 'react-native-sms'
// import Communications from 'react-native-communications';
// import OTPInputView from 'react-native-otp-input';

export default function PhoneNumberValidation() {
    const navigation = useNavigation();
    const [phoneNumber, setPhoneNumber] = useState('');
    // const [OTP, setOtp] = useState('');
    const [OTP, setOtp] = useState(['', '', '', '']);
    const animatedValue = new Animated.Value(0);

    useEffect(() => {
        Createchannel();
    }, []);

    const startButtonAnimation = () => {
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();
    };
    const buttonScale = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.9],
    });

    async function validatePhoneNumber() {
        const phoneRegex = /^[0-9]{10}$/;
        generateOTP();

        if (phoneRegex.test(phoneNumber)) {
            Alert.alert('Valid Phone Number', 'The entered phone number is valid.');
            const otp = await AsyncStorage.getItem('OTP');
            await AsyncStorage.setItem('PHN', phoneNumber);
            // console.log("func ke under ki otp", otp);
            // console.log("func ke under ka number",phoneNumber);
            // sendOtpViaSMS(phoneNumber, otp);
            OTPNotification(otp);
            // SendSms(otp)
            // handleSendMessage();
        } else {
            Alert.alert('Invalid Phone Number', 'Please enter a valid phone number.');
        }
        startButtonAnimation();
    }

    // const handleSendMessage = () => {
    //     const phoneNumber = '8949099871';
    //     const message = 'Hello, this is a test message!';
    //     Communications.text(phoneNumber, message)
    //         .then(() => {
    //             console.log('SMS application opened');
    //             // Optionally, you can handle success here
    //         })
    //         .catch((error) => {
    //             console.error('Error opening SMS application:', error);
    //         });
    // };


    // async function SendSms(otp) {
    //     SendSMS.send({
    //         body: `The default body of the SMS!${otp}`,
    //         recipients: ['8949099871'],
    //         successTypes: ['sent', 'queued'],
    //         allowAndroidSendWithoutReadPermission: true
    //     }, (completed, cancelled, error) => {

    //         console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);

    //     });
    // }    


    // async function sendOtpViaSMS(phoneNumber, otp) {
    //     console.log("func ke under ki otp1", otp);

    //     const message = `Your OTP for verification is: ${otp}`;
    //     const intentType = SendIntentAndroid.TEXT_PLAIN;
    //     const extras = { 'android.intent.extra.TEXT': message };

    //     try {
    //         await SendIntentAndroid.sendSms(phoneNumber, message,intentType,extras);
    //         console.log("SMS sent successfully");
    //         console.log("func ke under ka number1", phoneNumber);
    //     } catch (error) {
    //         console.error('Error sending SMS', error);
    //     }
    //     // console.log("func ke under ka number2", phoneNumber);
    // }


    async function generateOTP() {
        const otp = Math.floor(1000 + Math.random() * 9000);
        // console.log("Generated OTP:", otp);
        const otp1 = otp.toString();
        await AsyncStorage.setItem('OTP', otp1);
        // console.log("Generated OTP1:", otp1);
    }

    const handleOtpVerification = async () => {
        // const OTP = 
        const votp = await AsyncStorage.getItem('OTP');
        // console.log('Verifying OTP:', OTP);
        const otpString = OTP.join('');
        // console.log(otpString);
        // console.log('Verifying votp:', votp);
        if (otpString === votp) {
            navigation.navigate('cafe')
        } else {
            Alert.alert('entered otp is not correct')
        }
        startButtonAnimation();
    };

    const handleOtpChange = (index, value) => {
        const newOtp = [...OTP];
        newOtp[index] = value;
        setOtp(newOtp);
        // console.log("array vali otp", newOtp);
        if (value && index < 3) {
            // Move focus to the next input field
            refs[index + 1].focus();
        }
    };
    const refs = [];

    function Createchannel() {
        PushNotification.createChannel(
            {
                channelId: 'channel-id',
                channelName: 'Channel Name',
                channelDescription: 'Channel Description',
                playSound: true,
                soundName: 'default',
                importance: 4,
                vibrate: true,
            },
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.verification_view}>
                <View style={styles.userview}>
                    <Image source={user} style={styles.user} />
                </View>
                <View >
                    <Text style={styles.verification_text}>User Verification</Text>
                </View>
            </View>
            <View style={styles.input_container}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={(text) => setPhoneNumber(text)}
                />
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <TouchableOpacity style={styles.button} onPress={validatePhoneNumber}>
                        <Text style={styles.buttonText}>Send OTP</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
            <View style={styles.input_container}>
                <View style={styles.inputView}>
                    {OTP.map((digit, index) => (
                        <TextInput
                            key={index}
                            style={styles.otp_input}
                            keyboardType="numeric"
                            maxLength={1}
                            value={digit}
                            onChangeText={(text) => handleOtpChange(index, text)}
                            ref={(inputRef) => {
                                refs[index] = inputRef;
                            }}
                        />
                    ))}
                </View>
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <TouchableOpacity style={styles.button} onPress={handleOtpVerification}>
                        <Text style={styles.buttonText}>Verify OTP</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    verification_view: {
        marginBottom: 40,
        height: 120,
        alignItems: 'center'
    },
    user: {
        // margin:6
    },
    verification_text: {
        fontSize: 19,
        color: 'black',
        fontWeight: '500',
    },
    input_container: {
        marginBottom: 50,
    },
    inputView: {
        flexDirection: 'row',
    },
    input: {
        width: w * 0.8,
        height: 50,
        borderColor: '#007bff',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 18,
        backgroundColor: '#fff',
    },
    otp_input: {
        width: w * 0.15,
        height: 50,
        marginLeft: 16,
        borderColor: '#007bff',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 18,
        backgroundColor: '#fff',
        textAlign: 'center',

    },
    button: {
        width: w * 0.8,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#007bff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});