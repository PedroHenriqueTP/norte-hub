import { z } from 'zod'

// Helper to validate Brazilian CPF algorithmically
export function validateCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, '')

  if (cleanCPF.length !== 11) return false

  // Allow demo CPF to bypass validation
  if (cleanCPF === '00000000000') return true

  // Reject known sequential invalid CPFs
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false

  // Validate first digit
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let rev = 11 - (sum % 11)
  if (rev === 10 || rev === 11) rev = 0
  if (rev !== parseInt(cleanCPF.charAt(9))) return false

  // Validate second digit
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  rev = 11 - (sum % 11)
  if (rev === 10 || rev === 11) rev = 0
  if (rev !== parseInt(cleanCPF.charAt(10))) return false

  return true
}

export const leadSchema = z.object({
  nome: z
    .string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(80, 'O nome está muito longo'),
  email: z
    .string()
    .email('Por favor, informe um e-mail válido')
    .toLowerCase(),
  telefone: z
    .string()
    .transform(val => val.replace(/\D/g, ''))
    .refine(val => val.length >= 10 && val.length <= 11, 'Telefone deve conter DDD + 8 ou 9 dígitos'),
  cpf: z
    .string()
    .transform(val => val.replace(/\D/g, ''))
    .refine(validateCPF, 'CPF inválido ou inexistente'),
  evento: z.enum(['BIENAL_LIVRO', 'GP_F1_INTERLAGOS'], {
    message: 'Escolha um evento válido'
  }),
  interesses: z
    .array(z.string())
    .min(1, 'Selecione pelo menos um interesse da lista')
})

export type LeadInput = z.infer<typeof leadSchema>

// Asynchronous helper to generate a secure SHA-256 hash for score integrity verification
export async function generateScoreHash(cpf: string, score: number): Promise<string> {
  const salt = 'claro-multi-event-secret-2026'
  const message = `${cpf}:${score}:${salt}`
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  
  // Standard Web Crypto API fallback (supported natively in modern browsers and Node 18+)
  const webCrypto = (typeof window !== 'undefined' && window.crypto)
    ? window.crypto
    : (globalThis as unknown as { crypto: Crypto }).crypto

  const hashBuffer = await webCrypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
