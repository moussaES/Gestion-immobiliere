export type ModePaiement   = 'especes' | 'virement' | 'cheque' | 'wave' | 'orange_money' | 'ESPECES' | 'VIREMENT' | 'CHEQUE' | 'WAVE' | 'ORANGE_MONEY';
export type StatutPaiement = 'paye' | 'en_attente' | 'impaye' | 'retard' | 'PAYE' | 'EN_ATTENTE' | 'IMPAYE' | string;

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