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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div>
      <nav className="topnav">
        <div className="topnav-links">
          <Link to="/">Home</Link>
          <Link to="/recherche">Rechercher</Link>
          <Link to="/matching">Matchs</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/sessions">Sessions</Link>
          <Link to="/connexion">Se connecter</Link>
          <Link to="/inscription">S'inscrire</Link>
          <a href="/deconnexion" style={{ color: 'var(--muted)' }}>Déconnexion</a>
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
