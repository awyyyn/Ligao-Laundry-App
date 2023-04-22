import "react-native-url-polyfill/auto"; 
import React from 'react'  
import { store } from './store' 
import { Provider } from "react-redux";
import AuthNavigation from "./Navigation/AuthNavigation";
import { NavigationContainer } from '@react-navigation/native';  

export default function App() {

 
  return ( 
    <Provider store={store}>  
      <NavigationContainer>
        <AuthNavigation /> 
      </NavigationContainer>
    </Provider>
  )
};