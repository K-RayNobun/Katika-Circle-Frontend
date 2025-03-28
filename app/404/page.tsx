'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NotFound from '@/app/not-found'

export default function Custom404() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname
      if (path !== '/404') {
        router.replace('/404')
      }
    }
  }, [router])

  return <NotFound />
}