import { Component, Input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-card-new" [ngClass]="'bg-' + color">
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
  `]
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: any = '';
  @Input() badge: string = '';
  @Input() color: string = 'blue';
  @Input() subtitle?: string;
  @Input() isCurrency: boolean = false;
}
