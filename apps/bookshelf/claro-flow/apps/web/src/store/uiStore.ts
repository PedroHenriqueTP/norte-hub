import { create } from 'zustand';
import React from 'react';

interface UiStore {
  overlayContent: React.ReactNode | null;
  openOverlay: (content: React.ReactNode) => void;
  closeOverlay: () => void;
}

export const useUiStore = create<UiStore>((set) => ({
  overlayContent: null,
  openOverlay: (content) => set({ overlayContent: content }),
  closeOverlay: () => set({ overlayContent: null }),
}));
