import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LocataireService } from '../../../core/services/locataire.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-locataire-form',
  templateUrl: './locataire-form.html',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
})
export class LocataireFormComponent implements OnInit {
  form:    FormGroup;
  isEdit   = false;
  
  @Input() locId?:  number;
  @Input() isEmbedded = false;
  
  loading  = false;
  erreur   = '';

  constructor(
    private fb:       FormBuilder,
    private locSvc:   LocataireService,
    private route:    ActivatedRoute,
    private router:   Router,
    private toastSvc: ToastService
  ) {
    this.form = this.fb.group({
      nom:        ['', Validators.required],
      prenom:     ['', Validators.required],
      telephone:  ['', Validators.required],
      email:      ['', [Validators.required, Validators.email]],
      adresse:    ['', Validators.required],
      profession: ['', Validators.required],
      cni:        ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.locId) {
      this.chargerPourEdition(this.locId);
    } else {
      this.route.paramMap.subscribe(params => {
        const idParam = params.get('id');
        if (idParam) {
          this.locId = Number(idParam);
          this.chargerPourEdition(this.locId);
        }
      });
    }
  }

  chargerPourEdition(id: number): void {
    console.log("Mode édition activé pour l'ID :", id);
    this.isEdit = true;
    this.locSvc.getById(id).subscribe({
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
      ? this.locSvc.update(this.locId!, this.form.value)
      : this.locSvc.create(this.form.value);

    action.subscribe({
      next:  () => {
        this.toastSvc.success(this.isEdit ? 'Locataire modifié avec succès' : 'Locataire créé avec succès');
        this.router.navigate(['/locataires']);
      },
      error: (err: any) => { 
        this.erreur = err.message || 'Une erreur est survenue'; 
        this.toastSvc.error(this.erreur);
        this.loading = false; 
      },
    });
  }
}
