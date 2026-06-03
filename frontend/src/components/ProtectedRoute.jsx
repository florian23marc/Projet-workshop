import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const [ready, setReady] = useState(false)
  const [authed, setAuthed] = useState(false)
  const location = useLocation()

  useEffect(() => {
    let cancelled = false

    fetch('/api/me', { credentials: 'include' })
      .then(async (res) => {
        if (cancelled) return
        if (res.ok) {
          setAuthed(true)
        } else {
          setAuthed(false)
        }
      })
      .catch(() => {
        if (!cancelled) setAuthed(false)
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })

    return () => { cancelled = true }
  }, [])

  if (!ready) return <div style={{ padding: 24, color: 'var(--muted)' }}>Vérification de votre session…</div>
  return authed ? children : <Navigate to="/connexion" replace state={{ from: location }} />
}
