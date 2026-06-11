import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaiementService } from '../../../../../../frontend/src/app/shared/services/data.service';
import { Paiement } from '../../../../../../frontend/src/app/shared/interfaces/models';
import { TableComponent } from '../../../../../../frontend/src/app/shared/components/table.component';
import { ModalComponent } from '../../../../../../frontend/src/app/shared/components/modal.component';

@Component({
  selector: 'app-paiements',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent, ModalComponent],
  template: `
    <div class="paiements-section">
      <div class="page-header">
        <span class="page-title">Paiements</span>
        <button class="btn-create" (click)="openCreateModal()">
          <i class="fas fa-plus"></i> ENREGISTRER UN PAIEMENT
        </button>
      </div>

      <div class="filters">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Rechercher...">
        </div>
        <span class="filter-label">Mode</span>
        <select class="filter-select">
          <option>Tout</option>
          <option>CHÈQUE</option>
          <option>VIREMENT</option>
          <option>ESPÈCES</option>
          <option>WAVE</option>
          <option>ORANGE MONEY</option>
        </select>
        <span class="filter-label">Statut</span>
        <select class="filter-select">
          <option>Tout</option>
          <option>Payé</option>
          <option>En attente</option>
          <option>Partiel</option>
        </select>
      </div>

      <app-table 
        [columns]="columns"
        [rows]="paiements"
        [currentPage]="currentPage"
        [itemsPerPage]="itemsPerPage"
        [totalPages]="totalPages">
      </app-table>
    </div>

    <app-modal 
      [isOpen]="isCreateModalOpen"
      title="Enregistrer un Paiement"
      iconClass="fas fa-money-bill-wave"
      saveButtonText="Enregistrer le paiement"
      (onClose)="closeModal()"
      (onSave)="savePaiement()">
      
      <div class="form-row">
        <div class="form-group">
          <label>Contrat *</label>
          <select [(ngModel)]="formData.contratId">
            <option>CONT-644685-9498</option>
            <option>CONT-521340-2217</option>
          </select>
        </div>
        <div class="form-group">
          <label>Mode de paiement *</label>
          <select [(ngModel)]="formData.mode">
            <option>CHÈQUE</option>
            <option>VIREMENT</option>
            <option>ESPÈCES</option>
            <option>WAVE</option>
            <option>ORANGE MONEY</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Montant (FCFA) *</label>
          <input type="number" placeholder="Ex: 250000" [(ngModel)]="formData.montant">
        </div>
        <div class="form-group">
          <label>Date de paiement *</label>
          <input type="date" [(ngModel)]="formData.datePaiement">
        </div>
      </div>
      <div class="form-group">
        <label>Référence (Chèque, Virement, etc.)</label>
        <input type="text" placeholder="Ex: N° de chèque" [(ngModel)]="formData.reference">
      </div>
    </app-modal>
  `,
  styles: [`
    .paiements-section { }
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
    .form-group input, .form-group select { width: 100%; padding: 11px 14px; border: 1.5px solid #ddd; border-radius: 8px; font-size: 14px; }
  `]
})
export class PaiementsComponent implements OnInit {
  paiements: Paiement[] = [];
  columns = [
    { label: 'Référence', field: 'reference' },
    { label: 'Contrat', field: 'contratNum' },
    { label: 'Locataire', field: 'locataireName' },
    { label: 'Montant', field: 'montant', type: 'currency' },
    { label: 'Mode', field: 'mode' },
    { label: 'Date', field: 'datePaiement' },
    { label: 'Statut', field: 'statut', type: 'badge' }
  ];

  isCreateModalOpen = false;
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  formData: Partial<Paiement> = {};

  constructor(private paiementService: PaiementService) {}

  ngOnInit(): void {
    this.loadPaiements();
  }

  loadPaiements(): void {
    this.paiementService.getAll().subscribe({
      next: (data) => {
        this.paiements = data;
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

  savePaiement(): void {
    console.log('Saving paiement:', this.formData);
    this.closeModal();
  }
}
