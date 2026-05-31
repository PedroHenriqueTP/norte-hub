'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import MagneticButton from '@/components/ui/MagneticButton';

// Simple fragment shader for a flowing liquid/noise effect
const fragmentShader = `
uniform float uTime;
uniform vec2 uMouse;
varying vec2 vUv;

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
    float time = uTime * 0.2;
    vec2 uv = vUv;
    
    // Distort UV with interactions
    float dist = distance(uv, uMouse);
    float mouseEffect = smoothstep(0.5, 0.0, dist) * 0.1;

    // Create noise layers
    float noise1 = snoise(uv * 3.0 + time);
    float noise2 = snoise(uv * 10.0 - time * 0.5 + noise1);
    
    // Mix colors based on noise
    vec3 color1 = vec3(0.02, 0.02, 0.02); // Deep black
    vec3 color2 = vec3(0.1, 0.1, 0.12);   // Dark grey/blue
    
    // Add "liquid metal" shine
    float shine = smoothstep(0.4, 0.42, noise2 + mouseEffect);
    vec3 finalColor = mix(color1, color2, noise2);
    finalColor += vec3(shine * 0.2); // Add subtle shine

    gl_FragColor = vec4(finalColor, 1.0);
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FluidBackground = () => {
    const mesh = useRef<THREE.Mesh>(null);
    const mouse = useRef(new THREE.Vector2(0.5, 0.5));

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        }),
        []
    );

    useFrame((state) => {
        const { clock, pointer } = state;
        if (mesh.current) {
            (mesh.current.material as THREE.ShaderMaterial).uniforms.uTime.value = clock.getElapsedTime();
            // Smoothly interpolate mouse position for fluid feel
            mouse.current.lerp(new THREE.Vector2((pointer.x + 1) / 2, (pointer.y + 1) / 2), 0.1);
            (mesh.current.material as THREE.ShaderMaterial).uniforms.uMouse.value = mouse.current;
        }
    });

    return (
        <mesh ref={mesh} scale={[10, 10, 1]}> {/* Scale to cover screen */}
            <planeGeometry args={[2, 2, 32, 32]} />
            <shaderMaterial
                fragmentShader={fragmentShader}
                vertexShader={vertexShader}
                uniforms={uniforms}
            />
        </mesh>
    );
};

export default function Hero() {
    return (
        <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
            {/* R3F Background */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 1] }}>
                    <FluidBackground />
                </Canvas>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center mix-blend-difference">
                <h1 className="text-[12vw] leading-none font-black tracking-tighter text-white">
                    WE SHAPE <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                        CULTURE
                    </span>
                </h1>
                <div className="mt-8 flex justify-center gap-6">
                    <MagneticButton>Selected Works</MagneticButton>
                    <MagneticButton>Get In Touch</MagneticButton>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-pulse text-xs uppercase tracking-widest text-white/50">
                Scroll to explore
            </div>
        </section>
    );
}
