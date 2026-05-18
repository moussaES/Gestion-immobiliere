# 📡 Documentation API - Étoiles du Sine

## Vue d'ensemble

L'API RESTful de Étoiles du Sine est accessible via le préfixe `/api`.

**URL de base:** `http://localhost:8000/api`

**Format de réponse:** JSON

---

## 📋 Table des matières

- [Structure des réponses](#structure-des-réponses)
- [Utilisateurs](#utilisateurs)
- [Propriétaires](#propriétaires)
- [Locataires](#locataires)
- [Biens](#biens)
- [Contrats](#contrats)
- [Paiements](#paiements)
- [Historique & Audit](#historique--audit)
- [Codes d'erreur](#codes-derreur)

---

## 🔧 Structure des réponses

Toutes les réponses suivent ce format:

**Succès (200):**
```json
{
  "success": true,
  "data": { /* données */ },
  "message": "Description du succès"
}
```

**Erreur (4xx/5xx):**
```json
{
  "success": false,
  "message": "Description de l'erreur",
  "errors": { /* détails des erreurs de validation */ }
}
```

---

## 👥 Utilisateurs

### GET /api/utilisateurs
**Description:** Récupérer tous les utilisateurs

```bash
curl -X GET "http://localhost:8000/api/utilisateurs"
```

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id_user": 1,
      "nom": "Seck",
      "prenom": "Moustapha",
      "email": "moustapha@etoiles.com",
      "role": "GESTIONNAIRE",
      "statut": "ACTIF",
      "date_creation": "2024-05-13T10:00:00",
      "date_modification": "2024-05-13T10:00:00"
    }
  ],
  "message": "Liste des utilisateurs récupérée avec succès"
}
```

### GET /api/utilisateurs/{id}
**Description:** Récupérer un utilisateur spécifique

```bash
curl -X GET "http://localhost:8000/api/utilisateurs/1"
```

### POST /api/utilisateurs
**Description:** Créer un nouvel utilisateur

```bash
curl -X POST "http://localhost:8000/api/utilisateurs" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Diallo",
    "prenom": "Amadou",
    "email": "amadou@etoiles.com",
    "password": "SecurePassword123",
    "role": "GESTIONNAIRE",
    "statut": "ACTIF"
  }'
```

### PUT /api/utilisateurs/{id}
**Description:** Mettre à jour un utilisateur

```bash
curl -X PUT "http://localhost:8000/api/utilisateurs/1" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Seck",
    "prenom": "Moustapha",
    "statut": "ACTIF"
  }'
```

### DELETE /api/utilisateurs/{id}
**Description:** Supprimer un utilisateur

```bash
curl -X DELETE "http://localhost:8000/api/utilisateurs/1"
```

### GET /api/utilisateurs/by-role/{role}
**Description:** Récupérer les utilisateurs par rôle

```bash
curl -X GET "http://localhost:8000/api/utilisateurs/by-role/GESTIONNAIRE"
```

**Rôles valides:** `ADMIN`, `GESTIONNAIRE`, `COMPTABLE`

---

## 🏠 Propriétaires

### GET /api/proprietaires
**Description:** Récupérer tous les propriétaires

```bash
curl -X GET "http://localhost:8000/api/proprietaires"
```

### POST /api/proprietaires
**Description:** Créer un nouveau propriétaire

```bash
curl -X POST "http://localhost:8000/api/proprietaires" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Diop",
    "prenom": "Cheikh",
    "telephone": "+221771234567",
    "email": "cheikh.diop@email.com",
    "adresse": "100 Rue de Ngor, Dakar",
    "cni": "1234567890123"
  }'
```

### GET /api/proprietaires/{id}/biens
**Description:** Récupérer les biens d'un propriétaire

```bash
curl -X GET "http://localhost:8000/api/proprietaires/1/biens"
```

### GET /api/proprietaires/{id}/contrats
**Description:** Récupérer les contrats d'un propriétaire

```bash
curl -X GET "http://localhost:8000/api/proprietaires/1/contrats"
```

---

## 🧑‍🏢 Locataires

### GET /api/locataires
**Description:** Récupérer tous les locataires

```bash
curl -X GET "http://localhost:8000/api/locataires"
```

### POST /api/locataires
**Description:** Créer un nouveau locataire

```bash
curl -X POST "http://localhost:8000/api/locataires" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Ndao",
    "prenom": "Aminata",
    "telephone": "+221776667788",
    "email": "aminata.ndao@email.com",
    "profession": "Ingénieur",
    "adresse": "123 Avenue Cheikh Anta Diop, Dakar",
    "cni": "2468013579135"
  }'
```

### GET /api/locataires/by-profession/{profession}
**Description:** Récupérer les locataires par profession

```bash
curl -X GET "http://localhost:8000/api/locataires/by-profession/Ingénieur"
```

---

## 🏢 Biens

### GET /api/biens
**Description:** Récupérer tous les biens

```bash
curl -X GET "http://localhost:8000/api/biens"
```

### POST /api/biens
**Description:** Créer un nouveau bien

```bash
curl -X POST "http://localhost:8000/api/biens" \
  -H "Content-Type: application/json" \
  -d '{
    "reference": "BIEN-001",
    "type": "APPARTEMENT",
    "adresse": "123 Avenue Cheikh Anta Diop",
    "ville": "Dakar",
    "code_postal": "18000",
    "surface": 85.00,
    "nombre_pieces": 3,
    "loyer_mensuel": 250000.00,
    "statut": "LIBRE",
    "description": "Bel appartement moderne",
    "id_proprietaire": 1
  }'
```

**Types valides:** `MAISON`, `APPARTEMENT`, `IMMEUBLE`, `TERRAIN`

**Statuts valides:** `OCCUPE`, `LIBRE`, `RESERVE`

### GET /api/biens/by-statut/{statut}
**Description:** Récupérer les biens par statut

```bash
curl -X GET "http://localhost:8000/api/biens/by-statut/LIBRE"
```

### GET /api/biens/by-type/{type}
**Description:** Récupérer les biens par type

```bash
curl -X GET "http://localhost:8000/api/biens/by-type/APPARTEMENT"
```

### GET /api/biens/by-ville/{ville}
**Description:** Récupérer les biens par ville

```bash
curl -X GET "http://localhost:8000/api/biens/by-ville/Dakar"
```

### GET /api/biens/{id}/contrats
**Description:** Récupérer les contrats associés à un bien

```bash
curl -X GET "http://localhost:8000/api/biens/1/contrats"
```

---

## 📜 Contrats

### GET /api/contrats
**Description:** Récupérer tous les contrats

```bash
curl -X GET "http://localhost:8000/api/contrats"
```

### POST /api/contrats
**Description:** Créer un nouveau contrat

```bash
curl -X POST "http://localhost:8000/api/contrats" \
  -H "Content-Type: application/json" \
  -d '{
    "reference": "CONT-2024-001",
    "type_contrat": "LOCATAIRE",
    "date_debut": "2024-01-01",
    "date_fin": "2025-12-31",
    "montant": 250000.00,
    "statut": "ACTIF",
    "id_bien": 1,
    "id_proprietaire": 1,
    "id_locataire": 1,
    "id_user_createur": 1,
    "notes": "Contrat de location"
  }'
