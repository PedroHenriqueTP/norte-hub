export const getShapeCoords = (shape: string, index: number, total: number) => {
    const ratio = index / total;
    if (shape === 'CRISTO') {
        // Tronco e Braços em T
        if (ratio < 0.6) return { x: 0, y: ratio * 20 }; // Corpo
        return { x: (ratio - 0.8) * 40, y: 12 }; // Braços
    }
    if (shape === 'PAO_DE_ACUCAR') {
        // Parábolas duplas
        return { x: ratio * 30, y: Math.sin(ratio * Math.PI) * 15 };
    }
    return { x: Math.random() * 20, y: Math.random() * 20 };
};
