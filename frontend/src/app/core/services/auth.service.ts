import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Utilisateur, LoginRequest, AuthResponse } from '../models';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<Utilisateur | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private expirationTimer: any = null;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private toast: ToastService
  ) {
    this.checkInitialSession();
  }

  private checkInitialSession(): void {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (user && token) {
      if (this.isTokenExpired()) {
        this.clearSessionData();
      } else {
        this.currentUserSubject.next(JSON.parse(user));
        this.startExpirationTimer();
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        const durationSeconds = res.expires_in || 1800; // 30 minutes par défaut (1800 sec)
        const expiresAt = Date.now() + (durationSeconds * 1000);

        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('token_expires_at', expiresAt.toString());

        this.currentUserSubject.next(res.user);
        this.startExpirationTimer();
      })
    );
  }

  logout(): void {
    this.clearExpirationTimer();
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      error: () => {}
    });
    this.clearSessionData();
    this.router.navigate(['/auth/login']);
  }

  private clearSessionData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('token_expires_at');
    this.currentUserSubject.next(null);
  }

  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem('token_expires_at');
    if (!expiresAt) return true;
    return Date.now() >= Number(expiresAt);
  }

  getToken(): string | null {
    if (this.isTokenExpired()) {
      return null;
    }
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private startExpirationTimer(): void {
    this.clearExpirationTimer();
    const expiresAt = localStorage.getItem('token_expires_at');
    if (!expiresAt) return;

    const remainingTime = Number(expiresAt) - Date.now();
    if (remainingTime <= 0) {
      this.handleSessionExpired();
    } else {
      this.expirationTimer = setTimeout(() => {
        this.handleSessionExpired();
      }, remainingTime);
    }
  }

  private handleSessionExpired(): void {
    this.clearExpirationTimer();
    this.clearSessionData();
    this.toast.error('Votre session de 30 minutes a expiré. Veuillez vous reconnecter.');
    this.router.navigate(['/auth/login']);
  }

  private clearExpirationTimer(): void {
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
      this.expirationTimer = null;
    }
  }

  getCurrentUser(): Utilisateur | null { return this.currentUserSubject.value; }

  hasRole(role: string): boolean {
    const userRole = this.getCurrentUser()?.role;
    return !!userRole && userRole.toUpperCase() === role.toUpperCase();
  }

  hasAnyRole(roles: string[]): boolean {
    const userRole = this.getCurrentUser()?.role;
    return !!userRole && roles.map(r => r.toUpperCase()).includes(userRole.toUpperCase());
  }
}