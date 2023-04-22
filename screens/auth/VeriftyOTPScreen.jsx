import { View, StyleSheet, Dimensions, Image, Keyboard } from 'react-native'
import { Provider, Text, TextInput } from 'react-native-paper'
import globalStyles from '../styles/auth-styles' 
import { useState } from 'react' 
import { Button, Dialog, Loading } from '../components' 
import { supabase } from '../../supabaseConfig'
import { useDispatch, useSelector } from 'react-redux'
import { setLoadingFalse, setLoadingTrue } from '../../features/uxSlice'
 
export default function VerifytOTPScreen({ route, navigation }) {
    const { email } = route.params;
    const [err, setErr] = useState('');
    const [code, setCode] = useState('');
    const { isLoading } = useSelector(state => state.ux)
    const dispatch = useDispatch(); 
    const verifyOTP = async() => {
        Keyboard.dismiss();
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: code,
            type: 'magiclink'
        })

        if(error){
            setErr(error.message)
            return console.log(error)
        }
        dispatch(setLoadingTrue())
        setTimeout(() => {        
            dispatch(setLoadingFalse())
            navigation.navigate('user')
        }, 3000)
    }

    return ( 
        <Provider>
            <View style={globalStyles.container}>
                {
                    isLoading && (<Loading />)   
                }
                <Dialog
                    title='Invalid Token'
                    content={err}
                    visible={!!err}
                    dismissHandler={() => setErr('')}
                    action='Continue'
                />
                <Image
                    style={globalStyles.bgImage}
                    source={require('../../assets/icon.png')}
                />
                <Text style={globalStyles.ligaoLaundry}>Ligao Laundry</Text>
                <View style={globalStyles.imageContainer2}>
                    <Image
                        style={styles.image}
                        source={require('../../assets/verify.png')}
                    />
                    <Text style={[globalStyles.greyText, globalStyles.textCenter, {marginBottom: 20}]}>
                        Enter the OTP code sent to your email:{'\n'}
                        {email}
                    </Text>
                    <View style={globalStyles.formContainer}>     
                        <TextInput
                            style={{
                                marginBottom: 20,
                                textAlign: "center", 
                            }}
                            maxLength={6}
                            keyboardType="number-pad"
                            contentStyle={{ 
                                color: 'red',
                                letterSpacing: 30,
                                fontSize: 27
                            }}
                            onSubmitEditing={verifyOTP}
                            mode="outlined"
                            value={code}
                            onChangeText={(val) => {
                                setCode(val)
                            }}
                            outlineColor="white"
                            activeOutlineColor='#00667E' 
                        />
                        <Button
                            disable={!!!code}
                            title="Verify"
                            handlePress={verifyOTP}
                            mode="elevated"
                            textColor="white"
                            bgColor="#00667E"
                        />
                    </View>
                </View>
            </View> 
        </Provider>
    )
}

const styles = StyleSheet.create({
    image: {
        height: 200,
        width: Dimensions.get('screen').width - 140
    },
    codeContainer: {
        display: "flex",
        flexDirection: "row"
    },
})