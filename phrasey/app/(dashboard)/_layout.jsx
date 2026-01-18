import { Tabs } from "expo-router"
import { useColorScheme } from "react-native"
import { Colors } from "../../constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { useUser } from "../../hooks/useUser"
import { useRouter } from "expo-router"
import { useEffect } from "react"

export default function DashboardLayout() {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
    const { user, authChecked } = useUser()
    const router = useRouter()

    useEffect(() => {
      if (authChecked && user === null) {
        router.replace("/login")
      }
    }, [user, authChecked])

    if (!authChecked) {
      return null
    }

    return (
        <Tabs 
                screenOptions={{ 
                    headerShown: false, 
                    tabBarStyle: {
                        backgroundColor: theme.navBackground,
                        // paddingTop: 90,
                        // height: 10
                    },
                    tabBarActiveTintColor: theme.iconColorFocused,
                    tabBarInactiveTintColor: theme.iconColor
                }}
            >
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
                    name='books' 
                    options={{
                        title: 'Books',
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
                    name="books/[id]"
                    options={{ href: null }}
                ></Tabs.Screen>
            </Tabs>
    )
}