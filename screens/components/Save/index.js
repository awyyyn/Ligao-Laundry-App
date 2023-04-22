import { View, Text } from 'react-native'
import React from 'react'
import { Button } from 'react-native-paper' 

export default function index({handlePress, disable}) {
    
    return (
        <Button
            disabled={disable ? true : false}
            mode='text'
            textColor='green'
            style={{
                marginTop: 5, 
                borderRadius: 8 
            }}
            onPress={handlePress}
        >
            Save
        </Button>
    )
}