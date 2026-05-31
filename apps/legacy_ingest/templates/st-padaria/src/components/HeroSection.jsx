import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Environment, ContactShadows, SpotLight } from '@react-three/drei';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { THEME } from '../constants';

// --- 3D Components ---

/**
 * Placeholder for the main floating 3D element.
 * REPLACE this with a real .glb model in production.
 * Example usage after replacing: <primitive object={scene} ... />
 */
const DonutPlaceholder = (props) => {
    return (
        <Float
            speed={2}
            rotationIntensity={1.5}
            floatIntensity={2}
            floatingRange={[-0.1, 0.1]}
            {...props}
        >
            {/* // TODO: SUBSTITUIR POR SEU MODELO .GLB AQUI - Ex: donut.glb */}
            <mesh castShadow receiveShadow>
                <torusKnotGeometry args={[1, 0.35, 100, 32]} />
                <meshStandardMaterial
                    color="#d4a373" // Dough color
                    roughness={0.3}
                    metalness={0.1}
                />
            </mesh>
        </Float>
    )
}

/**
 * Secondary floating element stub (e.g., a Macaron or Coffee Bean).
 */
const SpherePlaceholder = (props) => {
    return (
        <Float
            speed={3}
            rotationIntensity={1}
            floatIntensity={1.5}
            floatingRange={[-0.2, 0.2]}
            {...props}
        >
            {/* // TODO: SUBSTITUIR POR SEU MODELO .GLB AQUI */}
            <mesh castShadow receiveShadow>
                <sphereGeometry args={[0.6, 32, 32]} />
                <meshStandardMaterial
                    color="#6f4e37" // Coffee color
                    roughness={0.4}
                />
            </mesh>
        </Float>
    )
}

/**
 * The main 3D Scene setup.
 * Handles lighting, environment, and object placement.
 */
const Scene3D = () => {
    return (
        <>
            {/* Warm Ambient Light */}
            <ambientLight intensity={0.6} color="#ffeebb" />

            {/* Gold Spotlight for that premium feel */}
            <SpotLight
                position={[10, 15, 10]}
                angle={0.3}
                penumbra={0.5}
                intensity={2.5}
                castShadow
                shadow-mapSize={1024}
            />

            {/* Subtle Environment reflections */}
            <Environment preset="sunset" blur={1} />

            {/* Floating Elements with 'Parallax' feel via Float component */}
            {/* Main Element (Right side) */}
            <DonutPlaceholder position={[3.5, 0, 0]} rotation={[0.4, 0.2, 0]} />

            {/* Floating Coffee Bean/Sweet (Left Background) */}
            <SpherePlaceholder position={[-4, 2, -3]} />

            {/* Floating Small Element (Right Foreground) */}
            <SpherePlaceholder position={[5, -2, 1.5]} scale={0.4} />

            {/* Ground shadows to anchor the floating objects partially */}
            <ContactShadows
                position={[0, -4, 0]}
                opacity={0.5}
                scale={20}
                blur={2.5}
                far={5}
                color="#3d2819"
            />
        </>
    );
};

// --- Main Component ---

const HeroSection = () => {
    return (
        <section className="relative w-full h-screen overflow-hidden flex items-center bg-bakery-50">

            {/* 1. Background Layer (2D) */}
            <div className="absolute inset-0 z-0">
                <img
                    src={THEME.images.heroBackground}
                    alt="Bakery Ambiance"
                    className="w-full h-full object-cover"
                />
                {/* Gradient Overlay for text readability and cozy vibe */}
                <div className="absolute inset-0 bg-gradient-to-r from-bakery-950/90 via-bakery-900/40 to-bakery-500/10 mix-blend-multiply" />
                <div className="absolute inset-0 bg-black/20" /> {/* Extra dim */}
            </div>

            {/* 2. Middle Layer (3D Canvas) */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {/* Canvas covers entire screen but clicks pass through unless on object (if interactive) */}
                <Canvas
                    shadows
                    camera={{ position: [0, 0, 9], fov: 40 }}
                    gl={{ antialias: true, alpha: true }}
                >
                    <Suspense fallback={null}>
                        {/* Mouse parallax could be added with specialized Controls, strictly keeping to Float for now as requested */}
                        <Scene3D />
                    </Suspense>
                </Canvas>
            </div>

            {/* 3. Front Layer (Content 2D) */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center h-full">
                <div className="max-w-2xl text-white">

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >
                        <span className="inline-block text-bakery-300 font-sans font-bold tracking-[0.2em] text-sm uppercase mb-4 border-b border-bakery-500 pb-1">
                            Premium Bakery
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 leading-[1.1] text-bakery-50 drop-shadow-lg">
                            {THEME.text.heroTitle}
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    >
                        <p className="text-lg md:text-xl font-sans text-bakery-100 max-w-lg mb-10 leading-relaxed font-light drop-shadow-md">
                            {THEME.text.heroSubtitle}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    >
                        <button className="group relative px-8 py-4 bg-bakery-500 text-white font-sans font-bold rounded-full text-lg shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                            <span className="relative z-10">{THEME.text.heroCta}</span>
                            <div className="absolute inset-0 bg-bakery-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out" />
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 text-bakery-200"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
                <div className="flex flex-col items-center gap-2 opacity-80">
                    <span className="text-xs uppercase tracking-widest font-sans">Scroll</span>
                    <ChevronDown size={32} />
                </div>
            </motion.div>

        </section>
    );
};

export default HeroSection;
