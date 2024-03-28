import { StyleSheet, Text, View,Image,Dimensions,LogBox } from 'react-native'
import React from 'react'
import { SliderBox } from "react-native-image-slider-box";

const w=Dimensions.get('screen').width
const h=Dimensions.get('screen').height

const image=[
    require('../Images/img1.jpg'),
    require('../Images/img2.jpg'),
    require('../Images/img4.jpeg'),
    // "https://in.pinterest.com/pin/543528248773059050/",
]
const Carousel = () => {
  return (
    <View style={styles.cont}>
      <View style={styles.slider}>
      <SliderBox
        images={image}
        autoplay
        circleLoop
        autoplayInterval={4000}
        sliderBoxHeight={300} // Set the height of the slider box
        dotColor="#FFEE58" // Color of the pagination dots
        inactiveDotColor="#90A4AE" // Color of inactive pagination dots
        paginationBoxVerticalPadding={20} // Padding for pagination box
        paginationBoxStyle={{
          position: 'absolute',
          bottom: 0,
          padding: 0,
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'center',
          paddingVertical: 10,
        }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 0,
          padding: 0,
          margin: 0,
          backgroundColor: 'rgba(128, 128, 128, 0.92)',
        }}
      />
      </View>
    </View>
  )
}

export default Carousel

const styles = StyleSheet.create({
    cont:{
        // marginTop:10,
        // backgroundColor:'white'
        width:w,
        height:h*.25,
        // borderRadius: 10,
        overflow:'hidden',
    },
    slider_box: {
      width:w*.95,
      height:h*.25,
      // borderRadius: 10,
      overflow: 'hidden', // Hide overflow content
      elevation: 5, // Elevation for shadow effect (Android)
      shadowColor: '#000', // Shadow color
      shadowOpacity: 0.3, // Shadow opacity
      shadowRadius: 4, // Shadow radius
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },
    slider:{
        overflow:'hidden',
        elevation:20,
        backgroundColor:'white'
    }
})