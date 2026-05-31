export const getFitData = () => {
    return {
        cargaTotal: 28400,
        pesoCorporal: 125,
        altura: 2.10,
        virilizacao: 0.85,
        proteinaAnimal: 'Alta Densidade',
        fitoestrogenos: 'Nvel Crtico (Baixo)'
    };
};

export const updateCarga = (currentCarga: number, increment: number) => {
    return currentCarga + increment;
};
