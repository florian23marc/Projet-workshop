import React, { useState } from 'react'

export default function Register(){
  const [prenom,setPrenom] = useState('')
  const [nom,setNom] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')

  async function submit(e){
    e.preventDefault()
    const res = await fetch('/inscription', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({email,password}),
      credentials: 'include'
    })
    if (res.status===201) {
      window.location.href = '/connexion'
    } else {
      const j = await res.json().catch(()=>null)
      alert('Erreur: '+(j?.error||res.status))
    }
  }

  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',minHeight:'80vh'}}>
      <div style={{background:'linear-gradient(135deg,#0D0A1E 0%, #1A0A2E 50%)',padding:40,color:'#fff'}}>
        <div className="logo">SkillSwap</div>
        <h2 style={{fontFamily:'Clash Display',fontSize:28,marginTop:20}}>Rejoignez la<br/><span style={{background:'var(--gradient)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>communauté</span><br/>qui apprend</h2>
        <p style={{color:'var(--muted)',marginTop:16}}>Connectez-vous avec des étudiants qui partagent vos passions et développez vos compétences ensemble.</p>
      </div>

      <div style={{padding:40,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{width:'100%',maxWidth:520}}>
          <h1 style={{fontFamily:'Clash Display',fontSize:24}}>Créer mon compte</h1>
          <p style={{color:'var(--muted)'}}>Déjà inscrit ? <a href="/connexion">Se connecter</a></p>
          <div style={{display:'flex',gap:12,marginBottom:12}}>
            <input value={prenom} onChange={e=>setPrenom(e.target.value)} placeholder="Prénom" style={{flex:1}} required />
            <input value={nom} onChange={e=>setNom(e.target.value)} placeholder="Nom" style={{flex:1}} required />
          </div>
          <div style={{marginBottom:12}}>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="marie.dupont@dsp.fr" style={{width:'100%'}} required />
          </div>
          <div style={{marginBottom:12}}>
            <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="8 caractères minimum" type="password" style={{width:'100%'}} required />
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
            <input type="checkbox" id="cgu" required /> <label htmlFor="cgu" style={{color:'var(--muted)'}}>J'accepte les Conditions</label>
          </div>
          <button className="btn-primary" onClick={submit} style={{width:'100%'}}>Créer mon compte →</button>
        </div>
      </div>
    </div>
  )
}
