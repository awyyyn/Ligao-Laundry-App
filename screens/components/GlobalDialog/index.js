import React from 'react'
import { Button, Dialog, Text } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { setGlobalDialog } from '../../../features/uxSlice';

export default function index() {

    const { globalDialog } = useSelector((state) => state.ux)
    const dispatch = useDispatch();

    const handleClose = () => dispatch(setGlobalDialog({isOpen: false, title: '', message: ''}))

    return (
        <Dialog visible={globalDialog.isOpen} dismissable onDismiss={handleClose} style={{marginTop: "-30%", backgroundColor: '#FFFFFF', borderRadius: 10}}>
            <Dialog.Title>{globalDialog.title}</Dialog.Title>
            <Dialog.Content>
                <Text>
                    {globalDialog.message}
                </Text>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={handleClose} textColor='#00667E' style={{width: 100}}>
                    Okay
                </Button>
            </Dialog.Actions>
        </Dialog>
    )
}
