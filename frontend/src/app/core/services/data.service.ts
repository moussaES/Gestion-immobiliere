import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Bien, Contrat, Paiement, Proprietaire, Locataire, DashboardStats } from '../models';

export interface Depense {
  id?: number;
  montant: number;
  description: string;
  date: string;
}

export interface Recette {
  id?: number;
  montant: number;
  description: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:8000/api';

  // Mock data pour développement
  private produits: Bien[] = [
    {
      reference: 'PROD-783362-3029',
      type: 'maison',
      ville: 'Podor',
      adresse: 'Rue Du Port, Podor',
      surface: 120,
      charges: 15000,
      id_proprietaire: 1,
      proprietaire: { nom: 'Gueye', prenom: 'Khadija', telephone: '+221771098765', email: 'khadija@email.com' },
      statut: 'occupe',
      loyer_mensuel: 804297
    }
  ];

  private contrats: Contrat[] = [];
  private paiements: Paiement[] = [];
  private proprietaires: Proprietaire[] = [];
  private locataires: Locataire[] = [];
  private depenses: Depense[] = [];

  private sectionSubject = new BehaviorSubject<string>('resume');
  public section$ = this.sectionSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Section management
  changeSection(section: string) {
    this.sectionSubject.next(section);
  }

  getCurrentSection() {
    return this.sectionSubject.value;
  }

  // Produits (Biens)
  getProduits(): Observable<Bien[]> {
    return this.http.get<Bien[]>(`${this.apiUrl}/biens`);
  }

  createProduit(produit: Bien): Observable<Bien> {
    return this.http.post<Bien>(`${this.apiUrl}/biens`, produit);
  }

  updateProduit(id: number, produit: Bien): Observable<Bien> {
    return this.http.put<Bien>(`${this.apiUrl}/biens/${id}`, produit);
  }

  // Contrats
  getContrats(): Observable<Contrat[]> {
    return this.http.get<Contrat[]>(`${this.apiUrl}/contrats`);
  }

  createContrat(contrat: Contrat): Observable<Contrat> {
    return this.http.post<Contrat>(`${this.apiUrl}/contrats`, contrat);
  }

  // Paiements
  getPaiements(): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.apiUrl}/paiements`);
  }

  createPaiement(paiement: Paiement): Observable<Paiement> {
    return this.http.post<Paiement>(`${this.apiUrl}/paiements`, paiement);
  }

  // Propriétaires
  getProprietaires(): Observable<Proprietaire[]> {
    return this.http.get<Proprietaire[]>(`${this.apiUrl}/proprietaires`);
  }

  createProprietaire(proprietaire: Proprietaire): Observable<Proprietaire> {
    return this.http.post<Proprietaire>(`${this.apiUrl}/proprietaires`, proprietaire);
  }

  // Locataires
  getLocataires(): Observable<Locataire[]> {
    return this.http.get<Locataire[]>(`${this.apiUrl}/locataires`);
  }

  createLocataire(locataire: Locataire): Observable<Locataire> {
    return this.http.post<Locataire>(`${this.apiUrl}/locataires`, locataire);
  }

  // Dépenses
  getDepenses(): Observable<Depense[]> {
    return this.http.get<Depense[]>(`${this.apiUrl}/depenses`);
  }

  createDepense(depense: Depense): Observable<Depense> {
    return this.http.post<Depense>(`${this.apiUrl}/depenses`, depense);
  }

  // Recettes
  getRecettes(): Observable<Recette[]> {
    return this.http.get<Recette[]>(`${this.apiUrl}/recettes`);
  }

  // Dashboard Stats
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/statistiques`);
  }
}
