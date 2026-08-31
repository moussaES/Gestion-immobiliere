export type Role = 'ADMIN' | 'GESTIONNAIRE';

export interface Utilisateur {
  id_user?:      number;
  nom:           string;
  prenom:        string;
  email:         string;
  password?:     string;
  role:          Role;
  statut:        'ACTIF' | 'INACTIF' | 'actif' | 'inactif';
  derniere_connexion?: string;
  date_creation?: string;
}

export interface AuthResponse {
  token:      string;
  token_type: string;
  expires_in?: number;
  user:       Utilisateur;
}

export interface LoginRequest {
  email:    string;
  password: string;
}