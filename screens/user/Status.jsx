import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import globalStyle from '../styles/auth-styles'
import { Image } from 'react-native';
import { supabase } from '../../supabaseConfig'
import { Modal, Portal, Provider, Surface } from 'react-native-paper';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusModal } from '../components';

export default function Status() {
    const { session, laundries } = useSelector((state) => state.user)
    const navigation = useNavigation(); 
    const [laundry, setLaundry] = useState();
    const [numOfLaundries, setNumOfLaundries] = useState(0); 
    const [modal, setModal] = useState(false);
    const [toDelete, setToDelete] = useState(); 

    console.log(laundries)

    // navigation.addListener('focus', () => {
    //     getLaundry();
    // })
    // const getLaundry = async() => {
    //     const { data, error } = await supabase.from('laundries_table').select().eq('user_id', session);
    //     setNumOfLaundries(data?.length);
    //     setLaundry((prev) => (data));
    // } 

    // useEffect(() => {
    //     getLaundry()
    //     const subscription = supabase.channel('any')
    //         .on('postgres_changes', { event: '*', schema: 'public', table: 'laundries_table'}, (payload) => {
    //             getLaundry();
    //         }).subscribe()

    //     return () => {
    //         supabase.removeChannel(subscription);
    //     } 
    // }, []);
 
 

    // RENDER THIS IF THERE IS NO LAUNDRY TO CHECK
    if(laundries.length == 0) {
        return(
            <View style={globalStyle.container} >
                <Surface elevation={2} style={styles.imgContainer}>
                    <Image  
                        source={require('../../assets/empty.jpg')}  
                        style={{ width: 200, height: 200 }}
                    />
                </Surface> 
                <Text style={styles.text}>
                    No laundry to check.
                </Text>
            </View>
        )
    }

    return (
        
        <Provider>
            <Portal>
                <StatusModal visible={modal} toDelete={toDelete} handleDismiss={() => setModal(false)} />
            </Portal>
            <SafeAreaView style={styles.container}>  
                {
                    laundries.map((laundry) => {  
                    return (
                        <View 
                            key={laundry.id} 
                            style={[
                                styles.service, 
                                { 
                                    backgroundColor: laundry.status == "pending" ? "rgba(0, 0, 0, 0.1)" : "rgba(12, 122, 156, 0.18)",
                                    
                                }
                            ]}
                        >
                            <View >    
                                <Text style={[styles.serviceText, {color: laundry.status == "pending" ? "rgba(0, 0, 0, 0.7)" : "#00667E"}]}>
                                    {laundry.service_type}
                                </Text>
                                <View style={[styles.row, {justifyContent: 'space-between'}]}>
                                    <Text style={{display: laundry.status == "pending" ? "none" : 'flex'}}>{laundry.status}...</Text>
                                    {laundry.status == "pending" ?( 
                                            <Text>{laundry.status}...</Text>  
                                        ) : ( 
                                            <Text>Price: {laundry.price}</Text> 
                                        )
                                    }
                                </View>
                            </View>
                            <Text 
                                style={[styles.textCancel, {display: laundry.status == "pending" ? "flex" : 'none'}]}
                                onPress={() => {
                                    setToDelete(laundry)
                                    setModal(true)
                                }}
                            >Cancel</Text>
                        </View>
                    )
                })
            } 
            </SafeAreaView>
        </Provider>
    ); 

    // RENDER IF THERE IS LAUNDRY TO CHECK
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('screen').width - 60,
        alignSelf: 'center',
        paddingTop: 5,
        zIndex: 99,
        gap: 10,
    },   
    text: {
        marginTop: 20, 
        fontSize: 22
    },
    imgContainer:{
        borderRadius: 20, 
        overflow: 'hidden',
    },
    serviceText: {
        fontSize: 30,
        color: '#00667E'
    },  
    row: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row', 
    },
    service: {
        justifyContent: 'space-between',
        // backgroundColor: 'rgba(12, 122, 156, 0.18)',
        padding: 15
    },
    textCancel: {
        right: 0,
        top: 0,
        paddingHorizontal: 3, 
        position: 'absolute',
        backgroundColor: 'rgba(235, 52, 52, 0.8)',
        color: '#FFFFFF',
    } 
})
  