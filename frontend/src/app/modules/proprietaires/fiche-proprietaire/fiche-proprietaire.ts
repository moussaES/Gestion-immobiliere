import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProprietaireService } from '../../../core/services/proprietaire.service';
import { ContratService } from '../../../core/services/contrat.service';
import { TravailService } from '../../../core/services/travail.service';
import { HistoriqueService } from '../../../core/services/historique.service';
import { DocumentService } from '../../../core/services/document.service';
import { BienService } from '../../../core/services/bien.service';
import { Proprietaire, Bien, Contrat, Paiement, Travail, HistoriqueOperation, Document } from '../../../core/models';
import { ProprietaireFormComponent } from '../proprietaire-form/proprietaire-form';

@Component({
  selector: 'app-fiche-proprietaire',
  templateUrl: './fiche-proprietaire.html',
  styleUrls: ['./fiche-proprietaire.scss'],
  imports: [CommonModule, ProprietaireFormComponent, FormsModule],
})
export class FicheProprietaireComponent implements OnInit {
  proprietaire: Proprietaire | null = null;
  biens: Bien[] = [];
  contrats: Contrat[] = [];
  paiements: Paiement[] = [];
  travaux: Travail[] = [];
  historique: HistoriqueOperation[] = [];
  documents: Document[] = [];
  activeTab = 'biens';
  editMode = false;

  selectedMonth: string;
  selectedYear: string;
  months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  years: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propService: ProprietaireService,
    private bienService: BienService,
    private contratService: ContratService,
    private travailService: TravailService,
    private historiqueService: HistoriqueService,
    private documentService: DocumentService
  ) {
    const d = new Date();
    this.selectedMonth = this.months[d.getMonth()];
    this.selectedYear = String(d.getFullYear());
    for(let i=d.getFullYear()-5; i<=d.getFullYear()+2; i++) this.years.push(String(i));
  }

  // KPIs à 90%
  get totalPaiementsMois(): number {
    const monthIndex = this.months.indexOf(this.selectedMonth);
    const sum = this.paiements
      .filter(p => this.isPaye(p.statut) || String(p.statut).toLowerCase() === 'partiel')
      .filter(p => {
        const pd = new Date(p.date_paiement);
        return pd.getMonth() === monthIndex && pd.getFullYear() === Number(this.selectedYear);
      })
      .reduce((s, p) => s + Number(p.montant), 0);
    return sum * 0.90;
  }

  get countPaiementsMois(): number {
    const monthIndex = this.months.indexOf(this.selectedMonth);
    return this.paiements
      .filter(p => this.isPaye(p.statut) || String(p.statut).toLowerCase() === 'partiel')
      .filter(p => {
        const pd = new Date(p.date_paiement);
        return pd.getMonth() === monthIndex && pd.getFullYear() === Number(this.selectedYear);
      }).length;
  }

  get totalPaiementsAnnee(): number {
    const sum = this.paiements
      .filter(p => this.isPaye(p.statut) || String(p.statut).toLowerCase() === 'partiel')
      .filter(p => new Date(p.date_paiement).getFullYear() === Number(this.selectedYear))
      .reduce((s, p) => s + Number(p.montant), 0);
    return sum * 0.90;
  }

  get actifsContrats(): number {
    return this.contrats.filter(c => c.statut === 'ACTIF').length;
  }

  get annulesContrats(): number {
    return this.contrats.filter(c => c.statut === 'RESILIE' || c.statut === 'ARCHIVE').length;
  }

  get loyerMensuel(): number {
    const sum = this.contrats
      .filter(c => c.statut === 'ACTIF')
      .reduce((s, c) => s + Number(c.montant), 0);
    return sum * 0.90;
  }

  get totalTravaux(): number {
    return this.travaux.reduce((sum, t) => sum + Number(t.montant), 0);
  }

  get dernierPaiement(): any {
    const sorted = [...this.paiements]
      .filter(p => this.isPaye(p.statut) || String(p.statut).toLowerCase() === 'partiel')
      .sort((a, b) => new Date(b.date_paiement).getTime() - new Date(a.date_paiement).getTime());
    return sorted.length > 0 ? sorted[0] : null;
  }

  get dernierReversement(): any {
    const sorted = [...this.paiements]
      .filter(p => this.isPaye(p.statut) || String(p.statut).toLowerCase() === 'partiel')
      .sort((a, b) => new Date(b.date_paiement).getTime() - new Date(a.date_paiement).getTime());
    return sorted.length > 0 ? sorted[0] : null;
  }

  isPaye(statut: any): boolean {
    return String(statut).toLowerCase() === 'paye';
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProprietaire(Number(id));
    }
  }

  loadProprietaire(id: number): void {
    this.propService.getById(id).subscribe({
      next: (res: any) => {
        this.proprietaire = res.data;
        this.loadBiens(id);
        this.loadContrats(id);
        this.loadTravaux(id);
        this.loadHistorique(id);
        this.loadDocuments(id);
      }
    });
  }

  loadContrats(proprietaireId: number): void {
    this.contratService.getAll().subscribe({
      next: (res: any) => {
        const tousLesContrats = res.data.data || res.data;
        this.contrats = tousLesContrats.filter((c: any) => c.id_proprietaire === proprietaireId || (c.bien && c.bien.id_proprietaire === proprietaireId));
        
        this.paiements = [];
        this.contrats.forEach((c: any) => {
          if (c.paiements) {
            this.paiements.push(...c.paiements);
          }
        });
      }
    });
  }

  loadBiens(proprietaireId: number): void {
    this.bienService.getAll().subscribe({
      next: (res: any) => {
        const tousLesBiens = res.data.data || res.data;
        this.biens = tousLesBiens.filter((b: any) => b.id_proprietaire === proprietaireId);
      }
    });
  }

  loadTravaux(id: number): void {
    this.travailService.getAll().subscribe({
      next: (res: any) => {
        const tousLesTravaux = res.data.data || res.data;
        this.travaux = tousLesTravaux.filter((t: any) => t.id_proprietaire === id);
      }
    });
  }

  loadHistorique(id: number): void {
    this.historiqueService.getByEntiteAndId('Proprietaire', id).subscribe({
      next: (res: any) => {
        this.historique = res.data;
      }
    });
  }

  loadDocuments(id: number): void {
    this.documentService.getByEntiteAndId('Proprietaire', id).subscribe({
      next: (res: any) => {
        this.documents = res.data;
      }
    });
  }

  downloadDocument(doc: Document): void {
    if (doc.id_document) {
      this.documentService.download(doc.id_document);
    }
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  openEditModal(): void {
    this.editMode = !this.editMode;
  }

  back(): void {
    this.router.navigate(['/proprietaires']);
  }
}
