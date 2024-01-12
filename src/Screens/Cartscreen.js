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
const w = Dimensions.get('screen').width;
const h = Dimensions.get('screen').height;


export default function Cartscreen() {
  const [cart, setcart] = useState([]);
  const [sum, setsum] = useState('');
  const [radioId, setradioId] = useState('');
  const navigation = useNavigation();


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
          <View>
            <Image source={{ uri: item.img }} style={styles.card_image} />
          </View>
          <View style={styles.card_content}>
            <View>
              <View>
                <Text>Name: {food.name}</Text>
              </View>
              <View>
                <Text>Rate: {food.rate}</Text>
              </View>
            </View>
            <View>
              <View style={styles.card_qty_view}>
                <View>
                  <Text>Quantity: </Text>
                </View>
                <View style={styles.card_qty_content}>
                  <TouchableOpacity onPress={() => Minusqty(item)}>
                    <Text style={styles.qty_minus}>minus</Text>
                  </TouchableOpacity>
                  <Text>{item.qty}</Text>
                  <TouchableOpacity onPress={() => Plusqty(item)}>
                    <Text style={styles.qty_plus}>plus</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <TouchableOpacity onPress={() => Deleteitem(item)}>
                  <View style={styles.btn_view}>
                    <Text>Delete</Text>
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
      <View style={styles.cart_view}>
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
      <View>
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
    if (radioId) {
      await AsyncStorage.setItem('Method', radioId);
      navigation.navigate('address',)
    } else {
      Alert.alert('select method first')
    }
  }

console.log('sum ki value',sum);
  return (
    <>
      {cart ?
        <View>
          <View>
            {Cartitemshow()}
          </View>
          <View>
            <View>
              <Text>SubTotal: {sum}</Text>
            </View>
            <View>
              {radioId == '3' ? <Text>Delivery: Free</Text> : <Text>Delivery: --</Text>}
            </View>
            <View>
              <Text>Total: {sum}</Text>
            </View>
          </View>
          <View>
            {Radiobuttons()}
          </View>
          <View>
            <TouchableOpacity onPress={Checkout}>
              <View>
                <Text>CHECK OUT</Text>
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
  card_view: {
    flexDirection: 'row',
    margin: 20,
    borderWidth: 2,
    borderColor: 'red',
    borderRadius: 10,
  },
  cart_view: {
    borderWidth: 2, 
    borderColor: 'blue', 
    borderRadius: 10,
    height: h * .6
  },
  card_image: {
    width: 70,
    height: 70,
  },
  card_content: {
    flexDirection: 'row',
    // margin: 20
  },
  card_qty_view: {
    flexDirection: 'row',
    marginLeft: 20,
  },
  card_qty_content: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  qty_minus: {
    fontSize: 15,
    marginRight: 7,
  },
  qty_plus: {
    fontSize: 15,
    marginLeft: 7,
  },
  btn_view: {
    marginLeft: 10,
  },
});
