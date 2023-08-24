import { View, Text, StyleSheet, Image } from 'react-native'
import { StackActions } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { Loading } from '../components'
import { supabase } from '../../supabaseConfig.js'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { removeUser, setSession, setUser } from '../../features/userSlice'
import { setLoadingFalse } from '../../features/uxSlice'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Dimensions } from 'react-native'

export default function Logout() {

    const dispatch = useDispatch() 
    console.log('asdasdasd')
    const navigation = useNavigation()

    const logout = async() => {
        const { data } = await supabase.auth.getSession();
        if(data.session == null) { 
            navigation.dispatch(
                StackActions.replace('signin')
            )
        }
        dispatch(setSession(null)) 
        dispatch(removeUser())
        await AsyncStorage.clear()
        await supabase.auth.signOut();
        navigation.dispatch(
            StackActions.replace('signin')
        )
    }

    setTimeout(() => {
        logout();
    }, 100);
    
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
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
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