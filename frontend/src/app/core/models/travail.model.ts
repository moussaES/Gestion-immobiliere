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
  bien?: any;
  locataire?: any;
  proprietaire?: any;
  created_at?: string;
  updated_at?: string;
}
