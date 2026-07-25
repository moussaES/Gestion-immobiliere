import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ProfilService } from '../../core/services/profil.service';
import { ToastService } from '../../core/services/toast.service';
import { Utilisateur } from '../../core/models';

@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="param-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-header-icon">⚙️</div>
        <div>
          <h1>Paramètres</h1>
          <p>Gérez vos informations personnelles et préférences de sécurité</p>
        </div>
      </div>

      <div class="param-layout">
        <!-- Sidebar navigation -->
        <aside class="param-sidebar">
          <nav>
            <button
              *ngFor="let tab of tabs"
              [class.active]="activeTab === tab.id"
              (click)="activeTab = tab.id"
              class="nav-item">
              <span class="nav-icon">{{ tab.icon }}</span>
              <span>{{ tab.label }}</span>
            </button>
          </nav>

          <!-- User card -->
          <div class="user-card" *ngIf="currentUser">
            <div class="user-avatar-big">{{ getInitials() }}</div>
            <div class="user-card-info">
              <strong>{{ currentUser.prenom }} {{ currentUser.nom }}</strong>
              <span class="role-badge" [class]="'role-' + (currentUser.role ? currentUser.role.toLowerCase() : '')">{{ currentUser.role }}</span>
            </div>
          </div>
        </aside>

        <!-- Main content -->
        <main class="param-content">

          <!-- ===================== ONGLET PROFIL ===================== -->
          <div *ngIf="activeTab === 'profil'" class="tab-panel">
            <div class="panel-header">
              <h2>👤 Informations du profil</h2>
              <p>Mettez à jour vos informations personnelles et votre adresse e-mail</p>
            </div>

            <form [formGroup]="profilForm" (ngSubmit)="onSaveProfil()" class="settings-form">
              <div class="form-row">
                <div class="form-group">
                  <label>Prénom</label>
                  <input type="text" formControlName="prenom" placeholder="Votre prénom">
                  <span class="error" *ngIf="profilForm.get('prenom')?.invalid && profilForm.get('prenom')?.touched">
                    Le prénom est requis
                  </span>
                </div>
                <div class="form-group">
                  <label>Nom</label>
                  <input type="text" formControlName="nom" placeholder="Votre nom">
                  <span class="error" *ngIf="profilForm.get('nom')?.invalid && profilForm.get('nom')?.touched">
                    Le nom est requis
                  </span>
                </div>
              </div>

              <div class="form-group">
                <label>Adresse e-mail</label>
                <div class="input-icon-wrapper">
                  <span class="input-icon">✉️</span>
                  <input type="email" formControlName="email" placeholder="votre@email.com">
                </div>
                <span class="error" *ngIf="profilForm.get('email')?.hasError('email') && profilForm.get('email')?.touched">
                  Adresse e-mail invalide
                </span>
                <span class="error" *ngIf="profilForm.get('email')?.hasError('required') && profilForm.get('email')?.touched">
                  L'e-mail est requis
                </span>
              </div>

              <div class="form-group readonly-group">
                <label>Rôle</label>
                <div class="readonly-field">
                  <span class="role-badge" [class]="'role-' + (currentUser?.role ? currentUser!.role.toLowerCase() : '')">{{ currentUser?.role }}</span>
                  <span class="readonly-note">Le rôle est géré par un administrateur</span>
                </div>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn-primary" [disabled]="profilLoading || profilForm.invalid">
                  <span *ngIf="profilLoading" class="spinner">⟳</span>
                  {{ profilLoading ? 'Enregistrement...' : '✓ Sauvegarder le profil' }}
                </button>
              </div>
            </form>
          </div>

          <!-- ===================== ONGLET SECURITE ===================== -->
          <div *ngIf="activeTab === 'securite'" class="tab-panel">
            <div class="panel-header">
              <h2>🔒 Sécurité du compte</h2>
              <p>Changez votre mot de passe pour protéger votre compte</p>
            </div>

            <div class="security-tips">
              <h4>💡 Conseils pour un mot de passe fort</h4>
              <ul>
                <li>Au moins 8 caractères</li>
                <li>Mélangez lettres majuscules et minuscules</li>
                <li>Ajoutez des chiffres et caractères spéciaux</li>
                <li>Évitez les mots courants ou données personnelles</li>
              </ul>
            </div>

            <form [formGroup]="passwordForm" (ngSubmit)="onChangePassword()" class="settings-form">
              <div class="form-group">
                <label>Mot de passe actuel</label>
                <div class="input-icon-wrapper">
                  <span class="input-icon">🔑</span>
                  <input [type]="showOld ? 'text' : 'password'" formControlName="ancien_mot_de_passe" placeholder="Votre mot de passe actuel">
                  <button type="button" class="toggle-eye" (click)="showOld = !showOld">{{ showOld ? '🙈' : '👁️' }}</button>
                </div>
                <span class="error" *ngIf="passwordForm.get('ancien_mot_de_passe')?.invalid && passwordForm.get('ancien_mot_de_passe')?.touched">
                  Ce champ est requis
                </span>
              </div>

              <div class="form-group">
                <label>Nouveau mot de passe</label>
                <div class="input-icon-wrapper">
                  <span class="input-icon">🔒</span>
                  <input [type]="showNew ? 'text' : 'password'" formControlName="nouveau_mot_de_passe" placeholder="Nouveau mot de passe (6 caractères min)">
                  <button type="button" class="toggle-eye" (click)="showNew = !showNew">{{ showNew ? '🙈' : '👁️' }}</button>
                </div>
                <div class="strength-bar" *ngIf="passwordForm.get('nouveau_mot_de_passe')?.value">
                  <div class="strength-fill" [style.width]="getStrengthWidth()" [style.background]="getStrengthColor()"></div>
                </div>
                <span class="strength-label" *ngIf="passwordForm.get('nouveau_mot_de_passe')?.value" [style.color]="getStrengthColor()">
                  Force : {{ getStrengthLabel() }}
                </span>
                <span class="error" *ngIf="passwordForm.get('nouveau_mot_de_passe')?.hasError('minlength') && passwordForm.get('nouveau_mot_de_passe')?.touched">
                  Minimum 6 caractères requis
                </span>
              </div>

              <div class="form-group">
                <label>Confirmer le nouveau mot de passe</label>
                <div class="input-icon-wrapper">
                  <span class="input-icon">🔒</span>
                  <input [type]="showConfirm ? 'text' : 'password'" formControlName="nouveau_mot_de_passe_confirmation" placeholder="Répétez le nouveau mot de passe">
                  <button type="button" class="toggle-eye" (click)="showConfirm = !showConfirm">{{ showConfirm ? '🙈' : '👁️' }}</button>
                </div>
                <span class="error" *ngIf="passwordForm.errors?.['passwordMismatch'] && passwordForm.get('nouveau_mot_de_passe_confirmation')?.touched">
                  Les mots de passe ne correspondent pas
                </span>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn-primary btn-danger-outline" [disabled]="pwLoading || passwordForm.invalid">
                  <span *ngIf="pwLoading" class="spinner">⟳</span>
                  {{ pwLoading ? 'Modification...' : '🔐 Changer le mot de passe' }}
                </button>
              </div>
            </form>
          </div>

          <!-- ===================== ONGLET A PROPOS ===================== -->
          <div *ngIf="activeTab === 'apropos'" class="tab-panel">
            <div class="panel-header">
              <h2>ℹ️ À propos de GESTIMMO</h2>
              <p>Informations sur l'application</p>
            </div>

            <div class="about-grid">
              <div class="about-card accent-blue">
                <div class="about-icon">🏢</div>
                <h3>GESTIMMO</h3>
                <p>Logiciel de gestion immobilière complet pour la gestion de vos biens, contrats, locataires et paiements.</p>
              </div>

              <div class="about-card accent-green">
                <div class="about-icon">⚡</div>
                <h3>Fonctionnalités</h3>
                <ul class="feature-list">
                  <li>✅ Gestion des biens immobiliers</li>
                  <li>✅ Suivi des contrats (locataires & propriétaires)</li>
                  <li>✅ Registre des paiements</li>
                  <li>✅ Gestion des locataires & propriétaires</li>
                  <li>✅ Génération de documents PDF</li>
                  <li>✅ Tableau de bord analytique</li>
                  <li>✅ Historique des opérations</li>
                </ul>
              </div>

              <div class="about-card accent-purple">
                <div class="about-icon">🛠️</div>
                <h3>Stack technique</h3>
                <ul class="feature-list">
                  <li>🔵 Frontend : Angular</li>
                  <li>🔴 Backend : Laravel (PHP)</li>
                  <li>🟠 Base de données : MySQL</li>
                  <li>📄 PDF : DomPDF</li>
                </ul>
              </div>

              <div class="about-card accent-orange">
                <div class="about-icon">📋</div>
                <h3>Informations session</h3>
                <div class="session-info" *ngIf="currentUser">
                  <div class="session-row">
                    <span>Connecté en tant que</span>
                    <strong>{{ currentUser.prenom }} {{ currentUser.nom }}</strong>
                  </div>
                  <div class="session-row">
                    <span>E-mail</span>
                    <strong>{{ currentUser.email }}</strong>
                  </div>
                  <div class="session-row">
                    <span>Rôle</span>
                    <span class="role-badge" [class]="'role-' + (currentUser.role ? currentUser.role.toLowerCase() : '')">{{ currentUser.role }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }

    .param-page {
      padding: 24px;
      background: #f4f6f9;
      min-height: 100vh;
      font-family: 'Inter', 'Segoe UI', sans-serif;
    }

    /* ===== PAGE HEADER ===== */
    .page-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
    }
    .page-header-icon {
      font-size: 40px;
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #1a237e, #3949ab);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .page-header h1 {
      margin: 0;
      font-size: 26px;
      font-weight: 700;
      color: #1a1a2e;
    }
    .page-header p {
      margin: 4px 0 0;
      color: #666;
      font-size: 14px;
    }

    /* ===== LAYOUT ===== */
    .param-layout {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 24px;
      align-items: start;
    }

    /* ===== SIDEBAR ===== */
    .param-sidebar {
      background: #fff;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      position: sticky;
      top: 24px;
    }
    .param-sidebar nav {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-bottom: 24px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border: none;
      border-radius: 8px;
      background: transparent;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: #555;
      transition: all 0.2s;
      text-align: left;
      width: 100%;
    }
    .nav-item:hover { background: #f0f2ff; color: #1a237e; }
    .nav-item.active { background: #e8eaf6; color: #1a237e; font-weight: 700; }
    .nav-icon { font-size: 18px; }

    /* USER CARD */
    .user-card {
      border-top: 1px solid #eee;
      padding-top: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .user-avatar-big {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1a237e, #3949ab);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
      flex-shrink: 0;
    }
    .user-card-info { display: flex; flex-direction: column; gap: 4px; overflow: hidden; }
    .user-card-info strong { font-size: 13px; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* ===== MAIN CONTENT ===== */
    .param-content {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      min-height: 500px;
    }
    .tab-panel { padding: 32px; }
    .panel-header {
      margin-bottom: 32px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }
    .panel-header h2 { margin: 0 0 6px; font-size: 20px; color: #1a1a2e; }
    .panel-header p { margin: 0; color: #888; font-size: 14px; }

    /* ===== FORM ===== */
    .settings-form { max-width: 560px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
    .form-group label { font-size: 13px; font-weight: 600; color: #444; }
    .form-group input {
      padding: 11px 14px;
      border: 1.5px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.2s;
      outline: none;
      width: 100%;
    }
    .form-group input:focus { border-color: #1a237e; box-shadow: 0 0 0 3px rgba(26,35,126,0.08); }
    .input-icon-wrapper { position: relative; display: flex; align-items: center; }
    .input-icon { position: absolute; left: 12px; font-size: 14px; }
    .input-icon-wrapper input { padding-left: 36px; }
    .toggle-eye {
      position: absolute; right: 10px;
      background: none; border: none; cursor: pointer; font-size: 16px; padding: 0;
    }
    .error { color: #c62828; font-size: 12px; }
    .readonly-group .readonly-field {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      background: #f8f9fa;
      border: 1.5px solid #eee;
      border-radius: 8px;
    }
    .readonly-note { font-size: 12px; color: #999; }
    .form-actions { margin-top: 8px; }

    /* BUTTONS */
    .btn-primary {
      background: linear-gradient(135deg, #1a237e, #3949ab);
      color: white;
      border: none;
      padding: 12px 28px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(26,35,126,0.3); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    .btn-danger-outline {
      background: linear-gradient(135deg, #b71c1c, #e53935);
    }
    .btn-danger-outline:hover:not(:disabled) { box-shadow: 0 4px 12px rgba(183,28,28,0.3); }
    .spinner { animation: spin 1s linear infinite; display: inline-block; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    /* ROLE BADGES */
    .role-badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .role-admin { background: #fce4ec; color: #c62828; }
    .role-gestionnaire { background: #e3f2fd; color: #1565c0; }

    /* PASSWORD STRENGTH */
    .strength-bar { height: 4px; background: #eee; border-radius: 4px; margin-top: 6px; overflow: hidden; }
    .strength-fill { height: 100%; border-radius: 4px; transition: width 0.3s, background 0.3s; }
    .strength-label { font-size: 12px; font-weight: 600; margin-top: 4px; }

    /* SECURITY TIPS */
    .security-tips {
      background: #f3f4ff;
      border-left: 4px solid #3949ab;
      border-radius: 0 8px 8px 0;
      padding: 16px 20px;
      margin-bottom: 28px;
      max-width: 560px;
    }
    .security-tips h4 { margin: 0 0 10px; font-size: 14px; color: #1a237e; }
    .security-tips ul { margin: 0; padding-left: 20px; }
    .security-tips li { font-size: 13px; color: #555; margin-bottom: 4px; }

    /* ABOUT */
    .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .about-card {
      padding: 24px;
      border-radius: 12px;
      border: 1px solid #eee;
    }
    .accent-blue { border-top: 4px solid #1a237e; background: #f3f4ff; }
    .accent-green { border-top: 4px solid #2e7d32; background: #f1f8e9; }
    .accent-purple { border-top: 4px solid #6a1b9a; background: #f3e5f5; }
    .accent-orange { border-top: 4px solid #e65100; background: #fff3e0; }
    .about-icon { font-size: 32px; margin-bottom: 12px; }
    .about-card h3 { margin: 0 0 10px; font-size: 16px; color: #333; }
    .about-card p { margin: 0; font-size: 14px; color: #555; line-height: 1.6; }
    .feature-list { margin: 0; padding: 0; list-style: none; }
    .feature-list li { font-size: 13px; color: #444; padding: 4px 0; }
    .session-info { display: flex; flex-direction: column; gap: 10px; }
    .session-row { display: flex; flex-direction: column; gap: 2px; }
    .session-row span:first-child { font-size: 11px; color: #888; text-transform: uppercase; }
    .session-row strong { font-size: 14px; color: #333; }

    @media (max-width: 900px) {
      .param-layout { grid-template-columns: 1fr; }
      .param-sidebar { position: static; }
      .param-sidebar nav { flex-direction: row; flex-wrap: wrap; }
      .form-row { grid-template-columns: 1fr; }
      .about-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ParametresComponent implements OnInit {
  currentUser: Utilisateur | null = null;
  activeTab = 'profil';

  profilForm!: FormGroup;
  passwordForm!: FormGroup;

  profilLoading = false;
  pwLoading = false;

  showOld = false;
  showNew = false;
  showConfirm = false;

  tabs = [
    { id: 'profil',   label: 'Mon profil',  icon: '👤' },
    { id: 'securite', label: 'Sécurité',    icon: '🔒' },
    { id: 'apropos',  label: 'À propos',    icon: 'ℹ️' },
  ];

  constructor(
    private fb: FormBuilder,
    private authSvc: AuthService,
    private profilSvc: ProfilService,
    private toastSvc: ToastService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authSvc.getCurrentUser();

    this.profilForm = this.fb.group({
      prenom: [this.currentUser?.prenom ?? '', Validators.required],
      nom:    [this.currentUser?.nom ?? '',    Validators.required],
      email:  [this.currentUser?.email ?? '',  [Validators.required, Validators.email]],
    });

    this.passwordForm = this.fb.group({
      ancien_mot_de_passe:              ['', Validators.required],
      nouveau_mot_de_passe:             ['', [Validators.required, Validators.minLength(6)]],
      nouveau_mot_de_passe_confirmation: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const pw  = group.get('nouveau_mot_de_passe')?.value;
    const cpw = group.get('nouveau_mot_de_passe_confirmation')?.value;
    return pw === cpw ? null : { passwordMismatch: true };
  }

  getInitials(): string {
    if (!this.currentUser) return '?';
    return `${this.currentUser.prenom?.[0] ?? ''}${this.currentUser.nom?.[0] ?? ''}`.toUpperCase();
  }

  onSaveProfil(): void {
    if (this.profilForm.invalid || !this.currentUser?.id_user) return;
    this.profilLoading = true;
    this.profilSvc.updateProfil(this.currentUser.id_user, this.profilForm.value).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          // Update localStorage
          const updated = { ...this.currentUser, ...res.data };
          localStorage.setItem('user', JSON.stringify(updated));
          this.currentUser = updated;
        }
        this.toastSvc.success('Profil mis à jour avec succès !');
        this.profilLoading = false;
      },
      error: (err: any) => {
        const msg = err.error?.errors
          ? Object.values(err.error.errors).flat().join(' ')
          : (err.error?.message || 'Erreur lors de la mise à jour');
        this.toastSvc.error(msg);
        this.profilLoading = false;
      }
    });
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid || !this.currentUser?.id_user) return;
    this.pwLoading = true;
    this.profilSvc.changePassword(this.currentUser.id_user, this.passwordForm.value).subscribe({
      next: () => {
        this.toastSvc.success('Mot de passe modifié avec succès !');
        this.passwordForm.reset();
        this.pwLoading = false;
      },
      error: (err: any) => {
        const msg = err.error?.message || 'Erreur lors du changement de mot de passe';
        this.toastSvc.error(msg);
        this.pwLoading = false;
      }
    });
  }

  // Password strength
  getStrengthScore(): number {
    const pw = this.passwordForm.get('nouveau_mot_de_passe')?.value ?? '';
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  }
  getStrengthWidth(): string {
    return `${(this.getStrengthScore() / 5) * 100}%`;
  }
  getStrengthColor(): string {
    const s = this.getStrengthScore();
    if (s <= 1) return '#ef5350';
    if (s <= 2) return '#ffa726';
    if (s <= 3) return '#ffee58';
    return '#66bb6a';
  }
  getStrengthLabel(): string {
    const s = this.getStrengthScore();
    if (s <= 1) return 'Très faible';
    if (s <= 2) return 'Faible';
    if (s <= 3) return 'Moyen';
    if (s <= 4) return 'Fort';
    return 'Très fort';
  }
}
