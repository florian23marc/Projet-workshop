import React, { useEffect, useState } from 'react'

export default function Sessions(){
  const [sessions,setSessions] = useState([])
  const [user,setUser] = useState(null)
  const [invitations,setInvitations] = useState([])
  const [inviteEmails,setInviteEmails] = useState({})
  const [message,setMessage] = useState('')
  const [activeTab,setActiveTab] = useState('upcoming')

  useEffect(()=>{ load(); },[])

  async function load(){
    const [sessionsRes,userRes,invitesRes] = await Promise.all([
      fetch('/api/sessions', { credentials:'include' }),
      fetch('/api/user', { credentials:'include' }),
      fetch('/api/invitations', { credentials:'include' }),
    ])
    try{
      if(sessionsRes.ok){ const data = await sessionsRes.json(); setSessions(data) }
    }catch(e){ console.warn('sessions fetch failed', e) }
    try{ if(userRes.ok){ const u = await userRes.json(); setUser(u) } }catch(e){}
    try{ if(invitesRes.ok){ const inv = await invitesRes.json(); setInvitations(inv) } }catch(e){}
  }

  async function action(url, method = 'POST'){
    const res = await fetch(url, { method, credentials:'include' })
    if(res.ok){ setMessage('Action réussie'); load(); }
    else { setMessage('Erreur lors de l’action'); console.error(await res.text()) }
  }

  async function invite(session){
    const email = inviteEmails[session.id]?.trim()
    if(!email) return setMessage('Entrez une adresse email valide.')
    const res = await fetch(`/api/sessions/${session.id}/invite`, { method:'POST', credentials:'include', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email}) })
    if(res.ok){ setMessage('Invitation envoyée'); setInviteEmails({...inviteEmails, [session.id]: ''}) }
    else { setMessage('Impossible d’envoyer l’invitation'); console.error(await res.text()) }
  }

  async function respond(inviteId, action){
    const res = await fetch(`/api/invitations/${inviteId}/respond`, { method:'POST', credentials:'include', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ action }) })
    if(res.ok){ setMessage('Réponse enregistrée'); load() }
    else { setMessage('Impossible de répondre'); console.error(await res.text()) }
  }

  const sampleSessions = [
    { id:'s1', title:'Atelier React - Hooks & State', whenDate: new Date(Date.now()+3600*1000).toISOString(), when: new Date(Date.now()+3600*1000).toLocaleString(), organizer:'Léa Dupont', participants:'3/8', tags:['React','Hooks','Frontend'] },
    { id:'s2', title:'Introduction à Symfony', whenDate: new Date(Date.now()+86400*1000).toISOString(), when: new Date(Date.now()+86400*1000).toLocaleString(), organizer:'Maxime Leroy', participants:'5/12', tags:['Symfony','API','Backend'] },
    { id:'s3', title:'Data Science pour débutants', whenDate: new Date(Date.now()-86400*1000).toISOString(), when: new Date(Date.now()-86400*1000).toLocaleString(), organizer:'Sofia Martin', participants:'4/10', tags:['Python','Data','ML'] },
    { id:'s4', title:'Atelier UI/UX en duo', whenDate: new Date(Date.now()-3600*1000).toISOString(), when: new Date(Date.now()-3600*1000).toLocaleString(), organizer:'Camille R.', participants:'6/10', tags:['UI/UX','Design','Figma'] }
  ]

  const allSessions = sessions.length ? sessions : sampleSessions
  const now = new Date()
  const parseDate = (session) => new Date(session.whenDate || session.when)
  const upcoming = allSessions.filter(session => parseDate(session) >= now)
  const past = allSessions.filter(session => parseDate(session) < now)

  const currentSessions = activeTab === 'upcoming' ? upcoming : past

  return (
    <div className="sessions-page">
      <div className="sessions-header">
        <div>
          <p className="hero-badge">📅 Sessions de la communauté</p>
          <h1>Organisez, rejoignez et collaborez facilement</h1>
          <p className="lead">Retrouvez des sessions actives, invitez des pairs, et gérez vos rendez-vous d'apprentissage dans un espace clair et moderne.</p>
        </div>
        <div className="sessions-header-actions">
          <button type="button" className="btn-primary">Créer une session</button>
          <button type="button" className="btn-secondary">Voir le calendrier</button>
        </div>
      </div>

      <div className="sessions-stats">
        <div className="stat-card">
          <div className="stat-value">{upcoming.length}</div>
          <div className="stat-label">Séances à venir</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{past.length}</div>
          <div className="stat-label">Séances passées</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{invitations.length || 1}</div>
          <div className="stat-label">Invitations</div>
        </div>
      </div>

      <div className="sessions-layout">
        <section className="sessions-panel">
          <div className="section-title-row">
            <div>
              <h2>Historique de séances</h2>
              <span className="section-caption">Consulte les séances déjà passées et celles à venir.</span>
            </div>
            <div className="sessions-tabs">
              <button className={activeTab === 'upcoming' ? 'active' : ''} onClick={() => setActiveTab('upcoming')}>À venir</button>
              <button className={activeTab === 'past' ? 'active' : ''} onClick={() => setActiveTab('past')}>Passées</button>
            </div>
          </div>

          <div className="sessions-list">
            {currentSessions.length ? currentSessions.map(session => (
              <article key={session.id} className="session-card">
                <div className="session-card-top">
                  <div>
                    <h3>{session.title}</h3>
                    <div className="session-meta">{session.when} · Organisé par <strong>{session.organizer}</strong></div>
                  </div>
                  <div className="session-badge">{session.participants}</div>
                </div>

                <div className="session-tags">
                  {(session.tags || []).map(tag => <span key={tag}>{tag}</span>)}
                </div>

                <div className="session-actions">
                  {activeTab === 'upcoming'
                    ? <button type="button" className="btn-primary">Rejoindre</button>
                    : <button type="button" className="btn-secondary">Voir le compte-rendu</button>}
                  <button type="button" className="btn-secondary">Détails</button>
                </div>
              </article>
            )) : (
              <div className="session-empty">
                {activeTab === 'upcoming' ? 'Aucune séance à venir pour le moment.' : 'Aucune séance passée n’est disponible.'}
              </div>
            )}
          </div>
        </section>

        <aside className="sessions-aside">
          <div className="invite-card">
            <h3>Mes invitations</h3>
            <p className="lead">Gère rapidement les invitations reçues et participe aux sessions qui t'intéressent.</p>
            <div className="invite-list">
              {(invitations.length ? invitations : [{ id:'i1', sessionTitle:'Pair Programming React', from:'lea@example.com' }]).map(invite => (
                <div key={invite.id} className="invite-row">
                  <div>
                    <strong>{invite.sessionTitle}</strong>
                    <div className="session-meta">Invité par {invite.from}</div>
                  </div>
                  <div className="invite-actions">
                    <button className="btn-primary" type="button" onClick={()=>respond(invite.id,'accept')}>Accepter</button>
                    <button className="btn-secondary" type="button" onClick={()=>respond(invite.id,'decline')}>Refuser</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {message && <div className="message-box">{message}</div>}
        </aside>
      </div>
    </div>
  )
}
