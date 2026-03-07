'use client'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: 40, maxWidth: 400, textAlign: 'center', boxShadow: '8px 8px 16px rgba(163,177,198,0.6), -8px -8px 16px rgba(255,255,255,0.8)' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: '#1E1B4B', marginBottom: 8 }}>Critical Error</h1>
          <p style={{ color: '#6366F1', marginBottom: 24 }}>Something went seriously wrong. Please refresh the page.</p>
          <button onClick={reset} style={{ background: 'linear-gradient(135deg, #4F46E5, #4545d4)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 'bold', cursor: 'pointer' }}>
            Refresh
          </button>
        </div>
      </body>
    </html>
  )
}
