import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DocumentService } from '../../core/services/document.service';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './documents.component.html',
  styleUrls: []
})
export class DocumentsComponent implements OnInit {
  documents: any[] = [];
  filteredDocuments: any[] = [];
  loading = true;
  erreur = '';

  searchTerm = '';
  typeFilter = '';

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.chargerDocuments();
  }

  chargerDocuments(): void {
    this.loading = true;
    this.documentService.getAll().subscribe({
      next: (r: any) => {
        this.documents = r.data;
        this.loading = false;
        this.filterData();
      },
      error: (err: any) => {
        this.erreur = "Impossible de charger les documents.";
        this.loading = false;
      }
    });
  }

  telecharger(id: number): void {
    this.documentService.download(id);
  }

  getLocataireName(doc: any): string {
    if (doc.locataire) return `${doc.locataire.prenom} ${doc.locataire.nom}`;
    if (doc.contrat?.locataire) return `${doc.contrat.locataire.prenom} ${doc.contrat.locataire.nom}`;
    if (doc.paiement?.contrat?.locataire) return `${doc.paiement.contrat.locataire.prenom} ${doc.paiement.contrat.locataire.nom}`;
    return '-';
  }

  getProprietaireName(doc: any): string {
    if (doc.proprietaire) return `${doc.proprietaire.prenom} ${doc.proprietaire.nom}`;
    if (doc.contrat?.proprietaire) return `${doc.contrat.proprietaire.prenom} ${doc.contrat.proprietaire.nom}`;
    if (doc.paiement?.contrat?.proprietaire) return `${doc.paiement.contrat.proprietaire.prenom} ${doc.paiement.contrat.proprietaire.nom}`;
    return '-';
  }

  getBienReference(doc: any): string {
    if (doc.bien?.reference) return doc.bien.reference;
    if (doc.contrat?.bien?.reference) return doc.contrat.bien.reference;
    if (doc.paiement?.contrat?.bien?.reference) return doc.paiement.contrat.bien.reference;
    return '-';
  }

  filterData(): void {
    this.filteredDocuments = this.documents.filter(doc => {
      const locataireName = this.getLocataireName(doc).toLowerCase();
      const proprietaireName = this.getProprietaireName(doc).toLowerCase();
      const ref = doc.reference?.toLowerCase() || '';
      
      const search = this.searchTerm.toLowerCase();
      const matchSearch = search ? 
        (ref.includes(search) || locataireName.includes(search) || proprietaireName.includes(search)) 
        : true;
        
      const matchType = this.typeFilter ? doc.type === this.typeFilter : true;
      
      return matchSearch && matchType;
    });
  }
}
