'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './InteractiveBackground.module.css';

export default function InteractiveBackground() {
    const [blocks, setBlocks] = useState([]);
    const containerRef = useRef(null);

    useEffect(() => {
        // Determine grid size based on window size
        const calculateGrid = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const blockSize = 50; // px
            const cols = Math.ceil(w / blockSize);
            const rows = Math.ceil(h / blockSize);
            setBlocks(Array.from({ length: cols * rows }));
        };

        calculateGrid();
        window.addEventListener('resize', calculateGrid);
        return () => window.removeEventListener('resize', calculateGrid);
    }, []);

    const handleMouseMove = (e) => {
        // Optional: Add logic here if we want JS-controlled lighting,
        // but CSS :hover is more performant for simple toggles.
        // For more complex trails, we'd use JS. Let's stick to CSS hover for the "interactive bricks" feel first.
    };

    return (
        <div className={styles.gridContainer} ref={containerRef}>
            {blocks.map((_, i) => (
                <div key={i} className={styles.block} />
            ))}
        </div>
    );
}
