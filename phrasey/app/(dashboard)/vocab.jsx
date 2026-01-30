import { StyleSheet, FlatList, SectionList, useColorScheme, TextInput, View } from 'react-native'
import { useState, useMemo, useEffect } from 'react'
import { Dropdown } from 'react-native-element-dropdown'
import { Ionicons } from "@expo/vector-icons"

import { useDatabase } from '../../hooks/useDatabase'
import { useLearn } from '../../hooks/useLearn'
import { Colors } from '../../constants/colors'

import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"
import ThemedCard from "../../components/ThemedCard"
import Spacer from '../../components/Spacer'

import seed from "../../data/seed/seed.json";

const Vocab = () => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light
  
  // const { queryVocabulary } = useDatabase()
  const { language, category } = useLearn()
  const [vocabulary, setVocabulary] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState(language || 'us')

  // Fetch vocabulary when language changes
  useEffect(() => {
    const loadVocabulary = async () => {
      if (selectedLanguage) {
        const result = seed.vocabulary.filter(v => v.language === selectedLanguage)
        setVocabulary(result || [])
      }
    }
    loadVocabulary()
  }, [selectedLanguage, category])

  // Language dropdown options
  const languageOptions = [
    { label: '🇺🇸 English', value: 'us' },
    { label: '🇩🇪 Deutsch', value: 'de' },
    { label: '🇨🇳 中文', value: 'cn' },
  ]

  // Filter and organize vocabulary by first letter
  const organizedVocabulary = useMemo(() => {
    let filtered = vocabulary.filter(item =>
      item.englishMeaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.text.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Group by first letter
    const grouped = {}
    filtered.forEach(item => {
      const firstLetter = item.englishMeaning.charAt(0).toUpperCase()
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = []
      }
      grouped[firstLetter].push(item)
    })

    // Convert to section list format and sort alphabetically
    return Object.keys(grouped)
      .sort()
      .map(letter => ({
        title: letter,
        data: grouped[letter],
      }))
  }, [vocabulary, searchQuery])

  const renderVocabItem = ({ item }) => (
    <ThemedCard style={[styles.vocabCard, { backgroundColor: theme.cardBackground }]}>
      <ThemedView style={styles.vocabContent}>
        <ThemedView style={{ flex: 1 }}>
          <ThemedText style={[styles.vocabText, { color: theme.title }]}>
            {item.englishMeaning}
          </ThemedText>
        </ThemedView>
        <ThemedView style={{ flex: 1 }}>
          <ThemedText style={[styles.vocabText, { color: theme.title }]}>
            {item.text}
          </ThemedText>
          <ThemedText style={[styles.pronunciation, { color: theme.subtitle }]}>
            {item.pronunciation}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedCard>
  )

  const renderSectionHeader = ({ section: { title } }) => (
    <ThemedText style={[styles.sectionHeader, { color: theme.title }]}>
      {title}
    </ThemedText>
  )

  return (
    <ThemedView style={styles.container} safe={true}>

      {/* Language Dropdown */}
      <ThemedView style={styles.dropdownSection}>
        <Dropdown
          style={[styles.dropdownInput, { borderColor: theme.title }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={languageOptions}
          maxHeight={300}
          labelField="label"
          valueField="value"
          value={selectedLanguage}
          onChange={(item) => setSelectedLanguage(item.value)}
          renderLeftIcon={() => (
              <Ionicons 
                  name="language"
                  size={20}
                  color={theme.title}
                  paddingHorizontal={10}
              />
          )}
        />
      </ThemedView>

      {/* Search Input */}
      <View style={styles.searchSection}>
        <View style={[styles.searchInputContainer, { borderColor: theme.border, backgroundColor: theme.cardBackground }]}>
          <Ionicons 
            name="search"
            size={20}
            color={theme.subtitle}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { 
              color: theme.title,
            }]}
            placeholder="Search vocabulary..."
            placeholderTextColor={theme.subtitle}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <Spacer />

      {/* Vocabulary List */}
      {organizedVocabulary.length > 0 ? (
        <SectionList
          sections={organizedVocabulary}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderVocabItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.list}
        />
      ) : (
        <ThemedView style={styles.emptyState}>
          <ThemedText>No vocabulary found</ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  )
}

export default Vocab

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
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
  dropdownInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderColor: Colors.primary,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  vocabCard: {
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
  },
  vocabContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  vocabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  pronunciation: {
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})