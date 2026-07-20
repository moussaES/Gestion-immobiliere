import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContratService } from '../../../core/services/contrat.service';
import { BienService } from '../../../core/services/bien.service';
import { LocataireService } from '../../../core/services/locataire.service';
import { ProprietaireService } from '../../../core/services/proprietaire.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-contrat-form',
  templateUrl: './contrat-form.html',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
})
export class ContratFormComponent implements OnInit {
  form:    FormGroup;
  isEdit   = false;
  contratId?: number;
  loading  = false;
  erreur   = '';

  biens: any[] = [];
  locataires: any[] = [];
  proprietaires: any[] = [];

  constructor(
    private fb:       FormBuilder,
    private contratSvc: ContratService,
    private bienSvc:    BienService,
    private locSvc:     LocataireService,
    private propSvc:    ProprietaireService,
    private route:    ActivatedRoute,
    private router:   Router,
    private toastSvc: ToastService
  ) {
    this.form = this.fb.group({
      reference:       ['', Validators.required],
      type_contrat:    ['LOCATAIRE', Validators.required],
      date_debut:      ['', Validators.required],
      date_fin:        ['', Validators.required],
      montant:         [0, [Validators.required, Validators.min(1)]],
      statut:          ['ACTIF', Validators.required],
      id_bien:         [null, Validators.required],
      id_locataire:    [null],
      id_proprietaire: [null, Validators.required],
      notes:           [''],
    });
  }

  ngOnInit(): void {
    // Charger les listes pour les select
    this.bienSvc.getAll().subscribe(r => this.biens = r.data.data || r.data);
    this.locSvc.getAll().subscribe(r => this.locataires = r.data.data || r.data);
    this.propSvc.getAll().subscribe(r => this.proprietaires = r.data.data || r.data);

    this.contratId = Number(this.route.snapshot.params['id']);
    if (this.contratId) {
      this.isEdit = true;
      this.contratSvc.getById(this.contratId).subscribe({
        next: (r: any) => this.form.patchValue(r.data),
        error: (err: any) => {
          this.erreur = "Erreur de chargement des données";
          this.toastSvc.error(this.erreur);
        }
      });
    } else {
      this.genererReference(this.form.get('type_contrat')?.value);
    }
    
    this.form.get('type_contrat')?.valueChanges.subscribe(type => {
      if (!this.isEdit) {
        this.genererReference(type);
      }
    });
  }

  genererReference(type: string): void {
    const prefix = type === 'LOCATAIRE' ? 'CTR-LOC-' : 'CTR-PROP-';
    
    this.contratSvc.getAll().subscribe((r: any) => {
      const contrats = r.data.data || r.data || [];
      if (contrats.length === 0) {
        this.form.patchValue({ reference: `${prefix}001` });
        return;
      }
      
      let maxNum = 0;
      contrats.forEach((c: any) => {
        if (c.reference && c.reference.toUpperCase().startsWith(prefix)) {
          const parts = c.reference.split(prefix);
          if (parts.length > 1) {
            const num = parseInt(parts[1], 10);
            if (!isNaN(num) && num > maxNum) {
              maxNum = num;
            }
          }
        }
      });
      
      const nextNum = maxNum + 1;
      const nextRef = `${prefix}${nextNum.toString().padStart(3, '0')}`;
      this.form.patchValue({ reference: nextRef });
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    
    const action = this.isEdit
      ? this.contratSvc.update(this.contratId!, this.form.value)
      : this.contratSvc.create(this.form.value);

    action.subscribe({
      next:  () => {
        this.toastSvc.success(this.isEdit ? 'Contrat modifié avec succès' : 'Contrat créé avec succès');
        this.router.navigate(['/contrats']);
      },
      error: (err: any) => { 
        this.erreur = err.message || 'Une erreur est survenue'; 
        this.toastSvc.error(this.erreur);
        this.loading = false; 
      },
    });
  }
}
