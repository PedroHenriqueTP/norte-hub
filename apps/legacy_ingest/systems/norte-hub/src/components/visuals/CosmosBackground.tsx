"use client";
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Text, Points, PointMaterial } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';

const ParticleField = ({ speed }: { speed: number }) => {
  const ref = useRef<any>();
  useFrame((state, delta) => {
    ref.current.rotation.z += delta * speed;
    ref.current.position.z += speed * 0.5;
  });

  return (
    <Points ref={ref} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#00F2FF" size={0.005} sizeAttenuation depthWrite={false} />
    </Points>
  );
};

export const CosmosPortal = () => {
  const [isDiving, setIsDiving] = useState(false);
  const router = useRouter();

  const handleDive = () => {
    setIsDiving(true);
    new Audio('https://www.soundjay.com/buttons/sounds/button-10.mp3').play().catch(() => {});
    setTimeout(() => {
      router.push('/dashboard'); // Coordenada para o Hub de Serviços
    }, 1500);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', cursor: isDiving ? 'wait' : 'default' }}>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <color attach="background" args={['#000']} />
        <Stars radius={100} depth={50} count={isDiving ? 10000 : 5000} factor={isDiving ? 10 : 4} fade speed={isDiving ? 10 : 1} />
        
        {!isDiving && (
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Text fontSize={0.08} color="#00F2FF" anchorX="center" anchorY="middle">
              NORTE SYSTEMS
            </Text>
          </Float>
        )}
        
        <ParticleField speed={isDiving ? 2 : 0.05} />
      </Canvas>
      
      <div style={{ 
        position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', 
        opacity: isDiving ? 0 : 1, transition: 'opacity 1s ease' 
      }}>
        <button 
          onClick={handleDive}
          style={{ 
            background: 'transparent', border: '1px solid #00F2FF', color: '#00F2FF', 
            padding: '15px 40px', borderRadius: '40px', cursor: 'pointer', 
            fontFamily: 'monospace', letterSpacing: '4px', backdropFilter: 'blur(10px)',
            boxShadow: '0 0 20px rgba(0, 242, 255, 0.2)'
          }}
        >
          INICIAR IMERSÃO
        </button>
      </div>
    </div>
  );
};
