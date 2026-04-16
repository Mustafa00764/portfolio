import { ComponentProps } from 'react'
import ConnectWithMe from '@components/layout/models/connect-with-me/ConnectWithMe'
import Settings from '@components/layout/models/settings/Settings'
import Credits from '@components/layout/models/credits/Credits'
import ImageSlider from '@components/layout/models/image-slider/ImageSlider'

export type ModalPropsMap = {
  connectWithMe: Omit<ComponentProps<typeof ConnectWithMe>, 'onClose'>
  settings: Omit<ComponentProps<typeof Settings>, 'onClose'>
  credits: Omit<ComponentProps<typeof Credits>, 'onClose'>
  imageSlider: Omit<ComponentProps<typeof ImageSlider>, 'onClose'>
}

export type ModalType = keyof ModalPropsMap

export type ModalState = {
  [K in ModalType]: {
    type: K
    props: ModalPropsMap[K]
    animate: string
  }
}[ModalType]
