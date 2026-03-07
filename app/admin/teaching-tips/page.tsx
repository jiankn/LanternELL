'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/ui/admin-layout'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Pencil, Trash2, X, Eye, EyeOff } from 'lucide-react'

interface BlogPost {
  id: string; slug: string; title: string; excerpt: string | null
  content_md: string; status: string; author: string; tags: string | null
  published_at: string | null; created_at: string
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', contentMd: '', tags: '', status: 'draft' })

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/teaching-tips')
      const data = await res.json()
      if (data.ok) setPosts(data.data.posts)
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] }
      if (editId) {
        await fetch('/api/admin/teaching-tips', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editId, ...payload }) })
      } else {
        await fetch('/api/admin/teaching-tips', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      }
      setShowForm(false); setEditId(null)
      setForm({ title: '', slug: '', excerpt: '', contentMd: '', tags: '', status: 'draft' })
      fetchPosts()
    } catch { alert('Save failed') } finally { setSaving(false) }
  }

  const handleEdit = (p: BlogPost) => {
    setEditId(p.id)
    const tags: string[] = p.tags ? JSON.parse(p.tags) : []
    setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt || '', contentMd: p.content_md, tags: tags.join(', '), status: p.status })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return
    await fetch(`/api/admin/teaching-tips?id=${id}`, { method: 'DELETE' })
    fetchPosts()
  }

  const handleTogglePublish = async (p: BlogPost) => {
    const newStatus = p.status === 'published' ? 'draft' : 'published'
    await fetch('/api/admin/teaching-tips', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: p.id, status: newStatus }) })
    fetchPosts()
  }

  const statusColors: Record<string, string> = { draft: 'bg-gray-100 text-gray-600', published: 'bg-green-100 text-green-700', archived: 'bg-red-100 text-red-700' }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-text-primary">Teaching Tips</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm({ title: '', slug: '', excerpt: '', contentMd: '', tags: '', status: 'draft' }) }}
          className="clay-button text-sm flex items-center gap-2 cursor-pointer"><Plus className="w-4 h-4" /> New Post</button>
      </div>

      {showForm && (
        <div className="clay-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-text-primary">{editId ? 'Edit' : 'New'} Post</h2>
            <button onClick={() => setShowForm(false)} className="p-1 hover:bg-primary/10 rounded-lg cursor-pointer"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="clay-input w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Slug</label>
                <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required className="clay-input w-full" placeholder="my-post-slug" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Excerpt</label>
              <input value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} className="clay-input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Content (Markdown)</label>
              <textarea value={form.contentMd} onChange={e => setForm({ ...form, contentMd: e.target.value })} rows={10} required className="clay-input w-full font-mono text-sm" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Tags (comma separated)</label>
                <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="clay-input w-full" placeholder="ELL, tips, vocabulary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="clay-input w-full">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={saving} className="clay-button-cta cursor-pointer">{saving ? 'Saving...' : editId ? 'Update' : 'Create'}</button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>
      ) : posts.length === 0 ? (
        <div className="clay-card p-12 text-center text-text-muted">No teaching tips yet</div>
      ) : (
        <div className="space-y-3">
          {posts.map(p => (
            <div key={p.id} className="clay-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-text-primary">{p.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[p.status] || 'bg-gray-100 text-gray-600'}`}>{p.status}</span>
                </div>
                <p className="text-sm text-text-muted">/teaching-tips/{p.slug} · {p.published_at ? new Date(p.published_at).toLocaleDateString() : 'Not published'}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => handleTogglePublish(p)} className="text-xs px-3 py-1.5 rounded-lg bg-white border border-text-primary/10 hover:bg-primary/5 cursor-pointer flex items-center gap-1">
                  {p.status === 'published' ? <><EyeOff className="w-3.5 h-3.5" /> Unpublish</> : <><Eye className="w-3.5 h-3.5" /> Publish</>}
                </button>
                <button onClick={() => handleEdit(p)} className="p-2 hover:bg-primary/10 rounded-lg cursor-pointer"><Pencil className="w-4 h-4 text-text-primary" /></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 className="w-4 h-4 text-red-500" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
