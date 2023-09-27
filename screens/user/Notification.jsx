import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { useState } from 'react'
import { useEffect } from 'react';
import { supabase } from '../../supabaseConfig';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator, Button, Dialog, Divider, FAB, IconButton, Modal, Portal, Provider } from 'react-native-paper';
import { setMessages, setNotificaitons, setUnReadNotif } from '../../features/userSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'


export default function Notification() {
  const navigation = useNavigation()
  const dispatch = useDispatch(); 
  const { session, messages, notifications, } = useSelector(state => state.user);
  const [notifs, setNotifs] = useState(notifications) 

  console.log("SESSION", session)
  
  navigation.addListener('blur', () => { 
    setIsOpenNotif(false)
  }) 
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpenNotif, setIsOpenNotif] = useState(false);
  const [idDelete, setIdDelete] = useState();
  const [notifValue, setNotifValue] = useState({
    title: '',
    message: '',
    date: ''
  });
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    setNotifs(notifications);
  }, [notifications])
   
  const getNotif = async () => {
    setReloading(true);

    const { data } = await supabase.from('notification').select().match({recipent_id: session, is_read: false })

    dispatch(setUnReadNotif(data.length));

    const { data: notification, error } = await supabase.from('notification').select().eq('recipent_id', session)
    
    if(error){
        alert('Network error')
        setReloading(false)
        return
    }
    setNotifs(notification);
    setReloading(false)
  }

  console.log(notifs)

  return (
    <Provider>
      
      <FAB
        icon='reload'
        style={{position: 'absolute', bottom: 30, right: 30, zIndex: 999}}
        animated
        variant='surface'
        color='#00667e'
        loading={reloading}
        onPress={() => getNotif()}
      /> 
      <View style={styles.container} >  
        {
          notifs && notifs.length == 0 ? (
            <View style={{  width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center',}}>
              <FontAwesome5 name="inbox" size={150} color="#00667E" style={{marginTop: -50}} />
              <Text style={{color: 'gray'}}>No New Notifications</Text>
            </View>
          ) : reloading ? <>
            <View style={{marginTop: '90%'}}>
                <ActivityIndicator animating size={50} color='#00667e' />
            </View>
          </> : (
            <> 
              <FlatList  
                style={{marginBottom: 20, paddingHorizontal: 20, marginTop: 20 }}
                inverted
                keyExtractor={(item) => item.id}
                data={notifs}
                renderItem={({item}) => (
                  <TouchableOpacity 
                    onPress={async() => {
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
                      <Text style={{fontSize: 20, fontWeight: item.is_read ? '300' : '500'}}>{String(item.notification_title).substring(0, 25)}...</Text>
                    </View> 
                  </TouchableOpacity>
                )}
              />
            </>
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
                    setLoading(true);
                    const data = await supabase.from('notification').delete().eq('id', Number(idDelete)).select() 
                    console.log(data)
                    setTimeout(() => {
                      setLoading(false);
                      setIsOpen(false);
                    }, 2000)
                  }}
                  buttonColor='#FF0000'
                  textColor='#FFFFFF'
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </Button>
              </View>
            </Dialog.Actions>
          </Dialog>


          <Modal visible={isOpenNotif} onDismiss={() => setIsOpenNotif(false)} style={styles.modal} contentContainerStyle={styles.modalContainer}>
            <View>
              <Text style={styles.modalTitle}>{notifValue.title}</Text>
            </View> 
            <View style={[styles.modalContent,  { marginBottom: 20}]}>
              <Text style={{fontSize: Dimensions.get('window').fontScale = 18, lineHeight: 29, letterSpacing: 1 }}>{notifValue.message}</Text>
            </View>
            <View style={styles.modalFooter}>  
              <TouchableOpacity style={styles.viewAction} onPress={() => navigation.navigate('status')}>
                <Text style={styles.view}>View</Text>
                <Entypo name='chevron-right' color='#FFFFFF' size={20} style={styles.viewIcon} /> 
              </TouchableOpacity>
            </View>
          </Modal>

        </Portal> 
      </View>
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