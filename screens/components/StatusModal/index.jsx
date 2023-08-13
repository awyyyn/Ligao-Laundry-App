import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native'
import { Button, Divider, Modal, Text,  } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { supabase } from '../../../supabaseConfig';

export default function index({
    visible,
    toDelete,
    handleDismiss
}) {

    // console.log(toDelete)
    return (
        <Modal visible={visible} contentContainerStyle={styles.container} onDismiss={handleDismiss}   >
            <View> 
                <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <AntDesign name='warning' size={50} color='#ff9736' />
                </View>
                <Divider />
                <View>
                    <Text style={{fontSize: 22, paddingVertical: 20, textAlign: 'center'}}>Are you sure to cancel {/* {toDelete?.service_type} booked in {toDelete?.date} at {toDelete?.time} */}this booked service?</Text>
                </View>
                <Divider />
                <View 
                    style={{
                        display: 'flex',
                        marginTop: 10,
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        gap: 10
                    }}
                >
                    <Button 
                        mode='elevated' 
                        buttonColor='#15bd71' 
                        textColor='#ffffff' 
                        onPress={handleDismiss}
                    >No</Button>
                    <Button 
                        mode='elevated' 
                        buttonColor='#FF0000' 
                        textColor='#FFFFFF'
                        onPress={async() => {
                            const {error} = await supabase.from('laundries_table').delete().eq('id', toDelete.id);
                            // console.log('delete')
                            if(error) console.log(error);
                            handleDismiss()
                        }} 
                    >Yes</Button>
                </View>
            </View>
        </Modal>
    )
}


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center', 
        backgroundColor: '#FFFFFF',
        padding: 20,
        width: Dimensions.get('screen').width - 50,
        borderRadius: 5,
        gap: 10,
        zIndex: 99999999999999,
        // height: Dimensions.get('screen').height
    }, 
})