import { Client, Account, Avatars, Databases, TablesDB } from "react-native-appwrite"

export const client = new Client()
  .setEndpoint('https://tor.cloud.appwrite.io/v1')
  .setProject('69635e88000ec0d15bd4')
  
export const account = new Account(client)
export const avatars = new Avatars(client)
export const databases = new TablesDB(client)