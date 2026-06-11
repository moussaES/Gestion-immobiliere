import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BailleurService, BienService, ContratService } from '../../../../../../frontend/src/app/shared/services/data.service';
import { Bailleur, Bien, Contrat } from '../../../../../../frontend/src/app/shared/interfaces/models';

@Component({
  selector: 'app-fiche-bailleur',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fiche-section">
      <div class="back-btn" (click)="back()">
        <i class="fas fa-arrow-left"></i> Retour aux Bailleurs
      </div>

      <div class="fiche-header" *ngIf="bailleur">
        <div class="header-info">
          <div class="avatar">{{ bailleur.nom.charAt(0).toUpperCase() }}</div>
          <div>
            <h2>{{ bailleur.nom }} {{ bailleur.prenom }}</h2>
            <p class="contact-info">
              <i class="fas fa-phone"></i> {{ bailleur.telephone }} | 
              <i class="fas fa-envelope"></i> {{ bailleur.email }}
            </p>
            <p class="cni-info">
              <i class="fas fa-id-card"></i> CNI: {{ bailleur.cni }}
            </p>
          </div>
        </div>
        <div class="kpis">
          <div class="kpi-item">
            <div class="kpi-value">{{ bailleur.biensCount || 0 }}</div>
            <div class="kpi-label">Biens</div>
          </div>
          <div class="kpi-item">
            <div class="kpi-value">{{ bailleur.contratsCount || 0 }}</div>
            <div class="kpi-label">Contrats</div>
          </div>
          <div class="kpi-item">
            <div class="kpi-value">{{ bailleur.revenuTotal || 0 | number:'1.0-0' }} FCFA</div>
            <div class="kpi-label">Revenu Total</div>
          </div>
        </div>
      </div>

      <div class="tabs">
        <div class="tab-header">
          <button [class.active]="activeTab === 'biens'" (click)="activeTab = 'biens'">
            <i class="fas fa-home"></i> Biens ({{ biens.length }})
          </button>
          <button [class.active]="activeTab === 'locataires'" (click)="activeTab = 'locataires'">
            <i class="fas fa-users"></i> Locataires
          </button>
          <button [class.active]="activeTab === 'paiements'" (click)="activeTab = 'paiements'">
            <i class="fas fa-money-bill"></i> Paiements
          </button>
          <button [class.active]="activeTab === 'travaux'" (click)="activeTab = 'travaux'">
            <i class="fas fa-wrench"></i> Travaux
          </button>
          <button [class.active]="activeTab === 'fiche'" (click)="activeTab = 'fiche'">
            <i class="fas fa-file-alt"></i> Fiche de Paie
          </button>
          <button [class.active]="activeTab === 'contrat'" (click)="activeTab = 'contrat'">
            <i class="fas fa-file-signature"></i> Contrat Gérance
          </button>
          <button [class.active]="activeTab === 'coordonnees'" (click)="activeTab = 'coordonnees'">
            <i class="fas fa-address-card"></i> Coordonnées
          </button>
        </div>

        <div class="tab-content">
          <!-- Onglet Biens -->
          <div *ngIf="activeTab === 'biens'" class="tab-pane">
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Référence</th>
                    <th>Type</th>
                    <th>Adresse</th>
                    <th>Ville</th>
                    <th>Statut</th>
                    <th>Loyer</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let bien of biens">
                    <td>{{ bien.reference }}</td>
                    <td>{{ bien.type }}</td>
                    <td>{{ bien.adresse }}</td>
                    <td>{{ bien.ville }}</td>
                    <td><span class="badge" [ngClass]="'badge-' + bien.statut.toLowerCase()">{{ bien.statut }}</span></td>
                    <td>{{ bien.loyerMensuel | number:'1.0-0' }} FCFA</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Onglet Locataires -->
          <div *ngIf="activeTab === 'locataires'" class="tab-pane">
            <p class="empty-state">Liste des locataires occupant les biens du bailleur.</p>
          </div>

          <!-- Onglet Paiements -->
          <div *ngIf="activeTab === 'paiements'" class="tab-pane">
            <p class="empty-state">Historique des paiements reçus du bailleur.</p>
          </div>

          <!-- Onglet Travaux -->
          <div *ngIf="activeTab === 'travaux'" class="tab-pane">
            <p class="empty-state">Travaux et réparations effectués sur les biens du bailleur.</p>
          </div>

          <!-- Onglet Fiche de Paie -->
          <div *ngIf="activeTab === 'fiche'" class="tab-pane">
            <p class="empty-state">Fiche de paie et rémunération du bailleur.</p>
          </div>

          <!-- Onglet Contrat Gérance -->
          <div *ngIf="activeTab === 'contrat'" class="tab-pane">
            <p class="empty-state">Contrat de gérance en cours.</p>
          </div>

          <!-- Onglet Coordonnées -->
          <div *ngIf="activeTab === 'coordonnees' && bailleur" class="tab-pane">
            <div class="info-grid">
              <div class="info-item">
                <label>Nom Complet</label>
                <p>{{ bailleur.nom }} {{ bailleur.prenom }}</p>
              </div>
              <div class="info-item">
                <label>Téléphone</label>
                <p>{{ bailleur.telephone }}</p>
              </div>
              <div class="info-item">
                <label>Email</label>
                <p>{{ bailleur.email }}</p>
              </div>
              <div class="info-item">
                <label>CNI</label>
                <p>{{ bailleur.cni }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fiche-section { }
    .back-btn { cursor: pointer; color: #1a237e; font-weight: 600; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
    .back-btn:hover { text-decoration: underline; }
    .fiche-header {
      background: #fff;
      border-radius: 10px;
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 1px 6px rgba(0,0,0,0.07);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }
    .header-info {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }
    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #1a237e;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 700;
    }
    .header-info h2 { margin: 0 0 8px 0; font-size: 22px; }
    .contact-info, .cni-info { margin: 6px 0; font-size: 14px; color: #666; }
    .kpis { display: flex; gap: 20px; }
    .kpi-item { text-align: center; }
    .kpi-value { font-size: 24px; font-weight: 700; color: #1a237e; }
    .kpi-label { font-size: 12px; color: #999; text-transform: uppercase; margin-top: 4px; }
    .tabs { background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,0.07); }
    .tab-header {
      display: flex;
      flex-wrap: wrap;
      border-bottom: 2px solid #f0f0f0;
      background: #fafafa;
    }
    .tab-header button {
      flex: 1;
      min-width: 150px;
      padding: 14px 16px;
      background: none;
      border: none;
      color: #666;
      font-weight: 600;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 13px;
    }
    .tab-header button.active {
      color: #1a237e;
      border-bottom-color: #1a237e;
    }
    .tab-header button:hover:not(.active) {
      color: #1a237e;
      opacity: 0.7;
    }
    .tab-content { padding: 24px; }
    .tab-pane { }
    .empty-state { color: #999; text-align: center; padding: 40px 20px; }
    .table-wrap { background: #f8f9fa; border-radius: 8px; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    th { padding: 14px 16px; text-align: left; font-weight: 600; color: #444; border-bottom: 2px solid #e0e0e0; }
    td { padding: 13px 16px; border-bottom: 1px solid #e0e0e0; color: #555; }
    tr:hover td { background: #fff; }
    .badge { display: inline-block; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-occupé { background: #fff3e0; color: #e65100; }
    .badge-libre { background: #e8f5e9; color: #2e7d32; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .info-item label { display: block; font-size: 12px; color: #999; font-weight: 600; text-transform: uppercase; margin-bottom: 8px; }
    .info-item p { margin: 0; font-size: 16px; color: #333; font-weight: 500; }
  `]
})
export class FicheBailleurComponent implements OnInit {
  bailleur: Bailleur | null = null;
  biens: Bien[] = [];
  activeTab = 'biens';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bailleurService: BailleurService,
    private bienService: BienService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBailleur(id);
    }
  }

  loadBailleur(id: string): void {
    this.bailleurService.getById(id).subscribe({
      next: (data) => {
        this.bailleur = data;
        this.loadBiens(id);
      }
    });
  }

  loadBiens(bailleurId: string): void {
    this.bienService.getByProprietaire(bailleurId).subscribe({
      next: (data) => {
        this.biens = data;
      }
    });
  }

  back(): void {
    this.router.navigate(['/bailleurs']);
  }
}
