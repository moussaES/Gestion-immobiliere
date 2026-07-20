import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';
import { LocataireService } from '../../core/services/locataire.service';
import { Locataire } from '../../core/models';

@Component({
  selector: 'app-locataires',
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="list-header">
        <h2>Répertoire des locataires</h2>
        <a routerLink="/locataires/nouveau" class="btn btn-outline-primary">+ CRÉER UN LOCATAIRE</a>
      </div>
      
      <div class="filter-bar">
        <div class="search-input">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Rechercher...">
        </div>
        <div class="filters">
          <label>Statut</label>
          <select>
            <option>Tout</option>
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
              <th>Nom & Prénom</th>
              <th>Profession</th>
              <th>Adresse</th>
              <th>Email</th>
              <th>Statut</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let loc of locataires | slice:(currentPage-1)*pageSize : currentPage*pageSize">
              <td>
                <div class="primary-text">{{ loc.nom }} {{ loc.prenom }}</div>
                <div class="secondary-text">{{ loc.telephone }}</div>
              </td>
              <td>{{ loc.profession }}</td>
              <td>{{ loc.adresse }}</td>
              <td>{{ loc.email }}</td>
              <td><span class="badge badge-actif">Actif</span></td>
              <td class="actions">
                <a [routerLink]="['/locataires', $any(loc).id_locataire]" class="icon-btn view-btn"><i class="fas fa-eye"></i></a>
                <a [routerLink]="['/locataires/modifier', $any(loc).id_locataire]" class="icon-btn edit-btn"><i class="fas fa-pencil-alt"></i></a>
              </td>
            </tr>
            <tr *ngIf="locataires.length === 0">
              <td colspan="6" class="empty-state">Aucun locataire trouvé.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination-controls" *ngIf="locataires.length > pageSize">
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
      font-size: 13px; letter-spacing: 0.5px; transition: all 0.2s;
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
    
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-actif { background: #e8f5e9; color: #2e7d32; }
    
    .actions { text-align: right; }
    .icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; text-decoration: none; transition: background 0.2s; margin-left: 8px; }
    .view-btn { color: #1a237e; }
    .view-btn:hover { background: rgba(26, 35, 126, 0.1); }
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
export class LocatairesComponent implements OnInit {
  locataires: Locataire[] = [];
  pageSize: number = 5;
  currentPage: number = 1;

  get pages(): number[] {
    const total = Math.ceil(this.locataires.length / this.pageSize);
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  constructor(
    private locSvc: LocataireService,
    private toastSvc: ToastService
  ) {}

  ngOnInit(): void {
    this.chargerLocataires();
  }

  chargerLocataires(): void {
    this.locSvc.getAll().subscribe({
      next: (res: any) => {
        this.locataires = res.data?.data ? res.data.data : (res.data || []);
      },
      error: (err) => {
        console.error('Erreur', err);
        this.toastSvc.error('Impossible de charger la liste des locataires');
      }
    });
  }

  supprimer(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce locataire ?')) {
      this.locSvc.delete(id).subscribe({
        next: () => {
          this.toastSvc.success('Locataire supprimé avec succès');
          this.chargerLocataires();
        },
        error: (err) => {
          console.error('Erreur', err);
          this.toastSvc.error('Erreur lors de la suppression');
        }
      });
    }
  }
}
