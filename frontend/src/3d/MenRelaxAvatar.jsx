
import React, { useEffect, useRef } from 'react'
import { useAnimations, useGLTF } from '@react-three/drei'

export function MenRelaxAvatar(props) {
  const { nodes, materials } = useGLTF('/men-relax.glb');
  const { animationFile } = props;

  console.log(animationFile);
  const group = useRef();
  const { animations } = useGLTF('/man-animation.glb')
      // Setup animation actions
      const { actions } = useAnimations(animations, group)
    
      useEffect(() => {
        // Ensure the idle animation exists before playing
        const idleAction = actions['idle']
        if (idleAction) {
          idleAction.reset()
          idleAction.play()
        }
      }, [actions])

  return (
    <group {...props} ref={group} dispose={null} position-y={-1}>
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials['Wolf3D_Eye.001']}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials['Wolf3D_Eye.001']}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials['Wolf3D_Body.001']}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials['Wolf3D_Hair.001']}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials['Wolf3D_Skin.001']}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials['Wolf3D_Outfit_Bottom.001']}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials['Wolf3D_Outfit_Footwear.001']}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials['Wolf3D_Outfit_Top.001']}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials['Wolf3D_Teeth.001']}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
      <primitive object={nodes.Hips} />
    </group>
  )
}

useGLTF.preload('/men-relax.glb')

