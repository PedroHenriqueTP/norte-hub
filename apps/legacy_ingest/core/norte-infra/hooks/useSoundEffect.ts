import useSound from 'use-sound';

export const useNeuralTransitionSound = () => {
  const [play] = useSound('/assets/sounds/orchestral/transition_swell.mp3', { volume: 0.5 });
  return { play };
};
