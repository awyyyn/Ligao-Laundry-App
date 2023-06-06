import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import { ActivityIndicator } from 'react-native-paper'

export default function LoadingV2() {
  return (
    <View
        style={{
            display: 'flex', 
            height: Dimensions.get('window').height - 50,
            width: Dimensions.get('screen').width,
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