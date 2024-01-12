import React, { useEffect, useState } from "react";
import { Text, View, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';
import arrow from '../Images/back.png'
import cart from '../Images/cart.png'

const w = Dimensions.get('screen').width;
const h = Dimensions.get('screen').height;

export default function MenuScreen({ navigation }) {
  const route = useRoute();
  const { category, itemDetails } = route.params;
  const details = itemDetails.map(item => item.details);

  useEffect(() => {
    // console.log("category ka data", category);
    // console.log("route ka data", route);
    // console.log("items ka data", itemDetails);
    // console.log("items ka data filter ke bad", details);
    // console.log('cart ka data add ke bad', cart);
  }, []);

  function Backbutton() {
    navigation.goBack()
  }
  function Cartbutton() {
    navigation.navigate('cart')
  }

  const addToCart = async (item) => {
    try {
      const userId = '9414419911';
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
      <View>
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
        <View>
          <Image source={{ uri: item.img }} style={styles.card_image} />
        </View>
        <View>
          <View>
            <Text>Name: {item.name}</Text>
          </View>
          <View>
            <Text>Rate: {item.rate}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => addToCart(item)}>
          <View style={styles.btn_view}>
            <Text>Add To Cart</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>)
  }

  return (
    <>
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
    backgroundColor: '#15B3ED'
  },
  buttonview:{
    flexDirection:'row'
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
    paddingBottom:20,
    color:'black'
  },
  foodcard_view: {
    backgroundColor: 'white',
    height: h,
    borderTopLeftRadius: 100,
    // marginTop:20
  },
  card_view: {
    flexDirection: 'row',
    margin: 20,
     borderWidth: 2,
  },
  card_image: {
    width: 70,
    height: 70,
    borderRadius: 60,
    // backgroundColor:'b'
  },
  btn_view: {
    marginLeft: 10
  }
});
