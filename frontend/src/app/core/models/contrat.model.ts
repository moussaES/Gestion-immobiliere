export type TypeContrat   = 'location' | 'gestion';
export type StatutContrat = 'actif' | 'resilie' | 'expire' | 'archive';

export interface Contrat {
  id?:              number;
  reference:        string;
  type:             TypeContrat;
  date_debut:       string;
  date_fin:         string;
  montant:          number;
  depot_garantie:   number;
  statut:           StatutContrat;
  id_bien:          number;
  id_locataire:     number;
  id_proprietaire:  number;
  bien?:            any;
  locataire?:       any;
  proprietaire?:    any;
  date_creation?:   string;
}