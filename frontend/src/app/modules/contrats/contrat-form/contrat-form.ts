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
    this.locSvc.getAll().subscribe(r => this.locataires = r.data.data || r.data);
    this.propSvc.getAll().subscribe(r => this.proprietaires = r.data.data || r.data);

    // Charger les biens ET les contrats actifs pour filtrer selon la capacité max de locataires (nombre_locataires_max)
    this.contratSvc.getAll().subscribe((contratsRes: any) => {
      const tousContrats = contratsRes.data.data || contratsRes.data || [];

      // Compter le nombre de contrats LOCATAIRE actifs par bien
      const nombreActifsParBien: { [key: number]: number } = {};
      tousContrats
        .filter((c: any) => c.statut === 'ACTIF' && c.type_contrat === 'LOCATAIRE')
        .forEach((c: any) => {
          const idBien = Number(c.id_bien);
          nombreActifsParBien[idBien] = (nombreActifsParBien[idBien] || 0) + 1;
        });

      this.bienSvc.getAll().subscribe(r => {
        const tousBiens = r.data.data || r.data;

        if (this.isEdit && this.contratId) {
          // En mode édition : réintégrer le bien du contrat courant
          const contratCourant = tousContrats.find((c: any) => c.id_contrat == this.contratId);
          const idBienCourant = contratCourant ? Number(contratCourant.id_bien) : null;
          this.biens = tousBiens.filter((b: any) => {
            const idBien = Number(b.id_bien || b.id);
            const maxLoc = Number(b.nombre_locataires_max) || 1;
            const nbActifs = nombreActifsParBien[idBien] || 0;
            return idBien === idBienCourant || nbActifs < maxLoc;
          });
        } else {
          // En mode création : inclure seulement les biens dont la capacité max n'est pas encore atteinte
          this.biens = tousBiens.filter((b: any) => {
            const idBien = Number(b.id_bien || b.id);
            const maxLoc = Number(b.nombre_locataires_max) || 1;
            const nbActifs = nombreActifsParBien[idBien] || 0;
            return nbActifs < maxLoc;
          });
        }
      });
    });

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

    this.form.get('id_bien')?.valueChanges.subscribe(bienId => {
      if (bienId) {
        const selectedBien = this.biens.find(b => b.id_bien == bienId);
        if (selectedBien) {
          this.form.patchValue({
            montant: selectedBien.loyer_mensuel || 0,
            id_proprietaire: selectedBien.id_proprietaire
          });
        }
      }
    });
  }

  genererReference(type: string): void {
    const prefix = type === 'LOCATAIRE' ? 'CONT-LOC-' : 'CONT-PRO-';
    
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
