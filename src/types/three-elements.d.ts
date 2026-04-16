import { ThreeElement } from '@react-three/fiber'
import WaveMaterial from '../components/layout/3d-model/shaders/waveMaterial' // Укажи правильный путь до файла шейдера

declare global {
  namespace JSX {
    interface IntrinsicElements {
      waveMaterial: ThreeElement<typeof WaveMaterial>
    }
  }
}