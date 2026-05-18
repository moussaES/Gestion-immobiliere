# 🚀 Guide de Démarrage - API Étoiles du Sine

## ✅ Prérequis

- PHP 8.2+
- Laravel 11
- MySQL 8.0+
- XAMPP ou serveur web local

---

## 📋 Étapes de Démarrage

### 1️⃣ Configuration Initiale

```bash
# Naviguer au dossier du projet
cd C:\xampp\htdocs\Gestion-immobiliere\backend-immobilier

# Installer les dépendances PHP
composer install

# Copier le fichier .env
copy .env.example .env

# Générer la clé d'application
php artisan key:generate
```

### 2️⃣ Configuration de la Base de Données

**Éditer le fichier `.env`:**
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=etoiles_du_sine
DB_USERNAME=root
DB_PASSWORD=
```

### 3️⃣ Créer et Remplir la Base de Données

```bash
# Exécuter les migrations
php artisan migrate

# (Optionnel) Ajouter les données de test
php artisan db:seed
```

### 4️⃣ Vérifier le Backup Existant

```bash
# Afficher le statut de la BD
db-manager.bat status

# Lister les sauvegardes
db-manager.bat list
```

### 5️⃣ Démarrer le Serveur Laravel

```bash
# Démarrer le serveur de développement
php artisan serve

# Le serveur démarre sur http://localhost:8000
```

---

## 🧪 Tester l'API

### Option 1️⃣ : Avec cURL (Terminal/CMD)

**Vérifier l'état de l'API:**
```bash
curl http://localhost:8000/health
```

**Récupérer tous les utilisateurs:**
```bash
curl http://localhost:8000/api/utilisateurs
```

**Créer un utilisateur:**
```bash
curl -X POST http://localhost:8000/api/utilisateurs ^
  -H "Content-Type: application/json" ^
  -d "{\"nom\":\"Seck\",\"prenom\":\"Moustapha\",\"email\":\"moustapha@etoiles.com\",\"password\":\"SecurePassword123\",\"role\":\"GESTIONNAIRE\",\"statut\":\"ACTIF\"}"
```

### Option 2️⃣ : Avec Postman 📮

**1. Importer la collection:**
- Ouvrir Postman
- Cliquer sur **Import**
- Sélectionner le fichier `postman-collection.json`
- Collection automatiquement importée ✓

**2. Configurer l'environnement:**
- Variable `base_url`: `http://localhost:8000`
- Sauvegarder l'environnement

**3. Tester les endpoints:**
- Naviguer dans les dossiers de la collection
- Cliquer sur un endpoint
- Modifier les paramètres si nécessaire
- Cliquer sur **Send**

### Option 3️⃣ : Avec PowerShell

**Script PowerShell pour tester rapidement:**

```powershell
$baseUrl = "http://localhost:8000"

# 1. Health Check
Write-Host "1. Vérification de l'API..."
Invoke-RestMethod -Uri "$baseUrl/health" | ConvertTo-Json

# 2. Récupérer tous les utilisateurs
Write-Host "2. Récupération des utilisateurs..."
Invoke-RestMethod -Uri "$baseUrl/api/utilisateurs" | ConvertTo-Json

# 3. Récupérer les statistiques de paiements
Write-Host "3. Statistiques de paiements..."
Invoke-RestMethod -Uri "$baseUrl/api/paiements/statistiques" | ConvertTo-Json

# 4. Récupérer les contrats actifs
Write-Host "4. Contrats actifs..."
Invoke-RestMethod -Uri "$baseUrl/api/contrats/actifs" | ConvertTo-Json
```

---

## 📊 Endpoints Populaires à Tester

### 🏥 Vérification de Base
```
GET http://localhost:8000/health
```

### 👥 Utilisateurs
```
GET    http://localhost:8000/api/utilisateurs
POST   http://localhost:8000/api/utilisateurs
GET    http://localhost:8000/api/utilisateurs/1
PUT    http://localhost:8000/api/utilisateurs/1
DELETE http://localhost:8000/api/utilisateurs/1
```

### 💰 Paiements
```
GET    http://localhost:8000/api/paiements
GET    http://localhost:8000/api/paiements/payes
GET    http://localhost:8000/api/paiements/en-attente
GET    http://localhost:8000/api/paiements/statistiques
```

### 📜 Contrats
```
GET    http://localhost:8000/api/contrats
GET    http://localhost:8000/api/contrats/actifs
GET    http://localhost:8000/api/contrats/en-cours
```

