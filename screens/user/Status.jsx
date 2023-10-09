import { TouchableOpacity, ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import globalStyle from '../styles/auth-styles' 
import { ActivityIndicator, Button, Dialog, FAB, IconButton, Modal, Portal, Provider, Surface } from 'react-native-paper';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusModal } from '../components';
import { supabase, supabaseAdmin } from '../../supabaseConfig';
import { RefreshControl } from 'react-native-gesture-handler';

export default function Status() {
    const { session, laundries } = useSelector((state) => state.user);
    const [laundriesData, setLaundriesData] = useState()
    const dispatch = useDispatch();
    const navigation = useNavigation(); 
    const [laundry, setLaundry] = useState();
    const [numOfLaundries, setNumOfLaundries] = useState(0); 
    const [modal, setModal] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [toConfirmData, setToConfirmData] = useState('')
    const [toDelete, setToDelete] = useState(); 
    const [reloading, setReloading] = useState(false); 
 
    const getLaundry = async() => {
        setReloading(true)
        const { data, error } = await supabase.from('laundries_table').select().eq('user_id', session); 
        // dispatch((data))
        if(error){
            alert('Network error')
            setReloading(false)
            return
        }

        setLaundriesData(data.filter(i => i.status != ""))
        // setLaundriesData(data.filter(item => !item.status.includes(" ")));
        // dispatch(setStat)
        setReloading(false)
    } 

    // useEffect(() => { 
    //     setLaundriesData(laundries);  
    // }, [laundries])
    
    useEffect(() => { 
        getLaundry()
        const subscription = supabase.channel('any')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'laundries_table' }, (payload) => {
                 getLaundry()
            }).subscribe()

        return () => supabase.removeChannel(subscription); 
        
    }, [])


 

    // RENDER THIS IF THERE IS NO LAUNDRY TO CHECK
    if(laundriesData?.length == 0) {
        return(
            <View style={{alignItems: 'center', marginTop: '30%'}} >
                {/* <Surface elevation={2} style={styles.imgContainer}>  */}
                    <Image 
                        source={{uri: "https://cdni.iconscout.com/illustration/premium/thumb/no-data-found-8867280-7265556.png"}} 
                        style={{
                            width: '100%', 
                            height: 300
                        }} 
                    />
                {/* </Surface>  */}
                <Text style={styles.text}>
                    No laundry to check.
                </Text>
            </View>
        )
    }
 

    return (
        <> 
            <Provider>
                <ScrollView 
                    contentContainerStyle={styles.container}
                    refreshControl={<RefreshControl
                        refreshing={reloading}
                        
                        onRefresh={getLaundry}
                    />}
                >
                    <Portal> 
                        <StatusModal visible={modal} toDelete={toDelete} handleDismiss={() => setModal(false)} /> 
                        <Modal
                            visible={confirm}
                            onDismiss={() => setConfirm(false)}
                            contentContainerStyle={{
                                backgroundColor: "#FFF",
                                width: '90%',
                                alignSelf: "center",
                                padding: 15,
                                borderRadius: 5,
                                gap: 15,
                                marginTop: -200,
                                paddingVertical: 22
                            }}
                        >
                            <View style={{gap: 12}}>
                                <Text style={{fontSize: 22, fontWeight: '600'}}>Pick up Confirmation</Text>
                                <Text style={{fontSize: 18, fontWeight: '400'}}>
                                    Laundry is already received?
                                </Text>
                            </View>
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: "row",
                                    justifyContent: 'flex-end',
                                    gap: 10
                                }}
                            >
                                <Button
                                    style={{
                                        minWidth: 100,
                                        backgroundColor: 'red'
                                    }}
                                    textColor='#FFF'
                                    onPress={() => setConfirm(false)}
                                >
                                    No
                                </Button>
                                <Button
                                    style={{
                                        minWidth: 100,
                                        backgroundColor: '#00667E',
                                    }}
                                    textColor='#FFF'
                                    onPress={async () => {

                                        // console.log(toConfirmData)
                                        const {error } =  await supabase.from('laundries_table').update({status: ''}).eq('id', toConfirmData);
                                        // console.log(error)
                                        // console.log(data)\
                                        setConfirm(false)
                                    }}
                                >
                                    Yes
                                </Button>
                            </View>
                        </Modal>
                    </Portal> 
                    {/* <FAB
                        icon='reload'
                        style={{position: 'absolute', bottom: 30, right: 30, zIndex: 999}}
                        animated
                        variant='surface'
                        color='#00667e'
                        loading={reloading}
                        onPress={() => getLaundry()}
                    />  */}
                    {/* <View style={styles.container}>  */}
                        {reloading ? <>
                            <View style={{marginTop: '90%'}}>
                                <ActivityIndicator animating size={50} color='#00667e' /> 
                            </View>
                        </> :
                        laundriesData?.map((laundry) => {  
                            return (
                                <TouchableOpacity
                                    activeOpacity={laundry.status == "pending" || laundry.status == "washing" ? 1 : 0.3 }
                                    onPress={() => {
                                        if(laundry.status.includes("done")){ 
                                            setToConfirmData(laundry.id)
                                            console.log(laundry.id)
                                            setConfirm(true)
                                        }
                                    }}
                                    key={laundry.id} 
                                >
                                    <View 
                                        style={[
                                            styles.service, 
                                            { 
                                                borderColor: laundry.status == "pending" ? "rgba(0, 0, 0, 0.1)" : laundry.status == "washing" ? "#00667e30" : "#00667E",
                                                borderWidth: 2
                                            }
                                        ]}
                                    >
                                        <View 
                                        >    
                                            <Text style={[styles.serviceText, {color: laundry.status == "pending" ? "rgba(0, 0, 0, 0.7)" : "#00667E"}]}>
                                                {laundry.service_type}
                                            </Text>
                                            <View style={[styles.row, {justifyContent: 'space-between'}]}>
                                                <Text style={{
                                                    textTransform: 'capitalize',
                                                    display: laundry.status == "pending" ? "none" : 'flex'
                                                }}>
                                                    {laundry.status == "done" ? "Ready to pick up" : `${laundry.status}...`}
                                                </Text>
                                                <Text>
                                                    {laundry.status == "pending" ?  laundry.status : `₱ ${laundry.price}`}
                                                </Text> 
                                            </View>
                                        </View>
                                        <Text 
                                            style={[styles.textCancel, {display: laundry.status == "pending" ? "flex" : 'none'}]}
                                            onPress={() => {
                                                console.log("PRESSED")
                                                setToDelete(laundry)
                                                setModal(true)
                                            }}
                                        >Cancel</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })} 
                    {/* </View>   */}
                </ScrollView>
            </Provider> 
        </>
    ); 

    // RENDER IF THERE IS LAUNDRY TO CHECK
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('screen').width - 30,
        alignSelf: 'center',   
        paddingVertical: 10, 
        marginBottom: 10,
        zIndex: 99, 
    },   
    text: { 
        fontSize: 22,
        color: '#00667E88'
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
        padding: 15,
        marginVertical: 10,
        borderRadius: 8
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
  