import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProprietaireService } from '../../../../../../frontend/src/app/shared/services/data.service';
import { Proprietaire } from '../../../../../../frontend/src/app/shared/interfaces/models';
import { TableComponent } from '../../../../../../frontend/src/app/shared/components/table/table.component';
import { ModalComponent } from '../../../../../../frontend/src/app/shared/components/modal/modal.component';

@Component({
  selector: 'app-proprietaires',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent, ModalComponent],
  templateUrl: './proprietaires.component.html',
  styleUrl: './proprietaires.component.css'
})
export class ProprietairesComponent implements OnInit {
  proprietaires: Proprietaire[] = [];
  columns = [
    { label: 'Nom', field: 'nom' },
    { label: 'Téléphone', field: 'telephone' },
    { label: 'Email', field: 'email' },
    { label: 'Biens', field: 'biensCount' },
    { label: 'Contrats', field: 'contratsCount' },
    { label: 'Revenu Total', field: 'revenuTotal', type: 'currency' }
  ];

  isCreateModalOpen = false;
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  formData: Partial<Proprietaire> = {
    prenom: '',
    nom: '',
    telephone: '',
    email: '',
    adresse: '',
    cni: ''
  };

  constructor(private proprietaireService: ProprietaireService, private router: Router) {}

  ngOnInit(): void {
    this.loadProprietaires();
  }

  loadProprietaires(): void {
    this.proprietaireService.getAll().subscribe({
      next: (data) => {
        this.proprietaires = data;
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

  saveProprietaire(): void {
    if (!this.formData.prenom || !this.formData.nom || !this.formData.telephone || !this.formData.adresse) {
      alert('Veuillez remplir tous les champs obligatoires (*)');
      return;
    }

    this.proprietaireService.create(this.formData as Proprietaire).subscribe({
      next: () => {
        this.loadProprietaires();
        this.closeModal();
      },
      error: (err) => {
        console.error('Erreur création propriétaire:', err);
        alert('Impossible d\'ajouter le propriétaire. Vérifiez le numéro de téléphone.');
      }
    });
  }

  viewProprietaire(proprietaire: Proprietaire): void {
    this.router.navigate(['/proprietaires', proprietaire.id]);
  }

  resetForm(): void {
    this.formData = {
      prenom: '',
      nom: '',
      telephone: '',
      email: '',
      adresse: '',
      cni: ''
    };
  }
}
