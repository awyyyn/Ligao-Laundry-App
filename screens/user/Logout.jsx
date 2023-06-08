import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { Loading } from '../components'
import { supabase } from '../../supabaseConfig.js'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { setSession } from '../../features/userSlice'
import { setLoadingFalse } from '../../features/uxSlice'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'

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
            <Text style={styles.logout}>Logging out...</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        // backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center'
    },
    logout: {
        fontSize: 30
    }
})