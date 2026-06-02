import React, { useEffect, useState } from 'react'

export default function Search(){
  const [q,setQ] = useState('Python')
  const [results,setResults] = useState([])
  useEffect(()=>{ fetch('/api/search?q='+encodeURIComponent(q), { credentials: 'include' }).then(r=>r.json()).then(d=>setResults(d.results||[])) },[q])
  return (
    <div style={{padding:24}}>
      <h1>Rechercher 🔍</h1>
      <p style={{color:'var(--muted)'}}>Trouvez l'étudiant parfait pour échanger vos compétences</p>

      <div style={{display:'flex',gap:12,marginTop:16,marginBottom:12}}>
        <input value={q} onChange={e=>setQ(e.target.value)} style={{flex:1}} />
        <button className="btn-primary" onClick={()=>{}}>Rechercher</button>
      </div>

      <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:12}}>
        <button className="filter-btn" style={{background:'rgba(108,59,255,0.06)',border:'1px solid var(--border)'}}>🌟 Tous</button>
        <button className="filter-btn">💻 Tech & Dev</button>
        <button className="filter-btn">🎨 Design & Créa</button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:16}}>
        {results.map((r,i)=>(
          <div key={i} style={{background:'var(--card)',padding:16,borderRadius:12}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{fontSize:28}}>👤</div>
              <div style={{flex:1}}>
                <h3 style={{margin:0}}>{r.name}</h3>
                <div style={{color:'var(--muted)',fontSize:12}}>🏫 DSP Paris · ⭐ 4.8</div>
              </div>
              <div style={{fontFamily:'Clash Display',fontSize:18,fontWeight:700,color:'var(--accent)'}}>{r.match}%</div>
            </div>
            <div style={{marginTop:12,display:'flex',gap:8,flexWrap:'wrap'}}>
              <span style={{padding:'6px 10px',borderRadius:20,background:'rgba(0,212,170,0.08)'}}>✅ Offer</span>
              <span style={{padding:'6px 10px',borderRadius:20,background:'rgba(255,107,107,0.08)'}}>🔍 Want</span>
            </div>
            <div style={{display:'flex',gap:8,marginTop:12}}>
              <a href="/profil-etudiant.html" className="btn-secondary" style={{flex:1,background:'transparent',border:'1px solid var(--border)',color:'var(--muted)'}}>Voir profil</a>
              <button className="btn-primary" style={{flex:1}}>Proposer ✨</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
