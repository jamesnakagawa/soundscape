import * as React from "react"
import { ThreeMesh } from '../lib/three-mesh'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const ThreeScene = () => {
  const scene = new THREE.Scene();
  let cycleColor  = false;  // cycle colors 
  let commonHue   = 0.038;  // initial color 
  let commonColor = new THREE.Color();
  commonColor.setHSL( commonHue, .8, .5 );

  const screenRatio = window.innerWidth / window.innerHeight
  const camera = new THREE.PerspectiveCamera( 60, screenRatio, 0.1, 20000 );
  camera.position.set( 0, 0, 300 );
  camera.rotation.set( 0, 0, 0 );
  camera.lookAt( scene.position );

  return (
    <Canvas camera={camera} dpr={[1, 2]}>
      <ambientLight />
      <pointLight args={[0xffffff, 4, 1000]} position={[0, 200, -500]} castShadow={false} color={commonColor}/>
      <ThreeMesh scene={scene}/>
    </Canvas>
  )
}
