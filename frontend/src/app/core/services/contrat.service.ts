import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Contrat, ApiResponse, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ContratService {
  private apiUrl = `${environment.apiUrl}/contrats`;
  constructor(private http: HttpClient) {}

  getAll(page = 1, statut?: string): Observable<PaginatedResponse<Contrat>> {
    const q = statut ? `?page=${page}&statut=${statut}` : `?page=${page}`;
    return this.http.get<PaginatedResponse<Contrat>>(`${this.apiUrl}${q}`);
  }
  getById(id: number): Observable<ApiResponse<Contrat>> {
    return this.http.get<ApiResponse<Contrat>>(`${this.apiUrl}/${id}`);
  }
  create(c: Contrat): Observable<ApiResponse<Contrat>> {
    return this.http.post<ApiResponse<Contrat>>(this.apiUrl, c);
  }
  update(id: number, c: Partial<Contrat>): Observable<ApiResponse<Contrat>> {
    return this.http.put<ApiResponse<Contrat>>(`${this.apiUrl}/${id}`, c);
  }
  resilier(id: number, motif: string): Observable<ApiResponse<Contrat>> {
    return this.http.post<ApiResponse<Contrat>>(`${this.apiUrl}/${id}/resilier`, { motif });
  }
  archiver(id: number): Observable<ApiResponse<Contrat>> {
    return this.http.post<ApiResponse<Contrat>>(`${this.apiUrl}/${id}/archiver`, {});
  }
  getPaiements(id: number): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/${id}/paiements`);
  }
}