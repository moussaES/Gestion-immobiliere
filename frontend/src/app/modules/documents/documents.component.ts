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

  filterData(): void {
    this.filteredDocuments = this.documents.filter(doc => {
      const locataireName = doc.locataire ? `${doc.locataire.prenom} ${doc.locataire.nom}`.toLowerCase() : '';
      const proprietaireName = doc.proprietaire ? `${doc.proprietaire.prenom} ${doc.proprietaire.nom}`.toLowerCase() : '';
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
