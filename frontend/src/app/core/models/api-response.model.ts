export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data:    T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    current_page:  number;
    data:          T[];
    total:         number;
    per_page:      number;
    last_page:     number;
  };
}

export interface DashboardStats {
  total_biens:         number;
  biens_libres:        number;
  biens_occupes:       number;
  total_proprietaires: number;
  total_locataires:    number;
  contrats_actifs:     number;
  revenu_mensuel:      number;
  paiements_en_attente:number;
  taux_occupation:     number;
  loyers_attendus:     number;
  part_proprietaire_attendue: number;
  revenus_agence_attendus:    number;
  part_proprietaire_versee:   number;
  revenus_agence_encaisses:   number;
}