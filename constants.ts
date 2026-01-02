import { UserRole, SiteOption } from './types';

// Using the exact image URL provided
export const LOGO_URL = "https://i.ibb.co/XZZBLSSW/Chat-GPT-Image-Dec-31-2025-02-10-28-AM.png";

export const SITE_OPTIONS: SiteOption[] = ['Fnidaq', "M'dik", 'Al Hoceima', 'Vue Globale'];

export const ROLES: UserRole[] = [
  UserRole.Boss,
  UserRole.Gerant,
  UserRole.ChefCuisine,
  UserRole.Magasinier,
  UserRole.Caissier,
  UserRole.Reception
];

// Updated MOCK_USERS to match the prompt's ID/Password logic
export const MOCK_USERS = [
  { username: '1', password: '1', role: UserRole.Boss },
  
  { username: '21', password: '21', role: UserRole.Gerant, site: 'Fnidaq' },
  { username: '22', password: '22', role: UserRole.Gerant, site: "M'dik" },
  
  { username: '31', password: '31', role: UserRole.ChefCuisine, site: 'Fnidaq' },
  { username: '32', password: '32', role: UserRole.ChefCuisine, site: "M'dik" },
  { username: '33', password: '33', role: UserRole.ChefCuisine, site: 'Al Hoceima' },
  
  { username: '41', password: '41', role: UserRole.Magasinier, site: 'Fnidaq' },
  { username: '42', password: '42', role: UserRole.Magasinier, site: "M'dik" },
  { username: '43', password: '43', role: UserRole.Magasinier, site: 'Al Hoceima' },
  
  { username: '51', password: '51', role: UserRole.Caissier, site: 'Fnidaq' },
  { username: '52', password: '52', role: UserRole.Caissier, site: "M'dik" },
  { username: '53', password: '53', role: UserRole.Caissier, site: 'Al Hoceima' },
  
  { username: '61', password: '61', role: UserRole.Reception, site: 'Fnidaq' },
  { username: '62', password: '62', role: UserRole.Reception, site: "M'dik" },
  { username: '63', password: '63', role: UserRole.Reception, site: 'Al Hoceima' },
];

export const MENU_ITEMS: Record<UserRole, string[]> = {
  [UserRole.Boss]: ['Tableau de bord','Caisse','Gestion de stock','Planning des repas','Appartements','Blanchisserie','Bons de restauration','Les employés','Rapports'],
  [UserRole.Gerant]: ['Tableau de bord','Caisse','Gestion de stock','Planning des repas','Appartements','Blanchisserie','Bons de restauration','Les employés','Rapports'],
  [UserRole.ChefCuisine]: ['Tableau de bord','Gestion de stock','Planning des repas','Bons de restauration'],
  [UserRole.Magasinier]: ['Tableau de bord','Gestion de stock'],
  [UserRole.Caissier]: ['Tableau de bord','Bons de restauration','Présence'],
  [UserRole.Reception]: ['Tableau de bord','Appartements','Blanchisserie']
};