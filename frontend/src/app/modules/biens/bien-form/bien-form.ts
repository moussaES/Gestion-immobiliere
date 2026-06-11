import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BienService } from '../../../core/services/bien.service';
import { ProprietaireService } from '../../../core/services/proprietaire.service';
import { Proprietaire } from '../../../core/models';

@Component({
  selector: 'app-bien-form',
  templateUrl: './bien-form.html',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
})
export class BienFormComponent implements OnInit {
  form:          FormGroup;
  proprietaires: Proprietaire[] = [];
  isEdit         = false;
  
  @Input() bienId?: number;
  @Input() isEmbedded = false;

  loading        = false;
  erreur         = '';

  constructor(
    private fb:       FormBuilder,
    private bienSvc:  BienService,
    private propSvc:  ProprietaireService,
    private route:    ActivatedRoute,
    private router:   Router,
  ) {
    this.form = this.fb.group({
      reference:       ['', Validators.required],
      type:            ['appartement', Validators.required],
      adresse:         ['', Validators.required],
      ville:           ['', Validators.required],
      surface:         [0, [Validators.required, Validators.min(1)]],
      loyer_mensuel:   [0, [Validators.required, Validators.min(1)]],
      charges:         [0, Validators.required],
      description:     [''],
      statut:          ['libre', Validators.required],
      id_proprietaire: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    // Charger propriétaires pour le select
    this.propSvc.getAll().subscribe(r => this.proprietaires = r.data.data);

    // Mode édition
    if (this.bienId) {
      this.chargerPourEdition(this.bienId);
    } else {
      this.route.paramMap.subscribe(params => {
        const idParam = params.get('id');
        if (idParam) {
          this.bienId = Number(idParam);
          this.chargerPourEdition(this.bienId);
        }
      });
    }
  }

  chargerPourEdition(id: number): void {
    console.log("Mode édition activé pour l'ID :", id);
    this.isEdit = true;
    this.bienSvc.getById(id).subscribe({
      next: (r: any) => {
        console.log("Données du bien reçues :", r);
        this.form.patchValue(r.data);
      },
      error: (err: any) => {
        console.error("Erreur API :", err);
        this.erreur = "Erreur de chargement des données : " + (err.message || JSON.stringify(err));
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const action = this.isEdit
      ? this.bienSvc.update(this.bienId!, this.form.value)
      : this.bienSvc.create(this.form.value);

    action.subscribe({
      next:  ()    => this.router.navigate(['/biens']),
      error: (err) => { this.erreur = err.message; this.loading = false; },
    });
  }
}