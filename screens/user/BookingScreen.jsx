import { View, StyleSheet, Dimensions, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native' 
import globalStyles from '../styles/auth-styles'   
import { Button, Dialog, HelperText, Modal, Portal, Provider, Text, TextInput } from 'react-native-paper'
import userStyles from '../styles/user-styles'
import { SafeAreaView } from 'react-native-safe-area-context' 
import { Formik } from 'formik'; 
import { useNavigation } from '@react-navigation/native'
import { supabase } from '../../supabaseConfig'
import { useDispatch, useSelector } from 'react-redux'
import { setSession } from '../../features/userSlice';  
import { useEffect, useRef, useState } from 'react';
import Ant from 'react-native-vector-icons/AntDesign';
// import { SelectList } from 'react-native-dropdown-select-list';
import { Picker } from '@react-native-picker/picker'
import ModalSelect from 'react-native-expo-modal-select';  
import DateTimePicker from 'react-native-modal-datetime-picker'
import services from './services';
import { Notify } from '../components'
import { toggleNotify } from '../../features/uxSlice'
import { TouchableOpacity } from 'react-native-gesture-handler'


export default function BookScreen() { 

  async function getAvailableTime(datee) {
    // console.log("DAATTEE", datee.toLocaleDateString()) 
    const { data, error } = await supabase.from('laundries_table').select('time').eq('date', datee.toLocaleDateString())
    setAvailableTime(data); 
  }  
  useEffect(() => { 
    const date = new Date(); 
    getAvailableTime(date)

  }, []);

  const [availableTime, setAvailableTime] = useState( );
  const { notify } = useSelector(state => state.ux)

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { session, user } = useSelector(state => state.user);  
  const [type, settype] = useState("Select Type");
  // const [samp, setSamp] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);  
  const [getTime, setGetTime] = useState('');
  const [price, setPrice] = useState('00.00');  
  const [date, setDate] = useState(new Date()); 
  const [errors, setErrors] = useState({
    typeErr: '',
    dateErr: '',
    timeErr: ''
  });
  // console.log(date.toLocaleString().split(',')[0])
  const [booking, setBooking] = useState(false);
  // console.log(date)
  // useEffect(() => {
  //   navigation.addListener('blur', () => { 
  //     navigation.reset({routes: [{name: 'book', key: 'book'}]})
  //     // navigation.navigate('home')
  //   }) 
  // }, [navigation])

  
  const time = [ 
    {
      label: '08:00 AM',
      value: '08:00 AM',
      disabled: availableTime?.find(({time}) => time == "08:00 AM")
    },
    {
      label: '09:00 AM',
      value: '09:00 AM',
      disabled: availableTime?.find(({time}) => time == "09:00 AM")
    },
    {
      label: '10:00 AM',
      value: '10:00 AM',
      disabled: availableTime?.find(({time}) => time == "10:00 AM")
    },
    {
      label: '11:00 AM',
      value: '11:00 AM',
      disabled: availableTime?.find(({time}) => time == "11:00 AM")
    },
    {
      label: '01:00 PM',
      value: '01:00 PM',
      disabled: availableTime?.find(({time}) => time == "01:00 PM")
    },
    {
      label: '02:00 PM',
      value: '02:00 PM',
      disabled: availableTime?.find(({time}) => time == "02:00 PM")  
    },
    {
      label: '03:00 PM',
      value: '03:00 PM',
      disabled: availableTime?.find(({time}) => time == "03:00 PM")
    },
    {
      label: '04:00 PM',
      value: '04:00 PM',
      disabled: availableTime?.find(({time}) => time == "04:00 PM")
    }
  ]; 
  // console.log(type)
  return (
    <Provider> 
      <SafeAreaView>
        <Portal>  
          <Notify />
          <ScrollView style={{zIndex: 2}}>  
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={styles.container}> 
                <Text style={[userStyles.heading, userStyles.textshadow]}>Book a Service</Text> 
                <View style={userStyles.hr} /> 
                <View 
                  style={{
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    height: Dimensions.get('screen').height - 300,    
                  }}
                  >
                  <View style={{gap: 10, paddingHorizontal: 20}}> 
                    <View >
                      <Text style={{marginBottom: 5}}>Type of Service</Text>
                      <Picker
                        selectedValue={type}
                        onValueChange={(item) => {
                          // console.log(item, 'INDEX', index)
                          setErrors(prev => ({...prev, typeErr: ''}));
                          const getItem = services.find((service) => service.label == item)
                          if(getItem){
                            setPrice(getItem.price);
                          }else{
                            setPrice("00.00");   
                          }  
                          // console.log("ITEM", item)
                          settype(item);
                        }} 
                        style={styles.picker} 
                        mode='dialog'
                      >  
                        <Picker.Item value="Select Type" label='Select Type'  />
                        {services.map(type => ( 
                          <Picker.Item key={type.value}  label={type.label} value={type.value} style={{zIndex: 99, color: '#000000'}} /> 
                        ))}
                      </Picker> 
                      {errors.typeErr && <HelperText style={styles.error}>{errors.typeErr}</HelperText>}
                    </View> 
                    <View> 
                      <Text>Price</Text>
                      <TextInput  
                        left={<TextInput.Icon icon='currency-php' />} 
                        editable={false}  
                        mode='outlined'
                        outlineStyle={{
                          borderWidth: 0
                        }}
                        contentStyle={{
                          borderRadius: 0,
                          backgroundColor: '#ffffff'
                        }}
                        style={{
                          margin: 0, 
                          padding: 0,
                          borderWidth: 0,
                          borderColor: 'transparent',
                          
                        }}
                        value={price}
                      />
                      {/* <HelperText></HelperText> */}
                    </View>
                    <View>  
                      <Text>Date</Text>  
                      <TextInput 
                        mode='outlined'  
                        outlineStyle={{
                          borderWidth: 0
                        }}
                        contentStyle={{
                          borderRadius: 0,
                          backgroundColor: '#ffffff',
                          paddingHorizontal: 15
                        }}
                        onPressIn={() => setShowDatePicker(true)}
                        value={date.toLocaleDateString()}
                      />
                    </View>
                    <View> 
                      <Text style={{marginBottom: 5}}>Time</Text>
                      <Picker
                        style={styles.picker}
                        selectedValue={getTime}
                        onValueChange={(value) => {
                          setErrors(prev => ({...prev, timeErr: ''}))
                          setGetTime(value)
                        }}
                      > 
                        <Picker.Item  value='Select Time' label='Select Time' />
                        {time.map(timee => (
                          <Picker.Item key={timee.value} value={timee.value} label={timee.label} enabled={!timee.disabled} 
                            style={{  
                              textDecorationLine: 'underline', 
                              textDecorationStyle: 'solid',
                              textDecorationColor: '#000000',
                              fontStyle: !timee.disabled ? 'normal' : 'italic',
                              backgroundColor: !timee.disabled ? "transparent" : 'rgba(0, 0, 0, 0.18)'
                            }} 
                            color={!timee.disabled ? 'black' : 'gray'} 
                            />
                        ))}
                      </Picker> 
                      {errors.timeErr && <HelperText style={styles.error}>{errors.timeErr}</HelperText>}
                    </View>
                    <DateTimePicker  
                      isVisible={showDatePicker}
                      onConfirm={(datee) => {
                        setShowDatePicker(false)
                        Keyboard.dismiss();
                        setDate(datee);
                        setGetTime('Select Time')
                        getAvailableTime(datee); 
                      }}
                      onCancel={() => {
                        setShowDatePicker(false)
                        Keyboard.dismiss()
                      }} 
                      mode='date'
                      minimumDate={new Date()}
                      date={date}
                    /> 
                  </View>  
                  <Button 
                    style={styles.booknow_btn}
                    buttonColor='#00667E'
                    textColor='#ffffff'
                    onPress={async() => {  
                      if(!type || type == 'Select Type'){
                        setErrors(prevErrors => ({...prevErrors, typeErr: 'Select type of service!'}))
                      }
                      if(!getTime || getTime == "Select Time"){
                        setErrors(prevErrors => ({...prevErrors, timeErr: 'Select schedule time!'}))
                      }  
                      // console.log("TIME", getTime, "TYPE", type)
                      if(!type || !getTime || type == 'Select Type' || getTime == "Select Time") return errors
                      // console.log("TYPE", type)
                      setBooking(true);
                      const { data, error } = await supabase.from('laundries_table')
                        .insert({
                          user_id: session, 
                          name: user.name, 
                          address: user.address, 
                          // email: user.email, 
                          phone: user.phone,
                          service_type: type,
                          price: price,
                          status: 'pending',
                          time: getTime,
                          date: date.toLocaleString().split(',')[0]
                        }).select()
                        // console.log(data)
                        if(error) console.log(error)
                        dispatch(toggleNotify({
                          isOpen: true,
                          label: "Booked Successfully",
                          color: "#00cc00",
                          top: 10
                        }))
                        settype('Select Type')
                        setGetTime('Select Time')
                        setPrice('00.00')
                        setBooking(false);
                        setDate(new Date()); 
                        getAvailableTime(new Date()); 
                        setTimeout(() => {
                          dispatch(toggleNotify({
                            isOpen: false,
                            label: "",
                            color: "#00cc00",
                            top: 0
                          }))
                        }, 5000)
                    }}
                  >
                    {booking ? 'Booking...' : 'Book now'}
                  </Button>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </Portal>
      </SafeAreaView>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: { 
    width: Dimensions.get('screen').width - 55 ,
    display: 'flex',
    alignSelf: 'center' 
  },
  selectStyle: {
    borderRadius: 5,
    borderColor: 'rgba(0, 0, 0, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',  
  },
  error: {
    color: '#ff0000'
  },
  booknow_btn: {
    color: "#00667E"
  },
  picker: {
    backgroundColor: '#ffffff'
  }
});