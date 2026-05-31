import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

// Singleton PrismaClient
const globalForPrisma = global as unknown as { prisma?: PrismaClient }
export const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Fallback JSON file path
const FALLBACK_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'gamification_fallback.json')

// Interfaces reflecting Prisma Models
export interface EventData {
  id: string
  name: string
  date: string
}

export interface UserEventData {
  id: string
  eventId: string
  name: string
  email: string
  qrCodeToken: string
  totalPoints: number
  // Relations for JSON fallback
  event?: EventData
}

export interface ActivationData {
  id: string
  eventId: string
  name: string
  pointsGiven: number
  cooldownMin: number
}

export interface PointLogData {
  id: string
  userEventId: string
  activationId: string
  pointsEarned: number
  createdAt: string
  // Relations
  activation?: ActivationData
}

export interface GiftData {
  id: string
  eventId: string
  name: string
  pointsCost: number
  stock: number
}

export interface RedemptionData {
  id: string
  userEventId: string
  giftId: string
  createdAt: string
  // Relations
  gift?: GiftData
}

interface FallbackSchema {
  events: EventData[]
  userEvents: UserEventData[]
  activations: ActivationData[]
  pointLogs: PointLogData[]
  gifts: GiftData[]
  redemptions: RedemptionData[]
}

// Ensure the directory and file exist for the local fallback database
function ensureFallbackFile() {
  const dir = path.dirname(FALLBACK_FILE_PATH)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(FALLBACK_FILE_PATH)) {
    const initialData: FallbackSchema = {
      events: [],
      userEvents: [],
      activations: [],
      pointLogs: [],
      gifts: [],
      redemptions: []
    }
    fs.writeFileSync(FALLBACK_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf-8')
  }
}

