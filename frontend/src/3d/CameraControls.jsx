import React, { useRef, useEffect } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useCharacterCustomization, CameraModes } from './CharacterCustomizationContext'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const cameraPositions = {
  [CameraModes.HEAD]: {
    position: new THREE.Vector3(0, 0.7, 1),
    target:   new THREE.Vector3(0, 0.7, 0),
  },
  [CameraModes.TOP]: {
    position: new THREE.Vector3(-0.5, 0.2, 1.5),
    target:   new THREE.Vector3(0, 0.2, 0),
  },
  [CameraModes.BOTTOM]: {
    position: new THREE.Vector3(0, -0.5, 2.5),
    target:   new THREE.Vector3(0, -0.5, 0),
  },
}

export default function CameraControls() {
  const controlsRef = useRef()

  

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={true}
      dampingFactor={0.2}
      // enableZoom={false}
      // Lorsque l'utilisateur commence à interagir, repasser en mode FREE
    />
  )
}
