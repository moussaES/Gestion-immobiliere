import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LocataireService } from '../../../core/services/locataire.service';
import { ContratService } from '../../../core/services/contrat.service';
import { PaiementService } from '../../../core/services/paiement.service';
import { Locataire, Contrat, Paiement } from '../../../core/models';
import { LocataireFormComponent } from '../locataire-form/locataire-form';

@Component({
  selector: 'app-fiche-locataire',
  templateUrl: './fiche-locataire.html',
  styleUrls: ['./fiche-locataire.scss'],
  imports: [CommonModule, LocataireFormComponent],
})
export class FicheLocataireComponent implements OnInit {
  locataire: Locataire | null = null;
  contrats: Contrat[] = [];
  paiements: Paiement[] = [];
  activeTab = 'infos';
  editMode = false;

  get loyerMensuel(): number {
    const activeContrat = this.contrats.find(c => c.statut === 'actif');
    return activeContrat ? activeContrat.montant : 0;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private locataireService: LocataireService,
    private contratService: ContratService,
    private paiementService: PaiementService
  ) {}

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
      }
    });
  }

  loadContrats(locataireId: number): void {
    this.contratService.getAll().subscribe({
      next: (res: any) => {
        const tousLesContrats = res.data.data || res.data;
        this.contrats = tousLesContrats.filter((c: any) => c.id_locataire === locataireId);
        
        // Charger les paiements pour ces contrats
        this.loadPaiements(this.contrats.map(c => c.id!));
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

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  back(): void {
    this.router.navigate(['/locataires']);
  }
}
