export type ModePaiement   = 'especes' | 'virement' | 'cheque' | 'wave' | 'orange_money';
export type StatutPaiement = 'paye' | 'en_attente' | 'impaye' | 'retard';

export interface Paiement {
  id_paiement?:     number;
  reference:        string;
  date_paiement:    string;
  montant:          number;
  mode_paiement:    ModePaiement;
  statut:           StatutPaiement;
  mois_concerne?:   string;
  notes?:           string;
  id_contrat:       number;
  id_utilisateur?:  number;
  contrat?:         any;
  date_creation?:   string;
}