import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContratService, BienService, LocataireService } from '../../../../../../frontend/src/app/shared/services/data.service';
import { Contrat, Bien, Locataire } from '../../../../../../frontend/src/app/shared/interfaces/models';
import { TableComponent } from '../../../../../../frontend/src/app/shared/components/table.component';
import { ModalComponent } from '../../../../../../frontend/src/app/shared/components/modal.component';

@Component({
  selector: 'app-contrats',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent, ModalComponent],
  template: `
    <div class="contrats-section">
      <div class="page-header">
        <span class="page-title">Contrats</span>
        <button class="btn-create" (click)="openCreateModal()">
          <i class="fas fa-plus"></i> CRÉER UN CONTRAT
        </button>
      </div>

      <div class="filters">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Rechercher...">
        </div>
        <span class="filter-label">Statut</span>
        <select class="filter-select">
          <option>Tout</option>
          <option>Actif</option>
          <option>Inactif</option>
        </select>
      </div>

      <app-table 
        [columns]="columns"
        [rows]="contrats"
        [currentPage]="currentPage"
        [itemsPerPage]="itemsPerPage"
        [totalPages]="totalPages">
      </app-table>
    </div>

    <app-modal 
      [isOpen]="isCreateModalOpen"
      title="Créer un Contrat"
      iconClass="fas fa-file-signature"
      saveButtonText="Créer le contrat"
      (onClose)="closeModal()"
      (onSave)="saveContrat()">
      
      <div class="form-row">
        <div class="form-group">
          <label>Référence Unique Contrat *</label>
          <input type="text" placeholder="Ex: CON-8839" [(ngModel)]="formData.numero">
        </div>
        <div class="form-group">
          <label>Type de contrat *</label>
          <select [(ngModel)]="formData.typeContrat">
            <option value="location-habitation">Habitation</option>
            <option value="gerance">Gérance</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Produit (Bien) *</label>
          <select [(ngModel)]="formData.bienId">
            <option value="" disabled selected>Choisir un bien</option>
            <option *ngFor="let b of biens" [value]="b.id">{{ b.reference }} ({{ b.ville }})</option>
          </select>
        </div>
        <div class="form-group">
          <label>Locataire *</label>
          <select [(ngModel)]="formData.locataireId">
            <option value="" disabled selected>Choisir un locataire</option>
            <option *ngFor="let l of locataires" [value]="l.id">{{ l.prenom }} {{ l.nom }}</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Date de début *</label>
          <input type="date" [(ngModel)]="formData.dateDebut">
        </div>
        <div class="form-group">
          <label>Date de fin *</label>
          <input type="date" [(ngModel)]="formData.dateFin">
        </div>
      </div>
      <div class="form-group">
        <label>Loyer mensuel (FCFA) *</label>
        <input type="number" placeholder="Ex: 250000" [(ngModel)]="formData.loyerMensuel">
      </div>
    </app-modal>
  `,
  styles: [`
    .contrats-section { }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .page-title { font-size: 22px; font-weight: 600; color: #222; }
    .btn-create { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: #fff; border: 1.5px solid #1a237e; border-radius: 6px; color: #1a237e; font-weight: 600; cursor: pointer; }
    .btn-create:hover { background: #1a237e; color: #fff; }
    .filters { display: flex; gap: 12px; align-items: center; margin-bottom: 16px; }
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
export class ContratsComponent implements OnInit {
  contrats: Contrat[] = [];
  biens: Bien[] = [];
  locataires: Locataire[] = [];
  columns = [
    { label: 'N° Contrat', field: 'numero' },
    { label: 'Produit', field: 'bienRef' },
    { label: 'Locataire', field: 'locataireName' },
    { label: 'Bailleur', field: 'bailleurName' },
    { label: 'Début', field: 'dateDebut' },
    { label: 'Fin', field: 'dateFin' },
    { label: 'Statut', field: 'statut', type: 'badge' }
  ];

  isCreateModalOpen = false;
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  formData: Partial<Contrat> = {
    numero: '',
    typeContrat: 'location-habitation',
    bienId: '',
    locataireId: '',
    loyerMensuel: 0
  };

  constructor(
    private contratService: ContratService,
    private bienService: BienService,
    private locataireService: LocataireService
  ) {}

  ngOnInit(): void {
    this.loadContrats();
    this.loadBiens();
    this.loadLocataires();
  }

  loadContrats(): void {
    this.contratService.getAll().subscribe({
      next: (data) => {
        this.contrats = data;
        this.totalPages = Math.ceil(data.length / this.itemsPerPage);
      }
    });
  }

  loadBiens(): void {
    this.bienService.getAll().subscribe({
      next: (data) => {
        this.biens = data;
      }
    });
  }

  loadLocataires(): void {
    this.locataireService.getAll().subscribe({
      next: (data) => {
        this.locataires = data;
      }
    });
  }

  openCreateModal(): void {
    this.isCreateModalOpen = true;
  }

  closeModal(): void {
    this.isCreateModalOpen = false;
    this.resetForm();
  }

  saveContrat(): void {
    if (!this.formData.numero || !this.formData.bienId || !this.formData.locataireId || !this.formData.dateDebut || !this.formData.dateFin || !this.formData.loyerMensuel) {
      alert('Veuillez remplir tous les champs obligatoires (*)');
      return;
    }

    // Find the selected bien to assign its id_proprietaire as the bailleurId
    const selectedBien = this.biens.find(b => b.id === this.formData.bienId);
    if (!selectedBien) {
      alert('Le bien sélectionné est invalide');
      return;
    }

    this.formData.bailleurId = selectedBien.proprietaireId;

    this.contratService.create(this.formData as Contrat).subscribe({
      next: () => {
        this.loadContrats();
        this.closeModal();
      },
      error: (err) => {
        console.error('Erreur création contrat:', err);
        alert('Impossible de créer le contrat. Vérifiez la référence unique.');
      }
    });
  }

  resetForm(): void {
    this.formData = {
      numero: '',
      typeContrat: 'location-habitation',
      bienId: '',
      locataireId: '',
      loyerMensuel: 0
    };
  }
}
