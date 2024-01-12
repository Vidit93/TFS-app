import React, { useEffect, useState } from "react";
import { Text, View, FlatList, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
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
            const document = await firestore().collection('Food').doc('AjQABjbu2Nh8IqmYDNdy').get();
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
            <View style={styles.Container_view}>
                <View style={styles.top_view}>
                    <View style={styles.top_text_view}>
                        <Text style={styles.top_text}>Discover new </Text>
                        <Text style={styles.top_text}>Delicious just for you!</Text>
                    </View>
                </View>
                <View>
                    {Carousel()}
                </View>
                <View style={styles.category_text_view}>
                    <View style={styles.category_text_view}>
                        <Text style={styles.category_text}>MainCourse Categories</Text>
                    </View>
                </View>
                <View>
                    {Fooditemshow()}
                </View>
            </View>
        </>
    );
}


const styles = StyleSheet.create({

    top_text_view:{
        borderColor: 'green',
        // borderWidth: 2,
        borderRadius: 10,
        marginVertical:10
    },
    top_text:{
        fontSize: 20,
        color: 'black',
    },
    category_text_view: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 3
    },
    category_text: {
        fontSize: 20,
        // height: h * 0.07,
        // marginHorizontal: 25,
        color: 'black',
        // backgroundColor: '#C1C5FF',
        // borderColor: 'white',
        // borderWidth: 2,
        // borderRadius: 10,
        // marginBottom: 25,
    },
    box_container_view: {
    },
    box_text_view: {
        borderColor: 'red',
        borderWidth: 2,
        borderRadius: 10,
       marginHorizontal: 20,
       marginVertical: 8,
        width: 90,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    box_text:{
       
    },
    category_view: {
        // borderWidth: 2,
        // borderColor: 'blue',
        borderRadius: 10,
        height: h * .545,
        // width: w * .98,
        // flexDirection: 'row',
        // flexWrap: 'wrap',
        marginTop: 12
    }
})