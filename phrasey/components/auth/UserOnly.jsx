import { useUser } from '../../hooks/useUser'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { View } from 'react-native'

import { ThemedLoader } from "../../components/ThemedLoader"

const UserOnly = ({ children }) => {
  const { user, authChecked } = useUser()
  const router = useRouter()
  
  useEffect(() => {
    if (authChecked && user === null) {
      router.replace("/login")
    }
  }, [user, authChecked])


  // show loader while we wait for auth to be checked, or while redirecting if user becomes null
  if (!authChecked || !user) {
    return (
      <ThemedLoader />
    )
  }
  
  return <View style={{ flex: 1 }}>{children}</View>
}

export default UserOnly