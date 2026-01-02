export enum UserRole {
  Boss = 'Boss',
  Gerant = 'Gérant',
  ChefCuisine = 'Chef Cuisine',
  Magasinier = 'Magasinier',
  Caissier = 'Caissier',
  Reception = 'Réception'
}

export type SiteOption = 'Fnidaq' | "M'dik" | 'Al Hoceima' | 'Vue Globale';

export interface User {
  username: string;
  password?: string; // Optional because we don't store it in session
  role: UserRole;
  site?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface LoginCredentials {
  username: string;
  role: UserRole;
}

export interface ActionLog {
  id: string;
  actor: string; // Qui a fait l'action
  action: string; // Quoi
  target: string; // Sur qui/quoi
  date: string; // Quand
  type: 'info' | 'warning' | 'danger';
}