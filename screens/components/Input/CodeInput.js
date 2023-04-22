import { View, StyleSheet } from 'react-native'
import { TextInput } from 'react-native-paper'

export default function CodeInput({
    value,
    handleChange,
    keypres,
    ref
}) {

    return (
        <TextInput 
            style={styles.codeInput}
            outlineColor="white"
            activeOutlineColor='#00667E'
            maxLength={1}
            mode="outlined"
            keyboardType='number-pad'
            value={value}
            onChangeText={handleChange}
            focusable
            autoFocus  
            returnKeyType='next'
            ref={ref}
            onSubmitEditing={keypres}
        /> 
    )
}

const styles = StyleSheet.create({ 
    codeInput: {
        fontSize: 30,
        textAlign: 'center'
    }
})