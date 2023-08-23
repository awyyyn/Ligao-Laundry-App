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
                style={{marginTop: 20}} 
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
                    width: '100%',
                  }}
                  
                > 
                <Text style={{fontSize: 15, width: ''  }}>
                  {action}
                </Text>
                </Button>
            </Dialog.Actions>
        </Dialog>
    </Portal>
  )
}