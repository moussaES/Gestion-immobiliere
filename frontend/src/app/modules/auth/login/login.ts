import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
})
export class LoginComponent {
  form: FormGroup;
  loading  = false;
  erreur   = '';
  showPass = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.erreur  = '';
    this.auth.login(this.form.value).subscribe({
      next:  ()    => this.router.navigate(['/dashboard']),
      error: (err) => { this.erreur = err.message; this.loading = false; },
    });
  }
}