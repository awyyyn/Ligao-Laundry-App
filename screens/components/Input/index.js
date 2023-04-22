import globalStyles from "../../styles/auth-styles"
import { HelperText, TextInput } from "react-native-paper"
import { View } from "react-native" 

export default function index({
    handleChange,
    value,
    handleBlur, 
    placeholder, 
    left, 
    right, 
    pass,
    error,
    touched,
    handleIconPress,
    type, 
    align, 
    label, 
    isLoading,
    readonly,
    handlePress
}) {
    return (
        <View style={globalStyles.inputContainer} >
            <TextInput  
                onFocus={handlePress}
                label={label ? label : null}
                onChangeText={handleChange}
                mode="outlined"
                activeOutlineColor="grey"
                outlineColor="#e6e6e6" 
                placeholder={placeholder ? placeholder : null}
                secureTextEntry={pass}
                left={left ? <TextInput.Icon icon={left} /> : null}
                right={right ? <TextInput.Icon onPress={handleIconPress} icon={right} /> : null}
                onBlur={handleBlur}
                value={value}    
                error={error}
                keyboardType={type ? type : null} 
                style={{textAlign: align ? align : 'auto'}}
                disabled={isLoading} 
                editable={readonly ? false : true}
            />
            {error &&  touched &&
                <HelperText type="error">
                    {error}
                </HelperText>
            }
        </View>
    )
}