import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { DashboardStats } from '../../../core/models';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiResponse } from '../../../core/models';import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  imports: [CommonModule, RouterModule],
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;

  constructor(
    private dashboardService: DashboardService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe({
      next:  (res: ApiResponse<DashboardStats>) => { this.stats = res.data; this.loading = false; },
      error: ()  => { this.loading = false; },
    });
  }

  isAdmin(): boolean {
    return this.auth.hasRole('ADMIN');
  }
}