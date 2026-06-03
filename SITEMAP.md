# Sitemap — SkillSwap

> Plateforme d'échange de compétences — Digital School of Paris

---

## Structure générale

```
SkillSwap
├── Pages publiques
│   ├── /                   Accueil
│   ├── /connexion          Connexion
│   └── /inscription        Inscription
│
└── Pages protégées (authentification requise)
    ├── /dashboard          Tableau de bord
    ├── /recherche          Recherche d'utilisateurs
    ├── /matching           Matching de compétences
    └── /sessions           Gestion des sessions
```

---

## Pages publiques

### `/` — Accueil
- Hero section (accroche + CTA)
- Présentation des fonctionnalités clés
- Statistiques de la plateforme
- Liens vers `/connexion` et `/inscription`

### `/connexion` — Connexion
- Formulaire email / mot de passe
- Redirection vers `/dashboard` après succès
- Lien vers `/inscription`

### `/inscription` — Inscription
- Formulaire : prénom, nom, email, mot de passe, institution
- Email restreint au domaine `@etu-digitalschool.paris`
- Mot de passe minimum 6 caractères
- Redirection vers `/dashboard` après succès

---

## Pages protégées

> Toutes ces pages nécessitent une session active. Sans authentification, l'utilisateur est redirigé vers `/connexion`.

### `/dashboard` — Tableau de bord
- **Profil utilisateur** : nom, email, édition inline
- **Compétences** :
  - Compétences générales (tags)
  - Compétences à enseigner (`teachSkills`)
  - Compétences à apprendre (`learnSkills`)
- **Métriques** : sessions créées, points, matchs, notes
- **Matchs rapides** :
  - "Je peux former" (top utilisateurs à qui enseigner)
  - "Ils peuvent me former" (top utilisateurs dont apprendre)
- **Sessions à venir** : résumé des prochaines sessions
- **Création de session** : formulaire rapide intégré

### `/recherche` — Recherche
- Barre de recherche par compétence
- Filtres par catégorie (Tech, Design, etc.)
- Liste d'utilisateurs avec pourcentage de compatibilité
- Accès au profil de chaque utilisateur

### `/matching` — Matching
- Vue **"Étudiants à former"** : utilisateurs dont les `learnSkills` correspondent à mes `teachSkills`
- Vue **"Apprendre de"** : utilisateurs dont les `teachSkills` correspondent à mes `learnSkills`
- Score de compatibilité calculé (25 pts par compétence commune)
- Toggle entre les deux modes d'affichage

### `/sessions` — Sessions
- **Vue calendrier** : sessions à venir
- **Vue historique** : sessions passées
- **Détail d'une session** :
  - Titre, date, durée, lieu, capacité
  - Liste des participants
  - Actions : rejoindre, quitter, inviter, supprimer (organisateur)
- **Invitations reçues** : accepter / refuser

---

## API Backend (`/api/*`)

> Endpoints REST consommés par le frontend. Non accessibles directement via le navigateur.

```
/api
├── Auth
│   ├── POST /connexion              Login
│   ├── POST /inscription            Inscription
│   ├── GET  /api/me                 Utilisateur connecté
│   ├── GET  /profil                 Profil détaillé
│   └── GET  /deconnexion            Logout
│
├── Utilisateur
│   ├── GET  /api/user               Profil + compétences
│   └── PUT  /api/user               Mise à jour profil & compétences
│
├── Sessions
│   ├── GET    /api/sessions         Liste des sessions
│   ├── POST   /api/sessions         Créer une session
│   ├── GET    /api/sessions/{id}    Détail session
│   ├── POST   /api/sessions/{id}/join     Rejoindre
│   ├── POST   /api/sessions/{id}/leave    Quitter
│   ├── POST   /api/sessions/{id}/invite   Inviter un utilisateur
│   └── DELETE /api/sessions/{id}          Supprimer (organisateur)
│
├── Invitations
│   ├── GET  /api/invitations            Invitations en attente
│   └── POST /api/invitations/{id}/respond  Accepter / Refuser
│
├── Matching
│   ├── GET /api/match/compute   Matching général (score commun)
│   └── GET /api/match/skills    Matching enseignement / apprentissage
│
└── Recherche & Matchs
    ├── GET /api/search?q=       Recherche par compétence
    └── GET /api/matches         Tous les matchs (triés par score)
```

---

## Entités de données

```
User ──────────────────────────────────────────────────────
  id, email (unique), password, firstName, lastName, roles
  ↔ Skill (many-to-many) : skills, teachSkills, learnSkills

Skill ─────────────────────────────────────────────────────
  id, name (unique)

Session ───────────────────────────────────────────────────
  id, title, startAt, durationMinutes, location, capacity
  → organizer (User)
  ↔ participants (User[])

Invitation ────────────────────────────────────────────────
  id, session, email, invitedBy (User)
  status : pending | accepted | declined
  createdAt

MatchEntity ───────────────────────────────────────────────
  id, user, score, offer, want
```

---

## Légende

| Symbole | Signification |
|---------|--------------|
| `→`     | Relation one-to-one / many-to-one |
| `↔`     | Relation many-to-many |
| `[]`    | Collection |
| `*`     | Champ obligatoire |
