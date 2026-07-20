export interface Document {
  id_document?: number;
  type_document: string;
  chemin_fichier: string;
  nom_fichier: string;
  taille?: number;
  id_bien?: number;
  id_locataire?: number;
  id_proprietaire?: number;
  id_contrat?: number;
  id_paiement?: number;
  date_creation?: string;
  created_at?: string;
  updated_at?: string;
  bien?: any;
  locataire?: any;
  proprietaire?: any;
  contrat?: any;
  paiement?: any;
}
