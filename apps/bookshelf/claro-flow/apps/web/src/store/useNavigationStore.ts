import { create } from 'zustand';

type RouteId = 'INICIO' | 'AGENDA' | 'MAPA' | 'ATIVACOES' | 'RECOMPENSAS' | 'NOTIFICACOES' | 'CONTA';

interface NavigationStore {
  activeRoute: RouteId;
  setActiveRoute: (route: RouteId) => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  activeRoute: 'INICIO',
  setActiveRoute: (route) => set({ activeRoute: route }),
}));
