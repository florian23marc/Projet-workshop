import React, { useEffect, useState } from 'react'

function initials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

const FILTERS = [
  { id: 'all', label: 'Tous', icon: '✦' },
  { id: 'tech', label: 'Tech & Dev', icon: '💻' },
  { id: 'design', label: 'Design & Créa', icon: '🎨' },
  { id: 'business', label: 'Business', icon: '📊' },
]

export default function Search() {
  const [inputValue, setInputValue] = useState('Python')
  const [activeFilter, setActiveFilter] = useState('all')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const doSearch = (term = inputValue) => {
    setLoading(true)
    fetch('/api/search?q=' + encodeURIComponent(term), { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setResults(d.results || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { doSearch('Python') }, [])

  const handleKey = (e) => { if (e.key === 'Enter') doSearch() }

  return (
    <div className="search-page">

      {/* ── Hero ── */}
      <div className="search-hero">
        <span className="hero-badge">✦ Base étudiants DSP Paris</span>
        <h1 className="search-title">
          Trouver un <span className="gradient-text">partenaire</span>
        </h1>
        <p className="search-subtitle">
          Recherchez par compétence, prénom ou domaine pour trouver le bon binôme
        </p>
      </div>

      {/* ── Search bar ── */}
      <div className="search-bar-wrapper">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Python, Figma, React, Leadership…"
          />
          {inputValue && (
            <button className="search-clear" onClick={() => { setInputValue(''); setResults([]) }}>✕</button>
          )}
        </div>
        <button className="btn-primary search-submit" onClick={() => doSearch()}>
          Rechercher
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="filter-chips">
        {FILTERS.map(f => (
          <button
            key={f.id}
            className={`filter-chip${activeFilter === f.id ? ' active' : ''}`}
            onClick={() => setActiveFilter(f.id)}
          >
            <span>{f.icon}</span>
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Results ── */}
      <div className="search-results">
        {loading && (
          <p style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 40 }}>Recherche…</p>
        )}

        {!loading && results.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--muted)', border: '1px dashed var(--border)', borderRadius: 16 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔎</div>
            <p style={{ margin: 0, fontSize: 15 }}>Aucun résultat. Essayez un autre terme.</p>
          </div>
        )}

        {!loading && results.map((r, i) => (
          <div key={i} className="match-card">
            <div className="match-avatar" style={{
              background: 'rgba(108,59,255,0.12)',
              color: '#6C3BFF',
              border: '2px solid rgba(108,59,255,0.3)',
            }}>
              {initials(r.name)}
            </div>

            <div className="match-info">
              <div className="match-headline">
                <h3>{r.name}</h3>
                <span className="match-meta">🏫 DSP Paris · ⭐ 4.8</span>
              </div>
              <div className="match-skills">
                <span className="skill-chip search-offer-chip">✅ Offre</span>
                <span className="skill-chip search-want-chip">🔍 Cherche</span>
              </div>
            </div>

            <div className="match-actions">
              <div className="match-score-block" style={{
                background: 'rgba(108,59,255,0.09)',
                borderColor: 'rgba(108,59,255,0.3)',
              }}>
                <span className="match-score-number" style={{ color: '#6C3BFF' }}>{r.match}%</span>
                <span className="match-score-label">compatible</span>
              </div>
              <button className="btn-primary">Proposer ✨</button>
              <button className="btn-ghost">Voir le profil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
