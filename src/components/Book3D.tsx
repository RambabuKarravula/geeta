import { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { TextureLoader } from 'three';
import { useBookStore } from '../store/bookStore';
import * as THREE from 'three';

const Book3D = () => {
  const meshRef = useRef<THREE.Group>(null);
  const { isBookOpen } = useBookStore();
  
  // Load the book cover texture
  const texture = useLoader(TextureLoader, 'https://eshop.chinmayamission.com/s/5d76112ff04e0a38c1aea158/6486ec82d3fd47502c340a5d/the-holy-geeta-video-pd-front-cover-1--640x640.png');

  // Create page geometry
  const pageGeometry = new THREE.PlaneGeometry(2.8, 3.8);
  const pages = Array.from({ length: 5 }, (_, i) => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, i * 0.01, 0],
  }));

  const { rotation, position, scale } = useSpring({
    rotation: isBookOpen ? [0, Math.PI, 0] : [0, 0, 0],
    position: isBookOpen ? [0, -0.5, 0] : [0, 0, 0],
    scale: isBookOpen ? [1.2, 1.2, 1.2] : [1, 1, 1],
    config: {
      mass: 2,
      tension: 170,
      friction: 30,
      clamp: true,
    },
  });

  // Page animations
  const pageAnimations = pages.map((_, i) => 
    useSpring({
      rotation: isBookOpen 
        ? [0, Math.PI * (i + 1) / pages.length, 0]
        : [0, 0, 0],
      config: {
        mass: 1,
        tension: 170,
        friction: 26,
        clamp: true,
        delay: i * 100,
      },
    })
  );

  useFrame((state) => {
    if (meshRef.current && !isBookOpen) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.1;
    }
  });

  return (
    <animated.group
      ref={meshRef}
      rotation={rotation as any}
      position={position as any}
      scale={scale as any}
    >
      {/* Front cover */}
      <mesh position={[0, 0, 0.15]}>
        <planeGeometry args={[3, 4]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {/* Back cover */}
      <mesh position={[0, 0, -0.15]}>
        <planeGeometry args={[3, 4]} />
        <meshStandardMaterial color="#8B4513" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Spine */}
      <mesh position={[-1.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.3, 4]} />
        <meshStandardMaterial color="#8B4513" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Pages */}
      {pages.map((_, i) => (
        <animated.mesh
          key={i}
          position={[0, 0, 0]}
          rotation={pageAnimations[i].rotation as any}
        >
          <primitive object={pageGeometry} />
          <meshStandardMaterial 
            color="#F5F5DC" 
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
          />
        </animated.mesh>
      ))}
    </animated.group>
  );
};

export default Book3D;