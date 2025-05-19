import React, { useRef } from 'react'
import { useAnimations, useFBX, useGLTF } from '@react-three/drei'
import { useEffect, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';

import { FileLoader, Vector3 } from 'three';
import { useMemo } from 'react';


const facialExpressions = {
  default: {},
  smile: {
    browInnerUp: 0.17,
    eyeSquintLeft: 0.4,
    eyeSquintRight: 0.44,
    noseSneerLeft: 0.1700000727403593,
    noseSneerRight: 0.14000002836874015,
    mouthPressLeft: 0.61,
    mouthPressRight: 0.41000000000000003,
  },
  funnyFace: {
    jawLeft: 0.63,
    mouthPucker: 0.53,
    noseSneerLeft: 1,
    noseSneerRight: 0.39,
    mouthLeft: 1,
    eyeLookUpLeft: 1,
    eyeLookUpRight: 1,
    cheekPuff: 0.9999924982764238,
    mouthDimpleLeft: 0.414743888682652,
    mouthRollLower: 0.32,
    mouthSmileLeft: 0.35499733688813034,
    mouthSmileRight: 0.35499733688813034,
  },
  sad: {
    mouthFrownLeft: 1,
    mouthFrownRight: 1,
    mouthShrugLower: 0.78341,
    browInnerUp: 0.452,
    eyeSquintLeft: 0.72,
    eyeSquintRight: 0.75,
    eyeLookDownLeft: 0.5,
    eyeLookDownRight: 0.5,
    jawForward: 1,
  },
  surprised: {
    eyeWideLeft: 0.5,
    eyeWideRight: 0.5,
    jawOpen: 0.351,
    mouthFunnel: 1,
    browInnerUp: 1,
  },
  angry: {
    browDownLeft: 1,
    browDownRight: 1,
    eyeSquintLeft: 1,
    eyeSquintRight: 1,
    jawForward: 1,
    jawLeft: 1,
    mouthShrugLower: 1,
    noseSneerLeft: 1,
    noseSneerRight: 0.42,
    eyeLookDownLeft: 0.16,
    eyeLookDownRight: 0.16,
    cheekSquintLeft: 1,
    cheekSquintRight: 1,
    mouthClose: 0.23,
    mouthFunnel: 0.63,
    mouthDimpleRight: 1,
  },
  crazy: {
    browInnerUp: 0.9,
    jawForward: 1,
    noseSneerLeft: 0.5700000000000001,
    noseSneerRight: 0.51,
    eyeLookDownLeft: 0.39435766259644545,
    eyeLookUpRight: 0.4039761421719682,
    eyeLookInLeft: 0.9618479575523053,
    eyeLookInRight: 0.9618479575523053,
    jawOpen: 0.9618479575523053,
    mouthDimpleLeft: 0.9618479575523053,
    mouthDimpleRight: 0.9618479575523053,
    mouthStretchLeft: 0.27893590769016857,
    mouthStretchRight: 0.2885543872656917,
    mouthSmileLeft: 0.5578718153803371,
    mouthSmileRight: 0.38473918302092225,
    tongueOut: 0.9618479575523053,
  },
};

const corresponding_EN = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E:"viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP"
}

