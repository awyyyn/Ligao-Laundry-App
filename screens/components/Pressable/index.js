import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Pressable } from 'react-native'
import { Button, Text, Surface } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export default function index({icon, label, handleNav}) {

    return (
        <Pressable onPress={handleNav}>
            <Surface elevation={1} style={styles.pressablebtn}>  
                <View style={styles.left}>
                    <MaterialCommunityIcons name={icon} size={32} color="#00667E" />  
                    <Text style={styles.text} >{label}</Text> 
                </View>
                <MaterialCommunityIcons name='chevron-right' style={styles.left}  size={32} color="dimgrey" /> 
                
            </Surface>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    pressablebtn: {
        marginBottom: 20,
        padding: 10,
        display: 'flex',
        flexDirection: 'row',  
        alignItems: 'center',
        justifyContent: "space-between",
        borderRadius: 7

    }, 
    btnStyle: {
        fontSize: 50,
    },
    text: {
        color: "dimgrey",
        fontSize: 25,
        marginLeft: 10
    },
    right: {

    },
    left: { 
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
        
    }
})