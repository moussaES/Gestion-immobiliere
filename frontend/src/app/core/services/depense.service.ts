import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Depense } from '../models/depense.model';
import { ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class DepenseService {
  private apiUrl = `${environment.apiUrl}/depenses`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  getById(id: number): Observable<ApiResponse<Depense>> {
    return this.http.get<ApiResponse<Depense>>(`${this.apiUrl}/${id}`);
  }
  create(d: any): Observable<ApiResponse<Depense>> {
    return this.http.post<ApiResponse<Depense>>(this.apiUrl, d);
  }
  update(id: number, d: any): Observable<ApiResponse<Depense>> {
    return this.http.put<ApiResponse<Depense>>(`${this.apiUrl}/${id}`, d);
  }
  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
