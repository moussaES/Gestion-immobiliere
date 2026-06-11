import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Locataire, ApiResponse, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class LocataireService {
  private apiUrl = `${environment.apiUrl}/locataires`;
  constructor(private http: HttpClient) {}

  getAll(page = 1): Observable<PaginatedResponse<Locataire>> {
    return this.http.get<PaginatedResponse<Locataire>>(`${this.apiUrl}?page=${page}`);
  }
  getById(id: number): Observable<ApiResponse<Locataire>> {
    return this.http.get<ApiResponse<Locataire>>(`${this.apiUrl}/${id}`);
  }
  create(l: Locataire): Observable<ApiResponse<Locataire>> {
    return this.http.post<ApiResponse<Locataire>>(this.apiUrl, l);
  }
  update(id: number, l: Partial<Locataire>): Observable<ApiResponse<Locataire>> {
    return this.http.put<ApiResponse<Locataire>>(`${this.apiUrl}/${id}`, l);
  }
  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
  getContrats(id: number): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/${id}/contrats`);
  }
}