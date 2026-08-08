import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { TravailService } from '../../../core/services/travail.service';
import { Travail } from '../../../core/models/travail.model';

@Component({
  selector: 'app-fiche-travail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container" *ngIf="travail">
      <div class="header-actions">
        <a routerLink="/travaux" class="back-link"><i class="fas fa-arrow-left"></i> Retour aux travaux</a>
        <a [routerLink]="['/travaux/modifier', travail.id_travail]" class="btn-primary">Modifier</a>
      </div>

      <div class="content-grid">
        <div class="main-column">
          <div class="card info-card">
            <div class="card-header">
              <h2>{{ travail.titre }}</h2>
              <span class="status-badge" [ngClass]="travail.statut.toLowerCase()">
                  {{ travail.statut }}
              </span>
            </div>
            
            <div class="info-section">
              <h3>Détails du travail</h3>
              <p class="description">{{ travail.description || 'Aucune description fournie.' }}</p>
              
              <div class="details-grid">
                <div class="detail-item">
                  <div class="detail-label">Date prévue</div>
                  <div class="detail-value">{{ travail.date_intervention | date:'longDate' }}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Montant</div>
                  <div class="detail-value highlight">{{ travail.montant | currency:'XOF':'symbol':'1.0-0' }}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Bien concerné</div>
                  <div class="detail-value">
                    <a *ngIf="travail.bien" [routerLink]="['/biens', travail.id_bien]">{{ travail.bien.reference }}</a>
                    <span *ngIf="!travail.bien">-</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="side-column">
          <div class="card side-card">
            <h3>Intervenant</h3>
            <div class="contact-info" *ngIf="travail.prestataire">
              <div class="contact-name">{{ travail.prestataire.nom }} {{ travail.prestataire.prenom }}</div>
              <div class="contact-role">{{ travail.prestataire.specialite }}</div>
              
              <div class="contact-details">
                <div class="contact-row" *ngIf="travail.prestataire.telephone">
                  <i class="fas fa-phone"></i>
                  <span>{{ travail.prestataire.telephone }}</span>
                </div>
                <div class="contact-row" *ngIf="travail.prestataire.adresse">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>{{ travail.prestataire.adresse }}</span>
                </div>
              </div>
            </div>
            <div class="empty-info" *ngIf="!travail.prestataire">
              Aucun prestataire assigné
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; background: #f4f6f9; min-height: 100vh; }
    .header-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .back-link { color: #555; text-decoration: none; font-weight: 500; display: flex; align-items: center; gap: 8px; }
    .back-link:hover { color: #1a237e; }
    .btn-primary { background: #1a237e; color: #fff; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-weight: 600; font-size: 13px; }
    .content-grid { display: flex; gap: 24px; }
    .main-column { flex: 2; }
    .side-column { flex: 1; }
    .card { background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); padding: 24px; margin-bottom: 24px; }
    .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #eee; }
    .card-header h2 { font-size: 24px; margin: 0; color: #333; }
    h3 { font-size: 16px; margin: 0 0 16px 0; color: #333; font-weight: 600; }
    .description { color: #555; line-height: 1.6; margin-bottom: 24px; white-space: pre-line; }
    .details-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .detail-label { font-size: 12px; color: #777; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
    .detail-value { font-size: 15px; color: #333; font-weight: 500; }
    .detail-value a { color: #1a237e; text-decoration: none; }
    .detail-value a:hover { text-decoration: underline; }
    .highlight { font-size: 18px; color: #1a237e; font-weight: 700; }
    
    .contact-name { font-size: 18px; font-weight: 600; color: #333; }
    .contact-role { font-size: 14px; color: #1a237e; margin-bottom: 16px; }
    .contact-details { border-top: 1px solid #eee; padding-top: 16px; }
    .contact-row { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; color: #555; font-size: 14px; }
    .contact-row i { color: #999; margin-top: 3px; }
    .empty-info { color: #999; font-style: italic; }
    
    .status-badge { display: inline-block; padding: 6px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
    .prevu { background: #e3f2fd; color: #1565c0; }
    .en_cours { background: #fff3e0; color: #e65100; }
    .termine { background: #e8f5e9; color: #2e7d32; }
    .annule { background: #ffebee; color: #c62828; }
  `]
})
export class FicheTravailComponent implements OnInit {
  travail: Travail | null = null;

  constructor(
    private route: ActivatedRoute,
    private travailSvc: TravailService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.travailSvc.getById(+id).subscribe({
        next: (res: any) => {
          this.travail = res.data;
        }
      });
    }
  }
}
