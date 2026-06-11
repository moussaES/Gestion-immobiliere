import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Bien, ApiResponse, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class BienService {
  private apiUrl = `${environment.apiUrl}/biens`;

  constructor(private http: HttpClient) {}

  getAll(page = 1, perPage = 10, filters?: any): Observable<PaginatedResponse<Bien>> {
    let params = new HttpParams()
      .set('page', page).set('per_page', perPage);
    if (filters) Object.keys(filters).forEach(k => filters[k] && (params = params.set(k, filters[k])));
    return this.http.get<PaginatedResponse<Bien>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ApiResponse<Bien>> {
    return this.http.get<ApiResponse<Bien>>(`${this.apiUrl}/${id}`);
  }

  create(bien: Bien): Observable<ApiResponse<Bien>> {
    return this.http.post<ApiResponse<Bien>>(this.apiUrl, bien);
  }

  update(id: number, bien: Partial<Bien>): Observable<ApiResponse<Bien>> {
    return this.http.put<ApiResponse<Bien>>(`${this.apiUrl}/${id}`, bien);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }

  changerStatut(id: number, statut: string): Observable<ApiResponse<Bien>> {
    return this.http.post<ApiResponse<Bien>>(`${this.apiUrl}/${id}/changer-statut`, { statut });
  }

  getStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/stats`);
  }

  rechercheAvancee(criteres: any): Observable<ApiResponse<Bien[]>> {
    return this.http.post<ApiResponse<Bien[]>>(`${this.apiUrl}/recherche/avancee`, criteres);
  }
}