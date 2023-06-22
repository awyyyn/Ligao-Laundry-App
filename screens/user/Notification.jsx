import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { useState } from 'react'
import { useEffect } from 'react';
import { supabase } from '../../supabaseConfig';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dialog, Divider, Portal, Provider } from 'react-native-paper';
import { setMessages, setNotificaitons } from '../../features/userSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


export default function Notification() {
  const navigation = useNavigation()
  const dispatch = useDispatch(); 
  const { session, messages, notifications } = useSelector(state => state.user) 

  const [notificationss, setNotificaitons] = useState(); 
  const getNotifications = async() => {
    const { data } = await supabase.from('notification').select().eq('recipent_id', session);
    setNotificaitons(data); 
  };
  const [isOpen, setIsOpen] = useState(false);
  const [idDelete, setIdDelete] = useState()

  useEffect(() => { 
    const subscription = supabase.channel('any')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notification' }, (payload) => {
            console.log("paylod", payload)
            console.log("paylod NEW", payload.new)
            console.log("paylod OLD", payload.old)
            console.log("paylod TABLE", payload.table)

        }).subscribe()

    return () => {
        supabase.removeChannel(subscription);
    }
      
  }, [])


  useEffect(() => {
    getNotifications();
  
  }, [isOpen]);

  return (
    <Provider>
      <SafeAreaView  style={styles.container} >  
        {
          notificationss && !notificationss.length ? (
            <View style={{  width: '100%', height: 300}}>
              <Text>NONE</Text>
            </View>
          ) : (
            <FlatList 
              style={{marginBottom: 20}}
              inverted
              keyExtractor={(item) => item.id}
              data={notificationss}
              renderItem={({item}) => (
                <TouchableOpacity onPress={async() => {
                  if(!item.is_read){
                    await supabase.from('notification').update({'is_read': true}).eq('id', Number(item.id)) 
                  }
                  navigation.navigate('status')
                }}
                  onLongPress={async() => {
                    setIdDelete(item.id);
                    setIsOpen(true) 
                  }}
                  
                >
                  <View style={[styles.notif, {backgroundColor: item.is_read ? 'white' : '#00667E30', position: 'relative'}]}>
                    {/* <Text style={{fontSize: 12, bottom: 1, right: 5, position: 'absolute'}}>{item.created_at.split('T')[0]}</Text> */}
                    <Text style={{fontSize: 20, fontWeight: item.is_read ? '300' : 'bold'}}>{item.notification_message}</Text>
                  </View> 
                </TouchableOpacity>
              )}
            />
          )
        }
        
        <Portal>
          <Dialog visible={isOpen} onDismiss={() => setIsOpen(false)} style={styles.dialog}  theme={{mode: 'adaptive', roundness: 2}}>
            <Dialog.Title><Text>Delete</Text></Dialog.Title>
            <Dialog.Content>
              <Text>Delete this notification?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Button>
                  Cancel
                </Button>
                <Button
                  onPress={async() => { 
                    await supabase.from('notification').delete().eq('id', Number(idDelete)) 
                    setIsOpen(false);
                  }}
                >
                  Delete
                </Button>
              </View>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* <ScrollView style={styles.container}>
          {notifications ? notifications.map(notif => (
            <View style={styles.notif} key={notif.id}>
              <Text>{notif.notification_message}</Text>
            </View>
          )) : (
            <View>
              <Text>NONE</Text>
            </View>
          )}
          <Divider />
        </ScrollView> */}
        {/* <View><Text onPress={async () => {
          
          const { data } = await supabase.from('notification').select()
          console.log(data)
        }}>ASD</Text></View> */}
      </SafeAreaView>
    </Provider>
  )
}

const styles = StyleSheet.create({
  notif: {
    padding: 20,
    backgroundColor: "#00667E32",
    marginVertical: 5,
    position: 'relative', 
  },
  container: { 
    position: 'relative',
    paddingHorizontal: 20,
    marginTop: -20,
    // marginBottom: 20
    // flexDirection: 'column-reverse'
    // width: Dimensions.get('screen').width,
    // height: Dimensions.get('screen').height
  },
  dialog: {
    position: 'absolute',
    width: Dimensions.get('screen').width - 50,
    backgroundColor: '#FFFFFF'
  }
})