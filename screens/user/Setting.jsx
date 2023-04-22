import { View, StyleSheet, Image } from 'react-native' 
import { Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context' 
import { useSelector } from 'react-redux'
import userStyles from '../styles/user-styles'
import { Pressable } from '../components';
import { useNavigation } from '@react-navigation/native'
import { buttons } from './data'  

export default function Setting() {
  const router = useNavigation(); 
  const { user } = useSelector((state) => state.user)
     

  return (
    <SafeAreaView> 
      <View style={userStyles.profileStackContainer}>
        <View  style={[styles.topContainer]}>
          <Image
            style={styles.profile}
            source={require('../../assets/icon.png')}
          />
          <View style={styles.nameandEmail}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.email}>{user.email}</Text>
          </View> 
        </View> 
        <View style={userStyles.hr} />
        <View style={styles.bottomContainer}>
          <View style={styles.topButtons}>
            {buttons.map((button) => (
              <Pressable 
                handleNav={() => router.navigate(button.path)}
                key={button.label} 
                icon={button.icon} 
                label={button.label} 
              />
            ))}
          </View>
          <Pressable label="Logout" icon="logout" style={styles.logout}  />
        </View>
      </View>
    </SafeAreaView>
  )
}
 

const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
  profile: {
    width: 120,
    height: 120,
    borderRadius: 100
  },
  topContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 25, 
    alignItems: 'center', 
  },
  nameandEmail: {
    marginLeft: 20,
  },
  name: {
    fontSize: 30,

  },
  email: {
    color: 'gray'
  }, 
  logout: {
    marginTop: 50
  }
})