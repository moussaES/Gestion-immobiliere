import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaiementService } from '../../../core/services/paiement.service';
import { ContratService } from '../../../core/services/contrat.service';

@Component({
  selector: 'app-paiement-form',
  templateUrl: './paiement-form.html',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
})
export class PaiementFormComponent implements OnInit {
  form:    FormGroup;
  isEdit   = false;
  paiementId?: number;
  loading  = false;
  erreur   = '';

  contrats: any[] = [];

  constructor(
    private fb:          FormBuilder,
    private paiementSvc: PaiementService,
    private contratSvc:  ContratService,
    private route:       ActivatedRoute,
    private router:      Router,
  ) {
    this.form = this.fb.group({
      reference:     ['', Validators.required],
      date_paiement: ['', Validators.required],
      montant:       [0, [Validators.required, Validators.min(1)]],
      mode:          ['especes', Validators.required],
      statut:        ['paye', Validators.required],
      mois_concerne: ['', Validators.required],
      note:          [''],
      id_contrat:    [null, Validators.required],
    });
  }

  ngOnInit(): void {
    // Charger les contrats
    this.contratSvc.getAll().subscribe(r => this.contrats = r.data.data || r.data);

    this.paiementId = Number(this.route.snapshot.params['id']);
    if (this.paiementId) {
      this.isEdit = true;
      this.paiementSvc.getById(this.paiementId).subscribe({
        next: (r: any) => this.form.patchValue(r.data),
        error: (err: any) => this.erreur = "Erreur de chargement des données"
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    
    const action = this.isEdit
      ? this.paiementSvc.update(this.paiementId!, this.form.value)
      : this.paiementSvc.create(this.form.value);

    action.subscribe({
      next:  ()    => this.router.navigate(['/paiements']),
      error: (err: any) => { this.erreur = err.message || 'Une erreur est survenue'; this.loading = false; },
    });
  }
}
