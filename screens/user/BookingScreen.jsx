import { View, StyleSheet, Dimensions, ScrollView } from 'react-native' 
import globalStyles from '../styles/auth-styles'   
import { Button, Provider, Text } from 'react-native-paper'
import userStyles from '../styles/user-styles'
import { SafeAreaView } from 'react-native-safe-area-context' 
import { Formik } from 'formik'; 
import { useNavigation } from '@react-navigation/native'
import { supabase } from '../../supabaseConfig'
import { useDispatch } from 'react-redux'
import { setSession } from '../../features/userSlice'

export default function BookScreen() { 
  const navigation = useNavigation();
  const dispatch = useDispatch();


  return (
    <Provider> 
      <SafeAreaView>
        <ScrollView>
          <View style={styles.container}>
            <Text style={[userStyles.heading, userStyles.textshadow]}>Book a Service</Text> 
            <View style={userStyles.hr} />
            <Formik
              initialValues={{
                
              }}
            >
              <Button onPress={() => {
                dispatch(setSession({data: 'helloworld'}))
              }}>asd</Button>
            </Formik>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: { 
    width: Dimensions.get('screen').width - 55 ,
    display: 'flex',
    alignSelf: 'center' 
  }
})