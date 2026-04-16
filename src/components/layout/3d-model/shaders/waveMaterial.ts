import { shaderMaterial } from '@react-three/drei'
import { extend, ThreeElement } from '@react-three/fiber'
import * as THREE from 'three'

const WaveMaterial = shaderMaterial(
  { uTime: 0, uColor: new THREE.Color('#ff0055'), uSpeed: 1.0, uIntensity: 1.0 },
  `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  `uniform float uTime; uniform vec3 uColor; uniform float uSpeed; uniform float uIntensity; varying vec2 vUv;
   void main() { float wave = sin(vUv.x * (10.0 * uIntensity) + uTime * uSpeed); float glow = 0.5 + 0.5 * wave; gl_FragColor = vec4(uColor * glow, 1.0); }`
)

declare global {
  namespace JSX {
    interface IntrinsicElements {
      waveMaterial: ThreeElement<typeof WaveMaterial>
    }
  }
}

extend({ WaveMaterial })
export default WaveMaterial
