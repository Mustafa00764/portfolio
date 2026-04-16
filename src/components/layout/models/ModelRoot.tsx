// components/ModalRoot.tsx
import { useModal } from '@/hooks/useModal'
import ConnectWithMe from './connect-with-me/ConnectWithMe'
import Settings from './settings/Settings'
import Credits from './credits/Credits'
import ImageSlider from './image-slider/ImageSlider'
import { ModalPropsMap } from '@/types/modal'


type ModalComponents = {
  [K in keyof ModalPropsMap]: React.ComponentType<ModalPropsMap[K] & { onClose: () => void }>;
};

export const MODALS: ModalComponents = {
  connectWithMe: ConnectWithMe,
  settings: Settings,
  credits: Credits,
  imageSlider: ImageSlider,
};

export default function ModalRoot() {
  const { modal, closeModal } = useModal();
  if (!modal) return null;

  const ActiveModal = MODALS[modal.type];
  // Передаём пользовательские пропсы и добавляем onClose
  return <ActiveModal {...modal.props} onClose={closeModal} />;
}