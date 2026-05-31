'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLeadStore } from './useLeadStore'

const DEMO_LEAD = {
  nome: 'Visitante Demo',
  email: 'demo@claro.com.br',
  telefone: '11999990000',
  cpf: '00000000000',
  evento: 'GP_F1_INTERLAGOS' as const,
  interesses: ['5G_VELOCIDADE', 'ROAMING_INTERNACIONAL'],
  leadId: 'DEMO_LEAD_001',
  codigoBrinde: 'DEMO01',
  gameScore: 0,
  statusBrinde: 'DISPONIVEL' as const,
}

/**
 * useDemoMode
 *
 * Detects `?demo=true` in the URL and seeds the lead store with
 * synthetic data so every screen can be previewed without registration.
 *
 * Returns `isDemo` so consumers can show a visual indicator.
 */
export function useDemoMode() {
  const searchParams = useSearchParams()
  const store = useLeadStore()
  const seeded = useRef(false)

  const isDemo = searchParams.get('demo') === 'true'

  useEffect(() => {
    if (isDemo && !seeded.current) {
      store.updateLeadInfo(DEMO_LEAD)
      seeded.current = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemo])

  return { isDemo }
}
