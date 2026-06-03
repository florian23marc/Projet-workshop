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

  return (
    <div className="matching-page">
      <h1>Mes Matchs ✨</h1>
      <p style={{ color: 'var(--muted)' }}>Étudiants compatibles avec vos compétences</p>

      <div className="match-view-toggle">
        <button className={view === 'learn' ? 'active' : ''} onClick={() => setView('learn')}>
          Ils peuvent me former {learnCount > 0 && <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.75 }}>({learnCount})</span>}
        </button>
        <button className={view === 'teach' ? 'active' : ''} onClick={() => setView('teach')}>
          Je peux former {teachCount > 0 && <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.75 }}>({teachCount})</span>}
        </button>
      </div>

      <div style={{ marginTop: 18 }}>
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
            <div className="match-avatar">
              <div style={{
                width: 48, height: 48, borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16,
                background: view === 'learn' ? 'rgba(108,59,255,0.2)' : 'rgba(0,212,170,0.2)',
                color: view === 'learn' ? '#6C3BFF' : '#00D4AA',
              }}>
                {initials(m.name)}
              </div>
            </div>
            <div className="match-info">
              <div className="match-headline">
                <h3>{m.name}</h3>
                <span>🏫 DSP Paris · ⭐ 4.8</span>
              </div>
              <div className="match-badges">
                <span className="pill pill-primary">
                  {view === 'learn' ? 'Il maîtrise' : 'Il veut apprendre'} : {m.skills.join(', ')}
                </span>
              </div>
            </div>
            <div className="match-role-card">
              <div className="match-role-title">
                {view === 'learn' ? 'Peut me former' : 'Je peux former'}
              </div>
              <div className="match-role-note">
                {view === 'learn'
                  ? `Ce profil maîtrise ${m.skills.slice(0, 2).join(', ')}${m.skills.length > 2 ? '…' : ''} et peut vous accompagner.`
                  : `Ce profil veut apprendre ${m.skills.slice(0, 2).join(', ')}${m.skills.length > 2 ? '…' : ''}.`}
              </div>
            </div>
            <div className="match-score-card">
              <div className="match-score-circle">
                <div style={{ color: view === 'learn' ? '#6C3BFF' : '#00D4AA' }}>{m.match}%</div>
              </div>
              <div className="match-actions">
                <button className="btn-primary">Proposer une session</button>
                <button className="btn-secondary">Voir le profil</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
