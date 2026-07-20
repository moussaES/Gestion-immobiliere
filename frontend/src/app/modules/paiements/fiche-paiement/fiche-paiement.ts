import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaiementService } from '../../../core/services/paiement.service';
import { Paiement } from '../../../core/models';

@Component({
  selector: 'app-fiche-paiement',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="fiche-section">
      <div class="back-btn" (click)="back()">
        &#8592; Retour aux paiements
      </div>

      <div class="fiche-header" *ngIf="paiement">
        <div class="header-info">
          <div class="icon-circle"><i class="fas fa-money-bill-wave"></i></div>
          <div>
            <h2>Paiement {{ paiement.reference || 'Sans Référence' }}</h2>
            <p class="contact-info">
              <span>&#128197;</span> {{ formatDate(paiement.date_paiement) }} | 
              <span class="badge" [ngClass]="getBadgeClass(paiement.statut)">{{ paiement.statut }}</span>
            </p>
          </div>
        </div>
      </div>

      <div *ngIf="!paiement && !loading" style="padding: 40px; text-align: center; color: red; font-size: 18px; background: white; border-radius: 8px; margin-top: 20px;">
        ⚠️ Erreur : Impossible de charger les données du paiement (URL: {{ currentId }}).
      </div>
      <div *ngIf="loading" style="padding: 40px; text-align: center; color: #666; font-size: 16px; background: white; border-radius: 8px; margin-top: 20px;">
        <i class="fas fa-spinner fa-spin"></i> Chargement du paiement en cours...
      </div>

      <div class="tabs" *ngIf="paiement">
        <div class="tab-header">
          <button [class.active]="activeTab === 'informations'" (click)="activeTab = 'informations'">Informations</button>
          <button [class.active]="activeTab === 'documents'" (click)="activeTab = 'documents'">Documents</button>
        </div>
        <div class="tab-content">
          <!-- ONGLET INFORMATIONS -->
          <div class="tab-pane" *ngIf="activeTab === 'informations'">
            <div class="list-header" style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
              <a [routerLink]="['/paiements/modifier', paiement.id_paiement]" class="btn btn-outline-primary">
                <i class="fas fa-pencil-alt"></i> Modifier le paiement
              </a>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <label>Référence</label>
                <p>{{ paiement.reference }}</p>
              </div>
              <div class="info-item">
                <label>Montant</label>
                <p class="amount">{{ paiement.montant }} FCFA</p>
              </div>
              <div class="info-item">
                <label>Mode de paiement</label>
                <p style="text-transform: capitalize;">{{ paiement.mode }}</p>
              </div>
              <div class="info-item">
                <label>Date du paiement</label>
                <p>{{ formatDate(paiement.date_paiement) }}</p>
              </div>
              <div class="info-item">
                <label>Mois concerné</label>
                <p>{{ paiement.mois_concerne }}</p>
              </div>
              <div class="info-item">
                <label>Statut</label>
                <p><span class="badge" [ngClass]="getBadgeClass(paiement.statut)">{{ paiement.statut }}</span></p>
              </div>
            </div>

            <div class="info-grid" style="margin-top: 24px;">
              <div class="info-item" style="grid-column: 1 / -1;">
                <label>Notes / Observations</label>
                <p>{{ paiement.note || 'Aucune note.' }}</p>
              </div>
            </div>

            <h3 style="margin-top: 30px; font-size: 16px; color: #333;">Contrat lié</h3>
            <div class="info-grid" style="margin-top: 15px;">
              <div class="info-item" *ngIf="paiement.contrat">
                <label>Référence du Contrat</label>
                <p>{{ paiement.contrat.reference }}</p>
                <a [routerLink]="['/contrats', paiement.id_contrat]" style="font-size: 13px; color: #1a237e; text-decoration: none;">Voir le contrat</a>
              </div>
              <div class="info-item" *ngIf="paiement.contrat?.locataire">
                <label>Locataire</label>
                <p>{{ paiement.contrat.locataire.prenom }} {{ paiement.contrat.locataire.nom }}</p>
              </div>
              <div class="info-item" *ngIf="paiement.contrat?.proprietaire">
                <label>Propriétaire</label>
                <p>{{ paiement.contrat.proprietaire.prenom }} {{ paiement.contrat.proprietaire.nom }}</p>
              </div>
              <div class="info-item" *ngIf="!paiement.contrat">
                <label>Contrat ID</label>
                <p>#{{ paiement.id_contrat }}</p>
              </div>
            </div>
          </div>

          <!-- ONGLET DOCUMENTS -->
          <div class="tab-pane" *ngIf="activeTab === 'documents'">
            <div class="empty-state">Aucun reçu ou document rattaché à ce paiement pour le moment.</div>
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
    .icon-circle { width: 64px; height: 64px; border-radius: 8px; background: #e8f5e9; color: #2e7d32; display: flex; align-items: center; justify-content: center; font-size: 24px; }
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
    .amount { color: #2e7d32 !important; font-weight: 700 !important; font-size: 16px !important; }
    .empty-state { text-align: center; color: #999; padding: 30px !important; }
    
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-block; text-align: center; text-transform: uppercase; }
    .badge-paye { background: #e8f5e9; color: #2e7d32; }
    .badge-en_attente { background: #fff8e1; color: #f57f17; }
    .badge-impaye { background: #ffebee; color: #c62828; }
    .badge-en_retard { background: #ffebee; color: #c62828; }
    .badge-annule { background: #f5f5f5; color: #757575; }

    .btn-outline-primary { border: 1px solid #1a237e; color: #1a237e; background: transparent; padding: 8px 16px; border-radius: 4px; font-weight: 600; text-decoration: none; font-size: 13px; transition: all 0.2s; cursor: pointer; display: inline-block; }
    .btn-outline-primary:hover { background: #1a237e; color: #fff; }
  `]
})
export class FichePaiementComponent implements OnInit, OnDestroy {
  paiement: Paiement | null = null;
  activeTab: string = 'informations';
  loading: boolean = true;
  currentId: string | null = '';
  private routeSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paiementSvc: PaiementService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.currentId = id;

    if (id && id !== 'NaN' && id !== 'undefined' && id !== 'null') {
      this.routeSub = this.paiementSvc.getById(Number(id)).subscribe({
        next: (res: any) => {
          this.paiement = res.data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Erreur de chargement", err);
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
    this.router.navigate(['/paiements']);
  }

  getBadgeClass(statut: string): string {
    const s = statut ? statut.toLowerCase() : '';
    switch(s) {
      case 'paye': 
      case 'payé': return 'badge-paye';
      case 'en_attente': 
      case 'en attente': return 'badge-en_attente';
      case 'impaye': 
      case 'impayé': return 'badge-impaye';
      case 'en_retard': return 'badge-en_retard';
      case 'annule': return 'badge-annule';
      default: return '';
    }
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR');
  }
}
