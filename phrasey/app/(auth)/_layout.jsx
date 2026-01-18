import { Stack } from "expo-router"
import { StatusBar } from "react-native"
import { useUser } from "../../hooks/useUser"
import { useRouter, useSegments } from "expo-router"
import { useEffect } from "react"

export default function AuthLayout() {
  const { user, authChecked } = useUser()
  const router = useRouter()
  // const segments = useSegments()

  useEffect(() => {
    if (authChecked && user !== null) {
      router.replace("/profile")
    }
  }, [user, authChecked])

  return (
    <>
      <StatusBar style="auto" />
      <Stack 
        screenOptions={{ headerShown: false, animation: "none" }} 
      />
    </>
  )
}