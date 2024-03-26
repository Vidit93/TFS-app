import PushNotification from "react-native-push-notification";
import { PermissionsAndroid } from 'react-native';

 export const RequestNotificationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      {
        title: 'Notification Permission',
        message: 'We would like to send you notifications for important updates.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Notification permission granted');
    } else {
      console.log('Notification permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};


export const OTPNotification = async (otp) => {
    console.log("notification me aya he");
  try {
    PushNotification.localNotificationSchedule({
    channelId: 'channel-id',
    title: "OTP Verification", 
    message: `Your OTP for verification is: ${otp}`, 
    date: new Date(Date.now()),
      allowWhileIdle: true,
    // repeatType: "day",
    // repeatTime: 3*24 * 60 * 60 * 1000,
  });
  } catch (error) {
    console.warn('Permission denied or error:', error);
  }
};
export const OrderNotification = async () => {
  try {
    PushNotification.localNotificationSchedule({
    channelId: 'channel-id',
    title: "ORDER PLACED 🎉", 
    message: "Your order has been successfully placed! 🎉 Thank you for choosing The Food Station. Your delicious meal will be on its way shortly. Bon appétit!🎉", 
    date: new Date(Date.now()),
      allowWhileIdle: true,
    // repeatType: "day",
    // repeatTime: 3*24 * 60 * 60 * 1000,
  });
  } catch (error) {
    console.warn('Permission denied or error:', error);
  }
};

export const CancelAllNotifications = () => {
  PushNotification.cancelAllLocalNotifications();
};