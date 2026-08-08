import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TravailService } from '../../../core/services/travail.service';
import { PrestataireService } from '../../../core/services/prestataire.service';
import { BienService } from '../../../core/services/bien.service';
import { Travail, StatutTravail } from '../../../core/models/travail.model';
import { Prestataire } from '../../../core/models/prestataire.model';
import { Bien } from '../../../core/models/bien.model';

@Component({
  selector: 'app-travail-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="form-header">
        <h2>{{ isEditMode ? 'Modifier' : 'Nouveau' }} Travail</h2>
        <a routerLink="/travaux" class="back-link"><i class="fas fa-arrow-left"></i> Retour</a>
      </div>

      <div class="form-card">
        <form (ngSubmit)="onSubmit()" #travailForm="ngForm">
          <div class="form-row">
            <div class="form-group">
              <label>Titre *</label>
              <input type="text" name="titre" [(ngModel)]="travail.titre" required class="form-control">
            </div>
            <div class="form-group">
              <label>Statut *</label>
              <select name="statut" [(ngModel)]="travail.statut" required class="form-control">
                <option value="PREVU">Prévu</option>
                <option value="EN_COURS">En cours</option>
                <option value="TERMINE">Terminé</option>
                <option value="ANNULE">Annulé</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Bien concerné *</label>
              <select name="id_bien" [(ngModel)]="travail.id_bien" required class="form-control">
                <option [ngValue]="null">Sélectionnez un bien</option>
                <option *ngFor="let b of biens" [value]="b.id_bien">{{ b.reference }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Prestataire</label>
              <select name="id_prestataire" [(ngModel)]="travail.id_prestataire" class="form-control">
                <option [ngValue]="null">Aucun (ou à définir)</option>
                <option *ngFor="let p of prestataires" [value]="p.id_prestataire">{{ p.nom }} {{ p.prenom }} - {{ p.specialite }}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Date d'intervention *</label>
              <input type="date" name="date_intervention" [(ngModel)]="travail.date_intervention" required class="form-control">
            </div>
            <div class="form-group">
              <label>Montant (XOF) *</label>
              <input type="number" name="montant" [(ngModel)]="travail.montant" required class="form-control">
            </div>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea name="description" [(ngModel)]="travail.description" rows="4" class="form-control"></textarea>
          </div>

          <div class="form-actions">
            <button type="button" routerLink="/travaux" class="btn-cancel">Annuler</button>
            <button type="submit" [disabled]="!travailForm.form.valid" class="btn-submit">
              {{ isEditMode ? 'Enregistrer les modifications' : 'Créer le travail' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; background: #f4f6f9; min-height: 100vh; }
    .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .form-header h2 { font-size: 22px; font-weight: 600; color: #333; margin: 0; }
    .back-link { color: #1a237e; text-decoration: none; font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 8px; }
    .back-link:hover { text-decoration: underline; }
    .form-card { background: #fff; border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); max-width: 800px; margin: 0 auto; }
    .form-row { display: flex; gap: 20px; margin-bottom: 16px; }
    .form-group { flex: 1; margin-bottom: 16px; display: flex; flex-direction: column; }
    label { font-size: 13px; font-weight: 600; color: #555; margin-bottom: 8px; }
    .form-control { padding: 10px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; outline: none; transition: border-color 0.2s; font-family: inherit; }
    .form-control:focus { border-color: #1a237e; }
    textarea.form-control { resize: vertical; }
    .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; }
    button { cursor: pointer; font-size: 14px; font-weight: 600; padding: 10px 20px; border-radius: 4px; border: none; transition: all 0.2s; }
    .btn-cancel { background: #f5f5f5; color: #555; }
    .btn-cancel:hover { background: #e0e0e0; }
    .btn-submit { background: #1a237e; color: #fff; }
    .btn-submit:hover:not([disabled]) { background: #121858; }
    .btn-submit[disabled] { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class TravailFormComponent implements OnInit {
  isEditMode = false;
  travail: Partial<Travail> = {
    titre: '',
    statut: 'PREVU',
    montant: 0,
    date_intervention: '',
    description: ''
  };
  
  prestataires: Prestataire[] = [];
  biens: Bien[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private travailSvc: TravailService,
    private prestataireSvc: PrestataireService,
    private bienSvc: BienService
  ) {}

  ngOnInit(): void {
    this.loadDependencies();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.travailSvc.getById(+id).subscribe({
        next: (res: any) => {
          this.travail = res.data;
          if (this.travail.date_intervention) {
             this.travail.date_intervention = this.travail.date_intervention.substring(0, 10);
          }
        }
      });
    }
  }

  loadDependencies(): void {
    this.prestataireSvc.getAll().subscribe(res => {
      this.prestataires = res.data?.data ? res.data.data : (res.data || []);
    });
    this.bienSvc.getAll().subscribe((res: any) => {
      this.biens = res.data?.data ? res.data.data : (res.data || []);
    });
  }

  onSubmit(): void {
    if (this.isEditMode && this.travail.id_travail) {
      this.travailSvc.update(this.travail.id_travail, this.travail).subscribe({
        next: () => this.router.navigate(['/travaux']),
        error: (err) => { alert('Erreur lors de la modification'); console.error(err); }
      });
    } else {
      this.travailSvc.create(this.travail).subscribe({
        next: () => this.router.navigate(['/travaux']),
        error: (err) => { alert('Erreur lors de la création'); console.error(err); }
      });
    }
  }
}
