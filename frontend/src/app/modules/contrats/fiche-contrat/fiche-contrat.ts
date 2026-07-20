import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContratService } from '../../../core/services/contrat.service';
import { Contrat } from '../../../core/models';

@Component({
  selector: 'app-fiche-contrat',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="fiche-section">
      <div class="back-btn" (click)="back()">
        &#8592; Retour aux contrats
      </div>

      <div class="fiche-header" *ngIf="contrat">
        <div class="header-info">
          <div class="icon-circle"><i class="fas fa-file-contract"></i></div>
          <div>
            <h2>Contrat {{ contrat.reference || 'Sans Référence' }}</h2>
            <p class="contact-info">
              <span>&#128197;</span> Début: {{ formatDate(contrat.date_debut) }} | 
              <span class="badge" [ngClass]="getBadgeClass(contrat.statut)">{{ contrat.statut }}</span> |
              <span class="badge" [ngClass]="getTypeClass(contrat.type_contrat)">{{ contrat.type_contrat }}</span>
            </p>
          </div>
        </div>
      </div>

      <div *ngIf="!contrat && !loading" style="padding: 40px; text-align: center; color: red; font-size: 18px; background: white; border-radius: 8px; margin-top: 20px;">
        ⚠️ Erreur : Impossible de charger les données du contrat (URL: {{ currentId }}).
      </div>
      <div *ngIf="loading" style="padding: 40px; text-align: center; color: #666; font-size: 16px; background: white; border-radius: 8px; margin-top: 20px;">
        <i class="fas fa-spinner fa-spin"></i> Chargement du contrat en cours...
      </div>

      <div class="tabs" *ngIf="contrat">
        <div class="tab-header">
          <button [class.active]="activeTab === 'informations'" (click)="activeTab = 'informations'">Informations</button>
          <button [class.active]="activeTab === 'paiements'" (click)="activeTab = 'paiements'">Paiements ({{ contrat.paiements?.length || 0 }})</button>
          <button [class.active]="activeTab === 'documents'" (click)="activeTab = 'documents'">Documents</button>
        </div>
        <div class="tab-content">
          <!-- ONGLET INFORMATIONS -->
          <div class="tab-pane" *ngIf="activeTab === 'informations'">
            <div class="list-header" style="display: flex; justify-content: flex-end; margin-bottom: 20px; gap: 12px;">
              <button (click)="exportPdf()" class="btn btn-outline-danger">
                <i class="fas fa-file-pdf"></i> Exporter PDF
              </button>
              <button (click)="exportCsv()" class="btn btn-outline-success">
                <i class="fas fa-file-csv"></i> Exporter CSV
              </button>
              <a [routerLink]="['/contrats/modifier', contrat.id_contrat]" class="btn btn-outline-primary">
                <i class="fas fa-pencil-alt"></i> Modifier le contrat
              </a>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <label>Référence</label>
                <p>{{ contrat.reference }}</p>
              </div>
              <div class="info-item">
                <label>Type de Contrat</label>
                <p>{{ contrat.type_contrat }}</p>
              </div>
              <div class="info-item">
                <label>Montant Mensuel</label>
                <p class="amount">{{ contrat.montant }} FCFA</p>
              </div>
              <div class="info-item">
                <label>Date de Début</label>
                <p>{{ formatDate(contrat.date_debut) }}</p>
              </div>
              <div class="info-item">
                <label>Date de Fin</label>
                <p>{{ formatDate(contrat.date_fin) || 'Non définie' }}</p>
              </div>
              <div class="info-item">
                <label>Statut</label>
                <p><span class="badge" [ngClass]="getBadgeClass(contrat.statut)">{{ contrat.statut }}</span></p>
              </div>
            </div>

            <h3 style="margin-top: 30px; font-size: 16px; color: #333;">Parties impliquées</h3>
            <div class="info-grid" style="margin-top: 15px;">
              <div class="info-item" *ngIf="contrat.bien">
                <label>Bien Immobilier</label>
                <p>{{ contrat.bien.nom_bien || contrat.bien.nom || 'Bien' }} ({{ contrat.bien.type_bien }})</p>
                <a [routerLink]="['/biens', contrat.id_bien]" style="font-size: 13px; color: #1a237e; text-decoration: none;">Voir la fiche du bien</a>
              </div>
              <div class="info-item" *ngIf="contrat.locataire">
                <label>Locataire</label>
                <p>{{ contrat.locataire.prenom }} {{ contrat.locataire.nom }}</p>
                <a [routerLink]="['/locataires', contrat.id_locataire]" style="font-size: 13px; color: #1a237e; text-decoration: none;">Voir la fiche locataire</a>
              </div>
              <div class="info-item" *ngIf="contrat.proprietaire">
                <label>Propriétaire</label>
                <p>{{ contrat.proprietaire.prenom }} {{ contrat.proprietaire.nom }}</p>
                <a [routerLink]="['/proprietaires', contrat.id_proprietaire]" style="font-size: 13px; color: #1a237e; text-decoration: none;">Voir la fiche propriétaire</a>
              </div>
            </div>
          </div>

          <!-- ONGLET PAIEMENTS -->
          <div class="tab-pane" *ngIf="activeTab === 'paiements'">
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Mois</th>
                    <th>Montant</th>
                    <th>Mode</th>
                    <th>Statut</th>
                    <th style="text-align: right;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let p of contrat.paiements">
                    <td>{{ formatDate(p.date_paiement) }}</td>
                    <td>{{ p.mois_concerne }}</td>
                    <td><strong>{{ p.montant }} FCFA</strong></td>
                    <td style="text-transform: capitalize;">{{ p.mode }}</td>
                    <td><span class="badge" [ngClass]="getBadgePaiementClass(p.statut)">{{ p.statut }}</span></td>
                    <td style="text-align: right;">
                      <a [routerLink]="['/paiements', p.id_paiement]" class="icon-btn view-btn"><i class="fas fa-eye"></i></a>
                    </td>
                  </tr>
                  <tr *ngIf="!contrat.paiements || contrat.paiements.length === 0">
                    <td colspan="6" class="empty-state">Aucun paiement enregistré pour ce contrat.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ONGLET DOCUMENTS -->
          <div class="tab-pane" *ngIf="activeTab === 'documents'">
            <div class="empty-state">Aucun document rattaché à ce contrat pour le moment.</div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .fiche-section { padding: 24px; max-width: 1200px; margin: 0 auto; min-height: 100vh; background: #f4f6f9; }
    .back-btn { color: #1a237e; font-size: 14px; font-weight: 600; margin-bottom: 24px; cursor: pointer; display: inline-flex; align-items: center; transition: color 0.2s; text-decoration: none; }
    .back-btn:hover { color: #0d47a1; text-decoration: underline; }
    
    .fiche-header { background: #fff; border-radius: 8px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center; }
    .header-info { display: flex; align-items: center; gap: 20px; }
    .icon-circle { width: 64px; height: 64px; border-radius: 8px; background: #e8eaf6; color: #1a237e; display: flex; align-items: center; justify-content: center; font-size: 24px; }
    .header-info h2 { margin: 0 0 8px 0; font-size: 24px; color: #333; }
    .contact-info { margin: 0; color: #666; font-size: 14px; display: flex; align-items: center; gap: 12px; }
    
    .tabs { background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow: hidden; margin-top: 20px; }
    .tab-header { display: flex; border-bottom: 1px solid #eee; background: #fff; padding: 0 10px; }
    .tab-header button { padding: 16px 24px; background: transparent; border: none; font-size: 14px; font-weight: 600; color: #666; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; }
    .tab-header button:hover { color: #1a237e; }
    .tab-header button.active { color: #1a237e; border-bottom-color: #1a237e; }
    
    .tab-content { padding: 30px; min-height: 200px; }
    
    .info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
    .info-item { background: #f8f9fa; padding: 16px; border-radius: 6px; }
    .info-item label { display: block; font-size: 12px; color: #666; margin-bottom: 4px; text-transform: uppercase; font-weight: 600; }
    .info-item p { margin: 0; font-size: 15px; color: #333; font-weight: 500; margin-bottom: 8px; }
    .amount { color: #1a237e !important; font-weight: 700 !important; font-size: 16px !important; }
    
    .table-container { background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #eee; }
    table { width: 100%; border-collapse: collapse; text-align: left; }
    th { padding: 12px 16px; font-size: 13px; font-weight: 600; color: #555; border-bottom: 2px solid #eee; background: #fafafa; }
    td { padding: 12px 16px; font-size: 14px; border-bottom: 1px solid #eee; vertical-align: middle; }
    tr:hover td { background: #fafafa; }
    .empty-state { text-align: center; color: #999; padding: 30px !important; }
    
    .icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; text-decoration: none; transition: background 0.2s; margin-left: 8px; }
    .view-btn { color: #1976d2; }
    .view-btn:hover { background: rgba(25, 118, 210, 0.1); }
    
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-block; text-align: center; text-transform: uppercase; }
    .badge-actif { background: #e8f5e9; color: #2e7d32; }
    .badge-resilie { background: #ffebee; color: #c62828; }
    .badge-archive { background: #f5f5f5; color: #757575; }
    .badge-loc { background: #e3f2fd; color: #1565c0; }
    .badge-prop { background: #f3e5f5; color: #7b1fa2; }

    .btn-outline-primary { border: 1px solid #1a237e; color: #1a237e; background: transparent; padding: 8px 16px; border-radius: 4px; font-weight: 600; text-decoration: none; font-size: 13px; transition: all 0.2s; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
    .btn-outline-primary:hover { background: #1a237e; color: #fff; }
    
    .btn-outline-danger { border: 1px solid #d32f2f; color: #d32f2f; background: transparent; padding: 8px 16px; border-radius: 4px; font-weight: 600; font-size: 13px; transition: all 0.2s; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
    .btn-outline-danger:hover { background: #d32f2f; color: #fff; }
    
    .btn-outline-success { border: 1px solid #2e7d32; color: #2e7d32; background: transparent; padding: 8px 16px; border-radius: 4px; font-weight: 600; font-size: 13px; transition: all 0.2s; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
    .btn-outline-success:hover { background: #2e7d32; color: #fff; }
  `]
})
export class FicheContratComponent implements OnInit, OnDestroy {
  contrat: Contrat | null = null;
  activeTab: string = 'informations';
  loading: boolean = true;
  currentId: string | null = '';
  private routeSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contratSvc: ContratService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.currentId = id;
    
    if (id && id !== 'NaN' && id !== 'undefined' && id !== 'null') {
      this.routeSub = this.contratSvc.getById(Number(id)).subscribe({
        next: (res: any) => {
          this.contrat = res.data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Erreur API", err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy(): void {
    if (this.routeSub) this.routeSub.unsubscribe();
  }

  back(): void {
    this.router.navigate(['/contrats']);
  }

  getBadgeClass(statut: string): string {
    switch(statut) {
      case 'ACTIF': return 'badge-actif';
      case 'RESILIE': return 'badge-resilie';
      case 'ARCHIVE': return 'badge-archive';
      default: return '';
    }
  }

  getTypeClass(type: string): string {
    return type === 'LOCATAIRE' ? 'badge-loc' : 'badge-prop';
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR');
  }

  getBadgePaiementClass(statut: string): string {
    switch(statut) {
      case 'paye': return 'badge-actif';
      case 'en_retard': return 'badge-resilie';
      case 'annule': return 'badge-archive';
      default: return '';
    }
  }

  exportPdf(): void {
    if (this.contrat && this.contrat.id_contrat) {
      window.open(`http://localhost:8000/api/contrats/${this.contrat.id_contrat}/export/pdf`, '_blank');
    }
  }

  exportCsv(): void {
    if (this.contrat && this.contrat.id_contrat) {
      window.open(`http://localhost:8000/api/contrats/${this.contrat.id_contrat}/export/csv`, '_blank');
    }
  }
}
