import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { useState } from 'react'
import { useEffect } from 'react';
import { supabase } from '../../supabaseConfig';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-native-paper';
import { setMessages } from '../../features/userSlice';

export default function Notification() {
  const dispatch = useDispatch();

  

  const { session, messages } = useSelector(state => state.user)
  console.log(messages)
  const [notifData, setNotifData] = useState(); 
  const getData = async () => {
    const { data, error } = await supabase.from('notification').select().eq('recipent_id', session)
    console.log(error)
    console.log("data", data)
    setNotifData(data)
  }
  
  
  useEffect(() => {
    getData();
  }, [])

  return (
    <View style={styles.container}>
      <Button onPress={() => {
        dispatch(setMessages({"1": 'one', 'two': '2'}))
      }}>
      asd
      </Button>
      <FlatList
        data={notifData}
        renderItem={({item}) => {
           
          const timestamp = item.created_at
          const date = new Date(timestamp)  ;
          const readable =  date.toLocaleString('en-us', { timeZone: 'Asia/Manila'}); 
          return (
            <View> 
              <Text>asd</Text> 
              <Text>{item.notification_message}</Text>
              <Text>{readable.replace()}</Text>
            </View>
          )
        }}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  }
})