// Read from fallback JSON
export function readFallbackData(): FallbackSchema {
  try {
    ensureFallbackFile()
    const content = fs.readFileSync(FALLBACK_FILE_PATH, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error('Error reading fallback data, returning empty schema:', error)
    return {
      events: [],
      userEvents: [],
      activations: [],
      pointLogs: [],
      gifts: [],
      redemptions: []
    }
  }
}

// Write to fallback JSON
export function writeFallbackData(data: FallbackSchema) {
  try {
    ensureFallbackFile()
    fs.writeFileSync(FALLBACK_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing fallback data to file:', error)
  }
}

// Default Seed Data
const SEED_EVENTS: EventData[] = [
  { id: 'f1-interlagos', name: 'GP F1 Interlagos', date: new Date().toISOString() },
  { id: 'bienal-livro', name: 'Bienal do Livro', date: new Date().toISOString() },
  { id: 'sp-open', name: 'SP Open Tênis', date: new Date().toISOString() }
]

const SEED_ACTIVATIONS: ActivationData[] = [
  // F1 Activations
  { id: 'f1-simulador', eventId: 'f1-interlagos', name: 'Simulador F1 5G', pointsGiven: 50, cooldownMin: 5 },
  { id: 'f1-gaming', eventId: 'f1-interlagos', name: 'Arena Gaming Claro net virtua', pointsGiven: 30, cooldownMin: 5 },
  { id: 'f1-hub', eventId: 'f1-interlagos', name: 'Hub de Inovação 5G', pointsGiven: 20, cooldownMin: 5 },
  { id: 'f1-instagram', eventId: 'f1-interlagos', name: 'Concurso Insta Claro F1', pointsGiven: 50, cooldownMin: 5 },
  // Bienal Activations
  { id: 'bienal-arena', eventId: 'bienal-livro', name: 'Arena Cultural Claro tv+', pointsGiven: 40, cooldownMin: 5 },
  { id: 'bienal-skeelo', eventId: 'bienal-livro', name: 'Passaporte de Leitura Skeelo', pointsGiven: 30, cooldownMin: 5 },
  { id: 'bienal-tiktok', eventId: 'bienal-livro', name: 'Espaço TikToker Claro 5G', pointsGiven: 30, cooldownMin: 5 },
  { id: 'bienal-instagram', eventId: 'bienal-livro', name: 'Concurso Insta Claro Bienal', pointsGiven: 50, cooldownMin: 5 },
  // SP Open Activations
  { id: 'sp-simulador', eventId: 'sp-open', name: 'Simulador de Saque 5G', pointsGiven: 40, cooldownMin: 5 },
  { id: 'sp-virtual', eventId: 'sp-open', name: 'VR Tennis Challenge', pointsGiven: 30, cooldownMin: 5 },
  { id: 'sp-autografos', eventId: 'sp-open', name: 'Espaço Autógrafos Atletas', pointsGiven: 20, cooldownMin: 5 },
  { id: 'sp-instagram', eventId: 'sp-open', name: 'Concurso Insta Claro SP Open', pointsGiven: 50, cooldownMin: 5 }
]

const SEED_GIFTS: GiftData[] = [
  // F1 Gifts
  { id: 'f1-gift-bone', eventId: 'f1-interlagos', name: 'Boné Oficial Red Bull Racing Claro', pointsCost: 80, stock: 5 },
  { id: 'f1-gift-copo', eventId: 'f1-interlagos', name: 'Copo Térmico Claro F1', pointsCost: 50, stock: 20 },
  { id: 'f1-gift-squeeze', eventId: 'f1-interlagos', name: 'Squeeze Térmica Claro', pointsCost: 30, stock: 50 },
  // Bienal Gifts
  { id: 'bienal-gift-tv', eventId: 'bienal-livro', name: 'Assinatura Claro tv+ (3 meses)', pointsCost: 70, stock: 10 },
  { id: 'bienal-gift-ecobag', eventId: 'bienal-livro', name: 'Ecobag Exclusiva Claro Bienal', pointsCost: 40, stock: 30 },
  { id: 'bienal-gift-adesivo', eventId: 'bienal-livro', name: 'Adesivo Oficial Claro & Multi', pointsCost: 20, stock: 100 },
  // SP Open Gifts
  { id: 'sp-gift-bolas', eventId: 'sp-open', name: 'Tubo de Bolas de Tênis Claro', pointsCost: 70, stock: 15 },
  { id: 'sp-gift-viseira', eventId: 'sp-open', name: 'Viseira Esportiva Claro Open', pointsCost: 40, stock: 25 },
  { id: 'sp-gift-squeeze', eventId: 'sp-open', name: 'Squeeze Metálico Claro Open', pointsCost: 30, stock: 40 }
]

// Auto Seed function
async function seedIfNeeded(data: FallbackSchema): Promise<FallbackSchema> {
  const hasDbUrl = !!process.env.DATABASE_URL
  if (hasDbUrl) {
    try {
      const count = await prisma.event.count()
      if (count === 0) {
        console.info('Database is empty. Seeding initial events, activations, and gifts...')
        await prisma.event.createMany({ data: SEED_EVENTS })
        await prisma.activation.createMany({ data: SEED_ACTIVATIONS })
        await prisma.gift.createMany({ data: SEED_GIFTS })
        console.info('Database seeded successfully.')
      }
    } catch (e) {
      console.warn('Prisma seed check failed:', e)
    }
  }

  // JSON Fallback seed
  if (data.events.length === 0) {
    console.info('Fallback JSON is empty. Seeding initial data...')
    data.events = [...SEED_EVENTS]
    data.activations = [...SEED_ACTIVATIONS]
    data.gifts = [...SEED_GIFTS]
    writeFallbackData(data)
    console.info('Fallback JSON seeded successfully.')
  } else {
    // Retroactively ensure new activations are added to existing database fallback
    let modified = false
    const hasF1Insta = data.activations.some(a => a.id === 'f1-instagram')
    if (!hasF1Insta) {
      data.activations.push({ id: 'f1-instagram', eventId: 'f1-interlagos', name: 'Concurso Insta Claro F1', pointsGiven: 50, cooldownMin: 5 })
      modified = true
    }
    const hasBienalInsta = data.activations.some(a => a.id === 'bienal-instagram')
    if (!hasBienalInsta) {
      data.activations.push({ id: 'bienal-instagram', eventId: 'bienal-livro', name: 'Concurso Insta Claro Bienal', pointsGiven: 50, cooldownMin: 5 })
      modified = true
    }

    // SP Open retroactive updates
    const hasSpOpenEvent = data.events.some(e => e.id === 'sp-open')
    if (!hasSpOpenEvent) {
      data.events.push({ id: 'sp-open', name: 'SP Open Tênis', date: new Date().toISOString() })
      modified = true
    }
    const hasSpSimulador = data.activations.some(a => a.id === 'sp-simulador')
    if (!hasSpSimulador) {
      data.activations.push({ id: 'sp-simulador', eventId: 'sp-open', name: 'Simulador de Saque 5G', pointsGiven: 40, cooldownMin: 5 })
      data.activations.push({ id: 'sp-virtual', eventId: 'sp-open', name: 'VR Tennis Challenge', pointsGiven: 30, cooldownMin: 5 })
      data.activations.push({ id: 'sp-autografos', eventId: 'sp-open', name: 'Espaço Autógrafos Atletas', pointsGiven: 20, cooldownMin: 5 })
      data.activations.push({ id: 'sp-instagram', eventId: 'sp-open', name: 'Concurso Insta Claro SP Open', pointsGiven: 50, cooldownMin: 5 })
      modified = true
    }
    const hasSpGifts = data.gifts.some(g => g.eventId === 'sp-open')
    if (!hasSpGifts) {
      data.gifts.push({ id: 'sp-gift-bolas', eventId: 'sp-open', name: 'Tubo de Bolas de Tênis Claro', pointsCost: 70, stock: 15 })
      data.gifts.push({ id: 'sp-gift-viseira', eventId: 'sp-open', name: 'Viseira Esportiva Claro Open', pointsCost: 40, stock: 25 })
      data.gifts.push({ id: 'sp-gift-squeeze', eventId: 'sp-open', name: 'Squeeze Metálico Claro Open', pointsCost: 30, stock: 40 })
      modified = true
    }

    if (modified) {
      writeFallbackData(data)
      console.info('Fallback JSON activations updated with SP Open and Instagram dynamic.')
    }
  }
  return data
}

// Mutex for serializing local file database operations to prevent race conditions
let fallbackMutex = Promise.resolve()

export function acquireLock<T>(op: () => Promise<T> | T): Promise<T> {
  const current = fallbackMutex.then(() => op())
  fallbackMutex = current.then(() => {}).catch(() => {})
  return current
}

// Interface for pending redemptions (2-step check-out)
export interface PendingRedemption {
  token: string
  userEventId: string
  giftId: string
  pointsCost: number
  expiresAt: number
}

// Global list in memory (resilient to page hot reloads)
const globalForPendingRedemptions = global as unknown as { pendingRedemptions?: PendingRedemption[] }
const pendingRedemptions: PendingRedemption[] = globalForPendingRedemptions.pendingRedemptions || []
if (process.env.NODE_ENV !== 'production') {
  globalForPendingRedemptions.pendingRedemptions = pendingRedemptions
}

// Interface for Instagram submissions
export interface InstagramPost {
  id: string
  eventId: string
  username: string
  photoIdx: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  likes: number
}

// Global list in memory for Instagram posts (resilient to page hot reloads)
const globalForInstagramPosts = global as unknown as { instagramPosts?: InstagramPost[] }
const instagramPosts: InstagramPost[] = globalForInstagramPosts.instagramPosts || []
if (process.env.NODE_ENV !== 'production') {
  globalForInstagramPosts.instagramPosts = instagramPosts
}

// Database and Fallback services layer
export const dbService = {
  // 1. Get all events
  async getEvents() {
    const hasDbUrl = !!process.env.DATABASE_URL
    if (hasDbUrl) {
      try {
        return await prisma.event.findMany({
          orderBy: { date: 'asc' }
        })
      } catch (e) {
        console.warn('Prisma getEvents failed, falling back to JSON.', e)
      }
    }

    const data = await seedIfNeeded(readFallbackData())
    return data.events
  },

  // 2. Get event with activations and gifts
  async getEventWithDetails(eventId: string) {
    const hasDbUrl = !!process.env.DATABASE_URL
    if (hasDbUrl) {
      try {
        const event = await prisma.event.findUnique({
          where: { id: eventId },
          include: {
            activations: true,
            gifts: true
          }
        })
        if (event) return event
      } catch (e) {
        console.warn(`Prisma getEventWithDetails for ${eventId} failed, falling back to JSON.`, e)
      }
    }

    const data = await seedIfNeeded(readFallbackData())
    const event = data.events.find(e => e.id === eventId)
    if (!event) return null

    return {
      ...event,
      activations: data.activations.filter(a => a.eventId === eventId),
      gifts: data.gifts.filter(g => g.eventId === eventId)
    }
  },

  // 3. User check-in
  async checkInUser(eventId: string, name: string, email: string) {
    const hasDbUrl = !!process.env.DATABASE_URL
    const qrCodeToken = Math.random().toString(36).substring(2, 8).toUpperCase() // 6 char code

    if (hasDbUrl) {
      try {
        // Idempotency: find existing UserEvent
        const existing = await prisma.userEvent.findUnique({
          where: {
            eventId_email: { eventId, email }
          }
        })
        if (existing) {
          return { success: true, mode: 'database', isExisting: true, data: existing }
        }

        const newUser = await prisma.userEvent.create({
          data: {
            eventId,
            name,
            email,
            qrCodeToken,
            totalPoints: 0
          }
        })
        return { success: true, mode: 'database', isExisting: false, data: newUser }
      } catch (e) {
        console.warn('Prisma checkInUser failed, falling back to JSON.', e)
      }
    }

    // JSON Fallback
    return acquireLock(async () => {
      const data = await seedIfNeeded(readFallbackData())
      
      // Check if Event exists
      const eventExists = data.events.some(e => e.id === eventId)
      if (!eventExists) {
        throw new Error('Evento não encontrado.')
      }

      const existing = data.userEvents.find(u => u.eventId === eventId && u.email.toLowerCase() === email.toLowerCase())
      if (existing) {
        return { success: true, mode: 'fallback', isExisting: true, data: existing }
      }

      const newUser: UserEventData = {
        id: Math.random().toString(36).substring(2, 11) + '-' + Math.random().toString(36).substring(2, 11),
        eventId,
        name,
        email,
        qrCodeToken,
        totalPoints: 0
      }

      data.userEvents.push(newUser)
      writeFallbackData(data)
      return { success: true, mode: 'fallback', isExisting: false, data: newUser }
    })
  },

  // 4. Get UserEvent with details (points logs, event info)
  async getUserEventByToken(token: string) {
    const hasDbUrl = !!process.env.DATABASE_URL
    if (hasDbUrl) {
      try {
        const user = await prisma.userEvent.findUnique({
          where: { qrCodeToken: token },
          include: {
            event: true,
            history: {
              include: {
                activation: true
              },
              orderBy: { createdAt: 'desc' }
            },
            redemptions: {
              include: {
                gift: true
              },
              orderBy: { createdAt: 'desc' }
            }
          }
        })
        if (user) return user
      } catch (e) {
        console.warn(`Prisma getUserEventByToken failed, falling back to JSON.`, e)
      }
    }

    const data = await seedIfNeeded(readFallbackData())
    const user = data.userEvents.find(u => u.qrCodeToken.toUpperCase() === token.toUpperCase())
    if (!user) return null

    const event = data.events.find(e => e.id === user.eventId)
    const history = data.pointLogs
      .filter(l => l.userEventId === user.id)
      .map(log => ({
        ...log,
        activation: data.activations.find(a => a.id === log.activationId)
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const redemptions = data.redemptions
      .filter(r => r.userEventId === user.id)
      .map(red => ({
        ...red,
        gift: data.gifts.find(g => g.id === red.giftId)
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return {
      ...user,
      event,
      history,
      redemptions
    }
  },

  // 5. Scan and log activation points
  async scanActivation(qrCodeToken: string, activationId: string) {
    const hasDbUrl = !!process.env.DATABASE_URL
    const cleanToken = qrCodeToken.trim().toUpperCase()

    if (hasDbUrl) {
      try {
        return await prisma.$transaction(async (tx) => {
          // 1. Get user
          const user = await tx.userEvent.findUnique({
            where: { qrCodeToken: cleanToken }
          })
          if (!user) throw new Error('Jogador não credenciado.')

          // 2. Get activation
          const activation = await tx.activation.findUnique({
            where: { id: activationId }
          })
          if (!activation) throw new Error('Ativação não encontrada.')

          // 3. Cooldown verification
          const latestLog = await tx.pointLog.findFirst({
            where: {
              userEventId: user.id,
              activationId: activationId
            },
            orderBy: { createdAt: 'desc' }
          })

          if (latestLog) {
            const timeDiffMs = Date.now() - new Date(latestLog.createdAt).getTime()
            const cooldownMs = activation.cooldownMin * 60 * 1000
            if (timeDiffMs < cooldownMs) {
              const minutesLeft = Math.ceil((cooldownMs - timeDiffMs) / 60000)
              throw new Error(`Aguarde ${minutesLeft} min para pontuar novamente nesta ativação.`)
            }
          }

          // 4. Create log
          const log = await tx.pointLog.create({
            data: {
              userEventId: user.id,
              activationId: activationId,
              pointsEarned: activation.pointsGiven
            }
          })

          // 5. Update user points
          const updatedUser = await tx.userEvent.update({
            where: { id: user.id },
            data: {
              totalPoints: {
                increment: activation.pointsGiven
              }
            }
          })

          return { success: true, log, user: updatedUser, mode: 'database' }
        })
      } catch (e: any) {
        console.warn('Prisma scanActivation failed, falling back to JSON or throwing.', e)
        if (e.message && (e.message.includes('Jogador') || e.message.includes('Ativação') || e.message.includes('cooldown'))) {
          throw e
        }
      }
    }

    // JSON Fallback
    return acquireLock(async () => {
      const data = await seedIfNeeded(readFallbackData())

      // 1. Get user
      const userIndex = data.userEvents.findIndex(u => u.qrCodeToken.toUpperCase() === cleanToken)
      if (userIndex === -1) throw new Error('Jogador não credenciado.')
      const user = data.userEvents[userIndex]

      // 2. Get activation
      const activation = data.activations.find(a => a.id === activationId)
      if (!activation) throw new Error('Ativação não encontrada.')

      // 3. Cooldown check
      const logs = data.pointLogs
        .filter(l => l.userEventId === user.id && l.activationId === activationId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      const latestLog = logs[0]
      if (latestLog) {
        const timeDiffMs = Date.now() - new Date(latestLog.createdAt).getTime()
        const cooldownMs = activation.cooldownMin * 60 * 1000
        if (timeDiffMs < cooldownMs) {
          const minutesLeft = Math.ceil((cooldownMs - timeDiffMs) / 60000)
          throw new Error(`Aguarde ${minutesLeft} min para pontuar novamente nesta ativação.`)
        }
      }

      // 4. Add point log
      const newLog: PointLogData = {
        id: Math.random().toString(36).substring(2, 11),
        userEventId: user.id,
        activationId: activationId,
        pointsEarned: activation.pointsGiven,
        createdAt: new Date().toISOString()
      }

      data.pointLogs.push(newLog)
      
      // 5. Update user total points
      user.totalPoints += activation.pointsGiven
      data.userEvents[userIndex] = user

      writeFallbackData(data)

      return { success: true, log: newLog, user, mode: 'fallback' }
    })
  },

  // 6. Redeem gift at Station (Transactional)
  async redeemGift(qrCodeToken: string, giftId: string) {
    const hasDbUrl = !!process.env.DATABASE_URL
    const cleanToken = qrCodeToken.trim().toUpperCase()

    if (hasDbUrl) {
      try {
        return await prisma.$transaction(async (tx) => {
          // 1. Get user
          const user = await tx.userEvent.findUnique({
            where: { qrCodeToken: cleanToken }
          })
          if (!user) throw new Error('Jogador não credenciado.')

          // 2. Get gift
          const gift = await tx.gift.findUnique({
            where: { id: giftId }
          })
          if (!gift) throw new Error('Brinde não encontrado.')

          // 3. Check stock
          if (gift.stock <= 0) {
            throw new Error('Brinde esgotado no estoque.')
          }

          // 4. Check balance
          if (user.totalPoints < gift.pointsCost) {
            throw new Error(`Pontos insuficientes. Custo: ${gift.pointsCost} pts | Saldo: ${user.totalPoints} pts.`)
          }

          // 5. Create redemption
          const redemption = await tx.redemption.create({
            data: {
              userEventId: user.id,
              giftId: giftId
            }
          })

          // 6. Deduct points and decrement stock
          const updatedUser = await tx.userEvent.update({
            where: { id: user.id },
            data: {
              totalPoints: {
                decrement: gift.pointsCost
              }
            }
          })

          const updatedGift = await tx.gift.update({
            where: { id: giftId },
            data: {
              stock: {
                decrement: 1
              }
            }
          })

          return { success: true, redemption, user: updatedUser, gift: updatedGift, mode: 'database' }
        })
      } catch (e: any) {
        console.warn('Prisma redeemGift failed, falling back to JSON or throwing.', e)
        if (e.message && (e.message.includes('Jogador') || e.message.includes('Brinde') || e.message.includes('Pontos') || e.message.includes('estoque'))) {
          throw e
        }
      }
    }

    // JSON Fallback
    return acquireLock(async () => {
      const data = await seedIfNeeded(readFallbackData())

      // 1. Get user
      const userIndex = data.userEvents.findIndex(u => u.qrCodeToken.toUpperCase() === cleanToken)
      if (userIndex === -1) throw new Error('Jogador não credenciado.')
      const user = data.userEvents[userIndex]

      // 2. Get gift
      const giftIndex = data.gifts.findIndex(g => g.id === giftId)
      if (giftIndex === -1) throw new Error('Brinde não encontrado.')
      const gift = data.gifts[giftIndex]

      // 3. Check stock
      if (gift.stock <= 0) {
        throw new Error('Brinde esgotado no estoque.')
      }

      // 4. Check balance
      if (user.totalPoints < gift.pointsCost) {
        throw new Error(`Pontos insuficientes. Custo: ${gift.pointsCost} pts | Saldo: ${user.totalPoints} pts.`)
      }

      // 5. Create redemption record
      const newRedemption: RedemptionData = {
        id: Math.random().toString(36).substring(2, 11),
        userEventId: user.id,
        giftId: giftId,
        createdAt: new Date().toISOString()
      }

      data.redemptions.push(newRedemption)

      // 6. Deduct points and decrement stock
      user.totalPoints -= gift.pointsCost
      gift.stock -= 1

      data.userEvents[userIndex] = user
      data.gifts[giftIndex] = gift

      writeFallbackData(data)

      return { success: true, redemption: newRedemption, user, gift, mode: 'fallback' }
    })
  },

  // 7. Checkout redemption: deduct points and reserve stock, returning dynamic 60s token
  async checkoutRedemption(qrCodeToken: string, giftId: string) {
    // Run cleanup first to release any expired locks
    await this.cleanupExpiredRedemptions()

    const hasDbUrl = !!process.env.DATABASE_URL
    const cleanToken = qrCodeToken.trim().toUpperCase()
    const redemptionToken = Math.random().toString(36).substring(2, 8).toUpperCase() // 6 chars
    const expiresAt = Date.now() + 60 * 1000 // 60s

    if (hasDbUrl) {
      try {
        return await prisma.$transaction(async (tx) => {
          const user = await tx.userEvent.findUnique({ where: { qrCodeToken: cleanToken } })
          if (!user) throw new Error('Jogador não credenciado.')

          const gift = await tx.gift.findUnique({ where: { id: giftId } })
          if (!gift) throw new Error('Brinde não encontrado.')
          if (gift.stock <= 0) throw new Error('Brinde esgotado no estoque.')
          if (user.totalPoints < gift.pointsCost) {
            throw new Error(`Pontos insuficientes. Custo: ${gift.pointsCost} pts | Saldo: ${user.totalPoints} pts.`)
          }

          // Deduct points and reserve stock in DB
          const updatedUser = await tx.userEvent.update({
            where: { id: user.id },
            data: { totalPoints: { decrement: gift.pointsCost } }
          })
          const updatedGift = await tx.gift.update({
            where: { id: giftId },
            data: { stock: { decrement: 1 } }
          })

          const pending: PendingRedemption = {
            token: redemptionToken,
            userEventId: user.id,
            giftId: gift.id,
            pointsCost: gift.pointsCost,
            expiresAt
          }
          pendingRedemptions.push(pending)

          return { success: true, token: redemptionToken, expiresAt, user: updatedUser, gift: updatedGift, mode: 'database' }
        })
      } catch (e: any) {
        console.warn('Prisma checkoutRedemption failed, falling back to JSON or throwing.', e)
        if (e.message && (e.message.includes('Jogador') || e.message.includes('Brinde') || e.message.includes('Pontos') || e.message.includes('estoque'))) {
          throw e
        }
      }
    }

    // JSON Fallback
    return acquireLock(async () => {
      const data = await seedIfNeeded(readFallbackData())
      const userIndex = data.userEvents.findIndex(u => u.qrCodeToken.toUpperCase() === cleanToken)
      if (userIndex === -1) throw new Error('Jogador não credenciado.')
      const user = data.userEvents[userIndex]

      const giftIndex = data.gifts.findIndex(g => g.id === giftId)
      if (giftIndex === -1) throw new Error('Brinde não encontrado.')
      const gift = data.gifts[giftIndex]

      if (gift.stock <= 0) throw new Error('Brinde esgotado no estoque.')
      if (user.totalPoints < gift.pointsCost) {
        throw new Error(`Pontos insuficientes. Custo: ${gift.pointsCost} pts | Saldo: ${user.totalPoints} pts.`)
      }

      // Deduct and reserve in JSON
      user.totalPoints -= gift.pointsCost
      gift.stock -= 1
      data.userEvents[userIndex] = user
      data.gifts[giftIndex] = gift
      writeFallbackData(data)

      const pending: PendingRedemption = {
        token: redemptionToken,
        userEventId: user.id,
        giftId: gift.id,
        pointsCost: gift.pointsCost,
        expiresAt
      }
      pendingRedemptions.push(pending)

      return { success: true, token: redemptionToken, expiresAt, user, gift, mode: 'fallback' }
    })
  },

  // 8. Confirm redemption: verify token, create permanent redemption record
  async confirmRedemption(token: string, promotorId: string, dispositivoId: string) {
    const cleanToken = token.trim().toUpperCase()
    const index = pendingRedemptions.findIndex(p => p.token === cleanToken)
    if (index === -1) throw new Error('Código de resgate inválido.')

    const pending = pendingRedemptions[index]
    if (Date.now() > pending.expiresAt) {
      // Expirou, rodar cleanup para estornar e lançar erro
      await this.cleanupExpiredRedemptions()
      throw new Error('Código de resgate expirado.')
    }

    const hasDbUrl = !!process.env.DATABASE_URL

    if (hasDbUrl) {
      try {
        const redemption = await prisma.redemption.create({
          data: {
            userEventId: pending.userEventId,
            giftId: pending.giftId
          },
          include: {
            user: true,
            gift: true
          }
        })

        // Remove from pending
        pendingRedemptions.splice(index, 1)

        return {
          success: true,
          payload: {
            cliente: redemption.user.name,
            evento: redemption.gift.eventId,
            brindeLiberado: redemption.gift.name,
            tierBrinde: redemption.gift.pointsCost >= 50 ? 'PREMIUM' : 'STANDARD',
            scoreObtido: redemption.user.totalPoints,
            promotorResponsavel: promotorId,
            timestamp: new Date().toISOString()
          },
          mode: 'database'
        }
      } catch (e: any) {
        console.warn('Prisma confirmRedemption failed, falling back to JSON or throwing.', e)
      }
    }

    // JSON Fallback
    return acquireLock(async () => {
      const data = await seedIfNeeded(readFallbackData())
      const user = data.userEvents.find(u => u.id === pending.userEventId)
      const gift = data.gifts.find(g => g.id === pending.giftId)
      if (!user || !gift) throw new Error('Dados de resgate inconsistentes.')

      const newRedemption: RedemptionData = {
        id: Math.random().toString(36).substring(2, 11),
        userEventId: pending.userEventId,
        giftId: pending.giftId,
        createdAt: new Date().toISOString()
      }
      data.redemptions.push(newRedemption)
      writeFallbackData(data)

      // Remove from pending
      pendingRedemptions.splice(index, 1)

      return {
        success: true,
        payload: {
          cliente: user.name,
          evento: gift.eventId,
          brindeLiberado: gift.name,
          tierBrinde: gift.pointsCost >= 50 ? 'PREMIUM' : 'STANDARD',
          scoreObtido: user.totalPoints,
          promotorResponsavel: promotorId,
          timestamp: new Date().toISOString()
        },
        mode: 'fallback'
      }
    })
  },

  // 9. Cleanup expired redemptions and refund user points and restore stock
  async cleanupExpiredRedemptions() {
    const now = Date.now()
    const expired = pendingRedemptions.filter(p => p.expiresAt < now)
    if (expired.length === 0) return

    const hasDbUrl = !!process.env.DATABASE_URL

    for (const pending of expired) {
      if (hasDbUrl) {
        try {
          await prisma.$transaction(async (tx) => {
            await tx.userEvent.update({
              where: { id: pending.userEventId },
              data: { totalPoints: { increment: pending.pointsCost } }
            })
            await tx.gift.update({
              where: { id: pending.giftId },
              data: { stock: { increment: 1 } }
            })
          })
        } catch (e) {
          console.error('Error during database cleanup refund:', e)
        }
      } else {
        // JSON Fallback refund
        await acquireLock(async () => {
          try {
            const data = readFallbackData()
            const userIndex = data.userEvents.findIndex(u => u.id === pending.userEventId)
            const giftIndex = data.gifts.findIndex(g => g.id === pending.giftId)
            if (userIndex !== -1) {
              data.userEvents[userIndex].totalPoints += pending.pointsCost
            }
            if (giftIndex !== -1) {
              data.gifts[giftIndex].stock += 1
            }
            writeFallbackData(data)
          } catch (e) {
            console.error('Error during fallback cleanup refund:', e)
          }
        })
      }

      // Remove from memory list
      const idx = pendingRedemptions.findIndex(p => p.token === pending.token)
      if (idx !== -1) {
        pendingRedemptions.splice(idx, 1)
      }
    }
  },

  // 10. Add instagram post
  async addInstagramPost(eventId: string, username: string, photoIdx: number) {
    const newPost: InstagramPost = {
      id: Math.random().toString(36).substring(2, 11).toUpperCase(),
      eventId,
      username,
      photoIdx,
      status: 'pending',
      createdAt: new Date().toISOString(),
      likes: Math.floor(Math.random() * 200) + 10
    }
    instagramPosts.push(newPost)
    return newPost
  },

  // 11. Get all instagram posts (moderation)
  async getInstagramPosts() {
    return instagramPosts
  },

  // 12. Moderate instagram post
  async moderateInstagramPost(postId: string, status: 'approved' | 'rejected') {
    const post = instagramPosts.find(p => p.id === postId)
    if (!post) throw new Error('Post do Instagram não encontrado.')
    post.status = status
    return post
  },

  // 13. Get approved instagram posts
  async getApprovedInstagramPosts() {
    return instagramPosts.filter(p => p.status === 'approved')
  }
}
