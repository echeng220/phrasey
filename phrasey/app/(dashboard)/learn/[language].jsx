import { StyleSheet, FlatList, Pressable, useColorScheme } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { Ionicons } from "@expo/vector-icons"

import { Colors } from "../../../constants/colors"
import { useLearn } from "../../../hooks/useLearn"

// themed components
import ThemedText from "../../../components/ThemedText"
import ThemedButton from "../../../components/ThemedButton"
import ThemedLoader from "../../../components/ThemedLoader"
import ThemedView from "../../../components/ThemedView"
import Spacer from "../../../components/Spacer"
import ThemedCard from "../../../components/ThemedCard"

import seed from "../../../data/seed.json";

const LanguageDetails = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light

    const { code } = useLocalSearchParams()
    const { setCategory } = useLearn()
    const router = useRouter()

    console.log('hit LanguageDetails')

    function handlePress(item) {
        setCategory(item.id)
        router.push(`/learn/${code}/${item.id}`)
    }

    return (
    <ThemedView style={styles.container} safe={true}>

      <Spacer />
      {/* <ThemedText title={true} style={styles.heading}>
        Categories
      </ThemedText> */}

      <Spacer />
      <FlatList
        data={seed.categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable onPress={() => handlePress(item)}>
            <ThemedCard style={styles.card}>
              <Ionicons
                  size={25}
                  name={item.icon}
                  color={ theme.iconColor }
              />
              <ThemedText style={styles.title}>
                {item.displayName}
              </ThemedText>
            </ThemedCard>
          </Pressable>
        )}
      >
      </FlatList>

    </ThemedView>
  )
}

export default LanguageDetails

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