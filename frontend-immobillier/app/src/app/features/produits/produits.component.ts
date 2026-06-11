import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BienService } from '../../../../../../frontend/src/app/shared/services/data.service';
import { Bien } from '../../../../../../frontend/src/app/shared/interfaces/models';
import { TableComponent } from '../../../../../../frontend/src/app/shared/components/table.component';
import { ModalComponent } from '../../../../../../frontend/src/app/shared/components/modal.component';

@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent, ModalComponent],
  template: `
    <div class="produits-section">
      <div class="page-header">
        <span class="page-title">Répertoire des produits</span>
        <button class="btn-create" (click)="openCreateModal()">
          <i class="fas fa-plus"></i> CRÉER UN PRODUIT
        </button>
      </div>

      <div class="filters">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Rechercher..." [(ngModel)]="searchQuery" (input)="search()">
          <i class="fas fa-search" style="cursor:pointer;color:#1a237e;"></i>
        </div>
        <span class="filter-label">Statut</span>
        <select class="filter-select" [(ngModel)]="selectedStatut" (change)="filter()">
          <option>Tout</option>
          <option>Occupé</option>
          <option>Libre</option>
          <option>Réservé</option>
        </select>
        <span class="filter-label">Taille</span>
        <select class="filter-select" [(ngModel)]="itemsPerPage" (change)="filter()">
          <option [value]="5">5</option>
          <option [value]="10">10</option>
          <option [value]="25">25</option>
          <option [value]="50">50</option>
        </select>
      </div>

      <app-table 
        [columns]="columns"
        [rows]="biens"
        [currentPage]="currentPage"
        [itemsPerPage]="itemsPerPage"
        [totalPages]="totalPages"
        (onView)="viewBien($event)"
        (onEdit)="editBien($event)"
        (pageChange)="onPageChange($event)">
      </app-table>

      <div class="portail"><a href="#">Portail web: www.etoilesineimmo.sn</a></div>
    </div>

    <!-- Modal Créer/Éditer Produit -->
    <app-modal 
      [isOpen]="isCreateModalOpen"
      title="Créer un Produit"
      iconClass="fas fa-building"
      saveButtonText="Créer le produit"
      (onClose)="closeModal()"
      (onSave)="saveBien()">
      
      <div class="form-row">
        <div class="form-group">
          <label>Type de bien *</label>
          <select [(ngModel)]="formData.type">
            <option>MAISON</option>
            <option>APPARTEMENT</option>
            <option>IMMEUBLE</option>
            <option>BUREAU</option>
            <option>STUDIO</option>
            <option>CHAMBRE</option>
            <option>TERRAIN</option>
          </select>
        </div>
        <div class="form-group">
          <label>Ville *</label>
          <select [(ngModel)]="formData.ville">
            <option>Dakar</option>
            <option>Pikine</option>
            <option>Thiès</option>
            <option>Saint-Louis</option>
            <option>Ziguinchor</option>
            <option>Kaolack</option>
            <option>Podor</option>
            <option>Kédougou</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label>Adresse complète *</label>
        <input type="text" placeholder="Ex: Rue du Port, Podor" [(ngModel)]="formData.adresse">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Loyer mensuel (FCFA) *</label>
          <input type="number" placeholder="Ex: 250000" [(ngModel)]="formData.loyerMensuel">
        </div>
        <div class="form-group">
          <label>Surface (m²)</label>
          <input type="number" placeholder="Ex: 120" [(ngModel)]="formData.surface">
        </div>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea placeholder="Caractéristiques du bien..." style="min-height:80px;resize:vertical;" [(ngModel)]="formData.description"></textarea>
      </div>
    </app-modal>
  `,
  styles: [`
    .produits-section { }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .page-title {
      font-size: 22px;
      font-weight: 600;
      color: #222;
    }
    .btn-create {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: #fff;
      border: 1.5px solid #1a237e;
      border-radius: 6px;
      color: #1a237e;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    }
    .btn-create:hover {
      background: #1a237e;
      color: #fff;
    }
    .filters {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }
    .search-box {
      display: flex;
      align-items: center;
      gap: 8px;
      border: 1.5px solid #ddd;
      border-radius: 6px;
      padding: 8px 14px;
      background: #fff;
      min-width: 280px;
    }
    .search-box input {
      border: none;
      outline: none;
      font-size: 14px;
      flex: 1;
    }
    .search-box i {
      color: #999;
    }
    .filter-select {
      padding: 9px 14px;
      border: 1.5px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      background: #fff;
      color: #333;
      cursor: pointer;
      min-width: 120px;
    }
    .filter-label {
      font-size: 13px;
      color: #666;
      font-weight: 500;
    }
    .portail {
      text-align: center;
      padding: 16px;
      color: #aaa;
      font-size: 13px;
    }
    .portail a {
      color: #1a237e;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .form-group {
      margin-bottom: 18px;
    }
    .form-group label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #444;
      margin-bottom: 7px;
    }
    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 11px 14px;
      border: 1.5px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.2s;
      font-family: inherit;
    }
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      border-color: #1a237e;
      outline: none;
      box-shadow: 0 0 0 3px rgba(26,35,126,0.08);
    }
  `]
})
export class ProduitComponent implements OnInit {
  biens: Bien[] = [];
  columns = [
    { label: 'Référence', field: 'reference', type: 'text' },
    { label: 'Type', field: 'type', type: 'text' },
    { label: 'Ville', field: 'ville', type: 'text' },
    { label: 'Adresse', field: 'adresse', type: 'text' },
    { label: 'Propriétaire', field: 'proprietaireName', type: 'link' },
    { label: 'Statut', field: 'statut', type: 'badge' }
  ];

  isCreateModalOpen = false;
  searchQuery = '';
  selectedStatut = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  formData: Partial<Bien> = {
    type: 'MAISON',
    ville: 'Dakar',
    adresse: '',
    loyerMensuel: 0,
    surface: 0,
    description: ''
  };

  constructor(private bienService: BienService, private router: Router) {}

  ngOnInit(): void {
    this.loadBiens();
  }

  loadBiens(): void {
    this.bienService.getAll().subscribe({
      next: (data) => {
        this.biens = data;
        this.totalPages = Math.ceil(data.length / this.itemsPerPage);
      },
      error: (err) => console.error('Erreur chargement biens:', err)
    });
  }

  search(): void {
    // Implement search logic
  }

  filter(): void {
    // Implement filter logic
  }

  openCreateModal(): void {
    this.isCreateModalOpen = true;
  }

  closeModal(): void {
    this.isCreateModalOpen = false;
    this.resetForm();
  }

  saveBien(): void {
    console.log('Saving bien:', this.formData);
    this.closeModal();
  }

  viewBien(bien: Bien): void {
    this.router.navigate(['/produits', bien.id]);
  }

  editBien(bien: Bien): void {
    this.formData = { ...bien };
    this.isCreateModalOpen = true;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  resetForm(): void {
    this.formData = {
      type: 'MAISON',
      ville: 'Dakar',
      adresse: '',
      loyerMensuel: 0
    };
  }
}
