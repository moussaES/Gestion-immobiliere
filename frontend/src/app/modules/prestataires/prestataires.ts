import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PrestataireService } from '../../core/services/prestataire.service';
import { Prestataire } from '../../core/models/prestataire.model';

@Component({
  selector: 'app-prestataires',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="list-header">
        <h2>Prestataires</h2>
        <a routerLink="/prestataires/nouveau" class="btn-outline-primary">+ AJOUTER UN PRESTATAIRE</a>
      </div>

      <div class="filter-bar">
        <div class="search-input">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Rechercher par nom, prénom ou spécialité..." [(ngModel)]="searchTerm" (input)="filterData()">
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Nom & Prénom</th>
              <th>Spécialité</th>
              <th>Téléphone</th>
              <th>Adresse</th>
              <th class="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of paginatedItems">
              <td>
                <div class="primary-text">{{ p.nom }} {{ p.prenom }}</div>
              </td>
              <td>{{ p.specialite }}</td>
              <td>{{ p.telephone }}</td>
              <td><span class="secondary-text">{{ p.adresse || '-' }}</span></td>
              <td class="actions">
                <a [routerLink]="['/prestataires/modifier', p.id_prestataire]" class="icon-btn edit-btn" title="Modifier">
                  <i class="fas fa-pencil-alt"></i>
                </a>
                <button (click)="deleteItem(p)" class="icon-btn delete-btn" title="Supprimer">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr *ngIf="paginatedItems.length === 0">
              <td colspan="5" class="empty-state">Aucun prestataire trouvé.</td>
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
    .table-container { background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow: hidden; }
    table { width: 100%; border-collapse: collapse; text-align: left; }
    th { padding: 16px; font-size: 13px; font-weight: 600; color: #555; border-bottom: 2px solid #eee; }
    td { padding: 16px; font-size: 14px; border-bottom: 1px solid #eee; vertical-align: middle; }
    tr:hover td { background: #fafafa; }
    .primary-text { color: #1a237e; font-weight: 600; margin-bottom: 4px; }
    .secondary-text { color: #666; font-size: 12px; }
    .actions { text-align: right; }
    .icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; text-decoration: none; transition: background 0.2s; margin-left: 8px; border: none; background: none; }
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
  `]
})
export class PrestatairesComponent implements OnInit {
  items: Prestataire[] = [];
  filteredItems: Prestataire[] = [];
  paginatedItems: Prestataire[] = [];
  
  searchTerm: string = '';
  
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  pages: number[] = [];

  constructor(private prestataireSvc: PrestataireService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.prestataireSvc.getAll().subscribe({
      next: (res: any) => {
        this.items = res.data?.data ? res.data.data : (res.data || []);
        this.filterData();
      },
      error: (err) => {
        console.error('Erreur', err);
        // Fallback or toast error here
        alert('Impossible de charger la liste');
      }
    });
  }

  filterData(): void {
    if (!this.searchTerm) {
      this.filteredItems = [...this.items];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredItems = this.items.filter(p => 
        p.nom?.toLowerCase().includes(term) || 
        p.prenom?.toLowerCase().includes(term) ||
        p.specialite?.toLowerCase().includes(term)
      );
    }
    
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

  deleteItem(p: Prestataire): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le prestataire ${p.nom} ${p.prenom} ?`)) {
      if(p.id_prestataire) {
        this.prestataireSvc.delete(p.id_prestataire).subscribe({
          next: () => {
            this.loadData();
          },
          error: (err) => {
            console.error('Erreur lors de la suppression', err);
            alert('Impossible de supprimer le prestataire');
          }
        });
      }
    }
  }
}
