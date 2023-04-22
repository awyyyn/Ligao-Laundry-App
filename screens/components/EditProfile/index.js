import { Provider, Modal, Text, Portal, Button, TextInput, ActivityIndicator, HelperText, } from "react-native-paper"
import { View, ScrollView, StyleSheet, Dimensions } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { Formik } from "formik";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Keyboard } from "react-native";
import { supabase } from "../../../supabaseConfig";
import {   closeNotify, emailCodeModal, toggleNotify } from "../../../features/uxSlice";
import { useState } from "react";
import { setSession, setUser } from "../../../features/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage"; 



export default function index({handleCancel}) {
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch();
    const { user, session } = useSelector((state) => state.user) 
    const { emailCodeModal: { isOpen, email } } = useSelector((state) => state.ux)
    
    const initialValues = {
        code: '', 
    } 

    return (
        <Portal>  
            <Modal  visible={isOpen} contentContainerStyle={styles.container} dismissable={false}> 
                 
                <View style={{marginBottom: 15}}>
                    <Text style={{fontSize: 35}}>Confirmation Code </Text>
                    <Text style={{fontSize: 15}}>COnfirmation code to change your email address is sent to email: {email}</Text>
                </View>
                <Formik
                    initialValues={initialValues}
                    onSubmit={async(values) => {
                        const access_token = await AsyncStorage.getItem('access_token');
                        const refresh_token = await AsyncStorage.getItem('refresh_token');
                        Keyboard.dismiss(); 
                        setIsLoading(true)
                        const { data, error } = await supabase.auth.verifyOtp({
                            email,
                            token: values.code,
                            type: 'email_change', 
                        })

                        if(error){
                            
                            if(error.message.includes('not found')){
                                // dispatch(toggleNotify({isOpen: true, label: 'Incorrect Code', top: 10 }))
                            }else{
                                // dispatch(toggleNotify({isOpen: true, label: 'Network Error!', top: 10 }))
                            }
                            console.log('invalid')
                            console.log("STATUS: ", error.status)
                            console.log("MESSAGE: ", error.message)
                            // dispatch(toggleIsLoading({toggle: false}))
                            const { data: sesssionData } = await supabase.auth.setSession({access_token, refresh_token})
                            console.log("SESSION: ", sesssionData)
                            /* RE-SET TOKENS IN ASYNC STORAGE IF THERE IS ERROR */
                            await AsyncStorage.setItem('access_token', sesssionData.session.access_token)
                            await AsyncStorage.setItem('refresh_token', sesssionData.session.refresh_token)  
                            setIsLoading(false)
                            // close();
                            // dispatch(toggleNotify({isOpen: true, label: `${error.message}`, color: 'red', top: 10 }))
                            return console.log(error)
                        }

                        const { data: sesssionData } = await supabase.auth.setSession({access_token: data.session.access_token, refresh_token: data.session.refresh_token})
                        const { data: updateData } = await supabase.from('customers').update({email: email}).eq('user_id', session).select()
                        console.log("UPDATE DATA: ", updateData);
                        /* RE-SET TOKENS IN ASYNC STORAGE */
                        await AsyncStorage.setItem('access_token', sesssionData.session.access_token)
                        await AsyncStorage.setItem('refresh_token', sesssionData.session.refresh_token)
                        console.log(updateData)
                        dispatch(setSession(sesssionData?.session?.user?.id))
                        dispatch(setUser(updateData))
                        setIsLoading(false) 
                        dispatch(emailCodeModal({email: '', isOpen: false}))
                        // dispatch(toggleNotify({isOpen: true, label: `${email} saved!`, color: 'rgba(30, 136, 66, 0.95)', top: 10 }))
                        // close();
                    }}
                    >
                {(({values, handleChange, handleSubmit, handleBlur}) => { 
                    return(
                        <View>
                            <TextInput 
                                value={values.code}
                                onChangeText={handleChange('code')}
                                onBlur={handleBlur('code')}
                                inputMode="decimal"
                                mode="outlined"
                                style={{
                                    fontSize: 30,
                                    padding: 10
                                }}
                                contentStyle={{letterSpacing: 27, textAlign: 'center'}}
                                maxLength={6}
                                disabled={isLoading ? true : false}
                                
                            />  

                            <View style={{display: 'flex', flexDirection: 'row', alignSelf: "flex-end", marginTop: 10}}>
                                <Button 
                                    disabled={values.code.length <= 5 ? true : false}
                                    onPress={handleSubmit}
                                    textColor="white" 
                                    buttonColor={isLoading ? 'blue' : 'green'} 
                                    style={{borderRadius: 5, marginRight: 5}}
                                >
                                {
                                    isLoading ? "Confirming..." : "Confirm"
                                }
                                </Button>
                                <Button textColor="white" buttonColor="red" style={{borderRadius: 5}} onPress={handleCancel}>Cancel</Button>
                            </View>
                        </View>
                    )
                })}
                </Formik>
            </Modal>  
        </Portal>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('screen').width - 30, 
        backgroundColor: 'white', 
        display: 'flex',
        justifyContent: 'center', 
        alignSelf: 'center',
        padding: 30,
        zIndex: 100,
        position: 'absolute'
    }
})