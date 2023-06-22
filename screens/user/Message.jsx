import { Dimensions, Keyboard, StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Button, Divider, IconButton, TextInput } from 'react-native-paper'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { MessageContainer } from '../components';
import { useRef } from 'react';
import { useEffect } from 'react';
import { FlatList } from 'react-native';
import { supabase } from '../../supabaseConfig';
import { useSelector } from 'react-redux';
import { compose } from '@reduxjs/toolkit';

export default function Message() { 
    const { session, user } = useSelector(state => state.user)
    const [message, setMessage] = useState('');
    const [focus, setFocus] = useState(false);
    const [dataArr, setData] = useState([])
    const [show, setShow] = useState(false)
    const getData = async () => {
        const { data } = await supabase.from('message_channel').select().eq('sender_id', session)
        console.log(data)
        setData(data)
    }
    

    useEffect(() => {
        getData()
    }, [])


    // const get_messages = async() => {
    //     const { data, error } = await supabase.from('messages_channel').select().eq('sender_id', session)
    // }

    // console.log(dataArr)
    useEffect(() => { 
        const subscription = supabase.channel('any')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'message_channel' }, (payload) => {
                // console.log("paylod", payload)
                // console.log("paylod NEW", payload.new)
                // console.log("paylod OLD", payload.old)
                // console.log("paylod TABLE", payload.table)
                setData((prevArr) => [
                    ...prevArr,
                    payload.new
                ])
            }).subscribe()

        return () => {
            supabase.removeChannel(subscription);
        }
        
    }, [])

    // useEffect(() => {
    //     const subscription = supabase.channel('messages_channel').on()
    // }, [])

    const handleSubmit = async() => {
        Keyboard.dismiss();  
        setMessage('')
        const { error } = await supabase.from('message_channel').insert({sender_id: session, recipent_id: 'admin', message: message, name: user.name})  
        if(error) {
            return console.log(error.message)
        }
    }
  
      
    // console.log(JSON.parse(dataArr))

    return (
        <View onPress={() => Keyboard.dismiss()} >
            <View style={styles.container}>
                <View style={styles.messagesContainer}> 
                    <FlatList
                        scrollEnabled
                        contentContainerStyle={{flexDirection: 'column-reverse'}}
                        inverted
                        data={dataArr}
                        renderItem={({item}) => {
                        
                            const date = new Date(item.created_at);
                            const readable =  date.toLocaleString('en-us', { timeZone: 'Asia/Manila'}); 
                            // console.log('name', item.name)
                            
                            return( 
                                <View style={{paddingHorizontal: 5, marginVertical: 8, alignItems: item.name != null ? 'flex-end' : 'flex-start'}}>
                                    <View  
                                        onPress={() => {
                                            console.log("ALERT")
                                            setShow(!show)
                                        }}
                                        style={{
                                            backgroundColor: '#00667E',  
                                            borderRadius: 50, 
                                            paddingHorizontal: 12, 
                                            paddingVertical: 10
                                        }
                                    }>    
                                        <Text style={{color: 'white', fontSize: 18}}>{item.message}</Text>
                                    </View> 
                                    <Text style={{fontSize: 10, color: 'gray', marginRight: 5}}>
                                        {readable}
                                    </Text> 
                                </View>  
                            )
                        }} 
                        keyExtractor={item => item.channel_id}
                    />
                </View>
                <View style={styles.inputContainer}> 
                    <TextInput 
                        inputMode='text' 
                        style={styles.input}
                        value={message}
                        onChangeText={(text) => setMessage(text)}
                        onFocus={() => setFocus(true)}
                        onBlur={() => setFocus(false)}
                        onSubmitEditing={handleSubmit}
                    />
                    <IconButton
                        onPress={handleSubmit}
                        style={styles.send}
                        icon="send"
                        iconColor='black'
                        size={focus ? 30 : 35}
                    /> 
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: { 
        height: '100%',
        position: 'relative', 
    },
    messagesContainer: {
        position: 'absolute', 
        width: Dimensions.get('screen').width, 
        height: '92%',
        justifyContent: 'flex-end',  
        // overflow: 'scroll'
    },
    inputContainer: {
        borderTopWidth: 1,
        borderTopColor: '#00667E',
        width: Dimensions.get('screen').width, 
        position: 'absolute', 
        bottom: 0, 
        left: 0,            
        height: '8%',
        display: 'flex', 
        flexDirection: 'row'
    },
    input: { 
        width: '85%', 
        fontSize: 25, 
        justifyContent: 'center',
        padding: 2,
        backgroundColor: 'transparent'
    },
    send: {
        width: '10%', 
        justifyContent: 'center',
        alignSelf: 'center'
    }
})