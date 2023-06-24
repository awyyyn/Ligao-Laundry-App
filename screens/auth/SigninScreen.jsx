 
import { Portal, Provider, Text } from 'react-native-paper' 
import globalStyles from '../styles/auth-styles'
import { View, StyleSheet, Image, Keyboard, TouchableWithoutFeedback } from 'react-native'  
import { Formik } from 'formik' 
import * as yup from 'yup';
import 'yup-phone';
import { Button, Dialog, Input, Loading } from '../components';
import { useState } from 'react' 
import { StackActions, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setLoadingFalse, setLoadingTrue } from '../../features/uxSlice';
import { supabase } from '../../supabaseConfig';
import { setSession, setUser } from '../../features/userSlice';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const validationSchema = yup.object({
    phone: 
        yup.string()
        .matches(/^\d{11}$/, "Invalid Phone Number")
        .required("Required Phone number"),

    password: 
        yup.string("Password must not be empty")
        .min(6, "Password too short")
        .required("Required Password"),
})


export default function SigninScreen() {
    const navigation = useNavigation();
    const { isLoading } = useSelector(state => state.ux);
    const { session } = useSelector(state => state.user) 
    const [eyeIcon, setEyeIcon] = useState(false); 
    const [err, setErr] = useState('');
    const [passErr, setPassErr] = useState('');
    const dispatch = useDispatch();

    /* IF THERE IS A LOGIN USER REDIRECT TO USER SCREEN */  
    useEffect(() => {
        if(session) return navigation.replace('user') 
    }, [])

    /* SIGN IN FUNCTIONALITY  */
    const handleSignIn = async(values)  => {
        Keyboard.dismiss();
        dispatch(setLoadingTrue());
        const phone = `+63${values.phone.slice(1)}`;
        // console.log('loading...')
        /* CHECK IF PHONE NUMBER IS REGISTERED */
        const { data: phoneData } = await supabase.from('customers').select('phone').eq('phone', `63${values.phone.slice(1)}`)
        // console.log(phoneData) 
        
        if(phoneData?.length == 0){
            dispatch(setLoadingFalse())
            setErr('Email is not registered')
            return console.log("no data")
        }        
        
        /* SIGN IN WITH PASWORD */
        const { data, error } = await supabase.auth.signInWithPassword({
            phone,
            password: values.password
        });

       
        /* IF THERE IS NO INTERNET OR DATA  */
        if(error?.status == 0){
            dispatch(setLoadingFalse())
            return alert("Network Error!")
        }

        /* IF ERROR IS TRUE, SET ERROR TO DISPLAY DIALOGUE */ 
        if(error?.status == 400){
            // console.log(data) 
            dispatch(setLoadingFalse());
            return  setPassErr('Incorrect Password!')
        } 

        /* SET STATE SESSION */
        dispatch(setSession(data?.session?.user?.id)) 
        
        /* SET TOKENS IN ASYNC STORAGE */
        await AsyncStorage.setItem('access_token', data.session.access_token);
        await AsyncStorage.setItem('refresh_token', data.session.refresh_token);
         
        await AsyncStorage.setItem('@session_key', data.session.user.id);
 
        /* SET USER STATE */
        const { data: user_data } = await supabase.from('customers').select('*').eq('user_id', data?.session?.user?.id);
        dispatch(setUser(user_data))
        dispatch(setLoadingFalse())
        navigation.replace('user', { screen: 'home'})
         
    }

    
    return (    
        <Provider>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={globalStyles.container}>  
                    {
                        isLoading && (<Loading />)
                    }
                    <View style={globalStyles.imageContainer}>
                        <Image  
                            alt='Logo'
                            style={globalStyles.logo}
                            source={require('../../assets/icon.png')}
                        />
                    </View>
                    <Formik
                        initialValues={{
                            phone: '',
                            password: ''
                        }} 
                        validationSchema={validationSchema}
                        onSubmit={(values) => handleSignIn(values)}
                    >
                        {({handleBlur, handleChange, handleSubmit, values, errors, touched, resetForm, handleReset}) => {
                            
                            /* NAVIGATE TO OTHER SCREEN FUNCTION */
                            function navigate (path) {
                                 
                                handleReset();
                                navigation.navigate(path);
                            }

                            return (
                                <View style={globalStyles.formContainer}> 
                                    <Input 
                                        type='number-pad'
                                        placeholder="Phone Number"
                                        left="phone" 
                                        value={values.phone}
                                        handleChange={handleChange('phone')}
                                        handleBlur={handleBlur('phone')}
                                        error={err ? err : errors.phone} 
                                        touched={touched.phone }
                                        handlePress={() => {
                                            setErr('')
                                        }}
                                    />
                                    <Input
                                        placeholder="Password"
                                        pass={!eyeIcon}
                                        value={values.password}
                                        right={eyeIcon ? "eye" : "eye-off"}
                                        handleIconPress={() => setEyeIcon(!eyeIcon)}
                                        left="lock"
                                        handleChange={handleChange('password')}
                                        handleBlur={handleBlur('password')}
                                        error={passErr ? passErr : errors.password} 
                                        touched={touched.password}
                                        handlePress={() => {
                                            setErr('');
                                            setPassErr('')
                                        }}
                                    /> 
                                    <View>
                                        <View style={{marginBottom: 20}}>
                                            <Button 
                                                title="Sign in" 
                                                mode="elevated"
                                                handlePress={handleSubmit} 
                                                textColor="white"  
                                                bgColor='#00667E'
                                            /> 
                                            <Text style={globalStyles.orText}>or</Text> 
                                            <Button 
                                                title="Sign in with OTP" 
                                                mode="elevated" 
                                                handlePress={() => navigate("sendotp")}
                                                bgColor="white"
                                                textColor="#00667E"  
                                            />
                                        </View>
                                        <View style={globalStyles.between}>
                                            <Text 
                                                style={globalStyles.greyText} 
                                                onPress={() => navigate('signup')}
                                            >
                                                Create Account  
                                            </Text>
                                            <Text 
                                                style={globalStyles.greyText} 
                                                onPress={() => navigate('forgotpass')}
                                            >
                                                Forgot Password?
                                            </Text> 
                                        </View>    
                                    </View>
                                </View>
                        )}}
                    </Formik> 
                </View>
            </TouchableWithoutFeedback>
        </Provider>
    )
}


const styles = StyleSheet.create({ 
    
})