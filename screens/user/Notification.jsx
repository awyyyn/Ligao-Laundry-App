import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { useState } from 'react'
import { useEffect } from 'react';
import { supabase } from '../../supabaseConfig';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dialog, Divider, IconButton, Modal, Portal, Provider } from 'react-native-paper';
import { setMessages, setNotificaitons, setUnReadNotif } from '../../features/userSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo'


export default function Notification() {
  const navigation = useNavigation()
  const dispatch = useDispatch(); 
  const { session, messages, notifications, } = useSelector(state => state.user) 
 
  navigation.addListener('blur', () => { 
    setIsOpenNotif(false)
  })
 

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenNotif, setIsOpenNotif] = useState(false);
  const [idDelete, setIdDelete] = useState();
  const [notifValue, setNotifValue] = useState({
    title: '',
    message: '',
    date: ''
  })
   

  return (
    <Provider>
      <SafeAreaView  style={styles.container} >  
        {
          notifications && !notifications.length ? (
            <View style={{  width: '100%', height: 300}}>
              <Text>NONE</Text>
            </View>
          ) : (
            <FlatList 
              style={{marginBottom: 20}}
              inverted
              keyExtractor={(item) => item.id}
              data={notifications}
              renderItem={({item}) => (
                <TouchableOpacity onPress={async() => {
                  if(item.is_read === false){ 
                    await supabase.from('notification').update({'is_read': true}).eq('id', Number(item.id)).select(); 
                  }
                  setNotifValue({
                    date: item.created_at,
                    message: item.notification_message,
                    title: item.notification_title
                  })
                  setIsOpenNotif(true);
                }}
                  onLongPress={async() => {
                    setIdDelete(item.id);
                    setIsOpen(true) 
                  }}
                  
                >
                  <View style={[styles.notif, {backgroundColor: item.is_read ? 'white' : '#00667E30', position: 'relative'}]}> 
                    <Text style={{fontSize: 20, fontWeight: item.is_read ? '300' : 'bold'}}>{item.notification_message}</Text>
                  </View> 
                </TouchableOpacity>
              )}
            />
          )
        }
        
        <Portal>
          <Dialog visible={isOpen} onDismiss={() => setIsOpen(false)} style={styles.dialog}  theme={{mode: 'adaptive', roundness: 2}}>
            <Dialog.Title><Text style={{fontWeight: '600'}}>Delete</Text></Dialog.Title>
            <Dialog.Content>
              <Text>Delete this notification?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <View style={{display: 'flex', flexDirection: 'row', columnGap: 5}}>
                <Button 
                  style={{borderRadius: 5}}
                  onPress={() => setIsOpen(false)}
                  buttonColor='#00667E'
                  textColor='#FFFFFF'
                >
                  Cancel
                </Button>
                <Button
                  style={{borderRadius: 5}}
                  onPress={async() => { 
                    await supabase.from('notification').delete().eq('id', Number(idDelete)) 
                    setIsOpen(false);
                  }}
                  buttonColor='#FF0000'
                  textColor='#FFFFFF'
                >
                  Delete
                </Button>
              </View>
            </Dialog.Actions>
          </Dialog>

          <Modal visible={isOpenNotif} onDismiss={() => setIsOpenNotif(false)} style={styles.modal} contentContainerStyle={styles.modalContainer}>
            <View>
              <Text style={styles.modalTitle}>{notifValue.title}</Text>
            </View> 
            <View style={styles.modalContent}>
              <Text>{notifValue.message}</Text>
            </View>
            <View style={styles.modalFooter}>  
              <TouchableOpacity style={styles.viewAction} onPress={() => navigation.navigate('status')}>
                <Text style={styles.view}>View</Text>
                <Entypo name='chevron-right' color='#FFFFFF' size={20} style={styles.viewIcon} /> 
              </TouchableOpacity>
            </View>
          </Modal>
        </Portal> 
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
  },
  dialog: {
    position: 'absolute',
    width: Dimensions.get('screen').width - 50,
    backgroundColor: '#FFFFFF', 
    
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    width: Dimensions.get('screen').width - 50,
    padding: 20,
    borderRadius: 5, 
  },
  modal: {
    position: 'absolute',
    top: -50,
    display: 'flex',
    alignItems: 'center'
    // backgroundColor: '#F00'
  },
  modalTitle: {
    fontSize: 30, 
    marginBottom: 10
  },
  modalContent: {
    
  }, 
  modalFooter: {
    display: 'flex',
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  viewAction: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#00667E',
    paddingVertical: 8,
    paddingHorizontal: 15, 
    borderRadius: 5
  },
  view: {
    color: "#FFFFFF",
    fontWeight: '700'
  },

})