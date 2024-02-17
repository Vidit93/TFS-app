import React, { useEffect, useState, useMemo, } from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert, ScrollView, Dimensions
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import RadioGroup from 'react-native-radio-buttons-group';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import arrow from '../Images/back.png'
import rupee from '../Images/rupee.png'
import delete1 from '../Images/delete1.png'
import minus from '../Images/minus.png'
import plus from '../Images/plus.png'
const w = Dimensions.get('screen').width;
const h = Dimensions.get('screen').height;


export default function Cartscreen() {
  const [cart, setcart] = useState([]);
  const [sum, setsum] = useState('');
  const [radioId, setradioId] = useState('');
  const navigation = useNavigation();


  function Backbutton() {
    navigation.goBack()
  }

  useEffect(() => {
    getData();
    console.log('cart ka data', cart);
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

  };

  async function Minusqty(item) {
    var q = item.qty;
    // console.log('qty function ke under',q);
    if (q > 1) {
      try {
        // console.log('try ke under aya');
        const userId = '9414419911';
        const cartRef = firestore().collection('cart').doc(userId);
        const cartDoc = await cartRef.get();

        if (cartDoc.exists) {
          // console.log('pehele if me aya');
          const existingProduct = cartDoc
            .data()
            .products.find(product => product.productId === item.Id);
          // console.log('existing product',existingProduct);
          if (existingProduct) {
            // console.log('existing check kra');
            // If the product exists, update its quantity
            const updatedCart = cartDoc.data().products.map(product => {
              if (product.productId === item.Id) {
                // console.log('condition check kra');
                return {
                  ...product,
                  quantity: product.quantity - 1,
                };
              }
              // console.log('qty update krdi');
              return product;
            });
            await cartRef.update({ products: updatedCart });
            getData();
            // console.log('cart update krdi');
          }
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    } else {
      Alert.alert('delete the item from cart');
    }
  }

  async function Plusqty(item) {
    var q = item.qty;
    if (q < 15) {
      try {
        // console.log('try ke under aya');
        const userId = '9414419911';
        const cartRef = firestore().collection('cart').doc(userId);
        const cartDoc = await cartRef.get();

        if (cartDoc.exists) {
          // console.log('pehele if me aya');
          const existingProduct = cartDoc
            .data()
            .products.find(product => product.productId === item.Id);
          // console.log('existing product',existingProduct);
          if (existingProduct) {
            // console.log('existing check kra');
            // If the product exists, update its quantity
            const updatedCart = cartDoc.data().products.map(product => {
              if (product.productId === item.Id) {
                // console.log('condition check kra');
                return {
                  ...product,
                  quantity: product.quantity + 1,
                };
              }
              // console.log('qty update krdi');
              return product;
            });
            await cartRef.update({ products: updatedCart });
            getData();
            // console.log('cart update krdi');
          }
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    } else {
      Alert.alert(`cannot add more quantity of ${item.Id}`);
    }
  }


  async function Deleteitem(item) {
    try {
      const userId = '9414419911';
      const cartRef = firestore().collection('cart').doc(userId);
      const cartDoc = await cartRef.get();

      if (cartDoc.exists) {
        const updatedCart = cartDoc.data().products.filter(product => product.productId !== item.Id);

        await cartRef.update({ products: updatedCart });
        getData();
        console.log('item deleted');
      }
    } catch (error) {
      console.error('Error deleting item from cart:', error);
    }
  }


  function renderCartItem({ item }) {
    const food = item.productData;
    console.log('food ka data', food);
    return (
      <>
        <View style={styles.card_view} >
          <View style={styles.card_image_view}>
            <Image source={{ uri: food.img }} style={styles.card_image} />
          </View>
          <View style={styles.card_content}>
            <View style={styles.card_text_container}>
              <View style={styles.card_text_view}>
                <Text style={styles.card_text}>{food.name}</Text>
              </View>
              <View style={styles.card_text_view}>
                <Image source={rupee} style={styles.rupee_icon} />
                <Text style={styles.card_text}>{food.rate}</Text>
              </View>
            </View>
            <View style={styles.btn_qty_view}>
              <View style={styles.card_qty_view}>
                <View style={styles.card_qty_content}>
                  <TouchableOpacity onPress={() => Minusqty(item)}>
                    <Image source={minus} style={styles.minus_icon} />
                  </TouchableOpacity>
                  <Text style={styles.qty_text}>{item.qty}</Text>
                  <TouchableOpacity onPress={() => Plusqty(item)}>
                    <Image source={plus} style={styles.plus_icon} />
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <TouchableOpacity onPress={() => Deleteitem(item)}>
                  <View style={styles.btn_view}>
                    <Image source={delete1} style={styles.delete_icon} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </>
    );
  }

  function Cartitemshow() {
    return (<>
      <View >
        <FlatList
          data={cart}
          renderItem={renderCartItem}
          keyExtractor={item => item.Id}
        />
      </View>
    </>)
  }



  function Radiobuttons() {

    const Dinein = useMemo(() => ([
      {
        id: '1',
        label: 'DineIn',
      },
    ]), []);

    const Takeaway = useMemo(() => ([
      {
        id: '2',
        label: 'Take away',
      },
    ]), []);

    const Delivery = useMemo(() => ([
      {
        id: '3',
        label: 'Delivery',
      },
    ]), []);

    return (<>
      <View style={styles.radio_container_view}>
        <View>
          <RadioGroup
            radioButtons={Dinein}
            onPress={setradioId}
            selectedId={radioId}
          />
        </View>

        <View>
          <RadioGroup
            radioButtons={Takeaway}
            onPress={setradioId}
            selectedId={radioId}
          />
        </View>

        <View>
          <RadioGroup
            radioButtons={Delivery}
            onPress={setradioId}
            selectedId={radioId}
          />
        </View>
      </View>
    </>)
  }


  async function Checkout() {
   if (cart!='') {
    if (radioId) {
      await AsyncStorage.setItem('Method', radioId);
      navigation.navigate('address',)
    } else {
      Alert.alert('select method first')
    }
   } else {
    Alert.alert('Add to cart first')
   }
  }

  console.log('sum ki value', sum);
  return (
    <>
      {cart ?
        <View style={styles.container_view}>
          <View style={styles.buttonview}>
            <View>
              <TouchableOpacity onPress={Backbutton}>
                <View style={styles.arrowview}>
                  <Image source={arrow} style={styles.arrow} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.cart_text_view}>
              <Text style={styles.cart_text}>CART</Text>
            </View>
          </View>
          <View style={styles.cart_view}>
            {Cartitemshow()}
          </View>
          <View style={styles.bottom_container_view}>
            <View style={styles.subtotal_container_view}>
              <View style={styles.subtotal_view}>
                <Text style={styles.subtotal_text}>SubTotal:</Text>
              </View>
              <View style={styles.subtotal_value_view}>
                <Image source={rupee} style={styles.rupee_icon_bottom} />
                <Text style={styles.subtotal_value}> {sum}</Text>
              </View>
            </View>
            <View style={styles.delivery_view}>
              <Text style={styles.delivery_text_view}>Delivery:</Text>
              {radioId == '3' ? <Text style={styles.delivery_text}>Free</Text> : <Text style={styles.delivery_text}> --</Text>}
            </View>
            <View style={styles.subtotal_container_view}>
              <View style={styles.subtotal_view}>
                <Text style={styles.subtotal_text}>Total:</Text>
              </View>
              <View style={styles.total_value_view}>
                <Image source={rupee} style={styles.rupee_icon_bottom} />
                <Text style={styles.subtotal_value}> {sum}</Text>
              </View>
            </View>
          </View>
          <View style={styles.radio_button_view}>
            {Radiobuttons()}
          </View>
          <View style={styles.checkoutContainer}>
            <TouchableOpacity onPress={Checkout}>
              <View style={styles.checkoutButton}>
                <Text style={styles.checkoutButtonText}>CHECK OUT</Text>
              </View>
            </TouchableOpacity>
          </View>

        </View> :
        <View>
          <Text>Empty cart</Text>
        </View>
      }
    </>);
}

const styles = StyleSheet.create({
  container_view: {
    backgroundColor: '#a0b1e7'
  },
  buttonview: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  arrow: {
    width: w * 0.095,
    height: h * 0.05,
    marginLeft: w * .04,
    // marginTop: h * .015,
  },
  cart_text_view: {
    // borderWidth:2,
    marginLeft: 110,

    //  justifyContent: 'center',
    //  alignItems: 'center',
  },
  cart_text: {
    fontSize: 28,
    fontWeight: '700',
    color: 'black',
    marginTop: 60
  },
  card_view: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 17,
    borderRadius: 10,
    shadowColor: '#000', // Shadow color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25, // Opacity of the shadow
    shadowRadius: 3.84, // Radius of the shadow
    elevation: 5, // Android elevation (affects shadow appearance)
    backgroundColor: '#fff', // Background color of the card
    marginBottom:8
  },
  cart_view: {
    // borderWidth: 2,
    // borderColor: 'blue',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    height: h * .485,
    backgroundColor: 'white',
    marginTop: 40,
    overflow: 'hidden',
  },
  card_image_view: {
    justifyContent: 'center',
    marginLeft: 3
  },
  card_image: {
    width: 70,
    height: 70,
    borderRadius: 70,
    justifyContent: 'center'
  },
  card_content: {
    flexDirection: 'row',
    // margin: 20
  },
  card_text_container: {
    // borderWidth:2,
    width: 170
  },
  card_text_view: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: 7,
  },
  card_text: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
    // borderWidth:2
  },
  btn_qty_view: {
    alignItems: 'center',
    // marginVertical:7
    marginTop: 7
  },
  card_qty_view: {
    flexDirection: 'row',
    // marginLeft: 20,

    // marginVertical:4
  },
  card_qty_content: {
    flexDirection: 'row',
    marginBottom: 7,
    // borderWidth: 2,
    borderRadius: 20,
    backgroundColor: '#a0b1e7',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  minus_icon: {
    width: 18,
    height: 18,
    // marginRight: 7,
    marginHorizontal: 7,
    marginVertical: 5
  },
  qty_text: {
    fontSize: 15,
    color: 'black',
  },
  plus_icon: {
    marginLeft: 7,
    width: 18,
    height: 18,
    // backgroundColor:'white',
    borderRadius: 20,
    marginHorizontal: 7,
    marginVertical: 4
  },
  btn_view: {
    // marginLeft: 10,
  },
  bottom_container_view: {
    backgroundColor: 'white'
  },
  subtotal_container_view: {
    flexDirection: 'row',
    marginVertical: 4,
    marginHorizontal: 7
  },
  subtotal_text: {
    // fontWeight:'700',
    color: 'black',
    fontSize: 15,
    // backgroundColor:"red"
  },
  subtotal_value_view: {
    flexDirection: 'row',
    marginLeft: 250,
    // justifyContent:'center',
    alignItems: 'center'
  },
  subtotal_value: {
    color: 'black',
  },
  total_value_view: {
    flexDirection: 'row',
    marginLeft: 279,
    // justifyContent:'center',
    alignItems: 'center'
  },
  rupee_icon_bottom: {
    // height:18
  },
  radio_container_view: {
    flexDirection: 'row',
    backgroundColor: "white",
    gap: 15,
    paddingVertical:5,
    justifyContent: 'center'
  },
  delivery_view: {
    marginHorizontal: 7,
    flexDirection: "row",

  },
  delivery_text_view: {
    // fontWeight:'700',
    color: 'black',
    fontSize: 15,
  },
  delivery_text: {
    marginLeft: 284,
    color: 'black',
  },
  checkoutContainer: {
    backgroundColor:"white",
    alignItems:"center",
    
  },
  checkoutButton: {
    backgroundColor: '#a0b1f7',
    padding: 10,
    borderRadius: 5,
    width:250,
    marginBottom:15
  },
  checkoutButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
});
