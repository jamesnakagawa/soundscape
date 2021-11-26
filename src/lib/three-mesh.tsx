import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SimplexNoise } from './simplex-noise'

export function ThreeMesh(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  const groupRef = useRef()
  const geoRef = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  /**
   * Helper for adding easing effect 
   */
   const addEase = ( pos, to, ease ) => {
    pos.x += ( to.x - pos.x ) / ease;
    pos.y += ( to.y - pos.y ) / ease;
    pos.z += ( to.z - pos.z ) / ease;
  };

  /**
   * Ground object
   */
  const factor = 300; // smoothness 
  const scale = 20; // terrain size
  const speed = 0.003; // move speed 
  const ease = 12;
  let cycle = 0;
  const move = { x: 0, y: -100, z: -1000 };
  const look = { x: 30.0, y: 0, z: 0 };
  const simplex = new SimplexNoise(); 
  
  function moveNoise() {
    if (!geoRef.current) return;
    const { position } = geoRef.current.attributes;
    const {array: ar, itemSize} = geoRef.current.attributes.position;
    for (let i = 0; i < ar.length; i += itemSize) {
      const x = i, y = i + 1, z = i + 2;
      const xoff = ar[x] / factor; 
      const yoff = ar[y] / factor + cycle; 
      const rand = simplex.noise2D(xoff, yoff) * scale;
      ar[z] = rand;
    }
    position.needsUpdate = true;
    cycle += speed;
  }

  // update
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    moveNoise();
    move.x = -( mouse.x * 0.04 );
    addEase( groupRef.current.position, move, ease );
    addEase( groupRef.current.rotation, look, ease );
  })
  moveNoise();
  
  /**
   * Common options
   */
  let cycleColor  = false;  // cycle colors 
  let commonHue   = 0.038;  // initial color 
  let commonColor = new THREE.Color();
  commonColor.setHSL( commonHue, .8, .5 );
  // Subscribe this component to the render-loop
  useFrame((state, delta) => {
    // update light hue 
    if ( cycleColor ) {
      commonHue += 0.001; 
      if ( commonHue >= 1 ) commonHue = 0; 
      commonColor.setHSL( commonHue, .8, .5 );
    }
  })

  /**
   * Device screen info helper 
   */
  const deviceInfo = {
    screenRatio() {
      return window.innerWidth / window.innerHeight;
    },
    screenCenterX() {
      return window.innerWidth / 2;
    },
    screenCenterY() {
      return window.innerHeight / 2;
    },
    mouseX( e ) {
      return Math.max( 0, e.pageX || e.clientX || 0 );
    },
    mouseY( e ) {
      return Math.max( 0, e.pageY || e.clientY || 0 );
    },
    mouseCenterX( e ) {
      return this.mouseX( e ) - this.screenCenterX();
    },
    mouseCenterY( e ) {
      return this.mouseY( e ) - this.screenCenterY();
    },
  }; 

  let mouse = {
    x: deviceInfo.screenCenterX(), 
    y: deviceInfo.screenCenterY(), 
  };  
  
  window.addEventListener( 'mousemove', e => {
    mouse.x = deviceInfo.mouseCenterX( e ); 
    mouse.y = deviceInfo.mouseCenterY( e ); 
  });
  
  // // on page resize
  // window.addEventListener( 'resize', e => {
  //   camera.updateProjectionMatrix();
  // });

  return (
    <group ref={groupRef} position={[ 0, -300, -1000 ]} rotation={[29.8, 0, 0]}>
      <mesh ref={ref}>
        <meshLambertMaterial
          color={0xffffff}
          opacity={1}
          blending={THREE.NoBlending}
          side={THREE.FrontSide}
          transparent={false}
          depthTest={false}
          wireframe={true}
        />
        <planeGeometry args={[4000, 2000, 128, 64]} ref={geoRef}/>
      </mesh>
    </group>
  )
}
