import React, { useEffect, useState } from 'react'

export default function Sessions(){
  const [sessions,setSessions] = useState([])
  const [user,setUser] = useState(null)
  const [invitations,setInvitations] = useState([])
  const [inviteEmails,setInviteEmails] = useState({})
  const [message,setMessage] = useState('')
  const [activeTab,setActiveTab] = useState('upcoming')
  const [view,setView] = useState('history')

  useEffect(()=>{ load(); },[])

  async function load(){
    const [sessionsRes,userRes,invitesRes] = await Promise.all([
      fetch('/api/sessions', { credentials:'include' }),
      fetch('/api/user', { credentials:'include' }),
      fetch('/api/invitations', { credentials:'include' }),
    ])
    try{ if(sessionsRes.ok){ const data = await sessionsRes.json(); setSessions(data) } }catch(e){}
    try{ if(userRes.ok){ const u = await userRes.json(); setUser(u) } }catch(e){}
    try{ if(invitesRes.ok){ const inv = await invitesRes.json(); setInvitations(inv) } }catch(e){}
  }

  async function respond(inviteId, act){
    const res = await fetch(`/api/invitations/${inviteId}/respond`, { method:'POST', credentials:'include', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ action: act }) })
    if(res.ok){ setMessage('Réponse enregistrée'); load() }
    else setMessage('Impossible de répondre')
  }

  const sampleSessions = [
    { id:'s1', title:'Atelier React — Hooks & State', whenDate: new Date(Date.now()+3600*1000).toISOString(), when: new Date(Date.now()+3600*1000).toLocaleString('fr-FR'), organizer:'Léa Dupont', participants:'3/8', tags:['React','Hooks','Frontend'] },
    { id:'s2', title:'Introduction à Symfony', whenDate: new Date(Date.now()+86400*1000).toISOString(), when: new Date(Date.now()+86400*1000).toLocaleString('fr-FR'), organizer:'Maxime Leroy', participants:'5/12', tags:['Symfony','API','Backend'] },
    { id:'s3', title:'Data Science pour débutants', whenDate: new Date(Date.now()-86400*1000).toISOString(), when: new Date(Date.now()-86400*1000).toLocaleString('fr-FR'), organizer:'Sofia Martin', participants:'4/10', tags:['Python','Data','ML'] },
    { id:'s4', title:'Atelier UI/UX en duo', whenDate: new Date(Date.now()-3600*1000).toISOString(), when: new Date(Date.now()-3600*1000).toLocaleString('fr-FR'), organizer:'Camille R.', participants:'6/10', tags:['UI/UX','Design','Figma'] },
    { id:'s5', title:'Session Scrum — Agile & Planning', whenDate: new Date(Date.now()+2*86400*1000).toISOString(), when: new Date(Date.now()+2*86400*1000).toLocaleString('fr-FR'), organizer:'Sophie L.', participants:'2/6', tags:['Scrum','Agile','PM'] },
  ]

  const allSessions = sessions.length ? sessions : sampleSessions
  const now = new Date()
  const parseDate = (s) => new Date(s.startAt || s.whenDate || s.when)
  const fmt = (s) => ({
    ...s,
    when: s.when || (s.startAt ? new Date(s.startAt).toLocaleString('fr-FR') : ''),
    organizer: s.organizer || s.organizerName || '',
    participants: s.participants !== undefined ? s.participants : (s.participantCount !== undefined ? `${s.participantCount}/${s.capacity ?? '?'}` : ''),
    tags: s.tags || [],
  })
  const upcoming = allSessions.filter(s => parseDate(s) >= now).map(fmt)
  const past = allSessions.filter(s => parseDate(s) < now).map(fmt)
  const currentSessions = activeTab === 'upcoming' ? upcoming : past

  const sampleInvites = [{ id:'i1', sessionTitle:'Pair Programming React', from:'lea@example.com' }]
  const displayInvites = invitations.length ? invitations : sampleInvites

  const tagColors = {
    React:'rgba(97,218,251,0.15)', Hooks:'rgba(97,218,251,0.1)', Frontend:'rgba(108,59,255,0.12)',
    Symfony:'rgba(255,107,107,0.12)', API:'rgba(255,107,107,0.1)', Backend:'rgba(255,140,66,0.12)',
    Python:'rgba(0,212,170,0.12)', Data:'rgba(0,212,170,0.1)', ML:'rgba(0,212,170,0.08)',
    'UI/UX':'rgba(255,200,87,0.12)', Design:'rgba(255,200,87,0.1)', Figma:'rgba(255,200,87,0.08)',
    Scrum:'rgba(108,59,255,0.12)', Agile:'rgba(108,59,255,0.1)', PM:'rgba(108,59,255,0.08)',
  }

  const avatarColors = ['#6C3BFF','#FF6B6B','#00D4AA','#FF8C42','#7EC8E3']
  const initials = (name) => name ? name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() : '?'

  return (
    <div style={{padding:'28px 32px',maxWidth:1200,margin:'0 auto',display:'grid',gap:24}}>

      {/* Banner */}
      <div style={{borderRadius:20,background:'linear-gradient(135deg,rgba(108,59,255,0.2) 0%,rgba(255,107,107,0.12) 100%)',border:'1px solid rgba(108,59,255,0.22)',padding:'28px 32px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',right:-60,top:-60,width:260,height:260,borderRadius:'50%',background:'radial-gradient(circle,rgba(108,59,255,0.14) 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{position:'relative',zIndex:1}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:7,background:'rgba(108,59,255,0.15)',border:'1px solid rgba(108,59,255,0.25)',borderRadius:999,padding:'5px 12px',fontSize:'0.8rem',fontWeight:600,color:'#a78bfa',marginBottom:10}}>
            <span>📅</span> Sessions de la communauté
          </div>
          <h1 style={{margin:0,fontSize:'clamp(1.6rem,2.8vw,2.4rem)',fontWeight:800,letterSpacing:'-0.03em',lineHeight:1.1}}>Gère tes séances avec clarté</h1>
          <p style={{margin:'10px 0 0',color:'var(--muted)',fontSize:'0.95rem',lineHeight:1.7,maxWidth:560}}>Retrouve tes sessions à venir ou passées et bascule vers le calendrier pour planifier tes prochains échanges.</p>
        </div>
        <div style={{display:'flex',gap:10,flexShrink:0,flexWrap:'wrap',position:'relative',zIndex:1}}>
          <button type="button" className="btn-primary" style={{display:'flex',alignItems:'center',gap:7,padding:'10px 18px',fontSize:'0.9rem'}}>
            <span style={{fontSize:16}}>+</span> Créer une session
          </button>
          <button type="button" onClick={() => setView(view === 'calendar' ? 'history' : 'calendar')}
            style={{padding:'10px 16px',borderRadius:12,border:'1px solid rgba(255,255,255,0.12)',background:'rgba(255,255,255,0.05)',color:'var(--text)',cursor:'pointer',fontSize:'0.9rem',backdropFilter:'blur(4px)'}}>
            {view === 'calendar' ? '← Liste' : '🗓 Calendrier'}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
        {[
          { icon:'🚀', value: upcoming.length, label:'Séances à venir', accent:'#6C3BFF', bg:'rgba(108,59,255,0.1)' },
          { icon:'✅', value: past.length,     label:'Séances passées', accent:'#00D4AA', bg:'rgba(0,212,170,0.1)' },
          { icon:'📬', value: displayInvites.length, label:'Invitations en attente', accent:'#FF8C42', bg:'rgba(255,140,66,0.1)' },
        ].map(({ icon, value, label, accent, bg }) => (
          <div key={label} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:16,padding:'18px 20px',display:'flex',alignItems:'center',gap:14,position:'relative',overflow:'hidden',transition:'transform .18s ease,box-shadow .18s ease'}}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,0.15)'}}
            onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow=''}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:accent,borderRadius:'16px 16px 0 0'}}/>
            <div style={{width:42,height:42,borderRadius:12,background:bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>{icon}</div>
            <div>
              <div style={{fontSize:'1.7rem',fontWeight:800,letterSpacing:'-0.03em',lineHeight:1,color:accent}}>{value}</div>
              <div style={{fontSize:'0.8rem',color:'var(--muted)',marginTop:3,fontWeight:500,textTransform:'uppercase',letterSpacing:'.04em'}}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main layout */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:20,alignItems:'start'}}>

        {/* Sessions panel */}
        <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:20,padding:24}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,gap:12,flexWrap:'wrap'}}>
            <div>
              <h2 style={{margin:0,fontSize:'1.1rem',fontWeight:700}}>{view === 'calendar' ? 'Calendrier des séances' : 'Mes séances'}</h2>
              <p style={{margin:'4px 0 0',color:'var(--muted)',fontSize:'0.85rem'}}>
                {view === 'calendar' ? 'Visualise tes sessions par date.' : activeTab === 'upcoming' ? `${upcoming.length} séance${upcoming.length !== 1 ? 's' : ''} programmée${upcoming.length !== 1 ? 's' : ''}` : `${past.length} séance${past.length !== 1 ? 's' : ''} terminée${past.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            {view !== 'calendar' && (
              <div style={{display:'flex',gap:6,background:'rgba(255,255,255,0.04)',borderRadius:999,padding:4,border:'1px solid var(--border)'}}>
                {['upcoming','past'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    style={{padding:'7px 16px',borderRadius:999,border:'none',background: activeTab===tab ? 'var(--primary)' : 'transparent',color: activeTab===tab ? '#fff' : 'var(--muted)',cursor:'pointer',fontSize:'0.85rem',fontWeight:600,transition:'all .18s ease'}}>
                    {tab === 'upcoming' ? 'À venir' : 'Passées'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {view === 'calendar' ? (
            <div style={{display:'grid',gap:14}}>
              {Object.entries(allSessions.reduce((acc,s)=>{
                const d = parseDate(s).toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})
                if(!acc[d]) acc[d]=[]
                acc[d].push(s)
                return acc
              },{})).map(([day,list])=>(
                <div key={day} style={{background:'rgba(255,255,255,0.03)',border:'1px solid var(--border)',borderRadius:14,padding:16}}>
                  <div style={{fontSize:'0.8rem',fontWeight:700,textTransform:'capitalize',color:'var(--primary)',marginBottom:10,letterSpacing:'.02em'}}>{day}</div>
                  {list.map(s=>(
                    <div key={s.id} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
                      <div style={{width:8,height:8,borderRadius:'50%',background:'#00D4AA',flexShrink:0,boxShadow:'0 0 8px rgba(0,212,170,0.5)'}}/>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:600,fontSize:'0.9rem',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{s.title}</div>
                        <div style={{color:'var(--muted)',fontSize:'0.8rem',marginTop:2}}>{fmt(s).when}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : currentSessions.length ? (
            <div style={{display:'grid',gap:12}}>
              {currentSessions.map((session, i) => (
                <article key={session.id} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:18,transition:'border-color .18s ease,background .18s ease'}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(108,59,255,0.3)';e.currentTarget.style.background='rgba(108,59,255,0.04)'}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.07)';e.currentTarget.style.background='rgba(255,255,255,0.03)'}}>
                  <div style={{display:'flex',alignItems:'flex-start',gap:14}}>
                    <div style={{width:42,height:42,borderRadius:12,background:avatarColors[i % avatarColors.length],display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13,color:'#fff',flexShrink:0}}>
                      {initials(session.organizer)}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12,flexWrap:'wrap'}}>
                        <div>
                          <h3 style={{margin:0,fontSize:'0.95rem',fontWeight:700,lineHeight:1.3}}>{session.title}</h3>
                          <div style={{color:'var(--muted)',fontSize:'0.82rem',marginTop:4}}>
                            <span>{session.when}</span>
                            <span style={{margin:'0 6px',opacity:.4}}>·</span>
                            <span>par <strong style={{color:'var(--text)',fontWeight:600}}>{session.organizer}</strong></span>
                          </div>
                        </div>
                        {session.participants && (
                          <div style={{display:'flex',alignItems:'center',gap:5,background:'rgba(108,59,255,0.12)',border:'1px solid rgba(108,59,255,0.2)',borderRadius:999,padding:'4px 10px',whiteSpace:'nowrap',flexShrink:0}}>
                            <span style={{fontSize:'0.75rem',fontWeight:700,color:'#a78bfa'}}>👥 {session.participants}</span>
                          </div>
                        )}
                      </div>
                      {session.tags?.length > 0 && (
                        <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:10}}>
                          {session.tags.map(tag=>(
                            <span key={tag} style={{padding:'3px 10px',borderRadius:999,background: tagColors[tag] || 'rgba(255,255,255,0.06)',fontSize:'0.78rem',fontWeight:500,border:'1px solid rgba(255,255,255,0.08)'}}>{tag}</span>
                          ))}
                        </div>
                      )}
                      <div style={{display:'flex',gap:8,marginTop:14,flexWrap:'wrap'}}>
                        {activeTab === 'upcoming'
                          ? <button type="button" className="btn-primary" style={{padding:'7px 16px',fontSize:'0.83rem'}}>Rejoindre</button>
                          : <button type="button" style={{padding:'7px 16px',fontSize:'0.83rem',borderRadius:10,border:'1px solid var(--border)',background:'transparent',color:'var(--text)',cursor:'pointer'}}>Compte-rendu</button>}
                        <button type="button" style={{padding:'7px 14px',fontSize:'0.83rem',borderRadius:10,border:'1px solid var(--border)',background:'transparent',color:'var(--muted)',cursor:'pointer'}}>Détails</button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div style={{textAlign:'center',padding:'40px 20px',color:'var(--muted)',background:'rgba(255,255,255,0.02)',borderRadius:14,border:'1px solid var(--border)'}}>
              <div style={{fontSize:32,marginBottom:10}}>{activeTab === 'upcoming' ? '🗓' : '📋'}</div>
              <div style={{fontWeight:600,marginBottom:4}}>{activeTab === 'upcoming' ? 'Aucune séance à venir' : 'Aucune séance passée'}</div>
              <div style={{fontSize:'0.85rem'}}>{activeTab === 'upcoming' ? 'Crée une session ou attends une invitation.' : 'Tes séances terminées apparaîtront ici.'}</div>
            </div>
          )}
        </div>

        {/* Aside */}
        <div style={{display:'grid',gap:14}}>

          {/* Invitations */}
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:18,padding:20}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <div style={{width:30,height:30,borderRadius:8,background:'rgba(255,140,66,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>📬</div>
                <span style={{fontWeight:700,fontSize:'0.95rem'}}>Invitations</span>
              </div>
              {displayInvites.length > 0 && (
                <span style={{background:'#FF8C42',color:'#fff',borderRadius:999,padding:'2px 8px',fontSize:'0.75rem',fontWeight:700}}>{displayInvites.length}</span>
              )}
            </div>
            <div style={{display:'grid',gap:10}}>
              {displayInvites.map(invite=>(
                <div key={invite.id} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,padding:14}}>
                  <div style={{fontWeight:600,fontSize:'0.88rem',marginBottom:3}}>{invite.sessionTitle}</div>
                  <div style={{color:'var(--muted)',fontSize:'0.8rem',marginBottom:10}}>Invité par {invite.from}</div>
                  <div style={{display:'flex',gap:7}}>
                    <button className="btn-primary" type="button" onClick={()=>respond(invite.id,'accept')}
                      style={{flex:1,padding:'7px 10px',fontSize:'0.8rem',textAlign:'center'}}>Accepter</button>
                    <button type="button" onClick={()=>respond(invite.id,'decline')}
                      style={{flex:1,padding:'7px 10px',fontSize:'0.8rem',borderRadius:10,border:'1px solid var(--border)',background:'transparent',color:'var(--muted)',cursor:'pointer'}}>Refuser</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick create */}
          <div style={{background:'linear-gradient(135deg,rgba(108,59,255,0.14) 0%,rgba(255,107,107,0.08) 100%)',border:'1px solid rgba(108,59,255,0.2)',borderRadius:18,padding:20}}>
            <div style={{fontSize:28,marginBottom:10}}>✨</div>
            <div style={{fontWeight:700,marginBottom:6,fontSize:'0.95rem'}}>Organise ta prochaine session</div>
            <div style={{color:'var(--muted)',fontSize:'0.83rem',lineHeight:1.6,marginBottom:14}}>Crée une séance en quelques secondes et invite la communauté.</div>
            <button type="button" className="btn-primary" style={{width:'100%',textAlign:'center',padding:'10px',fontSize:'0.87rem'}}>
              + Créer une session
            </button>
          </div>

          {message && (
            <div style={{padding:'12px 14px',borderRadius:12,background:'rgba(0,212,170,0.12)',color:'var(--text)',border:'1px solid rgba(0,212,170,0.28)',fontSize:'0.88rem'}}>
              ✓ {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
