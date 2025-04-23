'use client'

import { useEffect, useState } from 'react'
import { useAppSelector } from '@/lib/redux/hooks'

export function withCookieProtection<P extends object>(
    WrappedComponent: React.ComponentType<P>
) {
    return function WithCookieProtection(props: P) {
        const [loading, setLoading] = useState(true)
        const cookieConsent = useAppSelector((state) => state.metadata.isCookieConsent);

        useEffect(() => {
            setLoading(false)
        }, [])

        if (loading) {
            return null
        }
        
        return <WrappedComponent {...props} />
    }
}