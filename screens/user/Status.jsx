import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import globalStyle from '../styles/auth-styles'
import { Image } from 'react-native';
import { Surface } from 'react-native-paper';
import { Dimensions } from 'react-native';

export default function Status() {

    const laundry = 1;

    // RENDER THIS IF THERE IS NO LAUNDRY TO CHECK
    if(!laundry) {
        return(
            <View style={globalStyle.container} >
                <Surface elevation={2} style={styles.imgContainer}>
                    <Image  
                        source={require('../../assets/empty.jpg')}  
                        style={{ width: 200, height: 200 }}
                    />
                </Surface> 
                <Text style={styles.text}>
                    No laundry to check.
                </Text>
            </View>
        )
    }

    // RENDER IF THERE IS LAUNDRY TO CHECK
    return (
        <View style={styles.container}>
            <View style={[styles.row, styles.service]}>
                <Text style={styles.serviceText}>Service</Text>
                <View style={styles.row}>
                    <Text>Price: </Text>
                    <Text>990</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('screen').width - 60,
        alignSelf: 'center',
        paddingTop: 15
    },  
    text: {
        marginTop: 20, 
        fontSize: 22
    },
    imgContainer:{
        borderRadius: 20, 
        overflow: 'hidden',
    },
    serviceText: {
        fontSize: 25,
        color: '#00667E'
    },  
    row: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row', 
    },
    service: {
        justifyContent: 'space-between',
        backgroundColor: 'rgba(12, 122, 156, 0.18)',
        padding: 15
    }, 
})