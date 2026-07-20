import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private apiUrl = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(this.apiUrl);
  }

  getByEntiteAndId(entite: string, id: number): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/by-entite/${entite}/${id}`);
  }

  download(id: number): void {
    window.open(`${this.apiUrl}/${id}/download`, '_blank');
  }
}
