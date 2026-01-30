import { StyleSheet } from 'react-native'
import { useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router'
import Purchases from 'react-native-purchases';

import { useDatabase } from "../hooks/useDatabase";
import { useUser } from '../hooks/useUser';
import UnlockManager from '../storage/UnlockManager';

import ThemedView from '../components/ThemedView'
import ThemedText from '../components/ThemedText'
import ThemedLogo from '../components/ThemedLogo'
import Spacer from '../components/Spacer'

const Home = () => {
  const dbReady = useDatabase();
  const { user, authChecked } = useUser();
  const router = useRouter()

  useEffect(() => {
    UnlockManager.initialize()
    // UnlockManager.resetAll()

    if (authChecked && user) {
      router.replace('/learn')
    }
  }, [user, authChecked])


   if (!dbReady) {
    return (
      <ThemedView style={styles.container}>
        <ThemedLogo />
        <ThemedText>Loading offline language data…</ThemedText>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
        <ThemedLogo />
        <Spacer height={20}/>
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