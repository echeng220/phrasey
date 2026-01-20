import { createContext, useEffect, useState } from "react"
import { client, databases } from "../lib/appwrite"
import { ID, Permission, Role, Query } from "react-native-appwrite"
import { useUser } from "../hooks/useUser"

const DATABASE_ID = "6969d737002e1e87e36c"
const TABLE_ID = "books"

export const LearnContext = createContext()

export function LearnProvider({children}) {
  const [language, setLanguage] = useState('')
  const [category, setCategory] = useState('')
  const [intent, setIntent] = useState('')
  const { user } = useUser()


  return (
    <LearnContext.Provider 
      value={{ language, setLanguage, category, setCategory, intent, setIntent }}
    >
      {children}
    </LearnContext.Provider>
  )
}