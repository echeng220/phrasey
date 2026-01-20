import { StyleSheet, FlatList, Pressable, useColorScheme, View, ScrollView } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import RNPickerSelect from "react-native-picker-select"

import { useLearn } from "../../../../../hooks/useLearn"
import { Colors } from "../../../../../constants/colors"

// themed components
import ThemedText from "../../../../../components/ThemedText"
import ThemedView from "../../../../../components/ThemedView"
import Spacer from "../../../../../components/Spacer"
import ThemedCard from "../../../../../components/ThemedCard"

import seed from "../../../../../data/seed.json"

const FrameDetails = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light

    const { language, intent } = useLearn()
    const router = useRouter()
    const [selectedVocab, setSelectedVocab] = useState(null)
    const [pronunciation, setPronunciation] = useState('')

    // Find the frames from seed data
    const frames = seed.sentence_frames.filter(frame => (frame.intentId === intent) && (frame.language === language)) || []

    // Get vocabulary options for the current language
    const vocabOptions = seed.vocabulary
        .filter(v => v.language === language)
        .map(v => ({ label: `${v.text} (${v.pronunciation})`, value: v.id, vocab: v }))

    const handleVocabSelect = (vocabId) => {
        const selected = seed.vocabulary.find(v => v.id === vocabId)
        setSelectedVocab(selected)
        setPronunciation(selected.pronunciation.replace(/{[^}]+}/g, selected.text))
    }

    const renderFrame = (frame) => {
        let displayTemplate = frame.template
        if (selectedVocab) {
            displayTemplate = frame.template.replace(/{[^}]+}/g, selectedVocab.text)
        }

        return (
            <ThemedCard style={[styles.card, { backgroundColor: theme.cardBackground }]}>
                <View style={styles.cardContent}>
                    <ThemedText style={[styles.template, { color: theme.title }]}>
                        {displayTemplate}
                    </ThemedText>
                    <ThemedText style={[styles.pronunciation, { color: theme.subtitle }]}>
                        {selectedVocab !== null ? pronunciation : frame?.pronunciation}
                    </ThemedText>
                </View>
            </ThemedCard>
        )
    }

    return (
        <ThemedView style={styles.container} safe={true}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Spacer />

                {/* Vocabulary Dropdown */}
                <View style={styles.dropdownSection}>
                    <ThemedText style={styles.dropdownLabel}>Select vocabulary:</ThemedText>
                    <RNPickerSelect
                        onValueChange={handleVocabSelect}
                        items={vocabOptions}
                        placeholder={{ label: "Choose a word...", value: null }}
                        style={{
                            inputIOS: {
                                fontSize: 16,
                                paddingVertical: 12,
                                paddingHorizontal: 10,
                                borderWidth: 1,
                                borderColor: theme.border,
                                borderRadius: 8,
                                color: theme.title,
                                paddingRight: 30,
                                backgroundColor: theme.cardBackground,
                            },
                            inputAndroid: {
                                fontSize: 16,
                                paddingHorizontal: 10,
                                paddingVertical: 8,
                                borderWidth: 1,
                                borderColor: theme.border,
                                borderRadius: 8,
                                color: theme.title,
                                paddingRight: 30,
                                backgroundColor: theme.cardBackground,
                            },
                            placeholder: {
                                color: theme.subtitle,
                            },
                        }}
                    />
                </View>

                <Spacer />

                {/* Frames List */}
                <FlatList
                    scrollEnabled={false}
                    data={frames}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => renderFrame(item)}
                />
            </ScrollView>
        </ThemedView>
    )
}

export default FrameDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "stretch",
    },
    scrollContent: {
        paddingBottom: 20,
    },
    dropdownSection: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    dropdownLabel: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
    },
    list: {
        paddingHorizontal: 20,
    },
    card: {
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardContent: {
        gap: 8,
    },
    template: {
        fontSize: 18,
        fontWeight: "bold",
    },
    pronunciation: {
        fontSize: 14,
        fontStyle: "italic",
    },
})