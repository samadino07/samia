import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, UserRole } from './types';
import { AuthService } from './services/authService';
import { ROLES, MOCK_USERS, LOGO_URL } from './constants';
import { Input } from './components/Input';
import { Button } from './components/Button';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, ShoppingCart, AlertTriangle, 
  Plus, Minus, CheckCircle, Clock, Package, Search, X,
  Calendar, Coffee, Sun, CloudSun, Moon, DollarSign, Edit3,
  User as UserIcon, Shirt, 
  Utensils, FileText, Printer, Briefcase, UserCheck, UserX, FileSpreadsheet, Download, PieChart as PieChartIcon,
  Wallet, Banknote, CreditCard, UserPlus
} from 'lucide-react';

// --- Interactive Widgets ---

const StatWidget = ({ title, value, subtext, icon: Icon, trend }: any) => (
  <div className="dashboard-card flex flex-col justify-between h-full">
    <div className="flex justify-between items-start">
      <div>
        <div className="dashboard-stat-label">{title}</div>
        <div className="dashboard-stat-value" style={{ color: 'var(--text-main)' }}>{value}</div>
      </div>
      <div className={`p-2 rounded-lg ${trend === 'up' ? 'bg-green-100 text-green-700' : trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      {trend === 'up' && <TrendingUp size={14} className="text-green-500 mr-1" />}
      {trend === 'down' && <TrendingDown size={14} className="text-red-500 mr-1" />}
      <span className="opacity-70">{subtext}</span>
    </div>
  </div>
);

const InteractiveStockWidget = ({ items, onUpdate }: any) => {
  return (
    <div className="dashboard-card col-span-1 lg:col-span-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg" style={{ color: 'var(--text-main)' }}>📦 Gestion Rapide Stock</h3>
        <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition-colors">
          Voir tout
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item: any, idx: number) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-10 rounded-full ${item.quantite <= item.seuilCritique ? 'bg-red-500' : 'bg-green-500'}`}></div>
              <div>
                <div className="font-semibold text-sm" style={{ color: 'var(--text-main)' }}>{item.nom}</div>
                <div className="text-xs opacity-70">{item.cat}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onUpdate(idx, -1)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="font-bold w-8 text-center" style={{ color: 'var(--text-main)' }}>{item.quantite}</span>
              <button 
                onClick={() => onUpdate(idx, 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InteractiveOrdersWidget = ({ orders, onStatusChange }: any) => {
  const getStatusColor = (s: string) => {
    switch(s) {
      case 'Livré': return 'bg-green-100 text-green-700';
      case 'En cours': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="dashboard-card col-span-1 lg:col-span-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg" style={{ color: 'var(--text-main)' }}>👨‍🍳 Commandes Cuisine</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="opacity-70 border-b border-gray-700">
            <tr>
              <th className="py-2">Produit</th>
              <th className="py-2">Qté</th>
              <th className="py-2">Statut (Cliquer)</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any, idx: number) => (
              <tr key={idx} className="border-b border-gray-800/20 hover:bg-white/5 transition-colors">
                <td className="py-3 font-medium" style={{ color: 'var(--text-main)' }}>{order.produit}</td>
                <td className="py-3">{order.quantite}</td>
                <td className="py-3">
                  <span 
                    onClick={() => onStatusChange(idx)}
                    className={`px-2 py-1 rounded-full text-xs font-semibold cursor-pointer select-none ${getStatusColor(order.statut)}`}
                  >
                    {order.statut}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RevenueChartWidget = ({ data }: any) => (
  <div className="dashboard-card col-span-1 lg:col-span-3 h-[300px]">
    <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--text-main)' }}>📈 Revenus (7 derniers jours)</h3>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
        <XAxis dataKey="name" tick={{fill: '#9ca3af', fontSize: 12}} axisLine={false} tickLine={false} />
        <YAxis tick={{fill: '#9ca3af', fontSize: 12}} axisLine={false} tickLine={false} />
        <RechartsTooltip 
          contentStyle={{ backgroundColor: '#1f2933', borderRadius: '8px', border: 'none', color: '#fff' }}
          itemStyle={{ color: '#fff' }}
        />
        <Bar dataKey="revenu" fill="var(--role-color)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const OccupancyChartWidget = () => {
  const data = [
    { name: 'Occupés', value: 12, color: '#2563eb' },
    { name: 'Libres', value: 3, color: '#16a34a' },
    { name: 'Maintenance', value: 1, color: '#dc2626' },
  ];

  return (
    <div className="dashboard-card col-span-1 lg:col-span-1 h-[300px] flex flex-col items-center justify-center">
      <h3 className="font-bold text-lg mb-2 w-full text-left" style={{ color: 'var(--text-main)' }}>🛏️ Occupation</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <RechartsTooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex gap-4 text-xs mt-2">
        {data.map(d => (
          <div key={d.name} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}}></div>
            <span style={{ color: 'var(--text-main)' }}>{d.name}: {d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- TYPES FOR MEAL PLANNING & APARTMENTS ---
type MealType = 'PtDej' | 'Dej' | 'Gouter' | 'Diner';
type HebergementType = '1/1' | '1/2' | '1/3' | '1/4';

interface Dish {
  id: string;
  name: string;
  category: MealType;
  ingredients: string;
  cost: number;
}
interface DailyPlan {
  PtDej?: string; // Dish ID
  Dej?: string;
  Gouter?: string;
  Diner?: string;
}

interface Client {
  id: string;
  name: string;
  entryDate: string;
  type: HebergementType;
}

interface ClientHistory {
  clientName: string;
  entryDate: string;
  leaveDate: string;
  type: HebergementType;
}

interface Apartment {
  id: string;
  number: string;
  building: string;
  site: string;
  capacity: number;
  currentClients: Client[]; // Modified to support multiple clients
  history: ClientHistory[];
}

// --- BLANCHISSERIE TYPES ---
type LaundryStatus = 'En attente' | 'En blanchisserie' | 'En réception' | 'Livré';

interface LaundryOrder {
  id: string;
  clientId: string;
  clientName: string;
  apartmentNumber: string;
  site: string;
  items: string; // Description des vêtements
  date: string;
  status: LaundryStatus;
}

// --- RESTAURATION TYPES ---
interface RestaurantOrder {
  id: string;
  type: 'Repas' | 'Boisson';
  mealType?: MealType; // Only if type is Repas
  clientId: string;
  clientName: string;
  aptNumber: string;
  site: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  items: string[]; // Drinks list
}

// --- EMPLOYEES TYPES ---
interface Employee {
  id: string;
  name: string;
  function: string;
  phone: string;
  shift: 'Matin' | 'Soir' | 'Jour';
  monthlySalary: number;
  lastMonthSalary: number;
  absences: number; // Days absent this month
  status: 'Présent' | 'Absent' | 'Retard'; // Daily status check
}

// --- CAISSE TYPES ---
interface CashFund {
  id: string;
  amount: number;
  date: string;
  addedBy: string;
}

interface CashExpense {
  id: string;
  category: string; // "Gasoil", "Courses", etc.
  amount: number;
  date: string;
  observation: string;
  addedBy: string;
}

// Helper to determine max occupants based on type
const getMaxOccupants = (type: HebergementType): number => {
  switch (type) {
    case '1/4': return 4;
    case '1/3': return 3;
    case '1/2': return 2;
    case '1/1': return 1;
    default: return 1;
  }
};

// --- INITIAL APARTMENT DATA GENERATOR ---
const generateApartments = (): Apartment[] => {
  const apts: Apartment[] = [];
  
  // Fnidaq - Immeuble Fnidaq (31 apts, Cap 4)
  for(let i=1; i<=31; i++) {
    apts.push({ id: `F-F-${i}`, number: `N°${i}`, building: 'Imm. Fnidaq', site: 'Fnidaq', capacity: 4, currentClients: [], history: [] });
  }
  // Fnidaq - Immeuble Bouzaghlal (16 apts: 1-12 Cap 4, 13-16 Cap 2)
  for(let i=1; i<=16; i++) {
    apts.push({ 
      id: `F-B-${i}`, number: `B-${i}`, building: 'Imm. Bouzaghlal', site: 'Fnidaq', 
      capacity: i <= 12 ? 4 : 2, 
      currentClients: [], history: [] 
    });
  }
  
  // M'dik (12 apts: 1-11 Cap 4, 12 Cap 2)
  for(let i=1; i<=12; i++) {
    apts.push({ 
      id: `M-${i}`, number: `M-${i}`, building: 'Résidence M\'dik', site: "M'dik", 
      capacity: i <= 11 ? 4 : 2, 
      currentClients: [], history: [] 
    });
  }

  // Al Hoceima (8 apts, Cap 4)
  for(let i=1; i<=8; i++) {
    apts.push({ id: `A-${i}`, number: `AH-${i}`, building: 'Résidence Al Hoceima', site: 'Al Hoceima', capacity: 4, currentClients: [], history: [] });
  }

  // Some mock data
  if(apts[0]) {
    apts[0].currentClients = [{ id: 'mock-1', name: 'Karim Tazi', entryDate: '2025-01-01', type: '1/4' }];
    apts[0].history = [
      { clientName: 'Said Alami', entryDate: '2024-12-25', leaveDate: '2024-12-30', type: '1/3' }
    ];
  }

  return apts;
};

// --- Dashboard Component ---
const Dashboard: React.FC<{ user: User | null; onLogout: () => void }> = ({ user, onLogout }) => {
  const [currentSite, setCurrentSite] = useState<string>('Vue Globale');
  const [activeMenu, setActiveMenu] = useState('Tableau de bord');

  // --- Stock & Orders State ---
  const [stockItems, setStockItems] = useState([
    {nom:'Lait', cat:'Alimentation', quantite:12, seuilCritique:5, unite:'L', prix:15},
    {nom:'Pain', cat:'Boulangerie', quantite:3, seuilCritique:5, unite:'pcs', prix:5},
    {nom:'Viande', cat:'Boucherie', quantite:0, seuilCritique:2, unite:'kg', prix:80},
    {nom:'Fruits', cat:'F&L', quantite:8, seuilCritique:5, unite:'kg', prix:20},
    {nom:'Eau Minérale', cat:'Boissons', quantite:120, seuilCritique:24, unite:'Bouteille', prix:3},
    {nom:'Tomates', cat:'F&L', quantite:15, seuilCritique:5, unite:'kg', prix:4},
  ]);

  const [chefOrders, setChefOrders] = useState([
    {produit:'Lait', quantite:5, statut:'En attente', date:'2026-01-02'},
    {produit:'Pain', quantite:10, statut:'Livré', date:'2026-01-01'},
    {produit:'Café', quantite:2, statut:'En cours', date:'2026-01-03'},
  ]);

  // --- Meal Planning State ---
  const [dishes, setDishes] = useState<Dish[]>([
    { id: '1', name: 'Omelette Fromage', category: 'PtDej', ingredients: 'Oeufs, Fromage, Huile', cost: 12 },
    { id: '2', name: 'Msemmen Miel', category: 'PtDej', ingredients: 'Farine, Beurre, Miel', cost: 5 },
    { id: '3', name: 'Tagine Poulet', category: 'Dej', ingredients: 'Poulet, Oignon, Olives, Citron', cost: 45 },
    { id: '4', name: 'Salade César', category: 'Dej', ingredients: 'Laitue, Poulet, Croutons, Sauce', cost: 25 },
    { id: '5', name: 'Crêpe Chocolat', category: 'Gouter', ingredients: 'Farine, Lait, Chocolat', cost: 8 },
    { id: '6', name: 'Soupe Légumes', category: 'Diner', ingredients: 'Carottes, Pommes de terre, Poireaux', cost: 10 },
    { id: '7', name: 'Grillade Mixte', category: 'Diner', ingredients: 'Viande hachée, Poulet, Merguez', cost: 60 },
  ]);

  const [weeklyPlan, setWeeklyPlan] = useState<Record<string, DailyPlan>>({
    'Lundi': { PtDej: '1', Dej: '3', Gouter: '5', Diner: '6' },
    'Mardi': { PtDej: '2', Dej: '4', Gouter: '5', Diner: '7' },
    'Mercredi': { PtDej: '1', Dej: '3', Gouter: '5', Diner: '6' },
    'Jeudi': { PtDej: '2', Dej: '4', Gouter: '5', Diner: '7' },
    'Vendredi': { PtDej: '1', Dej: '3', Gouter: '5', Diner: '6' },
    'Samedi': { PtDej: '2', Dej: '7', Gouter: '5', Diner: '6' },
    'Dimanche': { PtDej: '1', Dej: '7', Gouter: '5', Diner: '4' },
  });

  const [editingSlot, setEditingSlot] = useState<{day: string, type: MealType} | null>(null);
  const [showDishForm, setShowDishForm] = useState(false);
  const [newDish, setNewDish] = useState<Partial<Dish>>({ category: 'PtDej', cost: 0 });

  // --- Apartments State ---
  const [apartments, setApartments] = useState<Apartment[]>(() => generateApartments());
  const [selectedApt, setSelectedApt] = useState<Apartment | null>(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [newClient, setNewClient] = useState<{name: string, date: string, type: HebergementType}>({
    name: '', date: new Date().toISOString().split('T')[0], type: '1/4'
  });
  const [clientSearchQuery, setClientSearchQuery] = useState('');

  // --- Blanchisserie State ---
  const [laundryOrders, setLaundryOrders] = useState<LaundryOrder[]>([
    { id: '101', clientId: 'mock-1', clientName: 'Karim Tazi', apartmentNumber: 'N°1', site: 'Fnidaq', items: '2 Chemises, 1 Pantalon', date: '2025-01-02', status: 'En attente' }
  ]);
  const [showLaundryForm, setShowLaundryForm] = useState(false);
  const [newLaundryOrder, setNewLaundryOrder] = useState({ apartmentId: '', clientId: '', items: '' });

  // --- Restaurant State ---
  const [restaurantOrders, setRestaurantOrders] = useState<RestaurantOrder[]>([]);
  const [currentMealService, setCurrentMealService] = useState<MealType>('PtDej');
  const [newRestoOrder, setNewRestoOrder] = useState<{
    clientId: string; 
    drinks: string[]; 
    isDrinkOnly: boolean; 
  }>({
    clientId: '',
    drinks: [],
    isDrinkOnly: false
  });
  const [showBonModal, setShowBonModal] = useState<RestaurantOrder | null>(null);

  // --- Employees State ---
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 'e1', name: 'Ahmed', function: 'Sécurité', phone: '0661000000', shift: 'Soir', monthlySalary: 3500, lastMonthSalary: 3500, absences: 0, status: 'Présent' },
    { id: 'e2', name: 'Fatima', function: 'Femme de ménage', phone: '0662000000', shift: 'Matin', monthlySalary: 3000, lastMonthSalary: 2900, absences: 2, status: 'Absent' },
    { id: 'e3', name: 'Youssef', function: 'Réceptionniste', phone: '0663000000', shift: 'Jour', monthlySalary: 4000, lastMonthSalary: 4000, absences: 0, status: 'En retard' },
  ]);
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({ shift: 'Jour', monthlySalary: 0 });
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);

  // --- Caisse State ---
  const [cashFunds, setCashFunds] = useState<CashFund[]>([
    { id: 'cf1', amount: 5000, date: '2025-01-01', addedBy: 'Boss' },
    { id: 'cf2', amount: 2000, date: '2025-01-10', addedBy: 'Boss' }
  ]);
  const [cashExpenses, setCashExpenses] = useState<CashExpense[]>([
    { id: 'ce1', category: 'Gazoil', amount: 300, date: '2025-01-05', observation: 'Transport Marchandise', addedBy: 'Gérant Fnidaq' },
    { id: 'ce2', category: 'Maintenance', amount: 150, date: '2025-01-12', observation: 'Ampoules', addedBy: 'Gérant M\'dik' }
  ]);
  const [showFundForm, setShowFundForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [newFundAmount, setNewFundAmount] = useState('');
  const [newExpense, setNewExpense] = useState({ category: '', amount: '', observation: '' });

  // Forms State
  const [newProduct, setNewProduct] = useState({ nom: '', cat: '', quantite: 0, unite: '', prix: 0 });
  const [newOrder, setNewOrder] = useState({ produit: '', quantite: 1 });
  const [showAddForm, setShowAddForm] = useState(false);

  const revenueData = [
    { name: 'Lun', revenu: 4000 },
    { name: 'Mar', revenu: 3000 },
    { name: 'Mer', revenu: 2000 },
    { name: 'Jeu', revenu: 2780 },
    { name: 'Ven', revenu: 1890 },
    { name: 'Sam', revenu: 2390 },
    { name: 'Dim', revenu: 3490 },
  ];

  // Initialize some restaurant orders for historical data mock
  useEffect(() => {
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    const dayBefore = new Date(today); dayBefore.setDate(dayBefore.getDate() - 2);

    const fmt = (d: Date) => d.toISOString().split('T')[0];

    // Mock data for graphs
    const mockRestoData: RestaurantOrder[] = [
      { id: 'r1', type: 'Repas', mealType: 'PtDej', clientId: 'mock-1', clientName: 'Karim Tazi', aptNumber: 'N°1', site: 'Fnidaq', date: fmt(yesterday), time: '08:30', items: ['Eau'] },
      { id: 'r2', type: 'Repas', mealType: 'Dej', clientId: 'mock-1', clientName: 'Karim Tazi', aptNumber: 'N°1', site: 'Fnidaq', date: fmt(yesterday), time: '13:00', items: ['Soda'] },
      { id: 'r3', type: 'Repas', mealType: 'Diner', clientId: 'mock-1', clientName: 'Karim Tazi', aptNumber: 'N°1', site: 'Fnidaq', date: fmt(dayBefore), time: '20:00', items: ['Jus'] },
      { id: 'r4', type: 'Repas', mealType: 'PtDej', clientId: 'mock-1', clientName: 'Karim Tazi', aptNumber: 'N°1', site: 'Fnidaq', date: fmt(dayBefore), time: '09:00', items: [] },
    ];
    setRestaurantOrders(mockRestoData);
    
    // Set initial meal service based on hour
    const hour = new Date().getHours();
    if (hour < 11) setCurrentMealService('PtDej');
    else if (hour < 15) setCurrentMealService('Dej');
    else if (hour < 18) setCurrentMealService('Gouter');
    else setCurrentMealService('Diner');
  }, []);

  // --- Handlers ---
  const handleStockUpdate = (index: number, change: number) => {
    const newStock = [...stockItems];
    if (newStock[index].quantite + change >= 0) {
      newStock[index].quantite += change;
      setStockItems(newStock);
    }
  };

  const handleStatusChange = (index: number) => {
    const newOrders = [...chefOrders];
    const current = newOrders[index].statut;
    if (current === 'En attente') newOrders[index].statut = 'En cours';
    else if (current === 'En cours') newOrders[index].statut = 'Livré';
    else if (current === 'Livré') newOrders[index].statut = 'En attente';
    setChefOrders(newOrders);
  };

  const handleAddProduct = () => {
    if (newProduct.nom && newProduct.cat) {
      setStockItems([...stockItems, { ...newProduct, seuilCritique: 5 }]); // Default seuil
      setNewProduct({ nom: '', cat: '', quantite: 0, unite: '', prix: 0 });
      setShowAddForm(false);
    }
  };

  const handleAddOrder = () => {
    if (newOrder.produit && newOrder.quantite > 0) {
      const today = new Date().toISOString().split('T')[0];
      setChefOrders([{ ...newOrder, statut: 'En attente', date: today }, ...chefOrders]);
      setNewOrder({ produit: '', quantite: 1 });
      setShowAddForm(false);
    }
  };

  // --- Meal Planning Handlers ---
  const handleAddDish = () => {
    if(newDish.name && newDish.cost && newDish.ingredients) {
      const dish: Dish = {
        id: Date.now().toString(),
        name: newDish.name || 'Sans nom',
        category: newDish.category as MealType,
        ingredients: newDish.ingredients || '',
        cost: Number(newDish.cost)
      };
      setDishes([...dishes, dish]);
      setNewDish({ category: 'PtDej', cost: 0, name: '', ingredients: '' });
      setShowDishForm(false);
    }
  };

  const handleAssignDish = (dishId: string) => {
    if (editingSlot) {
      setWeeklyPlan({
        ...weeklyPlan,
        [editingSlot.day]: {
          ...weeklyPlan[editingSlot.day],
          [editingSlot.type]: dishId
        }
      });
      setEditingSlot(null);
    }
  };

  const getDish = (id?: string) => dishes.find(d => d.id === id);

  // --- Apartment Handlers ---
  const handleCheckIn = () => {
    if (selectedApt && newClient.name && newClient.date) {
      const updatedApts = apartments.map(apt => {
        if (apt.id === selectedApt.id) {
          // Logic: Lock type if clients exist, otherwise allow new type
          const currentOccupancy = apt.currentClients.length;
          const roomType = currentOccupancy > 0 ? apt.currentClients[0].type : newClient.type;
          const maxOccupants = getMaxOccupants(roomType);

          if (currentOccupancy >= maxOccupants) {
             alert(`Cet appartement est plein (${maxOccupants} pers max pour ${roomType}).`);
             return apt;
          }

          const clientToAdd: Client = {
            id: Date.now().toString(),
            name: newClient.name,
            entryDate: newClient.date,
            type: roomType
          };

          return {
            ...apt,
            currentClients: [...apt.currentClients, clientToAdd]
          };
        }
        return apt;
      });
      setApartments(updatedApts);
      setShowCheckInModal(false);
      setNewClient({ name: '', date: new Date().toISOString().split('T')[0], type: '1/4' });
    }
  };

  const handleCheckOut = (clientId: string) => {
    if (selectedApt) {
      const leaveDate = new Date().toISOString().split('T')[0];
      const clientToRemove = selectedApt.currentClients.find(c => c.id === clientId);

      if(!clientToRemove) return;

      const historyEntry: ClientHistory = {
        clientName: clientToRemove.name,
        entryDate: clientToRemove.entryDate,
        leaveDate: leaveDate,
        type: clientToRemove.type
      };

      const updatedApts = apartments.map(apt => {
        if (apt.id === selectedApt.id) {
          return {
            ...apt,
            currentClients: apt.currentClients.filter(c => c.id !== clientId),
            history: [historyEntry, ...apt.history]
          };
        }
        return apt;
      });
      
      setApartments(updatedApts);
      
      // Update the selected apartment in modal view as well
      const updatedSelectedApt = updatedApts.find(a => a.id === selectedApt.id) || null;
      setSelectedApt(updatedSelectedApt);
    }
  };

  // --- Blanchisserie Handlers ---
  const handleAddLaundryOrder = () => {
    if (!newLaundryOrder.apartmentId || !newLaundryOrder.clientId || !newLaundryOrder.items) return;

    const apt = apartments.find(a => a.id === newLaundryOrder.apartmentId);
    const client = apt?.currentClients.find(c => c.id === newLaundryOrder.clientId);

    if (apt && client) {
      const order: LaundryOrder = {
        id: Date.now().toString(),
        clientId: client.id,
        clientName: client.name,
        apartmentNumber: apt.number,
        site: apt.site,
        items: newLaundryOrder.items,
        date: new Date().toISOString().split('T')[0],
        status: 'En attente'
      };
      setLaundryOrders([order, ...laundryOrders]);
      setNewLaundryOrder({ apartmentId: '', clientId: '', items: '' });
      setShowLaundryForm(false);
    }
  };

  const updateLaundryStatus = (id: string, newStatus: LaundryStatus) => {
    const updated = laundryOrders.map(o => o.id === id ? { ...o, status: newStatus } : o);
    setLaundryOrders(updated);
  };

  // --- Restaurant Handlers ---
  const handleValidateRestoOrder = () => {
    if (!newRestoOrder.clientId) return;

    // Find client details
    let foundClient: Client | undefined;
    let foundApt: Apartment | undefined;

    for (const apt of apartments) {
      const c = apt.currentClients.find(cl => cl.id === newRestoOrder.clientId);
      if (c) {
        foundClient = c;
        foundApt = apt;
        break;
      }
    }

    if (foundClient && foundApt) {
      const now = new Date();
      const order: RestaurantOrder = {
        id: Date.now().toString(),
        type: newRestoOrder.isDrinkOnly ? 'Boisson' : 'Repas',
        mealType: newRestoOrder.isDrinkOnly ? undefined : currentMealService,
        clientId: foundClient.id,
        clientName: foundClient.name,
        aptNumber: foundApt.number,
        site: foundApt.site,
        date: now.toISOString().split('T')[0],
        time: now.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}),
        items: newRestoOrder.drinks
      };

      setRestaurantOrders([order, ...restaurantOrders]);
      setShowBonModal(order);
      setNewRestoOrder({ clientId: '', drinks: [], isDrinkOnly: false });
    }
  };

  // --- Employee Handlers ---
  const handleAddEmployee = () => {
    if(newEmployee.name && newEmployee.function && newEmployee.monthlySalary) {
      setEmployees([...employees, {
        id: Date.now().toString(),
        name: newEmployee.name,
        function: newEmployee.function,
        phone: newEmployee.phone || '',
        shift: newEmployee.shift as 'Matin'|'Soir'|'Jour',
        monthlySalary: Number(newEmployee.monthlySalary),
        lastMonthSalary: Number(newEmployee.monthlySalary), // Default assumption
        absences: 0,
        status: 'Présent'
      }]);
      setShowEmployeeForm(false);
      setNewEmployee({ shift: 'Jour', monthlySalary: 0, name: '', function: '', phone: '' });
    }
  };

  const updateEmployeeStatus = (id: string, status: 'Présent' | 'Absent' | 'Retard') => {
    setEmployees(employees.map(e => e.id === id ? { ...e, status } : e));
  };

  const updateEmployeeAbsences = (id: string, absences: number) => {
    setEmployees(employees.map(e => e.id === id ? { ...e, absences } : e));
  };

  // --- Caisse Handlers ---
  const handleAddFund = () => {
    if (!newFundAmount) return;
    const amount = parseFloat(newFundAmount);
    if (isNaN(amount) || amount <= 0) return;

    const newFund: CashFund = {
      id: Date.now().toString(),
      amount,
      date: new Date().toISOString().split('T')[0],
      addedBy: user?.username || 'Boss'
    };

    setCashFunds([...cashFunds, newFund]);
    setNewFundAmount('');
    setShowFundForm(false);
  };

  const handleAddExpense = () => {
    if (!newExpense.amount || !newExpense.category) return;
    const amount = parseFloat(newExpense.amount);
    if (isNaN(amount) || amount <= 0) return;

    const expense: CashExpense = {
      id: Date.now().toString(),
      category: newExpense.category,
      amount,
      observation: newExpense.observation,
      date: new Date().toISOString().split('T')[0],
      addedBy: user?.username || 'Gérant'
    };

    setCashExpenses([...cashExpenses, expense]);
    setNewExpense({ category: '', amount: '', observation: '' });
    setShowExpenseForm(false);
  };

  const handleExport = (type: 'pdf' | 'excel') => {
    if (type === 'pdf') {
      window.print();
    } else {
      // Mock Excel Export
      const csvContent = "data:text/csv;charset=utf-8,Type,Date,Montant\nRevenus,2025-01-01,15000\nDepenses,2025-01-01,5000";
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "rapport_financier.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Calculate Search Results (Combines current clients AND history)
  const searchResults = useMemo(() => {
    if (!clientSearchQuery) return [];
    
    const results: {
      id: string; 
      clientName: string;
      type: HebergementType;
      entryDate: string;
      leaveDate: string;
      status: 'En cours' | 'Terminé';
      aptNumber: string;
      building: string;
      site: string;
      apt: Apartment;
    }[] = [];

    apartments.forEach(apt => {
      // Check current clients
      apt.currentClients.forEach(c => {
         if (c.name.toLowerCase().includes(clientSearchQuery.toLowerCase())) {
            results.push({
              id: `${apt.id}-${c.id}`,
              clientName: c.name,
              type: c.type,
              entryDate: c.entryDate,
              leaveDate: '-',
              status: 'En cours',
              aptNumber: apt.number,
              building: apt.building,
              site: apt.site,
              apt: apt
            });
         }
      });
      
      // Check history
      apt.history.forEach((h, idx) => {
        if (h.clientName.toLowerCase().includes(clientSearchQuery.toLowerCase())) {
          results.push({
            id: `${apt.id}-hist-${idx}`,
            clientName: h.clientName,
            type: h.type,
            entryDate: h.entryDate,
            leaveDate: h.leaveDate,
            status: 'Terminé',
            aptNumber: apt.number,
            building: apt.building,
            site: apt.site,
            apt: apt
          });
        }
      });
    });
    return results;
  }, [clientSearchQuery, apartments]);

  useEffect(() => {
    if (user) {
      if (user.role === UserRole.Boss) setCurrentSite('Vue Globale');
      else setCurrentSite(user.site || 'Non assigné');

      document.body.classList.remove(...ROLES.map(r => `role-${r.replace(' ', '')}`));
      const roleClass = `role-${user.role.replace(/\s/g, '')}`;
      document.body.classList.add(roleClass);
    }
  }, [user]);

  const handleThemeToggle = (isDark: boolean) => {
    if (isDark) {
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
    }
  };

  if (!user) return <Navigate to="/login" />;

  // --- View Renders ---

  const renderDashboardContent = () => {
    const occupiedCount = apartments.filter(a => a.currentClients.length > 0).length;
    
    if (user.role === UserRole.Boss || user.role === UserRole.Gerant) {
      // Mock data for brief report on dashboard
      const totalSalaries = employees.reduce((acc, emp) => {
        return acc + (emp.monthlySalary/30 * (30 - emp.absences));
      }, 0);
      const totalRevenue = revenueData.reduce((acc, d) => acc + d.revenu, 0);

      // Caisse Balance
      const totalFunds = cashFunds.reduce((acc, curr) => acc + curr.amount, 0);
      const totalExpenses = cashExpenses.reduce((acc, curr) => acc + curr.amount, 0);
      const caisseBalance = totalFunds - totalExpenses;

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          {/* Brief Report Widget */}
          <div className="dashboard-card col-span-1 lg:col-span-4 bg-gradient-to-r from-[var(--role-color)] to-gray-900 border-none shadow-xl relative overflow-hidden">
             <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
               <PieChartIcon size={200} />
             </div>
             <div className="relative z-10 flex justify-between items-end">
                <div>
                   <h3 className="text-xl font-bold text-white mb-2">Aperçu du Rapport Mensuel</h3>
                   <div className="flex gap-6 text-white/90">
                      <div>
                         <div className="text-xs uppercase opacity-70">Masse Salariale</div>
                         <div className="font-mono text-lg font-bold">{Math.round(totalSalaries).toLocaleString()} DH</div>
                      </div>
                      <div>
                         <div className="text-xs uppercase opacity-70">Chiffre d'Affaires (7j)</div>
                         <div className="font-mono text-lg font-bold">{totalRevenue.toLocaleString()} DH</div>
                      </div>
                      <div>
                         <div className="text-xs uppercase opacity-70">Taux Occupation</div>
                         <div className="font-mono text-lg font-bold">{Math.round((occupiedCount / apartments.length) * 100)}%</div>
                      </div>
                   </div>
                </div>
                <Button 
                  onClick={() => setActiveMenu('Rapports')} 
                  className="w-auto bg-white/20 hover:bg-white/30 text-white border border-white/40"
                >
                  Voir Rapport Complet →
                </Button>
             </div>
          </div>

          {/* Standard Widgets */}
          <StatWidget title="Solde Caisse" value={`${caisseBalance.toLocaleString()} DH`} subtext="Disponible maintenant" icon={Wallet} trend={caisseBalance > 0 ? "up" : "down"} />
          <StatWidget title="Revenu du jour" value="2,250 DH" subtext="+12% vs hier" icon={TrendingUp} trend="up" />
          <StatWidget title="Taux d'occupation" value={`${Math.round((occupiedCount / apartments.length) * 100)}%`} subtext={`${occupiedCount}/${apartments.length} appts`} icon={Users} trend="neutral" />
          <StatWidget title="Commandes Chef" value="5 En cours" subtext="Besoin validation" icon={ShoppingCart} trend="neutral" />

          {/* Charts Row */}
          <RevenueChartWidget data={revenueData} />
          <OccupancyChartWidget />

          {/* Interactive Operational Row */}
          <InteractiveStockWidget items={stockItems} onUpdate={handleStockUpdate} />
          <InteractiveOrdersWidget orders={chefOrders} onStatusChange={handleStatusChange} />
        </div>
      );
    } 
    
    if (user.role === UserRole.ChefCuisine || user.role === UserRole.Magasinier) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StatWidget title="Stock Cuisine" value={`${stockItems.length} Articles`} subtext="Mise à jour requise" icon={Package} trend="neutral" />
          <StatWidget title="Commandes" value={chefOrders.filter(o => o.statut !== 'Livré').length} subtext="En attente/cours" icon={Clock} trend="down" />
          <StatWidget title="Bons Consommés" value="12" subtext="Aujourd'hui" icon={CheckCircle} trend="up" />

          <InteractiveStockWidget items={stockItems} onUpdate={handleStockUpdate} />
          <InteractiveOrdersWidget orders={chefOrders} onStatusChange={handleStatusChange} />
        </div>
      );
    }

    if (user.role === UserRole.Reception) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <OccupancyChartWidget />
           <div className="dashboard-card col-span-2">
             <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--text-main)' }}>📅 Arrivées du jour</h3>
             {/* Dynamic list from apartments */}
             <div className="space-y-4">
                {apartments.filter(a => a.currentClients.some(c => c.entryDate === new Date().toISOString().split('T')[0])).length === 0 ? (
                  <p className="text-gray-500 italic">Aucune arrivée enregistrée aujourd'hui.</p>
                ) : (
                  apartments.map(apt => {
                    const newArrivals = apt.currentClients.filter(c => c.entryDate === new Date().toISOString().split('T')[0]);
                    if (newArrivals.length === 0) return null;
                    return newArrivals.map(c => (
                      <div key={c.id} className="flex justify-between items-center p-3 border rounded border-gray-700/30">
                        <span style={{ color: 'var(--text-main)' }}>{c.name} ({apt.number})</span>
                        <span className="px-3 py-1 bg-green-600 text-white text-xs rounded">Arrivé</span>
                      </div>
                    ));
                  })
                )}
             </div>
           </div>
        </div>
      );
    }

    if (user.role === UserRole.Caissier) {
      return (
        <div className="grid grid-cols-1 gap-6">
          <div className="dashboard-card text-center py-10">
            <Utensils size={48} className="mx-auto mb-4 text-[var(--role-color)]"/>
            <h3 className="text-xl font-bold mb-2 text-[var(--text-main)]">Bienvenue au module Caisse</h3>
            <p className="text-gray-500 mb-6">Utilisez le menu pour gérer les repas et la présence.</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => setActiveMenu('Bons de restauration')} className="w-auto px-8">Bons de Restauration</Button>
              <Button onClick={() => setActiveMenu('Présence')} className="w-auto px-8 bg-purple-600 hover:bg-purple-700">Pointage Employés</Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="dashboard-card default">
        <p>Vue simplifiée pour {user.role}</p>
      </div>
    );
  };

  const renderCaisse = () => {
    // Calcul du solde
    const totalFunds = cashFunds.reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpenses = cashExpenses.reduce((acc, curr) => acc + curr.amount, 0);
    const currentBalance = totalFunds - totalExpenses;

    const isBoss = user.role === UserRole.Boss;
    const isGerant = user.role === UserRole.Gerant || user.role === UserRole.Boss; 

    return (
      <div className="space-y-6 animate-fade-in">
        {/* --- Top Balance Card --- */}
        <div className="dashboard-card bg-gradient-to-r from-gray-800 to-gray-900 border-none relative overflow-hidden">
           <div className="absolute right-0 top-0 opacity-10 p-4">
             <Wallet size={120} />
           </div>
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                 <h3 className="text-gray-400 font-medium uppercase text-sm mb-1">Solde Actuel de la Caisse</h3>
                 <div className={`text-4xl font-mono font-bold ${currentBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                   {currentBalance.toLocaleString()} DH
                 </div>
                 <div className="flex gap-4 mt-2 text-sm text-gray-400">
                    <span className="flex items-center"><TrendingUp size={14} className="text-green-500 mr-1"/> Entrées: {totalFunds.toLocaleString()}</span>
                    <span className="flex items-center"><TrendingDown size={14} className="text-red-500 mr-1"/> Dépenses: {totalExpenses.toLocaleString()}</span>
                 </div>
              </div>
              
              <div className="flex gap-4">
                 {isBoss && (
                   <button 
                     onClick={() => setShowFundForm(true)}
                     className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
                   >
                     <Plus size={20}/> Ajouter Fond
                   </button>
                 )}
                 {isGerant && (
                   <button 
                     onClick={() => setShowExpenseForm(true)}
                     className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
                   >
                     <Minus size={20}/> Ajouter Dépense
                   </button>
                 )}
              </div>
           </div>
        </div>

        {/* --- Modals --- */}
        {showFundForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
             <div className="bg-[var(--bg-card)] p-6 rounded-xl shadow-2xl w-full max-w-sm border border-green-500/50 relative">
                <button onClick={() => setShowFundForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20}/></button>
                <h3 className="text-xl font-bold mb-4 text-[var(--text-main)] flex items-center gap-2"><Banknote className="text-green-500"/> Nouveau Fond</h3>
                
                <div className="space-y-4">
                   <Input 
                     label="Montant (DH)" 
                     type="number"
                     autoFocus
                     value={newFundAmount}
                     onChange={(e) => setNewFundAmount(e.target.value)}
                   />
                   <Button onClick={handleAddFund} className="bg-green-600 hover:bg-green-700">Confirmer Ajout</Button>
                </div>
             </div>
          </div>
        )}

        {showExpenseForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
             <div className="bg-[var(--bg-card)] p-6 rounded-xl shadow-2xl w-full max-w-sm border border-red-500/50 relative">
                <button onClick={() => setShowExpenseForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20}/></button>
                <h3 className="text-xl font-bold mb-4 text-[var(--text-main)] flex items-center gap-2"><CreditCard className="text-red-500"/> Nouvelle Dépense</h3>
                
                <div className="space-y-4">
                   <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Catégorie</label>
                      <select 
                        className="w-full p-[14px] border border-gray-300 rounded-lg bg-[#fefefe] text-gray-800 outline-none"
                        value={newExpense.category}
                        onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                      >
                        <option value="">Sélectionner...</option>
                        <option value="Gazoil">Gazoil</option>
                        <option value="Courses">Courses Alimentaires</option>
                        <option value="Maintenance">Maintenance / Réparation</option>
                        <option value="Autre">Autre</option>
                      </select>
                   </div>
                   <Input 
                     label="Montant (DH)" 
                     type="number"
                     value={newExpense.amount}
                     onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                   />
                   <Input 
                     label="Observation / Détails" 
                     placeholder="Ex: Plein du véhicule Berlingo..."
                     value={newExpense.observation}
                     onChange={(e) => setNewExpense({...newExpense, observation: e.target.value})}
                   />
                   <Button onClick={handleAddExpense} className="bg-red-600 hover:bg-red-700">Enregistrer Sortie</Button>
                </div>
             </div>
          </div>
        )}

        {/* --- History Tables --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* Fonds History */}
           <div className="dashboard-card">
              <h3 className="font-bold text-lg mb-4 text-[var(--text-main)] border-b border-gray-700 pb-2 flex items-center gap-2">
                <TrendingUp size={18} className="text-green-500"/> Historique des Fonds (Entrées)
              </h3>
              <div className="overflow-y-auto max-h-[400px] custom-scrollbar">
                 <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase text-gray-500 bg-black/10 sticky top-0">
                       <tr>
                          <th className="px-4 py-2">Date</th>
                          <th className="px-4 py-2">Ajouté par</th>
                          <th className="px-4 py-2 text-right">Montant</th>
                       </tr>
                    </thead>
                    <tbody>
                       {[...cashFunds].reverse().map(fund => (
                          <tr key={fund.id} className="border-b border-gray-700/10 hover:bg-white/5">
                             <td className="px-4 py-3 font-mono text-gray-400">{fund.date}</td>
                             <td className="px-4 py-3">{fund.addedBy}</td>
                             <td className="px-4 py-3 text-right font-bold text-green-400">+{fund.amount.toLocaleString()} DH</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Expenses History */}
           <div className="dashboard-card">
              <h3 className="font-bold text-lg mb-4 text-[var(--text-main)] border-b border-gray-700 pb-2 flex items-center gap-2">
                <TrendingDown size={18} className="text-red-500"/> Historique des Dépenses (Sorties)
              </h3>
              <div className="overflow-y-auto max-h-[400px] custom-scrollbar">
                 <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase text-gray-500 bg-black/10 sticky top-0">
                       <tr>
                          <th className="px-4 py-2">Date</th>
                          <th className="px-4 py-2">Motif</th>
                          <th className="px-4 py-2 text-right">Montant</th>
                       </tr>
                    </thead>
                    <tbody>
                       {[...cashExpenses].reverse().map(exp => (
                          <tr key={exp.id} className="border-b border-gray-700/10 hover:bg-white/5">
                             <td className="px-4 py-3 font-mono text-gray-400">{exp.date}</td>
                             <td className="px-4 py-3">
                                <div className="font-bold text-[var(--text-main)]">{exp.category}</div>
                                <div className="text-xs text-gray-500">{exp.observation}</div>
                                <div className="text-[10px] text-gray-600 mt-0.5">Par: {exp.addedBy}</div>
                             </td>
                             <td className="px-4 py-3 text-right font-bold text-red-400">-{exp.amount.toLocaleString()} DH</td>
                          </tr>
                       ))}
                       {cashExpenses.length === 0 && (
                         <tr><td colSpan={3} className="text-center py-4 text-gray-500 italic">Aucune dépense enregistrée.</td></tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>
    );
  };

  const renderReports = () => (
    <div className="space-y-6 animate-fade-in">
       <div className="flex justify-between items-center">
          <h3 className="font-bold text-xl text-[var(--text-main)]">📊 Rapports & Statistiques</h3>
          <div className="flex gap-2">
             <Button onClick={() => handleExport('excel')} variant="secondary" className="w-auto px-4 text-sm flex items-center gap-2">
                <FileSpreadsheet size={16}/> Exporter Excel
             </Button>
             <Button onClick={() => handleExport('pdf')} className="w-auto px-4 text-sm flex items-center gap-2">
                <Download size={16}/> PDF
             </Button>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="dashboard-card h-[400px]">
             <h4 className="font-bold mb-4">Évolution Revenus vs Dépenses</h4>
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                   <CartesianGrid strokeDasharray="3 3" opacity={0.1}/>
                   <XAxis dataKey="name" stroke="#888"/>
                   <YAxis stroke="#888"/>
                   <RechartsTooltip contentStyle={{backgroundColor: '#333', border: 'none', color: '#fff'}}/>
                   <Area type="monotone" dataKey="revenu" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                </AreaChart>
             </ResponsiveContainer>
          </div>
          
          <div className="dashboard-card h-[400px]">
             <h4 className="font-bold mb-4">Répartition des Coûts</h4>
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                   <Pie 
                     data={[
                       {name: 'Salaires', value: employees.reduce((a, b) => a + b.monthlySalary, 0), color: '#3b82f6'},
                       {name: 'Courses', value: cashExpenses.filter(e => e.category === 'Courses').reduce((a, b) => a + b.amount, 0), color: '#ef4444'},
                       {name: 'Maintenance', value: cashExpenses.filter(e => e.category === 'Maintenance').reduce((a, b) => a + b.amount, 0), color: '#f59e0b'},
                       {name: 'Autres', value: 1000, color: '#6b7280'}
                     ]}
                     cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value"
                   >
                     {[
                       {name: 'Salaires', value: employees.reduce((a, b) => a + b.monthlySalary, 0), color: '#3b82f6'},
                       {name: 'Courses', value: cashExpenses.filter(e => e.category === 'Courses').reduce((a, b) => a + b.amount, 0), color: '#ef4444'},
                       {name: 'Maintenance', value: cashExpenses.filter(e => e.category === 'Maintenance').reduce((a, b) => a + b.amount, 0), color: '#f59e0b'},
                       {name: 'Autres', value: 1000, color: '#6b7280'}
                     ].map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                   <RechartsTooltip />
                   <Legend />
                </PieChart>
             </ResponsiveContainer>
          </div>
       </div>
    </div>
  );

  const renderStockManagement = () => (
    <div className="animate-fade-in space-y-6">
       <div className="flex justify-between items-center">
         <h3 className="font-bold text-xl text-[var(--text-main)]">📦 Gestion de Stock</h3>
         <Button onClick={() => setShowAddForm(true)} className="w-auto px-4 flex items-center gap-2">
           <Plus size={18} /> Ajouter Produit
         </Button>
       </div>
       
       {showAddForm && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-[var(--bg-card)] p-6 rounded-xl shadow-2xl w-full max-w-sm relative border border-gray-700">
               <button onClick={() => setShowAddForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20}/></button>
               <h3 className="text-xl font-bold mb-4 text-[var(--text-main)]">Nouveau Produit</h3>
               <div className="space-y-4">
                 <Input label="Nom" value={newProduct.nom} onChange={e => setNewProduct({...newProduct, nom: e.target.value})} />
                 <Input label="Catégorie" value={newProduct.cat} onChange={e => setNewProduct({...newProduct, cat: e.target.value})} />
                 <Input label="Quantité Initiale" type="number" value={newProduct.quantite} onChange={e => setNewProduct({...newProduct, quantite: parseInt(e.target.value)})} />
                 <Input label="Prix Unitaire (DH)" type="number" value={newProduct.prix} onChange={e => setNewProduct({...newProduct, prix: parseFloat(e.target.value)})} />
                 <Button onClick={handleAddProduct}>Enregistrer</Button>
               </div>
            </div>
         </div>
       )}

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stockItems.map((item, idx) => (
             <div key={idx} className="dashboard-card relative overflow-hidden group hover:border-[var(--role-color)] transition-all">
                <div className={`absolute top-0 right-0 p-2 rounded-bl-lg text-xs font-bold text-white ${item.quantite <= item.seuilCritique ? 'bg-red-500' : 'bg-green-500'}`}>
                   {item.quantite <= item.seuilCritique ? 'Stock Faible' : 'En Stock'}
                </div>
                <h4 className="font-bold text-lg mb-1 text-[var(--text-main)]">{item.nom}</h4>
                <p className="text-sm text-gray-500 mb-4">{item.cat} • {item.prix} DH/u</p>
                
                <div className="flex items-center justify-between bg-black/10 p-2 rounded-lg">
                   <button onClick={() => handleStockUpdate(idx, -1)} className="p-2 hover:bg-white/10 rounded-full text-[var(--text-main)]"><Minus size={16}/></button>
                   <span className="font-mono font-bold text-xl text-[var(--text-main)]">{item.quantite} <span className="text-xs font-normal text-gray-500">{item.unite}</span></span>
                   <button onClick={() => handleStockUpdate(idx, 1)} className="p-2 hover:bg-white/10 rounded-full text-[var(--text-main)]"><Plus size={16}/></button>
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  const renderMealPlanning = () => (
     <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
           <h3 className="font-bold text-xl text-[var(--text-main)]">🍽️ Planning des Repas</h3>
           <Button onClick={() => setShowDishForm(true)} className="w-auto px-4 flex items-center gap-2">
              <Plus size={18} /> Nouveau Plat
           </Button>
        </div>

        {/* Modal New Dish */}
        {showDishForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-[var(--bg-card)] p-6 rounded-xl shadow-2xl w-full max-w-sm relative border border-gray-700">
               <button onClick={() => setShowDishForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20}/></button>
               <h3 className="text-xl font-bold mb-4 text-[var(--text-main)]">Ajouter un Plat</h3>
               <div className="space-y-4">
                 <Input label="Nom du plat" value={newDish.name} onChange={e => setNewDish({...newDish, name: e.target.value})} />
                 <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Type</label>
                    <select className="w-full p-3 rounded bg-gray-100 dark:bg-gray-800 border-none" value={newDish.category} onChange={e => setNewDish({...newDish, category: e.target.value as MealType})}>
                       <option value="PtDej">Petit Déjeuner</option>
                       <option value="Dej">Déjeuner</option>
                       <option value="Gouter">Goûter</option>
                       <option value="Diner">Dîner</option>
                    </select>
                 </div>
                 <Input label="Ingrédients" value={newDish.ingredients} onChange={e => setNewDish({...newDish, ingredients: e.target.value})} />
                 <Input label="Coût Estimé (DH)" type="number" value={newDish.cost} onChange={e => setNewDish({...newDish, cost: parseFloat(e.target.value)})} />
                 <Button onClick={handleAddDish}>Ajouter au Menu</Button>
               </div>
            </div>
          </div>
        )}

        {/* Modal Select Dish for Slot */}
        {editingSlot && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
              <div className="bg-[var(--bg-card)] p-6 rounded-xl shadow-2xl w-full max-w-md relative border border-gray-700 max-h-[80vh] flex flex-col">
                 <button onClick={() => setEditingSlot(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20}/></button>
                 <h3 className="text-xl font-bold mb-4 text-[var(--text-main)]">Choisir pour {editingSlot.day} - {editingSlot.type}</h3>
                 <div className="overflow-y-auto custom-scrollbar flex-1 space-y-2">
                    {dishes.filter(d => d.category === editingSlot.type).map(dish => (
                       <div key={dish.id} onClick={() => handleAssignDish(dish.id)} className="p-3 bg-white/5 hover:bg-white/10 cursor-pointer rounded-lg flex justify-between items-center border border-transparent hover:border-[var(--role-color)] transition-all">
                          <div>
                             <div className="font-bold text-[var(--text-main)]">{dish.name}</div>
                             <div className="text-xs text-gray-500">{dish.ingredients}</div>
                          </div>
                          <div className="font-mono text-sm text-[var(--role-color)]">{dish.cost} DH</div>
                       </div>
                    ))}
                    {dishes.filter(d => d.category === editingSlot.type).length === 0 && (
                       <div className="text-center text-gray-500 py-4">Aucun plat disponible pour cette catégorie. Ajoutez-en un !</div>
                    )}
                 </div>
              </div>
           </div>
        )}

        {/* Weekly Grid */}
        <div className="overflow-x-auto pb-4">
           <table className="w-full text-sm">
              <thead>
                 <tr>
                    <th className="p-3 text-left min-w-[100px] text-[var(--text-main)]">Jour</th>
                    <th className="p-3 text-left min-w-[150px] text-[var(--text-main)]">Petit Déj</th>
                    <th className="p-3 text-left min-w-[150px] text-[var(--text-main)]">Déjeuner</th>
                    <th className="p-3 text-left min-w-[150px] text-[var(--text-main)]">Goûter</th>
                    <th className="p-3 text-left min-w-[150px] text-[var(--text-main)]">Dîner</th>
                 </tr>
              </thead>
              <tbody>
                 {Object.entries(weeklyPlan).map(([day, plan]) => (
                    <tr key={day} className="border-t border-gray-700/20">
                       <td className="p-3 font-bold text-[var(--text-main)]">{day}</td>
                       {(['PtDej', 'Dej', 'Gouter', 'Diner'] as MealType[]).map(type => {
                          const dishId = plan[type];
                          const dish = getDish(dishId);
                          return (
                             <td key={type} className="p-2">
                                <div 
                                  onClick={() => setEditingSlot({day, type})}
                                  className="min-h-[60px] p-2 rounded bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 cursor-pointer transition-colors border border-dashed border-gray-400/30 flex flex-col justify-center"
                                >
                                   {dish ? (
                                      <>
                                         <span className="font-medium text-[var(--text-main)] block truncate">{dish.name}</span>
                                         <span className="text-xs text-gray-500">{dish.cost} DH</span>
                                      </>
                                   ) : (
                                      <span className="text-xs text-gray-400 italic text-center">+ Ajouter</span>
                                   )}
                                </div>
                             </td>
                          );
                       })}
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
     </div>
  );

  const renderAppartements = () => (
    <div className="animate-fade-in space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="font-bold text-xl text-[var(--text-main)]">🏨 Gestion Appartements</h3>
          <div className="relative w-full md:w-64">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
             <input 
               type="text" 
               placeholder="Rechercher client..." 
               value={clientSearchQuery}
               onChange={(e) => setClientSearchQuery(e.target.value)}
               className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-[var(--role-color)] text-[var(--text-main)]"
             />
          </div>
       </div>

       {/* Search Results */}
       {clientSearchQuery && (
          <div className="dashboard-card mb-6 border border-[var(--role-color)]">
             <h4 className="font-bold mb-3 text-[var(--text-main)]">Résultats de recherche ({searchResults.length})</h4>
             <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
                {searchResults.map(res => (
                   <div key={res.id} onClick={() => { setSelectedApt(res.apt); setClientSearchQuery(''); }} className="p-3 rounded bg-black/5 dark:bg-white/5 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 flex justify-between items-center">
                      <div>
                         <div className="font-bold text-[var(--text-main)]">{res.clientName}</div>
                         <div className="text-xs text-gray-500">{res.aptNumber} - {res.building} ({res.site})</div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${res.status === 'En cours' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                         {res.status}
                      </div>
                   </div>
                ))}
                {searchResults.length === 0 && <div className="text-gray-500 italic">Aucun résultat trouvé.</div>}
             </div>
          </div>
       )}

       {/* Apartment Grid */}
       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {apartments.filter(a => user.role === UserRole.Boss || a.site === user.site).map(apt => {
             const isOccupied = apt.currentClients.length > 0;
             return (
               <div 
                 key={apt.id} 
                 onClick={() => setSelectedApt(apt)}
                 className={`
                    cursor-pointer p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-sm
                    ${isOccupied ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}
                 `}
               >
                  <div className="font-bold text-lg">{apt.number}</div>
                  <div className="text-xs opacity-90">{apt.currentClients.length}/{apt.capacity}</div>
                  <div className="text-[10px] uppercase tracking-wider font-semibold bg-black/20 px-2 py-0.5 rounded">
                     {isOccupied ? 'Occupé' : 'Libre'}
                  </div>
               </div>
             );
          })}
       </div>

       {/* Apartment Detail Modal */}
       {selectedApt && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
             <div className="bg-[var(--bg-card)] p-6 rounded-xl shadow-2xl w-full max-w-lg relative border border-gray-700 max-h-[90vh] overflow-y-auto">
                <button onClick={() => setSelectedApt(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20}/></button>
                
                <h3 className="text-2xl font-bold mb-1 text-[var(--text-main)]">{selectedApt.number} <span className="text-base font-normal text-gray-500">({selectedApt.building})</span></h3>
                <div className="flex gap-2 mb-6">
                   <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs">{selectedApt.site}</span>
                   <span className="px-2 py-1 rounded bg-gray-100 text-gray-800 text-xs">Capacité: {selectedApt.capacity}</span>
                </div>

                <div className="space-y-6">
                   {/* Current Occupants */}
                   <div>
                      <h4 className="font-bold text-sm uppercase text-gray-500 mb-2">Occupants Actuels</h4>
                      {selectedApt.currentClients.length > 0 ? (
                         <div className="space-y-2">
                            {selectedApt.currentClients.map(client => (
                               <div key={client.id} className="bg-black/5 dark:bg-white/5 p-3 rounded-lg flex justify-between items-center">
                                  <div>
                                     <div className="font-bold text-[var(--text-main)]">{client.name}</div>
                                     <div className="text-xs text-gray-500">Depuis: {client.entryDate} • Type: {client.type}</div>
                                  </div>
                                  <button 
                                    onClick={() => { if(window.confirm('Confirmer le départ ?')) handleCheckOut(client.id); }}
                                    className="text-red-500 hover:bg-red-500/10 p-2 rounded transition"
                                    title="Check-out"
                                  >
                                     <LogOut size={18}/>
                                  </button>
                               </div>
                            ))}
                         </div>
                      ) : (
                         <div className="text-gray-500 italic p-4 text-center border border-dashed border-gray-600 rounded-lg">Appartement vide</div>
                      )}
                      
                      {selectedApt.currentClients.length < selectedApt.capacity && (
                         <Button onClick={() => setShowCheckInModal(true)} className="mt-4 w-full bg-[var(--role-color)]">
                            <UserPlus size={18} className="mr-2"/> Nouveau Check-in
                         </Button>
                      )}
                   </div>

                   {/* History */}
                   <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-sm uppercase text-gray-500">Historique</h4>
                      </div>
                      <div className="max-h-40 overflow-y-auto custom-scrollbar border-t border-gray-700/20 pt-2">
                         {selectedApt.history.length > 0 ? (
                            selectedApt.history.map((h, i) => (
                               <div key={i} className="py-2 border-b border-gray-700/10 text-sm">
                                  <div className="flex justify-between">
                                     <span className="font-medium text-[var(--text-main)]">{h.clientName}</span>
                                     <span className="text-xs text-gray-500">{h.type}</span>
                                  </div>
                                  <div className="text-xs text-gray-500">{h.entryDate} ➔ {h.leaveDate}</div>
                               </div>
                            ))
                         ) : (
                            <div className="text-xs text-gray-500 italic">Aucun historique récent.</div>
                         )}
                      </div>
                   </div>
                </div>
             </div>
          </div>
       )}

       {/* Check In Modal */}
       {showCheckInModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
             <div className="bg-[var(--bg-card)] p-6 rounded-xl shadow-2xl w-full max-w-sm relative border border-gray-700">
                <button onClick={() => setShowCheckInModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20}/></button>
                <h3 className="text-xl font-bold mb-4 text-[var(--text-main)]">Nouveau Client</h3>
                <div className="space-y-4">
                   <Input 
                     label="Nom Complet" 
                     value={newClient.name}
                     onChange={e => setNewClient({...newClient, name: e.target.value})}
                   />
                   <Input 
                     label="Date d'entrée" 
                     type="date"
                     value={newClient.date}
                     onChange={e => setNewClient({...newClient, date: e.target.value})}
                   />
                   <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Type d'hébergement</label>
                      <select 
                        className="w-full p-3 rounded bg-gray-100 dark:bg-gray-800 border-none text-[var(--text-main)]"
                        value={newClient.type}
                        onChange={e => setNewClient({...newClient, type: e.target.value as HebergementType})}
                      >
                         <option value="1/4">1/4 (4 pers max)</option>
                         <option value="1/3">1/3 (3 pers max)</option>
                         <option value="1/2">1/2 (2 pers max)</option>
                         <option value="1/1">1/1 (Individuel)</option>
                      </select>
                   </div>
                   <Button onClick={handleCheckIn}>Confirmer Entrée</Button>
                </div>
             </div>
          </div>
       )}
    </div>
  );

  const renderBlanchisserie = () => (
    <div className="animate-fade-in space-y-6">
       <div className="flex justify-between items-center">
          <h3 className="font-bold text-xl text-[var(--text-main)]">🧺 Blanchisserie</h3>
          <Button onClick={() => setShowLaundryForm(true)} className="w-auto px-4 flex items-center gap-2">
             <Plus size={18} /> Nouvelle Demande
          </Button>
       </div>

       {showLaundryForm && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-[var(--bg-card)] p-6 rounded-xl shadow-2xl w-full max-w-sm relative border border-gray-700">
               <button onClick={() => setShowLaundryForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20}/></button>
               <h3 className="text-xl font-bold mb-4 text-[var(--text-main)]">Déposer Linge</h3>
               
               <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Appartement</label>
                    <select 
                      className="w-full p-3 rounded bg-gray-100 dark:bg-gray-800 border-none text-[var(--text-main)]"
                      value={newLaundryOrder.apartmentId}
                      onChange={e => setNewLaundryOrder({...newLaundryOrder, apartmentId: e.target.value, clientId: ''})}
                    >
                       <option value="">Choisir...</option>
                       {apartments.filter(a => a.currentClients.length > 0 && (user.role === UserRole.Boss || a.site === user.site)).map(apt => (
                          <option key={apt.id} value={apt.id}>{apt.number} ({apt.currentClients.length} clients)</option>
                       ))}
                    </select>
                 </div>
                 
                 {newLaundryOrder.apartmentId && (
                   <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Client</label>
                      <select 
                        className="w-full p-3 rounded bg-gray-100 dark:bg-gray-800 border-none text-[var(--text-main)]"
                        value={newLaundryOrder.clientId}
                        onChange={e => setNewLaundryOrder({...newLaundryOrder, clientId: e.target.value})}
                      >
                         <option value="">Choisir...</option>
                         {apartments.find(a => a.id === newLaundryOrder.apartmentId)?.currentClients.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                         ))}
                      </select>
                   </div>
                 )}

                 <Input 
                   label="Description Articles" 
                   placeholder="Ex: 2 Chemises, 1 Pantalon..."
                   value={newLaundryOrder.items}
                   onChange={e => setNewLaundryOrder({...newLaundryOrder, items: e.target.value})}
                 />

                 <Button onClick={handleAddLaundryOrder}>Valider Dépôt</Button>
               </div>
            </div>
         </div>
       )}

       {/* Orders List */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {laundryOrders.map(order => (
             <div key={order.id} className="dashboard-card border-l-4 border-l-[var(--role-color)]">
                <div className="flex justify-between items-start mb-2">
                   <div>
                      <div className="font-bold text-[var(--text-main)]">{order.clientName}</div>
                      <div className="text-xs text-gray-500">{order.apartmentNumber} • {order.site}</div>
                   </div>
                   <div className="text-xs text-gray-400">{order.date}</div>
                </div>
                <div className="bg-black/5 dark:bg-white/5 p-2 rounded text-sm mb-4 min-h-[40px] text-[var(--text-main)]">
                   {order.items}
                </div>
                
                <div className="flex flex-col gap-2">
                   <div className="text-xs font-semibold uppercase text-gray-500">Statut</div>
                   <div className="flex gap-1 flex-wrap">
                      {(['En attente', 'En blanchisserie', 'En réception', 'Livré'] as LaundryStatus[]).map(status => (
                         <button 
                           key={status}
                           onClick={() => updateLaundryStatus(order.id, status)}
                           className={`px-2 py-1 text-[10px] rounded border transition-colors
                             ${order.status === status 
                               ? 'bg-[var(--role-color)] text-white border-[var(--role-color)]' 
                               : 'bg-transparent text-gray-500 border-gray-600 hover:border-gray-400'}
                           `}
                         >
                            {status}
                         </button>
                      ))}
                   </div>
                </div>
             </div>
          ))}
          {laundryOrders.length === 0 && (
             <div className="col-span-full text-center py-10 text-gray-500 opacity-60">
                <Shirt size={48} className="mx-auto mb-2"/>
                Aucune commande de blanchisserie en cours.
             </div>
          )}
       </div>
    </div>
  );

  const renderRestaurant = () => (
    <div className="animate-fade-in space-y-6">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Taking Form */}
          <div className="dashboard-card col-span-1 lg:col-span-1 border border-[var(--role-color)]">
             <h3 className="font-bold text-lg mb-4 text-[var(--text-main)] flex items-center gap-2">
                <Utensils size={18} /> Prise de Commande
             </h3>
             
             <div className="space-y-4">
                <div className="flex gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                   <button 
                     onClick={() => setNewRestoOrder({...newRestoOrder, isDrinkOnly: false})}
                     className={`flex-1 py-2 text-sm rounded font-medium transition ${!newRestoOrder.isDrinkOnly ? 'bg-white text-black shadow' : 'text-gray-500'}`}
                   >
                      Repas
                   </button>
                   <button 
                     onClick={() => setNewRestoOrder({...newRestoOrder, isDrinkOnly: true})}
                     className={`flex-1 py-2 text-sm rounded font-medium transition ${newRestoOrder.isDrinkOnly ? 'bg-white text-black shadow' : 'text-gray-500'}`}
                   >
                      Boisson Seule
                   </button>
                </div>

                {!newRestoOrder.isDrinkOnly && (
                   <div className="p-3 bg-green-500/10 border border-green-500/30 rounded text-center">
                      <div className="text-xs uppercase text-green-600 font-bold mb-1">Service Actuel</div>
                      <div className="text-lg font-bold text-green-700">{currentMealService === 'PtDej' ? 'Petit Déjeuner' : currentMealService === 'Dej' ? 'Déjeuner' : currentMealService === 'Gouter' ? 'Goûter' : 'Dîner'}</div>
                   </div>
                )}

                <div>
                   <label className="block text-sm font-medium text-gray-500 mb-1">Client / Chambre</label>
                   <select 
                     className="w-full p-3 rounded bg-gray-100 dark:bg-gray-800 border-none text-[var(--text-main)]"
                     value={newRestoOrder.clientId}
                     onChange={e => setNewRestoOrder({...newRestoOrder, clientId: e.target.value})}
                   >
                      <option value="">Sélectionner...</option>
                      {apartments.filter(a => a.currentClients.length > 0).flatMap(a => a.currentClients.map(c => (
                         <option key={c.id} value={c.id}>{a.number} - {c.name}</option>
                      )))}
                   </select>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-500 mb-1">Boissons (Optionnel)</label>
                   <Input 
                     placeholder="Ex: Eau, Soda, Café..."
                     value={newRestoOrder.drinks.join(', ')}
                     onChange={(e) => setNewRestoOrder({...newRestoOrder, drinks: e.target.value ? e.target.value.split(',').map(s=>s.trim()) : []})}
                   />
                </div>

                <Button onClick={handleValidateRestoOrder} className="w-full">
                   <Printer size={18} className="mr-2"/> Générer Bon
                </Button>
             </div>
          </div>

          {/* Orders History */}
          <div className="dashboard-card col-span-1 lg:col-span-2">
             <h3 className="font-bold text-lg mb-4 text-[var(--text-main)]">Historique des Commandes</h3>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                   <thead className="text-xs uppercase bg-black/5 dark:bg-white/5 text-gray-500">
                      <tr>
                         <th className="p-3">Heure</th>
                         <th className="p-3">Client</th>
                         <th className="p-3">Type</th>
                         <th className="p-3">Détails</th>
                         <th className="p-3">Action</th>
                      </tr>
                   </thead>
                   <tbody>
                      {restaurantOrders.map(order => (
                         <tr key={order.id} className="border-b border-gray-700/10 hover:bg-white/5">
                            <td className="p-3 font-mono text-xs">{order.date}<br/>{order.time}</td>
                            <td className="p-3">
                               <div className="font-bold text-[var(--text-main)]">{order.clientName}</div>
                               <div className="text-xs text-gray-500">{order.aptNumber}</div>
                            </td>
                            <td className="p-3">
                               <span className={`px-2 py-1 rounded text-xs ${order.type === 'Repas' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                                  {order.type === 'Repas' ? order.mealType : 'Boisson'}
                               </span>
                            </td>
                            <td className="p-3 text-xs text-gray-500">
                               {order.items.length > 0 ? order.items.join(', ') : '-'}
                            </td>
                            <td className="p-3">
                               <button onClick={() => setShowBonModal(order)} className="text-blue-500 hover:underline text-xs">Revoir Bon</button>
                            </td>
                         </tr>
                      ))}
                      {restaurantOrders.length === 0 && <tr><td colSpan={5} className="text-center py-4 text-gray-500">Aucune commande.</td></tr>}
                   </tbody>
                </table>
             </div>
          </div>
       </div>

       {/* Bon Modal */}
       {showBonModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
             <div className="bg-white text-black p-8 rounded-sm shadow-2xl w-full max-w-xs relative paper-texture">
                <button onClick={() => setShowBonModal(null)} className="absolute top-2 right-2 text-gray-400 hover:text-black print:hidden"><X size={20}/></button>
                
                <div className="text-center border-b-2 border-black pb-4 mb-4 border-dashed">
                   <h2 className="font-bold text-xl uppercase">Résidence Samia</h2>
                   <div className="text-xs">Bon de Restauration</div>
                </div>
                
                <div className="space-y-2 mb-6 text-sm font-mono">
                   <div className="flex justify-between"><span>Date:</span> <span>{showBonModal.date} {showBonModal.time}</span></div>
                   <div className="flex justify-between"><span>Client:</span> <span className="font-bold">{showBonModal.clientName}</span></div>
                   <div className="flex justify-between"><span>Chambre:</span> <span>{showBonModal.aptNumber}</span></div>
                   <div className="border-t border-black border-dashed my-2"></div>
                   <div className="flex justify-between font-bold"><span>TYPE:</span> <span>{showBonModal.type === 'Repas' ? showBonModal.mealType : 'BOISSON'}</span></div>
                   {showBonModal.items.length > 0 && (
                      <div className="mt-2">
                         <div className="underline mb-1">Articles:</div>
                         {showBonModal.items.map((item, i) => (
                            <div key={i}>- {item}</div>
                         ))}
                      </div>
                   )}
                </div>

                <div className="text-center text-xs mt-8 pt-4 border-t-2 border-black border-dashed">
                   <p>Bon appétit !</p>
                   <p className="mt-2 font-bold">Signature Client:</p>
                   <div className="h-12"></div>
                </div>

                <Button onClick={() => window.print()} className="w-full mt-4 print:hidden bg-black text-white hover:bg-gray-800">
                   Imprimer
                </Button>
             </div>
          </div>
       )}
    </div>
  );

  const renderEmployees = () => (
    <div className="animate-fade-in space-y-6">
       <div className="flex justify-between items-center">
          <h3 className="font-bold text-xl text-[var(--text-main)]">👥 Gestion du Personnel</h3>
          {user.role === UserRole.Boss && (
            <Button onClick={() => setShowEmployeeForm(true)} className="w-auto px-4 flex items-center gap-2">
               <UserPlus size={18} /> Ajouter Employé
            </Button>
          )}
       </div>

       {showEmployeeForm && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-[var(--bg-card)] p-6 rounded-xl shadow-2xl w-full max-w-sm relative border border-gray-700">
               <button onClick={() => setShowEmployeeForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20}/></button>
               <h3 className="text-xl font-bold mb-4 text-[var(--text-main)]">Nouveau Profil</h3>
               <div className="space-y-4">
                  <Input label="Nom Complet" value={newEmployee.name} onChange={e => setNewEmployee({...newEmployee, name: e.target.value})} />
                  <Input label="Fonction / Poste" value={newEmployee.function} onChange={e => setNewEmployee({...newEmployee, function: e.target.value})} />
                  <Input label="Téléphone" value={newEmployee.phone} onChange={e => setNewEmployee({...newEmployee, phone: e.target.value})} />
                  <div>
                     <label className="block text-sm font-medium text-gray-500 mb-1">Shift</label>
                     <select className="w-full p-3 rounded bg-gray-100 dark:bg-gray-800 border-none text-[var(--text-main)]" value={newEmployee.shift} onChange={e => setNewEmployee({...newEmployee, shift: e.target.value as any})}>
                        <option value="Matin">Matin</option>
                        <option value="Soir">Soir</option>
                        <option value="Jour">Journée</option>
                     </select>
                  </div>
                  <Input label="Salaire Mensuel (DH)" type="number" value={newEmployee.monthlySalary} onChange={e => setNewEmployee({...newEmployee, monthlySalary: parseFloat(e.target.value)})} />
                  <Button onClick={handleAddEmployee}>Créer Profil</Button>
               </div>
            </div>
         </div>
       )}

       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {employees.map(emp => (
             <div key={emp.id} className="dashboard-card group">
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl font-bold text-gray-500 dark:text-gray-400">
                         {emp.name.charAt(0)}
                      </div>
                      <div>
                         <div className="font-bold text-lg text-[var(--text-main)]">{emp.name}</div>
                         <div className="text-sm text-gray-500">{emp.function} • {emp.phone}</div>
                      </div>
                   </div>
                   <div className={`px-2 py-1 rounded text-xs font-bold ${emp.status === 'Présent' ? 'bg-green-100 text-green-700' : emp.status === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                      {emp.status}
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4 bg-black/5 dark:bg-white/5 p-3 rounded-lg">
                   <div>
                      <div className="text-xs text-gray-500 uppercase">Salaire</div>
                      <div className="font-mono font-bold text-[var(--text-main)]">{emp.monthlySalary} DH</div>
                   </div>
                   <div>
                      <div className="text-xs text-gray-500 uppercase">Absences (Mois)</div>
                      <div className="flex items-center gap-2">
                         <span className="font-bold text-[var(--text-main)]">{emp.absences}j</span>
                         {user.role === UserRole.Boss && (
                            <div className="flex gap-1">
                               <button onClick={() => updateEmployeeAbsences(emp.id, Math.max(0, emp.absences - 1))} className="w-5 h-5 rounded bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300">-</button>
                               <button onClick={() => updateEmployeeAbsences(emp.id, emp.absences + 1)} className="w-5 h-5 rounded bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300">+</button>
                            </div>
                         )}
                      </div>
                   </div>
                </div>

                <div className="border-t border-gray-700/20 pt-4 mt-2">
                   <div className="text-xs font-semibold text-gray-500 mb-2 uppercase">Pointage du jour</div>
                   <div className="flex gap-2">
                      <button onClick={() => updateEmployeeStatus(emp.id, 'Présent')} className={`flex-1 py-1 rounded text-xs border ${emp.status==='Présent' ? 'bg-green-600 text-white border-green-600' : 'border-gray-300 text-gray-500 hover:border-green-400'}`}>Présent</button>
                      <button onClick={() => updateEmployeeStatus(emp.id, 'Retard')} className={`flex-1 py-1 rounded text-xs border ${emp.status==='Retard' ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-300 text-gray-500 hover:border-orange-400'}`}>Retard</button>
                      <button onClick={() => updateEmployeeStatus(emp.id, 'Absent')} className={`flex-1 py-1 rounded text-xs border ${emp.status==='Absent' ? 'bg-red-600 text-white border-red-600' : 'border-gray-300 text-gray-500 hover:border-red-400'}`}>Absent</button>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Header 
        user={user} 
        currentSite={currentSite} 
        onSiteChange={setCurrentSite} 
        onLogout={onLogout} 
        onThemeToggle={handleThemeToggle}
      />

      <div className="flex">
        <Sidebar 
          role={user.role} 
          activeItem={activeMenu} 
          onItemClick={setActiveMenu} 
        />

        {/* Main Content */}
        <main className="flex-grow pt-[100px] px-[24px] pb-[24px] md:ml-[230px] transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>{activeMenu}</h2>
            <div className="flex gap-2">
               <button className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition">Exporter Rapport</button>
            </div>
          </div>
          
          {activeMenu === 'Tableau de bord' ? (
            renderDashboardContent()
          ) : activeMenu === 'Caisse' ? (
            renderCaisse()
          ) : activeMenu === 'Gestion de stock' ? (
            renderStockManagement()
          ) : activeMenu === 'Planning des repas' ? (
            renderMealPlanning()
          ) : activeMenu === 'Appartements' ? (
            renderAppartements()
          ) : activeMenu === 'Blanchisserie' ? (
            renderBlanchisserie()
          ) : activeMenu === 'Bons de restauration' ? (
            renderRestaurant()
          ) : activeMenu === 'Les employés' || activeMenu === 'Présence' ? (
            renderEmployees()
          ) : activeMenu === 'Rapports' ? (
            renderReports()
          ) : (
             <div className="dashboard-card default h-96 flex items-center justify-center flex-col opacity-60">
                <Package size={48} className="mb-4" />
                <p>Module "{activeMenu}" en cours de développement...</p>
             </div>
          )}
        </main>
      </div>
    </div>
  );
};

const LoginPage: React.FC<{ onLogin: (u: User) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.Reception);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = AuthService.validateUser(username, password, role);
    if (user) {
      onLogin(user);
    } else {
      setError('Identifiants incorrects');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <img src={LOGO_URL} alt="Logo" className="w-20 h-20 mx-auto mb-4 rounded-full shadow-lg" />
          <h1 className="text-2xl font-bold text-gray-800">Résidence Samia</h1>
          <p className="text-gray-500">Portail de gestion</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`p-2 text-xs rounded-lg transition-all border ${role === r ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <Input 
            label="Identifiant" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Entrez votre ID"
          />
          
          <Input 
            label="Mot de passe" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••"
          />

          {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}

          <Button type="submit" className="w-full mt-4">Se connecter</Button>
        </form>
        
        <div className="mt-6 text-center text-xs text-gray-400">
          © 2025 Résidence Samia - Système de Gestion
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(AuthService.getPersistedUser());

  const handleLogin = (u: User) => {
    setUser(u);
    AuthService.persistUser(u, true);
  };

  const handleLogout = () => {
    setUser(null);
    AuthService.logout();
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={!user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />} />
        <Route path="/*" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;