import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { Utilisateur } from './core/models';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('frontend');
  currentUser: Utilisateur | null = null;
  isSidebarCollapsed = false;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.auth.hasRole('ADMIN');
  }

  isGestionnaireOrAdmin(): boolean {
    return this.auth.hasAnyRole(['ADMIN', 'GESTIONNAIRE']);
  }


  logout(): void {
    this.auth.logout();
  }
}
