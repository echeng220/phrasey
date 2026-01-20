import { Tabs } from "expo-router"
import { useColorScheme, Pressable, View } from "react-native"
import { Colors } from "../../constants/colors"
import { Ionicons } from "@expo/vector-icons"
import CountryFlag from 'react-native-country-flag'
import { useUser } from "../../hooks/useUser"
import { useLearn } from "../../hooks/useLearn"
import { useRouter } from "expo-router"
import { useEffect } from "react"

import ThemedText from "../../components/ThemedText"

// Flag emoji map for language codes
const flagMap = {
  "us": "🇺🇸",
  "de": "🇩🇪",
  "cn": "🇨🇳",
}

export default function DashboardLayout() {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
    const { user, authChecked } = useUser()
    const { language } = useLearn()
    const router = useRouter()

    useEffect(() => {
      if (authChecked && user === null) {
        router.replace("/login")
      }
    }, [user, authChecked])

    if (!authChecked) {
      return null
    }

    const FlagButton = () => (
    <Pressable 
        onPress={() => router.push('/learn')}
        style={{ marginRight: 15 }}
    >
        <CountryFlag isoCode={language} size={25} style={{ borderRadius: 5 }}/>
    </Pressable>
)

    return (
        <Tabs 
                screenOptions={{ 
                    headerTitleStyle: {display: 'none'},
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
                                name={ focused ? 'book' : 'book-outline'}
                                color={ focused ? theme.iconColorFocused : theme.iconColor }
                            />
                        )
                    ,}}
                />
                <Tabs.Screen 
                    name='create' 
                    options={{
                        title: 'Create',
                        tabBarIcon: ({ focused }) => (
                            <Ionicons
                                size={24}
                                name={ focused ? 'create' : 'create-outline'}
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
                    name="books"
                    options={{ href: null }}
                ></Tabs.Screen>
                <Tabs.Screen
                    name="books/[id]"
                    options={{ href: null }}
                ></Tabs.Screen>
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
            </Tabs>
    )
}
