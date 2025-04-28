'use client'

import { useEffect, useState } from 'react'

export function withCookieProtection<P extends object>(
    WrappedComponent: React.ComponentType<P>
) {
    return function WithCookieProtection(props: P) {
        const [loading, setLoading] = useState(true)

        useEffect(() => {
            setLoading(false)
        }, [])

        if (loading) {
            return null
        }
        
        return <WrappedComponent {...props} />
    }
}