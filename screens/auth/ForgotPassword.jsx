import { TouchableWithoutFeedback, View, StyleSheet, Dimensions } from 'react-native';
import { Keyboard, Image } from 'react-native';
import globalStyles from '../styles/auth-styles';  
import { Button, Text, TextInput, Portal, Provider, Modal, HelperText } from 'react-native-paper'; 
import * as yup from 'yup';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, Loading } from '../components';
import { supabase } from '../../supabaseConfig';
import { setLoadingFalse, setLoadingTrue } from '../../features/uxSlice';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const validationSchema = yup.object({
    email: 
        yup.string()
        .email("Invalid Email Format")
        .required("Required")
})


export default function ForgotPassword() { 
    const [err, setErr] = useState('');
    const [sent, isSent] = useState('');
    const { isLoading } = useSelector(state => state.ux)
    const dispatch = useDispatch();
    const navigation = useNavigation();


    return (
        <Provider> 
            {
                isLoading && (<Loading />)
            }
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={globalStyles.container}> 
                    <Image
                        style={globalStyles.bgImage}
                        source={require('../../assets/icon.png')}
                    />
                    <View style={styles.passContainer} > 
                        <Dialog 
                            visible={!!err}
                            content={err}
                            dismissHandler={() => setErr('')}
                            title="Error 404"
                            action="continue"
                        />
                        <Text style={styles.heading1}>Reset Password</Text>
                        <Text style={styles.paragraph1}>
                            Enter the email associated with your acocunt and we'll send an email with instructions to reset your Password.
                        </Text>
                        <Formik
                            validationSchema={validationSchema}
                            initialValues={{
                                email: ''
                            }}
                            onSubmit={ async(values) => {
                                dispatch(setLoadingTrue());
                                Keyboard.dismiss();
                                const { data: isEmailExist } = await supabase
                                    .from('customers')
                                    .select('email')
                                    .eq('email', values.email) 

                                if(!isEmailExist.length){
                                    dispatch(setLoadingFalse())
                                    return setErr('Email is not registered');
                                }

                                const { error, data } = await supabase.auth.resetPasswordForEmail(values.email)
                                console.log(error)
                                if(error){
                                    dispatch(setLoadingFalse())
                                    setErr(error.message)
                                    return console.log(error.message)
                                } 
                                isSent('Password Link Sent')
                                dispatch(setLoadingFalse())
                            }}
                        >
                        {({handleChange, handleBlur, handleSubmit, errors, touched, values}) => (
                            <View style={styles.inputContaiter}>  
                                <Dialog 
                                    visible={!!sent}
                                    content={`Reset your password in the link sent to ${values.email}`}
                                    dismissHandler={() => {
                                        navigation.navigate('signin');
                                        isSent('')
                                    }}
                                    title={sent}
                                    action="continue"
                                />
                                <TextInput
                                    keyboardType='email-address'
                                    value={values.email}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    style={styles.input}
                                    mode="outlined"
                                    label="Email"
                                    activeOutlineColor="grey"
                                    outlineColor="#e6e6e6" 
                                    error={errors.email}
                                />
                                {errors.email  && touched.email ?
                                    (<HelperText type='error'>
                                        {errors.email}
                                    </HelperText>)
                                    : null
                                }
                                <Button 
                                    mode='elevated'
                                    buttonColor='#00667E'
                                    textColor='white'   
                                    style={styles.resetBtn}
                                    onPress={handleSubmit}
                                >
                                    Reset Password
                                </Button>
                                <Button 
                                    mode='text'
                                    // buttonColor='#00667E'
                                    textColor='#00667E'   
                                    style={{marginTop: 20, borderRadius: 5}}
                                    onPress={() => navigation.navigate('signin')}
                                >
                                    Sign in
                                </Button>
                            </View>
                        )} 
                        </Formik>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Provider>
    )
}

const styles = StyleSheet.create({
    passContainer: {
        width: Dimensions.get('screen').width - 70, 
        padding: 5, 
    },
    inputContaiter: {
        width: '93%', 
    },  
    heading1: { 
        fontSize: 35,
        color: "#00667E"
    },
    paragraph1: {
        fontSize: 15,
        // textAlign: 'left',
        color: "grey",
        marginBottom: 15
    },
    input: {  
        fontSize: 18, 
    },
    resetBtn: { 
        fontSize: 50,
        marginTop: 15,
        borderRadius: 6
    }
})