import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UtilisateurService } from '../../../core/services/utilisateur.service';

@Component({
  selector: 'app-utilisateur-form',
  templateUrl: './utilisateur-form.html',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
})
export class UtilisateurFormComponent implements OnInit {
  form:    FormGroup;
  isEdit   = false;
  userId?: number;
  loading  = false;
  erreur   = '';

  constructor(
    private fb:       FormBuilder,
    private userSvc:  UtilisateurService,
    private route:    ActivatedRoute,
    private router:   Router,
  ) {
    this.form = this.fb.group({
      nom:       ['', Validators.required],
      prenom:    ['', Validators.required],
      email:     ['', [Validators.required, Validators.email]],
      password:  [''], // Required conditionally below
      role:      ['GESTIONNAIRE', Validators.required],
      statut:    ['actif', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.params['id']);
    if (this.userId) {
      this.isEdit = true;
      this.userSvc.getById(this.userId).subscribe({
        next: (r: any) => this.form.patchValue(r.data),
        error: (err: any) => this.erreur = "Erreur de chargement des données"
      });
    } else {
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    
    // Si édition et password vide, on le retire
    const formData = { ...this.form.value };
    if (this.isEdit && !formData.password) {
      delete formData.password;
    }
    
    const action = this.isEdit
      ? this.userSvc.update(this.userId!, formData)
      : this.userSvc.create(formData);

    action.subscribe({
      next:  ()    => this.router.navigate(['/utilisateurs']),
      error: (err: any) => { this.erreur = err.message || 'Une erreur est survenue'; this.loading = false; },
    });
  }
}
