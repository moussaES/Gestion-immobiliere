import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecetteService } from '../../../../../../frontend/src/app/shared/services/data.service';
import { Recette } from '../../../../../../frontend/src/app/shared/interfaces/models';
import { TableComponent } from '../../../../../../frontend/src/app/shared/components/table.component';

@Component({
  selector: 'app-recettes',
  standalone: true,
  imports: [CommonModule, TableComponent],
  template: `
    <div class="recettes-section">
      <div class="page-header">
        <span class="page-title">Recettes</span>
        <button class="btn-download" (click)="downloadRecettes()">
          <i class="fas fa-download"></i> TÉLÉCHARGER
        </button>
      </div>

      <div class="filters">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Rechercher...">
        </div>
        <span class="filter-label">Période</span>
        <select class="filter-select">
          <option>Janvier</option>
          <option>Février</option>
          <option>Mars</option>
          <option>Avril</option>
          <option>Mai</option>
          <option>Juin</option>
          <option>Juillet</option>
          <option>Août</option>
          <option>Septembre</option>
          <option>Octobre</option>
          <option>Novembre</option>
          <option>Décembre</option>
        </select>
      </div>

      <app-table 
        [columns]="columns"
        [rows]="recettes"
        [currentPage]="currentPage"
        [itemsPerPage]="itemsPerPage"
        [totalPages]="totalPages">
      </app-table>

      <div class="summary-row" *ngIf="recettes.length > 0">
        <div class="summary-card">
          <div class="summary-label">Total HT</div>
          <div class="summary-value">{{ getTotalHT() | number:'1.0-0' }} FCFA</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Total TVA</div>
          <div class="summary-value">{{ getTotalTVA() | number:'1.0-0' }} FCFA</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Total Commission</div>
          <div class="summary-value">{{ getTotalCommission() | number:'1.0-0' }} FCFA</div>
        </div>
        <div class="summary-card highlight">
          <div class="summary-label">À Verser</div>
          <div class="summary-value">{{ getTotalAVerser() | number:'1.0-0' }} FCFA</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .recettes-section { }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .page-title { font-size: 22px; font-weight: 600; color: #222; }
    .btn-download { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: #2e7d32; color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; }
    .btn-download:hover { background: #1b5e20; }
    .filters { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 16px; }
    .search-box { display: flex; align-items: center; gap: 8px; border: 1.5px solid #ddd; border-radius: 6px; padding: 8px 14px; background: #fff; min-width: 280px; }
    .search-box input { border: none; outline: none; font-size: 14px; flex: 1; }
    .filter-label { font-size: 13px; color: #666; font-weight: 500; }
    .filter-select { padding: 9px 14px; border: 1.5px solid #ddd; border-radius: 6px; font-size: 14px; background: #fff; color: #333; cursor: pointer; }
    .summary-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-top: 24px;
    }
    .summary-card {
      background: #fff;
      border-radius: 10px;
      padding: 20px;
      border-left: 4px solid #1a237e;
      box-shadow: 0 1px 6px rgba(0,0,0,0.07);
    }
    .summary-card.highlight {
      border-left-color: #00c897;
      background: #f0fdf4;
    }
    .summary-label { font-size: 12px; color: #888; font-weight: 600; text-transform: uppercase; margin-bottom: 8px; }
    .summary-value { font-size: 20px; font-weight: 700; color: #1a237e; }
    .summary-card.highlight .summary-value { color: #00c897; }
  `]
})
export class RecettesComponent implements OnInit {
  recettes: Recette[] = [];
  columns = [
    { label: 'Propriétaire', field: 'proprietaireName' },
    { label: 'Locataire', field: 'locataireName' },
    { label: 'Montant HT', field: 'montantHT', type: 'currency' },
    { label: 'TVA', field: 'tva', type: 'currency' },
    { label: 'TOM', field: 'tom', type: 'currency' },
    { label: 'Montant TTC', field: 'montantTTC', type: 'currency' },
    { label: 'Commission', field: 'commission', type: 'currency' },
    { label: 'À Verser', field: 'aVerser', type: 'currency' }
  ];

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  constructor(private recetteService: RecetteService) {}

  ngOnInit(): void {
    this.loadRecettes();
  }

  loadRecettes(): void {
    this.recetteService.getAll().subscribe({
      next: (data) => {
        this.recettes = data;
        this.totalPages = Math.ceil(data.length / this.itemsPerPage);
      }
    });
  }

  downloadRecettes(): void {
    this.recetteService.telecharger().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `recettes-${new Date().toISOString().split('T')[0]}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }

  getTotalHT(): number {
    return this.recettes.reduce((sum, r) => sum + (r.montantHT || 0), 0);
  }

  getTotalTVA(): number {
    return this.recettes.reduce((sum, r) => sum + (r.tva || 0), 0);
  }

  getTotalCommission(): number {
    return this.recettes.reduce((sum, r) => sum + (r.commission || 0), 0);
  }

  getTotalAVerser(): number {
    return this.recettes.reduce((sum, r) => sum + (r.aVerser || 0), 0);
  }
}
