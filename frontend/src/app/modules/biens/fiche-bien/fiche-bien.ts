import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BienService } from '../../../core/services/bien.service';
import { ContratService } from '../../../core/services/contrat.service';
import { TravailService } from '../../../core/services/travail.service';
import { HistoriqueService } from '../../../core/services/historique.service';
import { DocumentService } from '../../../core/services/document.service';
import { Bien, Contrat, Paiement, Travail, HistoriqueOperation, Document } from '../../../core/models';
import { BienFormComponent } from '../bien-form/bien-form';

@Component({
  selector: 'app-fiche-bien',
  templateUrl: './fiche-bien.html',
  styleUrls: ['./fiche-bien.scss'],
  imports: [CommonModule, BienFormComponent],
})
export class FicheBienComponent implements OnInit {
  bien: Bien | null = null;
  contrats: Contrat[] = [];
  paiements: Paiement[] = [];
  travaux: Travail[] = [];
  historique: HistoriqueOperation[] = [];
  documents: Document[] = [];
  activeTab = 'infos';
  editMode = false;

  get moisConcerne(): string {
    const d = new Date();
    return d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }

  get totalAttendu(): number {
    return this.contrats
      .filter(c => c.statut === 'ACTIF' && c.type_contrat === 'LOCATAIRE')
      .reduce((sum, c) => sum + Number(c.montant), 0);
  }

  get totalRecu(): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return this.paiements
      .filter(p => String(p.statut).toLowerCase() === 'paye' || String(p.statut).toLowerCase() === 'partiel')
      .filter(p => {
        const pd = new Date(p.date_paiement);
        return pd.getMonth() === currentMonth && pd.getFullYear() === currentYear;
      })
      .reduce((sum, p) => sum + Number(p.montant), 0);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bienService: BienService,
    private contratService: ContratService,
    private travailService: TravailService,
    private historiqueService: HistoriqueService,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBien(Number(id));
    }
  }

  loadBien(id: number): void {
    this.bienService.getById(id).subscribe({
      next: (res: any) => {
        this.bien = res.data;
        this.loadContrats(id);
        this.loadTravaux(id);
        this.loadHistorique(id);
        this.loadDocuments(id);
      }
    });
  }

  loadTravaux(id: number): void {
    this.travailService.getAll().subscribe({
      next: (res: any) => {
        const tousLesTravaux = res.data.data || res.data;
        this.travaux = tousLesTravaux.filter((t: any) => t.id_bien === id);
      }
    });
  }

  loadHistorique(id: number): void {
    this.historiqueService.getByEntiteAndId('Bien', id).subscribe({
      next: (res: any) => {
        this.historique = res.data;
      }
    });
  }

  loadDocuments(id: number): void {
    this.documentService.getByEntiteAndId('Bien', id).subscribe({
      next: (res: any) => {
        this.documents = res.data;
      }
    });
  }

  loadContrats(bienId: number): void {
    this.contratService.getAll().subscribe({
      next: (res: any) => {
        const tousLesContrats = res.data.data || res.data;
        this.contrats = tousLesContrats.filter((c: any) => c.id_bien === bienId);
        
        this.paiements = [];
        this.contrats.forEach(c => {
          if (c.paiements && c.paiements.length > 0) {
            this.paiements.push(...c.paiements);
          }
        });
        
        // Sort paiements by date desc
        this.paiements.sort((a, b) => new Date(b.date_paiement).getTime() - new Date(a.date_paiement).getTime());
      }
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  get totalTravaux(): number {
    return this.travaux.reduce((sum, t) => sum + Number(t.montant), 0);
  }

  isPaye(statut: any): boolean {
    return String(statut).toLowerCase() === 'paye';
  }

  back(): void {
    this.router.navigate(['/biens']);
  }

  downloadDocument(doc: Document): void {
    if (doc.id_document) {
      this.documentService.download(doc.id_document);
    }
  }

  getStatutBadge(statut: string): string {
    return '';
  }
}
