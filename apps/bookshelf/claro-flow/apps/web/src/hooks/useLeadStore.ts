import { create } from 'zustand'

export interface LeadState {
  currentStep: number
  qrCodeToken: string | null
  name: string
  email: string
  eventId: string | null
  totalPoints: number
  
  setStep: (step: number) => void
  updateLeadInfo: (info: Partial<Omit<LeadState, 'setStep' | 'updateLeadInfo' | 'reset'>>) => void
  reset: () => void
}

const initialState = {
  currentStep: 1,
  qrCodeToken: null,
  name: '',
  email: '',
  eventId: null,
  totalPoints: 0,
}

export const useLeadStore = create<LeadState>((set) => ({
  ...initialState,
  
  setStep: (step) => set({ currentStep: step }),
  
  updateLeadInfo: (info) => set((state) => ({ ...state, ...info })),
  
  reset: () => set(initialState),
}))
