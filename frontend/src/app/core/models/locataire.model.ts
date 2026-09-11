export interface Locataire {
  id?:            number;
  id_locataire?:  number;
  nom:            string;
  prenom:         string;
  telephone:      string;
  email:          string;
  adresse:        string;
  profession:     string;
  cni:            string;
  statut?:        'ACTIF' | 'INACTIF' | 'actif' | 'inactif';
  date_creation?:  string;
  contrats_count?: number;
}