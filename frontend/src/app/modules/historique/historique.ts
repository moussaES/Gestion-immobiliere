import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistoriqueService } from '../../core/services/historique.service';
import { HistoriqueOperation } from '../../core/models';

@Component({
  selector: 'app-historique',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="list-header">
        <h2>Historique d'activité</h2>
        <div class="header-actions">
          <button class="btn btn-outline-primary" (click)="chargerHistorique()"><i class="fas fa-sync-alt"></i> Rafraîchir</button>
        </div>
      </div>
      
      <div class="filter-bar">
        <div class="search-input">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Rechercher une opération..." [(ngModel)]="searchTerm" (input)="filterData()">
        </div>
        <div class="filters">
          <label>Type</label>
          <select [(ngModel)]="typeFilter" (change)="filterData()">
            <option value="">Tous</option>
            <option value="INSERT">Création</option>
            <option value="UPDATE">Modification</option>
            <option value="DELETE">Suppression</option>
          </select>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Date & Heure</th>
              <th>Utilisateur</th>
              <th>Action</th>
              <th>Entité</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let op of filteredHistorique">
              <td>
                <div class="primary-text">{{ formatDate(op.date_operation) }}</div>
                <div class="secondary-text">{{ formatTime(op.date_operation) }}</div>
              </td>
              <td>
                <div class="primary-text" *ngIf="op.utilisateur">{{ op.utilisateur.nom }} {{ op.utilisateur.prenom }}</div>
                <div class="secondary-text" *ngIf="!op.utilisateur">Système</div>
              </td>
              <td><span class="badge" [ngClass]="getBadgeClass(op.type_operation)">{{ op.type_operation }}</span></td>
              <td>
                <div class="primary-text">{{ op.entite }}</div>
                <div class="secondary-text">ID: {{ op.id_entite }}</div>
              </td>
              <td class="desc-cell">{{ op.description }}</td>
            </tr>
            <tr *ngIf="filteredHistorique.length === 0">
              <td colspan="5" class="empty-state">Aucune opération trouvée.</td>
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
      font-size: 13px; letter-spacing: 0.5px; transition: all 0.2s; cursor: pointer;
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
    .desc-cell { max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 13px; color: #555; }
    
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-block; text-align: center; min-width: 20px; }
    .badge-insert { background: #e8f5e9; color: #2e7d32; }
    .badge-update { background: #fff3e0; color: #e65100; }
    .badge-delete { background: #ffebee; color: #c62828; }
    
    .empty-state { text-align: center; color: #999; padding: 40px !important; }
  `]
})
export class HistoriqueComponent implements OnInit {
  historique: HistoriqueOperation[] = [];
  filteredHistorique: HistoriqueOperation[] = [];
  
  searchTerm = '';
  typeFilter = '';

  constructor(private histSvc: HistoriqueService) {}

  ngOnInit(): void {
    this.chargerHistorique();
  }

  chargerHistorique(): void {
    this.histSvc.getAll().subscribe({
      next: (res: any) => {
        this.historique = res.data.data || res.data;
        this.filterData();
      }
    });
  }

  filterData(): void {
    this.filteredHistorique = this.historique.filter(op => {
      const matchSearch = this.searchTerm ? 
        (op.description?.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
         op.entite?.toLowerCase().includes(this.searchTerm.toLowerCase())) 
        : true;
      const matchType = this.typeFilter ? op.type_operation === this.typeFilter : true;
      return matchSearch && matchType;
    });
  }

  getBadgeClass(type: string): string {
    switch(type) {
      case 'INSERT': return 'badge-insert';
      case 'UPDATE': return 'badge-update';
      case 'DELETE': return 'badge-delete';
      default: return '';
    }
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR');
  }

  formatTime(dateStr?: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
}
