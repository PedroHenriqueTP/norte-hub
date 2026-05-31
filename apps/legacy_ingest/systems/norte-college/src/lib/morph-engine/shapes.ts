export const getNeuralShape = (shape: 'CHRIST' | 'BRAIN' | 'MOUNTAIN', index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2;
    if (shape === 'CHRIST') {
        // Lógica de coordenadas para formar o Cristo Redentor
        const isArm = index > total * 0.4 && index < total * 0.6;
        return { x: isArm ? (index % 20) - 10 : 0, y: (index / total) * 20 };
    }
    if (shape === 'BRAIN') {
        return { x: Math.cos(angle) * Math.sin(index), y: Math.sin(angle) * Math.cos(index) };
    }
    return { x: Math.random() * 10, y: Math.random() * 10 };
};
