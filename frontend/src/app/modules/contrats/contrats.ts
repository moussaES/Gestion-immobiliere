import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';
import { ContratService } from '../../core/services/contrat.service';
import { Contrat } from '../../core/models';

@Component({
  selector: 'app-contrats',
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="list-header">
        <h2>Gestion des contrats</h2>
        <div class="header-actions">
          <button class="btn btn-outline-secondary" style="margin-right: 10px;" (click)="exportPdf()"><i class="fas fa-file-pdf"></i> Export PDF</button>
          <button class="btn btn-outline-secondary" style="margin-right: 20px;" (click)="exportCsv()"><i class="fas fa-file-csv"></i> Export CSV</button>
          <a routerLink="/contrats/nouveau" class="btn btn-outline-primary">+ NOUVEAU CONTRAT</a>
        </div>
      </div>
      
      <div class="filter-bar">
        <div class="search-input">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Rechercher une référence..." [(ngModel)]="searchTerm" (input)="filterData()">
        </div>
        <div class="filters">
          <label>Type</label>
          <select [(ngModel)]="typeFilter" (change)="filterData()">
            <option value="">Tous</option>
            <option value="LOCATAIRE">Locataire</option>
            <option value="PROPRIETAIRE">Propriétaire</option>
          </select>
          <label>Statut</label>
          <select [(ngModel)]="statutFilter" (change)="filterData()">
            <option value="">Tous</option>
            <option value="ACTIF">Actif</option>
            <option value="RESILIE">Résilié</option>
            <option value="ARCHIVE">Archivé</option>
          </select>
          <label>Taille</label>
          <select [(ngModel)]="pageSize" (change)="currentPage = 1">
            <option [ngValue]="5">5</option>
            <option [ngValue]="10">10</option>
            <option [ngValue]="20">20</option>
          </select>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Référence & Type</th>
              <th>Propriétaire / Locataire</th>
              <th>Bien Assigné</th>
              <th>Période</th>
              <th>Montant</th>
              <th>Statut</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of filteredContrats | slice:(currentPage-1)*pageSize : currentPage*pageSize">
              <td>
                <div class="primary-text">{{ c.reference }}</div>
                <div class="secondary-text">{{ c.type_contrat }}</div>
              </td>
              <td>
                <div *ngIf="c.type_contrat === 'LOCATAIRE'">
                  <div class="primary-text" *ngIf="c.locataire">{{ c.locataire.nom }} {{ c.locataire.prenom }}</div>
                  <div class="secondary-text">Locataire</div>
                </div>
                <div *ngIf="c.type_contrat === 'PROPRIETAIRE'">
                  <div class="primary-text" *ngIf="c.proprietaire">{{ c.proprietaire.nom }} {{ c.proprietaire.prenom }}</div>
                  <div class="secondary-text">Propriétaire</div>
                </div>
              </td>
              <td>
                <div class="primary-text" *ngIf="c.bien">{{ c.bien.reference }}</div>
                <div class="secondary-text" *ngIf="c.bien">{{ c.bien.type }}</div>
              </td>
              <td>
                <div>Du {{ formatDate(c.date_debut) }}</div>
                <div>Au {{ formatDate(c.date_fin) }}</div>
              </td>
              <td><span class="amount">{{ c.montant }} FCFA</span></td>
              <td><span class="badge" [ngClass]="getBadgeClass(c.statut)">{{ c.statut }}</span></td>
              <td class="actions">
                <a [routerLink]="['/contrats', c.id_contrat]" class="icon-btn view-btn"><i class="fas fa-eye"></i></a>
                <a [routerLink]="['/contrats/modifier', c.id_contrat]" class="icon-btn edit-btn"><i class="fas fa-pencil-alt"></i></a>
              </td>
            </tr>
            <tr *ngIf="filteredContrats.length === 0">
              <td colspan="7" class="empty-state">Aucun contrat trouvé.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination-controls" *ngIf="filteredContrats.length > pageSize">
        <button [disabled]="currentPage === 1" (click)="currentPage = currentPage - 1">&laquo;</button>
        <button *ngFor="let p of pages" [class.active]="p === currentPage" (click)="currentPage = p">{{ p }}</button>
        <button [disabled]="currentPage === pages.length" (click)="currentPage = currentPage + 1">&raquo;</button>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; background: #f4f6f9; min-height: 100vh; }
    .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .list-header h2 { font-size: 22px; font-weight: 600; color: #333; margin: 0; }
    .header-actions { display: flex; align-items: center; }
    .btn-outline-primary { 
      border: 1px solid #1a237e; color: #1a237e; background: transparent; 
      padding: 8px 16px; border-radius: 4px; font-weight: 600; text-decoration: none; 
      font-size: 13px; letter-spacing: 0.5px; transition: all 0.2s; cursor: pointer;
    }
    .btn-outline-primary:hover { background: #1a237e; color: #fff; }
    .btn-outline-secondary {
      border: 1px solid #555; color: #555; background: transparent;
      padding: 8px 16px; border-radius: 4px; font-weight: 600; text-decoration: none;
      font-size: 13px; letter-spacing: 0.5px; transition: all 0.2s; cursor: pointer;
    }
    .btn-outline-secondary:hover { background: #555; color: #fff; }
    
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
    .amount { font-weight: 600; }
    
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-block; text-align: center; min-width: 20px; text-transform: uppercase; }
    .badge-actif { background: #e8f5e9; color: #2e7d32; }
    .badge-resilie { background: #ffebee; color: #c62828; }
    .badge-archive { background: #f5f5f5; color: #757575; }
    
    .actions { text-align: right; }
    .icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; text-decoration: none; transition: background 0.2s; margin-left: 8px; }
    .edit-btn { color: #f57c00; }
    .edit-btn:hover { background: rgba(245, 124, 0, 0.1); }
    
    .empty-state { text-align: center; color: #999; padding: 40px !important; }
    
    .pagination-controls { display: flex; justify-content: flex-end; gap: 4px; margin-top: 16px; align-items: center; }
    .pagination-controls button { padding: 6px 12px; border: 1px solid #ddd; background: #fff; border-radius: 4px; cursor: pointer; color: #1a237e; font-weight: 600; font-size: 13px; transition: all 0.2s; }
    .pagination-controls button:hover:not([disabled]) { background: #f4f6f9; }
    .pagination-controls button.active { background: #1a237e; color: #fff; border-color: #1a237e; }
    .pagination-controls button[disabled] { color: #ccc; cursor: not-allowed; border-color: #eee; }
  `]
})
export class ContratsComponent implements OnInit {
  contrats: Contrat[] = [];
  filteredContrats: Contrat[] = [];
  pageSize: number = 5;
  currentPage: number = 1;

  get pages(): number[] {
    const total = Math.ceil(this.filteredContrats.length / this.pageSize);
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  
  searchTerm = '';
  typeFilter = '';
  statutFilter = '';

  constructor(
    private contratSvc: ContratService,
    private toastSvc: ToastService
  ) {}

  ngOnInit(): void {
    this.chargerContrats();
  }

  chargerContrats(): void {
    this.contratSvc.getAll().subscribe({
      next: (res: any) => {
        this.contrats = res.data?.data ? res.data.data : (res.data || []);
        this.filterData();
      },
      error: (err) => {
        console.error('Erreur', err);
        this.toastSvc.error('Impossible de charger la liste des contrats');
      }
    });
  }

  filterData(): void {
    this.filteredContrats = this.contrats.filter(c => {
      const ref = c.reference || '';
      const matchSearch = this.searchTerm ? 
        ref.toLowerCase().includes(this.searchTerm.toLowerCase()) 
        : true;
      const matchType = this.typeFilter ? c.type_contrat === this.typeFilter : true;
      const matchStatut = this.statutFilter ? c.statut === this.statutFilter : true;
      return matchSearch && matchType && matchStatut;
    });
    this.currentPage = 1;
  }

  getBadgeClass(statut: string): string {
    switch(statut) {
      case 'ACTIF': return 'badge-actif';
      case 'RESILIE': return 'badge-resilie';
      case 'ARCHIVE': return 'badge-archive';
      default: return '';
    }
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR');
  }

  exportPdf(): void {
    window.open('http://127.0.0.1:8000/api/contrats/export/pdf/all', '_blank');
  }

  exportCsv(): void {
    window.open('http://127.0.0.1:8000/api/contrats/export/csv/all', '_blank');
  }
}
