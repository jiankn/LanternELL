'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    Download,
    Package,
    FileText,
    ArrowRight,
    Search,
    X,
    Grid3X3,
    List,
    Filter,
    Bookmark,
    Sparkles,
    BookOpen,
    Globe,
    Heart,
    Eye,
    ClipboardCheck,
    SortAsc,
    ChevronDown,
} from 'lucide-react'
import { LibraryItemSkeleton } from '@/components/ui/skeleton'
import { getProductImage } from '@/lib/product-images'
import { useAccount } from '../use-account'

interface EntitledResource {
    resourceId: string
    title: string
    slug: string
    packType: string
    languagePair: string
    ageBand?: string
    downloadable: boolean
    downloadedAt?: string
    product?: {
        id: string
        name: string
        description?: string
        type: string
    }
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

const languageOptions = [
    { value: '', label: 'All Languages' },
    { value: 'en-es', label: 'English-Spanish' },
    { value: 'en-zh', label: 'English-Chinese' },
    { value: 'en-ar', label: 'English-Arabic' },
    { value: 'en-vi', label: 'English-Vietnamese' },
    { value: 'en-fr', label: 'English-French' },
    { value: 'en-pt', label: 'English-Portuguese' },
]

const packTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'vocabulary_pack', label: 'Vocabulary' },
    { value: 'sentence_frames', label: 'Sentence Frames' },
    { value: 'classroom_labels', label: 'Labels' },
    { value: 'parent_communication', label: 'Parent Comm.' },
    { value: 'visual_supports', label: 'Visual Supports' },
    { value: 'assessment_tools', label: 'Assessment' },
]

const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'type', label: 'Type' },
]


