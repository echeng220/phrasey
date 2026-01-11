import { Link } from 'expo-router'
import { View, Text, StyleSheet, useColorScheme } from 'react-native'

import { Colors } from '../constants/colors'
import ThemedView from '../components/ThemedView'
import ThemedText from '../components/ThemedText'

const About = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light

  return (
    <ThemedView style={[styles.container, {backgroundColor: theme.background}]}>
      <ThemedText style={styles.title} title={true}>About Page</ThemedText>

      <Link href="/" style={styles.link}>
        <ThemedText>Home Page</ThemedText>
      </Link>
    </ThemedView>
  )
}

export default About

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e0dfe8',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  link: {
    marginVertical: 10,
    borderBottomWidth: 1
  }
})