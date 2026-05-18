# Gestion Immobilière - Étoiles du Sine

Système complet de gestion immobilière pour la gestion des propriétés, contrats, locataires et paiements.

## 📋 Table des matières
- [Installation](#installation)
- [Configuration](#configuration)
- [Gestion de la Base de Données](#gestion-de-la-base-de-données)
- [Structure du Projet](#structure-du-projet)
- [Tables de la Base de Données](#tables-de-la-base-de-données)

---

## Installation

### Prérequis
- PHP 8.2+
- MySQL 8.0+
- Composer
- Node.js & npm
- XAMPP (recommandé sur Windows)

### Étapes d'installation

```bash
# 1. Cloner le projet
git clone <repo-url>
cd backend-immobilier

# 2. Installer les dépendances PHP
composer install

# 3. Créer le fichier .env
cp .env.example .env

# 4. Générer la clé d'application
php artisan key:generate

# 5. Configurer la base de données dans .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=etoiles_du_sine
# DB_USERNAME=root
# DB_PASSWORD=

# 6. Exécuter les migrations
php artisan migrate

# 7. (Optionnel) Seeder les données de test
php artisan db:seed

# 8. Démarrer le serveur
php artisan serve
```

---

## Configuration

### Variables d'environnement (.env)
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=etoiles_du_sine
DB_USERNAME=root
DB_PASSWORD=

APP_NAME="Gestion Immobilière"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
```

---

## 🗄️ Gestion de la Base de Données

### Script `db-manager.bat` (Windows)

Ce script facilite la gestion complète de votre base de données. Il automatise les tâches courantes comme la sauvegarde, la restauration et le nettoyage.

#### Utilisation générale
```batch
db-manager.bat [COMMANDE] [OPTIONS]
```

---

### 📦 Commande: `backup`

**Description:** Crée une sauvegarde complète de la base de données.

**Syntaxe:**
```batch
db-manager.bat backup
```

**Résultat:**
- Crée un fichier SQL dans le dossier `backups/`
- Nommage: `etoiles_du_sine_YYYYMMDD_HHMMSS.sql`
- Sauvegarde les tables, triggers, procédures stockées, etc.

**Exemple:**
```batch
C:\path\to\project> db-manager.bat backup
[*] Sauvegarde de la base de données...
    Fichier: backups\etoiles_du_sine_20240513_101530.sql
    Connexion à MySQL en cours...
[✓] Sauvegarde créée avec succès
    Fichier: backups\etoiles_du_sine_20240513_101530.sql
    Taille: 5.23 MB
```

**Bon à savoir:**
- La sauvegarde inclut toute la structure et les données
- Le fichier est créé dans le dossier `backups/` (créé automatiquement)
- Vous pouvez faire des sauvegardes quotidiennes sans risque

---

### 📥 Commande: `restore`

**Description:** Restaure la base de données à partir d'une sauvegarde existante.

**Syntaxe:**
```batch
db-manager.bat restore [FICHIER]
```

**Paramètres:**
- `[FICHIER]` - Chemin vers le fichier de sauvegarde SQL

**Exemple:**
```batch
db-manager.bat restore backups\etoiles_du_sine_20240513_101530.sql
```

**Processus:**
1. Vous recevez une confirmation pour éviter les accidents
2. Tapez `oui` pour confirmer la restauration
3. Les données sont restaurées à partir du fichier

**Avertissement:**
⚠️ Cette opération **remplace complètement** les données actuelles de la base !

**Exemple complet:**
```batch
C:\path\to\project> db-manager.bat restore backups\etoiles_du_sine_20240513_101530.sql
[⚠]  Attention! Ceci va remplacer la base de données actuelle.
Êtes-vous sûr? (oui/non): oui
[*] Restauration de la base de données...
    À partir de: backups\etoiles_du_sine_20240513_101530.sql
[✓] Base de données restaurée avec succès
```

---

### 📋 Commande: `list`

**Description:** Liste toutes les sauvegardes disponibles.

**Syntaxe:**
```batch
db-manager.bat list
```

**Résultat:**
Affiche tous les fichiers SQL dans le dossier `backups/` avec leur taille.

**Exemple:**
```batch
C:\path\to\project> db-manager.bat list
[*] Sauvegardes disponibles:

    etoiles_du_sine_20240510_153000.sql (3.45 MB)
    etoiles_du_sine_20240511_090530.sql (4.12 MB)
    etoiles_du_sine_20240512_101530.sql (5.23 MB)
    etoiles_du_sine_20240513_101530.sql (5.30 MB)

Total: 4 fichier(s)
```

---

### ℹ️ Commande: `status`

**Description:** Affiche le statut complet de la base de données.

**Syntaxe:**
```batch
db-manager.bat status
```

**Informations affichées:**
- Connexion MySQL : Vérifiée ✓
- Nom de la base de données
- Liste de toutes les tables et le nombre d'enregistrements
- Taille totale occupée par la base

**Exemple:**
```batch
C:\path\to\project> db-manager.bat status
[*] Statut de la base de données:

[✓] MySQL connecté
    Base de données: etoiles_du_sine
    
    Tables:
    biens
    contrats
    historique_operations
    locataires
    paiements
    proprietaires
    utilisateurs
    
    Taille:
    Taille (MB)
    12.45
```

---

### 🔄 Commande: `reset`

**Description:** Réinitialise complètement la base de données (suppression + recréation).

**Syntaxe:**
```batch
db-manager.bat reset
```

**⚠️ DANGER - OPÉRATION IRRÉVERSIBLE**

**Processus:**
1. Crée automatiquement une sauvegarde de sécurité
2. Supprime complètement la base de données
3. Recrée la base avec le schéma initial

**Exemple:**
```batch
C:\path\to\project> db-manager.bat reset
[⚠⚠⚠] ATTENTION! OPÉRATION DANGEREUSE [⚠⚠⚠]
Ceci va SUPPRIMER COMPLÈTEMENT la base de données actuelle!

Tapez 'CONFIRMER' pour continuer: CONFIRMER
[*] Création d'une sauvegarde de sécurité...
[*] Suppression de la base de données...
[✓] Base de données réinitialisée avec succès
```

**À utiliser quand:**
- Vous voulez recommencer à zéro en développement
- Vous avez besoin de réinitialiser les données de test

---

### 🧹 Commande: `clean`

**Description:** Supprime les sauvegardes de plus de 30 jours.

**Syntaxe:**
```batch
db-manager.bat clean
```

**Comportement:**
- Scanne le dossier `backups/`
- Supprime les fichiers SQL datant de plus de 30 jours
- Garder l'espace disque propre

**Exemple:**
```batch
C:\path\to\project> db-manager.bat clean
[*] Nettoyage des sauvegardes...

Actuellement, seule la suppression manuelle est disponible sur Windows.
Veuillez supprimer manuellement les fichiers du dossier: backups
```

**Note:** Sur Windows, vous pouvez supprimer manuellement les fichiers du dossier `backups/`.

---

### ❓ Commande: `help`

**Description:** Affiche l'aide complète avec toutes les commandes disponibles.

**Syntaxe:**
```batch
db-manager.bat help
```

**Affiche:**
```
========================================================================
   Étoiles du Sine - Gestion de la Base de Données (Windows)
========================================================================

Usage: db-manager.bat [COMMANDE] [OPTIONS]

Commandes:
  backup           - Créer une sauvegarde de la base de données
  restore FICHIER  - Restaurer une base de données à partir d'une sauvegarde
  list             - Lister toutes les sauvegardes disponibles
  status           - Vérifier le statut de la base de données
  reset            - Réinitialiser la base de données (DANGER!)
  clean            - Supprimer les anciennes sauvegardes (> 30 jours)
  help             - Afficher cette aide
```

---

## 🗂️ Structure du Projet

```
backend-immobilier/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   └── Models/
│       ├── Utilisateur.php
│       ├── Proprietaire.php
│       ├── Locataire.php
│       ├── Bien.php
│       ├── Contrat.php
│       ├── Paiement.php
│       └── HistoriqueOperation.php
├── database/
│   ├── migrations/
│   ├── factories/
│   └── seeders/
├── routes/
├── resources/
├── db-manager.bat          ← Script de gestion BD
├── db-manager.sh           ← Script Linux/Mac (optionnel)
└── README.md               ← Ce fichier
```

---

## 📊 Tables de la Base de Données

### 1. **utilisateurs**
Gestion des utilisateurs du système (Admin, Gestionnaire, Comptable)
- Identifiants: `id_user`, `email`
- Colonnes: `nom`, `prenom`, `email`, `password`, `role`, `statut`

### 2. **proprietaires**
Profils des propriétaires de biens
- Clé primaire: `id_proprietaire`
- Colonnes: `nom`, `prenom`, `telephone`, `email`, `adresse`, `cni`

### 3. **locataires**
Profils des locataires
- Clé primaire: `id_locataire`
- Colonnes: `nom`, `prenom`, `telephone`, `email`, `profession`, `adresse`, `cni`

### 4. **biens**
Propriétés immobilières
- Clé primaire: `id_bien`
- Colonnes: `reference`, `type`, `adresse`, `ville`, `loyer_mensuel`, `statut`
- Relation: Liens vers `proprietaires`

### 5. **contrats**
Contrats de location/propriété
- Clé primaire: `id_contrat`
- Colonnes: `reference`, `type_contrat`, `date_debut`, `date_fin`, `montant`, `statut`
- Relations: Liens vers `biens`, `proprietaires`, `locataires`, `utilisateurs`

### 6. **paiements**
Historique des paiements
- Clé primaire: `id_paiement`
- Colonnes: `reference`, `date_paiement`, `montant`, `mode_paiement`, `statut`
- Relation: Lien vers `contrats`

### 7. **historique_operations**
Audit des opérations (qui a fait quoi et quand)
- Clé primaire: `id_historique`
- Colonnes: `type_operation`, `entite`, `description`, `ancienne_valeur`, `nouvelle_valeur`
- Relation: Lien vers `utilisateurs`

---

## 🚀 Démarrage Rapide

```bash
# 1. Vérifier le statut
db-manager.bat status

# 2. Créer une sauvegarde
db-manager.bat backup

# 3. Exécuter les migrations
php artisan migrate

# 4. Démarrer le serveur
php artisan serve

# 5. Accéder à l'application
# http://localhost:8000
```

---

## 📝 Notes Importantes

- **Toujours faire une sauvegarde** avant d'effectuer des opérations majeures
- Les fichiers de sauvegarde sont stockés dans le dossier `backups/`
- Le script utilise le chemin par défaut: `C:\xampp\mysql\bin`
- Pour modifier le chemin MySQL, éditez la ligne dans `db-manager.bat`:
  ```batch
  set MYSQL_PATH=C:\xampp\mysql\bin
  ```

---

## 📞 Support

Pour toute question ou problème, consultez la documentation ou contactez l'équipe de développement.