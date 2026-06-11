import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Proprietaire, ApiResponse, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ProprietaireService {
  private apiUrl = `${environment.apiUrl}/proprietaires`;
  constructor(private http: HttpClient) {}

  getAll(page = 1): Observable<PaginatedResponse<Proprietaire>> {
    return this.http.get<PaginatedResponse<Proprietaire>>(`${this.apiUrl}?page=${page}`);
  }
  getById(id: number): Observable<ApiResponse<Proprietaire>> {
    return this.http.get<ApiResponse<Proprietaire>>(`${this.apiUrl}/${id}`);
  }
  create(p: Proprietaire): Observable<ApiResponse<Proprietaire>> {
    return this.http.post<ApiResponse<Proprietaire>>(this.apiUrl, p);
  }
  update(id: number, p: Partial<Proprietaire>): Observable<ApiResponse<Proprietaire>> {
    return this.http.put<ApiResponse<Proprietaire>>(`${this.apiUrl}/${id}`, p);
  }
  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
  getBiens(id: number): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/${id}/biens`);
  }
}