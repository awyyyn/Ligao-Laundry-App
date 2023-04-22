import { StyleSheet, Dimensions } from "react-native";

export default userStyles = StyleSheet.create({ 
    hr: {
        borderBottomColor: '#00667E',
        borderBottomWidth: 1,
        margin: 20
    },
    spaceBetween: {
        display: 'flex',
        flexDirection :"row", 
        alignItems: 'center',
        padding: 2,
        justifyContent: 'space-between'
    },
    price: {
        fontSize: 18
    },
    profileStackContainer: {
        width: Dimensions.get('screen').width - 30, 
        alignSelf: 'center'
    },
    heading: { 
      color: "#00667E",
      fontWeight: "900",
      fontSize: 40, 
      textAlign: 'center', 
    }, 
    textshadow: {
      textShadowColor: "rgba(9, 9, 15, 0.40)", 
      textShadowRadius: 10,
      textShadowOffset: {width: 2, height: 2},
      marginTop: 20
    },
})