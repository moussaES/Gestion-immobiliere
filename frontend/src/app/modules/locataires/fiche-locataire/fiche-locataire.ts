import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocataireService } from '../../../core/services/locataire.service';
import { ContratService } from '../../../core/services/contrat.service';
import { PaiementService } from '../../../core/services/paiement.service';
import { TravailService } from '../../../core/services/travail.service';
import { HistoriqueService } from '../../../core/services/historique.service';
import { DocumentService } from '../../../core/services/document.service';
import { Locataire, Contrat, Paiement, Travail, HistoriqueOperation, Document } from '../../../core/models';
import { LocataireFormComponent } from '../locataire-form/locataire-form';

@Component({
  selector: 'app-fiche-locataire',
  templateUrl: './fiche-locataire.html',
  styleUrls: ['./fiche-locataire.scss'],
  imports: [CommonModule, LocataireFormComponent, FormsModule],
})
export class FicheLocataireComponent implements OnInit {
  locataire: Locataire | null = null;
  contrats: Contrat[] = [];
  paiements: Paiement[] = [];
  travaux: Travail[] = [];
  historique: HistoriqueOperation[] = [];
  documents: Document[] = [];
  activeTab = 'contrats';
  editMode = false;

  selectedMonth: string;
  selectedYear: string;
  months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  years: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private locataireService: LocataireService,
    private contratService: ContratService,
    private paiementService: PaiementService,
    private travailService: TravailService,
    private historiqueService: HistoriqueService,
    private documentService: DocumentService
  ) {
    const d = new Date();
    this.selectedMonth = this.months[d.getMonth()];
    this.selectedYear = String(d.getFullYear());
    for(let i=d.getFullYear()-5; i<=d.getFullYear()+2; i++) this.years.push(String(i));
  }

  // KPIs
  get totalPaiementsMois(): number {
    const monthIndex = this.months.indexOf(this.selectedMonth);
    return this.paiements
      .filter(p => String(p.statut).toLowerCase() === 'paye' || String(p.statut).toLowerCase() === 'partiel')
      .filter(p => {
        const pd = new Date(p.date_paiement);
        return pd.getMonth() === monthIndex && pd.getFullYear() === Number(this.selectedYear);
      })
      .reduce((sum, p) => sum + Number(p.montant), 0);
  }

  get countPaiementsMois(): number {
    const monthIndex = this.months.indexOf(this.selectedMonth);
    return this.paiements
      .filter(p => String(p.statut).toLowerCase() === 'paye' || String(p.statut).toLowerCase() === 'partiel')
      .filter(p => {
        const pd = new Date(p.date_paiement);
        return pd.getMonth() === monthIndex && pd.getFullYear() === Number(this.selectedYear);
      }).length;
  }

  get totalPaiementsAnnee(): number {
    return this.paiements
      .filter(p => String(p.statut).toLowerCase() === 'paye' || String(p.statut).toLowerCase() === 'partiel')
      .filter(p => new Date(p.date_paiement).getFullYear() === Number(this.selectedYear))
      .reduce((sum, p) => sum + Number(p.montant), 0);
  }

  get actifsContrats(): number {
    return this.contrats.filter(c => c.statut === 'ACTIF').length;
  }

  get annulesContrats(): number {
    return this.contrats.filter(c => c.statut === 'RESILIE' || c.statut === 'ARCHIVE').length;
  }

  get loyerMensuel(): number {
    return this.contrats
      .filter(c => c.statut === 'ACTIF')
      .reduce((sum, c) => sum + Number(c.montant), 0);
  }

  get dernierPaiement(): any {
    const sorted = [...this.paiements]
      .filter(p => String(p.statut).toLowerCase() === 'paye' || String(p.statut).toLowerCase() === 'partiel')
      .sort((a, b) => new Date(b.date_paiement).getTime() - new Date(a.date_paiement).getTime());
    return sorted.length > 0 ? sorted[0] : null;
  }

  get totalTravaux(): number {
    return this.travaux.reduce((sum, t) => sum + Number(t.montant), 0);
  }

  isPaye(statut: any): boolean {
    return String(statut).toLowerCase() === 'paye';
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadLocataire(Number(id));
    }
  }

  loadLocataire(id: number): void {
    this.locataireService.getById(id).subscribe({
      next: (res: any) => {
        this.locataire = res.data;
        this.loadContrats(id);
        this.loadTravaux(id);
        this.loadHistorique(id);
        this.loadDocuments(id);
      }
    });
  }

  loadDocuments(id: number): void {
    this.documentService.getByEntiteAndId('Locataire', id).subscribe({
      next: (res: any) => {
        this.documents = res.data;
      }
    });
  }

  loadHistorique(id: number): void {
    this.historiqueService.getByEntiteAndId('Locataire', id).subscribe({
      next: (res: any) => {
        this.historique = res.data;
      }
    });
  }

  loadTravaux(locataireId: number): void {
    this.travailService.getAll().subscribe({
      next: (res: any) => {
        const tousLesTravaux = res.data.data || res.data;
        this.travaux = tousLesTravaux.filter((t: any) => t.id_locataire === locataireId);
      }
    });
  }

  loadContrats(locataireId: number): void {
    this.contratService.getAll().subscribe({
      next: (res: any) => {
        const tousLesContrats = res.data.data || res.data;
        this.contrats = tousLesContrats.filter((c: any) => c.id_locataire === locataireId);
        
        // Charger les paiements pour ces contrats
        this.loadPaiements(this.contrats.map(c => c.id_contrat!));
      }
    });
  }

  loadPaiements(contratIds: number[]): void {
    if (contratIds.length === 0) return;
    
    this.paiementService.getAll().subscribe({
      next: (res: any) => {
        const tousLesPaiements = res.data.data || res.data;
        this.paiements = tousLesPaiements.filter((p: any) => contratIds.includes(p.id_contrat));
      }
    });
  }

  downloadDocument(doc: Document): void {
    if (doc.id_document) {
      this.documentService.download(doc.id_document);
    }
  }

  openEditModal(): void {
    this.editMode = !this.editMode;
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  back(): void {
    this.router.navigate(['/locataires']);
  }
}
