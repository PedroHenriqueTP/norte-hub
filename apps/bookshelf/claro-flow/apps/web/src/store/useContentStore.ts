import { create } from 'zustand';

export type EventItem = {
  id: string;
  time: string;
  title: string;
  location: string;
  isLive: boolean;
};

interface ContentState {
  globalNotification: string;
  isNotificationActive: boolean;
  agenda: EventItem[];
  setGlobalNotification: (message: string, isActive: boolean) => void;
  setAgendaLive: (id: string) => void;
}

export const useContentStore = create<ContentState>((set) => ({
  globalNotification: 'Fique por dentro! Ative as notificações e não perca nada do evento.',
  isNotificationActive: true,
  agenda: [
    { id: '1', time: '10:30', title: 'Abertura Oficial', location: 'Palco Principal', isLive: true },
    { id: '2', time: '11:30', title: 'Inovação que conecta', location: 'Arena 5G', isLive: false },
    { id: '3', time: '13:00', title: 'Transformação Digital', location: 'Palco Principal', isLive: false },
  ],
  setGlobalNotification: (message, isActive) => set({ globalNotification: message, isNotificationActive: isActive }),
  setAgendaLive: (id) => set((state) => ({
    agenda: state.agenda.map((event) => ({
      ...event,
      isLive: event.id === id, // Only one can be live at a time in this simple mock
    }))
  })),
}));
