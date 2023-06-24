 
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, useDrawerStatus } from '@react-navigation/drawer';  
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons' 
import { Badge, IconButton, Surface, Text } from 'react-native-paper'; 
import { StyleSheet } from 'react-native';
import { View, Image, TouchableOpacity } from 'react-native';
import userscreens from './userscreens';
import { HomeScreen, Logout } from '../screens/user';  
import { useDispatch, useSelector } from 'react-redux';
import { removeUser, setLaundries, setMessages, setNotificaitons, setSession, setUnReadNotif, setUnreadMessages, } from '../features/userSlice';
import { supabase } from '../supabaseConfig';
import { setLoadingFalse, setLoadingTrue } from '../features/uxSlice' 
import { DrawerActions, useNavigation } from '@react-navigation/native'; 
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useState, useEffect } from 'react';


const Drawer = createDrawerNavigator();

export default function UserNavigation() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { session, unReadNotif, unreadMessage } = useSelector(state => state.user)
    const { isLoading } = useSelector((state) => state.ux);  

    const getUnreadNotification = async() => {
        const { data } = await supabase.from('notification').select().match({recipent_id: session, is_read: false })
        dispatch(setUnReadNotif(data.length));
        const { data: notification } = await supabase.from('notification').select().eq('recipent_id', session)
        dispatch(setNotificaitons(notification))
    }

    const getLaundry = async() => {
        const { data, error } = await supabase.from('laundries_table').select().eq('user_id', session); 
        dispatch(setLaundries(data))
    } 

    const getMessages = async () => {
        const { data } = await supabase.from('message_channel').select().eq('sender_id', session);
        dispatch(setMessages(data));
    }

    const getUnreadMessages = async() => { 
        const { data } = await supabase.from('message_channel').select().match({sender_id: session, is_read_by_customer: false });
        dispatch(setUnreadMessages(data.length));
    }

    useEffect(() => { 
        getMessages();
        getUnreadNotification();
        getLaundry();
        getUnreadMessages();
        const subscription = supabase.channel('any')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notification'}, () => { 
            getUnreadNotification() 
        })
        .on('postgres_changes', { event: "*", schema: 'public', table: 'laundries_table'}, () => {
            // console.log("CHANGE IN LAUNDRIES STATUS")
            getLaundry();
        })
        .on('postgres_changes', { event: "INSERT", schema: 'public', table: 'message_channel'}, () => {
            // 
            getUnreadMessages();
        })
        .subscribe();

        return () => supabase.removeChannel(subscription)
    }, [])
 

    return (
        <Drawer.Navigator    
            initialRouteName='home'
            screenOptions={{
                drawerActiveBackgroundColor: "rgba(0,127,157,0.1)",
                drawerActiveTintColor: "#00667E",
                drawerInactiveTintColor: 'dimgray',
                drawerAllowFontScaling: true,
                drawerType: 'slide', 
                drawerLabelStyle: {
                    fontSize: 20
                }, 
                headerTitleAlign: "left",
                headerStyle:{ 
                    backgroundColor: "#00667E",  
                    // display: isLoading ? 'none' : 'flex'
                },
                headerTintColor: "white",
                headerRight: () => (
                    <View style={{paddingRight: 20, display: 'flex', columnGap: 20, flexDirection: 'row'}}>    
                        <TouchableOpacity style={{position: 'relative'}} onPress={() => {
                            navigation.navigate('notification')
                        }}>
                            <Ionicons name='ios-notifications-outline' size={25} color='#fff' />
                            <Badge visible={unReadNotif} style={{position: 'absolute', top: -5, right: -5, color: '#FFFFFF', backgroundColor: '#FF0000'}} >
                                {unReadNotif}
                            </Badge>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={{position: 'relative'}} 
                            onPress={async() => {
                                await supabase.from('message_channel').update({'is_read_by_customer': true}).eq('sender_id', session).select();
                                navigation.navigate('message')
                            }} 
                        >
                            <Feather name='message-square' size={25}  color='#fff' /> 
                            <Badge visible={unreadMessage} style={{position: 'absolute', top: -5, right: -5, color: '#FFFFFF', backgroundColor: '#FF0000'}}>
                                {unreadMessage}
                            </Badge>
                        </TouchableOpacity>
                    </View>
                )

                // headerRight: () => ( 
                //     <IconButton icon='logout' iconColor='white' />
                // )
            }}
        > 
            <Drawer.Screen   
                name="homescreen"  
                component={HomeScreen} 
                options={{ 
                    drawerActiveBackgroundColor: 'rgba(0,127,157,0.1)',
                    drawerLabel: ({focused}) => (
                        <View style={styles.container}>     
                            <Surface elevation={10} style={{borderRadius: 100}}> 
                                <Image
                                    source={require('../assets/icon.png')}
                                    alt='Logoo'
                                    borderRadius={100}
                                    style={{
                                        width: 150,
                                        height: 150,
                                        
                                    }}
                                    
                                />
                            </Surface> 
                            <Text style={[styles.active, {marginTop: 5}]}>Ligao Laundry</Text> 
                        </View>
                    ),
                    headerTitle: "Home"
                }} 
            />

            {
                userscreens.map((screen) => (
                    <Drawer.Screen   
                        key={screen.name}
                        name={screen.name} 
                        component={screen.screen} 
                        options={{  
                            headerTitle: screen.label == "Message" ? "Admin" : screen.label,  
                            drawerLabel: ({ focused }) => (
                                <View style={[styles.navItems, ]}> 
                                    <MaterialCommunityIcons name={screen.icon} size={25} color={focused ? '#00667E' : screen.name == "logout" ? 'red' : 'dimgray'} />
                                    <Text style={[focused ? styles.active : screen.name == "logout" ? styles.logout : styles.inActive, styles.labels]}>{screen.label}</Text>
                                </View>
                            ), 
                            headerShown: screen.name == 'logout' ?  false : true,
                            
                        }}    
                    /> 
                ))
            } 
        </Drawer.Navigator>
    )
};

const styles = StyleSheet.create({ 
    imgContainer: {
        overflow: 'hidden',
        marginBottom: 10,
        borderRadius: 100,
        zIndex: 1,
    },
    navItems: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },  
    img: { 
        zIndex: 9,
        width: 150,
        height: 150, 
    },  
    container: {
        display: 'flex',  
        alignItems: 'center', 
        marginLeft: 30, 
    }, 
    active: {
        color: '#00667E',
        fontSize: 20,
        fontWeight: '900',
        marginLeft: 15
    },
    inActive: {
        color: 'dimgray',
        fontSize: 20,
        fontWeight: '400',
        marginLeft: 15
    },
    logout: {
        color: 'red',
        fontSize: 20,
        fontWeight: '400',
        marginLeft: 15

    },
    labels: {
        marginLeft: 15
    }
});

 