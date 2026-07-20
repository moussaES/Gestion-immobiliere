import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BienService } from '../../../core/services/bien.service';
import { ProprietaireService } from '../../../core/services/proprietaire.service';
import { Proprietaire } from '../../../core/models';
import { ToastService } from '../../../core/services/toast.service';

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
    private toastSvc: ToastService
  ) {
    this.form = this.fb.group({
      reference:       ['', Validators.required],
      type:            ['APPARTEMENT', Validators.required],
      adresse:         ['', Validators.required],
      ville:           ['', Validators.required],
      surface:         [0, [Validators.required, Validators.min(1)]],
      loyer_mensuel:   [0, [Validators.required, Validators.min(1)]],
      description:     [''],
      statut:          ['LIBRE', Validators.required],
      id_proprietaire: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    // Charger propriétaires pour le select
    this.propSvc.getAll().subscribe((r: any) => this.proprietaires = r.data.data || r.data);

    // Mode édition
    if (this.bienId) {
      this.chargerPourEdition(this.bienId);
    } else {
      this.route.paramMap.subscribe(params => {
        const idParam = params.get('id');
        if (idParam) {
          this.bienId = Number(idParam);
          this.chargerPourEdition(this.bienId);
        } else {
          this.genererReference();
        }
      });
    }
  }

  genererReference(): void {
    this.bienSvc.getAll().subscribe((r: any) => {
      const biens = r.data.data || r.data || [];
      if (biens.length === 0) {
        this.form.patchValue({ reference: 'BIEN-001' });
        return;
      }
      
      let maxNum = 0;
      biens.forEach((b: any) => {
        if (b.reference && b.reference.toUpperCase().startsWith('BIEN-')) {
          const parts = b.reference.split('-');
          if (parts.length > 1) {
            const num = parseInt(parts[1], 10);
            if (!isNaN(num) && num > maxNum) {
              maxNum = num;
            }
          }
        }
      });
      
      const nextNum = maxNum + 1;
      const nextRef = `BIEN-${nextNum.toString().padStart(3, '0')}`;
      this.form.patchValue({ reference: nextRef });
    });
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
      next:  () => {
        this.toastSvc.success(this.isEdit ? 'Bien modifié avec succès' : 'Bien créé avec succès');
        this.router.navigate(['/biens']);
      },
      error: (err) => { 
        this.erreur = err.message || 'Erreur lors de la sauvegarde'; 
        this.toastSvc.error(this.erreur);
        this.loading = false; 
      },
    });
  }
}