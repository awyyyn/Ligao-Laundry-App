 
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import ForgotPassword from '../screens/auth/ForgotPassword';
import SendOTPScreen from '../screens/auth/SendOTPScreen';
import SigninScreen from '../screens/auth/SigninScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import VerifytOTPScreen from '../screens/auth/VeriftyOTPScreen'; 
import UserNavigation from './UserNavigation'; 
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const stacks = [ 
  {
    name: "user",
    component: UserNavigation,
    animation: "slide_from_right"
  },
  {
    name: "signin",
    component: SigninScreen,
    animation: "slide_from_left"
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
  const [sessionState, setSessionState] = useState()

  const navigation = useNavigation(); 
  const getStoredSession = async() => {
    try {
      const value = await AsyncStorage.getItem('@session_key');
      if(value){ 
        setSessionState(value)
      }else{
        setSessionState(null)
      }
      console.log("CHANGE SCREEN")
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    getStoredSession();
  }, [navigation])


   

  const initialRouteName = sessionState ? 'user' : 'signin';  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,  
      }}
      initialRouteName={initialRouteName} 
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