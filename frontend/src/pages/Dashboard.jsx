import React, { useEffect, useState, useRef } from 'react'

const ALL_SKILLS = {
  "Gestion de projet": [
    "Scrum / Agile", "Kanban", "JIRA / Confluence", "Trello",
    "Gestion des risques", "Planification de projet", "Microsoft Project",
    "Leadership d'équipe", "Communication professionnelle",
    "Gestion budgétaire", "Méthode Waterfall", "OKR / KPI",
  ],
  "Développement informatique": [
    "HTML / CSS", "JavaScript", "TypeScript", "React.js", "Vue.js",
    "Node.js", "Python", "PHP / Symfony", "Java / Spring Boot", "C# / .NET",
    "SQL / Bases de données", "Git / GitHub", "Docker", "REST API",
    "DevOps / CI-CD", "Linux / Shell",
  ],
}

function initials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

function MultiSelect({ label, selected, onChange, color, excluded = [] }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  function toggle(skill) {
    onChange(selected.includes(skill) ? selected.filter(s => s !== skill) : [...selected, skill])
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 14px', borderRadius: 10, border: `1px solid ${color}40`,
          background: '#0E0E18', color: '#E8E8F0', cursor: 'pointer', fontSize: 13,
          fontFamily: 'inherit', fontWeight: 500, transition: 'border-color .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = color}
        onMouseLeave={e => e.currentTarget.style.borderColor = `${color}40`}
      >
        <span>
          {selected.length > 0
            ? `${selected.length} compétence${selected.length > 1 ? 's' : ''} sélectionnée${selected.length > 1 ? 's' : ''}`
            : label}
        </span>
        <span style={{ fontSize: 9, opacity: 0.7 }}>{open ? '▲' : '▼'}</span>
      </button>

      {selected.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
          {selected.map(s => (
            <span key={s} style={{
              fontSize: 11, padding: '3px 10px', borderRadius: 20,
              background: `${color}18`, color, border: `1px solid ${color}35`,
              display: 'inline-flex', alignItems: 'center', gap: 5, fontWeight: 500,
            }}>
              {s}
              <span onClick={() => toggle(s)} style={{ cursor: 'pointer', opacity: 0.7, lineHeight: 1, fontSize: 13 }}>×</span>
            </span>
          ))}
        </div>
      )}

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 300,
          background: '#13131F', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 12, maxHeight: 290, overflowY: 'auto',
          boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
        }}>
          {Object.entries(ALL_SKILLS).map(([category, skills]) => {
            const available = skills.filter(s => !excluded.includes(s))
            if (available.length === 0) return null
            return (
              <div key={category}>
                <div style={{
                  padding: '9px 14px 7px', fontSize: 10, color: 'rgba(255,255,255,0.4)',
                  fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2,
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  position: 'sticky', top: 0, background: '#13131F',
                }}>
                  {category}
                </div>
                {available.map(skill => (
                  <label key={skill} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 14px', cursor: 'pointer', fontSize: 13,
                    color: selected.includes(skill) ? color : '#C8C8D8',
                    background: selected.includes(skill) ? `${color}12` : 'transparent',
                    transition: 'background .12s',
                  }}>
                    <input
                      type="checkbox"
                      checked={selected.includes(skill)}
                      onChange={() => toggle(skill)}
                      style={{ accentColor: color, width: 14, height: 14, flexShrink: 0 }}
                    />
                    {skill}
                  </label>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function MatchItem({ match, color }) {
  const bg = color === '#00D4AA' ? '#00D4AA' : '#6C3BFF'
  return (
    <div className="db-match-item">
      <div className="db-match-avatar" style={{ background: `${bg}30`, color: bg }}>
        {initials(match.name)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="db-match-name">{match.name}</div>
        <div className="db-match-skills">
          {match.skills.slice(0, 2).map(s => (
            <span key={s} className="db-tag" style={{ background: `${color}18`, color }}>
              {s}
            </span>
          ))}
          {match.skills.length > 2 && (
            <span className="db-tag" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--muted)' }}>
              +{match.skills.length - 2}
            </span>
          )}
        </div>
      </div>
      <div className="db-match-pct" style={{ background: `${color}18`, color }}>
        {match.match}%
      </div>
    </div>
  )
}

const METRICS = [
  { icon: '📅', value: '12', label: 'Sessions réalisées', accent: '#6C3BFF', bg: 'rgba(108,59,255,0.12)' },
  { icon: '🏆', value: '840', label: 'Points accumulés', accent: '#FF6B6B', bg: 'rgba(255,107,107,0.12)' },
  { icon: '✨', value: null, label: 'Matchs compétences', accent: '#00D4AA', bg: 'rgba(0,212,170,0.12)' },
  { icon: '⭐', value: '4.9', label: 'Note moyenne', accent: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
]

export default function Dashboard() {
  const [matches, setMatches] = useState([])
  const [user, setUser] = useState(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savingSkills, setSavingSkills] = useState(false)
  const [skillSaved, setSkillSaved] = useState(false)
  const [newSessionOpen, setNewSessionOpen] = useState(false)
  const [sessionForm, setSessionForm] = useState({ title: '', startAt: '', durationMinutes: 60, location: '', capacity: 10 })
  const [teachSkills, setTeachSkills] = useState([])
  const [learnSkills, setLearnSkills] = useState([])
  const [skillMatches, setSkillMatches] = useState({ canTeach: [], canLearnFrom: [] })

  useEffect(() => {
    fetch('/api/matches', { credentials: 'include' }).then(r => r.json()).then(setMatches).catch(() => setMatches([]))
  }, [])

  useEffect(() => {
    fetch('/api/user', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(u => {
        if (!u) return
        setUser(u)
        if (Array.isArray(u.teachSkills)) setTeachSkills(u.teachSkills)
        if (Array.isArray(u.learnSkills)) setLearnSkills(u.learnSkills)
      })
      .catch(() => {})
  }, [])

  function fetchSkillMatches() {
    fetch('/api/match/skills', { credentials: 'include' })
      .then(r => r.json()).then(setSkillMatches).catch(() => {})
  }

  useEffect(() => { fetchSkillMatches() }, [])

  async function saveSkills() {
    if (!user) return
    setSavingSkills(true)
    const payload = {
      firstName: user.firstName, lastName: user.lastName,
      skills: (user.skills || []).map(s => typeof s === 'string' ? s : s.name).filter(Boolean),
      teachSkills, learnSkills,
    }
    try {
      const res = await fetch('/api/user', { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (res.ok) { setSkillSaved(true); setTimeout(() => setSkillSaved(false), 2500); fetchSkillMatches() }
    } catch (e) { console.error(e) }
    setSavingSkills(false)
  }

  async function saveProfile() {
    if (!user) return
    setSaving(true)
    const payload = {
      firstName: user.firstName, lastName: user.lastName,
      skills: (user.skills || []).map(s => typeof s === 'string' ? s : s.name).filter(Boolean),
      teachSkills, learnSkills,
    }
    try {
      const res = await fetch('/api/user', { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (res.ok) { const u = await res.json(); setUser(u); setEditing(false) }
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  async function createSession(e) {
    e.preventDefault()
    try {
      const res = await fetch('/api/sessions', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sessionForm) })
      if (res.ok) { setNewSessionOpen(false); setSessionForm({ title: '', startAt: '', durationMinutes: 60, location: '', capacity: 10 }) }
    } catch (err) { console.error(err) }
  }

  const displayName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.email || 'Utilisateur'
  const matchTotal = (skillMatches.canTeach?.length || 0) + (skillMatches.canLearnFrom?.length || 0)

  return (
    <div className="db-layout">
      {/* ── Sidebar ── */}
      <aside className="db-sidebar">
        <div className="db-sidebar-top">
          <div className="db-logo">SkillSwap</div>
          <div className="db-logo-sub">Plateforme de partage</div>
        </div>

        <nav className="db-nav" style={{ marginTop: 12 }}>
          {[
            { href: '/dashboard', icon: '⊞', label: 'Tableau de bord', active: true },
            { href: '/recherche', icon: '◎', label: 'Rechercher', active: false },
            { href: '/matching', icon: '⟡', label: 'Mes Matchs', active: false },
            { href: '/sessions', icon: '◷', label: 'Sessions', active: false },
          ].map(item => (
            <a key={item.href} href={item.href} className={`db-nav-item${item.active ? ' active' : ''}`}>
              <span className="db-nav-icon">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="db-sidebar-bottom">
          <div className="db-user-row">
            <div className="db-avatar" style={{ fontSize: 13 }}>{initials(displayName)}</div>
            <div style={{ minWidth: 0 }}>
              <div className="db-user-name">{displayName}</div>
              <div className="db-user-email">{user?.email || 'Connecté'}</div>
            </div>
          </div>
          <button
            onClick={() => setEditing(true)}
            style={{
              marginTop: 12, width: '100%', padding: '8px 12px', borderRadius: 9,
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--muted)', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
              transition: 'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)' }}
          >
            ✏️ Éditer le profil
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="db-main">

        {/* Banner */}
        <div className="db-banner">
          <div>
            <h2 className="db-banner-title">
              Bonjour {user?.firstName || 'utilisateur'} 👋
            </h2>
            <p className="db-banner-sub">
              {matchTotal > 0
                ? `${matchTotal} match${matchTotal > 1 ? 's' : ''} trouvé${matchTotal > 1 ? 's' : ''} selon vos compétences`
                : 'Configurez vos compétences pour trouver vos matchs idéaux'}
            </p>
          </div>
          <div className="db-banner-actions">
            <button onClick={() => setNewSessionOpen(true)} className="btn-secondary" style={{ fontSize: 13 }}>
              + Nouvelle session
            </button>
            <a href="/matching" className="btn-primary" style={{ fontSize: 13 }}>
              Mes matchs →
            </a>
          </div>
        </div>

        {/* Metrics */}
        <div className="db-metrics">
          {METRICS.map((m, i) => (
            <div key={i} className="db-metric-card">
              <div className="db-metric-accent" style={{ background: m.accent }} />
              <div className="db-metric-icon" style={{ background: m.bg }}>
                {m.icon}
              </div>
              <div className="db-metric-value">
                {m.value ?? matchTotal}
              </div>
              <div className="db-metric-label">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Skills selector */}
        <div className="db-section-card">
          <div className="db-section-header">
            <h3 className="db-section-title">Mes compétences</h3>
            {skillSaved && (
              <span style={{ fontSize: 12, color: '#00D4AA', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 16 }}>✓</span> Enregistré !
              </span>
            )}
          </div>
          <div className="db-skills-grid">
            <div>
              <div className="db-skill-col-header">
                <span style={{
                  width: 28, height: 28, borderRadius: 8, background: 'rgba(0,212,170,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                }}>💪</span>
                <div>
                  <div className="db-skill-col-label" style={{ color: '#00D4AA' }}>Je maîtrise</div>
                  <div className="db-skill-col-sub">je peux former</div>
                </div>
              </div>
              <MultiSelect
                label="Choisir des compétences…"
                selected={teachSkills}
                onChange={setTeachSkills}
                color="#00D4AA"
                excluded={learnSkills}
              />
            </div>
            <div>
              <div className="db-skill-col-header">
                <span style={{
                  width: 28, height: 28, borderRadius: 8, background: 'rgba(108,59,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                }}>📚</span>
                <div>
                  <div className="db-skill-col-label" style={{ color: '#6C3BFF' }}>Je veux apprendre</div>
                  <div className="db-skill-col-sub">je cherche un formateur</div>
                </div>
              </div>
              <MultiSelect
                label="Choisir des compétences…"
                selected={learnSkills}
                onChange={setLearnSkills}
                color="#6C3BFF"
                excluded={teachSkills}
              />
            </div>
          </div>
          <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={saveSkills}
              disabled={savingSkills}
              className="btn-primary"
              style={{ fontSize: 13, padding: '10px 20px', opacity: savingSkills ? 0.7 : 1 }}
            >
              {savingSkills ? 'Enregistrement…' : '💾 Enregistrer et trouver des matchs'}
            </button>
          </div>
        </div>

        {/* Bottom grid */}
        <div className="db-grid">
          {/* Left column */}
          <div>
            {/* Sessions */}
            <div className="db-section-card" style={{ marginTop: 0 }}>
              <div className="db-section-header">
                <h3 className="db-section-title">Sessions à venir</h3>
                <a href="/sessions" style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none' }}>Voir tout →</a>
              </div>
              <div className="db-session-item">
                <div className="db-session-dot" />
                <div className="db-session-info">
                  <strong>Session Python — avec Lucas M.</strong>
                  <span>Niveau débutant · 1h · En ligne</span>
                </div>
                <div className="db-session-time">14h00</div>
              </div>
              <div className="db-session-item" style={{ opacity: 0.55 }}>
                <div className="db-session-dot" style={{ background: '#6C3BFF', boxShadow: '0 0 8px rgba(108,59,255,0.5)' }} />
                <div className="db-session-info">
                  <strong>Session React.js — avec Emma R.</strong>
                  <span>Niveau intermédiaire · 1h30 · En ligne</span>
                </div>
                <div className="db-session-time">16h30</div>
              </div>
            </div>

            {/* Profile edit */}
            {editing && (
              <div className="db-section-card" style={{ marginTop: 14 }}>
                <div className="db-section-header">
                  <h3 className="db-section-title">Éditer le profil</h3>
                  <button onClick={() => setEditing(false)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
                </div>
                <div className="db-profile-edit-form">
                  <input
                    placeholder="Prénom"
                    value={user?.firstName || ''}
                    onChange={e => setUser({ ...user, firstName: e.target.value })}
                  />
                  <input
                    placeholder="Nom"
                    value={user?.lastName || ''}
                    onChange={e => setUser({ ...user, lastName: e.target.value })}
                  />
                  <input
                    placeholder="Autres compétences (séparées par virgule)"
                    value={(user?.skills || []).map(s => s.name || s).join(', ')}
                    onChange={e => {
                      const list = e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      setUser({ ...user, skills: list.map(n => ({ name: n })) })
                    }}
                  />
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
                    <button onClick={() => setEditing(false)} className="btn-secondary" style={{ fontSize: 13 }}>Annuler</button>
                    <button onClick={saveProfile} disabled={saving} className="btn-primary" style={{ fontSize: 13 }}>
                      {saving ? 'Sauvegarde…' : 'Sauvegarder'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div>
            {/* Je peux former */}
            <div className="db-sidebar-card">
              <div className="db-sidebar-card-title" style={{ color: '#00D4AA' }}>
                <span style={{ fontSize: 15 }}>💪</span> Je peux former
                {skillMatches.canTeach?.length > 0 && (
                  <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 500, color: 'var(--muted)' }}>
                    {skillMatches.canTeach.length} étudiant{skillMatches.canTeach.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {skillMatches.canTeach?.length > 0 ? (
                skillMatches.canTeach.slice(0, 4).map((m, i) => <MatchItem key={i} match={m} color="#00D4AA" />)
              ) : (
                <p className="db-empty">Sélectionnez les compétences que vous maîtrisez pour voir les étudiants à former.</p>
              )}
            </div>

            {/* Ils peuvent me former */}
            <div className="db-sidebar-card">
              <div className="db-sidebar-card-title" style={{ color: '#6C3BFF' }}>
                <span style={{ fontSize: 15 }}>📚</span> Ils peuvent me former
                {skillMatches.canLearnFrom?.length > 0 && (
                  <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 500, color: 'var(--muted)' }}>
                    {skillMatches.canLearnFrom.length} étudiant{skillMatches.canLearnFrom.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {skillMatches.canLearnFrom?.length > 0 ? (
                skillMatches.canLearnFrom.slice(0, 4).map((m, i) => <MatchItem key={i} match={m} color="#6C3BFF" />)
              ) : (
                <p className="db-empty">Indiquez les compétences à apprendre pour trouver des formateurs.</p>
              )}
            </div>

            {/* Matchs généraux */}
            <div className="db-sidebar-card">
              <div className="db-sidebar-card-title">
                <span style={{ fontSize: 15 }}>✨</span> Nouveaux matchs
              </div>
              {matches.length > 0 ? (
                matches.slice(0, 3).map((m, i) => (
                  <div key={i} className="db-match-item">
                    <div className="db-match-avatar" style={{ background: 'rgba(255,107,107,0.2)', color: '#FF6B6B' }}>
                      {initials(m.name || m.email || '?')}
                    </div>
                    <div className="db-match-name">{m.name || m.email}</div>
                    <div className="db-match-pct" style={{ background: 'rgba(255,107,107,0.15)', color: '#FF6B6B' }}>
                      {m.match}%
                    </div>
                  </div>
                ))
              ) : (
                <p className="db-empty">Aucun match général pour le moment.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal nouvelle session */}
      {newSessionOpen && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', zIndex: 400, backdropFilter: 'blur(4px)' }}>
          <form onSubmit={createSession} style={{
            background: 'var(--surface)', padding: 28, borderRadius: 18, width: 440,
            boxShadow: '0 24px 60px rgba(0,0,0,0.4)', border: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Créer une session</h3>
              <button type="button" onClick={() => setNewSessionOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 22, lineHeight: 1 }}>×</button>
            </div>
            {[
              { placeholder: 'Titre de la session', key: 'title', type: 'text', required: true },
              { placeholder: 'Date et heure', key: 'startAt', type: 'datetime-local', required: true },
              { placeholder: 'Durée (minutes)', key: 'durationMinutes', type: 'number', required: true },
              { placeholder: 'Lieu (optionnel)', key: 'location', type: 'text', required: false },
              { placeholder: 'Capacité max.', key: 'capacity', type: 'number', required: true },
            ].map(f => (
              <input
                key={f.key}
                required={f.required}
                type={f.type}
                placeholder={f.placeholder}
                value={sessionForm[f.key]}
                min={f.type === 'number' ? 1 : undefined}
                onChange={e => setSessionForm({ ...sessionForm, [f.key]: f.type === 'number' ? parseInt(e.target.value || 0) : e.target.value })}
                style={{ width: '100%', marginBottom: 10, padding: '11px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
              />
            ))}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="button" onClick={() => setNewSessionOpen(false)} className="btn-secondary" style={{ fontSize: 13 }}>Annuler</button>
              <button type="submit" className="btn-primary" style={{ fontSize: 13 }}>Créer la session</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
