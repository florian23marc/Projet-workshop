import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Matching from './pages/Matching'
import Search from './pages/Search'
import Sessions from './pages/Sessions'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    return localStorage.getItem('theme') || 'dark'
  })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = async () => {
    await fetch('/deconnexion', { credentials: 'include', redirect: 'manual' })
    setIsLoggedIn(false)
    navigate('/connexion')
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    fetch('/api/me', { credentials: 'include' })
      .then((res) => setIsLoggedIn(res.ok))
      .catch(() => setIsLoggedIn(false))
  }, [])

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div>
      <nav className={`topnav${menuOpen ? ' menu-open' : ''}`}>
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <img src="/logo.svg" alt="SkillSwap logo" />
        </Link>
        <button
          className="burger-btn"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="topnav-links">
          <Link to="/" onClick={closeMenu}>Home</Link>
          {isLoggedIn && <Link to="/recherche" onClick={closeMenu}>Rechercher</Link>}
          {isLoggedIn && <Link to="/matching" onClick={closeMenu}>Correspondances</Link>}
          {isLoggedIn && <Link to="/dashboard" onClick={closeMenu}>Tableau de bord</Link>}
          {isLoggedIn && <Link to="/sessions" onClick={closeMenu}>Sessions</Link>}
          {!isLoggedIn && <Link to="/connexion" onClick={closeMenu}>Se connecter</Link>}
          {!isLoggedIn && <Link to="/inscription" onClick={closeMenu}>S'inscrire</Link>}
          {isLoggedIn && (
            <button
              onClick={() => { handleLogout(); closeMenu() }}
              style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', padding: 0 }}
            >
              Déconnexion
            </button>
          )}
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recherche" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/matching" element={<ProtectedRoute><Matching /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
        </Routes>
      </main>
    </div>
  )
}
