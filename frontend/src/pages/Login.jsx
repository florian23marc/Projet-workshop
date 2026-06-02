import React, { useState } from 'react'

export default function Login(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')

  async function submit(e){
    e.preventDefault()
    const res = await fetch('/connexion', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({email,password}),
      credentials: 'include'
    })
    if (res.ok) {
      window.location.href = '/dashboard'
    } else {
      const j = await res.json().catch(()=>null)
      alert('Erreur: '+(j?.error||res.status))
    }
  }

  return (
    <div className="auth-grid">
      <div className="auth-panel auth-panel-left" style={{background:'linear-gradient(135deg,#0D0A1E 0%, #1A0A2E 50%)',padding:40,color:'#fff'}}>
        <div className="logo" style={{marginBottom:20}}>SkillSwap</div>
        <h2 style={{fontFamily:'Clash Display',fontSize:28,marginBottom:12}}>Bon retour<br/><span style={{background:'var(--gradient)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>parmi vos pairs !</span></h2>
        <p style={{color:'var(--muted)',maxWidth:320}}>Des milliers d'étudiants vous attendent pour partager leurs compétences et progresser ensemble.</p>
        <div style={{marginTop:24}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div style={{background:'rgba(255,255,255,0.04)',padding:12,borderRadius:12}}>2 400+<div style={{fontSize:12,color:'var(--muted)'}}>Étudiants actifs</div></div>
            <div style={{background:'rgba(255,255,255,0.04)',padding:12,borderRadius:12}}>180+<div style={{fontSize:12,color:'var(--muted)'}}>Compétences</div></div>
          </div>
        </div>
      </div>

      <div style={{padding:40,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{width:'100%',maxWidth:440}}>
          <h1 style={{fontFamily:'Clash Display',fontSize:24}}>Se connecter</h1>
          <p style={{color:'var(--muted)'}}>Pas encore de compte ? <a href="/inscription" style={{color:'var(--primary)'}}>S'inscrire gratuitement</a></p>
          <div id="errorMsg" style={{display:'none',background:'rgba(255,107,107,0.1)',padding:12,borderRadius:8,color:'#FF6B6B',marginBottom:12}}>⚠️ Email ou mot de passe incorrect.</div>
          <form onSubmit={submit}>
            <div style={{marginBottom:12}}>
              <label style={{display:'block',color:'var(--muted)',marginBottom:6}}>Adresse email</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="marie.dupont@dsp.fr" style={{width:'100%'}} required />
            </div>
            <div style={{marginBottom:12}}>
              <label style={{display:'block',color:'var(--muted)',marginBottom:6}}>Mot de passe</label>
              <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Votre mot de passe" type="password" style={{width:'100%'}} required />
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
              <label style={{color:'var(--muted)'}}><input type="checkbox" /> Se souvenir de moi</label>
              <a href="#" style={{color:'var(--primary)'}}>Mot de passe oublié ?</a>
            </div>
            <button className="btn-primary" type="submit" style={{width:'100%'}}>Se connecter →</button>
            <div style={{textAlign:'center',marginTop:14,color:'var(--muted)'}}>ou</div>
            <button type="button" className="btn-primary" style={{width:'100%',marginTop:12,background:'rgba(255,255,255,0.04)',border:'1px solid var(--border)'}}>🎓 Continuer avec mon email universitaire</button>
          </form>
        </div>
      </div>
    </div>
  )
}
