// Sistema de Ativação Total de Botões
export const initializeAllButtons = () => {
    const buttons = document.querySelectorAll('button, .nav-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget.getAttribute('data-target');
            console.log('Norte Engine: Executando missão para ' + target);
            // Gatilho de Transição Galáctica
            window.dispatchEvent(new CustomEvent('galaxy-jump', { detail: { target } }));
        });
    });
};