const womenAnimation = [
  "angry",
  "angry-goodbye",
  "crying",
  "idle",
  "thankful",
  "sad",
  "rejected",
  "happy",
  "enumerating",
]
export function GirlAvatar(props) {

  const groupRef = useRef()

  // 1. Load model and animation GLTFs
  const { nodes, materials } = useGLTF('/woman-20to30-model.glb')
  const { animations: womenAnimation } = useGLTF('/woman-animation.glb')

  // 2. Setup animations
  const { actions, mixer } = useAnimations(womenAnimation, groupRef)

  // 3. State for current action
  const defaultAnim = womenAnimation.find(a => a.name === 'angry')?.name || womenAnimation[0].name
  // const [animation, setAnimation] = useState(defaultAnim)

  // // 4. Facial expression controls
  // const [facialExpression, setFacialExpression] = useState('')
 

  // 5. Audio and lipsync setup

  // const audio = useMemo(() => new Audio(`${script}.mp3`), [script])
  // const jsonFile = useLoader(FileLoader, `${script}.json`)
  // const lipsync = JSON.parse(jsonFile)

  // useEffect(() => {
  //   const action = actions['idle']
  //   if (!action) return
  //   if (playAudio) {
  //     audio.play()
  //     action.reset().fadeIn(0.5).play()
  //   } else {
  //     audio.pause()
  //     action.fadeOut(0.5)
  //   }
  // }, [playAudio, script, actions, audio])

  // // 6. Play current animation on change
  // useEffect(() => {
  //   if (!actions[animation]) return
  //   actions[animation]
  //     .reset()
  //     .fadeIn(0.5)
  //     .play()

  //   return () => {
  //     actions[animation]?.fadeOut(0.5)
  //   }
  // }, [animation, actions])

  // 7. Head and cursor follow controls
  useFrame((state) => {
    // Lipsync morph targets
    // const t = audio.currentTime
    // Object.values(corresponding_EN).forEach(val => {
    //   const idxHead = nodes.Wolf3D_Head.morphTargetDictionary[val]
    //   const idxTeeth = nodes.Wolf3D_Teeth.morphTargetDictionary[val]
    //   nodes.Wolf3D_Head.morphTargetInfluences[idxHead] = 0
    //   nodes.Wolf3D_Teeth.morphTargetInfluences[idxTeeth] = 0
    // })
    // for (let cue of lipsync.mouthCues) {
    //   if (t >= cue.start && t <= cue.end) {
    //     const val = corresponding_EN[cue.value]
    //     const iHead = nodes.Wolf3D_Head.morphTargetDictionary[val]
    //     const iTeeth = nodes.Wolf3D_Teeth.morphTargetDictionary[val]
    //     nodes.Wolf3D_Head.morphTargetInfluences[iHead] = 1
    //     nodes.Wolf3D_Teeth.morphTargetInfluences[iTeeth] = 1
    //     break
    //   }
    // }

  })


  return (
    <group {...props} ref={groupRef} dispose={null} position={[0, -1, 0]}>
      <group >
        <primitive object={nodes.Hips} />
        <skinnedMesh
          name="EyeLeft"
          geometry={nodes.EyeLeft.geometry}
          material={materials.Wolf3D_Eye}
          skeleton={nodes.EyeLeft.skeleton}
          morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
          morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
        />
        <skinnedMesh
          name="EyeRight"
          geometry={nodes.EyeRight.geometry}
          material={materials.Wolf3D_Eye}
          skeleton={nodes.EyeRight.skeleton}
          morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
          morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
        />
        <skinnedMesh
          name="Wolf3D_Head"
          geometry={nodes.Wolf3D_Head.geometry}
          material={materials.Wolf3D_Skin}
          skeleton={nodes.Wolf3D_Head.skeleton}
          morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
          morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
        />
        <skinnedMesh
          name="Wolf3D_Teeth"
          geometry={nodes.Wolf3D_Teeth.geometry}
          material={materials.Wolf3D_Teeth}
          skeleton={nodes.Wolf3D_Teeth.skeleton}
          morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
          morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Hair.geometry}
          material={materials.Wolf3D_Hair}
          skeleton={nodes.Wolf3D_Hair.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Outfit_Top.geometry}
          material={materials.Wolf3D_Outfit_Top}
          skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
          material={materials.Wolf3D_Outfit_Bottom}
          skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
          material={materials.Wolf3D_Outfit_Footwear}
          skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Body.geometry}
          skeleton={nodes.Wolf3D_Body.skeleton}
        >
          <meshStandardMaterial {...materials.Wolf3D_Body} color={"#ffffff"} />
        </skinnedMesh>
        </group>
    </group>
  )
}

useGLTF.preload('/woman-20to30-model.glb')
