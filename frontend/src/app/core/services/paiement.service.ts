import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Paiement, ApiResponse, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class PaiementService {
  private apiUrl = `${environment.apiUrl}/paiements`;
  constructor(private http: HttpClient) {}

  getAll(page = 1): Observable<PaginatedResponse<Paiement>> {
    return this.http.get<PaginatedResponse<Paiement>>(`${this.apiUrl}?page=${page}`);
  }
  getById(id: number): Observable<ApiResponse<Paiement>> {
    return this.http.get<ApiResponse<Paiement>>(`${this.apiUrl}/${id}`);
  }
  create(p: Paiement): Observable<ApiResponse<Paiement>> {
    return this.http.post<ApiResponse<Paiement>>(this.apiUrl, p);
  }
  update(id: number, p: Partial<Paiement>): Observable<ApiResponse<Paiement>> {
    return this.http.put<ApiResponse<Paiement>>(`${this.apiUrl}/${id}`, p);
  }
  getStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/stats`);
  }
  getParModePaiement(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/par-mode-paiement`);
  }
}