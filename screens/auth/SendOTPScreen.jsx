import { View, StyleSheet, Image } from 'react-native'
import {  Provider, Text } from 'react-native-paper'
import { useState } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import globalStyles from '../styles/auth-styles'
import { Keyboard } from 'react-native'
import { Formik } from 'formik'
import { Input, Button, Dialog, Loading, Notify } from '../components'
import * as yup from "yup"; 
import { useDispatch, useSelector } from 'react-redux'
import { closeNotify, setLoadingFalse, setLoadingTrue, toggleNotify } from '../../features/uxSlice'
import { supabase } from '../../supabaseConfig'
import { useNavigation } from '@react-navigation/native'

const validationSchema = yup.object({
    email: 
        yup.string()
        .email("Invalid Email format")
        .required("Required")
})


export default function SendOTPScreen() {
    const navigation = useNavigation();
    const { isLoading } = useSelector(state => state.ux);
    const dispatch = useDispatch();
    const [err, setErr] = useState();
    // dispatch(setLoadingFalse())


    const handleSubmit = async(val) => {
        dispatch(setLoadingTrue());
        
        Keyboard.dismiss();
        // const { data: isEmailExist } = await supabase
        //     .from('customers')
        //     .select('email')
        //     .eq('email', val.email) 

        // if(!isEmailExist.length){
            //     dispatch(setLoadingFalse())
            //     return setErr('Email is not registered');
            // } 

        const { data, error } = await supabase.auth.signInWithOtp({
            email: val.email,
            options: {
                shouldCreateUser: false
            }
        })

        if(error){
            if(error.message.includes('Signups')){
                dispatch(toggleNotify({isOpen: true, label: 'Email is not registered!', color: 'red', top: 50}))
                console.log("not allowed")
            }else{
                dispatch(toggleNotify({isOpen: true, label: 'Network Error!', color: 'red', top: 50}))
                console.log("Network Error")
            }
            dispatch(setLoadingFalse())
            setTimeout(() => {
                dispatch(closeNotify())
            }, 5000)
            return console.log(error)
        }
        dispatch(closeNotify())
        console.log(data)
        console.log('sent')
        dispatch(setLoadingFalse())
        navigation.navigate('verifyotp', {
            email: val.email
        })
    }

    return (
        <Provider> 
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                
                <View style={globalStyles.container}>
                    {isLoading && (<Loading />)}
                    <Notify />
                    <Image
                        style={globalStyles.bgImage}
                        source={require('../../assets/icon.png')}
                    />
                    <Text style={globalStyles.ligaoLaundry}>Ligao Laundry</Text>
                    <View style={globalStyles.imageContainer2}>
                        <Image
                            style={globalStyles.ligaoLaundryImage}
                            alt='Ligao Laundry'
                            source={require('../../assets/otp.png')}
                        />  
                    </View>
                    <Text style={[globalStyles.greyText, globalStyles.textCenter, {marginBottom: 20}]}>
                        We will send you a One Time {'\n'}Password on your email.
                    </Text>
                    <Formik
                        initialValues={{
                            email: ""
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(val) => handleSubmit(val)}
                    >
                    {({handleBlur, handleChange, handleSubmit, errors, values, touched}) =>(
                        <View style={globalStyles.formContainer}>
                            <Input 
                                handlePress={() => {
                                    setErr('')
                                }}
                                type='email-address'
                                handleChange={handleChange('email')}
                                value={values.email}
                                handleBlur={handleBlur('email')}
                                left="email"
                                placeholder="Email"
                                error={err ? err : errors.email}
                                touched={touched.email}
                            /> 
                            <View>
                                <Button
                                    mode="elevated"
                                    title="Send OTP"
                                    textColor="white"
                                    bgColor="#00667E"
                                    handlePress={handleSubmit}
                                />
                                <Text style={globalStyles.orText}>or</Text>
                                <Button
                                    textColor="#00667E" 
                                    mode="elevated"
                                    title="Sign in with Password"
                                    handlePress={() => navigation.navigate('signin')}
                                />
                            </View>
                        </View> 
                    )}
                    </Formik>
                </View>
            </TouchableWithoutFeedback>
        </Provider>
    )
}

const styles = StyleSheet.create({
})