import { View, Text } from 'react-native'
import React from 'react'
import { Button } from 'react-native-paper'
import { useDispatch } from 'react-redux' 
import { toggleEditName } from '../../../features/uxSlice';

export default function index({handlePress}) {
    const dispatch = useDispatch();
    return ( 
        <Button
            style={{
                marginTop: 5, 
                borderRadius: 8
            }}
            mode='text'
            textColor='red'
            onPress={handlePress}
        >
            Cancel
        </Button>
    )
}
