# Backend (Symfony API) — instructions

Ce dossier contient un scaffold minimal pour une API Symfony configurée avec SQLite et authentification par session.

Étapes pour démarrer localement :

1. Installer les dépendances Composer :

```bash
cd backend
composer install
```

2. Créer la base SQLite et exécuter les migrations (Doctrine) :

```bash
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

3. Démarrer le serveur Symfony :

```bash
symfony server:start
```

Les endpoints API sont préfixés par `/api`. L'authentification utilise les sessions (Cookie HttpOnly).

Fixtures:

1. Installer `doctrine/doctrine-fixtures-bundle` si nécessaire :

```bash
composer require --dev doctrine/doctrine-fixtures-bundle
```

2. Charger les fixtures :

```bash
php bin/console doctrine:fixtures:load
```

Cela créera des utilisateurs de test, un skill, une session et quelques matchs d'exemple.
