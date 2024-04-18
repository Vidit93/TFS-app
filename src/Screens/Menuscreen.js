import React, { useEffect, useState } from "react";
import {StatusBar,Text, View, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';
import arrow from '../Images/back.png'
import cart from '../Images/cart1.png'
import rupee from '../Images/rupee.png'
import plus from '../Images/plus.png'
import AsyncStorage from '@react-native-async-storage/async-storage';

const w = Dimensions.get('screen').width;
const h = Dimensions.get('screen').height;

export default function MenuScreen({ navigation }) {
  const route = useRoute();
  const { category, itemDetails } = route.params;
  const details = itemDetails.map(item => item.details);

  // useEffect(() => {
  // }, []);

  function Backbutton() {
    navigation.goBack()
  }
  function Cartbutton() {
    navigation.navigate('Cart')
  }

  const addToCart = async (item) => {
    const phn = await AsyncStorage.getItem('PHN');
    try {
      // const userId = '9414419911';
      const userId = phn;
      const cartRef = firestore().collection('cart').doc(userId);
      const cartDoc = await cartRef.get();

      if (cartDoc.exists) {
        // If the user already has a cart, check if the product exists
        const existingProduct = cartDoc.data().products.find(product => product.productId === item.name);

        if (existingProduct) {
          // If the product exists, update its quantity
          const updatedCart = cartDoc.data().products.map(product => {
            if (product.productId === item.name) {
              return {
                ...product,
                quantity: product.quantity + 1,
              };
            }
            return product;
          });

          await cartRef.update({ products: updatedCart });
        } else {
          // If the product doesn't exist, add it to the cart
          const updatedCart = [...cartDoc.data().products, { productId: item.name, quantity: 1, productData: item }];
          await cartRef.update({ products: updatedCart });
        }
      } else {
        // If the user doesn't have a cart, create a new one
        await cartRef.set({ products: [{ productId: item.name, quantity: 1, productData: item }] });
      }

      console.log("Item added to cart:", item.name);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  function Foodcardshow() {
    return (<>
      <View style={styles.flatlist_view}>
        <FlatList
          data={details}
          renderItem={({ item }) => Rendercard(item)}
          keyExtractor={(detail) => detail.name}
        />
      </View>
    </>)
  }

  function Rendercard(item) {
    return (<>
      <View style={styles.card_view}>
        <View style={styles.card_image_view} >
          <Image source={{ uri: item.img }} style={styles.card_image} />
        </View>
        <View style={styles.card_text_container}>
          <View style={styles.card_text_view}>
            <Text style={styles.card_text}>{item.name}</Text>
          </View>
          <View style={styles.card_text_view}>
            <Image source={rupee} style={styles.rupee_icon} />
            <Text style={styles.card_text}>{item.rate}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => addToCart(item)}  style={styles.btn_container_view}>
          <View style={styles.btn_view}>
            <Image source={plus} style={styles.plus_icon} />
          </View>
        </TouchableOpacity>
      </View>
    </>)
  }

  return (
    <>
    <StatusBar backgroundColor="#07afaa" />
      <View style={styles.container_view}>
        <View style={styles.buttonview}>
          <View>
            <TouchableOpacity onPress={Backbutton}>
              <View style={styles.arrowview}>
                <Image source={arrow} style={styles.arrow} />
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={Cartbutton}>
              <View style={styles.arrowview}>
                <Image source={cart} style={styles.cart} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.category_view}>
          <Text style={styles.category_text}>{category}</Text>
        </View>
        <View style={styles.foodcard_view}>
          {Foodcardshow()}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container_view: {
    backgroundColor: '#07afaa'
  },
  buttonview: {
    flexDirection: 'row'
  },
  arrow: {
    width: w * 0.095,
    height: h * 0.05,
    marginLeft: w * .04,
    marginTop: h * .02,
  },
  cart: {
    width: w * 0.08,
    height: h * 0.035,
    marginLeft: w * .7,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
    marginTop: h * .025,
  },
  category_view: {
    // backgroundColor:'yellow',
    height: h * .15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  category_text: {
    fontSize: 30,
    fontWeight: '900',
    paddingBottom: 20,
    color: 'black'
  },
  flatlist_view: {
    // backgroundColor: 'red',
    marginTop: 55,
    // borderWidth:
  },
  foodcard_view: {
    backgroundColor: 'white',
    height: h*.8,
    borderTopLeftRadius: 100,
    // marginLeft:2,
    // borderWidth:2,
    // width:w*.98
  },
  card_view: {
    flexDirection: 'row',
    marginHorizontal:15,
    marginVertical: 8,
    borderWidth: 1,
    // elevation: 5,
    height:80,
    borderRadius:15,
    backgroundColor:'green'
  },
  card_image_view:{
    justifyContent:'center',
    marginLeft:3
  },
  card_image: {
    width: 70,
    height: 70,
    borderRadius: 70,
    justifyContent:'center'
   },
  rupee_icon:{
    height:19,
    width:12,
    marginRight:3
  },
  card_text_container:{
    width:170,
    // borderWidth:2
  },
  card_text_view:{
    flexDirection:'row',
    alignItems: 'center',
    marginVertical: 6,
    marginHorizontal: 8,
  },
  card_text: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
    // borderWidth:2
  },
  btn_container_view:{
    // borderWidth:2,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  btn_view: {
    // marginLeft: 10,
    // borderWidth:2,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor:'green',
    borderRadius:15
  },
  plus_icon:{
    // fontSize:18,
    // color:'black',
    marginHorizontal:45,
    // marginVertical:5,
    // fontWeight:'700'
  },
  card_view: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  card_image_view: {
    marginRight: 16,
  },
  card_image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  card_text_container: {
    flex: 1,
  },
  card_text_view: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  card_text: {
    fontSize: 16,
    color: '#333',
  },
  rupee_icon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  btn_container_view: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
  },
  btn_view: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  plus_icon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
});
