export type Role = 'ADMIN' | 'GESTIONNAIRE' | 'COMPTABLE';

export interface Utilisateur {
  id?:           number;
  nom:           string;
  prenom:        string;
  email:         string;
  password?:     string;
  role:          Role;
  statut:        'actif' | 'inactif';
  date_creation?: string;
}

export interface AuthResponse {
  token:      string;
  token_type: string;
  user:       Utilisateur;
}

export interface LoginRequest {
  email:    string;
  password: string;
}