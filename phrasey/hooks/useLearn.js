import { useContext } from "react"
import { LearnContext } from "../contexts/LearnContext"

export function useLearn() {
  const context = useContext(LearnContext)

  if (!context) {
    throw new Error("useLearn must be used within a LearnProvider")
  }

  return context
}