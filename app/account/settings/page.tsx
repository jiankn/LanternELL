'use client'

import { useState, useEffect, useRef } from 'react'
import {
    User,
    Mail,
    Bell,
    Globe,
    Shield,
    CreditCard,
    Download,
    Check,
    Save,
    ExternalLink,
    AlertTriangle,
    X,
    Trash2,
} from 'lucide-react'
import { useAccount } from '../use-account'

interface UserPreferences {
    emailNotifications: boolean
    marketingEmails: boolean
    language: string
    timezone: string
    downloadFormat: string
}

const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'zh', label: 'Chinese' },
]

const timezoneOptions = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'UTC', label: 'UTC' },
]

const formatOptions = [
    { value: 'pdf', label: 'PDF (Recommended)' },
    { value: 'zip', label: 'ZIP Archive' },
]

export default function SettingsPage() {
    const { user, logout } = useAccount()
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [editName, setEditName] = useState('')
    const [preferences, setPreferences] = useState<UserPreferences>({
        emailNotifications: true,
        marketingEmails: false,
        language: 'en',
        timezone: 'America/New_York',
        downloadFormat: 'pdf',
    })
    const [portalLoading, setPortalLoading] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteEmail, setDeleteEmail] = useState('')
    const [deleting, setDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState('')

    useEffect(() => {
        fetchSettings()
    }, [])

    useEffect(() => {
        if (user?.name) setEditName(user.name)
    }, [user?.name])

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/account/settings')
            const data = await res.json()
            if (data.ok && data.data.preferences) {
                setPreferences(data.data.preferences)
            }
        } catch {
            // use defaults
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch('/api/account/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    preferences,
                    name: editName.trim() || null,
                }),
            })
            const data = await res.json()
            if (data.ok) {
                setSaved(true)
                setTimeout(() => setSaved(false), 2000)
            }
        } finally {
            setSaving(false)
        }
    }

    const handlePortal = async () => {
        setPortalLoading(true)
        try {
            const res = await fetch('/api/account/portal', { method: 'POST' })
            const data = await res.json()
            if (data.ok && data.data.portalUrl) {
                window.location.href = data.data.portalUrl
            } else {
                alert(data.error?.message || 'Unable to open billing portal')
            }
        } catch {
            alert('Failed to open billing portal')
        } finally {
            setPortalLoading(false)
        }
    }

    const handleDeleteAccount = async () => {
        if (!user || deleteEmail.toLowerCase() !== user.email.toLowerCase()) {
            setDeleteError('Email does not match your account email.')
            return
        }

        setDeleting(true)
        setDeleteError('')
        try {
            const res = await fetch('/api/account/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ confirmEmail: deleteEmail }),
            })
            const data = await res.json()
            if (data.ok) {
                window.location.href = '/'
            } else {
                setDeleteError(data.error?.message || 'Failed to delete account')
            }
        } catch {
            setDeleteError('An unexpected error occurred')
        } finally {
            setDeleting(false)
        }
    }

    const updatePreference = <K extends keyof UserPreferences>(
        key: K,
        value: UserPreferences[K]
    ) => {
        setPreferences((prev) => ({ ...prev, [key]: value }))
    }

    if (!user) return null

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-text-primary">Settings</h1>
                    <p className="text-text-muted mt-1">
                        Manage your account preferences
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="clay-button-cta cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
                >
                    {saving ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : saved ? (
                        <>
                            <Check className="w-4 h-4" />
                            Saved!
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>

            {/* Profile Information */}
            <div className="clay-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-heading font-semibold text-text-primary">Profile Information</h2>
                        <p className="text-sm text-text-muted">Your account details</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1.5">
                                Name
                            </label>
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                placeholder="Your name"
                                className="clay-input w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="clay-input w-full pl-10 bg-gray-50 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="clay-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Bell className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="font-heading font-semibold text-text-primary">Notifications</h2>
                        <p className="text-sm text-text-muted">Manage how you receive updates</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                        <div>
                            <p className="font-medium text-text-primary">Email Notifications</p>
                            <p className="text-sm text-text-muted">Receive updates about your orders and downloads</p>
                        </div>
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={preferences.emailNotifications}
                                onChange={(e) => updatePreference('emailNotifications', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-primary transition-colors" />
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                        </div>
                    </label>

                    <label className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                        <div>
                            <p className="font-medium text-text-primary">Marketing Emails</p>
                            <p className="text-sm text-text-muted">Receive news about new products and promotions</p>
                        </div>
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={preferences.marketingEmails}
                                onChange={(e) => updatePreference('marketingEmails', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-primary transition-colors" />
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                        </div>
                    </label>
                </div>
            </div>

            {/* Regional Settings */}
            <div className="clay-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <Globe className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="font-heading font-semibold text-text-primary">Regional Settings</h2>
                        <p className="text-sm text-text-muted">Language and timezone preferences</p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">
                            Language
                        </label>
                        <select
                            value={preferences.language}
                            onChange={(e) => updatePreference('language', e.target.value)}
                            className="clay-input w-full cursor-pointer"
                        >
                            {languageOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">
                            Timezone
                        </label>
                        <select
                            value={preferences.timezone}
                            onChange={(e) => updatePreference('timezone', e.target.value)}
                            className="clay-input w-full cursor-pointer"
                        >
                            {timezoneOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Download Preferences */}
            <div className="clay-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                        <Download className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                        <h2 className="font-heading font-semibold text-text-primary">Download Preferences</h2>
                        <p className="text-sm text-text-muted">Default format for resource downloads</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {formatOptions.map((opt) => (
                        <label
                            key={opt.value}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${preferences.downloadFormat === opt.value ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${preferences.downloadFormat === opt.value ? 'border-primary' : 'border-gray-300'}`}>
                                {preferences.downloadFormat === opt.value && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                )}
                            </div>
                            <div>
                                <input
                                    type="radio"
                                    name="downloadFormat"
                                    value={opt.value}
                                    checked={preferences.downloadFormat === opt.value}
                                    onChange={(e) => updatePreference('downloadFormat', e.target.value)}
                                    className="sr-only"
                                />
                                <span className="font-medium text-text-primary">{opt.label}</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Billing & Subscription */}
            <div className="clay-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h2 className="font-heading font-semibold text-text-primary">Billing & Subscription</h2>
                        <p className="text-sm text-text-muted">Manage your subscription and payment methods</p>
                    </div>
                </div>

                <button
                    onClick={handlePortal}
                    disabled={portalLoading}
                    className="flex items-center justify-between w-full p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group disabled:opacity-50"
                >
                    <div className="text-left">
                        <p className="font-medium text-text-primary">Stripe Customer Portal</p>
                        <p className="text-sm text-text-muted">Update payment methods, view invoices, manage subscription</p>
                    </div>
                    {portalLoading ? (
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <ExternalLink className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                    )}
                </button>
            </div>

            {/* Danger Zone */}
            <div className="clay-card p-6 border-red-200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                        <Shield className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <h2 className="font-heading font-semibold text-text-primary">Danger Zone</h2>
                        <p className="text-sm text-text-muted">Irreversible actions</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <div>
                            <p className="font-medium text-text-primary">Sign Out</p>
                            <p className="text-sm text-text-muted">Sign out of your account on this device</p>
                        </div>
                        <button
                            onClick={logout}
                            className="px-4 py-2 rounded-xl bg-gray-600 text-white font-medium hover:bg-gray-700 transition-colors cursor-pointer shrink-0"
                        >
                            Sign Out
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-red-50 border border-red-200">
                        <div>
                            <p className="font-medium text-red-700">Delete Account</p>
                            <p className="text-sm text-red-600/80">Permanently delete your account and all associated data</p>
                        </div>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors cursor-pointer shrink-0 inline-flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
                        <button
                            onClick={() => {
                                setShowDeleteModal(false)
                                setDeleteEmail('')
                                setDeleteError('')
                            }}
                            className="absolute top-4 right-4 text-text-muted hover:text-text-primary cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-heading text-lg font-bold text-text-primary">Delete Account</h3>
                                <p className="text-sm text-text-muted">This action cannot be undone</p>
                            </div>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
                            <p className="text-sm font-semibold text-red-700 mb-3">Deleting your account will permanently:</p>
                            <ul className="space-y-2 text-sm text-red-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 font-bold mt-0.5">✕</span>
                                    <span>Remove all purchased resources and download access</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 font-bold mt-0.5">✕</span>
                                    <span>Delete your order history and saved favorites</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 font-bold mt-0.5">✕</span>
                                    <span>Cancel any active subscriptions immediately (no refund)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 font-bold mt-0.5">✕</span>
                                    <span className="font-semibold">This action is irreversible — all data will be lost forever</span>
                                </li>
                            </ul>
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Type <strong>{user.email}</strong> to confirm:
                            </label>
                            <input
                                type="email"
                                value={deleteEmail}
                                onChange={(e) => {
                                    setDeleteEmail(e.target.value)
                                    setDeleteError('')
                                }}
                                placeholder="Enter your email address"
                                className="clay-input w-full"
                                autoComplete="off"
                            />
                            {deleteError && (
                                <p className="text-sm text-red-500 mt-2">{deleteError}</p>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false)
                                    setDeleteEmail('')
                                    setDeleteError('')
                                }}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-text-primary font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleting || deleteEmail.toLowerCase() !== user.email.toLowerCase()}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                            >
                                {deleting ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                                Permanently Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
