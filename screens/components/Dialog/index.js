import { View, Text } from 'react-native'
import { Dialog, Portal, Button, Divider } from 'react-native-paper'

export default function index({
  visible,
  dismissHandler,
  title,
  content,
  action
}) {
  return (
    <Portal>
        <Dialog visible={visible} onDismiss={dismissHandler}>
            <Dialog.Title 
            >{title}!</Dialog.Title>
            <Dialog.Content>
            <Divider />
              <Text variant="bodyMedium" 
              >{content}</Text>
            </Dialog.Content>
            <Dialog.Actions>
                <Button 
                  mode='contained-tonal'
                  onPress={dismissHandler} 
                  buttonColor='rgba(0, 102, 126, 0.2)' 
                  textColor='#00667E'
                  style={{
                    padding: 1,
                  }}
                  
                > 
                <Text style={{fontSize: 15}}>
                  {action}
                </Text>
                </Button>
            </Dialog.Actions>
        </Dialog>
    </Portal>
  )
}