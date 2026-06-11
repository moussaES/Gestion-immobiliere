# Etoile Sine Immo - Application Angular

Application de gestion immobilière complète avec interface utilisateur moderne.

## Structure du Projet

```
src/app/
├── core/                    # Composants de base
│   └── layout/             # Composant principal de layout
├── features/               # Modules fonctionnels
│   ├── dashboard/          # Page d'accueil
│   ├── produits/           # Gestion des propriétés
│   ├── contrats/           # Gestion des contrats
│   ├── paiements/          # Gestion des paiements
│   ├── bailleurs/          # Gestion des propriétaires
│   ├── locataires/         # Gestion des locataires
│   ├── depenses/           # Gestion des dépenses
│   └── recettes/           # Gestion des recettes
├── shared/                 # Composants et services partagés
│   ├── components/         # Composants réutilisables (Table, Modal)
│   ├── interfaces/         # Interfaces TypeScript
│   └── services/           # Services API
├── app.routes.ts          # Configuration du routage
├── app.config.ts          # Configuration de l'application
├── app.component.ts       # Composant racine
└── main.ts                # Point d'entrée
```

## Composants Créés

### Pages Principales
- **Dashboard**: Affichage des KPIs et statistiques
- **Produits**: Liste et gestion des propriétés
- **Contrats**: Gestion des contrats de location
- **Paiements**: Suivi des paiements reçus
- **Bailleurs**: Gestion des propriétaires avec fiche détaillée
- **Locataires**: Gestion des locataires avec fiche détaillée
- **Dépenses**: Suivi des dépenses de maintenance
- **Recettes**: Gestion des revenus avec export

### Composants Partagés
- **TableComponent**: Tableau réutilisable avec pagination
- **ModalComponent**: Boîte de dialogue pour création/édition
- **LayoutComponent**: Navigation et mise en page

## Services API

Les services sont structurés avec des méthodes standardisées:

```typescript
// Méthodes disponibles pour tous les services
getAll(): Observable<T[]>
getById(id: string): Observable<T>
create(item: T): Observable<T>
update(id: string, item: T): Observable<T>
delete(id: string): Observable<void>

// Méthodes spécialisées
getByProprietaire(id: string): Observable<Bien[]>
getByLocataire(id: string): Observable<Contrat[]>
telecharger(): Observable<Blob>  // Pour Recettes
```

## Points d'Intégration API

Tous les services ciblent des endpoints API correspondants:

- `/api/biens` - Propriétés
- `/api/contrats` - Contrats
- `/api/paiements` - Paiements
- `/api/bailleurs` - Propriétaires
- `/api/locataires` - Locataires
- `/api/depenses` - Dépenses
- `/api/recettes` - Recettes

## Démarrage

### Prérequis
- Node.js 18+
- npm 9+
- Angular CLI 17+

### Installation

```bash
cd frontend-immobillier/app
npm install
```

### Développement

```bash
npm start
# ou
ng serve
```

L'application s'ouvrira sur `http://localhost:4200`

### Build Production

```bash
npm run build
# ou
ng build --prod
```

## Architecture Générale

### Standalone Components
Tous les composants utilisent l'architecture standalone (pas de NgModule).

### Reactive Forms
Les formulaires utilisent `FormsModule` avec `[(ngModel)]`.

### Routing
Routage basé sur les features avec lazy loading supporté.

### Theming
Couleur principale: `#1a237e` (Bleu foncé)
Couleur de fond: `#f0f2f5` (Gris clair)

Couleurs d'état:
- Occupé: Violet `#7c4dff`
- Libre: Vert `#26c6da`
- Réservé: Orange `#ffa000`
- Payé: Vert `#2e7d32`
- En attente: Orange `#ffa000`

## Fonctionnalités Implémentées

✅ Dashboard avec KPIs
✅ Listing des produits avec filtres et recherche
✅ Modal de création/édition
✅ Gestion des contrats
✅ Gestion des paiements
✅ Fiches détaillées Bailleurs avec 7 onglets
✅ Fiches détaillées Locataires avec 7 onglets
✅ Gestion des dépenses
✅ Gestion des recettes avec export
✅ Navigation responsive avec sidebar

## Prochaines Étapes

1. **Intégration API Backend**
   - Configurer les endpoints de base URL
   - Ajouter authentification/JWT
   - Implémenter les intercepteurs

2. **Validation des Formulaires**
   - Ajouter Angular Forms avec validation
   - Messages d'erreur
   - Feedback utilisateur

3. **Gestion d'État**
   - Intégrer NgRx ou Akita pour la gestion d'état
   - Cache des données

4. **Tests**
   - Tests unitaires (Jasmine/Karma)
   - Tests e2e (Cypress/Playwright)

5. **Optimisation**
   - Lazy loading des routes
   - Préchargement des données
   - Minification et compression

## Support

Pour des questions ou des problèmes, consultez la documentation Angular:
https://angular.dev

## Licence

© 2024 Etoile Sine Immo. Tous droits réservés.
