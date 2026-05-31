import { create } from 'zustand';
import { MentorTip } from '../lib/agents/mentorship_engine';

interface ChatStore {
  isOpen: boolean;
  activeTip: MentorTip | null;
  toggleChat: () => void;
  setIsOpen: (isOpen: boolean) => void;
  triggerTip: (tip: MentorTip) => void;
  clearTip: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  isOpen: false,
  activeTip: null,
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  setIsOpen: (isOpen) => set({ isOpen }),
  triggerTip: (tip) => set({ activeTip: tip, isOpen: false }), // Not opening automatically, just setting the badge
  clearTip: () => set({ activeTip: null }),
}));
