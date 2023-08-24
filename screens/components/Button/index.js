import { View, Text } from 'react-native'
import React from 'react'
import { Button } from 'react-native-paper'

export default function index({
    title,
    mode,
    handlePress,
    bgColor,
    styles,
    textColor, 
    disable
}) {

    return (
        <Button 
            style={styles}
            mode={mode}
            onPress={handlePress} 
            buttonColor={ bgColor}
            textColor={textColor} 
            disabled={disable} 
        >
            {title}
        </Button>       
    )
}