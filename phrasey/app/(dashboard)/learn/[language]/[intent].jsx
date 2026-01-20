import { StyleSheet, FlatList, Pressable, useColorScheme } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

import { useLearn } from "../../../../hooks/useLearn"
import { Colors } from "../../../../constants/colors"

// themed components
import ThemedText from "../../../../components/ThemedText"
import ThemedView from "../../../../components/ThemedView"
import Spacer from "../../../../components/Spacer"
import ThemedCard from "../../../../components/ThemedCard"

import seed from "../../../../data/seed.json"

const IntentDetails = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light

    const { language, category, intent, setIntent } = useLearn()
    const router = useRouter()

    // Find the category from seed data
    const categoryIntents = seed.categoryIntents.filter(cat => cat.categoryId === category)
    const intents = categoryIntents.map(cat => seed.intents.find(intent => intent.id === cat.intentId)) || []

    function handlePress(item) {
        setIntent(item.id)
        router.push(`/learn/${language}/${category}/${item.id}`)
    }

    console.log('category intents:', categoryIntents)
    console.log('intents:', intents)

    return (
        <ThemedView style={styles.container} safe={true}>
            <Spacer />
            <FlatList
                data={intents}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <Pressable onPress={() => handlePress(item)}>
                        <ThemedCard style={styles.card}>
                            <Ionicons
                                size={25}
                                name={item.icon}
                                color={theme.iconColor}
                            />
                            <ThemedText style={styles.title}>
                                {item.description}
                            </ThemedText>
                        </ThemedCard>
                    </Pressable>
                )}
            />
        </ThemedView>
    )
}

export default IntentDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "stretch",
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