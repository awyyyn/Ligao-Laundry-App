import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useEffect } from 'react'
import { Loading } from '../components'
import { supabase } from '../../supabaseConfig.js'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { setSession } from '../../features/userSlice'
import { setLoadingFalse } from '../../features/uxSlice'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Dimensions } from 'react-native'

export default function Logout() {
    const dispatch = useDispatch()
    const navigation = useNavigation();
    const logout = async() => {
        dispatch(setSession(null)) 
        await AsyncStorage.clear()
        await supabase.auth.signOut();
        navigation.navigate('signin')
    }

    setTimeout(() => {
        logout();
    }, 1000);
    
    return (
        // <Loading />
        <SafeAreaView style={styles.container}> 
            <Image
                style={styles.image}
                source={require('../../assets/splash.png')}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        // backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        height: Dimensions.get('screen').height,
        width: Dimensions.get('screen').width
    },
    image: {
        position: 'absolute',
        height: '100%',
        width: '100%'
    },
    logout: {
        fontSize: 30
    }
})