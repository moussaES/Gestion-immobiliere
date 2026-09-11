import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-card-new" [ngClass]="'bg-' + color" [routerLink]="link ? link : null" [style.cursor]="link ? 'pointer' : 'default'">
      <div class="dashboard-card-title">{{ title }}</div>
      <div class="dashboard-card-value">
        {{ isCurrency ? (value | number) + ' FCFA' : value }}
      </div>
      <div *ngIf="subtitle" class="dashboard-card-subtitle">
        {{ subtitle }}
      </div>
      <div class="dashboard-card-badge">{{ badge }}</div>
    </div>
  `,
  styles: [`
    .dashboard-card-subtitle {
      font-size: 12px;
      color: #fff;
      margin-top: 5px;
    }
    .dashboard-card-new[style*="cursor: pointer"] {
      transition: transform 0.2s ease, opacity 0.2s ease;
    }
    .dashboard-card-new[style*="cursor: pointer"]:hover {
      opacity: 0.92;
      transform: translateY(-2px);
    }
  `]
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: any = '';
  @Input() badge: string = '';
  @Input() color: string = 'blue';
  @Input() subtitle?: string;
  @Input() isCurrency: boolean = false;
  @Input() link?: string;
}
