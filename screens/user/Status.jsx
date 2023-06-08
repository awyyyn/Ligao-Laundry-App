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
    const { session } = useSelector((state) => state.user)
    const navigation = useNavigation(); 
    const [laundry, setLaundry] = useState();
    const [numOfLaundries, setNumOfLaundries] = useState(0); 
    const [modal, setModal] = useState(false);
    const [toDelete, setToDelete] = useState();
    console.log(numOfLaundries);
    console.log(laundry)

    // navigation.addListener('focus', () => {
    //     getLaundry();
    // })
    const getLaundry = async() => {
        const { data, error } = await supabase.from('laundries_table').select().eq('user_id', session);
        setNumOfLaundries(data?.length);
        setLaundry((prev) => (data));
    } 

    useEffect(() => {
        getLaundry()
        const subscription = supabase.channel('any')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'laundries_table'}, (payload) => {
                getLaundry();
            }).subscribe()

        return () => {
            supabase.removeChannel(subscription);
        } 
    }, []);

    /* REALTIME */
    

    // console.log(laundry)
    // console.log(numOfLaundries)
 

    // RENDER THIS IF THERE IS NO LAUNDRY TO CHECK
    if(!numOfLaundries || laundry == undefined) {
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
                    laundry.map((item) => { 
                    console.log("ITEM", item.service_type)
                    return (
                        <View 
                            key={item.id} 
                            style={[
                                styles.row, styles.service, 
                                { 
                                    backgroundColor: item.status == "pending" ? "rgba(0, 0, 0, 0.1)" : "rgba(12, 122, 156, 0.18)",
                                    
                                }
                            ]}
                        >
                            <View style={{display: 'flex', flexDirection: 'column'}}>    
                                <Text style={[styles.serviceText, {color: item.status == "pending" ? "rgba(0, 0, 0, 0.7)" : "#00667E"}]}>{item.service_type}</Text>
                                <Text style={{display: item.status == "pending" ? "none" : 'flex'}}>{item.status}</Text>
                            </View>
                            <View style={styles.row}>
                                {item.status == "pending" ?(
                                        <View>
                                            <Text>{item.status}...</Text> 
                                        </View>
                                    ) : (
                                        <View>
                                            <Text>Price: </Text>
                                            <Text>990</Text>
                                        </View>
                                    )
                                }
                            </View>
                            <Text 
                                style={{
                                    right: 0,
                                    top: 0,
                                    paddingHorizontal: 3, 
                                    position: 'absolute',
                                    backgroundColor: 'rgba(235, 52, 52, 0.8)',
                                    color: '#FFFFFF',
                                    display: item.status == "pending" ? "flex" : 'none'
                                }}
                                onPress={() => {
                                    setToDelete(item)
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
})
  