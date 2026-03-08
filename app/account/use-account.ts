'use client'

import { createContext, useContext } from 'react'
import type { UserData } from './account-context'

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
