import { StyleSheet, FlatList, View, ScrollView, useColorScheme, Pressable } from 'react-native'
import { useState, useMemo, useEffect } from 'react'
import { Ionicons } from "@expo/vector-icons"
import { useUser } from '../../hooks/useUser'
import { Colors } from '../../constants/colors'
import { loadPackState } from '../../storage/loadPackState'

import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import ThemedButton from '../../components/ThemedButton'
import ThemedCard from '../../components/ThemedCard'

import seed from "../../data/seed/seed.json"
import UnlockManager from '../../storage/UnlockManager'
import { router } from 'expo-router'

const Purchase = () => {
  const { user } = useUser()
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  const [selectedItems, setSelectedItems] = useState({}) // { "de-1": true, "cn-2": true }
  const [freeUnlocks, setFreeUnlocks] = useState({}) // { "de": 2, "cn": 1, "hk": 2 }
  const packPrice = 0.99

  // Load free unlocks on mount
  useEffect(() => {
    const loadUnlocks = async () => {
      const { freeUnlocks } = await loadPackState()
      setFreeUnlocks(freeUnlocks || {})
    }
    loadUnlocks()
  }, [])

  // Group categories by language
  const languageCategories = useMemo(() => {
    const grouped = {}
    seed.languages.forEach(lang => {
      grouped[lang.code] = {
        language: lang,
        categories: seed.categories
      }
    })
    return grouped
  }, [])

  const toggleCategory = (languageCode, categoryKey) => {
    const key = `${languageCode}_${categoryKey}`
    setSelectedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const selectAllCategories = (languageCode) => {
    const newItems = { ...selectedItems }
    seed.categories.forEach(cat => {
      const key = `${languageCode}_${cat.key.toLowerCase()}`
      newItems[key] = true
    })
    setSelectedItems(newItems)
  }

  const deselectAllCategories = (languageCode) => {
    const newItems = { ...selectedItems }
    seed.categories.forEach(cat => {
      const key = `${languageCode}_${cat.key.toLowerCase()}`
      delete newItems[key]
    })
    setSelectedItems(newItems)
  }

  // Count free and paid packs for a language
  const getLanguagePackCounts = (languageCode) => {
    const categories = languageCategories[languageCode].categories
    const availableFreeUnlocks = freeUnlocks[languageCode] || 0
    let freeCount = 0
    let paidCount = 0

    categories.forEach((cat, index) => {
      if (selectedItems[`${languageCode}_${cat.key.toLowerCase()}`]) {
        if (freeCount < availableFreeUnlocks) {
          freeCount++
        } else {
          paidCount++
        }
      }
    })

    return { freeCount, paidCount }
  }

  const calculateTotal = () => {
    let total = 0
    seed.languages.forEach(lang => {
      const { paidCount } = getLanguagePackCounts(lang.code)
      total += paidCount * packPrice
    })
    return total
  }

  async function handleCheckout() {
    const selectedPacks = Object.entries(selectedItems)
      .filter(([_, selected]) => selected)
      .map(([key]) => key)
    
    console.log('selectedItems:', selectedItems)
    console.log('Checkout with packs:', selectedPacks)
    
    for (const pack of selectedPacks) {
        const [languageCode, categoryKey] = pack.split('_')
        const source = (freeUnlocks[languageCode] || 0) > 0 ? 'free' : 'paid'
        await UnlockManager.unlockPack(pack, languageCode, source)
    }

    router.replace('/learn')

  }

  const renderLanguageSection = (languageCode) => {
    const { language, categories } = languageCategories[languageCode]
    const selectedCount = categories.filter(cat => 
      selectedItems[`${languageCode}_${cat.key.toLowerCase()}`]
    ).length
    const allSelected = selectedCount === categories.length
    const availableFreeUnlocks = freeUnlocks[languageCode] || 0
    const { freeCount, paidCount } = getLanguagePackCounts(languageCode)

    // Track which items are marked as free for this language
    let freeItemCount = 0
    const freeItemIds = new Set()
    
    categories.forEach(cat => {
      const key = `${languageCode}_${cat.key.toLowerCase()}`
      if (selectedItems[key] && freeItemCount < availableFreeUnlocks) {
        freeItemIds.add(cat.id)
        freeItemCount++
      }
    })

    return (
      <View key={languageCode} style={styles.languageSection}>
        <View style={styles.languageHeader}>
          <View style={{ flex: 1 }}>
            <ThemedText style={[styles.languageTitle, { color: theme.title }]}>
              {language.name}
            </ThemedText>
            <ThemedText style={[styles.freeUnlocksText, { color: Colors.primary }]}>
              {availableFreeUnlocks} free unlock{availableFreeUnlocks !== 1 ? 's' : ''} available
            </ThemedText>
          </View>
          <Pressable 
            onPress={() => allSelected ? deselectAllCategories(languageCode) : selectAllCategories(languageCode)}
            style={styles.toggleButton}
          >
            <Ionicons 
              name={allSelected ? "checkmark-circle" : "ellipse-outline"}
              size={24}
              color={allSelected ? Colors.primary : theme.subtitle}
            />
            <ThemedText style={[styles.selectedCount, { color: theme.subtitle }]}>
              {selectedCount}/{categories.length}
            </ThemedText>
          </Pressable>
        </View>

        <Spacer height={10} />

        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => {
            const isSelected = selectedItems[`${languageCode}_${item.key.toLowerCase()}`]
            const isFree = isSelected && freeItemIds.has(item.id)
            
            return (
              <Pressable 
                onPress={() => toggleCategory(languageCode, item.key.toLowerCase())}
                style={styles.categoryItemPressable}
              >
                <ThemedCard style={[
                    styles.categoryCard,
                    { 
                        backgroundColor: isSelected ? (isFree ? '#52bf90' : Colors.primary) : theme.cardBackground,
                        borderLeftColor: isSelected ? (isFree ? '#52bf90' : Colors.primary) : theme.border,
                    }
                ]}>
                  <View style={styles.categoryContent}>
                    <Ionicons 
                      name={item.icon} 
                      size={24} 
                      color={isSelected ? '#fff' : theme.iconColor}
                    />
                    <View style={{ flex: 1 }}>
                      <ThemedText style={[
                        styles.categoryName,
                        { color: isSelected ? '#fff' : theme.title }
                      ]}>
                        {item.displayName}
                      </ThemedText>
                      <ThemedText style={[
                        styles.categoryPrice,
                        { color: isSelected ? 'rgba(255,255,255,0.8)' : theme.subtitle }
                      ]}>
                        {isSelected && isFree ? 'FREE' : `$${packPrice.toFixed(2)}`}
                      </ThemedText>
                    </View>
                    <Ionicons 
                      name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                      size={24}
                      color={isSelected ? '#fff' : theme.subtitle}
                    />
                  </View>
                </ThemedCard>
              </Pressable>
            )
          }}
        />

        <Spacer height={20} />
      </View>
    )
  }

  const selectedCount = Object.values(selectedItems).filter(Boolean).length
  const totalFreeCount = Object.keys(languageCategories).reduce((sum, langCode) => {
    return sum + getLanguagePackCounts(langCode).freeCount
  }, 0)
  const totalPaidCount = selectedCount - totalFreeCount

  return (
    <ThemedView style={styles.container} safe={true}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText title={true} style={[styles.heading, { color: theme.title }]}>
          Purchase Packs
        </ThemedText>
        
        <ThemedText style={[styles.subheading, { color: theme.subtitle }]}>
          Unlock additional language packs to expand your learning
        </ThemedText>

        <Spacer height={20} />

        {seed.languages.map(lang => renderLanguageSection(lang.code))}

        <Spacer height={30} />
      </ScrollView>

      {/* Checkout Section - Sticky at bottom */}
      <View style={[styles.checkoutContainer, { backgroundColor: theme.navBackground, borderTopColor: theme.border }]}>
        <View style={styles.totalSection}>
          <View>
            <ThemedText style={[styles.totalLabel, { color: theme.subtitle }]}>
              {totalFreeCount > 0 && `${totalFreeCount} free + `}{totalPaidCount} paid pack{totalPaidCount !== 1 ? 's' : ''}
            </ThemedText>
          </View>
          <ThemedText style={[styles.totalPrice, { color: Colors.primary }]}>
            ${calculateTotal().toFixed(2)}
          </ThemedText>
        </View>
        
        <ThemedButton 
          onPress={handleCheckout}
          disabled={selectedCount === 0}
          style={[styles.checkoutButton, { opacity: selectedCount === 0 ? 0.5 : 1 }]}
        >
          <ThemedText style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
            Checkout
          </ThemedText>
        </ThemedButton>
      </View>
    </ThemedView>
  )
}

export default Purchase

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 140,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subheading: {
    fontSize: 14,
    marginTop: 8,
  },
  languageSection: {
    marginBottom: 20,
  },
  languageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  languageTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  freeUnlocksText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  selectedCount: {
    fontSize: 12,
  },
  categoryItemPressable: {
    marginVertical: 6,
  },
  categoryCard: {
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
  },
  categoryPrice: {
    fontSize: 12,
    marginTop: 2,
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
  },
  freeNote: {
    fontSize: 11,
    marginTop: 2,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "700",
  },
  checkoutButton: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
})