```

### GET /api/contrats/actifs
**Description:** Récupérer tous les contrats actifs

```bash
curl -X GET "http://localhost:8000/api/contrats/actifs"
```

### GET /api/contrats/en-cours
**Description:** Récupérer les contrats en cours (date valide)

```bash
curl -X GET "http://localhost:8000/api/contrats/en-cours"
```

### GET /api/contrats/by-type/{type}
**Description:** Récupérer les contrats par type

```bash
curl -X GET "http://localhost:8000/api/contrats/by-type/LOCATAIRE"
```

### GET /api/contrats/{id}/paiements
**Description:** Récupérer les paiements d'un contrat

```bash
curl -X GET "http://localhost:8000/api/contrats/1/paiements"
```

---

## 💰 Paiements

### GET /api/paiements
**Description:** Récupérer tous les paiements

```bash
curl -X GET "http://localhost:8000/api/paiements"
```

### POST /api/paiements
**Description:** Enregistrer un nouveau paiement

```bash
curl -X POST "http://localhost:8000/api/paiements" \
  -H "Content-Type: application/json" \
  -d '{
    "reference": "PAI-2024-001",
    "date_paiement": "2024-05-01",
    "montant": 250000.00,
    "mode_paiement": "VIREMENT",
    "statut": "PAYE",
    "id_contrat": 1,
    "id_user_enregistrement": 1,
    "notes": "Loyer mai 2024"
  }'
