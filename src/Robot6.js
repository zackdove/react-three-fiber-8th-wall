import React, { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useTexture} from '@react-three/drei'

export default function Model(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/robot6.glb')
  const { actions } = useAnimations(animations, group)
  // 
  useEffect(() => {  
    actions.idle.play();   
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={nodes.mixamorigHips} />
      <skinnedMesh castShadow
        geometry={nodes.Beta_Joints.geometry}
        material={materials.lambert2}
        skeleton={nodes.Beta_Joints.skeleton}
      />
      <skinnedMesh castShadow
        geometry={nodes.Beta_Surface.geometry}
        material={materials['Material.004']}
        skeleton={nodes.Beta_Surface.skeleton}
      />
    </group>
  )
}

useGLTF.preload('/robot6.glb')
