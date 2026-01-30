import { Tabs } from "expo-router"
import { useColorScheme, Pressable, View } from "react-native"
import { Colors } from "../../constants/colors"
import { Ionicons } from "@expo/vector-icons"
import CountryFlag from 'react-native-country-flag'
import { useUser } from "../../hooks/useUser"
import { useLearn } from "../../hooks/useLearn"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { loadPackState } from "../../storage/loadPackState"

import ThemedText from "../../components/ThemedText"

export default function DashboardLayout() {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
    const { user, authChecked } = useUser()
    const { language } = useLearn()
    const router = useRouter()
    const [freeUnlocks, setFreeUnlocks] = useState({})

    useEffect(() => {
      if (authChecked && user === null) {
        router.replace("/login")
      }
    }, [user, authChecked])

    useEffect(() => {
      const loadUnlocks = async () => {
        const { freeUnlocks } = await loadPackState();
        setFreeUnlocks(freeUnlocks);
      }
      loadUnlocks();
    }, [])

    if (!authChecked) {
      return null
    }

    const FlagButton = () => (
      <Pressable 
          onPress={() => router.push('/learn')}
          style={{ marginRight: 15, flexDirection: 'row', alignItems: 'center', gap: 8 }}
      >
          <CountryFlag isoCode={language} size={25} style={{ borderRadius: 5 }}/>
      </Pressable>
    )

    const BackButton = () => (
      <Pressable 
          onPress={() => router.back()}
          style={{ marginLeft: 15 }}
      >
          <Ionicons name="chevron-back" size={24} color={theme.title} />
      </Pressable>
    )

    return (
        <Tabs 
                screenOptions={{ 
                    headerTitleStyle: {display: 'none'},
                    headerLeft: () => <BackButton />,
                    headerRight: () => <FlagButton />,
                    tabBarStyle: {
                        backgroundColor: theme.navBackground,
                    },
                    tabBarActiveTintColor: theme.iconColorFocused,
                    tabBarInactiveTintColor: theme.iconColor
                }}
            >
                <Tabs.Screen 
                    name='learn' 
                    options={{
                        title: 'Learn',
                        tabBarIcon: ({ focused }) => (
                            <Ionicons
                                size={24}
                                name={ focused ? 'language' : 'language-outline'}
                                color={ focused ? theme.iconColorFocused : theme.iconColor }
                            />
                        )
                    ,}}
                />
                <Tabs.Screen 
                    name='vocab' 
                    options={{
                        title: 'Vocab',
                        tabBarIcon: ({ focused }) => (
                            <Ionicons
                                size={24}
                                name={ focused ? 'book' : 'book-outline'}
                                color={ focused ? theme.iconColorFocused : theme.iconColor }
                            />
                        )
                    }}
                />
                <Tabs.Screen 
                    name='profile' 
                    options={{
                        title: 'Profile', 
                        tabBarIcon: ({ focused }) => (
                            <Ionicons
                                size={24}
                                name={ focused ? 'person' : 'person-outline'}
                                color={ focused ? theme.iconColorFocused : theme.iconColor }
                            />
                        )
                    }}
                />
                <Tabs.Screen
                    name="learn/[language]"
                    options={{ href: null }}
                ></Tabs.Screen>
                <Tabs.Screen
                    name="learn/[language]/[intent]"
                    options={{ href: null }}
                ></Tabs.Screen>
                <Tabs.Screen
                    name="learn/[language]/[intent]/[frame]"
                    options={{ href: null }}
                ></Tabs.Screen>
                <Tabs.Screen
                    name="purchase"
                    options={{ href: null }}
                ></Tabs.Screen>
            </Tabs>
    )
}