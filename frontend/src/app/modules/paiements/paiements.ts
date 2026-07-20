import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';
import { PaiementService } from '../../core/services/paiement.service';
import { Paiement } from '../../core/models';

@Component({
  selector: 'app-paiements',
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="list-header">
        <h2>Registre des paiements</h2>
        <div class="header-actions">
          <a routerLink="/paiements/nouveau" class="btn btn-outline-primary">+ ENREGISTRER UN PAIEMENT</a>
        </div>
      </div>
      
      <div class="filter-bar">
        <div class="search-input">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Rechercher (référence contrat)..." [(ngModel)]="searchTerm" (input)="filterData()">
        </div>
        <div class="filters">
          <label>Statut</label>
          <select [(ngModel)]="statutFilter" (change)="filterData()">
            <option value="">Tous</option>
            <option value="paye">Payé</option>
            <option value="en_attente">En attente</option>
            <option value="impaye">Impayé</option>
            <option value="en_retard">En retard</option>
            <option value="annule">Annulé</option>
          </select>
          <label>Taille</label>
          <select [(ngModel)]="pageSize" (change)="currentPage = 1">
            <option [ngValue]="5">5</option>
            <option [ngValue]="10">10</option>
            <option [ngValue]="20">20</option>
          </select>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Contrat</th>
              <th>Date de paiement</th>
              <th>Mois Concerné</th>
              <th>Montant</th>
              <th>Mode</th>
              <th>Statut</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of filteredPaiements | slice:(currentPage-1)*pageSize : currentPage*pageSize">
              <td>
                <div class="primary-text" *ngIf="p.contrat">{{ p.contrat.reference }}</div>
                <div class="secondary-text" *ngIf="!p.contrat">Contrat ID: {{ p.id_contrat }}</div>
              </td>
              <td>{{ formatDate(p.date_paiement) }}</td>
              <td>{{ p.mois_concerne }}</td>
              <td><span class="amount">{{ p.montant }} FCFA</span></td>
              <td>{{ p.mode }}</td>
              <td><span class="badge" [ngClass]="getBadgeClass(p.statut)">{{ p.statut }}</span></td>
              <td class="actions">
                <a [routerLink]="['/paiements', p.id_paiement]" class="icon-btn view-btn"><i class="fas fa-eye"></i></a>
                <a [routerLink]="['/paiements/modifier', p.id_paiement]" class="icon-btn edit-btn"><i class="fas fa-pencil-alt"></i></a>
              </td>
            </tr>
            <tr *ngIf="filteredPaiements.length === 0">
              <td colspan="7" class="empty-state">Aucun paiement trouvé.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination-controls" *ngIf="filteredPaiements.length > pageSize">
        <button [disabled]="currentPage === 1" (click)="currentPage = currentPage - 1">&laquo;</button>
        <button *ngFor="let p of pages" [class.active]="p === currentPage" (click)="currentPage = p">{{ p }}</button>
        <button [disabled]="currentPage === pages.length" (click)="currentPage = currentPage + 1">&raquo;</button>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; background: #f4f6f9; min-height: 100vh; }
    .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .list-header h2 { font-size: 22px; font-weight: 600; color: #333; margin: 0; }
    .btn-outline-primary { 
      border: 1px solid #1a237e; color: #1a237e; background: transparent; 
      padding: 8px 16px; border-radius: 4px; font-weight: 600; text-decoration: none; 
      font-size: 13px; letter-spacing: 0.5px; transition: all 0.2s; cursor: pointer;
    }
    .btn-outline-primary:hover { background: #1a237e; color: #fff; }
    
    .filter-bar { display: flex; gap: 20px; margin-bottom: 20px; align-items: center; }
    .search-input { 
      position: relative; display: flex; align-items: center; background: #fff; 
      border: 1px solid #ddd; border-radius: 4px; padding: 6px 12px; width: 300px;
    }
    .search-input i { color: #1a237e; margin-right: 8px; font-size: 14px; }
    .search-input input { border: none; outline: none; flex: 1; font-size: 14px; }
    .filters { display: flex; align-items: center; gap: 12px; font-size: 13px; color: #555; }
    .filters select { border: 1px solid #ddd; padding: 4px 8px; border-radius: 4px; outline: none; background: #fff; }
    
    .table-container { background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow: hidden; }
    table { width: 100%; border-collapse: collapse; text-align: left; }
    th { padding: 16px; font-size: 13px; font-weight: 600; color: #555; border-bottom: 2px solid #eee; }
    td { padding: 16px; font-size: 14px; border-bottom: 1px solid #eee; vertical-align: middle; }
    tr:hover td { background: #fafafa; }
    
    .primary-text { color: #1a237e; font-weight: 600; margin-bottom: 4px; }
    .secondary-text { color: #666; font-size: 12px; }
    .amount { font-weight: 600; }
    
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-block; text-align: center; min-width: 20px; text-transform: uppercase; }
    .badge-paye { background: #e8f5e9; color: #2e7d32; }
    .badge-en_attente { background: #fff8e1; color: #f57f17; }
    .badge-impaye { background: #ffebee; color: #c62828; }
    .badge-en_retard { background: #ffebee; color: #c62828; }
    .badge-annule { background: #f5f5f5; color: #757575; }
    
    .actions { text-align: right; }
    .icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; text-decoration: none; transition: background 0.2s; margin-left: 8px; }
    .edit-btn { color: #f57c00; }
    .edit-btn:hover { background: rgba(245, 124, 0, 0.1); }
    
    .empty-state { text-align: center; color: #999; padding: 40px !important; }
    
    .pagination-controls { display: flex; justify-content: flex-end; gap: 4px; margin-top: 16px; align-items: center; }
    .pagination-controls button { padding: 6px 12px; border: 1px solid #ddd; background: #fff; border-radius: 4px; cursor: pointer; color: #1a237e; font-weight: 600; font-size: 13px; transition: all 0.2s; }
    .pagination-controls button:hover:not([disabled]) { background: #f4f6f9; }
    .pagination-controls button.active { background: #1a237e; color: #fff; border-color: #1a237e; }
    .pagination-controls button[disabled] { color: #ccc; cursor: not-allowed; border-color: #eee; }
  `]
})
export class PaiementsComponent implements OnInit {
  paiements: Paiement[] = [];
  filteredPaiements: Paiement[] = [];
  pageSize: number = 5;
  currentPage: number = 1;

  get pages(): number[] {
    const total = Math.ceil(this.filteredPaiements.length / this.pageSize);
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  
  searchTerm = '';
  statutFilter = '';

  constructor(
    private paiementSvc: PaiementService,
    private toastSvc: ToastService
  ) {}

  ngOnInit(): void {
    this.chargerPaiements();
  }

  chargerPaiements(): void {
    this.paiementSvc.getAll().subscribe({
      next: (res: any) => {
        this.paiements = res.data?.data ? res.data.data : (res.data || []);
        // Sort by date_paiement desc
        this.paiements.sort((a, b) => new Date(b.date_paiement).getTime() - new Date(a.date_paiement).getTime());
        this.filterData();
      },
      error: (err) => {
        console.error('Erreur', err);
        this.toastSvc.error('Impossible de charger la liste des paiements');
      }
    });
  }

  filterData(): void {
    this.filteredPaiements = this.paiements.filter(p => {
      const ref = p.contrat?.reference || '';
      const matchSearch = this.searchTerm ? 
        ref.toLowerCase().includes(this.searchTerm.toLowerCase()) 
        : true;
      const matchStatut = this.statutFilter ? p.statut === this.statutFilter : true;
      return matchSearch && matchStatut;
    });
    this.currentPage = 1;
  }

  getBadgeClass(statut: string): string {
    const s = statut ? statut.toLowerCase() : '';
    switch(s) {
      case 'paye': 
      case 'payé': return 'badge-paye';
      case 'en_attente': 
      case 'en attente': return 'badge-en_attente';
      case 'impaye': 
      case 'impayé': return 'badge-impaye';
      case 'en_retard': return 'badge-en_retard';
      case 'annule': return 'badge-annule';
      default: return '';
    }
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR');
  }
}
