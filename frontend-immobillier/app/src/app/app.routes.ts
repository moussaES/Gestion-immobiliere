import { Routes } from '@angular/router';
import { LayoutComponent } from '../../../../frontend/src/app/core/layout/layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { BienComponent } from './features/biens/biens.component';
import { ContratsComponent } from './features/contrats/contrats.component';
import { PaiementsComponent } from './features/paiements/paiements.component';
import { ProprietairesComponent } from './features/proprietaires/proprietaires.component';
import { FicheProprietaireComponent } from './features/proprietaires/fiche-proprietaire.component';
import { LocatairesComponent } from './features/locataires/locataires.component';
import { FicheLocataireComponent } from './features/locataires/fiche-locataire.component';
import { DepensesComponent } from './features/depenses/depenses.component';
import { RecettesComponent } from './features/recettes/recettes.component';
import { PlaceholderComponent } from '../../../../frontend/src/app/shared/components/placeholder.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'resume', pathMatch: 'full' },
      { path: 'resume', component: DashboardComponent },
      { path: 'biens', component: BienComponent },
      { path: 'biens/:id', component: BienComponent },
      { path: 'contrats', component: ContratsComponent },
      { path: 'contrats/:id', component: ContratsComponent },
      { path: 'paiements', component: PaiementsComponent },
      { path: 'paiements/:id', component: PaiementsComponent },
      { path: 'proprietaires', component: ProprietairesComponent },
      { path: 'proprietaires/:id', component: FicheProprietaireComponent },
      { path: 'proprietaires/new', component: FicheProprietaireComponent },
      { path: 'locataires', component: LocatairesComponent },
      { path: 'locataires/:id', component: FicheLocataireComponent },
      { path: 'locataires/new', component: FicheLocataireComponent },
      { path: 'depenses', component: DepensesComponent },
      { path: 'recettes', component: RecettesComponent },
      { path: 'parametres', component: PlaceholderComponent },
      { path: 'support', component: PlaceholderComponent },
      { path: 'faq', component: PlaceholderComponent } // Placeholder
    ]
  }
];
