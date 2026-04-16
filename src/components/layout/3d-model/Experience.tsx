import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Center, Float, ContactShadows, Grid } from '@react-three/drei'
import * as THREE from 'three'

export default function Experience({ settings }: { settings: any }) {
  const { scene } = useGLTF('/3d/freefire_new_sukuna_3d_model.glb')

  const wireframeScene = useMemo(() => {
    const clone = scene.clone()
    clone.traverse((node: any) => {
      if (node.isMesh) {
        node.material = new THREE.MeshBasicMaterial({
          wireframe: true,
          transparent: true,
          depthTest: true,
          polygonOffset: true, // Помогает сетке персонажа не мигать
          polygonOffsetFactor: -1,
          polygonOffsetUnits: -1
        })
      }
    })
    return clone
  }, [scene])

  useFrame(() => {
    scene.traverse((node: any) => {
      if (node.isMesh) {
        node.material.visible = settings.showModel
        if (node.material.color) node.material.color.set(settings.modelColor)
        node.material.metalness = settings.metalness
        node.material.roughness = settings.roughness
        node.material.opacity = settings.opacity
        node.material.transparent = settings.opacity < 1
        // Модель ВСЕГДА записывает глубину, чтобы быть поверх пола
        node.material.depthWrite = true
      }
    })

    wireframeScene.traverse((node: any) => {
      if (node.isMesh) {
        node.material.visible = settings.showWireframe
        node.material.color.set(settings.wireframeColor)
        node.material.opacity = settings.wireframeOpacity
      }
    })
  })

  return (
    <>
      <ambientLight intensity={settings.ambientIntensity} />
      <directionalLight position={[10, 10, 10]} intensity={settings.lightIntensity} />

      <Center bottom>
        <Float
          speed={settings.lockView ? 0 : settings.floatSpeed}
          rotationIntensity={settings.lockView ? 0 : 0.4}
        >
          <primitive object={scene} scale={settings.modelScale} />
          <primitive object={wireframeScene} scale={settings.modelScale} />
        </Float>
      </Center>

      {/* ИСПРАВЛЕННАЯ СЕТКА: Теперь она не может быть над моделькой */}
      {settings.showGrid && (
        <Grid
          position={[0, -0.05, 0]} // Опускаем чуть ниже подошв
          args={[20, 20]}
          cellSize={settings.gridCellSize}
          cellColor={settings.gridColor}
          sectionSize={0}
          fadeDistance={30}
          infiniteGrid={true}
          // Эти два параметра заставляют сетку рисоваться ПОД всем остальным:
          renderOrder={-1}
        >
          {/* Кастомный материал для сетки, чтобы она игнорировала тест глубины */}
          <meshBasicMaterial transparent opacity={0.5} depthTest={false} />
        </Grid>
      )}

      {settings.showShadows && (
        <ContactShadows
          position={[0, -0.04, 0]}
          opacity={settings.shadowOpacity}
          scale={10}
          blur={2.5}
          far={1}
        />
      )}
    </>
  )
}
