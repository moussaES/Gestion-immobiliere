import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Utilisateur, ApiResponse, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class UtilisateurService {
  private apiUrl = `${environment.apiUrl}/utilisateurs`;
  constructor(private http: HttpClient) {}

  getAll(page = 1): Observable<PaginatedResponse<Utilisateur>> {
    return this.http.get<PaginatedResponse<Utilisateur>>(`${this.apiUrl}?page=${page}`);
  }
  getById(id: number): Observable<ApiResponse<Utilisateur>> {
    return this.http.get<ApiResponse<Utilisateur>>(`${this.apiUrl}/${id}`);
  }
  create(u: Utilisateur): Observable<ApiResponse<Utilisateur>> {
    return this.http.post<ApiResponse<Utilisateur>>(this.apiUrl, u);
  }
  update(id: number, u: Partial<Utilisateur>): Observable<ApiResponse<Utilisateur>> {
    return this.http.put<ApiResponse<Utilisateur>>(`${this.apiUrl}/${id}`, u);
  }
  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
