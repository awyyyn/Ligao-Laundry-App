import { View, Text, Image, Keyboard } from 'react-native'
import React, { useCallback } from 'react'
import { StyleSheet } from 'react-native' 
import { Dimensions } from 'react-native'
import { Cancel, EditProfile, GlobalDialog, Helper, Loading,  Notify,  ResetPassModal, Save } from '../components'; 
import { useDispatch, useSelector } from 'react-redux'
import { Button, Provider, TextInput, Dialog, HelperText } from 'react-native-paper'
import { DrawerActions, StackActions, useNavigation } from '@react-navigation/native';
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
    closeAllToggle,
    setGlobalDialog
} from '../../features/uxSlice'
import { supabase, supabaseAdmin } from '../../supabaseConfig';
import { useState } from 'react'; 
import { setUser, setSession, removeUser } from '../../features/userSlice';
import { useEffect } from 'react';
import { useDrawerStatus } from '@react-navigation/drawer';
import LoadingV2 from '../components/LoadingScreen/loadingV2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

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
    const phone = `0${String(user.phone).slice(3)}`  
    const [customerPhone, setcustomerPhone] = useState(phone);  
    const [customerEmail, setcustomerEmail] = useState(user.email);  
    const [customerAddress, setcustomerAddress] = useState(user.address);  
    const [dialog, setDialog] = useState("");
    const [deleteAcc, setDelAcc] = useState(false);
    const [delPass, setDelPass] = useState("");
    const [delErr, setDelErr] = useState('');
    const [deleting, setDeleting] = useState(false) 

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
                        fontSize: 28,
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

                                            console.log(new_phone);
                                            if(customerPhone == "09453414395"){
                                                dispatch(toggleIsLoading({toggle: false}));
                                                return dispatch(setGlobalDialog({
                                                    isOpen: true,
                                                    title: 'Invalid Phone Number',
                                                    message: 'The phone number is not valid.'
                                                })) 
                                                 
                                            }
                                            
                                            if(customerPhone == phone){
                                                dispatch(toggleIsLoading({toggle: false}));
                                                dispatch(toggleEditPhone()) 
                                                return 
                                            }
                                            
                                            const { data: check, error: checkError} = await supabase
                                                .from('customers')
                                                .select('phone')
                                                .eq('phone', new_phone)

                                            if(checkError){
                                                dispatch(toggleIsLoading({toggle: false}));
                                                return console.log("CHECKERROR", checkError)
                                            }
                                            
                                            if(check.length == 1){
                                                // console.log(check)
                                                dispatch(toggleIsLoading({toggle: false})); 
                                                return dispatch(setGlobalDialog({
                                                    isOpen: true,
                                                    title: 'Phone Number Error',
                                                    message: 'The phone number is already used.'
                                                })) 
                                            }  

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
                                                dispatch(toggleNotify({isOpen: true, label: 'Phone Number changed!', color: '#00667E', top: 10}))
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
                        buttonColor='#00667E' 
                        textColor='#FFFFFF'
                        onPress={useCallback(() => { 
                            dispatch(closeAllToggle())
                            dispatch(setVisibleModalPass())
                        })}
                    >
                        Change Password
                    </Button> 
                    <Button buttonColor='red' textColor='white' mode='elevated' onPress={() => {
                        dispatch(closeAllToggle())
                        setDelAcc(true)
                    }}>
                        Delete
                    </Button>
                </View> 
            </View>
            <Dialog  visible={dialog} dismissable onDismiss={() => setDialog("")} style={{marginTop: "-30%", backgroundColor: "#FFFFFF"}}> 
                <Dialog.Title>Note!</Dialog.Title>
                <Dialog.Content>
                    <Text>{dialog}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => {
                        setDialog("");
                        dispatch(toggleEditPhone());
                    }} textColor='#00667E' style={{width: 100}}>Close</Button>
                </Dialog.Actions>
            </Dialog>
            
            <Dialog  visible={deleteAcc} dismissable onDismiss={() => setDialog("")} style={{marginTop: "-30%", backgroundColor: "#FFFFFF", borderRadius: 5}}> 
                <Dialog.Title>Danger</Dialog.Title>
                <Dialog.Content style={{gap:10}}>
                    <Text>Do you really want to delete your account ?</Text>
                    <TextInput 
                        value={delPass}
                        onChangeText={(t) => {
                            setDelPass(t)
                            if(t == ""){
                                setDelErr("Please enter your password")
                            }else{
                                setDelErr("")
                            }
                        }}
                        disabled={deleting}
                        mode='outlined'
                        secureTextEntry
                        placeholder='Password' 
                        
                    />
                    {delErr && 
                        <HelperText visible={delErr} type='error'>
                            {delErr}
                        </HelperText>
                    }
                    
                </Dialog.Content>
                <Dialog.Actions>
                    <Button 
                        onPress={() => {
                            setDelErr("")
                            setDelPass("")
                            setDelAcc(false)
                        }}
                        contentStyle={styles.actions}
                        style={{borderRadius: 2}}
                        textColor='white'    
                        buttonColor='#00667E'
                    >
                        Cancel
                    </Button>
                    <Button
                        contentStyle={styles.actions}
                        buttonColor='#FF0000'
                        style={{borderRadius: 2}}
                        textColor='white'
                        onPress={async() => {
                            if(delPass == ""){
                                setDelErr("Please enter your password")
                                return
                            }
                            Keyboard.dismiss()
                            setDeleting(true)
                            const { data, error } = await supabase.auth.signInWithPassword({
                                phone: user.phone.slice(1),
                                password: delPass
                            });
                            // console.log(user)


                            if(error) {
                                setDeleting(false)
                                if(error.message.includes("credentials")){
                                    setDelErr("Wrong input password")
                                }else{
                                    setDelErr(error.message)
                                }
                                console.log(error)
                                return
                            }

                            setDeleting(false) 
                            console.log(data.session.user.id == session, "sad")
                            const { error: dErr } = await supabaseAdmin.auth.admin.deleteUser(session)

                            if(dErr){
                                console.log(error)
                                alert(delErr.message)
                                return
                            }
                            
                            await supabase.from("customers").delete().eq('user_id', session)  ;

                            Alert.alert(
                                'Removing Account',
                                'Deleting account and personal information.,',
                                [
                                    {
                                        text: 'Done',  
                                    }
                                ],
                                { cancelable: deleting ? false : true }
                            );
                              
                            navigation. navigate('logout');
                            
                        }}
                        loading={deleting}
                    >
                        Delete
                    </Button>
                </Dialog.Actions>
            </Dialog>
            <GlobalDialog />
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
    actions: { 
        paddingHorizontal: 20
    } 
})