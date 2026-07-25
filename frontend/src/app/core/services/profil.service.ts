import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfilService {
  private apiUrl = `${environment.apiUrl}/profil`;

  constructor(private http: HttpClient) {}

  getProfil(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateProfil(id: number, data: { nom?: string; prenom?: string; email?: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/infos`, data);
  }

  changePassword(id: number, data: {
    ancien_mot_de_passe: string;
    nouveau_mot_de_passe: string;
    nouveau_mot_de_passe_confirmation: string;
  }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/mot-de-passe`, data);
  }
}
