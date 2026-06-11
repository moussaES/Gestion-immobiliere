import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BailleurService } from '../../../../../../frontend/src/app/shared/services/data.service';
import { Bailleur } from '../../../../../../frontend/src/app/shared/interfaces/models';
import { TableComponent } from '../../../../../../frontend/src/app/shared/components/table.component';

@Component({
  selector: 'app-bailleurs',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent],
  template: `
    <div class="bailleurs-section">
      <div class="page-header">
        <span class="page-title">Bailleurs</span>
        <button class="btn-create" (click)="createBailleur()">
          <i class="fas fa-plus"></i> AJOUTER BAILLEUR
        </button>
      </div>

      <div class="filters">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Rechercher...">
        </div>
      </div>

      <app-table 
        [columns]="columns"
        [rows]="bailleurs"
        [currentPage]="currentPage"
        [itemsPerPage]="itemsPerPage"
        [totalPages]="totalPages"
        (onView)="viewBailleur($event)">
      </app-table>
    </div>
  `,
  styles: [`
    .bailleurs-section { }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .page-title { font-size: 22px; font-weight: 600; color: #222; }
    .btn-create { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: #fff; border: 1.5px solid #1a237e; border-radius: 6px; color: #1a237e; font-weight: 600; cursor: pointer; }
    .btn-create:hover { background: #1a237e; color: #fff; }
    .filters { display: flex; gap: 12px; margin-bottom: 16px; }
    .search-box { display: flex; align-items: center; gap: 8px; border: 1.5px solid #ddd; border-radius: 6px; padding: 8px 14px; background: #fff; min-width: 280px; }
    .search-box input { border: none; outline: none; font-size: 14px; flex: 1; }
  `]
})
export class BailleursComponent implements OnInit {
  bailleurs: Bailleur[] = [];
  columns = [
    { label: 'Nom', field: 'nom' },
    { label: 'Téléphone', field: 'telephone' },
    { label: 'Email', field: 'email' },
    { label: 'Biens', field: 'biensCount' },
    { label: 'Contrats', field: 'contratsCount' },
    { label: 'Revenu Total', field: 'revenuTotal', type: 'currency' }
  ];

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  constructor(private bailleurService: BailleurService, private router: Router) {}

  ngOnInit(): void {
    this.loadBailleurs();
  }

  loadBailleurs(): void {
    this.bailleurService.getAll().subscribe({
      next: (data) => {
        this.bailleurs = data;
        this.totalPages = Math.ceil(data.length / this.itemsPerPage);
      }
    });
  }

  createBailleur(): void {
    this.router.navigate(['/bailleurs/new']);
  }

  viewBailleur(bailleur: Bailleur): void {
    this.router.navigate(['/bailleurs', bailleur.id]);
  }
}
