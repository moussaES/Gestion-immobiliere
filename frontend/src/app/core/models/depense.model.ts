export type TypeDepense = 'AGENCE' | 'BIEN';
export type CategorieDepenseAgence = 'DEPLACEMENT' | 'ACHAT' | 'AUTRE';

export interface Depense {
  id_depense?: number;
  type_depense: TypeDepense;
  categorie?: CategorieDepenseAgence;
  description: string;
  montant: number;
  date_depense: string;
  id_bien?: number;
  id_proprietaire?: number;
  id_prestataire?: number;
  justificatif?: string;
  bien?: any;
  proprietaire?: any;
  prestataire?: any;
  created_at?: string;
  updated_at?: string;
}
