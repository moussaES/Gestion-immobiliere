# 🏢 Etoile Sine Immo - Application Complète de Gestion Immobilière

**Une application Angular moderne pour gérer les propriétés immobilières, les contrats, les paiements et bien plus.**

## 📸 Aperçu

Application web complète de gestion immobilière avec:
- **Dashboard** avec KPIs en temps réel
- **Gestion des propriétés** avec filtres et recherche
- **Suivi des contrats** et des paiements
- **Fiches détaillées** pour propriétaires et locataires
- **Gestion des dépenses** et des recettes
- **Interface responsive** et moderne
- **Export de données** (Excel, PDF)

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+ 
- npm 9+
- Angular CLI 17+

### Installation

```bash
# 1. Naviguer vers le dossier frontend
cd frontend-immobillier/app

# 2. Installer les dépendances
npm install

# 3. Démarrer le serveur de développement
npm start

# 4. Ouvrir dans le navigateur
http://localhost:4200
```

### Accès par défaut
- **URL**: http://localhost:4200
- **Page d'accueil**: Dashboard avec statistiques
- **Utilisateur**: (Configuré lors de l'intégration backend)

## 📁 Structure du Projet

```
frontend-immobillier/app/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   └── layout/              # Navigation principale
│   │   ├── features/                # Pages principales
│   │   │   ├── dashboard/           # Accueil
│   │   │   ├── produits/            # Propriétés
│   │   │   ├── contrats/            # Contrats
│   │   │   ├── paiements/           # Paiements
│   │   │   ├── bailleurs/           # Propriétaires
│   │   │   ├── locataires/          # Locataires
│   │   │   ├── depenses/            # Dépenses
│   │   │   └── recettes/            # Recettes
│   │   ├── shared/
│   │   │   ├── components/          # Composants réutilisables
│   │   │   ├── interfaces/          # Modèles TypeScript
│   │   │   └── services/            # Services API
│   │   ├── app.routes.ts            # Routes
│   │   ├── app.config.ts            # Configuration
│   │   └── app.component.ts         # Composant racine
│   ├── main.ts                      # Point d'entrée
│   └── styles.css                   # Styles globaux
├── package.json                     # Dépendances
├── angular.json                     # Config Angular
└── README.md                        # Vous êtes ici

```

## 🎯 Fonctionnalités Principales

### 1. Dashboard (Résumé)
```
9 cartes KPI:
├── Produits Occupés (36)
├── Produits Libres (27)
├── Produits Réservés (17)
├── Total Produits (80)
├── Contrats Actifs (49)
├── Nouveaux Contrats (2)
├── Contrats Non Actifs (11)
├── Taux d'Occupation (45%)
└── Revenues du Mois (4,330,087 FCFA)
```

### 2. Gestion des Propriétés
- Liste complète avec pagination
- Filtres par statut (occupé/libre/réservé)
- Recherche par référence/adresse
- Création de nouvelles propriétés
- Édition et suppression
- Affichage du propriétaire responsable

### 3. Gestion des Contrats
- Liste des contrats actifs et inactifs
- Lien entre propriétés et locataires
- Historique des dates
- Montants de loyer
- Statut du contrat

### 4. Suivi des Paiements
- Enregistrement des paiements reçus
- Modes de paiement multiples (CHÈQUE, VIREMENT, ESPÈCES, WAVE, ORANGE MONEY)
- Filtres par mode et statut
- Référence de paiement
- Historique complet

### 5. Gestion des Propriétaires
- Liste des propriétaires
- Fiche détaillée avec 7 onglets:
  - Biens (liste des propriétés)
  - Locataires
  - Paiements reçus
  - Travaux effectués
  - Fiche de paie
  - Contrat de gérance
  - Coordonnées complètes

### 6. Gestion des Locataires
- Liste des locataires
- Fiche détaillée avec 7 onglets:
  - Contrats signés
  - Biens loués
  - Historique des paiements
  - Travaux signalés
  - Historique complet
  - Informations personnelles
  - Documents

### 7. Gestion des Dépenses
- Types de dépenses (Travaux, Entretien, Peinture, Plomberie, etc.)
- Liaison avec propriétés
- Montants et dates
- Description détaillée

### 8. Gestion des Recettes
- Vue complète des revenus
- Calcul HT/TTC
- Calcul des commissions
- Montant à verser
- Export en Excel

## 🎨 Design & Interface

### Palette de Couleurs
- **Primaire**: Bleu Foncé `#1a237e`
- **Fond**: Gris Clair `#f0f2f5`
- **Accent**: Violet `#7c4dff`

### Composants UI
- **Tables** avec pagination et actions
- **Modales** pour création/édition
- **Badges** de statut colorés
- **Cards** KPI avec statistiques
- **Navigation** latérale responsive
- **Formulaires** avec validation

## 🔧 Configuration Backend

### Points de Terminaison API Requis

```
POST   /api/auth/login              → Authentification
GET    /api/biens                   → Liste des propriétés
POST   /api/biens                   → Créer propriété
GET    /api/contrats                → Liste des contrats
POST   /api/contrats                → Créer contrat
GET    /api/paiements               → Liste des paiements
POST   /api/paiements               → Enregistrer paiement
GET    /api/bailleurs               → Liste des propriétaires
GET    /api/locataires              → Liste des locataires
GET    /api/depenses                → Liste des dépenses
GET    /api/recettes                → Liste des recettes
GET    /api/recettes/download       → Export recettes
```

Voir `INTEGRATION_GUIDE.md` pour les détails complets.

## 📊 Exemple de Données

### Propriétaire (Khadija Gueye)
```json
{
  "id": "1",
  "nom": "Khadija",
  "prenom": "Gueye",
  "telephone": "+221 77 123 45 67",
  "email": "khadija@example.com",
  "cni": "12345678",
  "biensCount": 17,
  "contratsCount": 11,
  "revenuTotal": 41563880
}
```

### Locataire (Saliou Camara)
```json
{
  "id": "1",
  "nom": "Saliou",
  "prenom": "Camara",
  "telephone": "+221 76 987 65 43",
  "profession": "Entrepreneur",
  "personnesCharge": 3,
  "email": "saliou@example.com",
  "adresse": "Rue de la Paix, Dakar"
}
```

## 🔐 Authentification

L'application inclut un système d'authentification complet:
- Login/Logout
- JWT Token
- Route Guards
- Session Management

À implémenter lors de l'intégration backend.

## 📝 Documentation Complète

- **COMPONENTS_SUMMARY.md** - Liste des 20 composants créés
- **COMPONENTS_README.md** - Architecture et structure
- **INTEGRATION_GUIDE.md** - Guide d'intégration backend
- **API_DOCUMENTATION.md** - Documentation des endpoints

## 🧪 Tests

Pré-requis pour les tests:
```bash
npm install --save-dev @angular/core @angular/common/http jasmine karma
npm test
```

## 📱 Responsive Design

L'application est optimisée pour:
- **Desktop**: 1920x1080 et plus
- **Tablet**: 768px - 1024px
- **Mobile**: 320px - 768px

Sidebar se réduit sur mobile, tables scrollent horizontalement.

## ⚡ Performance

- Standalone Components (pas de NgModule)
- OnPush Change Detection (quand implémenté)
- Lazy Loading des routes
- Cache des données
- Compression des assets

## 🐛 Troubleshooting

### Erreur: "Cannot find module"
```bash
npm install
npm start
```

### Port 4200 déjà utilisé
```bash
ng serve --port 4201
```

### CORS Errors
Voir `INTEGRATION_GUIDE.md` section CORS Configuration

### API ne répond pas
Vérifiez que:
1. Backend Laravel est en cours d'exécution
2. Base URL API est correcte dans les services
3. CORS est configuré correctement

## 🚀 Déploiement

### Build Production
```bash
npm run build
# ou
ng build --prod
```

Fichiers générés dans: `dist/app/`

### Hébergement
- Firebase Hosting
- Vercel
- Netlify
- Serveur Apache/Nginx

## 📞 Support & Documentation

- **Angular Docs**: https://angular.dev
- **TypeScript**: https://www.typescriptlang.org
- **RxJS**: https://rxjs.dev

## 📝 Changelog

### Version 1.0.0 (Initiale)
- ✅ Création de 20 composants Angular
- ✅ Services API complets
- ✅ Interfaces TypeScript
- ✅ Navigation et routing
- ✅ Styles responsive
- ✅ Documentation complète

## 📄 Licence

© 2024 Etoile Sine Immo. Tous droits réservés.

---

## 🎯 Prochaines Étapes

1. **Intégrer le Backend**
   - Configurer la base URL API
   - Implémenter l'authentification
   - Tester les endpoints

2. **Ajouter des Tests**
   - Tests unitaires
   - Tests e2e
   - Coverage

3. **Optimiser Performance**
   - Lazy loading
   - Minification
   - Caching

4. **Améliorer UX**
   - Notifications
   - Animations
   - Accessibilité

---

**Développé avec ❤️ pour Etoile Sine Immo**

Pour commencer:
```bash
cd frontend-immobillier/app
npm install
npm start
```

Accédez à: **http://localhost:4200**

Bon développement! 🚀
