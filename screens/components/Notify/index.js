import { View, StyleSheet } from "react-native"
import { Button, Text } from "react-native-paper" 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDispatch, useSelector } from "react-redux"
import { toggleNotify } from "../../../features/uxSlice";


export default function index() {
    const dispatch = useDispatch();
    const { notify: { isOpen, label, color, top } } = useSelector(state => state.ux)
    // rgba(21, 150, 190, 0.95)

    const styles = StyleSheet.create({
        container: {
            position: "absolute",
            backgroundColor: color,
            zIndex: 9999,
            right: 10,
            top: top,
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderRadius: 10,
            display: isOpen ? 'flex' : 'none',
            flexDirection: 'row',
            alignItems: 'center'
        },
        label: {
            color: 'white',
            marginRight: 10,
            fontSize: 18
        }
    })


    const handleClose = () => {
        dispatch(toggleNotify({isOpen: false, label: ''}));
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <MaterialCommunityIcons name="close" size={20} color='#FFFFFF' onPress={handleClose} />
        </View>
    )
}
