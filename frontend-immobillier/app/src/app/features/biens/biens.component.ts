import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BienService, ProprietaireService } from '../../../../../../frontend/src/app/shared/services/data.service';
import { Bien, Proprietaire } from '../../../../../../frontend/src/app/shared/interfaces/models';
import { TableComponent } from '../../../../../../frontend/src/app/shared/components/table/table.component';
import { ModalComponent } from '../../../../../../frontend/src/app/shared/components/modal/modal.component';

@Component({
  selector: 'app-biens',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent, ModalComponent],
  templateUrl: './biens.component.html',
  styleUrl: './biens.component.css'
})
export class BienComponent implements OnInit {
  biens: Bien[] = [];
  proprietaires: Proprietaire[] = [];
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
    reference: '',
    proprietaireId: '',
    type: 'MAISON',
    ville: 'Dakar',
    adresse: '',
    loyerMensuel: 0,
    surface: 0,
    description: ''
  };

  constructor(
    private bienService: BienService,
    private proprietaireService: ProprietaireService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBiens();
    this.loadProprietaires();
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

  loadProprietaires(): void {
    this.proprietaireService.getAll().subscribe({
      next: (data) => {
        this.proprietaires = data;
      },
      error: (err) => console.error('Erreur chargement propriétaires:', err)
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
    if (!this.formData.reference || !this.formData.adresse || !this.formData.ville || !this.formData.loyerMensuel || !this.formData.proprietaireId) {
      alert('Veuillez remplir tous les champs obligatoires (*)');
      return;
    }

    this.bienService.create(this.formData as Bien).subscribe({
      next: () => {
        this.loadBiens();
        this.closeModal();
      },
      error: (err) => {
        console.error('Erreur création bien:', err);
        alert('Impossible de créer le bien. Vérifiez la référence unique.');
      }
    });
  }

  viewBien(bien: Bien): void {
    this.router.navigate(['/biens', bien.id]);
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
      reference: '',
      proprietaireId: '',
      type: 'MAISON',
      ville: 'Dakar',
      adresse: '',
      loyerMensuel: 0,
      surface: 0,
      description: ''
    };
  }
}
