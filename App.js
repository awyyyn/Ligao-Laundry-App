import "react-native-url-polyfill/auto"; 
import React, { useEffect, useState } from 'react'  
import { store } from './store' 
import { Provider } from "react-redux";
import AuthNavigation from "./Navigation/AuthNavigation";
import { NavigationContainer } from '@react-navigation/native';  
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {

  // const [data, setData] = useState()

  // useEffect(() => {
  //   (async() => {
  //     const session_key = await AsyncStorage.getItem('@session_key')
  //     console.log(session_key)
  //   })()
  // }, [])
 
  return ( 
    <Provider store={store}>  
      <StatusBar animated style="light" networkActivityIndicatorVisible backgroundColor="#00667E"  />
      <NavigationContainer>
        <AuthNavigation /> 
      </NavigationContainer>
    </Provider>
  )
};