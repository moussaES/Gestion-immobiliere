import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UtilisateurService } from '../../../core/services/utilisateur.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-utilisateur-form',
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="form-card">
        <div class="form-header">
          <h2>{{ isEditMode ? 'Modifier l\\'utilisateur' : 'Nouvel utilisateur' }}</h2>
          <a routerLink="/utilisateurs" class="close-btn"><i class="fas fa-times"></i></a>
        </div>
        
        <form (ngSubmit)="onSubmit()" #uForm="ngForm">
          <div class="form-grid">
            <div class="form-group">
              <label>Prénom *</label>
              <input type="text" name="prenom" [(ngModel)]="utilisateur.prenom" required #prenomCtrl="ngModel"
                     [ngClass]="{'invalid-input': prenomCtrl.invalid && (prenomCtrl.dirty || prenomCtrl.touched)}">
              <small class="error-text" *ngIf="prenomCtrl.invalid && (prenomCtrl.dirty || prenomCtrl.touched)">
                Le prénom est requis.
              </small>
            </div>
            <div class="form-group">
              <label>Nom *</label>
              <input type="text" name="nom" [(ngModel)]="utilisateur.nom" required #nomCtrl="ngModel"
                     [ngClass]="{'invalid-input': nomCtrl.invalid && (nomCtrl.dirty || nomCtrl.touched)}">
              <small class="error-text" *ngIf="nomCtrl.invalid && (nomCtrl.dirty || nomCtrl.touched)">
                Le nom est requis.
              </small>
            </div>
            
            <div class="form-group">
              <label>Email *</label>
              <input type="email" name="email" [(ngModel)]="utilisateur.email" required email #emailCtrl="ngModel"
                     [ngClass]="{'invalid-input': emailCtrl.invalid && (emailCtrl.dirty || emailCtrl.touched)}">
              <small class="error-text" *ngIf="emailCtrl.invalid && (emailCtrl.dirty || emailCtrl.touched)">
                L'email est requis et doit être valide.
              </small>
            </div>
            <div class="form-group">
              <label>{{ isEditMode ? 'Nouveau mot de passe (laisser vide si inchangé)' : 'Mot de passe *' }}</label>
              <input type="text" name="password" [(ngModel)]="utilisateur.password" [required]="!isEditMode" minlength="8" #pwdCtrl="ngModel"
                     [ngClass]="{'invalid-input': pwdCtrl.invalid && (pwdCtrl.dirty || pwdCtrl.touched)}">
              <small class="error-text" *ngIf="pwdCtrl.invalid && (pwdCtrl.dirty || pwdCtrl.touched)">
                Le mot de passe doit contenir au moins 8 caractères.
              </small>
            </div>
            
            <div class="form-group">
              <label>Rôle *</label>
              <select name="role" [(ngModel)]="utilisateur.role" required>
                <option value="GESTIONNAIRE">Gestionnaire</option>
                <option value="ADMIN">Administrateur</option>
              </select>
            </div>
            <div class="form-group">
              <label>Statut *</label>
              <select name="statut" [(ngModel)]="utilisateur.statut" required>
                <option value="ACTIF">Actif</option>
                <option value="INACTIF">Inactif</option>
              </select>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" routerLink="/utilisateurs">Annuler</button>
            <button type="submit" class="btn btn-primary" [disabled]="!uForm.form.valid">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 40px 24px; background: #f4f6f9; min-height: 100vh; display: flex; justify-content: center; }
    .form-card { background: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); width: 100%; max-width: 800px; padding: 32px; }
    .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; padding-bottom: 16px; border-bottom: 1px solid #eee; }
    .form-header h2 { margin: 0; font-size: 20px; color: #333; }
    .close-btn { color: #999; text-decoration: none; font-size: 18px; transition: color 0.2s; }
    .close-btn:hover { color: #333; }
    
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
    .form-group { display: flex; flex-direction: column; gap: 8px; }
    .form-group label { font-size: 13px; font-weight: 600; color: #555; }
    .form-group input, .form-group select { padding: 10px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; outline: none; transition: border-color 0.2s; }
    .form-group input:focus, .form-group select:focus { border-color: #1a237e; }
    .invalid-input { border-color: #d32f2f !important; }
    .error-text { color: #d32f2f; font-size: 12px; margin-top: 2px; }
    
    .form-actions { display: flex; justify-content: flex-end; gap: 16px; padding-top: 24px; border-top: 1px solid #eee; }
    .btn { padding: 10px 24px; border-radius: 4px; font-weight: 600; font-size: 14px; cursor: pointer; border: none; transition: all 0.2s; }
    .btn-secondary { background: #f5f5f5; color: #666; }
    .btn-secondary:hover { background: #e0e0e0; }
    .btn-primary { background: #1a237e; color: #fff; }
    .btn-primary:hover { background: #121858; }
    .btn-primary:disabled { background: #9fa8da; cursor: not-allowed; }
  `]
})
export class UtilisateurFormComponent implements OnInit {
  isEditMode = false;
  utilisateurId: number | null = null;
  
  utilisateur: any = {
    prenom: '',
    nom: '',
    email: '',
    password: '',
    role: 'GESTIONNAIRE',
    statut: 'ACTIF'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private utilisateurSvc: UtilisateurService,
    private toastSvc: ToastService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.utilisateurId = Number(id);
      this.chargerPourEdition(this.utilisateurId);
    }
  }

  chargerPourEdition(id: number): void {
    this.utilisateurSvc.getById(id).subscribe({
      next: (res: any) => {
        this.utilisateur = res.data;
        this.utilisateur.password = ''; // Ne pas afficher le mot de passe hashé
      }
    });
  }

  onSubmit(): void {
    const payload = { ...this.utilisateur };
    if (this.isEditMode && !payload.password) {
      delete payload.password;
    }
    
    const action$ = this.isEditMode 
      ? this.utilisateurSvc.update(this.utilisateurId!, payload)
      : this.utilisateurSvc.create(payload);
      
    action$.subscribe({
      next: () => {
        this.toastSvc.success(this.isEditMode ? 'Utilisateur mis à jour avec succès' : 'Utilisateur créé avec succès');
        this.router.navigate(['/utilisateurs']);
      },
      error: (err) => {
        console.error('Erreur de sauvegarde', err);
        this.toastSvc.error('Erreur lors de la sauvegarde.');
      }
    });
  }
}
