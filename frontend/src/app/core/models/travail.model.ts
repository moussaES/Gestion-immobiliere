export type StatutTravail = 'PREVU' | 'EN_COURS' | 'TERMINE' | 'ANNULE';

export interface Travail {
  id_travail?: number;
  titre: string;
  description?: string;
  montant: number;
  date_intervention: string;
  statut: StatutTravail;
  id_bien: number;
  id_locataire?: number;
  id_proprietaire?: number;
  id_prestataire?: number;
  bien?: any;
  locataire?: any;
  proprietaire?: any;
  prestataire?: any;
  created_at?: string;
  updated_at?: string;
}
