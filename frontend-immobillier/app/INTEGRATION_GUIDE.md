# 🔗 Guide d'Intégration Backend

## Configuration de l'API

### 1. Configurer la Base URL de l'API

Modifiez les services pour pointer vers votre backend Laravel.

**Fichier**: `src/app/shared/services/data.service.ts`

```typescript
@Injectable({
  providedIn: 'root'
})
export class BienService {
  private apiUrl = 'http://localhost:8000/api/biens'; // Votre URL backend
  
  constructor(private http: HttpClient) {}
  // ...
}
```

### 2. Configuration Globale (Recommandé)

Créez un fichier `src/app/core/config/api.config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  API_PREFIX: '/api',
  TIMEOUT: 30000
};

export const API_ENDPOINTS = {
  BIENS: '/biens',
  CONTRATS: '/contrats',
  PAIEMENTS: '/paiements',
  BAILLEURS: '/bailleurs',
  LOCATAIRES: '/locataires',
  DEPENSES: '/depenses',
  RECETTES: '/recettes',
  AUTH: '/auth'
};
```

Puis utilisez-le dans les services:

```typescript
import { API_CONFIG, API_ENDPOINTS } from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class BienService {
  private apiUrl = API_CONFIG.BASE_URL + API_CONFIG.API_PREFIX + API_ENDPOINTS.BIENS;
  
  constructor(private http: HttpClient) {}
}
```

---

## Authentification & JWT

### 1. Créer un Service d'Authentification

Fichier: `src/app/core/services/auth.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private tokenSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('token')
  );
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.tokenSubject.next(response.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
```

### 2. Créer un Intercepteur HTTP

Fichier: `src/app/core/interceptors/auth.interceptor.ts`

```typescript
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Ajouter le token JWT
    const token = this.authService.getToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: \`Bearer \${token}\`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expiré, rediriger vers login
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
```

### 3. Ajouter l'Intercepteur à la Configuration

Modifiez `src/app/app.config.ts`:

```typescript
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
};
```

---

## Gestion des Erreurs

### Créer un Service de Gestion des Erreurs

Fichier: `src/app/core/services/error.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  showError(message: string): void {
    this.errorSubject.next(message);
    setTimeout(() => this.errorSubject.next(null), 5000);
  }

  clearError(): void {
    this.errorSubject.next(null);
  }
}
```

Utilisez-le dans les services:

```typescript
loadBiens(): void {
  this.bienService.getAll().subscribe({
    next: (data) => {
      this.biens = data;
    },
    error: (err) => {
      this.errorService.showError('Erreur lors du chargement des biens');
      console.error(err);
    }
  });
}
```

---

## Modification des Services pour l'API Réelle

### Avant (Mock Data)

```typescript
loadBiens(): void {
  this.bienService.getAll().subscribe({
    next: (data) => {
      this.biens = data;
    }
  });
}
```

### Après (Gestion Erreurs + Loading)

```typescript
isLoading = false;

loadBiens(): void {
  this.isLoading = true;
  this.bienService.getAll().subscribe({
    next: (data) => {
      this.biens = data;
      this.totalPages = Math.ceil(data.length / this.itemsPerPage);
      this.isLoading = false;
    },
    error: (err) => {
      this.errorService.showError('Impossible de charger les biens');
      this.isLoading = false;
    }
  });
}
```

Mettez à jour les templates pour afficher un loader:

```html
<div *ngIf="isLoading" class="loader">
  <i class="fas fa-spinner fa-spin"></i> Chargement...
</div>

<app-table 
  *ngIf="!isLoading"
  [columns]="columns"
  [rows]="biens"
  ...>
</app-table>
```

---

## Pages à Créer

### 1. Page de Login

Fichier: `src/app/features/auth/login.component.ts`

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="login-container">
      <div class="login-form">
        <h1>Etoile Sine Immo</h1>
        <form (ngSubmit)="login()">
          <input type="email" [(ngModel)]="email" name="email" placeholder="Email" required>
          <input type="password" [(ngModel)]="password" name="password" placeholder="Mot de passe" required>
          <button type="submit" [disabled]="isLoading">Connexion</button>
        </form>
        <div *ngIf="error" class="error">{{ error }}</div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #1a237e 0%, #3949ab 100%);
    }
    .login-form {
      background: #fff;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      min-width: 350px;
    }
    h1 { text-align: center; color: #1a237e; margin-bottom: 30px; }
    input {
      width: 100%;
      padding: 12px;
      margin-bottom: 16px;
      border: 1px solid #ddd;
      border-radius: 6px;
    }
    button {
      width: 100%;
      padding: 12px;
      background: #1a237e;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }
    .error { color: #f44336; text-align: center; }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.isLoading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/resume']);
      },
      error: (err) => {
        this.error = 'Email ou mot de passe incorrect';
        this.isLoading = false;
      }
    });
  }
}
```

---

## Route Guard pour les Pages Privées

Fichier: `src/app/core/guards/auth.guard.ts`

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
```

Utilisez-le dans les routes:

```typescript
{
  path: '',
  component: LayoutComponent,
  canActivate: [AuthGuard],
  children: [
    // ... routes protégées
  ]
}
```

---

## Checklist d'Intégration

- [ ] Configurer la base URL de l'API
- [ ] Implémenter le service d'authentification
- [ ] Créer et ajouter l'intercepteur HTTP
- [ ] Créer la page de login
- [ ] Ajouter le guard d'authentification
- [ ] Tester la connexion backend
- [ ] Implémenter la gestion des erreurs
- [ ] Ajouter des indicateurs de chargement
- [ ] Tester les endpoints de chaque service
- [ ] Configurer CORS si nécessaire

---

## Démarrage du Backend Laravel

```bash
# Si vous n'avez pas démarré le backend
cd backend-immobilier

# Installer les dépendances
composer install

# Configurer l'environnement
cp .env.example .env
php artisan key:generate

# Migrations et seeders
php artisan migrate
php artisan db:seed

# Démarrer le serveur
php artisan serve
# ou si vous utilisez XAMPP, l'app est déjà accessible sur http://localhost/backend-immobilier
```

---

## CORS Configuration

Si vous avez des erreurs CORS, configurez Laravel:

**File**: `config/cors.php`

```php
'allowed_origins' => ['http://localhost:4200'],
'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
'allowed_headers' => ['Content-Type', 'Authorization'],
```

---

**Prêt pour l'intégration! 🚀**
