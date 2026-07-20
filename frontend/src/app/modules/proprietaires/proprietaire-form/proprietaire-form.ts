import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProprietaireService } from '../../../core/services/proprietaire.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-proprietaire-form',
  templateUrl: './proprietaire-form.html',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
})
export class ProprietaireFormComponent implements OnInit {
  form:    FormGroup;
  isEdit   = false;

  @Input() propId?: number;
  @Input() isEmbedded = false;

  loading  = false;
  erreur   = '';

  constructor(
    private fb:      FormBuilder,
    private propSvc: ProprietaireService,
    private route:   ActivatedRoute,
    private router:  Router,
    private toastSvc: ToastService
  ) {
    this.form = this.fb.group({
      nom:       ['', Validators.required],
      prenom:    ['', Validators.required],
      telephone: ['', Validators.required],
      email:     ['', [Validators.required, Validators.email]],
      adresse:   ['', Validators.required],
      cni:       ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.propId) {
      this.chargerPourEdition(this.propId);
    } else {
      this.route.paramMap.subscribe(params => {
        const idParam = params.get('id');
        if (idParam) {
          this.propId = Number(idParam);
          this.chargerPourEdition(this.propId);
        }
      });
    }
  }

  chargerPourEdition(id: number): void {
    console.log("Mode édition activé pour l'ID :", id);
    this.isEdit = true;
    this.propSvc.getById(id).subscribe({
      next: (r: any) => {
        console.log("Données reçues :", r);
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
      ? this.propSvc.update(this.propId!, this.form.value)
      : this.propSvc.create(this.form.value);

    action.subscribe({
      next:  () => {
        this.toastSvc.success(this.isEdit ? 'Propriétaire modifié avec succès' : 'Propriétaire créé avec succès');
        this.router.navigate(['/proprietaires']);
      },
      error: (err: any) => { 
        this.erreur = err.message || 'Une erreur est survenue'; 
        this.toastSvc.error(this.erreur);
        this.loading = false; 
      },
    });
  }
}