export default function LibraryPage() {
    const { user } = useAccount()
    const [loading, setLoading] = useState(true)
    const [resources, setResources] = useState<EntitledResource[]>([])
    const [downloadingId, setDownloadingId] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [languageFilter, setLanguageFilter] = useState('')
    const [packTypeFilter, setPackTypeFilter] = useState('')
    const [sortBy, setSortBy] = useState('newest')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [showFilters, setShowFilters] = useState(false)
    const [favorites, setFavorites] = useState<Set<string>>(new Set())

    useEffect(() => {
        fetchLibrary()
        fetchFavorites()
    }, [])

    const fetchLibrary = async () => {
        try {
            const res = await fetch('/api/account/library')
            const data = await res.json()
            if (data.ok) setResources(data.data.items)
        } catch (error) {
            console.error('Failed to fetch library:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchFavorites = async () => {
        try {
            const res = await fetch('/api/account/favorites')
            const data = await res.json()
            if (data.ok) {
                setFavorites(new Set(data.data.items.map((f: { resourceId: string }) => f.resourceId)))
            }
        } catch {
            // ignore
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

    const toggleFavorite = async (resourceId: string) => {
        const isFavorited = favorites.has(resourceId)
        // Optimistic update
        setFavorites((prev) => {
            const next = new Set(prev)
            if (isFavorited) next.delete(resourceId)
            else next.add(resourceId)
            return next
        })
        try {
            await fetch('/api/account/favorites', {
                method: isFavorited ? 'DELETE' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resourceId }),
            })
        } catch {
            // Revert on error
            setFavorites((prev) => {
                const next = new Set(prev)
                if (isFavorited) next.add(resourceId)
                else next.delete(resourceId)
                return next
            })
        }
    }

    const filteredAndSortedResources = useMemo(() => {
        let result = [...resources]

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (r) =>
                    r.title.toLowerCase().includes(query) ||
                    r.product?.name?.toLowerCase().includes(query) ||
                    r.packType.toLowerCase().includes(query)
            )
        }

        if (languageFilter) {
            result = result.filter((r) => r.languagePair === languageFilter)
        }

        if (packTypeFilter) {
            result = result.filter((r) => r.packType === packTypeFilter)
        }

        result.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.downloadedAt || 0).getTime() - new Date(a.downloadedAt || 0).getTime()
                case 'oldest':
                    return new Date(a.downloadedAt || 0).getTime() - new Date(b.downloadedAt || 0).getTime()
                case 'name':
                    return a.title.localeCompare(b.title)
                case 'type':
                    return a.packType.localeCompare(b.packType)
                default:
                    return 0
            }
        })

        return result
    }, [resources, searchQuery, languageFilter, packTypeFilter, sortBy])

    const hasActiveFilters = searchQuery || languageFilter || packTypeFilter

    const clearFilters = () => {
        setSearchQuery('')
        setLanguageFilter('')
        setPackTypeFilter('')
    }

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return null
        const date = new Date(dateStr)
        return date.toLocaleDateString()
    }

    if (!user) return null

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-text-primary">My Library</h1>
                    <p className="text-text-muted mt-1">
                        {resources.length} {resources.length === 1 ? 'resource' : 'resources'} available
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                        aria-label="Grid view"
                    >
                        <Grid3X3 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                        aria-label="List view"
                    >
                        <List className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="clay-card p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search your library..."
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
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors cursor-pointer ${showFilters ? 'bg-primary text-white border-primary' : 'border-gray-200 hover:border-primary/50 text-text-primary'}`}
                    >
                        <Filter className="w-4 h-4" />
                        <span className="hidden sm:inline">Filters</span>
                        {hasActiveFilters && (
                            <span className="w-2 h-2 rounded-full bg-cta" />
                        )}
                    </button>
                </div>

                {showFilters && (
                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                            <SortAsc className="w-4 h-4 text-text-muted" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="clay-input py-2 px-3 text-sm cursor-pointer"
                                aria-label="Sort by"
                            >
                                {sortOptions.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <select
                            value={packTypeFilter}
                            onChange={(e) => setPackTypeFilter(e.target.value)}
                            className="clay-input py-2 px-3 text-sm cursor-pointer"
                            aria-label="Filter by type"
                        >
                            {packTypeOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={languageFilter}
                            onChange={(e) => setLanguageFilter(e.target.value)}
                            className="clay-input py-2 px-3 text-sm cursor-pointer"
                            aria-label="Filter by language"
                        >
                            {languageOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-cta hover:underline cursor-pointer"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {loading ? (
                <div className={viewMode === 'grid' ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <LibraryItemSkeleton key={i} />
                    ))}
                </div>
            ) : filteredAndSortedResources.length === 0 ? (
                <div className="clay-card p-12 text-center">
                    <Package className="w-16 h-16 text-text-muted mx-auto mb-4" />
                    <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
                        {hasActiveFilters ? 'No matching resources' : 'No downloads yet'}
                    </h3>
                    <p className="text-text-muted mb-6">
                        {hasActiveFilters
                            ? 'Try adjusting your search or filters.'
                            : 'Purchase a teaching pack to start building your library.'}
                    </p>
                    {hasActiveFilters ? (
                        <button onClick={clearFilters} className="clay-button cursor-pointer">
                            Clear Filters
                        </button>
                    ) : (
                        <Link href="/shop" className="clay-button-cta cursor-pointer inline-flex items-center gap-2">
                            Browse Shop <ArrowRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAndSortedResources.map((resource) => (
                        <div
                            key={resource.resourceId}
                            className="clay-card overflow-hidden hover:-translate-y-1 transition-all duration-200 group flex flex-col"
                        >
                            <div className="relative h-36 w-full bg-slate-50">
                                <Image
                                    src={getProductImage('single', resource.packType)}
                                    alt={resource.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className={`absolute top-2 left-2 w-8 h-8 rounded-lg flex items-center justify-center ${packTypeColors[resource.packType] || 'bg-gray-100 text-gray-600'}`}>
                                    {packTypeIcons[resource.packType] || <FileText className="w-5 h-5" />}
                                </div>
                                <button
                                    onClick={() => toggleFavorite(resource.resourceId)}
                                    className={`absolute top-2 right-2 w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${favorites.has(resource.resourceId) ? 'bg-cta text-white' : 'bg-white/80 text-text-muted hover:text-cta'}`}
                                    aria-label={favorites.has(resource.resourceId) ? 'Remove from favorites' : 'Add to favorites'}
                                >
                                    <Bookmark className="w-4 h-4" fill={favorites.has(resource.resourceId) ? 'currentColor' : 'none'} />
                                </button>
                            </div>

                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="font-semibold text-text-primary text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
                                    {resource.title}
                                </h3>

                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                        {packTypeLabels[resource.packType] || resource.packType}
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-text-muted">
                                        {resource.languagePair.toUpperCase()}
                                    </span>
                                </div>

                                {resource.downloadedAt && (
                                    <p className="text-xs text-text-muted mb-3">
                                        Downloaded {formatDate(resource.downloadedAt)}
                                    </p>
                                )}

                                <div className="mt-auto">
                                    <button
                                        onClick={() => handleDownload(resource.resourceId)}
                                        disabled={downloadingId === resource.resourceId || !resource.downloadable}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {downloadingId === resource.resourceId ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Download className="w-4 h-4" />
                                        )}
                                        {resource.downloadable ? 'Download' : 'Unavailable'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredAndSortedResources.map((resource) => (
                        <div
                            key={resource.resourceId}
                            className="clay-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 group hover:bg-primary/5 transition-colors"
                        >
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                                <Image
                                    src={getProductImage('single', resource.packType)}
                                    alt={resource.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-semibold text-text-primary truncate group-hover:text-primary transition-colors">
                                        {resource.title}
                                    </h3>
                                    <button
                                        onClick={() => toggleFavorite(resource.resourceId)}
                                        className={`shrink-0 p-1.5 rounded-lg transition-colors cursor-pointer ${favorites.has(resource.resourceId) ? 'text-cta' : 'text-text-muted hover:text-cta'}`}
                                        aria-label={favorites.has(resource.resourceId) ? 'Remove from favorites' : 'Add to favorites'}
                                    >
                                        <Bookmark className="w-4 h-4" fill={favorites.has(resource.resourceId) ? 'currentColor' : 'none'} />
                                    </button>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${packTypeColors[resource.packType] || 'bg-gray-100 text-gray-600'}`}>
                                        {packTypeIcons[resource.packType] || <FileText className="w-3 h-3" />}
                                        {packTypeLabels[resource.packType] || resource.packType}
                                    </span>
                                    <span className="text-xs text-text-muted">{resource.languagePair.toUpperCase()}</span>
                                    {resource.downloadedAt && (
                                        <span className="text-xs text-text-muted">• {formatDate(resource.downloadedAt)}</span>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => handleDownload(resource.resourceId)}
                                disabled={downloadingId === resource.resourceId || !resource.downloadable}
                                className="clay-button flex items-center gap-2 shrink-0 cursor-pointer w-full sm:w-auto justify-center"
                            >
                                {downloadingId === resource.resourceId ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Download className="w-4 h-4" />
                                )}
                                {resource.downloadable ? 'Download' : 'Unavailable'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
