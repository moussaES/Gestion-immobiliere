import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const rolesAutorises: string[] = route.data['roles'] ?? [];
    if (this.auth.hasAnyRole(rolesAutorises)) return true;
    this.router.navigate(['/dashboard']);
    return false;
  }
}