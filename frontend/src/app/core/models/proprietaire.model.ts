export interface Proprietaire {
  id?:           number;
  nom:           string;
  prenom:        string;
  telephone:     string;
  email:         string;
  adresse:       string;
  cni:           string;
  date_creation?: string;
  biens_count?:  number;
}