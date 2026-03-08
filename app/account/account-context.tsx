'use client'

import { createContext, useContext } from 'react'

export interface UserData {
    id: string
    email: string
    name: string | null
    role: string
    subscription?: {
        status: string
        currentPeriodEnd: string | null
        cancelAtPeriodEnd: boolean
    } | null
}

export interface AccountContextType {
    user: UserData | null
    loading: boolean
    refreshUser: () => Promise<void>
    logout: () => Promise<void>
}

export const AccountContext = createContext<AccountContextType>({
    user: null,
    loading: true,
    refreshUser: async () => { },
    logout: async () => { },
})

export function useAccount() {
    return useContext(AccountContext)
}
