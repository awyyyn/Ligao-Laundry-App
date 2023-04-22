import { Dimensions } from "react-native";
import { StyleSheet } from "react-native";


export default globalStyle = StyleSheet.create({
    container: { 
        flex: 1,
        justifyContent: "center",
        alignItems: "center", 
    },
    formContainer: { 
        // borderWidth: 1,
        // borderColor: "black",
        padding: 5,
        width: Dimensions.get('screen').width - 100
    },
    imageContainer: {  
        width: Dimensions.get('screen').width / 2 - 18,
        height: Dimensions.get('screen').width / 2 - 18,
        borderRadius: 100,
        overflow: 'hidden',
        elevation: 30,
        backgroundColor: 'white',
        shadowColor: '#00667E',
        marginBottom: 40,
    }, 
    imageContainer2: {
        width: "100%",
        display: 'flex',
        alignItems: 'center' 
    },
    logo: {
        width: "100%",
        height: "100%", 
        
    },
    inputContainer: {
        marginBottom: 20
    },
    button: {

    },
    between: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    greyText: {
        color: "grey"
    },
    textCenter: {
        textAlign: 'center'
    },
    ligaoLaundryImage: { 
        height: 200,
        width: Dimensions.get('screen').width - 80, 
    },
    ligaoLaundry: {
        color: "#00667E",
        textShadowColor: "grey",
        textShadowRadius: 5,
        textShadowOffset: {
            height: 2,
            width: 2
        },
        fontWeight: 900,
        fontSize: 45
    },
    orText: {
        textAlign: 'center', 
        marginVertical: 10
    },
    bgImage: {
        borderRadius: 1000,
        position: 'absolute',
        width: 220,
        height: 220,
        bottom: -40,
        right: -40,
        opacity: 0.3
    }
})