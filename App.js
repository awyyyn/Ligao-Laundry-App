import "react-native-url-polyfill/auto"; 
import React from 'react'  
import { store } from './store' 
import { Provider } from "react-redux";
import AuthNavigation from "./Navigation/AuthNavigation";
import { NavigationContainer } from '@react-navigation/native';  
import { StatusBar } from "expo-status-bar";

export default function App() {

 
  return ( 
    <Provider store={store}>  
      <StatusBar animated style="light" networkActivityIndicatorVisible backgroundColor="#00667E"  />
      <NavigationContainer>
        <AuthNavigation /> 
      </NavigationContainer>
    </Provider>
  )
};