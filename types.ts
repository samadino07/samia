
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

export type MealType = 'PtDej' | 'Dej' | 'Gouter' | 'Diner';
export type HebergementType = '1/4' | '1/2' | 'Complet';
export type LaundryStatus = 'En attente' | 'En cours' | 'Livré';

export interface Dish {
  id: string;
  name: string;
  category: MealType;
  ingredients: string;
  cost: number;
}

export interface DailyPlan {
  [key: string]: string; // MealType -> DishId
}

export interface Client {
  id: string;
  name: string;
  entryDate: string;
  type: HebergementType;
}

export interface ClientHistory {
  clientName: string;
  entryDate: string;
  leaveDate: string;
  type: HebergementType;
}

export interface Apartment {
  id: string;
  number: string;
  building: string;
  site: string;
  currentClients: Client[];
  history: ClientHistory[];
}

export interface LaundryOrder {
  id: string;
  clientId: string;
  clientName: string;
  apartmentNumber: string;
  site: string;
  items: string;
  date: string;
  status: LaundryStatus;
}

export interface RestaurantOrder {
  id: string;
  type: 'Boisson' | 'Repas';
  mealType?: MealType;
  clientId: string;
  clientName: string;
  aptNumber: string;
  site: string;
  date: string;
  time: string;
  items: string[];
}

export interface Employee {
  id: string;
  name: string;
  function: string;
  phone: string;
  shift: 'Matin' | 'Soir' | 'Jour';
  monthlySalary: number;
  lastMonthSalary: number;
  absences: number;
  status: 'Présent' | 'Absent' | 'Retard';
}

export interface CashFund {
  id: string;
  amount: number;
  date: string;
  addedBy: string;
}

export interface CashExpense {
  id: string;
  category: string;
  amount: number;
  observation: string;
  date: string;
  addedBy: string;
}
