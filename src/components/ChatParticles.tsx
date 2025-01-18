import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleProps {
  type: 'snow' | 'cloud';
}

const ChatParticles = ({ type }: ParticleProps) => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = type === 'snow' ? 200 : 50;

  // Create particles with different initial positions based on type
  const positions = new Float32Array(particleCount * 3);
  const speeds = new Float32Array(particleCount);
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    if (type === 'snow') {
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = Math.random() * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 3;
      speeds[i] = 0.2 + Math.random() * 0.3;
    } else {
      positions[i3] = (Math.random() - 0.5) * 15;
      positions[i3 + 1] = Math.random() * 5;
      positions[i3 + 2] = (Math.random() - 0.5) * 5;
      speeds[i] = 0.05 + Math.random() * 0.1;
    }
  }

  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        if (type === 'snow') {
          positions[i3 + 1] -= speeds[i];
          positions[i3] += Math.sin(Date.now() * 0.001 + i) * 0.01;
          
          if (positions[i3 + 1] < -5) {
            positions[i3 + 1] = 5;
          }
        } else {
          positions[i3] -= speeds[i];
          if (positions[i3] < -7.5) {
            positions[i3] = 7.5;
          }
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={type === 'snow' ? 0.02 : 0.2}
        color={type === 'snow' ? '#ffffff' : '#e2e8f0'}
        transparent
        opacity={type === 'snow' ? 0.8 : 0.3}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

export default ChatParticles;