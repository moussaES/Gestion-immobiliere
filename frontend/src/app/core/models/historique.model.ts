export type TypeOperation = 'INSERT' | 'UPDATE' | 'DELETE';

export interface HistoriqueOperation {
  id_historique?:   number;
  id_utilisateur:   number;
  type_operation:   TypeOperation;
  entite:           string;
  id_entite:        number;
  ancienne_valeur?: string;
  nouvelle_valeur?: string;
  description:      string;
  date_operation?:  string;
  utilisateur?:     any;
}