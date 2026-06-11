export interface Locataire {
  id?:            number;
  nom:            string;
  prenom:         string;
  telephone:      string;
  email:          string;
  adresse:        string;
  profession:     string;
  cni:            string;
  date_creation?:  string;
  contrats_count?: number;
}