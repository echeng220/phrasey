import { createContext, useEffect, useState } from "react"
import { client, databases } from "../lib/appwrite"
import { ID, Permission, Role, Query } from "react-native-appwrite"
import { useUser } from "../hooks/useUser"

const DATABASE_ID = "6969d737002e1e87e36c"
const TABLE_ID = "books"

export const BooksContext = createContext()

export function BooksProvider({children}) {
  const [books, setBooks] = useState([])
  const { user } = useUser()

  async function fetchBooks() {
    try {
      const response = await databases.listRows({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        queries: [ Query.equal("userId", user.$id) ]
      })

      setBooks(response.rows)
      console.log(response.rows)

    } catch (error) {
      console.error(error.message)
    }
  }

  async function fetchBookById(id) {
    try {
      const response = await databases.getRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: id
      })
      return response 
    } catch (error) {
      console.log(error.message)
    }
  }

  async function createBook(data) {
    try {
      const newBook = await databases.createRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: ID.unique(),
        data: {...data, userId: user.$id},
        permissions: [
            Permission.read(Role.user(user.$id)),
            Permission.update(Role.user(user.$id)),
            Permission.delete(Role.user(user.$id)),
        ]}
      )
      return newBook
    } catch (error) {
      console.log(error.message)
    }
  }

  async function deleteBook(id) {
    try {
      await databases.deleteRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: id
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    let unsubscribe
    const channel = `databases.${DATABASE_ID}.tables.${TABLE_ID}.rows`

    if (user) {
      fetchBooks()
      unsubscribe = client.subscribe(channel, (response) => {
        const { payload, events } = response

        if (events[0].includes("create")) {
          setBooks((prevBooks) => [...prevBooks, payload])
        }

        if (events[0].includes("delete")) {
          setBooks((prevBooks) => prevBooks.filter((book) => book.$id !== payload.$id))
        }
      })
    } else {
      setBooks([])
    }

    return () => {
      if (unsubscribe) unsubscribe()
    }

  }, [user])

  return (
    <BooksContext.Provider 
      value={{ books, fetchBooks, fetchBookById, createBook, deleteBook }}
    >
      {children}
    </BooksContext.Provider>
  )
}