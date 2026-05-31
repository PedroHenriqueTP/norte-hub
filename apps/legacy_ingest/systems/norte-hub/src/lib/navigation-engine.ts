export const navigateToHub = (target: string) => {
    const audio = new Audio('/assets/sounds/orchestral/transition_swell.mp3');
    audio.play();
    
    // Dispara a transição Galaxy Jump
    document.dispatchEvent(new CustomEvent('galaxy-jump', { detail: { target } }));
    
    setTimeout(() => {
        window.location.href = /sub-hubs/ + target;
    }, 1800);
};
