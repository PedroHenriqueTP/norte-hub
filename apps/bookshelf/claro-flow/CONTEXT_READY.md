# Project Paper: Claro Conecta
# Estado: v20
# Foco: Mosaico Assimétrico# Creative DNA: Estilo Claro
- Iluminação: Volumétrica
- Interface: Glassmorphism### Estado Atual do JornadaDigital.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Award, QrCode, ShoppingBag, CheckCircle2, RotateCw, Clock, ArrowLeft,
  ShieldCheck, Flame, Gift, Zap, User, Mail, Building, Check, Send,
  ChevronRight, Wifi, Signal, Menu, X, Smartphone, Laptop, Tv2,
  Calendar, MapPin, MessageSquare, Trophy, Bell, HelpCircle, Info, AlertTriangle
} from 'lucide-react'
import QuizClaro from './jornada/QuizClaro'
import ReflexGame from './jornada/ReflexGame'
import SupportChat from './jornada/SupportChat'
import InstagramModal from './jornada/InstagramModal'
import { Camera } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster, toast } from 'sonner'
import MusicPlayerDock from './jornada/MusicPlayerDock'
import BienalExhibitors from './jornada/BienalExhibitors'

interface WalletData {
  user: {
    id: string
    name: string
    email: string
    qrCodeToken: string
    totalPoints: number
  }
  event: {
    id: string
    name: string
  }
  history: Array<{
    id: string
    pointsEarned: number
    createdAt: string
    activation?: {
      name: string
    }
  }>
  redemptions: Array<{
    id: string
    createdAt: string
    gift?: {
      name: string
      pointsCost: number
    }
  }>
  gifts: Array<{
    id: string
---
