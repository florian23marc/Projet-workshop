import React from 'react'

export default function Home() {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-left">
              <div className="hero-badge">✨ La plateforme d'échange de compétences entre étudiants</div>
              <h1>Apprenez ensemble, <span className="gradient-text">progressez plus vite</span></h1>
              <p className="lead">SkillSwap connecte les étudiants par leurs compétences. Échangez vos savoirs, organisez des sessions d'apprentissage et valorisez votre expertise.</p>
              <div className="cta-row">
                <a href="/inscription" className="btn-primary">Commencer gratuitement →</a>
                <a href="/recherche" className="btn-secondary" style={{marginLeft:12}}>Découvrir</a>
              </div>
            </div>

            <aside className="hero-right">
              <div className="card stat-card">
                <h4>6k+</h4>
                <div className="muted">étudiants inscrits</div>
              </div>
              <div className="card stat-card">
                <h4>1.2k</h4>
                <div className="muted">sessions créées</div>
              </div>
              <div className="card stat-card">
                <h4>250+</h4>
                <div className="muted">badges distribués</div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="features-grid container">
        <div className="feature-card">
          <h3>Système de Matching</h3>
          <p>Trouvez instantanément l'étudiant parfait pour apprendre ou enseigner une compétence grâce à notre algorithme intelligent.</p>
        </div>
        <div className="feature-card">
          <h3>Gestion des Sessions</h3>
          <p>Planifiez des ateliers et organisez des sessions avec vos pairs.</p>
        </div>
        <div className="feature-card">
          <h3>Gamification</h3>
          <p>Gagnez des badges, accumulez des points et relevez des défis.</p>
        </div>
      </section>
    </div>
  )
}
