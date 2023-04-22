import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Loading } from '../components'
import { supabase } from '../../supabaseConfig.js'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { setSession } from '../../features/userSlice'
import { setLoadingFalse } from '../../features/uxSlice'

export default function Logout() {
    const dispatch = useDispatch()
    const navigation = useNavigation();
    const logout = async() => {
        dispatch(setSession(null))
        dispatch(setLoadingFalse())
        await supabase.auth.signOut();
        navigation.navigate('signin')
    }

    
    useEffect(() => {
        logout()
    })
 
    
    return (
        // <Loading />
        <Text>err</Text>
    )
}