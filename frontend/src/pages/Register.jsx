import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Register() {
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [etablissement, setEtablissement] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [accepted, setAccepted] = useState(false)

  async function submit(e) {
    e.preventDefault()
    const res = await fetch('/inscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prenom, nom, email, etablissement, password }),
      credentials: 'include'
    })

    if (res.status === 201) {
      window.location.href = '/connexion'
    } else {
      const j = await res.json().catch(() => null)
      alert('Erreur : ' + (j?.error || res.status))
    }
  }

  return (
    <div className="auth-grid">
      <div className="auth-panel auth-panel-left">
        <div className="logo">SkillSwap</div>
        <div className="auth-heading">
          <h2>
            Rejoignez la <span className="gradient-text">communauté</span><br />qui apprend.
          </h2>
          <p>Partagez vos compétences, progressez avec vos pairs et créez des sessions d’apprentissage adaptées à votre projet.</p>
        </div>
        <div className="auth-stats">
          <div className="auth-stat">
            <strong>6k+</strong>
            <span>Étudiants actifs</span>
          </div>
          <div className="auth-stat">
            <strong>180+</strong>
            <span>Compétences partagées</span>
          </div>
        </div>
      </div>

      <div className="auth-panel auth-panel-right">
        <div className="auth-form-card">
          <div className="form-header">
            <h1 className="form-title">Créer mon compte</h1>
            <p className="form-note">
              Déjà inscrit ? <Link to="/connexion">Se connecter</Link>
            </p>
          </div>

          <form onSubmit={submit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="prenom">Prénom</label>
                <input
                  id="prenom"
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Marie"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="nom">Nom</label>
                <input
                  id="nom"
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Dupont"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Adresse email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="marie.dupont@dsp.fr"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="etablissement">Établissement</label>
              <select
                id="etablissement"
                value={etablissement}
                onChange={(e) => setEtablissement(e.target.value)}
                required
              >
                <option value="" disabled>
                  Choisir votre école
                </option>
                <option>DSP Digital School of Paris</option>
                <option>Institut F2i</option>
                <option>Autre établissement</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8 caractères minimum"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirm">Confirmer le mot de passe</label>
                <input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Répétez votre mot de passe"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Compétences principales</label>
              <div className="skills-chips">
                <span className="skill-chip">💻 Python</span>
                <span className="skill-chip">🎨 Design</span>
                <span className="skill-chip">🌍 Anglais</span>
              </div>
            </div>

            <div className="checkbox-row">
              <input
                id="cgu"
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                required
              />
              <label htmlFor="cgu">
                J'accepte les <a href="#">Conditions Générales d'Utilisation</a> et la <a href="#">Politique de confidentialité</a>
              </label>
            </div>

            <div className="form-footer">
              <button className="btn-primary" type="submit">
                Créer mon compte →
              </button>
              <div className="divider">ou</div>
              <button className="btn-secondary" type="button">
                🎓 Continuer avec mon email universitaire
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
