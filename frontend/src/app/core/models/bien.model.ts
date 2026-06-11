export type TypeBien    = 'appartement' | 'maison' | 'terrain' | 'immeuble' | 'bureau' | 'commerce';
export type StatutBien  = 'libre' | 'occupe' | 'reserve' | 'travaux';

export interface Bien {
  id?:               number;
  reference:         string;
  type:              TypeBien;
  adresse:           string;
  ville:             string;
  surface:           number;
  loyer_mensuel:     number;
  charges:           number;
  description?:      string;
  statut:            StatutBien;
  id_proprietaire:   number;
  proprietaire?:     any;
  date_creation?:    string;
}