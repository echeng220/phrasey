import { StyleSheet, Text, View, Image } from 'react-native'
import { Link } from 'expo-router'

import ThemedView from '../components/ThemedView'
import ThemedText from '../components/ThemedText'
import ThemedLogo from '../components/ThemedLogo'
import Spacer from '../components/Spacer'

const Home = () => {
  return (
    <ThemedView style={styles.container}>
        <ThemedLogo />
        <Spacer height={20}/>
      <ThemedText style={styles.title} title={true}>Travel Language Learning App</ThemedText>
      <Spacer />
      <ThemedText>Get ready to learn!</ThemedText>

      <Link href='/about' style={styles.link}>
        <ThemedText>About Page</ThemedText>
      </Link>
      <Link href='/login' style={styles.link}>
        <ThemedText>Login</ThemedText>
      </Link>
      <Link href='/register' style={styles.link}>
        <ThemedText>Register</ThemedText>
      </Link>
      <Link href='/profile' style={styles.link}>
        <ThemedText>Profile</ThemedText>
      </Link>
    </ThemedView>
  )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 5,
        boxShadow: "4px 4px rgba(0,0,0,0.1)"
    },
    link: {
        marginVertical: 10,
        borderBottomWidth: 1
    }
})