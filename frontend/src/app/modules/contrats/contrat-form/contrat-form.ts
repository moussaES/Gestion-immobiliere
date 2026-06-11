import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContratService } from '../../../core/services/contrat.service';
import { BienService } from '../../../core/services/bien.service';
import { LocataireService } from '../../../core/services/locataire.service';
import { ProprietaireService } from '../../../core/services/proprietaire.service';

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
  ) {
    this.form = this.fb.group({
      reference:       ['', Validators.required],
      type:            ['location', Validators.required],
      date_debut:      ['', Validators.required],
      date_fin:        ['', Validators.required],
      montant:         [0, [Validators.required, Validators.min(1)]],
      depot_garantie:  [0, [Validators.required, Validators.min(0)]],
      statut:          ['actif', Validators.required],
      id_bien:         [null, Validators.required],
      id_locataire:    [null, Validators.required],
      id_proprietaire: [null, Validators.required],
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
        error: (err: any) => this.erreur = "Erreur de chargement des données"
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    
    const action = this.isEdit
      ? this.contratSvc.update(this.contratId!, this.form.value)
      : this.contratSvc.create(this.form.value);

    action.subscribe({
      next:  ()    => this.router.navigate(['/contrats']),
      error: (err: any) => { this.erreur = err.message || 'Une erreur est survenue'; this.loading = false; },
    });
  }
}
