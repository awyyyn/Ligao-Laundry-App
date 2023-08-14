import { Dimensions, Keyboard, StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { ActivityIndicator, Button, Divider, IconButton, TextInput } from 'react-native-paper'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { MessageContainer } from '../components';
import { useRef } from 'react';
import { useEffect } from 'react';
import Entype from 'react-native-vector-icons/Entypo'
import { FlatList } from 'react-native';
import { supabase } from '../../supabaseConfig';
import { useDispatch, useSelector } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { useNavigation } from '@react-navigation/native'; 
import { setUnreadMessages } from '../../features/userSlice';

export default function Message() { 
    const { session, user, messages } = useSelector(state => state.user)
    const [message, setMessage] = useState('');
    const [focus, setFocus] = useState(false);
    const [dataArr, setData] = useState(messages);
    const navigation = useNavigation();
    const [show, setShow] = useState(false);
    const dispatch = useDispatch() 

    const updateUnread = async () => {
        await supabase.from('message_channel').update({'is_read_by_customer': true}).eq('sender_id', session)
    } 

    const getUnreadMessages = async() => { 
        const { data } = await supabase.from('message_channel').select().match({sender_id: session, is_read_by_customer: false });
        dispatch(setUnreadMessages(data.length))  
    } 

    // console.log(dataArr)
    useEffect(() => { 
        const subscription = supabase.channel('any')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'message_channel' }, (payload) => {
                // console.log("paylod", payload)
                // console.log("paylod NEW", payload.new)
                // console.log("paylod OLD", payload.old)
                // console.log("paylod TABLE", payload.table) 
                if(payload.new.sender_id == session) {
                    updateUnread();
                    setData((prevArr) => [
                        ...prevArr,
                        payload.new
                    ]);
                    getUnreadMessages();
                }
                dispatch(setUnreadMessages(0));
            }).subscribe()

        return () => supabase.removeChannel(subscription); 
        
    }, [])
   
    const handleSubmit = async() => {
        Keyboard.dismiss();  
        setMessage('')
        if(message == "") return
        const { error } = await supabase.from('message_channel')
            .insert({sender_id: session, recipent_id: 'admin', message: message, name: user.name, is_read_by_customer: true})  
        if(error) {
            return console.log(error.message)
        }
    }
      

    return (
        <View onPress={() => Keyboard.dismiss()} >
            <View style={styles.container}>
                {dataArr.length == 0 ? 
                    <>
                        <View style={{display: 'flex', alignItems: 'center', marginTop: '40%'}}>
                            <Entype name="chat" size={200} color="#00667E" />
                            <Text style={{color: 'gray'}}>Send a message if you have a question.</Text>
                        </View>
                    </> : 
                    <>
                        <View style={styles.messagesContainer}> 
                            <FlatList
                                scrollEnabled
                                contentContainerStyle={{flexDirection: 'column-reverse'}}
                                inverted
                                data={dataArr}
                                renderItem={({item}) => {
                                
                                    const date = new Date(item.created_at);
                                    const readable =  date.toLocaleString('en-us', { timeZone: 'Asia/Manila'});  
                                    
                                    return( 
                                        <View style={[{alignItems: item.name != null ? 'flex-end' : 'flex-start'}, styles.messageAlert]}>
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
                                                <Text style={{color: 'white', fontSize: 18, }}>{item.message}</Text>
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
                    </>
                }
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
    },
    messageAlert: {
        paddingHorizontal: 5, 
        marginVertical: 8, 
    }
})