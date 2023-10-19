 
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import ForgotPassword from '../screens/auth/ForgotPassword';
import SendOTPScreen from '../screens/auth/SendOTPScreen';
import SigninScreen from '../screens/auth/SigninScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import VerifytOTPScreen from '../screens/auth/VeriftyOTPScreen'; 
import UserNavigation from './UserNavigation'; 
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase, supabaseAdmin } from '../supabaseConfig';
import { setSession, setUser, toggleIsBlocked } from '../features/userSlice';
import { Loading } from '../screens/components';

const Stack = createNativeStackNavigator();

const stacks = [ 
  {
    name: "signin",
    component: SigninScreen,
    animation: "slide_from_left"
  },
  {
    name: "user",
    component: UserNavigation,
    animation: "slide_from_right"
  },
  {
    name: "signup",
    component: SignupScreen,
    animation: "fade_from_bottom"
  },
  {
    name: "sendotp",
    component: SendOTPScreen,
    animation: "fade_from_bottom"
  },
  {
    name: "verifyotp",
    component: VerifytOTPScreen,
    animation: "slide_from_right"
  },
  {
    name: "forgotpass",
    component: ForgotPassword,
    animation: "fade_from_bottom"
  }, 
]


export default function AuthNavigation() {  
  const [session, setSessionInit] = useState(null)
  const dispatch = useDispatch()
  const navigation = useNavigation();  



  
  useEffect(() => {


    (async() => {
      try {
        const value = await AsyncStorage.getItem('@session_key');
        
        // const aKey = await AsyncStorage.getItem('access_token')
        // const rKey = await AsyncStorage.getItem('refresh_token')

        if(value){   
          const { data: user_data } = await supabase.from('customers').select('*').eq('user_id', value)   
          dispatch(setUser(user_data))   
          dispatch(setSession(value));
          dispatch(toggleIsBlocked(user_data[0].is_block))
          setSessionInit('user')
        }else{
          await AsyncStorage.clear()
          // setSession()
          setSessionInit('signin') 
        } 
      } catch (error) {
        console.log(error)
      }
    })()
    
  }, [])

  if(session == null) {
    return <Loading />
  }
 
 
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,  
      }}
      initialRouteName={session}  
    >
      {
          stacks.map((stack) => ( 
          <Stack.Screen 
            key={stack.name}
            name={stack.name}
            component={stack.component} 
            options={{
              animation: stack.animation,    
            }}
            
          />
        ))
      }
    </Stack.Navigator>
  )
};