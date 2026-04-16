import { createContext, useState, ReactNode } from 'react'
import { ModalState, ModalType, ModalPropsMap } from '@/types/modal'

interface ModalContextValue {
  modal: ModalState | null
  openModal: <T extends ModalType>(type: T, props: ModalPropsMap[T], animate: string) => void
  closeModal: () => void
}

export const ModalContext = createContext<ModalContextValue | undefined>(undefined)

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState<ModalState | null>(null)

  const openModal = <T extends ModalType>(type: T, props: ModalPropsMap[T], animate: string) => {
    setModal({ type, props, animate } as ModalState)
  }

  const closeModal = () => {
    // setTimeout(() => {
      setModal(null)
    // }, 150)
  }

  console.log(modal)

  return (
    <ModalContext.Provider value={{ modal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  )
}
