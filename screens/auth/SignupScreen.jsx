import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView, Pressable, Image } from 'react-native';
import globalStyles from '../styles/auth-styles' 
import { SafeAreaView } from 'react-native-safe-area-context'
import { Formik } from 'formik'
import { Text, Provider } from 'react-native-paper'
import { useState, useCallback } from 'react'
import * as yup from "yup";
import { Button, Loading, Dialog, Input } from '../components';
import { supabase, supabaseAdmin } from '../../supabaseConfig' 
import { useDispatch, useSelector } from 'react-redux'
import { setLoadingFalse, setLoadingTrue } from '../../features/uxSlice'
import { setSession, setUser } from '../../features/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';
 

const validationSchema = yup.object({
    name: 
        yup.string()
        .required("Required"),
    address: 
        yup.string()
        .required("Required"),
    phone: 
        yup.number("Invalid Phone number format")
        .required('Required'),
    pass: 
        yup.string()
        .min(6, 'must be at least 6 characters long')
        .required('Required'),
    reType: 
        yup.string()
        .oneOf([yup.ref('pass'), null], 'Password don\'t match!') 
        .required("Required"),
    email: 
        yup.string()
        .email("Invalid Email format")
});
 

export default function SignupScreen({navigation}) {
    const { isLoading } = useSelector(state => state.ux);
    const { session } = useSelector(state => state.user);

    console.log(session)

    const dispatch = useDispatch(); 
    const [signupErr, setSignupErr] = useState('');
    const [eyeIcon, setEyeIcon] = useState(false);  



    const signup = useCallback(async(values) => {
            
        dispatch(setLoadingTrue())
        // if(values.phone.slice())
        if(values.phone.slice(0, 2) !== "09" || String(values.phone).length !== 11){
            alert('Invalid Phone Number')
            dispatch(setLoadingFalse())
            return
        }
        
        const { data: exist } = await supabase.from('customers').select('email').eq('email', values.email)
        console.log(exist)
        const phone = `+63${values.phone.slice(1)}`; 

        if(values.email !== ""){
            if(exist?.length > 0){  
                setSignupErr("Email address is already taken")
                dispatch(setLoadingFalse())
                return console.log('email: ')
            } 
        }
  
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            phone,
            password: values.reType,
            email: values?.email,
            email_confirm: true,
        })
 

        if(error) { 
            setSignupErr(error.message)  
            dispatch(setLoadingFalse())
            return console.log('phone: ', error.message)
        }

        const { data: signinData, error: signinErr } = await supabase.auth.signUp({ 
            phone,
            password: values.reType,  
        }); 
        
        if(signinErr) { 
            setSignupErr(signinErr.message)  
            dispatch(setLoadingFalse())
            return console.log(signinErr.message)
        } 
 

        const { data: setData } = await supabase.from('customers')
            .insert({
                user_id: data.user.id,
                address: values.address,
                name: values.name,
                phone: phone,
                email: values.email
            }).select()
            

        
        /* SET STATE SESSION */
        dispatch(setSession(signinData?.session?.user?.id)) 
        dispatch(setUser(setData)); 
        navigation.dispatch(
            StackActions.replace('user', { screen: 'home'})
        );
  
    }, [])



    return (
        <SafeAreaView >
            {
                isLoading && ( 
                    <Loading /> 
                )
            }
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <ScrollView> 
                    <Provider> 
                        <View style={[globalStyles.container]}> 
                            <View style={[globalStyles.imageContainer, {marginTop: 30}]}>
                                <Image  
                                    alt='Logo'
                                    style={globalStyles.logo}
                                    source={require('../../assets/icon.png')}
                                />
                            </View>
                        </View>
                        <Formik
                            initialValues={{
                                name: "",
                                address: "",
                                phone: "",
                                pass: "",
                                email: "",
                                reType: ""
                            }}
                            onSubmit={(values) => signup(values)}
                            validationSchema={validationSchema}
                        > 
                            {({values, errors, touched, handleBlur, handleChange, handleSubmit}) => { 
                                return ( 
                                    <View style={[globalStyles.formContainer, styles.signupinputcontainer]}>
                                        <Input  
                                            label="Full name"
                                            touched={touched.name}
                                            error={errors.name}
                                            handleBlur={handleBlur('name')}
                                            value={values.name}
                                            handleChange={handleChange('name')}
                                            disable={isLoading}
                                        />
                                        <Input  
                                            label="Address" 
                                            touched={touched.address}
                                            error={errors.address}
                                            handleBlur={handleBlur('address')}
                                            value={values.address}
                                            handleChange={handleChange('address')}
                                            disable={isLoading}
                                        />
                                        <Input  
                                            label="Phone Number"
                                            touched={touched.phone}
                                            error={errors.phone}
                                            handleBlur={handleBlur('phone')}
                                            value={values.phone}
                                            handleChange={handleChange('phone')}
                                            type="number-pad"
                                            disable={isLoading}
                                        />
                                        <Input  
                                            label="Email"
                                            placeholder='Optional'
                                            touched={touched.email}
                                            error={errors.email}
                                            handleBlur={handleBlur('email')}
                                            value={values.email}
                                            handleChange={handleChange('email')}
                                            type="email-address"
                                            disable={isLoading}
                                        />
                                        <Input  
                                            label="Password" 
                                            pass={!eyeIcon}
                                            right={eyeIcon ? "eye" : "eye-off"}
                                            handleIconPress={() => setEyeIcon(!eyeIcon)}
                                            touched={touched.pass}
                                            error={errors.pass}
                                            handleBlur={handleBlur('pass')}
                                            value={values.pass}
                                            handleChange={handleChange('pass')}
                                            disable={isLoading}
                                        />
                                        <Input  
                                            label="Re-type Password" 
                                            pass={!eyeIcon}
                                            right={eyeIcon ? "eye" : "eye-off"}
                                            handleIconPress={() => setEyeIcon(!eyeIcon)}
                                            touched={touched.reType}
                                            error={errors.reType}
                                            handleBlur={handleBlur('reType')}
                                            value={values.reType}
                                            handleChange={handleChange('reType')}
                                            disable={isLoading}
                                        />
                                        <Button
                                            styles="marginTop: 50"
                                            title="Sign up"
                                            mode="elevated"
                                            bgColor="#00667E"
                                            textColor="white"
                                            handlePress={handleSubmit}
                                            disable={isLoading} 
                                        />
                                        <Dialog
                                            visible={!!signupErr}
                                            dismissHandler={() => setSignupErr('')}
                                            title="Error"
                                            content={signupErr}
                                            action="Continue"
                                        />
                                    </View> 
                                )
                            }} 
                        </Formik>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 30}}>
                            <Text style={[globalStyles.greyText, globalStyles.textCenter, {marginTop: 20}]}>
                                Already have account? 
                            </Text> 
                            <Text> </Text>
                            <Pressable 
                                style={{marginTop: 20}}
                                onPress={() =>{
                                    navigation.navigate('signin')
                                }}
                            >
                                <Text >
                                    Sign in
                                </Text> 
                            </Pressable> 
                        </View>
                    </Provider>
                </ScrollView>
            </TouchableWithoutFeedback>
        </SafeAreaView> 
    )
}

const styles = StyleSheet.create({
    signupinputcontainer: {
        display: 'flex', 
        alignSelf: 'center'
    }
})