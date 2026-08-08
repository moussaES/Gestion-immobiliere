import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TravailService } from '../../core/services/travail.service';
import { Travail } from '../../core/models/travail.model';

@Component({
  selector: 'app-travaux',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="list-header">
        <h2>Travaux</h2>
        <a routerLink="/travaux/nouveau" class="btn-outline-primary">+ AJOUTER UN TRAVAIL</a>
      </div>

      <div class="filter-bar">
        <div class="search-input">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Rechercher par titre, description..." [(ngModel)]="searchTerm" (input)="filterData()">
        </div>
        <select [(ngModel)]="statusFilter" (change)="filterData()" class="form-select">
          <option value="">Tous les statuts</option>
          <option value="PREVU">Prévu</option>
          <option value="EN_COURS">En cours</option>
          <option value="TERMINE">Terminé</option>
          <option value="ANNULE">Annulé</option>
        </select>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Bien</th>
              <th>Statut</th>
              <th>Date d'intervention</th>
              <th>Montant</th>
              <th class="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of paginatedItems">
              <td>
                <div class="primary-text">{{ t.titre }}</div>
                <div class="secondary-text">{{ t.prestataire?.nom || 'Sans prestataire' }}</div>
              </td>
              <td>{{ t.bien?.reference || 'N/A' }}</td>
              <td>
                <span class="status-badge" [ngClass]="t.statut.toLowerCase()">
                  {{ t.statut }}
                </span>
              </td>
              <td>{{ t.date_intervention | date:'dd/MM/yyyy' }}</td>
              <td>{{ t.montant | currency:'XOF':'symbol':'1.0-0' }}</td>
              <td class="actions">
                <a [routerLink]="['/travaux', t.id_travail]" class="icon-btn view-btn" title="Voir">
                  <i class="fas fa-eye"></i>
                </a>
                <a [routerLink]="['/travaux/modifier', t.id_travail]" class="icon-btn edit-btn" title="Modifier">
                  <i class="fas fa-pencil-alt"></i>
                </a>
                <button (click)="deleteItem(t)" class="icon-btn delete-btn" title="Supprimer">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr *ngIf="paginatedItems.length === 0">
              <td colspan="6" class="empty-state">Aucun travail trouvé.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination-controls" *ngIf="totalPages > 1">
        <button [disabled]="currentPage === 1" (click)="changePage(currentPage - 1)">Précédent</button>
        <button *ngFor="let page of pages" [class.active]="currentPage === page" (click)="changePage(page)">
          {{ page }}
        </button>
        <button [disabled]="currentPage === totalPages" (click)="changePage(currentPage + 1)">Suivant</button>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; background: #f4f6f9; min-height: 100vh; }
    .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .list-header h2 { font-size: 22px; font-weight: 600; color: #333; margin: 0; }
    .btn-outline-primary { border: 1px solid #1a237e; color: #1a237e; background: transparent; padding: 8px 16px; border-radius: 4px; font-weight: 600; text-decoration: none; font-size: 13px; letter-spacing: 0.5px; transition: all 0.2s; cursor: pointer; display: inline-block; }
    .btn-outline-primary:hover { background: #1a237e; color: #fff; }
    .filter-bar { display: flex; gap: 20px; margin-bottom: 20px; align-items: center; }
    .search-input { position: relative; display: flex; align-items: center; background: #fff; border: 1px solid #ddd; border-radius: 4px; padding: 6px 12px; width: 300px; }
    .search-input i { color: #1a237e; margin-right: 8px; font-size: 14px; }
    .search-input input { border: none; outline: none; flex: 1; font-size: 14px; }
    .form-select { padding: 8px; border-radius: 4px; border: 1px solid #ddd; }
    .table-container { background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow: hidden; }
    table { width: 100%; border-collapse: collapse; text-align: left; }
    th { padding: 16px; font-size: 13px; font-weight: 600; color: #555; border-bottom: 2px solid #eee; }
    td { padding: 16px; font-size: 14px; border-bottom: 1px solid #eee; vertical-align: middle; }
    tr:hover td { background: #fafafa; }
    .primary-text { color: #1a237e; font-weight: 600; margin-bottom: 4px; }
    .secondary-text { color: #666; font-size: 12px; }
    .actions { text-align: right; }
    .icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; text-decoration: none; transition: background 0.2s; margin-left: 8px; border: none; background: none; }
    .view-btn { color: #1976d2; }
    .view-btn:hover { background: rgba(25, 118, 210, 0.1); }
    .edit-btn { color: #f57c00; }
    .edit-btn:hover { background: rgba(245, 124, 0, 0.1); }
    .delete-btn { color: #c62828; }
    .delete-btn:hover { background: rgba(198, 40, 40, 0.1); }
    .empty-state { text-align: center; color: #999; padding: 40px !important; }
    .pagination-controls { display: flex; justify-content: flex-end; gap: 4px; margin-top: 16px; align-items: center; }
    .pagination-controls button { padding: 6px 12px; border: 1px solid #ddd; background: #fff; border-radius: 4px; cursor: pointer; color: #1a237e; font-weight: 600; font-size: 13px; transition: all 0.2s; }
    .pagination-controls button:hover:not([disabled]) { background: #f4f6f9; }
    .pagination-controls button.active { background: #1a237e; color: #fff; border-color: #1a237e; }
    .pagination-controls button[disabled] { color: #ccc; cursor: not-allowed; border-color: #eee; }
    .status-badge { display: inline-block; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
    .prevu { background: #e3f2fd; color: #1565c0; }
    .en_cours { background: #fff3e0; color: #e65100; }
    .termine { background: #e8f5e9; color: #2e7d32; }
    .annule { background: #ffebee; color: #c62828; }
  `]
})
export class TravauxComponent implements OnInit {
  items: Travail[] = [];
  filteredItems: Travail[] = [];
  paginatedItems: Travail[] = [];
  
  searchTerm: string = '';
  statusFilter: string = '';
  
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  pages: number[] = [];

  constructor(private travailSvc: TravailService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.travailSvc.getAll().subscribe({
      next: (res: any) => {
        this.items = res.data || [];
        this.filterData();
      },
      error: (err) => {
        console.error('Erreur', err);
        alert('Impossible de charger la liste');
      }
    });
  }

  filterData(): void {
    let filtered = [...this.items];
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.titre?.toLowerCase().includes(term) || 
        t.description?.toLowerCase().includes(term)
      );
    }
    
    if (this.statusFilter) {
      filtered = filtered.filter(t => t.statut === this.statusFilter);
    }
    
    this.filteredItems = filtered;
    this.totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;
    if (this.currentPage > this.totalPages) this.currentPage = 1;
    
    this.pages = Array.from({length: this.totalPages}, (_, i) => i + 1);
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedItems = this.filteredItems.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  deleteItem(t: Travail): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ce travail ?`)) {
      if(t.id_travail) {
        this.travailSvc.delete(t.id_travail).subscribe({
          next: () => {
            this.loadData();
          },
          error: (err) => {
            console.error('Erreur lors de la suppression', err);
            alert('Impossible de supprimer le travail');
          }
        });
      }
    }
  }
}
