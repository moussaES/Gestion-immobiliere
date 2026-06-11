import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BienService } from '../../../../../../frontend/src/app/shared/services/data.service';
import { Dashboard, Bien } from '../../../../../../frontend/src/app/shared/interfaces/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="resume-section">
      <div class="resume-grid">
        <div class="resume-card c-violet" (click)="navigate('biens')">
          <div><div class="card-label">Biens Occupés</div><div class="card-value">36</div></div>
          <div class="card-badge">BO</div>
        </div>
        <div class="resume-card c-teal" (click)="navigate('biens')">
          <div><div class="card-label">Biens Libres</div><div class="card-value">27</div></div>
          <div class="card-badge">BL</div>
        </div>
        <div class="resume-card c-orange" (click)="navigate('biens')">
          <div><div class="card-label">Biens Réservés</div><div class="card-value">17</div></div>
          <div class="card-badge">BR</div>
        </div>
        <div class="resume-card c-blue" (click)="navigate('biens')">
          <div><div class="card-label">Total Biens</div><div class="card-value">80</div></div>
          <div class="card-badge">TB</div>
        </div>
      </div>

      <div class="resume-row3">
        <div class="resume-card c-red" (click)="navigate('contrats')">
          <div><div class="card-label">Contrats Actifs</div><div class="card-value">49</div></div>
          <div class="card-badge">CA</div>
        </div>
        <div class="resume-card c-pink" (click)="navigate('contrats')">
          <div><div class="card-label">Nouveaux Contrats</div><div class="card-value">2</div></div>
          <div class="card-badge">NC</div>
        </div>
        <div class="resume-card c-darkpink" (click)="navigate('contrats')">
          <div><div class="card-label">Contrats Non Actifs</div><div class="card-value">11</div></div>
          <div class="card-badge">CNA</div>
        </div>
      </div>

      <div class="resume-grid" style="margin-top:16px;">
        <div class="resume-card c-lblue">
          <div><div class="card-label">Taux d'Occupation</div><div class="card-value">45%</div></div>
          <div class="card-badge">45%</div>
        </div>
        <div class="resume-card c-green" (click)="navigate('recettes')">
          <div><div class="card-label">Revenues du Mois</div><div class="card-value">4 330 087 FCFA</div></div>
          <div class="card-badge">REV</div>
        </div>
      </div>

      <div class="portail"><a href="#">Portail web: www.etoilesineimmo.sn</a></div>
    </div>
  `,
  styles: [`
    .resume-section { padding: 0; }
    .resume-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }
    .resume-card {
      border-radius: 10px;
      padding: 24px 22px;
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      min-height: 110px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .resume-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.18); }
    .card-label {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
      opacity: 0.95;
    }
    .card-value { font-size: 42px; font-weight: 800; line-height: 1; }
    .card-badge {
      background: rgba(255,255,255,0.25);
      border-radius: 6px;
      padding: 6px 10px;
      font-size: 13px;
      font-weight: 700;
      align-self: flex-end;
    }
    .c-violet { background: #7c4dff; }
    .c-teal { background: #26c6da; }
    .c-orange { background: #ffa000; }
    .c-blue { background: #2196f3; }
    .c-red { background: #f44336; }
    .c-pink { background: #e91e63; }
    .c-darkpink { background: #ec407a; }
    .c-lblue { background: #00bcd4; }
    .c-green { background: #00c897; }
    .resume-row3 { grid-column: 1/-1; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
    .portail { text-align: center; padding: 16px; color: #aaa; font-size: 13px; }
    .portail a { color: #1a237e; }
  `]
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router, private bienService: BienService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    // Load dashboard data
  }

  navigate(route: string): void {
    this.router.navigate([`/${route}`]);
  }
}
