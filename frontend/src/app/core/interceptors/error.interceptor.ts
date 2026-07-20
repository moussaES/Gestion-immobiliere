import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router, private toast: ToastService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.toast.error('Session expirée ou non autorisée.');
          this.auth.logout();
        } else if (err.status === 403) {
          this.toast.error('Accès refusé.');
          this.router.navigate(['/dashboard']);
        } else if (err.status === 422) {
          this.toast.error('Veuillez vérifier les informations saisies.');
        } else if (err.status >= 500) {
          this.toast.error('Erreur interne du serveur.');
        } else if (err.status === 0) {
          this.toast.error('Impossible de se connecter au serveur.');
        } else {
          const message = err.error?.message || 'Une erreur est survenue';
          this.toast.error(message);
        }
        return throwError(() => err);
      })
    );
  }
}