'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    Bookmark,
    Download,
    Package,
    ArrowRight,
    Search,
    X,
    Heart,
    Sparkles,
    BookOpen,
    Globe,
    Eye,
    ClipboardCheck,
    FileText,
    Trash2,
} from 'lucide-react'
import { getProductImage } from '@/lib/product-images'
import { useAccount } from '../use-account'

interface FavoriteItem {
    id: string
    resourceId: string
    title: string
    slug: string
    packType: string
    languagePair: string
    downloadable: boolean
    createdAt: string
}

const packTypeIcons: Record<string, React.ReactNode> = {
    vocabulary_pack: <Sparkles className="w-5 h-5" />,
    sentence_frames: <BookOpen className="w-5 h-5" />,
    classroom_labels: <Globe className="w-5 h-5" />,
    parent_communication: <Heart className="w-5 h-5" />,
    visual_supports: <Eye className="w-5 h-5" />,
    assessment_tools: <ClipboardCheck className="w-5 h-5" />,
}

const packTypeColors: Record<string, string> = {
    vocabulary_pack: 'bg-amber-100 text-amber-600',
    sentence_frames: 'bg-blue-100 text-blue-600',
    classroom_labels: 'bg-emerald-100 text-emerald-600',
    parent_communication: 'bg-rose-100 text-rose-600',
    visual_supports: 'bg-violet-100 text-violet-600',
    assessment_tools: 'bg-cyan-100 text-cyan-600',
}

const packTypeLabels: Record<string, string> = {
    vocabulary_pack: 'Vocabulary',
    sentence_frames: 'Sentence Frames',
    classroom_labels: 'Labels',
    parent_communication: 'Parent Comm.',
    visual_supports: 'Visual Supports',
    assessment_tools: 'Assessment',
}

export default function FavoritesPage() {
    const { user } = useAccount()
    const [favorites, setFavorites] = useState<FavoriteItem[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [removingId, setRemovingId] = useState<string | null>(null)
    const [downloadingId, setDownloadingId] = useState<string | null>(null)

    useEffect(() => {
        fetchFavorites()
    }, [])

    const fetchFavorites = async () => {
        try {
            const res = await fetch('/api/account/favorites')
            const data = await res.json()
            if (data.ok) setFavorites(data.data.items)
        } catch (error) {
            console.error('Failed to fetch favorites:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleRemove = async (resourceId: string) => {
        setRemovingId(resourceId)
        try {
            const res = await fetch('/api/account/favorites', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resourceId }),
            })
            const data = await res.json()
            if (data.ok) {
                setFavorites((prev) => prev.filter((f) => f.resourceId !== resourceId))
            }
        } catch (error) {
            console.error('Failed to remove favorite:', error)
        } finally {
            setRemovingId(null)
        }
    }

    const handleDownload = async (resourceId: string) => {
        setDownloadingId(resourceId)
        try {
            const res = await fetch('/api/download/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resourceId }),
            })
            const data = await res.json()
            if (data.ok && data.data.downloadUrl) {
                window.open(data.data.downloadUrl, '_blank')
            } else {
                alert(data.error?.message || 'Download failed')
            }
        } catch {
            alert('Download failed')
        } finally {
            setDownloadingId(null)
        }
    }

    const filteredFavorites = useMemo(() => {
        if (!searchQuery) return favorites
        const query = searchQuery.toLowerCase()
        return favorites.filter(
            (f) =>
                f.title.toLowerCase().includes(query) ||
                f.packType.toLowerCase().includes(query)
        )
    }, [favorites, searchQuery])

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    if (!user) return null

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-text-primary">Favorites</h1>
                    <p className="text-text-muted mt-1">
                        {favorites.length} {favorites.length === 1 ? 'saved item' : 'saved items'}
                    </p>
                </div>
            </div>

            {favorites.length > 0 && (
                <div className="clay-card p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search favorites..."
                            className="clay-input w-full pl-10 pr-10"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                aria-label="Clear search"
                            >
                                <X className="w-4 h-4 text-text-muted hover:text-text-primary" />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="clay-card p-5 animate-pulse">
                            <div className="h-32 bg-gray-200 rounded-xl mb-3" />
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-gray-100 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            ) : filteredFavorites.length === 0 ? (
                <div className="clay-card p-12 text-center">
                    {favorites.length === 0 ? (
                        <>
                            <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Bookmark className="w-8 h-8 text-rose-400" />
                            </div>
                            <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
                                No favorites yet
                            </h3>
                            <p className="text-text-muted mb-6">
                                Save resources you love from your library for quick access.
                            </p>
                            <Link href="/account/library" className="clay-button-cta cursor-pointer inline-flex items-center gap-2">
                                Go to Library <ArrowRight className="w-4 h-4" />
                            </Link>
                        </>
                    ) : (
                        <>
                            <Search className="w-12 h-12 text-text-muted mx-auto mb-4" />
                            <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
                                No matching favorites
                            </h3>
                            <button
                                onClick={() => setSearchQuery('')}
                                className="text-primary hover:underline cursor-pointer"
                            >
                                Clear search
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFavorites.map((item) => (
                        <div
                            key={item.id}
                            className="clay-card overflow-hidden hover:-translate-y-1 transition-all duration-200 group flex flex-col"
                        >
                            <div className="relative h-36 w-full bg-slate-50">
                                <Image
                                    src={getProductImage('single', item.packType)}
                                    alt={item.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className={`absolute top-2 left-2 w-8 h-8 rounded-lg flex items-center justify-center ${packTypeColors[item.packType] || 'bg-gray-100 text-gray-600'}`}>
                                    {packTypeIcons[item.packType] || <FileText className="w-5 h-5" />}
                                </div>
                                <button
                                    onClick={() => handleRemove(item.resourceId)}
                                    disabled={removingId === item.resourceId}
                                    className="absolute top-2 right-2 w-8 h-8 rounded-lg flex items-center justify-center bg-cta text-white hover:bg-red-500 transition-colors cursor-pointer disabled:opacity-50"
                                    aria-label="Remove from favorites"
                                >
                                    {removingId === item.resourceId ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Bookmark className="w-4 h-4" fill="currentColor" />
                                    )}
                                </button>
                            </div>

                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="font-semibold text-text-primary text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
                                    {item.title}
                                </h3>

                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                        {packTypeLabels[item.packType] || item.packType}
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-text-muted">
                                        {item.languagePair.toUpperCase()}
                                    </span>
                                </div>

                                <p className="text-xs text-text-muted mb-3">
                                    Saved {formatDate(item.createdAt)}
                                </p>

                                <div className="mt-auto flex gap-2">
                                    {item.downloadable ? (
                                    <button
                                        onClick={() => handleDownload(item.resourceId)}
                                        disabled={downloadingId === item.resourceId}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50"
                                    >
                                        {downloadingId === item.resourceId ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Download className="w-4 h-4" />
                                        )}
                                        Download
                                    </button>
                                    ) : (
                                    <Link
                                        href="/pricing"
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cta/10 text-cta font-medium hover:bg-cta/20 transition-colors cursor-pointer"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                        Upgrade to Download
                                    </Link>
                                    )}
                                    <button
                                        onClick={() => handleRemove(item.resourceId)}
                                        disabled={removingId === item.resourceId}
                                        className="px-3 py-2.5 rounded-xl border border-gray-200 text-text-muted hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer disabled:opacity-50"
                                        aria-label="Remove"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
