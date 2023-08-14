import { View, Dimensions  } from 'react-native'
import React, { useState } from 'react'
import { Button, HelperText, Modal, Portal, Text, TextInput } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { StyleSheet } from 'react-native'
import { Formik } from 'formik'
import { setGlobalDialog, setHideModalPass } from '../../../features/uxSlice'
import * as yup from 'yup';
import { Keyboard } from 'react-native';
import { supabase } from '../../../supabaseConfig';

const validationSchema = yup.object({ 
    pass1: 
        yup.string()
        .min(6, 'Password must be at least 6 characters long')
        .required('Required Password'),
    pass2: 
        yup.string()
        .oneOf([yup.ref('pass1'), null], 'Password don\'t match!') 
        .required("Password don\'t match"),
})

export default function index() {
    const dispatch = useDispatch()
    const { resetPassModal } = useSelector(state => state.ux)
    console.log(resetPassModal)
    const [isLoading, setIsLoading] = useState(false);
    const handelClose = () => {
        Keyboard.dismiss();
        dispatch(setHideModalPass())
    }
    return (
        <Portal>
            <Modal visible={resetPassModal} contentContainerStyle={styles.container} dismissable={false} >
                <View>
                    <Text style={{marginBottom: 15, fontSize: 30, color: '#00554D'}}>Reset Password</Text>
                    <Formik
                        initialValues={{
                            pass1: '',
                            pass2: ''
                        }}
                        onSubmit={async(values) => {
                            Keyboard.dismiss();
                            setIsLoading(true)
                            const { data, error } = await supabase.auth.updateUser({password: values.pass2})
                            if(error){
                                console.log('ERREERE')
                                dispatch(setGlobalDialog({
                                    isOpen: true,
                                    title: 'Error',
                                    message: `${error.message}`
                                }))
                                dispatch(setHideModalPass())
                                
                                return setIsLoading(false)
                            } 
                            
                             dispatch(setGlobalDialog({
                                isOpen: true,
                                title: 'Success',
                                message: 'Change Password Success.'
                            })) 
                            dispatch(setHideModalPass())
                            setIsLoading(false)
                        }}

                        validationSchema={validationSchema}
                    >
                        {(({errors, values, handleChange, handleBlur, handleSubmit}) => (
                            <View>
                                <View
                                    style={{marginBottom: 15}}
                                >
                                    <TextInput
                                        activeOutlineColor='#00554D'
                                        mode="outlined"
                                        label="New Password"
                                        onChangeText={handleChange('pass1')}
                                        onBlur={handleBlur('pass1')}
                                        value={values.pass1}
                                        secureTextEntry
                                        error={!!errors.pass1}
                                    />
                                    {
                                        errors.pass1 && (
                                            <HelperText type='error'>
                                                {errors.pass1}
                                            </HelperText>
                                        )
                                    }
                                </View>   
                                <View
                                    style={{marginBottom: 25}} 
                                >
                                    <TextInput
                                        secureTextEntry
                                        activeOutlineColor='#00554D'
                                        mode="outlined"
                                        label="Re-type Password"
                                        onChangeText={handleChange('pass2')}
                                        onBlur={handleBlur('pass2')}
                                        value={values.pass2}
                                        error={!!errors.pass2}
                                    />
                                    {
                                        errors.pass2 && (
                                            <HelperText type='error'>
                                                {errors.pass2}
                                            </HelperText>
                                        )
                                    }
                                </View>
                                <Button 
                                    onPress={handleSubmit}
                                    buttonColor='#00554D'
                                    loading={isLoading}
                                    textColor='white'
                                    style={{
                                        borderRadius: 3,
                                        marginBottom: 15
                                    }}
                                    mode='elevated'
                                >
                                    Reset
                                </Button>
                                <Button 
                                    onPress={handelClose}
                                    mode='text'
                                    buttonColor='white'
                                    textColor='#00554D'
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#00554D',
                                        borderRadius: 3,
                                        marginBottom: 25
                                    }}
                                >
                                    Cancel
                                </Button>
                            </View>
                        ))}
                    </Formik>
                </View>
            </Modal>
        </Portal>
    )
}


const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('screen').width - 50, 
        backgroundColor: 'white', 
        display: 'flex',
        justifyContent: 'center', 
        alignSelf: 'center',
        padding: 30,
        marginTop: "-30%",
        borderRadius: 10
    }
})