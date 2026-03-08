'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Download,
  Package,
  FileText,
  ArrowRight,
} from 'lucide-react'
import { LibraryItemSkeleton } from '@/components/ui/skeleton'

interface EntitledResource {
  resourceId: string
  title: string
  slug: string
  packType: string
  languagePair: string
  downloadable: boolean
}

export default function LibraryPage() {
  const [loading, setLoading] = useState(true)
  const [entitledResources, setEntitledResources] = useState<EntitledResource[]>([])
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  useEffect(() => {
    fetchLibrary()
  }, [])

  const fetchLibrary = async () => {
    try {
      const res = await fetch('/api/account/library')
      const data = await res.json()
      if (data.ok) setEntitledResources(data.data.items)
    } catch (error) {
      console.error('Failed to fetch library:', error)
    } finally {
      setLoading(false)
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

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="font-heading text-2xl font-bold text-text-primary">My Downloads</h1>
        <LibraryItemSkeleton />
        <LibraryItemSkeleton />
        <LibraryItemSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-text-primary">My Downloads</h1>

      {entitledResources.length === 0 ? (
        <div className="clay-card p-12 text-center">
          <Package className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
            No downloads yet
          </h3>
          <p className="text-text-muted mb-6">
            Purchase a teaching pack to start building your library.
          </p>
          <Link href="/shop" className="clay-button-cta cursor-pointer inline-flex items-center gap-2">
            Browse Shop <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {entitledResources.map((resource) => (
            <div key={resource.resourceId} className="clay-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-text-primary truncate">{resource.title}</h3>
                  <p className="text-sm text-text-muted">
                    {resource.packType.replace('_', ' ')} • {resource.languagePair.toUpperCase()}
                  </p>
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
