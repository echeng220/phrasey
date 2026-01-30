import { StyleSheet, FlatList, Pressable, useColorScheme, View } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import { Dropdown } from 'react-native-element-dropdown';

import { useLearn } from "../../../../../hooks/useLearn"
import { Colors } from "../../../../../constants/colors"

// themed components
import ThemedText from "../../../../../components/ThemedText"
import ThemedView from "../../../../../components/ThemedView"
import Spacer from "../../../../../components/Spacer"
import ThemedCard from "../../../../../components/ThemedCard"

import seed from "../../../../../data/seed/seed.json"

const FrameDetails = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light

    const { language, category, intent } = useLearn()
    const router = useRouter()
    const [selectedVocab, setSelectedVocab] = useState(null)
    const [pronunciation, setPronunciation] = useState('')
    

    // Find the frames from seed data
    const frame = seed.sentence_frames.find(frame => (frame.intentId === intent) && (frame.language === language)) || []
    const intentDescription = seed.intents.find(i => i.id === intent)?.description || ''

    const [breakdown, setBreakdown] = useState(frame.breakdown || [])

    // Get vocabulary options for the current language
    const vocabOptions = seed.vocabulary
        .filter(v => (v.language === language) && (v.categoryId === null || v.categoryId === category))
        .map(v => ({ label: `${v.englishMeaning}`, value: v.id, vocab: v }))

    const handleVocabSelect = (vocabId) => {
        const selected = seed.vocabulary.find(v => v.id === vocabId)
        setSelectedVocab(selected)
        setPronunciation(selected?.pronunciation.replace(/{[^}]+}/g, selected.text))
        setBreakdown([...frame.breakdown, {
            id: selected.id,
            text: selected.text,
            meaning: selected.englishMeaning,
            slotKey: selected.slotKey
        }])
    }

    const renderFrame = (frame) => {
        let displayTemplate = frame.template
        if (selectedVocab) {
            displayTemplate = frame.template.replace(/{[^}]+}/g, selectedVocab.text)
        }

        let displayPronunciation = frame.pronunciation
        if (selectedVocab) {
            displayPronunciation = frame.pronunciation.replace(/{[^}]+}/g, selectedVocab.pronunciation)
        }

        let displayTranslation = frame.translation
        if (selectedVocab) {
            displayTranslation = frame.translation.replace(/{[^}]+}/g, selectedVocab.englishMeaning)
        }

        return (
            <ThemedCard style={[styles.card, { backgroundColor: theme.cardBackground }]}>
                <ThemedView style={styles.cardContent}>
                    <ThemedText style={[styles.template, { color: theme.title, fontSize: 25 }]}>
                        {displayTemplate}
                    </ThemedText>
                    <ThemedText style={[styles.pronunciation, { color: theme.subtitle, fontSize: 18 }]}>
                        {displayPronunciation}
                    </ThemedText>
                    <ThemedText style={{ fontSize: 16 }}>{displayTranslation}</ThemedText>
                </ThemedView>
            </ThemedCard>
        )
    }

    return (
        <ThemedView style={styles.container} safe={true}>
                <ThemedText title={true} style={styles.heading}>
                    {intentDescription}
                </ThemedText>
                <Spacer />

                {/* Vocabulary Dropdown */}
                <ThemedView style={styles.dropdownSection}>
                    <Dropdown
                        style={styles.dropdownInput}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={vocabOptions}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Fill in the blank..."
                        searchPlaceholder="Search..."
                        value={selectedVocab?.id}
                        onChange={(item) => handleVocabSelect(item.value)}
                        renderLeftIcon={() => (
                            <Ionicons 
                                name="search"
                                size={20}
                                color={theme.title}
                                paddingHorizontal={10}
                            />
                        )}
                    />
                </ThemedView>


                {/* Frames List */}
                <FlatList
                    scrollEnabled={false}
                    data={[frame]}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => renderFrame(item)}
                />
                <Spacer />

                <FlatList
                    data={breakdown}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <Pressable>
                            <ThemedCard style={[styles.slot, { borderLeftColor: Colors[item.slotKey] }]}>
                                <View style={styles.slotHeader}>
                                    <View style={{ flex: 1 }}>
                                        <ThemedText style={styles.title}>
                                            {item.text}
                                        </ThemedText>
                                        <ThemedText>
                                            {item.meaning}
                                        </ThemedText>
                                    </View>
                                    <ThemedCard style={[styles.tag, { backgroundColor: Colors[item.slotKey] }]}>
                                        <ThemedText style={styles.tagText}>
                                            {item.slotKey}
                                        </ThemedText>
                                    </ThemedCard>
                                </View>
                            </ThemedCard>
                        </Pressable>
                    )}
                />
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
    dropdownInput: {
        height: 50,
        // borderColor: theme.title,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        // backgroundColor: theme.cardBackground,
    },
    placeholderStyle: {
        fontSize: 16,
        // color: theme.subtitle,
    },
    selectedTextStyle: {
        fontSize: 16,
        // color: theme.title,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        // color: theme.title,
        // borderColor: theme.border,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    heading: {
        fontWeight: "bold",
        fontSize: 18,
        textAlign: "center",
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
        borderWidth: 3,
        borderColor: Colors.primary,
        padding: 16,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 0,
    },
    slot: {
        gap: 20,
        // marginHorizontal: "5%",
        marginVertical: 10,
        padding: 10,
        paddingLeft: 14,
        borderLeftWidth: 4
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
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 5,
        marginBottom: 5,
    },
    slotHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 10,
    },
    tag: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    tagText: {
        fontSize: 12,
        fontWeight: "600",
        color: '#fff',
    },
})