### 🏠 Biens
```
GET    http://localhost:8000/api/biens
GET    http://localhost:8000/api/biens/by-statut/LIBRE
GET    http://localhost:8000/api/biens/by-ville/Dakar
```

---

## 🐛 Dépannage

### Erreur: "Class 'App\Http\Controllers\UtilisateurController' not found"

**Solution:**
```bash
# Vérifier que les contrôleurs existent
dir app\Http\Controllers\

# Si manquants, créer les fichiers
php artisan make:controller UtilisateurController
```

### Erreur: "Route not found"

**Solution:**
```bash
# Vérifier que le fichier routes/api.php existe
type routes\api.php

# Lister toutes les routes
php artisan route:list
```

### Erreur: "Class 'App\Models\Utilisateur' not found"

**Solution:**
```bash
# Vérifier que les modèles existent
dir app\Models\

# Exécuter les migrations
php artisan migrate
```

### La base de données n'existe pas

**Solution:**
```bash
# Créer la base de données manuellement avec PHPMyAdmin
# OU utiliser le script db-manager.bat

db-manager.bat status
```

---

## 📝 Commandes Utiles

```bash
# Lister toutes les routes
php artisan route:list

# Afficher les routes API uniquement
php artisan route:list --path=api

# Rafraîchir les routes
php artisan route:cache
php artisan route:clear

# Vérifier les migrations
php artisan migrate:status

# Rollback les migrations
php artisan migrate:rollback

# Vérifier la syntaxe PHP
php -l app/Models/Utilisateur.php

# Vérifier l'état de l'application
php artisan tinker
```

---

## ✨ Exemple Complet: Workflow Complet

**Créer un bien avec contrat et paiement:**

```bash
# 1. Créer un propriétaire
curl -X POST http://localhost:8000/api/proprietaires ^
  -H "Content-Type: application/json" ^
  -d "{\"nom\":\"Diop\",\"prenom\":\"Cheikh\",\"telephone\":\"+221771234567\",\"email\":\"cheikh@email.com\",\"adresse\":\"Dakar\",\"cni\":\"123456\"}"

# 2. Créer un bien
curl -X POST http://localhost:8000/api/biens ^
  -H "Content-Type: application/json" ^
  -d "{\"reference\":\"BIEN-001\",\"type\":\"APPARTEMENT\",\"adresse\":\"123 Rue Test\",\"ville\":\"Dakar\",\"loyer_mensuel\":250000,\"id_proprietaire\":1}"

# 3. Créer un locataire
curl -X POST http://localhost:8000/api/locataires ^
  -H "Content-Type: application/json" ^
  -d "{\"nom\":\"Ndao\",\"prenom\":\"Aminata\",\"telephone\":\"+221776667788\",\"email\":\"aminata@email.com\",\"profession\":\"Ingénieur\",\"adresse\":\"Dakar\"}"

# 4. Créer un contrat
curl -X POST http://localhost:8000/api/contrats ^
  -H "Content-Type: application/json" ^
  -d "{\"reference\":\"CONT-001\",\"type_contrat\":\"LOCATAIRE\",\"date_debut\":\"2024-01-01\",\"date_fin\":\"2025-12-31\",\"montant\":250000,\"id_bien\":1,\"id_proprietaire\":1,\"id_locataire\":1,\"id_user_createur\":1}"

# 5. Enregistrer un paiement
curl -X POST http://localhost:8000/api/paiements ^
  -H "Content-Type: application/json" ^
  -d "{\"reference\":\"PAI-001\",\"date_paiement\":\"2024-05-01\",\"montant\":250000,\"mode_paiement\":\"VIREMENT\",\"statut\":\"PAYE\",\"id_contrat\":1,\"id_user_enregistrement\":1}"

# 6. Vérifier les statistiques
curl http://localhost:8000/api/paiements/statistiques
```

---

## 🎯 Prochaines Étapes

1. ✅ API routes créées et testées
2. ⏭️ Authentification JWT (optionnel)
3. ⏭️ Middleware de validation
4. ⏭️ Tests unitaires
5. ⏭️ Déploiement en production

---

## 📞 Support

Pour toute question, consultez:
- 📖 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- 📚 [README.md](./README.md)
- 🔧 [db-manager.bat](./db-manager.bat)

---

**Status:** ✅ Prêt pour la production  
**Version:** 1.0  
**Date:** 2024-05-14
