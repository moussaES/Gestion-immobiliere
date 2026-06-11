import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historique',
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Historique d'activité</h2>
      </div>
      <div class="card">
        <p>Cette page est en cours de développement.</p>
      </div>
    </div>
  `
})
export class HistoriqueComponent {}
