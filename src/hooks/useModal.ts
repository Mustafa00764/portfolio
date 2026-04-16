import { ModalContext } from "@/providers/ModalProvider"
import { useContext } from "react"

export const useModal = () => {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModal must be used inside ModalProvider')
  return ctx
}