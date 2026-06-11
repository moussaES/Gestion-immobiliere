import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BienService } from '../../../core/services/bien.service';
import { Bien } from '../../../core/models';

@Component({
  selector: 'app-bien-list',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="list-header">
        <h2>Répertoire des biens</h2>
        <a routerLink="/biens/nouveau" class="btn btn-outline-primary">+ CRÉER UN BIEN</a>
      </div>
      
      <div class="filter-bar">
        <div class="search-input">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Rechercher...">
        </div>
        <div class="filters">
          <label>Statut</label>
          <select>
            <option>Tout</option>
          </select>
          <label>Taille</label>
          <select>
            <option>5</option>
            <option>10</option>
            <option>20</option>
          </select>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Référence</th>
              <th>Type</th>
              <th>Ville & Adresse</th>
              <th>Loyer & Charges</th>
              <th>Propriétaire</th>
              <th>Statut</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let bien of biens">
              <td><div class="primary-text">{{ bien.reference }}</div></td>
              <td>{{ bien.type | uppercase }}</td>
              <td>
                <div class="primary-text">{{ bien.ville }}</div>
                <div class="secondary-text">{{ bien.adresse }}</div>
              </td>
              <td>
                <div class="primary-text">{{ bien.loyer_mensuel }} FCFA</div>
                <div class="secondary-text">+ {{ bien.charges }} FCFA</div>
              </td>
              <td>
                <div class="primary-text" *ngIf="bien.proprietaire">{{ bien.proprietaire.nom }} {{ bien.proprietaire.prenom }}</div>
                <div class="secondary-text" *ngIf="bien.proprietaire">{{ bien.proprietaire.telephone }}</div>
                <div *ngIf="!bien.proprietaire" class="secondary-text">N/A</div>
              </td>
              <td><span class="badge" [ngClass]="getBadgeClass(bien.statut)">{{ bien.statut }}</span></td>
              <td class="actions">
                <a [routerLink]="['/biens', bien.id]" class="icon-btn view-btn"><i class="fas fa-eye"></i></a>
                <a [routerLink]="['/biens/modifier', bien.id]" class="icon-btn edit-btn"><i class="fas fa-pencil-alt"></i></a>
              </td>
            </tr>
            <tr *ngIf="biens.length === 0">
              <td colspan="7" class="empty-state">Aucun bien trouvé.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; background: #f4f6f9; min-height: 100vh; }
    .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .list-header h2 { font-size: 22px; font-weight: 600; color: #333; margin: 0; }
    .btn-outline-primary { 
      border: 1px solid #1a237e; color: #1a237e; background: transparent; 
      padding: 8px 16px; border-radius: 4px; font-weight: 600; text-decoration: none; 
      font-size: 13px; letter-spacing: 0.5px; transition: all 0.2s;
    }
    .btn-outline-primary:hover { background: #1a237e; color: #fff; }
    
    .filter-bar { display: flex; gap: 20px; margin-bottom: 20px; align-items: center; }
    .search-input { 
      position: relative; display: flex; align-items: center; background: #fff; 
      border: 1px solid #ddd; border-radius: 4px; padding: 6px 12px; width: 300px;
    }
    .search-input i { color: #1a237e; margin-right: 8px; font-size: 14px; }
    .search-input input { border: none; outline: none; flex: 1; font-size: 14px; }
    .filters { display: flex; align-items: center; gap: 12px; font-size: 13px; color: #555; }
    .filters select { border: 1px solid #ddd; padding: 4px 8px; border-radius: 4px; outline: none; background: #fff; }
    
    .table-container { background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow: hidden; }
    table { width: 100%; border-collapse: collapse; text-align: left; }
    th { padding: 16px; font-size: 13px; font-weight: 600; color: #555; border-bottom: 2px solid #eee; }
    td { padding: 16px; font-size: 14px; border-bottom: 1px solid #eee; vertical-align: middle; }
    tr:hover td { background: #fafafa; }
    
    .primary-text { color: #1a237e; font-weight: 600; margin-bottom: 4px; }
    .secondary-text { color: #666; font-size: 12px; }
    
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-block; text-align: center; min-width: 20px; }
    .badge-libre { background: #e8f5e9; color: #2e7d32; }
    .badge-occupe { background: #fff3e0; color: #e65100; }
    .badge-reserve { background: #e3f2fd; color: #1565c0; }
    .badge-travaux { background: #ffebee; color: #c62828; }
    
    .actions { text-align: right; }
    .icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; text-decoration: none; transition: background 0.2s; margin-left: 8px; }
    .view-btn { color: #1a237e; }
    .view-btn:hover { background: rgba(26, 35, 126, 0.1); }
    .edit-btn { color: #f57c00; }
    .edit-btn:hover { background: rgba(245, 124, 0, 0.1); }
    
    .empty-state { text-align: center; color: #999; padding: 40px !important; }
  `]
})
export class BienListComponent implements OnInit {
  biens: Bien[] = [];

  constructor(private bienSvc: BienService) {}

  ngOnInit(): void {
    this.chargerBiens();
  }

  chargerBiens(): void {
    this.bienSvc.getAll().subscribe({
      next: (res: any) => {
        this.biens = res.data.data || res.data;
      }
    });
  }

  getBadgeClass(statut: string): string {
    switch(statut) {
      case 'libre': return 'badge-libre';
      case 'occupe': return 'badge-occupe';
      case 'reserve': return 'badge-reserve';
      case 'travaux': return 'badge-travaux';
      default: return '';
    }
  }

  supprimer(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce bien ?')) {
      this.bienSvc.delete(id).subscribe(() => this.chargerBiens());
    }
  }
}