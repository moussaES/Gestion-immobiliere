import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UtilisateurService } from '../../../core/services/utilisateur.service';
import { Utilisateur } from '../../../core/models';

@Component({
  selector: 'app-fiche-utilisateur',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="fiche-section">
      <div class="back-btn" (click)="back()">
        &#8592; Retour aux utilisateurs
      </div>

      <div class="fiche-header" *ngIf="utilisateur">
        <div class="header-info">
          <div class="avatar">{{ utilisateur.prenom.charAt(0).toUpperCase() }}</div>
          <div>
            <h2>{{ utilisateur.prenom }} {{ utilisateur.nom }}</h2>
            <p class="contact-info">
              <span>&#9993;</span> {{ utilisateur.email }} | 
              <span class="badge" [ngClass]="getRoleClass(utilisateur.role)">{{ utilisateur.role }}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="tabs" *ngIf="utilisateur">
        <div class="tab-header">
          <button [class.active]="activeTab === 'informations'" (click)="activeTab = 'informations'">Informations</button>
          <button [class.active]="activeTab === 'historique'" (click)="activeTab = 'historique'">Historique & Activité</button>
        </div>
        <div class="tab-content">
          <!-- ONGLET INFORMATIONS -->
          <div class="tab-pane" *ngIf="activeTab === 'informations'">
            <div class="list-header" style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
              <a [routerLink]="['/utilisateurs/modifier', utilisateur.id_user]" class="btn btn-outline-primary">
                <i class="fas fa-pencil-alt"></i> Modifier l'utilisateur
              </a>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <label>Nom</label>
                <p>{{ utilisateur.nom }}</p>
              </div>
              <div class="info-item">
                <label>Prénom</label>
                <p>{{ utilisateur.prenom }}</p>
              </div>
              <div class="info-item">
                <label>Email</label>
                <p>{{ utilisateur.email }}</p>
              </div>
              <div class="info-item">
                <label>Rôle</label>
                <p><span class="badge" [ngClass]="getRoleClass(utilisateur.role)">{{ utilisateur.role }}</span></p>
              </div>
              <div class="info-item">
                <label>Statut</label>
                <p><span class="badge" [ngClass]="getStatutClass(utilisateur.statut)">{{ utilisateur.statut }}</span></p>
              </div>
              <div class="info-item">
                <label>Dernière connexion</label>
                <p>{{ utilisateur.derniere_connexion ? formatDate(utilisateur.derniere_connexion) : 'Jamais' }}</p>
              </div>
            </div>
          </div>

          <!-- ONGLET HISTORIQUE -->
          <div class="tab-pane" *ngIf="activeTab === 'historique'">
            <div class="empty-state">L'historique des actions de cet utilisateur sera bientôt disponible.</div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .fiche-section { padding: 24px; max-width: 1200px; margin: 0 auto; min-height: 100vh; background: #f4f6f9; }
    .back-btn { color: #666; font-size: 14px; margin-bottom: 24px; cursor: pointer; display: inline-flex; align-items: center; transition: color 0.2s; }
    .back-btn:hover { color: #1a237e; }
    
    .fiche-header { background: #fff; border-radius: 8px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center; }
    .header-info { display: flex; align-items: center; gap: 20px; }
    .avatar { width: 64px; height: 64px; border-radius: 8px; background: #e8eaf6; color: #1a237e; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; }
    .header-info h2 { margin: 0 0 8px 0; font-size: 24px; color: #333; }
    .contact-info { margin: 0; color: #666; font-size: 14px; display: flex; align-items: center; gap: 12px; }
    
    .tabs { background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow: hidden; }
    .tab-header { display: flex; border-bottom: 1px solid #eee; background: #fafafa; }
    .tab-header button { padding: 16px 24px; background: transparent; border: none; font-size: 14px; font-weight: 500; color: #666; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; }
    .tab-header button.active { color: #1a237e; border-bottom-color: #1a237e; background: #fff; }
    
    .tab-content { padding: 24px; }
    
    .info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
    .info-item { background: #f8f9fa; padding: 16px; border-radius: 6px; }
    .info-item label { display: block; font-size: 12px; color: #666; margin-bottom: 4px; text-transform: uppercase; font-weight: 600; }
    .info-item p { margin: 0; font-size: 15px; color: #333; font-weight: 500; }
    
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-block; text-align: center; }
    .badge-admin { background: #ffebee; color: #c62828; }
    .badge-gestionnaire { background: #e3f2fd; color: #1565c0; }
    .badge-actif { background: #e8f5e9; color: #2e7d32; }
    .badge-inactif { background: #f5f5f5; color: #757575; }

    .btn-outline-primary { border: 1px solid #1a237e; color: #1a237e; background: transparent; padding: 8px 16px; border-radius: 4px; font-weight: 600; text-decoration: none; font-size: 13px; transition: all 0.2s; cursor: pointer; }
    .btn-outline-primary:hover { background: #1a237e; color: #fff; }
  `]
})
export class FicheUtilisateurComponent implements OnInit {
  utilisateur: Utilisateur | null = null;
  activeTab: string = 'informations';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userSvc: UtilisateurService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userSvc.getById(Number(id)).subscribe({
        next: (res: any) => {
          this.utilisateur = res.data;
        }
      });
    }
  }

  back(): void {
    this.router.navigate(['/utilisateurs']);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('fr-FR');
  }

  getRoleClass(role: string): string {
    switch(role) {
      case 'ADMIN': return 'badge-admin';
      case 'GESTIONNAIRE': return 'badge-gest';
      default: return '';
    }
  }

  getStatutClass(statut: string): string {
    return statut === 'ACTIF' ? 'badge-actif' : 'badge-inactif';
  }
} 

