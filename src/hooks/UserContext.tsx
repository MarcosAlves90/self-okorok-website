'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type User = Record<string, unknown> | null

type UserContextType = {
    user: User
    setUser: (u: User) => void
    isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let active = true

        const loadUser = async () => {
            try {
                const res = await fetch('/api/usuarios/me')
                if (!res.ok) {
                    if (active) setUser(null)
                    return
                }
                const data = await res.json().catch(() => null) as { success?: boolean; data?: User } | null
                if (active) {
                    setUser(data?.success ? data.data ?? null : null)
                }
            } catch {
                if (active) setUser(null)
            } finally {
                if (active) setIsLoading(false)
            }
        }

        loadUser()
        return () => { active = false }
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser, isLoading }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const ctx = useContext(UserContext)
    if (!ctx) throw new Error('useUser deve ser usado dentro de UserProvider')
    return ctx
}
