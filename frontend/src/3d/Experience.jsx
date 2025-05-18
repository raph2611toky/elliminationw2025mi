import { ContactShadows, Environment, OrbitControls, Sky, Text, useTexture } from '@react-three/drei'
import React from 'react'
import { Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';


export default function Experience() {

    const { animation } = useControls({
        animation: {
          options: ['idleBreathing', 'enumerating', 'showingFact', 'showingEvidence'],
          value: 'idleBreathing',
        },
      });

    const texture = useTexture("sad-background-texture.jpg");
    const viewport = useThree((state) => state.viewport)
  return (
    <>
        <OrbitControls 
            // Vertical : de 0° (en bas) à 45° (en haut)
            minPolarAngle={Math.PI / 2 - (Math.PI / 8)}
            maxPolarAngle={Math.PI / 2}
            enableZoom={false}
            // // Horizontal : de -45° (gauche) à +45° (droite)
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={ Math.PI / 3.5}
        /> 
        <Sky />
        <Environment preset="sunset" />
        <ambientLight />
        <Suspense fallback={<LoadingFallback />}>
          {/* <Girl20To30Avatar animation={animation}/> */}
        </Suspense>
        {/* <mesh position={[0,0,-1.5]}>
          <planeGeometry args={[viewport.width, viewport.height]} />
          <meshBasicMaterial map={texture} />
        </mesh> */}
        <group  position={[0, -0.99, 0]}>
          <ContactShadows 
            opacity={0.4}
            scale={10}
            blur={1}
            far={10}
            resolution={256}
            color="#020202" 
            />
          <mesh scale={5} rotation-x={-Math.PI / 2} position-y={-0.002}>
            <planeGeometry />
            <meshStandardMaterial color="#999999" />
          </mesh>
        </group>
    </>
  )}



function LoadingFallback() {
  const groupRef = useRef()
  const textRef = useRef()
  
  // Animation pour le texte "Loading..."
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Légère rotation du groupe
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1
    }
    
    if (textRef.current) {
      // Animation de scale pour le texte
      const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.05
      textRef.current.scale.set(scale, scale, scale)
      
      // Animation de couleur pour le texte
      const hue = (clock.getElapsedTime() * 10) % 360
      textRef.current.material.color.setHSL(hue / 360, 0.5, 0.7)
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Texte de chargement avec animation */}
      <Text
        ref={textRef}
        position={[0, 0, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        CHARGEMENT...
      </Text>
    </group>
  )
}
