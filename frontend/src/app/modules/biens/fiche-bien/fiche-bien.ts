import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BienService } from '../../../core/services/bien.service';
import { ContratService } from '../../../core/services/contrat.service';
import { Bien, Contrat } from '../../../core/models';
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
  activeTab = 'infos';
  editMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bienService: BienService,
    private contratService: ContratService
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
      }
    });
  }

  loadContrats(bienId: number): void {
    this.contratService.getAll().subscribe({
      next: (res: any) => {
        const tousLesContrats = res.data.data || res.data;
        this.contrats = tousLesContrats.filter((c: any) => c.id_bien === bienId);
      }
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  back(): void {
    this.router.navigate(['/biens']);
  }
}
