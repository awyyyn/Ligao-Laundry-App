import { View, StyleSheet, ScrollView, BackHandler } from 'react-native';
import { Portal, Provider, Text } from 'react-native-paper';  
import { Card, Loading, Modal } from '../components' 
import userStyles from '../styles/user-styles'; 
import services from './services';  
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux'; 
import { supabase } from '../../supabaseConfig';
import { setMessages, setNotificaitons, setUnreadMessages, setUser } from '../../features/userSlice';
import { useEffect } from 'react';
import { setLoadingFalse } from '../../features/uxSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { useCallback } from 'react'; 
import { Alert } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import { useState } from 'react';

export default function HomeScreen() {
  const { session, isblocked } = useSelector(state => state.user);  
  const { isLoading } = useSelector(state => state.ux)
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(false)
 ; 
  // console.log()

  console.log(session, "session", isblocked)

  useEffect(() => {

    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to exit?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };
    
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();

  }, [])
  
  const getUnreadMessages = async() => { 
    const { data } = await supabase.from('message_channel').select().match({sender_id: session, is_read_by_customer: false });
    dispatch(setUnreadMessages(data.length));
  } 

  const getMessages = async () => {
    // const { data: session } = await supabase.auth.getSession()
    const { data } = await supabase.from('message_channel').select().eq('sender_id', session)
    /* SET TOKENS IN ASYNC STORAGE */
    // await AsyncStorage.setItem('access_token', session.session.access_token)
    // await AsyncStorage.setItem('refresh_token', session.session.refresh_token)

    // await AsyncStorage.setItem('@session_key', session.session.user.id); 
    const orderBy = data.sort((itemA, itemB) => new Date(itemA.created_at) - new Date(itemB.created_at))
    dispatch(setMessages(orderBy))
  }

 

  const getNotifications = async() => {
    const { data } = await supabase.from('notification').select().eq('recipent_id', session)
    dispatch(setNotificaitons(data))
  }


  // console.log("SESSION", )

  useEffect(() => {
    getMessages();
    getNotifications();
    dispatch(setLoadingFalse())
    const subscription = supabase.channel("any")
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'message_channel' }, (payload) => {
        // getMessages();
        getUnreadMessages() 
      }).subscribe()

    return () => subscription.unsubscribe()

  }, []) 
 

  return ( 
      <Provider> 
        <Portal>
          <Modal  
          />
        </Portal>
        <ScrollView 
          scrollEnabled={!isLoading}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={() => {
              setRefresh(true)
              getMessages();
              getNotifications();
              setRefresh(false)
            }} />
          }
        >
          {
            isLoading && (<Loading />)
          }
          <Text style={[userStyles.heading, userStyles.textshadow, {marginTop: isLoading ? 50 : 15 }]}>Ligao Laundry</Text>
          <Text style={[userStyles.heading, { fontWeight: '400', fontSize: 18}]}>Bed and Breakfast</Text> 
          <View style={userStyles.hr} />
          {
            services.map((service) => (
              <Card 
                price={service.price}
                desc={service.description}
                key={service.title}
                image={service.image}
                title={service.title}
                subheading={service.subheading}
                blur={service.blurr}
              />
            ))

          }
        </ScrollView> 
      </Provider> 
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: "column"
  }, 
})