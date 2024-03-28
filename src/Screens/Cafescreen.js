import React, { useEffect, useState } from "react";
import { Text, View, FlatList, TouchableOpacity, StyleSheet, Dimensions, ImageBackground } from "react-native";
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Carousel from "../Components/Carousal";
import LottieView from 'lottie-react-native';
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';
const h = Dimensions.get('window').height;
const w = Dimensions.get('window').width;

export default function Cafescreen() {

    const navigation = useNavigation();
    const [food, setFood] = useState([]);
    const [foodimg, setFoodimg] = useState([]);
    const [loading, setloading] = useState(false);

    useEffect(() => {
        getData();
        Createchannel();
        const timeout = setTimeout(() => {
            setloading(true);
          }, 2300);
        Cartupdate();
        return () => {
            Cartupdate();
            clearTimeout(timeout);
        };
    }, []);

    async function Cartupdate(){
        const phn = await AsyncStorage.getItem('PHN');
        
         firestore()
            .collection('cart')
            .doc(phn)
            .onSnapshot(() => {
                getData();
                // getimgData();
            });
    }
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
          // (created) => console.log(`Channel created: ${created}`),
        );
      }

    function Animation() {
        return (
            <>
                <View style={{flex:1}}>
                    <LottieView style={{ width: w, height: h }} source={require('../Animations/Animation1.json')} autoPlay loop />
                </View>
            </>
        )
    }

    const getData = async () => {
        console.log("getData me aaya");
        try {
            const document = await firestore().collection('Food').doc('aAeGIMjidxg3uiv6hkwi').get();
            const data = document._data;
            // console.log('sara data ye he', data);

            const filteredFood = Object.keys(data || {}).map(category => ({
                category,
                // items: Object.keys(data[category] || {}),
                itemDetails: Object.keys(data[category] || {}).map(itemName => ({
                    itemName,
                    details: {
                        ...data[category][itemName],
                        img: data[category][itemName].img || null
                    }
                })),
            }));

            setFood(filteredFood);
            // console.log("Filtered food data", filteredFood);
        } catch (error) {
            console.log(error);
        }
    };

    async function Menupage(item) {
        const phn = await AsyncStorage.getItem('PHN');
       if (phn) {
        navigation.navigate("menu", { ...item });
       } else {
        navigation.navigate("verification");
       }
    }


    const renderFoodItem = ({ item }) => {
        // const matchedImgData = foodimg.find(imgItem => imgItem.category === item.category);
        // console.log("matched data", matchedImgData);

        return (
            <TouchableOpacity onPress={() => Menupage(item)} >
                <View >
                    <View style={styles.box_text_view}>
                        <Text style={styles.box_text}>{item.category}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };



    function Fooditemshow() {
        return (<>
            <View style={styles.category_view}>
                <FlatList
                    numColumns={3}
                    data={food}
                    renderItem={renderFoodItem}
                    keyExtractor={(category) => category.category}
                />
            </View>
        </>)
    }

    return (
        <>
           {loading? 
            <View style={styles.Container_view}>
            <View style={styles.top_view}>
                <View style={styles.top_text_view}>
                    <Text style={styles.top_text}>Discover new </Text>
                    <Text style={styles.top_text}>Delicious just for you!</Text>
                </View>
            </View>
            <View style={styles.carousal_view}>
                {Carousel()}
            </View>
            <View style={styles.category_text_view}>
                {/* <View style={styles.category_text_view}>
                    <Text style={styles.category_text}>FastFood Categories</Text>
                </View> */}
            </View>
            <View style={styles.box_container_view}>
                {Fooditemshow()}
            </View>
        </View>
        :
        Animation()}

        </>
    );
}


const styles = StyleSheet.create({

    Container_view: {
        // backgroundColor: '#07afaa'
    },
    carousal_view: {
        alignSelf: 'center',
        // borderWidth: 2,
        borderRadius: 12,
        // backgroundColor:"red"
    },
    top_text_view: {
        // borderColor: 'green',
        // borderWidth: 2,
        // borderRadius: 10,
        marginBottom: 10,
        // backgroundColor: '#07afaa',
        height: 60,
        justifyContent: "center",
        // alignItems:"center"
        // backgroundColor:"#a0b1e7",
        // paddingBottom:10
        // flex:1
    },
    top_text: {
        fontSize: 20,
        color: 'black',
        marginLeft: 5
    },
    category_text_view: {
        alignItems: 'center',
        justifyContent: 'center',
        // marginTop: 3,
        // backgroundColor: 'white',
        // height: 40,
        // borderWidth: 2,
    },
    category_text: {
        fontSize: 23,
        color: 'black',
    },
    box_container_view: {
        backgroundColor: "white",
        height: h,
        paddingTop: 5
    },
    box_text_view: {
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 17,
        width: 90,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#07afaa',
        elevation: 9, // For shadow on Android
        shadowColor: '#000000', // Shadow color
        shadowOpacity: 0.2, // Shadow opacity
        shadowOffset: {
            width: 0, // Horizontal shadow offset
            height: 2, // Vertical shadow offset
        },
        shadowRadius: 4, // Shadow radius
    },
    box_text: {
        color: "black",
        fontWeight: '500',
    },
    category_view: {
        // borderWidth: 2,
        // borderColor: 'blue',
        borderRadius: 10,
        height: h * .57,
        // width: w * .98,
        // flexDirection: 'row',
        // flexWrap: 'wrap',
        marginTop: 12,
        // backgroundColor: 'white'
    }
})