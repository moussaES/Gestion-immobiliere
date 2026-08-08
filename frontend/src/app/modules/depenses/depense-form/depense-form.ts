import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DepenseService } from '../../../core/services/depense.service';
import { BienService } from '../../../core/services/bien.service';
import { PrestataireService } from '../../../core/services/prestataire.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-depense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>{{ isEditMode ? 'Modifier la dépense' : 'Enregistrer une dépense' }}</h2>
        <p>Renseignez les informations de la dépense ci-dessous.</p>
      </div>

      <div class="form-card">
        <form [formGroup]="depenseForm" (ngSubmit)="onSubmit()">
          
          <div class="form-section">
            <div class="form-section-title">Type de Dépense</div>
            <div class="type-selector">
              <div class="type-option" [class.selected]="depenseForm.get('type_depense')?.value === 'AGENCE'" (click)="setType('AGENCE')">
                <div class="type-icon"><i class="fas fa-building"></i></div>
                <div class="type-label">Dépense d'Agence</div>
                <div class="type-desc">Liée au fonctionnement de l'agence</div>
              </div>
              <div class="type-option" [class.selected]="depenseForm.get('type_depense')?.value === 'BIEN'" (click)="setType('BIEN')">
                <div class="type-icon"><i class="fas fa-home"></i></div>
                <div class="type-label">Dépense sur un Bien</div>
                <div class="type-desc">Travaux, réparations, entretiens</div>
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">Informations de la Dépense</div>
            
            <div class="form-row" *ngIf="depenseForm.get('type_depense')?.value === 'AGENCE'">
              <div class="form-group">
                <label>Catégorie</label>
                <select formControlName="categorie" [class.error]="isFieldInvalid('categorie')">
                  <option value="">Sélectionner une catégorie</option>
                  <option value="DEPLACEMENT">Déplacement</option>
                  <option value="ACHAT">Achat de matériel</option>
                  <option value="AUTRE">Autre</option>
                </select>
                <div class="error-msg" *ngIf="isFieldInvalid('categorie')">Ce champ est requis</div>
              </div>
            </div>

            <div class="form-row" *ngIf="depenseForm.get('type_depense')?.value === 'BIEN'">
              <div class="form-group">
                <label>Bien</label>
                <select formControlName="id_bien" (change)="onBienChange()" [class.error]="isFieldInvalid('id_bien')">
                  <option value="">Sélectionner un bien</option>
                  <option *ngFor="let b of biens" [value]="b.id_bien">{{ b.reference || b.adresse }}</option>
                </select>
                <div class="error-msg" *ngIf="isFieldInvalid('id_bien')">Ce champ est requis</div>
                
                <div class="prop-info" *ngIf="selectedProprietaire">
                  <strong>Propriétaire:</strong> {{ selectedProprietaire.prenom }} {{ selectedProprietaire.nom }}
                </div>
              </div>
              
              <div class="form-group">
                <label>Prestataire (Optionnel)</label>
                <select formControlName="id_prestataire">
                  <option value="">Sélectionner un prestataire</option>
                  <option *ngFor="let p of prestataires" [value]="p.id_prestataire">{{ p.nom_entreprise || (p.prenom + ' ' + p.nom) }}</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group full">
                <label>Description</label>
                <textarea formControlName="description" rows="3" [class.error]="isFieldInvalid('description')"></textarea>
                <div class="error-msg" *ngIf="isFieldInvalid('description')">La description est requise</div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Montant (FCFA)</label>
                <input type="number" formControlName="montant" [class.error]="isFieldInvalid('montant')">
                <div class="error-msg" *ngIf="isFieldInvalid('montant')">Le montant est requis</div>
              </div>
              <div class="form-group">
                <label>Date de la dépense</label>
                <input type="date" formControlName="date_depense" [class.error]="isFieldInvalid('date_depense')">
                <div class="error-msg" *ngIf="isFieldInvalid('date_depense')">La date est requise</div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <a routerLink="/depenses" class="btn btn-secondary">Annuler</a>
            <button type="submit" class="btn btn-primary" [disabled]="isSubmitting">
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
    .form-section { margin-bottom: 24px; }
    .form-section-title { font-size: 15px; font-weight: 600; color: #1a237e; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #eee; }
    .form-row { display: flex; gap: 24px; margin-bottom: 20px; }
    .form-group { flex: 1; display: flex; flex-direction: column; }
    .form-group.full { flex: 1 1 100%; }
    .form-group label { font-size: 13px; font-weight: 600; color: #555; margin-bottom: 6px; }
    .form-group input, .form-group select, .form-group textarea { border: 1px solid #ddd; border-radius: 4px; padding: 10px 12px; font-size: 14px; outline: none; transition: border 0.2s; }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #1a237e; }
    .form-group .error { border-color: #c62828; }
    .error-msg { color: #c62828; font-size: 12px; margin-top: 4px; }
    .type-selector { display: flex; gap: 16px; margin-bottom: 24px; }
    .type-option { flex: 1; padding: 16px; border: 2px solid #ddd; border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s; }
    .type-option:hover { border-color: #1a237e; }
    .type-option.selected { border-color: #1a237e; background: #e8eaf6; }
    .type-option .type-icon { font-size: 24px; margin-bottom: 8px; }
    .type-option .type-label { font-weight: 600; font-size: 14px; color: #333; }
    .type-option .type-desc { font-size: 12px; color: #666; margin-top: 4px; }
    .prop-info { background: #f5f5f5; padding: 12px 16px; border-radius: 4px; margin-top: 8px; font-size: 13px; color: #555; }
    .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #eee; }
    .btn { padding: 10px 24px; border-radius: 4px; font-weight: 600; font-size: 14px; cursor: pointer; border: none; transition: all 0.2s; text-decoration: none; }
    .btn-primary { background: #1a237e; color: #fff; }
    .btn-primary:hover { background: #0d1654; }
    .btn-secondary { background: #f5f5f5; color: #555; }
    .btn-secondary:hover { background: #e0e0e0; }
  `]
})
export class DepenseFormComponent implements OnInit {
  depenseForm: FormGroup;
  isEditMode: boolean = false;
  depenseId!: number;
  isSubmitting: boolean = false;

  biens: any[] = [];
  prestataires: any[] = [];
  selectedProprietaire: any = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private depenseSvc: DepenseService,
    private bienSvc: BienService,
    private prestataireSvc: PrestataireService,
    private toastSvc: ToastService
  ) {
    this.depenseForm = this.fb.group({
      type_depense: ['AGENCE', Validators.required],
      categorie: [''],
      id_bien: [''],
      id_prestataire: [''],
      id_proprietaire: [''],
      description: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(0)]],
      date_depense: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadBiens();
    this.loadPrestataires();
    
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.depenseId = +idParam;
      this.loadDepense(this.depenseId);
    } else {
      this.setType('AGENCE'); // Default
    }
  }

  loadBiens(): void {
    this.bienSvc.getAll().subscribe({
      next: (res: any) => {
        this.biens = res.data?.data ? res.data.data : (res.data || []);
      },
      error: (err) => console.error(err)
    });
  }

  loadPrestataires(): void {
    this.prestataireSvc.getAll().subscribe({
      next: (res: any) => {
        this.prestataires = res.data?.data ? res.data.data : (res.data || []);
      },
      error: (err) => console.error(err)
    });
  }

  loadDepense(id: number): void {
    this.depenseSvc.getById(id).subscribe({
      next: (res: any) => {
        const d = res.data;
        this.depenseForm.patchValue({
          type_depense: d.type_depense,
          categorie: d.categorie || '',
          id_bien: d.id_bien || '',
          id_prestataire: d.id_prestataire || '',
          id_proprietaire: d.id_proprietaire || '',
          description: d.description,
          montant: d.montant,
          date_depense: d.date_depense
        });
        
        this.setType(d.type_depense);
        
        if (d.id_bien) {
          this.onBienChange();
        }
      },
      error: (err) => {
        console.error(err);
        this.toastSvc.error('Impossible de charger la dépense');
        this.router.navigate(['/depenses']);
      }
    });
  }

  setType(type: string): void {
    this.depenseForm.get('type_depense')?.setValue(type);
    
    if (type === 'AGENCE') {
      this.depenseForm.get('categorie')?.setValidators(Validators.required);
      this.depenseForm.get('id_bien')?.clearValidators();
      this.depenseForm.get('id_bien')?.setValue('');
      this.depenseForm.get('id_prestataire')?.setValue('');
      this.depenseForm.get('id_proprietaire')?.setValue('');
      this.selectedProprietaire = null;
    } else {
      this.depenseForm.get('categorie')?.clearValidators();
      this.depenseForm.get('categorie')?.setValue('');
      this.depenseForm.get('id_bien')?.setValidators(Validators.required);
    }
    
    this.depenseForm.get('categorie')?.updateValueAndValidity();
    this.depenseForm.get('id_bien')?.updateValueAndValidity();
  }

  onBienChange(): void {
    const bienId = this.depenseForm.get('id_bien')?.value;
    if (bienId) {
      const bien = this.biens.find(b => b.id_bien == bienId);
      if (bien && bien.proprietaire) {
        this.selectedProprietaire = bien.proprietaire;
        this.depenseForm.patchValue({
          id_proprietaire: bien.proprietaire.id_proprietaire || bien.id_proprietaire
        });
      } else {
        this.selectedProprietaire = null;
        this.depenseForm.patchValue({ id_proprietaire: bien?.id_proprietaire || '' });
      }
    } else {
      this.selectedProprietaire = null;
      this.depenseForm.patchValue({ id_proprietaire: '' });
    }
  }

  isFieldInvalid(field: string): boolean {
    const f = this.depenseForm.get(field);
    return !!(f && f.invalid && (f.dirty || f.touched));
  }

  onSubmit(): void {
    if (this.depenseForm.invalid) {
      this.depenseForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.depenseForm.value;

    if (this.isEditMode) {
      this.depenseSvc.update(this.depenseId, formValue).subscribe({
        next: () => {
          this.toastSvc.success('Dépense modifiée avec succès');
          this.router.navigate(['/depenses']);
        },
        error: (err) => {
          console.error(err);
          this.toastSvc.error('Erreur lors de la modification');
          this.isSubmitting = false;
        }
      });
    } else {
      this.depenseSvc.create(formValue).subscribe({
        next: () => {
          this.toastSvc.success('Dépense enregistrée avec succès');
          this.router.navigate(['/depenses']);
        },
        error: (err) => {
          console.error(err);
          this.toastSvc.error("Erreur lors de l'enregistrement");
          this.isSubmitting = false;
        }
      });
    }
  }
}
