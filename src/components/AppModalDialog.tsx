import {} from 'react-native'
import { useState } from 'react';
import {Button, Dialog, Portal, Text, PaperProvider} from 'react-native-paper'

const AppModalDialog = () => {
    const [visible, setVisible] = useState(true);

    const showDialog = () => setVisible(true);
  
    const hideDialog = () => setVisible(false);

    return <PaperProvider><Portal>
    <Dialog visible={visible} onDismiss={hideDialog}>
      <Dialog.Title>Alert</Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyMedium">This is simple dialog</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={hideDialog}>Done</Button>
      </Dialog.Actions>
    </Dialog>
  </Portal></PaperProvider>
}



export default AppModalDialog;