import React, { useEffect, useState } from "react";
import { Text, View, FlatList, TouchableOpacity, StyleSheet, Dimensions, ImageBackground } from "react-native";
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Carousel from "../Components/Carousal";
const h = Dimensions.get('window').height;
const w = Dimensions.get('window').width;

export default function Cafescreen() {

    const navigation = useNavigation();
    const [food, setFood] = useState([]);

    useEffect(() => {
        getData();
        const update = firestore()
            .collection('cart')
            .doc('9414419911')
            .onSnapshot(() => {
                getData()
            });
        return () => {
            update();
        };
    }, []);

    const getData = async () => {
        console.log("getData me aaya");
        try {
            const document = await firestore().collection('Food').doc('aAeGIMjidxg3uiv6hkwi').get();
            const data = document._data;
            console.log('sara data ye he', data);

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
            console.log("Filtered food data", filteredFood);
        } catch (error) {
            console.log(error);
        }
    };

    function Menupage(item) {
        navigation.navigate("menu", { ...item });
    }


    const renderFoodItem = ({ item }) => (
        <TouchableOpacity onPress={() => Menupage(item)} >
            <View style={styles.box_container_view}>
                <View style={styles.box_text_view}>
                    <Text style={styles.box_text}>{item.category}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

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
            <ImageBackground
            source={require('../Images/img2.jpg')}
            style={{height:h, width:w}}
            >
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
                        <View style={styles.category_text_view}>
                            <Text style={styles.category_text}>FastFood Categories</Text>
                        </View>
                    </View>
                    <View>
                        {Fooditemshow()}
                    </View>
                </View>
            </ImageBackground>
        </>
    );
}


const styles = StyleSheet.create({

    Container_view: {
        // backgroundColor: 'white'
    },
    carousal_view:{
        alignSelf:'center',
        borderWidth:2,
        borderRadius:12
    },
    top_text_view: {
        borderColor: 'green',
        // borderWidth: 2,
        // borderRadius: 10,
        marginBottom: 10,
        // backgroundColor: 'orange',
        height: 60
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
        height: 40,
        // borderWidth: 2,
    },
    category_text: {
        fontSize: 23,
        color: 'black',
    },
    box_container_view: {
    },
    box_text_view: {
        // borderColor: 'red',
        borderWidth: 2,
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 8,
        width: 90,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'orange',
        elevation: 5,
    },
    box_text: {

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