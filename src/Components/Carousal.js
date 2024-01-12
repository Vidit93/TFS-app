import { StyleSheet, Text, View,Image,Dimensions,LogBox } from 'react-native'
import React from 'react'
import { SliderBox } from "react-native-image-slider-box";

const w=Dimensions.get('screen').width
const h=Dimensions.get('screen').height

const image=[
    // require('../images/images/photo1.png'),
    // require('../images/images/photo2.png'),
    // require('../images/images/photo3.png')
    "https://source.unsplash.com/1024x768/?nature",
    "https://source.unsplash.com/1024x768/?water",
    "https://source.unsplash.com/1024x768/?girl",
    "https://source.unsplash.com/1024x768/?tree",
]
const Carousel = () => {
  return (
    <View style={styles.cont}>
      <View style={styles.slider}>
      <SliderBox images={image} style={styles.slider_box}  circleLoop autoplay autoplayInterval={4000}/>
      </View>
    </View>
  )
}

export default Carousel

const styles = StyleSheet.create({
    cont:{
        // marginTop:10,
        // backgroundColor:'white'
        width:w*.9,
        height:h*.2,
        borderRadius: 10,
        overflow:'hidden',
    },
    slider_box:{
        width:w*.9,
        height:h*.2,
        // alignSelf:'center',
        borderRadius: 10,
        overflow:'hidden',
    },
    slider:{
        // marginVertical:h*.012,
        // marginHorizontal:w*.03,
        
        overflow:'hidden',
        elevation:20,
        backgroundColor:'white'
    }
})