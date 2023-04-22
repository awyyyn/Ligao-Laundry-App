 
import React from 'react'
import { HelperText } from 'react-native-paper';

export default function index({label, handlePress}) {
    
    return (
        <HelperText 
            onPress={handlePress}
            type='info' 
            style={{alignSelf: 'flex-end', fontSize: 15 }}
        >
            {label}
        </HelperText>
    );
}