```

**Modes de paiement valides:** `CHEQUE`, `VIREMENT`, `ESPECES`, `WAVE`, `ORANGE_MONEY`

**Statuts valides:** `PAYE`, `PARTIEL`, `EN_ATTENTE`

### GET /api/paiements/payes
**Description:** Récupérer les paiements payés

```bash
curl -X GET "http://localhost:8000/api/paiements/payes"
```

### GET /api/paiements/en-attente
**Description:** Récupérer les paiements en attente

```bash
curl -X GET "http://localhost:8000/api/paiements/en-attente"
```

### GET /api/paiements/by-mode/{mode}
**Description:** Récupérer les paiements par mode

```bash
curl -X GET "http://localhost:8000/api/paiements/by-mode/VIREMENT"
```

### GET /api/paiements/by-mois/{mois}
**Description:** Récupérer les paiements d'un mois spécifique

```bash
curl -X GET "http://localhost:8000/api/paiements/by-mois/5"
```

### GET /api/paiements/statistiques
**Description:** Récupérer les statistiques de paiements

```bash
curl -X GET "http://localhost:8000/api/paiements/statistiques"
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "total_paiements": 1250000.00,
    "nombre_paiements": 5,
    "paiements_payes": 1000000.00,
    "paiements_en_attente": 250000.00,
    "paiements_partiels": 0.00
  },
  "message": "Statistiques des paiements récupérées"
}
```

---

## 📊 Historique & Audit

### GET /api/historique
**Description:** Récupérer tout l'historique (trié par date décroissante)

```bash
curl -X GET "http://localhost:8000/api/historique"
```

### GET /api/historique/by-user/{id_user}
**Description:** Récupérer l'historique d'un utilisateur

```bash
curl -X GET "http://localhost:8000/api/historique/by-user/1"
```

### GET /api/historique/by-type/{type}
**Description:** Récupérer l'historique par type d'opération

```bash
curl -X GET "http://localhost:8000/api/historique/by-type/INSERT"
```

**Types valides:** `INSERT`, `UPDATE`, `DELETE`

### GET /api/historique/by-entite/{entite}
**Description:** Récupérer l'historique par entité

```bash
curl -X GET "http://localhost:8000/api/historique/by-entite/CONTRAT"
```

### GET /api/historique/recent/{jours?}
**Description:** Récupérer l'historique des N derniers jours (défaut: 7)

```bash
curl -X GET "http://localhost:8000/api/historique/recent/30"
```

### GET /api/historique/statistiques
**Description:** Récupérer les statistiques d'audit

```bash
curl -X GET "http://localhost:8000/api/historique/statistiques"
```

### DELETE /api/historique/cleanup/{jours?}
**Description:** Nettoyer l'historique de plus de N jours (défaut: 90)

```bash
curl -X DELETE "http://localhost:8000/api/historique/cleanup/90"
```

---

## 🏥 Health Check

### GET /health
**Description:** Vérifier l'état de l'API

```bash
curl -X GET "http://localhost:8000/health"
```

**Réponse:**
```json
{
  "status": "ok",
  "message": "Étoiles du Sine API - Operational",
  "timestamp": "2024-05-14T10:30:00"
}
```

---

## ⚠️ Codes d'erreur

| Code | Description |
|------|-------------|
| **200** | Succès |
| **201** | Créé avec succès |
| **400** | Mauvaise requête |
| **404** | Ressource non trouvée |
| **422** | Erreur de validation |
| **500** | Erreur serveur |

---

## 🧪 Tester avec Postman

1. **Importer la collection:** Utilisez le fichier `postman-collection.json`
2. **Configurer l'environnement:** `http://localhost:8000`
3. **Exécuter les requêtes:** Testez chaque endpoint

---

## 📝 Exemples complets

### Exemple 1: Créer un bien et son contrat

**1. Créer un bien:**
```bash
curl -X POST "http://localhost:8000/api/biens" \
  -H "Content-Type: application/json" \
  -d '{
    "reference": "BIEN-NEW-001",
    "type": "APPARTEMENT",
    "adresse": "456 Rue Test",
    "ville": "Dakar",
    "loyer_mensuel": 300000.00,
    "id_proprietaire": 1
  }'
```

**2. Créer un contrat pour ce bien:**
```bash
curl -X POST "http://localhost:8000/api/contrats" \
  -H "Content-Type: application/json" \
  -d '{
    "reference": "CONT-NEW-001",
    "type_contrat": "LOCATAIRE",
    "date_debut": "2024-06-01",
    "date_fin": "2025-05-31",
    "montant": 300000.00,
    "id_bien": 1,
    "id_proprietaire": 1,
    "id_locataire": 1,
    "id_user_createur": 1
  }'
```

**3. Enregistrer un paiement:**
```bash
curl -X POST "http://localhost:8000/api/paiements" \
  -H "Content-Type: application/json" \
  -d '{
    "reference": "PAI-NEW-001",
    "date_paiement": "2024-06-01",
    "montant": 300000.00,
    "mode_paiement": "VIREMENT",
    "statut": "PAYE",
    "id_contrat": 1,
    "id_user_enregistrement": 1
  }'
```

---

## 🚀 Démarrage rapide

```bash
# 1. Vérifier l'API
curl http://localhost:8000/health

# 2. Créer un utilisateur
curl -X POST http://localhost:8000/api/utilisateurs \
  -H "Content-Type: application/json" \
  -d '{"nom":"Test","prenom":"User","email":"test@email.com","password":"password123","role":"GESTIONNAIRE","statut":"ACTIF"}'

# 3. Récupérer les utilisateurs
curl http://localhost:8000/api/utilisateurs

# 4. Récupérer les statistiques de paiements
curl http://localhost:8000/api/paiements/statistiques
```

---

**Version:** 1.0  
**Dernière mise à jour:** 2024-05-14  
**Auteur:** Équipe Étoiles du Sine
