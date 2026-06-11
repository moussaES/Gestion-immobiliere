export type ModePaiement   = 'especes' | 'virement' | 'cheque' | 'wave' | 'orange_money';
export type StatutPaiement = 'paye' | 'partiel' | 'en_attente' | 'retard';

export interface Paiement {
  id?:              number;
  reference:        string;
  date_paiement:    string;
  montant:          number;
  mode:             ModePaiement;
  statut:           StatutPaiement;
  mois_concerne:    string;
  note?:            string;
  id_contrat:       number;
  id_utilisateur?:  number;
  contrat?:         any;
  date_creation?:   string;
}