import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaiementService } from '../../../core/services/paiement.service';
import { ContratService } from '../../../core/services/contrat.service';
import { LocataireService } from '../../../core/services/locataire.service';
import { ProprietaireService } from '../../../core/services/proprietaire.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-paiement-form',
  templateUrl: './paiement-form.html',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule],
})
export class PaiementFormComponent implements OnInit {
  form:    FormGroup;
  isEdit   = false;
  paiementId?: number;
  loading  = false;
  erreur   = '';

  allContrats: any[] = [];
  contrats: any[] = [];
  locataires: any[] = [];
  proprietaires: any[] = [];
  
  selectedLocataireId: number | null = null;
  selectedProprietaireId: number | null = null;

  constructor(
    private fb:          FormBuilder,
    private paiementSvc: PaiementService,
    private contratSvc:  ContratService,
    private locataireSvc: LocataireService,
    private proprietaireSvc: ProprietaireService,
    private route:       ActivatedRoute,
    private router:      Router,
    private toastSvc:    ToastService
  ) {
    this.form = this.fb.group({
      reference:     ['', Validators.required],
      date_paiement: ['', Validators.required],
      montant:       [0, [Validators.required, Validators.min(1)]],
      mode_paiement: ['ESPECES', Validators.required],
      statut:        ['PAYE', Validators.required],
      mois_concerne: ['', Validators.required],
      notes:         [''],
      id_contrat:    [null, Validators.required],
    });
  }

  ngOnInit(): void {
    // Charger les listes
    this.locataireSvc.getAll().subscribe(r => this.locataires = r.data.data || r.data);
    this.proprietaireSvc.getAll().subscribe(r => this.proprietaires = r.data.data || r.data);
    
    this.contratSvc.getAll().subscribe(r => {
      this.allContrats = r.data.data || r.data;
      this.contrats = [...this.allContrats];
    });

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.paiementId = Number(idParam);
        this.isEdit = true;
        this.paiementSvc.getById(this.paiementId).subscribe({
          next: (r: any) => {
            if (r.data) {
              if (r.data.date_paiement) {
                r.data.date_paiement = r.data.date_paiement.split('T')[0];
              }
              if (r.data.mois_concerne && r.data.mois_concerne.includes('T')) {
                r.data.mois_concerne = r.data.mois_concerne.split('T')[0].substring(0, 7); // Pour un input type month (YYYY-MM)
              }
              this.form.patchValue(r.data);
            }
          },
          error: (err: any) => {
            this.erreur = "Erreur de chargement des données";
            this.toastSvc.error(this.erreur);
          }
        });
      } else {
        this.genererReference();
      }
    });
  }

  genererReference(): void {
    this.paiementSvc.getAll().subscribe((r: any) => {
      const paiements = r.data.data || r.data || [];
      if (paiements.length === 0) {
        this.form.patchValue({ reference: 'PAY-001' });
        return;
      }
      
      let maxNum = 0;
      paiements.forEach((p: any) => {
        if (p.reference && p.reference.toUpperCase().startsWith('PAY-')) {
          const parts = p.reference.split('-');
          if (parts.length > 1) {
            const num = parseInt(parts[1], 10);
            if (!isNaN(num) && num > maxNum) {
              maxNum = num;
            }
          }
        }
      });
      
      const nextNum = maxNum + 1;
      const nextRef = `PAY-${nextNum.toString().padStart(3, '0')}`;
      this.form.patchValue({ reference: nextRef });
    });
  }

  onLocataireChange(event: any): void {
    const id = event.target.value;
    this.selectedProprietaireId = null; // Réinitialise l'autre
    if (id && id !== 'null') {
      this.contrats = this.allContrats.filter(c => c.id_locataire == id);
    } else {
      this.contrats = [...this.allContrats];
    }
  }

  onProprietaireChange(event: any): void {
    const id = event.target.value;
    this.selectedLocataireId = null; // Réinitialise l'autre
    if (id && id !== 'null') {
      this.contrats = this.allContrats.filter(c => c.id_proprietaire == id);
    } else {
      this.contrats = [...this.allContrats];
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    
    const action = this.isEdit
      ? this.paiementSvc.update(this.paiementId!, this.form.value)
      : this.paiementSvc.create(this.form.value);

    action.subscribe({
      next:  () => {
        this.toastSvc.success(this.isEdit ? 'Paiement modifié avec succès' : 'Paiement enregistré avec succès');
        this.router.navigate(['/paiements']);
      },
      error: (err: any) => { 
        this.erreur = err.message || 'Une erreur est survenue'; 
        this.toastSvc.error(this.erreur);
        this.loading = false; 
      },
    });
  }
}
