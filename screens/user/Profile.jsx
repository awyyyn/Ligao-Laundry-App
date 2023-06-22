import { View, Text, Image, Keyboard } from 'react-native'
import React, { useCallback } from 'react'
import { StyleSheet } from 'react-native' 
import { Dimensions } from 'react-native'
import { Cancel, EditProfile, Helper, Loading,  Notify,  ResetPassModal, Save } from '../components'; 
import { useDispatch, useSelector } from 'react-redux'
import { Button, Provider, TextInput } from 'react-native-paper'
import { DrawerActions, useNavigation } from '@react-navigation/native';
import {  
    setVisibleModalPass, 
    toggleEditEmail, 
    toggleEditName,
    toggleEditAddress, 
    toggleEditPhone, 
    toggleNotify, 
    setLoadingTrue, 
    setLoadingFalse,
    toggleIsLoading,
    emailCodeModal,
    closeAllToggle
} from '../../features/uxSlice'
import { supabase } from '../../supabaseConfig';
import { useState } from 'react'; 
import { setUser, setSession } from '../../features/userSlice';
import { useEffect } from 'react';
import { useDrawerStatus } from '@react-navigation/drawer';
import LoadingV2 from '../components/LoadingScreen/loadingV2';

export default function Profile() { 
    
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { user, session } = useSelector(state => state.user);

    const drawerStatus = useDrawerStatus();
    if(drawerStatus == 'open'){
        dispatch(closeAllToggle())
    }
    
    // console.log( typeof user.phone)
    // let phone = '0' + String(user.phone).slice(2);   
    // console.log(typeof phone) 
    const { isLoading, isLoadingUi, editName, editEmail, editPhone, editAddress } = useSelector(state => state.ux)
    const [customerName, setcustomerName] = useState(user.name); 
    const phone = `0${String(user.phone).slice(2)}`  
    const [customerPhone, setcustomerPhone] = useState(phone);  
    const [customerEmail, setcustomerEmail] = useState(user.email);  
    const [customerAddress, setcustomerAddress] = useState(user.address);  
     

    const closeNotify = () => setTimeout(() => {
        dispatch(toggleNotify({isOpen: false, label: '', color: ''}))
    }, 5000)   
    
    return (
        <Provider>
            <View style={[styles.container, {paddingTop: isLoading ? 50 : 20 }]}>   
                {isLoading && (<Loading />)} 
                {isLoadingUi && (<LoadingV2 />)}
                <ResetPassModal  />
                <Notify /> 
                <View> 
                    <Text
                    style={{
                        fontSize: 32,
                            marginBottom: 20
                        }}
                    >Personal Information</Text> 
                    <View style={{marginBottom: 10}}>
                        <TextInput
                            label="Name" 
                            value={customerName}
                            onChangeText={(text) => setcustomerName(text)}
                            editable={editName} 
                            outlineStyle={{borderColor: editName ? '#00667E' : "gray"}} 
                            mode='outlined'   
                        /> 
                        {
                            editName ? (
                                <View style={styles.left}>
                                    <Save
                                        disable={customerName.length < 2 ? true : false}
                                        handlePress={async() => {
                                            Keyboard.dismiss();
                                            if(customerName == user.name){
                                                return dispatch(toggleEditName())
                                            }
                                            dispatch(toggleIsLoading({toggle: true}))
                                            const { data, error } = await supabase
                                                .from('customers')
                                                .update({name: customerName })
                                                .eq('user_id', session)
                                                .select() 

                                            if(error) {
                                                dispatch(toggleNotify({isOpen: true, label: `Error! ${error.message}`, color: 'red', top: 10}))
                                                closeNotify();
                                                return dispatch(setLoadingFalse())
                                            } 
                                            dispatch(setUser(data)) 
                                            dispatch(toggleIsLoading({toggle: false}))
                                            dispatch(toggleNotify({isOpen: true, label: 'Name Changed!', color: 'rgba(30, 136, 66, 0.95)', top: 10}))
                                            dispatch(toggleEditName())                                            
                                            closeNotify();
                                        }}
                                    />
                                    <Cancel handlePress={() => {
                                        setcustomerName(user.name)
                                        dispatch(toggleEditName())
                                    }} />
                                </View>
                            ) : (   
                                <Helper
                                    handlePress={() => dispatch(toggleEditName()) }
                                    label='Edit'
                                />
                            )
                        }
                            </View>
                                <View style={{marginBottom: 10}}>
                                    <TextInput
                                        label="Email"
                                        value={customerEmail} 
                                        editable={editEmail}
                                        onChangeText={(text) => setcustomerEmail(text)}
                                        outlineStyle={{borderColor: editEmail ? '#00667E' : "gray"}} 
                                        mode='outlined'
                                        autoFocus={editEmail}
                                        keyboardType='email-address'
                                    />
                            <EditProfile 
                                handleCancel={() => {    
                                    Keyboard.dismiss(); 
                                    setcustomerEmail(user.email)
                                    dispatch(emailCodeModal({email: '', isOpen: false}))
                                }}
                            />
                        {
                            editEmail ? (
                                <View style={styles.left}>
                                <Save
                                handlePress={async() => {
                                            Keyboard.dismiss();
                                            dispatch(toggleIsLoading({toggle: true}))
                                            if(customerEmail == user.email) {
                                                dispatch(toggleIsLoading({toggle: false}))
                                                dispatch(toggleEditEmail())
                                                return console.log("equal")
                                            }
                                            /* SEND TOKEN */
                                            // const { data, error } = await supabase.auth.updateUser({email: customerEmail})
                                            // if(error) {
                                            //     console.log(error)
                                            //     if(error.message.includes('invalid')){ 
                                                //         dispatch(toggleNotify({isOpen: true, label: 'Invalid format!', color: 'red'}))
                                            //     }else{ 
                                            //         dispatch(toggleNotify({isOpen: true, label: 'Email is already taken!', color: 'red'}))
                                            //     }
                                            //     closeNotify();
                                            //     return dispatch(toggleIsLoading({toggle: false}))
                                            // } 
                                            // dispatch(toggleIsLoading({toggle: false}))
                                            // console.log(data)

                                            // 422 email is already been registred
                                            /* CHECK IF EMAIL EXISTS */
                                            const { data, error } = await supabase.auth.updateUser({email: customerEmail})
                                            if(error) {
                                                console.log(error)
                                                if(error.message.includes('invalid')){ 
                                                    dispatch(toggleNotify({isOpen: true, label: 'Invalid format!', color: 'red', top: 10}))
                                                }else{ 
                                                    dispatch(toggleNotify({isOpen: true, label: 'Email is already taken!', color: 'red', top: 10}))
                                                }
                                                closeNotify();  
                                                return dispatch(toggleIsLoading({toggle: false}))
                                            } 
                                            dispatch(toggleEditEmail())
                                            dispatch(toggleIsLoading({toggle: false}))
                                            dispatch(emailCodeModal({ isOpen: true, email: customerEmail }))
                                        }}
                                    />
                                    <Cancel handlePress={() => {
                                        setcustomerEmail(user.email)
                                        dispatch(toggleEditEmail())
                                    }} />
                                </View>
                            ) : (   
                                <Helper
                                    handlePress={() => dispatch(toggleEditEmail())}
                                    label='Edit'
                                />
                            )
                        }
                    </View>
                    <View style={{marginBottom: 10}}>
                        <TextInput
                            maxLength={11}
                            keyboardType='number-pad'
                            label='Phone'
                            value={customerPhone}
                            onChangeText={(text) => setcustomerPhone(text)}
                            outlineStyle={{borderColor: editPhone ? '#00667E' : "gray"}} 
                            mode='outlined' 
                            editable={editPhone} 
                        />
                        {
                            editPhone ? (
                                <View style={styles.left}>
                                    <Save
                                        disable={customerPhone.length <= 10 ? true : false}
                                        handlePress={async() => {
                                            Keyboard.dismiss();
                                            dispatch(toggleIsLoading({toggle: true}));
                                            const new_phone = `63${String(customerPhone).slice(1)}`;
                                            if(customerPhone == phone){
                                                dispatch(toggleIsLoading({toggle: false}));
                                                dispatch(toggleEditPhone()) 
                                                return console.log("equal")
                                            }
                                            
                                            const { data: check, error: checkError} = await supabase
                                            .from('customers')
                                                .select('phone')
                                                .eq('phone', new_phone)

                                                if(checkError){
                                                dispatch(toggleIsLoading({toggle: false}));
                                                return console.log(checkError)
                                            }
                                            
                                            if(check.length == 1){
                                                // console.log(check)
                                                dispatch(toggleIsLoading({toggle: false}));
                                                return console.log('already exist')
                                            }
                                            
                                            console.log(session)
                                            
                                            const { data: setSessionData } = await supabase
                                                .from('customers')
                                                .update({phone: new_phone})
                                                .eq('user_id', session)
                                                .select(); 
                                                const { data, error } = await supabase.auth.updateUser({phone: new_phone})
                                                if(error){
                                                    dispatch(toggleIsLoading());
                                                    dispatch(toggleNotify({isOpen: true, label: 'Network Error!', color: 'red', top: 10}))
                                                    return console.log("NETWORL ERROR")
                                                }
                                                dispatch(toggleIsLoading({toggle: false}));
                                                dispatch(toggleNotify({isOpen: true, label: 'Phone Number changed!', color: 'rgb(78, 250, 136)', top: 10}))
                                                closeNotify();
                                                dispatch(setUser(setSessionData))  
                                                dispatch(setSession(data.user.id))
                                                dispatch(toggleEditPhone())
                                        }}
                                    />
                                    <Cancel handlePress={() => {
                                        Keyboard.dismiss();
                                        setcustomerPhone(phone)
                                        dispatch(toggleEditPhone())
                                    }} />
                                </View>
                            ) : (   
                                <Helper
                                    handlePress={() => dispatch(toggleEditPhone())}
                                    label='Edit'
                                />
                            )
                        }
                    </View>
                    <View style={{marginBottom: 10}}>
                        <TextInput
                            label='Address'
                            value={customerAddress}
                            outlineStyle={{borderColor: editAddress ? '#00667E' : "gray"}} 
                            mode='outlined'
                            onChangeText={(text) => setcustomerAddress(text)}
                            editable={editAddress} 
                        />
                        {
                            editAddress ? (
                                <View style={styles.left}>
                                    <Save
                                        handlePress={async() => {
                                            Keyboard.dismiss();
                                            dispatch(toggleIsLoading({toggle: true}))
                                            const { data, error } = await supabase
                                                .from('customers')
                                                .update({address: customerAddress })
                                                .eq('user_id', session)
                                                .select() 

                                            if(error) {
                                                dispatch(toggleNotify({isOpen: true, label: `Error! ${error.message}`, color: 'red'}))
                                                closeNotify();
                                                return dispatch(setLoadingFalse());
                                            } 

                                            dispatch(toggleNotify({isOpen: true, label: 'Address changed!', color: 'rgba(21, 150, 190, 0.95)', top: 10}))
                                            dispatch(toggleEditAddress())                                            
                                            dispatch(setUser(data)) 
                                            dispatch(toggleIsLoading({toggle: false}))
                                            closeNotify();
                                        }}
                                    />
                                    <Cancel handlePress={() => {
                                        setcustomerAddress(user.address)
                                        dispatch(toggleEditAddress())
                                    }} />
                                </View>
                            ) : (   
                                <Helper
                                    handlePress={() => dispatch(toggleEditAddress())}
                                    label='Edit'
                                />
                            )
                        }
                    </View>
                </View>
                <View >  
                    <Button 
                        style={{marginBottom: 10}} 
                        mode='elevated' 
                        buttonColor='#1691F1' 
                        textColor='#FFFFFF'
                        onPress={useCallback(() => { 
                            dispatch(closeAllToggle())
                            dispatch(setVisibleModalPass())
                        })}
                    >
                        Reset Password
                    </Button> 
                    <Button buttonColor='red' textColor='white' mode='elevated' onPress={() => {
                        dispatch(closeAllToggle())
                    }}>
                        Delete
                    </Button>
                </View> 
            </View>
        </Provider>
    )
}

const styles = StyleSheet.create({
    img: { 
        width: 500,
        height: 250,
        borderBottomStartRadius: 150,    
        borderBottomEndRadius: 150,    
        display: 'flex',
        alignSelf: 'center', 
        overflow: 'hidden'
    },
    scrollContainer: {
        backgroundColor: 'black',
        width: Dimensions.get('screen').width,
        padding: 30,
        color: 'white'
    },
    container: {  
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height - 130, 
        paddingVertical: 15,
        paddingHorizontal: 40,
        justifyContent: 'space-between'
    },
    left: {
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'flex-end'
    }, 
})