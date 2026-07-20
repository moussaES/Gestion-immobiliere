import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HistoriqueOperation, ApiResponse, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class HistoriqueService {
  private apiUrl = `${environment.apiUrl}/historique`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<HistoriqueOperation[]>> {
    return this.http.get<ApiResponse<HistoriqueOperation[]>>(`${this.apiUrl}`);
  }

  getRecent(jours: number = 7): Observable<ApiResponse<HistoriqueOperation[]>> {
    return this.http.get<ApiResponse<HistoriqueOperation[]>>(`${this.apiUrl}/recent/${jours}`);
  }

  getStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/statistiques`);
  }

  getByEntiteAndId(entite: string, id: number): Observable<ApiResponse<HistoriqueOperation[]>> {
    return this.http.get<ApiResponse<HistoriqueOperation[]>>(`${this.apiUrl}/by-entite/${entite}/${id}`);
  }
}
