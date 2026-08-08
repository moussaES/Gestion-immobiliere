import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DepenseService } from '../../core/services/depense.service';
import { ToastService } from '../../core/services/toast.service';
import { Depense } from '../../core/models/depense.model';

@Component({
  selector: 'app-depenses',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="list-header">
        <h2>Dépenses</h2>
        <a routerLink="/depenses/nouveau" class="btn-outline-primary">+ ENREGISTRER UNE DÉPENSE</a>
      </div>

      <div class="type-tabs">
        <button class="type-tab" [class.active]="activeTab === 'TOUTES'" (click)="setTab('TOUTES')">Toutes</button>
        <button class="type-tab" [class.active]="activeTab === 'AGENCE'" (click)="setTab('AGENCE')">Agence</button>
        <button class="type-tab" [class.active]="activeTab === 'BIEN'" (click)="setTab('BIEN')">Bien</button>
      </div>

      <div class="filter-bar">
        <div class="search-input">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Rechercher par description..." [(ngModel)]="searchTerm" (input)="filterData()">
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Montant</th>
              <th>Date</th>
              <th>Type</th>
              <th>Catégorie/Bien</th>
              <th class="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let d of paginatedDepenses">
              <td>
                <div class="primary-text">{{ d.description }}</div>
              </td>
              <td><span class="amount">{{ d.montant }} FCFA</span></td>
              <td>{{ d.date_depense | date:'dd/MM/yyyy' }}</td>
              <td>
                <span class="badge" [ngClass]="d.type_depense === 'AGENCE' ? 'badge-agence' : 'badge-bien'">
                  {{ d.type_depense }}
                </span>
              </td>
              <td>
                <span *ngIf="d.type_depense === 'AGENCE'">{{ d.categorie }}</span>
                <span *ngIf="d.type_depense === 'BIEN'">{{ d.bien?.reference || d.bien?.adresse || 'N/A' }}</span>
              </td>
              <td class="actions">
                <a [routerLink]="['/depenses/modifier', d.id_depense]" class="icon-btn edit-btn"><i class="fas fa-pencil-alt"></i></a>
                <button (click)="deleteDepense(d.id_depense!)" class="icon-btn delete-btn"><i class="fas fa-trash"></i></button>
              </td>
            </tr>
            <tr *ngIf="paginatedDepenses.length === 0">
              <td colspan="6" class="empty-state">Aucune dépense trouvée.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="total-row" *ngIf="paginatedDepenses.length > 0">
        Total des dépenses affichées : {{ totalMontant }} FCFA
      </div>

      <div class="pagination-controls" *ngIf="totalPages > 1">
        <button [disabled]="currentPage === 1" (click)="changePage(currentPage - 1)">Précédent</button>
        <button *ngFor="let p of pages" [class.active]="currentPage === p" (click)="changePage(p)">{{ p }}</button>
        <button [disabled]="currentPage === totalPages" (click)="changePage(currentPage + 1)">Suivant</button>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; background: #f4f6f9; min-height: 100vh; }
    .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .list-header h2 { font-size: 22px; font-weight: 600; color: #333; margin: 0; }
    .btn-outline-primary { border: 1px solid #1a237e; color: #1a237e; background: transparent; padding: 8px 16px; border-radius: 4px; font-weight: 600; text-decoration: none; font-size: 13px; letter-spacing: 0.5px; transition: all 0.2s; cursor: pointer; }
    .btn-outline-primary:hover { background: #1a237e; color: #fff; }
    .filter-bar { display: flex; gap: 20px; margin-bottom: 20px; align-items: center; }
    .search-input { position: relative; display: flex; align-items: center; background: #fff; border: 1px solid #ddd; border-radius: 4px; padding: 6px 12px; width: 300px; }
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
    .badge-agence { background: #e3f2fd; color: #1565c0; }
    .badge-bien { background: #fff3e0; color: #e65100; }
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
    .total-row { display: flex; justify-content: flex-end; padding: 16px 24px; background: #f8f9fa; border-top: 2px solid #eee; font-weight: 600; font-size: 15px; color: #333; }
    .type-tabs { display: flex; gap: 8px; margin-bottom: 16px; }
    .type-tab { padding: 8px 20px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid #ddd; background: #fff; color: #555; transition: all 0.2s; }
    .type-tab:hover { border-color: #1a237e; color: #1a237e; }
    .type-tab.active { background: #1a237e; color: #fff; border-color: #1a237e; }
  `]
})
export class DepensesComponent implements OnInit {
  depenses: Depense[] = [];
  filteredDepenses: Depense[] = [];
  paginatedDepenses: Depense[] = [];
  
  activeTab: string = 'TOUTES';
  searchTerm: string = '';
  
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  pages: number[] = [];
  totalMontant: number = 0;

  constructor(
    private depenseSvc: DepenseService,
    private toastSvc: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDepenses();
  }

  loadDepenses(): void {
    this.depenseSvc.getAll().subscribe({
      next: (res: any) => {
        this.depenses = res.data?.data ? res.data.data : (res.data || []);
        this.filterData();
      },
      error: (err) => {
        console.error('Erreur', err);
        this.toastSvc.error('Impossible de charger la liste des dépenses');
      }
    });
  }

  setTab(tab: string): void {
    this.activeTab = tab;
    this.filterData();
  }

  filterData(): void {
    this.filteredDepenses = this.depenses.filter(d => {
      let matchesTab = this.activeTab === 'TOUTES' || d.type_depense === this.activeTab;
      let matchesSearch = !this.searchTerm || d.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredDepenses.length / this.itemsPerPage) || 1;
    this.pages = Array.from({length: this.totalPages}, (_, i) => i + 1);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedDepenses = this.filteredDepenses.slice(start, start + this.itemsPerPage);
    
    this.totalMontant = this.filteredDepenses.reduce((sum, d) => sum + Number(d.montant), 0);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  deleteDepense(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      this.depenseSvc.delete(id).subscribe({
        next: () => {
          this.toastSvc.success('Dépense supprimée avec succès');
          this.loadDepenses();
        },
        error: (err) => {
          console.error(err);
          this.toastSvc.error('Erreur lors de la suppression');
        }
      });
    }
  }
}
