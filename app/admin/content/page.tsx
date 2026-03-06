'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Sparkles,
  Plus,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Package,
  FileText,
  Eye,
  Edit,
  Trash2,
  ArrowRight
} from 'lucide-react'

interface ContentJob {
  id: string
  job_id: string
  topic: string
  pack_type: string
  language_pair: string
  age_band: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result_json?: string
  error_message?: string
  created_at: string
  updated_at: string
}

interface PackReview {
  id: string
  resource_id: string | null
  content_json: string
  status: 'draft' | 'review' | 'published' | 'archived'
  created_at: string
}

const packTypeLabels: Record<string, string> = {
  vocabulary_pack: 'Vocabulary Pack',
  sentence_frames: 'Sentence Frames',
  classroom_labels: 'Classroom Labels',
  parent_communication: 'Parent Communication'
}

const statusColors: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-700',
  processing: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  draft: 'bg-gray-100 text-gray-700',
  review: 'bg-yellow-100 text-yellow-700',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-red-100 text-red-700'
}

export default function AdminContentPage() {
  const [jobs, setJobs] = useState<ContentJob[]>([])
  const [packs, setPacks] = useState<PackReview[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [renderingPackId, setRenderingPackId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'generate' | 'review'>('generate')
  
  // Generation form state
  const [formData, setFormData] = useState({
    topic: '',
    pack_type: 'vocabulary_pack',
    language_pair: 'en-es',
    age_band: 'K-2',
    vocabulary_count: 15,
    frame_count: 10,
    label_count: 20
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch jobs
      const jobsRes = await fetch('/api/admin/content/generate?limit=20')
      const jobsData = await jobsRes.json()
      if (jobsData.ok) {
        setJobs(jobsData.data.jobs)
      }
      
      // Fetch packs for review
      const packsRes = await fetch('/api/admin/content/review')
      const packsData = await packsRes.json()
      if (packsData.ok) {
        setPacks(packsData.data.packs)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setGenerating(true)
    
    try {
      const res = await fetch('/api/admin/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      
      if (data.ok) {
        alert('Content generated successfully!')
        fetchData()
      } else {
        alert(data.error?.message || 'Generation failed')
      }
    } catch (error) {
      console.error('Generation failed:', error)
      alert('Generation failed')
    } finally {
      setGenerating(false)
    }
  }

  const handlePublish = async (packId: string) => {
    try {
      const res = await fetch(`/api/admin/content/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId, status: 'published' })
      })
      const data = await res.json()
      
      if (data.ok) {
        alert('Pack published successfully!')
        fetchData()
      } else {
        alert(data.error?.message || 'Publish failed')
      }
    } catch (error) {
      console.error('Publish failed:', error)
      alert('Publish failed')
    }
  }

  const handlePreview = (packId: string) => {
    window.open(`/api/admin/render/preview?packId=${packId}`, '_blank')
  }

  const handleRender = async (packId: string) => {
    setRenderingPackId(packId)

    try {
      const res = await fetch('/api/admin/render/rebuild', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId })
      })
      const data = await res.json()

      if (data.ok) {
        alert('Render completed successfully!')
        if (data.data.previewUrl) {
          window.open(data.data.previewUrl, '_blank')
        }
      } else {
        alert(data.error?.message || 'Render failed')
      }
    } catch (error) {
      console.error('Render failed:', error)
      alert('Render failed')
    } finally {
      setRenderingPackId(null)
    }
  }

  const handleReject = async (packId: string) => {
    if (!confirm('Are you sure you want to reject this pack?')) return
    
    try {
      const res = await fetch(`/api/admin/content/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId, status: 'archived' })
      })
      const data = await res.json()
      
      if (data.ok) {
        alert('Pack rejected')
        fetchData()
      } else {
        alert(data.error?.message || 'Reject failed')
      }
    } catch (error) {
      console.error('Reject failed:', error)
      alert('Reject failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-clay-sm">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="font-heading text-xl font-bold text-text-primary">LanternELL</span>
              </Link>
              <span className="text-text-muted">/</span>
              <span className="font-medium text-text-primary">Admin</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-text-primary hover:text-primary transition-colors">Back to Site</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-heading text-3xl font-bold text-text-primary mb-8">
            Content Management
          </h1>

          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'generate'
                  ? 'bg-primary text-white shadow-clay-button'
                  : 'bg-white text-text-primary hover:bg-primary/10'
              }`}
            >
              <Plus className="w-5 h-5 inline-block mr-2" />
              Generate Content
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'review'
                  ? 'bg-primary text-white shadow-clay-button'
                  : 'bg-white text-text-primary hover:bg-primary/10'
              }`}
            >
              <Eye className="w-5 h-5 inline-block mr-2" />
              Review Queue
              {packs.filter(p => p.status === 'review').length > 0 && (
                <span className="ml-2 bg-cta text-white text-xs px-2 py-0.5 rounded-full">
                  {packs.filter(p => p.status === 'review').length}
                </span>
              )}
            </button>
          </div>

          {/* Generate Tab */}
          {activeTab === 'generate' && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Generation Form */}
              <div className="clay-card p-6">
                <h2 className="font-heading text-xl font-semibold text-text-primary mb-6">
                  Generate New Pack
                </h2>
                
                <form onSubmit={handleGenerate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Topic
                    </label>
                    <input
                      type="text"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      placeholder="e.g., Colors, Classroom Objects"
                      required
                      className="clay-input w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Pack Type
                      </label>
                      <select
                        value={formData.pack_type}
                        onChange={(e) => setFormData({ ...formData, pack_type: e.target.value })}
                        className="clay-input w-full"
                      >
                        <option value="vocabulary_pack">Vocabulary Pack</option>
                        <option value="sentence_frames">Sentence Frames</option>
                        <option value="classroom_labels">Classroom Labels</option>
                        <option value="parent_communication">Parent Communication</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Language Pair
                      </label>
                      <select
                        value={formData.language_pair}
                        onChange={(e) => setFormData({ ...formData, language_pair: e.target.value })}
                        className="clay-input w-full"
                      >
                        <option value="en-es">English - Spanish</option>
                        <option value="en-zh">English - Chinese</option>
                        <option value="en-fr">English - French</option>
                        <option value="en-vi">English - Vietnamese</option>
                        <option value="en-ar">English - Arabic</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Age Band
                      </label>
                      <select
                        value={formData.age_band}
                        onChange={(e) => setFormData({ ...formData, age_band: e.target.value })}
                        className="clay-input w-full"
                      >
                        <option value="K-2">K-2</option>
                        <option value="3-5">3-5</option>
                        <option value="6-8">6-8</option>
                      </select>
                    </div>
                    {formData.pack_type === 'vocabulary_pack' && (
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Vocabulary Count
                        </label>
                        <input
                          type="number"
                          value={formData.vocabulary_count}
                          onChange={(e) => setFormData({ ...formData, vocabulary_count: parseInt(e.target.value) })}
                          min={5}
                          max={30}
                          className="clay-input w-full"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={generating}
                    className="clay-button-cta w-full flex items-center justify-center gap-2"
                  >
                    {generating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Generate Content
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Recent Jobs */}
              <div className="clay-card p-6">
                <h2 className="font-heading text-xl font-semibold text-text-primary mb-6">
                  Recent Jobs
                </h2>
                
                {jobs.length === 0 ? (
                  <div className="text-center py-8 text-text-muted">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No generation jobs yet</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {jobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                        <div>
                          <p className="font-medium text-text-primary">{job.topic}</p>
                          <p className="text-sm text-text-muted">
                            {packTypeLabels[job.pack_type]} • {job.language_pair}
                          </p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[job.status]}`}>
                          {job.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Review Tab */}
          {activeTab === 'review' && (
            <div>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-6">
                Packs Pending Review
              </h2>
              
              {packs.filter(p => p.status === 'review').length === 0 ? (
                <div className="clay-card p-12 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
                    All caught up!
                  </h3>
                  <p className="text-text-muted">No packs pending review</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packs.filter(p => p.status === 'review').map((pack) => {
                    const content = JSON.parse(pack.content_json)
                    return (
                      <div key={pack.id} className="clay-card p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[pack.status]}`}>
                            {pack.status}
                          </span>
                          <span className="text-sm text-text-muted">
                            {new Date(pack.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
                          {content.title || content.topic}
                        </h3>
                        <p className="text-sm text-text-muted mb-4">
                          {packTypeLabels[content.pack_type]} • {content.language_pair}
                        </p>

                        {/* Content Preview */}
                        <div className="bg-background rounded-lg p-3 mb-4 max-h-48 overflow-y-auto">
                          {content.vocabulary && (
                            <p className="text-sm text-text-primary">
                              {content.vocabulary.length} vocabulary items
                            </p>
                          )}
                          {content.labels && (
                            <p className="text-sm text-text-primary">
                              {content.labels.length} labels
                            </p>
                          )}
                          {content.sentence_frames && (
                            <p className="text-sm text-text-primary">
                              {content.sentence_frames.length} sentence frames
                            </p>
                          )}
                          {content.parent_notes && (
                            <p className="text-sm text-text-primary">
                              {content.parent_notes.length} parent notes
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handlePreview(pack.id)}
                            className="clay-button flex items-center justify-center gap-1 text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            Preview
                          </button>
                          <button
                            onClick={() => handleRender(pack.id)}
                            disabled={renderingPackId === pack.id}
                            className="clay-button flex items-center justify-center gap-1 text-sm"
                          >
                            {renderingPackId === pack.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                            Render
                          </button>
                          <button
                            onClick={() => handlePublish(pack.id)}
                            className="clay-button flex-1 flex items-center justify-center gap-1 text-sm"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Publish
                          </button>
                          <button
                            onClick={() => handleReject(pack.id)}
                            className="clay-button bg-red-500 hover:bg-red-600 flex items-center justify-center gap-1 text-sm"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
