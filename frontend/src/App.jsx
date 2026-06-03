import React, { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
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
      <nav className="topnav">
        <Link to="/" className="nav-logo">
          <img src="/logo.svg" alt="SkillSwap logo" />
        </Link>
        <div className="topnav-links">
          <Link to="/">Home</Link>
          {isLoggedIn && <Link to="/recherche">Rechercher</Link>}
          {isLoggedIn && <Link to="/matching">Matchs</Link>}
          {isLoggedIn && <Link to="/dashboard">Dashboard</Link>}
          {isLoggedIn && <Link to="/sessions">Sessions</Link>}
          {!isLoggedIn && <Link to="/connexion">Se connecter</Link>}
          {!isLoggedIn && <Link to="/inscription">S'inscrire</Link>}
          {isLoggedIn && <a href="/deconnexion" style={{ color: 'var(--muted)' }}>Déconnexion</a>}
        </div>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
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
