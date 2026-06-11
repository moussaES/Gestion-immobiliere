import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LocataireService } from '../../../../../../frontend/src/app/shared/services/data.service';
import { Locataire } from '../../../../../../frontend/src/app/shared/interfaces/models';
import { TableComponent } from '../../../../../../frontend/src/app/shared/components/table.component';
import { ModalComponent } from '../../../../../../frontend/src/app/shared/components/modal.component';

@Component({
  selector: 'app-locataires',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent, ModalComponent],
  template: `
    <div class="locataires-section">
      <div class="page-header">
        <span class="page-title">Locataires</span>
        <button class="btn-create" (click)="openCreateModal()">
          <i class="fas fa-plus"></i> AJOUTER LOCATAIRE
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
        [rows]="locataires"
        [currentPage]="currentPage"
        [itemsPerPage]="itemsPerPage"
        [totalPages]="totalPages"
        (onView)="viewLocataire($event)">
      </app-table>
    </div>

    <!-- Modal Ajouter Locataire -->
    <app-modal 
      [isOpen]="isCreateModalOpen"
      title="Ajouter un Locataire"
      iconClass="fas fa-user-plus"
      saveButtonText="Ajouter le locataire"
      (onClose)="closeModal()"
      (onSave)="saveLocataire()">
      
      <div class="form-row">
        <div class="form-group">
          <label>Prénom *</label>
          <input type="text" placeholder="Ex: Saliou" [(ngModel)]="formData.prenom">
        </div>
        <div class="form-group">
          <label>Nom *</label>
          <input type="text" placeholder="Ex: Camara" [(ngModel)]="formData.nom">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Téléphone *</label>
          <input type="text" placeholder="Ex: +221 77 123 45 67" [(ngModel)]="formData.telephone">
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" placeholder="Ex: saliou.camara@mail.com" [(ngModel)]="formData.email">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Profession</label>
          <input type="text" placeholder="Ex: Entrepreneur" [(ngModel)]="formData.profession">
        </div>
        <div class="form-group">
          <label>N° CNI (Carte d'identité)</label>
          <input type="text" placeholder="Ex: 1234567890123" [(ngModel)]="formData.numeroCNI">
        </div>
      </div>
      <div class="form-group">
        <label>Adresse actuelle</label>
        <input type="text" placeholder="Ex: Liberté 6, Dakar" [(ngModel)]="formData.adresseActuelle">
      </div>
    </app-modal>
  `,
  styles: [`
    .locataires-section { }
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
    .form-group input { width: 100%; padding: 11px 14px; border: 1.5px solid #ddd; border-radius: 8px; font-size: 14px; }
  `]
})
export class LocatairesComponent implements OnInit {
  locataires: Locataire[] = [];
  columns = [
    { label: 'Nom', field: 'nom' },
    { label: 'Téléphone', field: 'telephone' },
    { label: 'Profession', field: 'profession' },
    { label: 'Contrats', field: 'contratsCount' },
    { label: 'Bien Occupé', field: 'bienRef' },
    { label: 'Loyer', field: 'loyerMensuel', type: 'currency' },
    { label: 'Statut Paiement', field: 'statutPaiement', type: 'badge' }
  ];

  isCreateModalOpen = false;
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  formData: Partial<Locataire> = {
    prenom: '',
    nom: '',
    telephone: '',
    email: '',
    profession: '',
    numeroCNI: '',
    adresseActuelle: '',
    personnesCharge: 0
  };

  constructor(private locataireService: LocataireService, private router: Router) {}

  ngOnInit(): void {
    this.loadLocataires();
  }

  loadLocataires(): void {
    this.locataireService.getAll().subscribe({
      next: (data) => {
        this.locataires = data;
        this.totalPages = Math.ceil(data.length / this.itemsPerPage);
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

  saveLocataire(): void {
    if (!this.formData.prenom || !this.formData.nom || !this.formData.telephone) {
      alert('Veuillez remplir les champs obligatoires (*)');
      return;
    }

    this.locataireService.create(this.formData as Locataire).subscribe({
      next: () => {
        this.loadLocataires();
        this.closeModal();
      },
      error: (err) => {
        console.error('Erreur création locataire:', err);
        alert('Impossible d\'ajouter le locataire. Vérifiez le numéro de téléphone.');
      }
    });
  }

  viewLocataire(locataire: Locataire): void {
    this.router.navigate(['/locataires', locataire.id]);
  }

  resetForm(): void {
    this.formData = {
      prenom: '',
      nom: '',
      telephone: '',
      email: '',
      profession: '',
      numeroCNI: '',
      adresseActuelle: '',
      personnesCharge: 0
    };
  }
}
