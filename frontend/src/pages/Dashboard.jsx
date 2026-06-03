import React, { useEffect, useState } from 'react'

export default function Dashboard(){
  const [matches,setMatches] = useState([])
  const [user,setUser] = useState(null)
  const [editing,setEditing] = useState(false)
  const [saving,setSaving] = useState(false)
  const [newSessionOpen,setNewSessionOpen] = useState(false)
  const [sessionForm,setSessionForm] = useState({ title:'', startAt:'', durationMinutes:60, location:'', capacity:10 })

  useEffect(()=>{ fetch('/api/matches', { credentials: 'include' }).then(r=>r.json()).then(setMatches).catch(()=>setMatches([])) },[])
  useEffect(()=>{ fetch('/api/user', { credentials: 'include' }).then(r=>{ if(r.ok) return r.json(); return null }).then(u=>setUser(u)).catch(()=>setUser(null)) },[])

  function startEdit(){ if(user) setEditing(true) }
  async function saveProfile(){
    if(!user) return
    setSaving(true)
    const payload = {
      firstName: user.firstName,
      lastName: user.lastName,
      skills: (user.skills || []).map((s) => typeof s === 'string' ? s : s.name).filter(Boolean)
    }
    try{
      const res = await fetch('/api/user', { method:'PUT', credentials:'include', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) })
      if(res.ok){ const updated = await res.json(); setUser(updated); setEditing(false) }
      else { console.error('Failed saving profile', await res.text()) }
    }catch(e){ console.error(e) }
    setSaving(false)
  }

  function updateSkillList(text){ const list = text.split(',').map(s=>s.trim()).filter(Boolean); setUser({...user, skills:list.map(n=>({name:n}))}) }

  async function createSession(e){
    e.preventDefault()
    try{
      const res = await fetch('/api/sessions', { method:'POST', credentials:'include', headers:{'Content-Type':'application/json'}, body:JSON.stringify(sessionForm) })
      if(res.ok){ setNewSessionOpen(false); setSessionForm({ title:'', startAt:'', durationMinutes:60, location:'', capacity:10 }) }
      else { console.error('Create session failed', await res.text()) }
    }catch(err){ console.error(err) }
  }

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-aside" style={{background:'var(--card)',padding:16,borderRadius:12}}>
        <div className="logo">SkillSwap</div>
        <nav style={{marginTop:16,display:'flex',flexDirection:'column',gap:8}}>
          <a href="/dashboard" style={{color:'var(--text)'}}>🏠 Tableau de bord</a>
          <a href="/recherche" style={{color:'var(--muted)'}}>🔍 Rechercher</a>
          <a href="/matching" style={{color:'var(--muted)'}}>✨ Mes Matchs</a>
        </nav>
        <div style={{marginTop:20,borderTop:'1px solid var(--border)',paddingTop:12}}>
          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            <div style={{fontSize:28}}>👩‍💻</div>
            <div><strong>{user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.email || 'Utilisateur'}</strong><div style={{fontSize:12,color:'var(--muted)'}}>{user?.email || 'Connecté'}</div></div>
          </div>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-banner" style={{background:'linear-gradient(135deg, rgba(108,59,255,0.15), rgba(255,107,107,0.1))',padding:18,borderRadius:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <h2 style={{margin:0}}>Bonjour {user?.firstName || user?.email || 'utilisateur'} ! 👋</h2>
            <p style={{margin:0,color:'var(--muted)'}}>Vous avez {matches.length} matchs disponibles et pouvez créer des sessions en temps réel.</p>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={()=>setNewSessionOpen(true)} className="btn-secondary">➕ Nouvelle session</button>
            <a href="/recherche" className="btn-primary">🔍 Trouver un match</a>
          </div>
        </div>

        <section className="dashboard-metrics" style={{marginTop:20}}>
          <div className="dashboard-metric">📅<div style={{fontSize:18,fontWeight:700}}>12</div><div style={{fontSize:12,color:'var(--muted)'}}>Sessions réalisées</div></div>
          <div className="dashboard-metric">🏆<div style={{fontSize:18,fontWeight:700}}>840</div><div style={{fontSize:12,color:'var(--muted)'}}>Points accumulés</div></div>
          <div className="dashboard-metric">✨<div style={{fontSize:18,fontWeight:700}}>3</div><div style={{fontSize:12,color:'var(--muted)'}}>Matchs en attente</div></div>
          <div className="dashboard-metric">⭐<div style={{fontSize:18,fontWeight:700}}>4.9</div><div style={{fontSize:12,color:'var(--muted)'}}>Note moyenne</div></div>
        </section>

        <section className="dashboard-main-grid" style={{marginTop:20}}>
          <div>
            <div style={{background:'var(--card)',padding:16,borderRadius:12,marginBottom:12}}>
              <h3>Sessions à venir</h3>
              <div style={{borderTop:'1px solid var(--border)',marginTop:12,paddingTop:12}}>
                <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
                  <div><strong>Session Python — avec Lucas M.</strong><div style={{fontSize:12,color:'var(--muted)'}}>Niveau débutant · 1h · En ligne</div></div>
                  <div style={{fontSize:12,color:'var(--muted)'}}>14h00</div>
                </div>
              </div>
            </div>

            <div style={{background:'var(--card)',padding:16,borderRadius:12}}>
              <h3>Mes compétences</h3>
              <div style={{marginTop:8}}>
                {(user?.skills || []).length ? (user.skills || []).map((skill) => (
                  <div key={skill.name || skill} style={{marginBottom:10}}>
                    <div style={{display:'flex',justifyContent:'space-between'}}><span>{skill.name || skill}</span><span style={{color:'#00D4AA'}}>Actif</span></div>
                    <div style={{height:8,background:'rgba(255,255,255,0.04)',borderRadius:8,marginTop:6}}><div style={{width:'70%',height:'100%',background:'var(--gradient)',borderRadius:8}}></div></div>
                  </div>
                )) : <p style={{ color: 'var(--muted)', margin: 0 }}>Ajoutez vos compétences depuis votre profil pour les voir apparaître ici.</p>}
              </div>
            </div>
          </div>

          <aside>
            <div style={{background:'var(--card)',padding:12,borderRadius:12,marginBottom:12}}>
              <h4>Nouveaux matchs ✨</h4>
              <ul style={{listStyle:'none',padding:0,margin:0}}>
                {matches.slice(0,3).map((m,i)=>(<li key={i} style={{padding:'8px 0',borderBottom:'1px solid var(--border)'}}>{m.name} — {m.match}%</li>))}
              </ul>
            </div>
          </aside>
        </section>
      </main>
      {newSessionOpen && (
        <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.35)'}}>
          <form onSubmit={createSession} style={{background:'var(--bg)',padding:20,borderRadius:12,width:420,boxShadow:'0 14px 45px rgba(0,0,0,0.15)'}}>
            <h3 style={{marginTop:0}}>Créer une session</h3>
            <input required placeholder="Titre" value={sessionForm.title} onChange={e=>setSessionForm({...sessionForm,title:e.target.value})} />
            <input required type="datetime-local" value={sessionForm.startAt} onChange={e=>setSessionForm({...sessionForm,startAt:e.target.value})} />
            <input required type="number" min={1} placeholder="Durée (minutes)" value={sessionForm.durationMinutes} onChange={e=>setSessionForm({...sessionForm,durationMinutes:parseInt(e.target.value||0)})} />
            <input placeholder="Lieu" value={sessionForm.location} onChange={e=>setSessionForm({...sessionForm,location:e.target.value})} />
            <input required type="number" min={1} placeholder="Capacité" value={sessionForm.capacity} onChange={e=>setSessionForm({...sessionForm,capacity:parseInt(e.target.value||0)})} />
            <div style={{display:'flex',gap:8,marginTop:12,justifyContent:'flex-end'}}>
              <button type="button" onClick={()=>setNewSessionOpen(false)} className="btn-secondary">Fermer</button>
              <button type="submit" className="btn-primary">Créer</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
