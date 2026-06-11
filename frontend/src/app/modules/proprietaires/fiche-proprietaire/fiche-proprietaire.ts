import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProprietaireService } from '../../../core/services/proprietaire.service';
import { BienService } from '../../../core/services/bien.service';
import { Proprietaire, Bien } from '../../../core/models';
import { ProprietaireFormComponent } from '../proprietaire-form/proprietaire-form';

@Component({
  selector: 'app-fiche-proprietaire',
  templateUrl: './fiche-proprietaire.html',
  styleUrls: ['./fiche-proprietaire.scss'],
  imports: [CommonModule, ProprietaireFormComponent],
})
export class FicheProprietaireComponent implements OnInit {
  proprietaire: Proprietaire | null = null;
  biens: Bien[] = [];
  activeTab = 'infos';
  editMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propService: ProprietaireService,
    private bienService: BienService
  ) {}

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

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  back(): void {
    this.router.navigate(['/proprietaires']);
  }
}
