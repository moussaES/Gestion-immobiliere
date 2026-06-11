import { Routes } from '@angular/router';
import { AuthGuard }  from './core/guards/auth.guard';
import { RoleGuard }  from './core/guards/role.guard';
import { LoginGuard } from './core/guards/login.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Auth (public)
  {
    path: 'auth/login',
    canActivate: [LoginGuard],
    loadComponent: () => import('./modules/auth/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'auth',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },

  // Pages protégées
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./modules/dashboard/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'biens',
        loadComponent: () => import('./modules/biens/bien-list/bien-list').then(m => m.BienListComponent)
      },
      {
        path: 'biens/nouveau',
        loadComponent: () => import('./modules/biens/bien-form/bien-form').then(m => m.BienFormComponent)
      },
      {
        path: 'biens/modifier/:id',
        loadComponent: () => import('./modules/biens/bien-form/bien-form').then(m => m.BienFormComponent)
      },
      {
        path: 'biens/:id',
        loadComponent: () => import('./modules/biens/fiche-bien/fiche-bien').then(m => m.FicheBienComponent)
      },
      {
        path: 'proprietaires',
        loadComponent: () => import('./modules/proprietaires/proprietaires').then(m => m.ProprietairesComponent)
      },
      {
        path: 'proprietaires/nouveau',
        loadComponent: () => import('./modules/proprietaires/proprietaire-form/proprietaire-form').then(m => m.ProprietaireFormComponent)
      },
      {
        path: 'proprietaires/modifier/:id',
        loadComponent: () => import('./modules/proprietaires/proprietaire-form/proprietaire-form').then(m => m.ProprietaireFormComponent)
      },
      {
        path: 'proprietaires/:id',
        loadComponent: () => import('./modules/proprietaires/fiche-proprietaire/fiche-proprietaire').then(m => m.FicheProprietaireComponent)
      },
      {
        path: 'locataires',
        loadComponent: () => import('./modules/locataires/locataires').then(m => m.LocatairesComponent)
      },
      {
        path: 'locataires/nouveau',
        loadComponent: () => import('./modules/locataires/locataire-form/locataire-form').then(m => m.LocataireFormComponent)
      },
      {
        path: 'locataires/modifier/:id',
        loadComponent: () => import('./modules/locataires/locataire-form/locataire-form').then(m => m.LocataireFormComponent)
      },
      {
        path: 'locataires/:id',
        loadComponent: () => import('./modules/locataires/fiche-locataire/fiche-locataire').then(m => m.FicheLocataireComponent)
      },
      {
        path: 'contrats',
        loadComponent: () => import('./modules/contrats/contrats').then(m => m.ContratsComponent)
      },
      {
        path: 'contrats/nouveau',
        loadComponent: () => import('./modules/contrats/contrat-form/contrat-form').then(m => m.ContratFormComponent)
      },
      {
        path: 'contrats/modifier/:id',
        loadComponent: () => import('./modules/contrats/contrat-form/contrat-form').then(m => m.ContratFormComponent)
      },
      {
        path: 'paiements',
        loadComponent: () => import('./modules/paiements/paiements').then(m => m.PaiementsComponent)
      },
      {
        path: 'paiements/nouveau',
        loadComponent: () => import('./modules/paiements/paiement-form/paiement-form').then(m => m.PaiementFormComponent)
      },
      {
        path: 'paiements/modifier/:id',
        loadComponent: () => import('./modules/paiements/paiement-form/paiement-form').then(m => m.PaiementFormComponent)
      },
      {
        path: 'utilisateurs',
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () => import('./modules/utilisateurs/utilisateurs').then(m => m.UtilisateursComponent),
      },
      {
        path: 'utilisateurs/nouveau',
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () => import('./modules/utilisateurs/utilisateur-form/utilisateur-form').then(m => m.UtilisateurFormComponent)
      },
      {
        path: 'utilisateurs/modifier/:id',
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () => import('./modules/utilisateurs/utilisateur-form/utilisateur-form').then(m => m.UtilisateurFormComponent)
      },
      {
        path: 'historique',
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'GESTIONNAIRE'] },
        loadComponent: () => import('./modules/historique/historique').then(m => m.HistoriqueComponent),
      },
    ],
  },

  { path: '**', redirectTo: 'dashboard' },
];