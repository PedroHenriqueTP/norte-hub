'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function GameRedirectPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-slate-500 font-mono text-xs">
      Redirecionando...
    </div>
  )
}
