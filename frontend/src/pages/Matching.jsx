import React, { useEffect, useState } from 'react'

export default function Matching(){
  const [matches,setMatches] = useState([])
  const [view,setView] = useState('learn')
  useEffect(()=>{ fetch('/api/matches', { credentials: 'include' }).then(r=>r.json()).then(setMatches).catch(()=>{}) },[])

  const sampleMatches = [
    { name: 'Léa Dupont', offer: 'React, Vite', want: 'Symfony, API', match: 92, direction: 'learn' },
    { name: 'Maxime Leroy', offer: 'Node.js, Express', want: 'UI/UX, Figma', match: 86, direction: 'learn' },
    { name: 'Sofia Martin', offer: 'Data Science (Python)', want: 'Front React', match: 78, direction: 'teach' },
  ]

  const visibleMatches = (matches.length ? matches : sampleMatches).filter(m => m.direction === view)
  return (
    <div className="matching-page">
      <h1>Mes Matchs ✨</h1>
      <p style={{color:'var(--muted)'}}>Étudiants compatibles avec vos compétences</p>

      <div className="match-view-toggle">
        <button className={view === 'learn' ? 'active' : ''} onClick={() => setView('learn')}>
          Ils peuvent me former
        </button>
        <button className={view === 'teach' ? 'active' : ''} onClick={() => setView('teach')}>
          Je peux former
        </button>
      </div>

      <div style={{marginTop:18}}>
        {visibleMatches.map((m,i)=> (
          <div key={i} className="match-card">
            <div className="match-avatar">
              <div className="match-avatar-icon">👤</div>
            </div>
            <div className="match-info">
              <div className="match-headline">
                <h3>{m.name}</h3>
                <span>🏫 DSP Paris · ⭐ 4.8</span>
              </div>
              <div className="match-badges">
                <span className="pill pill-primary">Il offre : {m.offer}</span>
                <span className="pill pill-secondary">Il cherche : {m.want}</span>
              </div>
            </div>
            <div className="match-role-card">
              <div className="match-role-title">
                {m.direction === 'learn' ? 'Peut me former' : 'Je peux former'}
              </div>
              <div className="match-role-note">
                {m.direction === 'learn'
                  ? `Ce profil peut vous enseigner ${m.offer}.`
                  : `Ce profil veut apprendre ${m.want}, vous pouvez l'accompagner.`}
              </div>
            </div>
            <div className="match-score-card">
              <div className="match-score-circle">
                <div>{m.match}%</div>
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
