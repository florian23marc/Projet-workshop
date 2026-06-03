import React, { useEffect, useState } from 'react'

function initials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

export default function Matching() {
  const [skillMatches, setSkillMatches] = useState({ canTeach: [], canLearnFrom: [] })
  const [view, setView] = useState('learn')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/match/skills', { credentials: 'include' })
      .then(r => r.json())
      .then(data => { setSkillMatches(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const visibleMatches = view === 'learn'
    ? (skillMatches.canLearnFrom || [])
    : (skillMatches.canTeach || [])

  const learnCount = skillMatches.canLearnFrom?.length || 0
  const teachCount = skillMatches.canTeach?.length || 0

  const color = view === 'learn' ? '#6C3BFF' : '#00D4AA'
  const colorBg = view === 'learn' ? 'rgba(108,59,255,0.12)' : 'rgba(0,212,170,0.12)'
  const colorBorder = view === 'learn' ? 'rgba(108,59,255,0.35)' : 'rgba(0,212,170,0.35)'

  return (
    <div className="matching-page">
      <div className="matching-hero">
        <span className="hero-badge">✦ Algorithme de matching</span>
        <h1 className="matching-title">
          Mes <span className="gradient-text">Matchs</span>
        </h1>
        <p className="matching-subtitle">
          Des étudiants sélectionnés selon vos compétences déclarées
        </p>
        <div className="matching-stats-row">
          <div className="matching-stat">
            <span className="matching-stat-num" style={{ color: '#6C3BFF' }}>{learnCount}</span>
            <span className="matching-stat-label">peuvent vous former</span>
          </div>
          <div className="matching-stat-divider" />
          <div className="matching-stat">
            <span className="matching-stat-num" style={{ color: '#00D4AA' }}>{teachCount}</span>
            <span className="matching-stat-label">à former</span>
          </div>
        </div>
      </div>

      <div className="match-tabs">
        <button
          className={`match-tab${view === 'learn' ? ' active learn' : ''}`}
          onClick={() => setView('learn')}
        >
          <span className="match-tab-icon">📚</span>
          <span className="match-tab-body">
            <span className="match-tab-label">Ils peuvent me former</span>
            <span className="match-tab-count">{learnCount} match{learnCount !== 1 ? 's' : ''}</span>
          </span>
        </button>
        <button
          className={`match-tab${view === 'teach' ? ' active teach' : ''}`}
          onClick={() => setView('teach')}
        >
          <span className="match-tab-icon">💪</span>
          <span className="match-tab-body">
            <span className="match-tab-label">Je peux former</span>
            <span className="match-tab-count">{teachCount} match{teachCount !== 1 ? 's' : ''}</span>
          </span>
        </button>
      </div>

      <div style={{ marginTop: 8 }}>
        {loading && (
          <p style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 40 }}>Chargement…</p>
        )}

        {!loading && visibleMatches.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '48px 24px',
            color: 'var(--muted)', border: '1px dashed var(--border)', borderRadius: 16,
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>
              {view === 'learn' ? '📚' : '💪'}
            </div>
            <p style={{ margin: 0, fontSize: 15 }}>
              {view === 'learn'
                ? 'Aucun formateur trouvé. Ajoutez des compétences à apprendre dans votre tableau de bord.'
                : 'Aucun étudiant à former. Ajoutez des compétences maîtrisées dans votre tableau de bord.'}
            </p>
            <a href="/dashboard" style={{
              display: 'inline-block', marginTop: 16, padding: '8px 18px',
              borderRadius: 10, background: 'var(--surface-alt)',
              color: 'var(--text)', textDecoration: 'none', fontSize: 13,
            }}>
              Configurer mes compétences →
            </a>
          </div>
        )}

        {visibleMatches.map((m, i) => (
          <div key={i} className="match-card">
            {/* Avatar */}
            <div className="match-avatar" style={{
              background: colorBg,
              color: color,
              border: `2px solid ${colorBorder}`,
            }}>
              {initials(m.name)}
            </div>

            {/* Main info */}
            <div className="match-info">
              <div className="match-headline">
                <h3>{m.name}</h3>
                <span className="match-meta">🏫 DSP Paris · ⭐ 4.8</span>
              </div>

              <div className="match-skills">
                {m.skills.map((s, si) => (
                  <span key={si} className="skill-chip" style={{ borderColor: colorBorder, color }}>
                    {s}
                  </span>
                ))}
              </div>

              <div className="match-role-label" style={{ color }}>
                {view === 'learn' ? 'Peut vous former' : 'Veut apprendre avec vous'}
              </div>
            </div>

            {/* Score + Actions */}
            <div className="match-actions">
              <div className="match-score-block" style={{ background: colorBg, borderColor: colorBorder }}>
                <span className="match-score-number" style={{ color }}>{m.match}%</span>
                <span className="match-score-label">compatible</span>
              </div>
              <button className="btn-primary">Proposer une session</button>
              <button className="btn-ghost">Voir le profil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
