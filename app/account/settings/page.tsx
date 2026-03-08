'use client'

import { useState, useEffect } from 'react'
import {
    Settings,
    User,
    Mail,
    Bell,
    Globe,
    Shield,
    CreditCard,
    Download,
    Trash2,
    Check,
    ChevronRight,
    Save,
    ExternalLink,
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
    const [preferences, setPreferences] = useState<UserPreferences>({
        emailNotifications: true,
        marketingEmails: false,
        language: 'en',
        timezone: 'America/New_York',
        downloadFormat: 'pdf',
    })

    useEffect(() => {
        const savedPrefs = localStorage.getItem('user-preferences')
        if (savedPrefs) {
            setPreferences(JSON.parse(savedPrefs))
        }
    }, [])

    const handleSave = async () => {
        setSaving(true)
        try {
            localStorage.setItem('user-preferences', JSON.stringify(preferences))
            await new Promise((resolve) => setTimeout(resolve, 500))
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
        } finally {
            setSaving(false)
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
                                value={user.name || ''}
                                disabled
                                className="clay-input w-full bg-gray-50 cursor-not-allowed"
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
                    <p className="text-xs text-text-muted">
                        Contact support to update your profile information.
                    </p>
                </div>
            </div>

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

                <a
                    href="/api/account/portal"
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
                >
                    <div>
                        <p className="font-medium text-text-primary">Stripe Customer Portal</p>
                        <p className="text-sm text-text-muted">Update payment methods, view invoices, manage subscription</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                </a>
            </div>

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

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-red-50 border border-red-100">
                    <div>
                        <p className="font-medium text-text-primary">Sign Out</p>
                        <p className="text-sm text-text-muted">Sign out of your account on this device</p>
                    </div>
                    <button
                        onClick={logout}
                        className="px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors cursor-pointer"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    )
}
