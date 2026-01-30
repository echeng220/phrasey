import { FlatList, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import CountryFlag from 'react-native-country-flag'
import { useEffect, useState } from 'react'


import { useLearn } from '../../hooks/useLearn'
import { Colors } from '../../constants/colors'

import Spacer from "../../components/Spacer"
import ThemedCard from '../../components/ThemedCard'
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"

import seed from "../../data/seed/seed.json";

const Learn = () => {
  const { language, setLanguage } = useLearn()
  const router = useRouter()

  function handlePress(item) {
    setLanguage(item.code)
    router.push(`/learn/${item.code}`)

    console.log('item code:', item.code)
    console.log('Selected language:', language)
  }

  return (
    <ThemedView style={styles.container} safe={true}>

      <Spacer />

      <Spacer />
      <FlatList
        data={seed.languages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable onPress={() => handlePress(item)}>
            <ThemedCard style={styles.card}>
              <CountryFlag isoCode={item.code} size={25} style={styles.flagContainer}/>
              <ThemedText style={styles.title}>
                {item.name} ({item.nativeName})
              </ThemedText>
            </ThemedCard>
          </Pressable>
        )}
      >
      </FlatList>

    </ThemedView>
  )
}

export default Learn

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  flagContainer: {
    borderRadius: 5,
    overflow: 'hidden',
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  list: {
    marginTop: 40
  },
  card: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    width: "90%",
    marginHorizontal: "5%",
    marginVertical: 10,
    padding: 10,
    paddingLeft: 14,
    borderLeftColor: Colors.primary,
    borderLeftWidth: 4
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 5,
  },
})