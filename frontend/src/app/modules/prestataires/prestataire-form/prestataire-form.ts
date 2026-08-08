import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { PrestataireService } from '../../../core/services/prestataire.service';

@Component({
  selector: 'app-prestataire-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>{{ isEditMode ? 'Modifier le prestataire' : 'Nouveau prestataire' }}</h2>
        <p>{{ isEditMode ? 'Mettez à jour les informations du prestataire.' : 'Remplissez le formulaire pour ajouter un prestataire.' }}</p>
      </div>

      <div class="form-card">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          
          <div class="form-row">
            <div class="form-group">
              <label>Nom</label>
              <input type="text" formControlName="nom" placeholder="Ex: Dupont" [class.error]="isFieldInvalid('nom')">
              <div *ngIf="isFieldInvalid('nom')" class="error-msg">Le nom est requis.</div>
            </div>
            <div class="form-group">
              <label>Prénom</label>
              <input type="text" formControlName="prenom" placeholder="Ex: Jean" [class.error]="isFieldInvalid('prenom')">
              <div *ngIf="isFieldInvalid('prenom')" class="error-msg">Le prénom est requis.</div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Spécialité</label>
              <input type="text" formControlName="specialite" placeholder="Ex: Plombier" [class.error]="isFieldInvalid('specialite')">
              <div *ngIf="isFieldInvalid('specialite')" class="error-msg">La spécialité est requise.</div>
            </div>
            <div class="form-group">
              <label>Téléphone</label>
              <input type="text" formControlName="telephone" placeholder="Ex: 06 12 34 56 78" [class.error]="isFieldInvalid('telephone')">
              <div *ngIf="isFieldInvalid('telephone')" class="error-msg">Le téléphone est requis.</div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Adresse</label>
              <input type="text" formControlName="adresse" placeholder="Ex: 10 rue de la Paix, Paris">
            </div>
          </div>

          <div class="form-actions">
            <a routerLink="/prestataires" class="btn btn-secondary">Annuler</a>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || isSubmitting">
              {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; background: #f4f6f9; min-height: 100vh; }
    .page-header { margin-bottom: 24px; }
    .page-header h2 { font-size: 22px; font-weight: 600; color: #333; margin: 0 0 4px; }
    .page-header p { color: #666; font-size: 14px; margin: 0; }
    .form-card { background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); padding: 32px; }
    .form-row { display: flex; gap: 24px; margin-bottom: 20px; }
    .form-group { flex: 1; display: flex; flex-direction: column; }
    .form-group label { font-size: 13px; font-weight: 600; color: #555; margin-bottom: 6px; }
    .form-group input, .form-group select, .form-group textarea { border: 1px solid #ddd; border-radius: 4px; padding: 10px 12px; font-size: 14px; outline: none; transition: border 0.2s; }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #1a237e; }
    .form-group .error { border-color: #c62828; }
    .error-msg { color: #c62828; font-size: 12px; margin-top: 4px; }
    .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #eee; }
    .btn { padding: 10px 24px; border-radius: 4px; font-weight: 600; font-size: 14px; cursor: pointer; border: none; transition: all 0.2s; text-decoration: none; }
    .btn-primary { background: #1a237e; color: #fff; }
    .btn-primary:hover { background: #0d1654; }
    .btn-secondary { background: #f5f5f5; color: #555; }
    .btn-secondary:hover { background: #e0e0e0; }
  `]
})
export class PrestataireFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  prestataireId: number | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private prestataireSvc: PrestataireService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      specialite: ['', Validators.required],
      telephone: ['', Validators.required],
      adresse: ['']
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.prestataireId = +idParam;
      this.loadData(this.prestataireId);
    }
  }

  loadData(id: number): void {
    this.prestataireSvc.getById(id).subscribe({
      next: (res) => {
        if (res.data) {
          this.form.patchValue(res.data);
        }
      },
      error: (err) => {
        console.error('Erreur', err);
        alert('Impossible de charger le prestataire');
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const prestataireData = this.form.value;

    if (this.isEditMode && this.prestataireId) {
      this.prestataireSvc.update(this.prestataireId, prestataireData).subscribe({
        next: () => {
          this.router.navigate(['/prestataires']);
        },
        error: (err) => {
          console.error('Erreur', err);
          alert('Erreur lors de la mise à jour');
          this.isSubmitting = false;
        }
      });
    } else {
      this.prestataireSvc.create(prestataireData).subscribe({
        next: () => {
          this.router.navigate(['/prestataires']);
        },
        error: (err) => {
          console.error('Erreur', err);
          alert('Erreur lors de la création');
          this.isSubmitting = false;
        }
      });
    }
  }
}
