import { StyleSheet, Pressable, Text } from 'react-native'
import { Link } from 'expo-router'

import { Colors } from '../../constants/colors'

// themed components
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import Spacer from '../../components/Spacer'

const login = () => {
    const handleSubmit = () => {
        console.log('login smesh')
    }

  return (
    <ThemedView style={styles.container}>
        <Spacer />
        <ThemedText title={true} style={styles.title}>
            Login to your account
        </ThemedText>

        <ThemedButton onPress={handleSubmit}>
            <Text style={{ color: '#f2f2f2'}}>Login</Text>
        </ThemedButton>

        <Spacer height={100} />
        <Link href='/register'>
            <ThemedText style={{ textAlign: 'center' }}>Sign up</ThemedText>
        </Link>

    </ThemedView>
  )
}

export default login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 30
  },
  btn: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
  },
  pressed: {
    opacity: 0.8
  }
})