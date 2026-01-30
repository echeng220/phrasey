import { StyleSheet, FlatList, Pressable, useColorScheme, View } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { Ionicons } from "@expo/vector-icons"

import { Colors } from "../../../constants/colors"
import { useLearn } from "../../../hooks/useLearn"

import { loadPackState } from "../../../storage/loadPackState"

// themed components
import ThemedText from "../../../components/ThemedText"
import ThemedView from "../../../components/ThemedView"
import Spacer from "../../../components/Spacer"
import ThemedCard from "../../../components/ThemedCard"

import seed from "../../../data/seed/seed.json";

const LanguageDetails = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light

    const { code } = useLocalSearchParams()
    const { language, setCategory } = useLearn()
    const router = useRouter()
    
    const [packs, setPacks] = useState([]);
    const [unlockedPacks, setUnlockedPacks] = useState([]);
    const [freeUnlocks, setFreeUnlocks] = useState({});

    function handlePress(item) {
        console.log("Pressed item:", JSON.stringify(item));
        const locked = !isUnlocked(item.key.toLowerCase());

        if (locked) {
          console.log("Pack is locked, redirecting to purchase page.");
          router.replace(`/purchase`)
        }

        setCategory(item.id)
        router.push(`/learn/${language}/${item.id}`)
    }

    useEffect(() => {
      async function bootstrap() {
        const {
          allPacks,
          unlockedPacks,
          freeUnlocks
        } = await loadPackState();

        setPacks(allPacks);
        setUnlockedPacks(unlockedPacks);
        setFreeUnlocks(freeUnlocks);

        console.log("ALL packs:", allPacks);
        console.log("Unlocked pack IDs:", unlockedPacks);
        console.log("Free unlocks left:", freeUnlocks);
      }

      bootstrap();
    }, []);

    const isUnlocked = (categoryId) => {
        const packId = `${language}_${categoryId}`;
        console.log("Checking if pack is unlocked:", packId);
        return unlockedPacks.includes(packId);
    }

    const renderCategoryItem = ({ item }) => {
        const locked = !isUnlocked(item.key.toLowerCase());

        return (
            <Pressable onPress={() => handlePress(item)}>
                <ThemedCard style={[styles.card, { backgroundColor: theme.cardBackground}]}>
                    <View style={styles.cardContent}>
                        <Ionicons
                            size={25}
                            name={item.icon}
                            color={theme.iconColor}
                        />
                        <ThemedText style={[styles.title, { flex: 1 }]}>
                            {item.displayName}
                        </ThemedText>
                        { locked ? (
                            <Ionicons
                                size={24}
                                name="lock-closed-outline"
                                color={Colors.primary}
                            />
                        ) : null }
                    </View>
                </ThemedCard>
            </Pressable>
        );
    }

    return (
    <ThemedView style={styles.container} safe={true}>

      <Spacer />
      {language && freeUnlocks[language] !== undefined && (
        <ThemedText style={{ fontSize: 14, fontWeight: '600', color: theme.title }}>
          {freeUnlocks[language]} free unlocks remaining
        </ThemedText>
      )}

      <FlatList
        data={seed.categories}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={renderCategoryItem}
        scrollEnabled={false}
      />

    </ThemedView>
  )
}

export default LanguageDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
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
    width: "90%",
    marginHorizontal: "5%",
    marginVertical: 10,
    padding: 10,
    paddingLeft: 14,
    borderLeftColor: Colors.primary,
    borderLeftWidth: 4,
    borderRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
})