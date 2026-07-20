export type TypeContrat   = 'LOCATAIRE' | 'PROPRIETAIRE';
export type StatutContrat = 'ACTIF' | 'RESILIE' | 'ARCHIVE';

export interface Contrat {
  id_contrat?:      number;
  reference:        string;
  type_contrat:     TypeContrat;
  date_debut:       string;
  date_fin:         string;
  montant:          number;
  statut:           StatutContrat;
  id_bien:          number;
  id_locataire?:    number;
  id_proprietaire:  number;
  notes?:           string;
  bien?:            any;
  locataire?:       any;
  proprietaire?:    any;
  paiements?:       any[];
  date_creation?:   string;
}