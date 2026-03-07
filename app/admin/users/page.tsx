'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/ui/admin-layout'
import { Skeleton } from '@/components/ui/skeleton'
import { Shield, ShieldOff } from 'lucide-react'

interface User {
  id: string; email: string; name: string | null; role: string
  stripe_customer_id: string | null; active_entitlements: number
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchUsers() }, [filter])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const url = filter === 'all' ? '/api/admin/users' : `/api/admin/users?role=${filter}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.ok) setUsers(data.data.users)
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  const toggleRole = async (u: User) => {
    const newRole = u.role === 'admin' ? 'customer' : 'admin'
    if (!confirm(`Change ${u.email} role to ${newRole}?`)) return
    await fetch('/api/admin/users', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: u.id, role: newRole }),
    })
    fetchUsers()
  }

  return (
    <AdminLayout>
      <h1 className="font-heading text-2xl font-bold text-text-primary mb-6">Users</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'customer', 'admin'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${filter === s ? 'bg-primary text-white shadow-clay-button' : 'bg-white text-text-primary hover:bg-primary/10'}`}>
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>
      ) : users.length === 0 ? (
        <div className="clay-card p-12 text-center text-text-muted">No users found</div>
      ) : (
        <div className="space-y-3">
          {users.map(u => (
            <div key={u.id} className="clay-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-text-primary">{u.email}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span>
                </div>
                <p className="text-sm text-text-muted">
                  {u.active_entitlements} entitlement{u.active_entitlements !== 1 ? 's' : ''} · Joined {new Date(u.created_at).toLocaleDateString()}
                  {u.stripe_customer_id && ' · Stripe linked'}
                </p>
              </div>
              <button onClick={() => toggleRole(u)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white border border-text-primary/10 hover:bg-primary/5 cursor-pointer shrink-0">
                {u.role === 'admin' ? <ShieldOff className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
