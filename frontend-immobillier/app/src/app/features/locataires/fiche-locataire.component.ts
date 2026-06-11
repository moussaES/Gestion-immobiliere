import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LocataireService, ContratService } from '../../../../../../frontend/src/app/shared/services/data.service';
import { Locataire, Contrat } from '../../../../../../frontend/src/app/shared/interfaces/models';

@Component({
  selector: 'app-fiche-locataire',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fiche-section">
      <div class="back-btn" (click)="back()">
        <i class="fas fa-arrow-left"></i> Retour aux Locataires
      </div>

      <div class="fiche-header" *ngIf="locataire">
        <div class="header-info">
          <div class="avatar">{{ locataire.nom.charAt(0).toUpperCase() }}</div>
          <div>
            <h2>{{ locataire.nom }} {{ locataire.prenom }}</h2>
            <p class="contact-info">
              <i class="fas fa-phone"></i> {{ locataire.telephone }} | 
              <i class="fas fa-briefcase"></i> {{ locataire.profession }}
            </p>
            <p class="family-info">
              <i class="fas fa-users"></i> Personnes à charge: {{ locataire.personnesCharge || 0 }}
            </p>
          </div>
        </div>
        <div class="kpis">
          <div class="kpi-item">
            <div class="kpi-value">{{ contrats.length }}</div>
            <div class="kpi-label">Contrats</div>
          </div>
          <div class="kpi-item">
            <div class="kpi-value">{{ loyerMensuel | number:'1.0-0' }} FCFA</div>
            <div class="kpi-label">Loyer Mensuel</div>
          </div>
        </div>
      </div>

      <div class="tabs">
        <div class="tab-header">
          <button [class.active]="activeTab === 'contrats'" (click)="activeTab = 'contrats'">
            <i class="fas fa-file-signature"></i> Contrats ({{ contrats.length }})
          </button>
          <button [class.active]="activeTab === 'biens'" (click)="activeTab = 'biens'">
            <i class="fas fa-home"></i> Biens Loués
          </button>
          <button [class.active]="activeTab === 'paiements'" (click)="activeTab = 'paiements'">
            <i class="fas fa-money-bill"></i> Paiements
          </button>
          <button [class.active]="activeTab === 'travaux'" (click)="activeTab = 'travaux'">
            <i class="fas fa-wrench"></i> Travaux
          </button>
          <button [class.active]="activeTab === 'historique'" (click)="activeTab = 'historique'">
            <i class="fas fa-history"></i> Historique
          </button>
          <button [class.active]="activeTab === 'infos'" (click)="activeTab = 'infos'">
            <i class="fas fa-info-circle"></i> Informations
          </button>
          <button [class.active]="activeTab === 'documents'" (click)="activeTab = 'documents'">
            <i class="fas fa-file-pdf"></i> Documents
          </button>
        </div>

        <div class="tab-content">
          <!-- Onglet Contrats -->
          <div *ngIf="activeTab === 'contrats'" class="tab-pane">
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>N° Contrat</th>
                    <th>Produit</th>
                    <th>Date Début</th>
                    <th>Date Fin</th>
                    <th>Loyer</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let contrat of contrats">
                    <td>{{ contrat.numero }}</td>
                    <td>{{ contrat.bienRef }}</td>
                    <td>{{ contrat.dateDebut | date:'dd/MM/yyyy' }}</td>
                    <td>{{ contrat.dateFin | date:'dd/MM/yyyy' }}</td>
                    <td>{{ contrat.loyerMensuel | number:'1.0-0' }} FCFA</td>
                    <td><span class="badge" [ngClass]="'badge-' + contrat.statut.toLowerCase()">{{ contrat.statut }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Onglet Biens Loués -->
          <div *ngIf="activeTab === 'biens'" class="tab-pane">
            <p class="empty-state">Liste des biens loués par ce locataire.</p>
          </div>

          <!-- Onglet Paiements -->
          <div *ngIf="activeTab === 'paiements'" class="tab-pane">
            <p class="empty-state">Historique des paiements effectués par le locataire.</p>
          </div>

          <!-- Onglet Travaux -->
          <div *ngIf="activeTab === 'travaux'" class="tab-pane">
            <p class="empty-state">Travaux et réparations signalés par le locataire.</p>
          </div>

          <!-- Onglet Historique -->
          <div *ngIf="activeTab === 'historique'" class="tab-pane">
            <p class="empty-state">Historique complet des actions et événements du locataire.</p>
          </div>

          <!-- Onglet Informations -->
          <div *ngIf="activeTab === 'infos' && locataire" class="tab-pane">
            <div class="info-grid">
              <div class="info-item">
                <label>Nom Complet</label>
                <p>{{ locataire.nom }} {{ locataire.prenom }}</p>
              </div>
              <div class="info-item">
                <label>Téléphone</label>
                <p>{{ locataire.telephone }}</p>
              </div>
              <div class="info-item">
                <label>Profession</label>
                <p>{{ locataire.profession }}</p>
              </div>
              <div class="info-item">
                <label>Personnes à Charge</label>
                <p>{{ locataire.personnesCharge }}</p>
              </div>
              <div class="info-item">
                <label>Email</label>
                <p>{{ locataire.email || 'Non renseigné' }}</p>
              </div>
              <div class="info-item">
                <label>Adresse</label>
                <p>{{ locataire.adresseActuelle || 'Non renseignée' }}</p>
              </div>
            </div>
          </div>

          <!-- Onglet Documents -->
          <div *ngIf="activeTab === 'documents'" class="tab-pane">
            <p class="empty-state">Documents du locataire (pièces d'identité, justificatifs, etc.).</p>
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
    .contact-info, .family-info { margin: 6px 0; font-size: 14px; color: #666; }
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
      min-width: 140px;
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
    .badge-actif { background: #e8f5e9; color: #2e7d32; }
    .badge-inactif { background: #ffebee; color: #c62828; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .info-item label { display: block; font-size: 12px; color: #999; font-weight: 600; text-transform: uppercase; margin-bottom: 8px; }
    .info-item p { margin: 0; font-size: 16px; color: #333; font-weight: 500; }
  `]
})
export class FicheLocataireComponent implements OnInit {
  locataire: Locataire | null = null;
  contrats: Contrat[] = [];
  activeTab = 'contrats';

  get loyerMensuel(): number {
    const activeContrat = this.contrats.find(c => c.statut === 'actif');
    return activeContrat ? activeContrat.loyerMensuel : 0;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private locataireService: LocataireService,
    private contratService: ContratService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadLocataire(id);
    }
  }

  loadLocataire(id: string): void {
    this.locataireService.getById(id).subscribe({
      next: (data) => {
        this.locataire = data;
        this.loadContrats(id);
      }
    });
  }

  loadContrats(locataireId: string): void {
    this.contratService.getByLocataire(locataireId).subscribe({
      next: (data) => {
        this.contrats = data;
      }
    });
  }

  back(): void {
    this.router.navigate(['/locataires']);
  }
}
