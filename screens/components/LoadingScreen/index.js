import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import { ActivityIndicator } from 'react-native-paper'

export default function index() {
  return (
    <View
        style={{
            display: 'flex',
            width: Dimensions.get('screen').width,
            height: Dimensions.get('screen').height,
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(70, 102, 126, 0.56)', 
            zIndex: 9999
        }}
    >
        <ActivityIndicator  
            animating
            color='whitesmoke'
            size={50}
        />   
    </View>
  )
}