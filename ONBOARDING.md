# Kit d'onboarding — SkillSwap

> Bienvenue sur **SkillSwap**, la plateforme d'échange de compétences entre étudiants de Digital School of Paris.

---

## Sommaire

1. [Vue d'ensemble](#1-vue-densemble)
2. [Stack technique](#2-stack-technique)
3. [Prérequis](#3-prérequis)
4. [Installation](#4-installation)
5. [Lancer le projet](#5-lancer-le-projet)
6. [Architecture du code](#6-architecture-du-code)
7. [Fonctionnalités clés](#7-fonctionnalités-clés)
8. [Flux utilisateur](#8-flux-utilisateur)
9. [Conventions de code](#9-conventions-de-code)
10. [Points d'attention](#10-points-dattention)

---

## 1. Vue d'ensemble

SkillSwap permet aux étudiants de :
- Déclarer les compétences qu'ils **peuvent enseigner** et celles qu'ils **souhaitent apprendre**
- Être **mis en relation** automatiquement avec des profils compatibles
- **Créer et rejoindre des sessions** d'échange (atelier, tutorat, pair programming…)
- **Inviter d'autres étudiants** à leurs sessions

L'application est un projet workshop — prototype fonctionnel avec backend Symfony et frontend React.

---

## 2. Stack technique

| Couche | Technologie | Version |
|--------|------------|---------|
| Backend | PHP / Symfony | 6.4 |
| ORM | Doctrine | 2.x |
| Frontend | React + Vite | 18.2 / 5.0 |
| Routing | React Router DOM | 6.14 |
| Auth | Session Symfony (cookie) | — |
| CSS | Vanilla CSS (custom properties) | — |
| Gestion deps PHP | Composer | — |
| Gestion deps JS | npm | — |

> Pas de framework CSS tiers (pas de Tailwind, Bootstrap, etc.). Tout le style est en CSS natif avec des variables CSS pour le thème clair/sombre.

---

## 3. Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **PHP 8.1+** (`php --version`)
- **Composer** (`composer --version`)
- **Symfony CLI** (`symfony --version`) — [installer ici](https://symfony.com/download)
- **Node.js 18+** (`node --version`)
- **npm** (`npm --version`)
- **Git**

---

## 4. Installation

### 4.1 Cloner le dépôt

```bash
git clone <url-du-repo>
cd "Projet workshop"
```

### 4.2 Backend — dépendances PHP

```bash
cd backend
composer install
```

### 4.3 Variables d'environnement backend

Copier le fichier d'exemple et le remplir :

```bash
cp .env .env.local
```

Valeurs minimales dans `.env.local` :

```dotenv
APP_ENV=dev
APP_SECRET=<une-chaine-aleatoire-32-chars>
DATABASE_URL="sqlite:///%kernel.project_dir%/var/data.db"
```

### 4.4 Base de données

```bash
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

### 4.5 Frontend — dépendances JS

```bash
cd ../frontend
npm install
```

---

## 5. Lancer le projet

Ouvrir **deux terminaux** :

**Terminal 1 — Backend :**
```bash
cd backend
symfony server:start
# Écoute sur https://127.0.0.1:8000
```

**Terminal 2 — Frontend :**
```bash
cd frontend
npm run dev
# Écoute sur http://localhost:5173
```

> Le frontend envoie ses requêtes API vers `http://localhost:8000`. Vérifiez la config CORS dans `config/packages/framework.yaml` si vous changez les ports.

---

## 6. Architecture du code

```
Projet workshop/
├── backend/
│   ├── src/
│   │   ├── Controller/
│   │   │   ├── AuthController.php       Auth (login, register, me)
│   │   │   ├── UserController.php       Profil + compétences
│   │   │   ├── SessionController.php    Sessions CRUD + actions
│   │   │   ├── InvitationController.php Invitations
│   │   │   ├── MatchingController.php   Algorithme de matching
│   │   │   └── ApiController.php        Search + matchs globaux
│   │   └── Entity/
│   │       ├── User.php
│   │       ├── Skill.php
│   │       ├── Session.php
│   │       ├── Invitation.php
│   │       └── MatchEntity.php
│   ├── config/
│   │   └── packages/security.yaml       Firewall, access control
│   └── migrations/                      Migrations Doctrine
│
└── frontend/
    └── src/
        ├── App.jsx                      Routing React
        ├── components/
        │   └── ProtectedRoute.jsx       Guard d'authentification
        └── pages/
            ├── Home.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── Search.jsx
            ├── Matching.jsx
            └── Sessions.jsx
```

---

## 7. Fonctionnalités clés

### Authentification
- Inscription avec email `@etu-digitalschool.paris` uniquement
- Login par formulaire JSON → cookie de session Symfony
- Toutes les pages `/dashboard`, `/recherche`, `/matching`, `/sessions` sont protégées par `ProtectedRoute`

### Gestion des compétences
Chaque utilisateur a trois listes de compétences :

| Liste | Description |
|-------|-------------|
| `skills` | Compétences générales (profil) |
| `teachSkills` | Ce que l'utilisateur peut enseigner |
| `learnSkills` | Ce que l'utilisateur souhaite apprendre |

Les compétences sont des entités `Skill` créées à la volée si elles n'existent pas encore.

### Algorithme de matching
- **Matching général** : 25 points par compétence commune entre deux utilisateurs
- **Matching enseignement** : mes `teachSkills` ∩ `learnSkills` d'un autre utilisateur
- **Matching apprentissage** : `teachSkills` d'un autre utilisateur ∩ mes `learnSkills`

### Sessions
- Toute personne connectée peut créer une session (titre, date, durée, lieu, capacité)
- L'**organisateur** peut inviter des utilisateurs par email et supprimer la session
- Les autres utilisateurs peuvent rejoindre (si capacité disponible) ou quitter
- Les invitations sont acceptées/refusées depuis la page `/sessions`

---

## 8. Flux utilisateur

### Nouveau venu

```
/inscription → saisir prénom, nom, email @etu-digitalschool.paris, mot de passe
    ↓
/dashboard → ajouter ses compétences (teaches / learns)
    ↓
/matching → découvrir les profils compatibles
    ↓
/sessions → créer ou rejoindre une session
```

### Utilisateur existant

```
/connexion → email + mot de passe
    ↓
/dashboard → voir ses métriques et ses prochaines sessions
    ↓
/recherche → chercher un utilisateur par compétence
    ↓
/sessions → gérer ses sessions et invitations
```

---

## 9. Conventions de code

### Backend (Symfony)

- **Controllers** : retournent du JSON via `$this->json([...])` avec code HTTP explicite
- **Sécurité** : `$this->getUser()` pour récupérer l'utilisateur connecté, `denyAccessUnlessGranted` si besoin
- **Entités** : getters/setters générés par Doctrine, relations annotées en attributs PHP 8
- **Migrations** : toujours générer via `php bin/console doctrine:migrations:diff` puis migrer

### Frontend (React)

- **Auth** : toutes les requêtes API utilisent `credentials: 'include'` pour envoyer le cookie de session
- **Protection des routes** : envelopper les routes sensibles dans `<ProtectedRoute>`
- **Thème** : basculer dark/light via la classe sur `<body>` et les variables CSS `--text`, `--surface`, etc.
- **État local** : `useState` + `useEffect` pour les appels API — pas de store global (pas de Redux/Zustand)
- **Pas de librairie de composants** : tout est en CSS natif, rester cohérent avec les variables existantes

---

## 10. Points d'attention

### Restriction d'email
L'inscription valide que l'adresse se termine par `@etu-digitalschool.paris`. Pour tester en local, utiliser une adresse de ce domaine ou commenter temporairement la validation dans `AuthController.php`.

### CORS
Le backend Symfony doit autoriser les requêtes depuis `http://localhost:5173`. Vérifier `config/packages/nelmio_cors.yaml` (ou équivalent) si des erreurs CORS apparaissent.

### Données de démo
Les endpoints `/api/search` et `/api/matches` ont des **données mockées en fallback** si la base est vide — comportement normal en développement.

### Sessions Symfony ≠ Sessions SkillSwap
Le mot "session" désigne deux choses différentes dans ce projet :
- **Session Symfony** : le cookie d'authentification HTTP
- **Session SkillSwap** : un atelier ou tutorat créé par un utilisateur (entité `Session`)

### Cache Symfony
En cas de comportement inattendu après modification de config, vider le cache :
```bash
php bin/console cache:clear
```

---

## Contacts & ressources

| Ressource | Lien |
|-----------|------|
| Symfony docs | https://symfony.com/doc/6.4 |
| React docs | https://react.dev |
| Doctrine docs | https://www.doctrine-project.org/projects/orm.html |
| React Router | https://reactrouter.com/en/main |

---

*Dernière mise à jour : juin 2026*
