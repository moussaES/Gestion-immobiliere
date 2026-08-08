import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Prestataire } from '../models/prestataire.model';

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

@Injectable({ providedIn: 'root' })
export class PrestataireService {
  private apiUrl = `${environment.apiUrl}/prestataires`;
  
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  
  getById(id: number): Observable<ApiResponse<Prestataire>> {
    return this.http.get<ApiResponse<Prestataire>>(`${this.apiUrl}/${id}`);
  }
  
  create(p: Prestataire): Observable<ApiResponse<Prestataire>> {
    return this.http.post<ApiResponse<Prestataire>>(this.apiUrl, p);
  }
  
  update(id: number, p: Partial<Prestataire>): Observable<ApiResponse<Prestataire>> {
    return this.http.put<ApiResponse<Prestataire>>(`${this.apiUrl}/${id}`, p);
  }
  
  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
