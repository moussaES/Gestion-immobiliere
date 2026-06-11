import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepenseService } from '../../../../../../frontend/src/app/shared/services/data.service';
import { Depense } from '../../../../../../frontend/src/app/shared/interfaces/models';
import { TableComponent } from '../../../../../../frontend/src/app/shared/components/table.component';
import { ModalComponent } from '../../../../../../frontend/src/app/shared/components/modal.component';

@Component({
  selector: 'app-depenses',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent, ModalComponent],
  template: `
    <div class="depenses-section">
      <div class="page-header">
        <span class="page-title">Dépenses</span>
        <button class="btn-create" (click)="openCreateModal()">
          <i class="fas fa-plus"></i> AJOUTER DÉPENSE
        </button>
      </div>

      <div class="filters">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Rechercher...">
        </div>
        <span class="filter-label">Type</span>
        <select class="filter-select">
          <option>Tout</option>
          <option>Travaux</option>
          <option>Entretien</option>
          <option>Peinture</option>
          <option>Plomberie</option>
          <option>Électricité</option>
          <option>Autre</option>
        </select>
      </div>

      <app-table 
        [columns]="columns"
        [rows]="depenses"
        [currentPage]="currentPage"
        [itemsPerPage]="itemsPerPage"
        [totalPages]="totalPages">
      </app-table>
    </div>

    <app-modal 
      [isOpen]="isCreateModalOpen"
      title="Ajouter une Dépense"
      iconClass="fas fa-receipt"
      saveButtonText="Enregistrer la dépense"
      (onClose)="closeModal()"
      (onSave)="saveDepense()">
      
      <div class="form-row">
        <div class="form-group">
          <label>Produit *</label>
          <select [(ngModel)]="formData.bienId">
            <option>PROD-783362-3029</option>
            <option>PROD-783362-7324</option>
          </select>
        </div>
        <div class="form-group">
          <label>Type de dépense *</label>
          <select [(ngModel)]="formData.type">
            <option>Travaux</option>
            <option>Entretien</option>
            <option>Peinture</option>
            <option>Plomberie</option>
            <option>Électricité</option>
            <option>Autre</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label>Description *</label>
        <textarea placeholder="Détails de la dépense..." style="min-height:80px;" [(ngModel)]="formData.description"></textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Montant (FCFA) *</label>
          <input type="number" placeholder="Ex: 150000" [(ngModel)]="formData.montant">
        </div>
        <div class="form-group">
          <label>Date *</label>
          <input type="date" [(ngModel)]="formData.date">
        </div>
      </div>
    </app-modal>
  `,
  styles: [`
    .depenses-section { }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .page-title { font-size: 22px; font-weight: 600; color: #222; }
    .btn-create { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: #fff; border: 1.5px solid #1a237e; border-radius: 6px; color: #1a237e; font-weight: 600; cursor: pointer; }
    .btn-create:hover { background: #1a237e; color: #fff; }
    .filters { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 16px; }
    .search-box { display: flex; align-items: center; gap: 8px; border: 1.5px solid #ddd; border-radius: 6px; padding: 8px 14px; background: #fff; min-width: 280px; }
    .search-box input { border: none; outline: none; font-size: 14px; flex: 1; }
    .filter-label { font-size: 13px; color: #666; font-weight: 500; }
    .filter-select { padding: 9px 14px; border: 1.5px solid #ddd; border-radius: 6px; font-size: 14px; background: #fff; color: #333; cursor: pointer; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { margin-bottom: 18px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; color: #444; margin-bottom: 7px; }
    .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 11px 14px; border: 1.5px solid #ddd; border-radius: 8px; font-size: 14px; font-family: inherit; }
  `]
})
export class DepensesComponent implements OnInit {
  depenses: Depense[] = [];
  columns = [
    { label: 'Produit', field: 'bienRef' },
    { label: 'Type', field: 'type' },
    { label: 'Description', field: 'description' },
    { label: 'Montant', field: 'montant', type: 'currency' },
    { label: 'Date', field: 'date' }
  ];

  isCreateModalOpen = false;
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  formData: Partial<Depense> = {};

  constructor(private depenseService: DepenseService) {}

  ngOnInit(): void {
    this.loadDepenses();
  }

  loadDepenses(): void {
    this.depenseService.getAll().subscribe({
      next: (data) => {
        this.depenses = data;
        this.totalPages = Math.ceil(data.length / this.itemsPerPage);
      }
    });
  }

  openCreateModal(): void {
    this.isCreateModalOpen = true;
  }

  closeModal(): void {
    this.isCreateModalOpen = false;
    this.formData = {};
  }

  saveDepense(): void {
    console.log('Saving depense:', this.formData);
    this.closeModal();
  }
}
