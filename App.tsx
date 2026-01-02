import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, UserRole, ActionLog, SiteOption } from './types';
import { AuthService } from './services/authService';
import { ROLES, MOCK_USERS, LOGO_URL, SITE_OPTIONS } from './constants';
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
  Wallet, Banknote, CreditCard, UserPlus, LogOut, ArrowRight, Loader2, Home, Lock, User as UserProfileIcon,
  FolderOpen, Tag, Coins, Layers, ChevronDown, MoreHorizontal, ChefHat, Truck, Shield, Key, Trash2, History, Save,
  Filter, Activity
} from 'lucide-react';

// --- Loading Screen Component ---
const LoadingScreen = ({ onFinished }: { onFinished: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinished();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#0f172a] flex flex-col items-center justify-center text-white overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[120px] animate-pulse-slow"></div>
      
      <div className="relative z-10 flex flex-col items-center animate-fade-in">
        <div className="w-32 h-32 md:w-40 md:h-40 bg-white/5 backdrop-blur-md rounded-full p-1 mb-8 shadow-2xl shadow-black/50 border border-brand-gold/20 flex items-center justify-center">
           <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain rounded-full opacity-90" />
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 text-center text-transparent bg-clip-text bg-gradient-to-b from-brand-gold to-yellow-700">
          Résidence Samia
        </h1>
        <p className="text-sm md:text-lg text-gray-400 tracking-[0.3em] uppercase mb-12 text-center font-light">
          Suite Hotel & Spa
        </p>

        <div className="flex flex-col items-center gap-3">
           <Loader2 className="animate-spin text-brand-gold w-8 h-8" />
           <span className="text-xs text-gray-500 uppercase tracking-wider">Chargement de l'espace pro</span>
        </div>
      </div>
    </div>
  );
};

// --- WIDGETS ---
const StatWidget = ({ title, value, subtext, icon: Icon, trend }: any) => (
  <div className="dashboard-card group relative hover:-translate-y-1 transition-transform duration-300">
    <div className="flex justify-between items-start">
      <div className="relative z-10">
        <div className="dashboard-stat-label mb-1">{title}</div>
        <div className="dashboard-stat-value tracking-tight">{value}</div>
      </div>
      <div className={`
        p-3 rounded-2xl shadow-sm transition-colors duration-300
        ${trend === 'up' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 
          trend === 'down' ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400' : 
          'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'}
      `}>
        <Icon size={22} strokeWidth={2} />
      </div>
    </div>
    <div className="mt-4 flex items-center text-xs font-medium relative z-10">
      {trend === 'up' && <span className="flex items-center text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded mr-2"><TrendingUp size={12} className="mr-1" /> +0%</span>}
      {trend === 'down' && <span className="flex items-center text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded mr-2"><TrendingDown size={12} className="mr-1" /> -0%</span>}
      <span className="text-gray-400 dark:text-gray-500">{subtext}</span>
    </div>
    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[var(--role-color)] opacity-[0.03] rounded-full blur-2xl group-hover:opacity-[0.07] transition-opacity"></div>
  </div>
);

const InteractiveStockWidget = ({ items, onUpdate }: any) => {
  return (
    <div className="dashboard-card col-span-1 lg:col-span-2">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--border-color)]">
        <h3 className="font-bold text-lg flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--role-color)] text-white shadow-sm">
             <Package size={18} />
          </div>
          Gestion Rapide Stock
        </h3>
        <button className="text-xs font-bold text-[var(--role-color)] hover:bg-[var(--role-color)] hover:text-white px-3 py-1.5 rounded-full transition-all uppercase tracking-wide">
          Voir tout
        </button>
      </div>
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-sm">Aucun article en stock</div>
        ) : (
          items.slice(0, 5).map((item: any, idx: number) => (
            <div key={idx} className="group flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-[var(--border-color)]">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ring-4 ring-opacity-20 ${item.quantite <= item.seuilCritique ? 'bg-rose-500 ring-rose-500' : 'bg-emerald-500 ring-emerald-500'}`}></div>
                <div>
                    <div className="font-semibold text-sm">{item.nom}</div>
                    <div className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">{item.cat}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-gray-50 dark:bg-[#1f2937] rounded-lg p-1 border border-[var(--border-color)]">
                <button 
                  onClick={() => onUpdate(idx, -1)}
                  className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-gray-700 text-gray-500 hover:text-rose-500 hover:shadow-sm transition-all"
                >
                  <Minus size={14} />
                </button>
                <span className="font-mono font-bold w-10 text-center text-sm">{item.quantite}</span>
                <button 
                  onClick={() => onUpdate(idx, 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-gray-700 text-gray-500 hover:text-emerald-500 hover:shadow-sm transition-all"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const InteractiveOrdersWidget = ({ orders, onStatusChange }: any) => {
  const getStatusColor = (s: string) => {
    switch(s) {
      case 'Livré': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
      case 'En cours': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-700/30 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="dashboard-card col-span-1 lg:col-span-2">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--border-color)]">
        <h3 className="font-bold text-lg flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--role-color)] text-white shadow-sm">
             <ChefHat size={18} />
          </div>
          Commandes Cuisine
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr>
              <th className="rounded-l-lg pl-4">Produit</th>
              <th>Qté</th>
              <th className="rounded-r-lg pr-4">Statut</th>
            </tr>
          </thead>
          <tbody className="space-y-2">
            {orders.length === 0 ? (
               <tr><td colSpan={3} className="text-center py-4 text-gray-400">Aucune commande en cours</td></tr>
            ) : (
              orders.map((order: any, idx: number) => (
                <tr key={idx} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="font-medium pl-4">{order.produit}</td>
                  <td className="font-mono text-gray-500">{order.quantite}</td>
                  <td className="pr-4">
                    <button 
                      onClick={() => onStatusChange(idx)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all hover:scale-105 active:scale-95 ${getStatusColor(order.statut)}`}
                    >
                      {order.statut}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RevenueChartWidget = ({ data }: any) => (
  <div className="dashboard-card col-span-1 lg:col-span-3 h-[340px]">
    <div className="flex justify-between items-center mb-6">
       <h3 className="font-bold text-lg text-[var(--text-main)]">Aperçu des Revenus</h3>
       <select className="text-xs bg-gray-100 dark:bg-gray-800 border-none rounded-lg px-2 py-1 cursor-pointer outline-none">
          <option>Cette semaine</option>
          <option>Ce mois</option>
       </select>
    </div>
    <ResponsiveContainer width="100%" height="85%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--role-color)" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="var(--role-color)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
        <XAxis dataKey="name" tick={{fill: '#94a3b8', fontSize: 11}} axisLine={false} tickLine={false} dy={10} />
        <YAxis tick={{fill: '#94a3b8', fontSize: 11}} axisLine={false} tickLine={false} tickFormatter={(value) => `${value} DH`} />
        <RechartsTooltip 
          contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', color: 'var(--text-main)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
          itemStyle={{ color: 'var(--text-main)', fontWeight: 600 }}
          cursor={{stroke: 'var(--role-color)', strokeWidth: 1, strokeDasharray: '4 4'}}
        />
        <Area type="monotone" dataKey="revenu" stroke="var(--role-color)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const OccupancyChartWidget = () => {
  const data = [
    { name: 'Occupés', value: 0, color: '#3b82f6' },
    { name: 'Libres', value: 100, color: '#10b981' },
    { name: 'Maintenance', value: 0, color: '#f43f5e' },
  ];

  return (
    <div className="dashboard-card col-span-1 lg:col-span-1 h-[340px] flex flex-col">
      <h3 className="font-bold text-lg mb-4 w-full text-left">Occupation Actuelle</h3>
      <div className="flex-grow relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              cornerRadius={6}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.9)' }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
           <span className="text-3xl font-bold tracking-tight">0%</span>
           <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-widest mt-1">Taux Global</span>
        </div>
      </div>
      <div className="mt-4 space-y-2 px-2">
        {data.map(d => (
          <div key={d.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
               <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: d.color}}></div>
               <span className="text-gray-500 font-medium">{d.name}</span>
            </div>
            <span className="font-bold">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ... [Types & Interfaces] ...
type MealType = 'PtDej' | 'Dej' | 'Gouter' | 'Diner';
type HebergementType = '1/1' | '1/2' | '1/3' | '1/4';

interface Dish { id: string; name: string; category: MealType; ingredients: string; cost: number; }
interface DailyPlan { PtDej?: string; Dej?: string; Gouter?: string; Diner?: string; }
interface Client { id: string; name: string; entryDate: string; type: HebergementType; }
interface ClientHistory { clientName: string; entryDate: string; leaveDate: string; type: HebergementType; }
interface Apartment { id: string; number: string; building: string; site: string; capacity: number; currentClients: Client[]; history: ClientHistory[]; }
type LaundryStatus = 'En attente' | 'En blanchisserie' | 'En réception' | 'Livré';
interface LaundryOrder { id: string; clientId: string; clientName: string; apartmentNumber: string; site: string; items: string; date: string; status: LaundryStatus; }
interface RestaurantOrder { id: string; type: 'Repas' | 'Boisson'; mealType?: MealType; clientId: string; clientName: string; aptNumber: string; site: string; date: string; time: string; items: string[]; }
interface Employee { id: string; name: string; function: string; phone: string; shift: 'Matin' | 'Soir' | 'Jour'; monthlySalary: number; lastMonthSalary: number; absences: number; status: 'Présent' | 'Absent' | 'Retard'; }
interface CashFund { id: string; amount: number; date: string; addedBy: string; }
interface CashExpense { id: string; category: string; amount: number; date: string; observation: string; addedBy: string; }

const getMaxOccupants = (type: HebergementType): number => {
  switch (type) { case '1/4': return 4; case '1/3': return 3; case '1/2': return 2; case '1/1': return 1; default: return 1; }
};

const generateApartments = (): Apartment[] => {
  const apts: Apartment[] = [];
  for(let i=1; i<=31; i++) apts.push({ id: `F-F-${i}`, number: `N°${i}`, building: 'Imm. Fnidaq', site: 'Fnidaq', capacity: 4, currentClients: [], history: [] });
  for(let i=1; i<=16; i++) apts.push({ id: `F-B-${i}`, number: `B-${i}`, building: 'Imm. Bouzaghlal', site: 'Fnidaq', capacity: i <= 12 ? 4 : 2, currentClients: [], history: [] });
  for(let i=1; i<=12; i++) apts.push({ id: `M-${i}`, number: `M-${i}`, building: 'Résidence M\'dik', site: "M'dik", capacity: i <= 11 ? 4 : 2, currentClients: [], history: [] });
  for(let i=1; i<=8; i++) apts.push({ id: `A-${i}`, number: `AH-${i}`, building: 'Résidence Al Hoceima', site: 'Al Hoceima', capacity: 4, currentClients: [], history: [] });
  return apts;
};

// --- Dashboard Component ---
const Dashboard: React.FC<{ user: User | null; onLogout: () => void }> = ({ user, onLogout }) => {
  const [currentSite, setCurrentSite] = useState<string>('Vue Globale');
  const [activeMenu, setActiveMenu] = useState('Tableau de bord');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tout');

  // --- SETTINGS STATE (Initialized from LocalStorage via AuthService) ---
  const [allUsers, setAllUsers] = useState<User[]>(() => AuthService.getUsers());
  const [actionLogs, setActionLogs] = useState<ActionLog[]>(() => {
    const saved = localStorage.getItem('rs_manager_logs');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showUserForm, setShowUserForm] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({ role: UserRole.Reception });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [settingsTab, setSettingsTab] = useState<'users' | 'logs'>('users');
  const [userSearch, setUserSearch] = useState('');

  // [State declarations]
  const [stockItems, setStockItems] = useState<any[]>([]); 
  const [chefOrders, setChefOrders] = useState<any[]>([]); 
  const [dishes, setDishes] = useState<Dish[]>([]); 
  const [weeklyPlan, setWeeklyPlan] = useState<Record<string, DailyPlan>>({
    'Lundi': {}, 'Mardi': {}, 'Mercredi': {}, 'Jeudi': {}, 'Vendredi': {}, 'Samedi': {}, 'Dimanche': {}
  }); 
  
  const [editingSlot, setEditingSlot] = useState<{day: string, type: MealType} | null>(null);
  const [showDishForm, setShowDishForm] = useState(false);
  const [newDish, setNewDish] = useState<Partial<Dish>>({ category: 'PtDej', cost: 0 });
  
  const [apartments, setApartments] = useState<Apartment[]>(() => generateApartments());
  const [selectedApt, setSelectedApt] = useState<Apartment | null>(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [newClient, setNewClient] = useState<{name: string, date: string, type: HebergementType}>({name: '', date: new Date().toISOString().split('T')[0], type: '1/4'});
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  
  const [laundryOrders, setLaundryOrders] = useState<LaundryOrder[]>([]); 
  const [showLaundryForm, setShowLaundryForm] = useState(false);
  const [newLaundryOrder, setNewLaundryOrder] = useState({ apartmentId: '', clientId: '', items: '' });
  
  const [restaurantOrders, setRestaurantOrders] = useState<RestaurantOrder[]>([]); 
  const [currentMealService, setCurrentMealService] = useState<MealType>('PtDej');
  const [newRestoOrder, setNewRestoOrder] = useState<{clientId: string; drinks: string[]; isDrinkOnly: boolean;}>({clientId: '', drinks: [], isDrinkOnly: false});
  const [showBonModal, setShowBonModal] = useState<RestaurantOrder | null>(null);
  
  const [employees, setEmployees] = useState<Employee[]>([]); 
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({ shift: 'Jour', monthlySalary: 0 });
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  
  const [cashFunds, setCashFunds] = useState<CashFund[]>([]); 
  const [cashExpenses, setCashExpenses] = useState<CashExpense[]>([]); 
  const [showFundForm, setShowFundForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [newFundAmount, setNewFundAmount] = useState('');
  const [newExpense, setNewExpense] = useState({ category: '', amount: '', observation: '' });
  
  const [newProduct, setNewProduct] = useState({ nom: '', cat: '', quantite: 0, unite: '', prix: 0 });
  const [newOrder, setNewOrder] = useState({ produit: '', quantite: 1 });
  const [showAddForm, setShowAddForm] = useState(false);

  // Reset Revenue Data to 0
  const revenueData = [
    { name: 'Lun', revenu: 0 }, 
    { name: 'Mar', revenu: 0 }, 
    { name: 'Mer', revenu: 0 }, 
    { name: 'Jeu', revenu: 0 }, 
    { name: 'Ven', revenu: 0 }, 
    { name: 'Sam', revenu: 0 }, 
    { name: 'Dim', revenu: 0 }
  ];

  // [UseEffects and Handlers]
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 11) setCurrentMealService('PtDej'); else if (hour < 15) setCurrentMealService('Dej'); else if (hour < 18) setCurrentMealService('Gouter'); else setCurrentMealService('Diner');
  }, []);

  // --- ACTION LOGGING HELPER (With Persistence) ---
  const logAction = (action: string, target: string, type: 'info' | 'warning' | 'danger' = 'info') => {
    const log: ActionLog = {
      id: Date.now().toString(),
      actor: user?.username || 'Inconnu',
      action,
      target,
      date: new Date().toLocaleString('fr-FR'),
      type
    };
    
    // Update local state and persistence
    const updatedLogs = [log, ...actionLogs];
    setActionLogs(updatedLogs);
    localStorage.setItem('rs_manager_logs', JSON.stringify(updatedLogs));
  };

  // --- SETTINGS HANDLERS (With Persistence) ---
  
  const handleAddUser = () => {
    if (newUser.username && newUser.password && newUser.role) {
      if (allUsers.find(u => u.username === newUser.username)) {
        alert("Cet identifiant existe déjà.");
        return;
      }
      const u: User = {
        username: newUser.username,
        password: newUser.password,
        role: newUser.role as UserRole,
        site: newUser.site
      };
      
      const updatedUsers = [...allUsers, u];
      setAllUsers(updatedUsers);
      AuthService.saveUsers(updatedUsers); // PERSIST
      
      logAction('Création compte', u.username, 'info');
      setNewUser({ role: UserRole.Reception });
      setShowUserForm(false);
    }
  };

  const handleDeleteUser = (username: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce compte ?")) {
      const updatedUsers = allUsers.filter(u => u.username !== username);
      setAllUsers(updatedUsers);
      AuthService.saveUsers(updatedUsers); // PERSIST
      
      logAction('Suppression compte', username, 'danger');
    }
  };

  const handleUpdatePassword = () => {
    if (editingUser && newPassword) {
      const updatedUsers = allUsers.map(u => 
        u.username === editingUser.username ? { ...u, password: newPassword } : u
      );
      setAllUsers(updatedUsers);
      AuthService.saveUsers(updatedUsers); // PERSIST
      
      logAction('Changement mot de passe', editingUser.username, 'warning');
      setEditingUser(null);
      setNewPassword('');
    }
  };

  const handleStockUpdate = (index: number, change: number) => { 
    const newStock = [...stockItems]; 
    if (newStock[index].quantite + change >= 0) { 
      newStock[index].quantite += change; 
      setStockItems(newStock); 
      logAction('Mise à jour stock', `${newStock[index].nom} (${change > 0 ? '+' : ''}${change})`, 'info');
    } 
  };
  
  const handleStatusChange = (index: number) => { const newOrders = [...chefOrders]; const current = newOrders[index].statut; if (current === 'En attente') newOrders[index].statut = 'En cours'; else if (current === 'En cours') newOrders[index].statut = 'Livré'; else if (current === 'Livré') newOrders[index].statut = 'En attente'; setChefOrders(newOrders); };
  const handleAddProduct = () => { if (newProduct.nom && newProduct.cat) { setStockItems([...stockItems, { ...newProduct, seuilCritique: 5 }]); setNewProduct({ nom: '', cat: '', quantite: 0, unite: '', prix: 0 }); setShowAddForm(false); } };
  const handleAddDish = () => { if(newDish.name && newDish.cost && newDish.ingredients) { const dish: Dish = { id: Date.now().toString(), name: newDish.name || 'Sans nom', category: newDish.category as MealType, ingredients: newDish.ingredients || '', cost: Number(newDish.cost) }; setDishes([...dishes, dish]); setNewDish({ category: 'PtDej', cost: 0, name: '', ingredients: '' }); setShowDishForm(false); } };
  const handleAssignDish = (dishId: string) => { if (editingSlot) { setWeeklyPlan({ ...weeklyPlan, [editingSlot.day]: { ...weeklyPlan[editingSlot.day], [editingSlot.type]: dishId } }); setEditingSlot(null); } };
  const getDish = (id?: string) => dishes.find(d => d.id === id);
  const handleCheckIn = () => { if (selectedApt && newClient.name && newClient.date) { const updatedApts = apartments.map(apt => { if (apt.id === selectedApt.id) { const currentOccupancy = apt.currentClients.length; const roomType = currentOccupancy > 0 ? apt.currentClients[0].type : newClient.type; const maxOccupants = getMaxOccupants(roomType); if (currentOccupancy >= maxOccupants) { alert(`Cet appartement est plein (${maxOccupants} pers max pour ${roomType}).`); return apt; } const clientToAdd: Client = { id: Date.now().toString(), name: newClient.name, entryDate: newClient.date, type: roomType }; return { ...apt, currentClients: [...apt.currentClients, clientToAdd] }; } return apt; }); setApartments(updatedApts); setShowCheckInModal(false); setNewClient({ name: '', date: new Date().toISOString().split('T')[0], type: '1/4' }); logAction('Check-in', `${newClient.name} -> ${selectedApt.number}`, 'info'); } };
  const handleCheckOut = (clientId: string) => { if (selectedApt) { const leaveDate = new Date().toISOString().split('T')[0]; const clientToRemove = selectedApt.currentClients.find(c => c.id === clientId); if(!clientToRemove) return; const historyEntry: ClientHistory = { clientName: clientToRemove.name, entryDate: clientToRemove.entryDate, leaveDate: leaveDate, type: clientToRemove.type }; const updatedApts = apartments.map(apt => { if (apt.id === selectedApt.id) { return { ...apt, currentClients: apt.currentClients.filter(c => c.id !== clientId), history: [historyEntry, ...apt.history] }; } return apt; }); setApartments(updatedApts); const updatedSelectedApt = updatedApts.find(a => a.id === selectedApt.id) || null; setSelectedApt(updatedSelectedApt); logAction('Check-out', `${clientToRemove.name}`, 'info'); } };
  const handleAddLaundryOrder = () => { if (!newLaundryOrder.apartmentId || !newLaundryOrder.clientId || !newLaundryOrder.items) return; const apt = apartments.find(a => a.id === newLaundryOrder.apartmentId); const client = apt?.currentClients.find(c => c.id === newLaundryOrder.clientId); if (apt && client) { const order: LaundryOrder = { id: Date.now().toString(), clientId: client.id, clientName: client.name, apartmentNumber: apt.number, site: apt.site, items: newLaundryOrder.items, date: new Date().toISOString().split('T')[0], status: 'En attente' }; setLaundryOrders([order, ...laundryOrders]); setNewLaundryOrder({ apartmentId: '', clientId: '', items: '' }); setShowLaundryForm(false); } };
  const updateLaundryStatus = (id: string, newStatus: LaundryStatus) => { const updated = laundryOrders.map(o => o.id === id ? { ...o, status: newStatus } : o); setLaundryOrders(updated); };
  const handleValidateRestoOrder = () => { if (!newRestoOrder.clientId) return; let foundClient: Client | undefined; let foundApt: Apartment | undefined; for (const apt of apartments) { const c = apt.currentClients.find(cl => cl.id === newRestoOrder.clientId); if (c) { foundClient = c; foundApt = apt; break; } } if (foundClient && foundApt) { const now = new Date(); const order: RestaurantOrder = { id: Date.now().toString(), type: newRestoOrder.isDrinkOnly ? 'Boisson' : 'Repas', mealType: newRestoOrder.isDrinkOnly ? undefined : currentMealService, clientId: foundClient.id, clientName: foundClient.name, aptNumber: foundApt.number, site: foundApt.site, date: now.toISOString().split('T')[0], time: now.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}), items: newRestoOrder.drinks }; setRestaurantOrders([order, ...restaurantOrders]); setShowBonModal(order); setNewRestoOrder({ clientId: '', drinks: [], isDrinkOnly: false }); logAction('Bon Resto', `${foundClient.name} (${order.type})`, 'info'); } };
  const handleAddEmployee = () => { if(newEmployee.name && newEmployee.function && newEmployee.monthlySalary) { setEmployees([...employees, { id: Date.now().toString(), name: newEmployee.name, function: newEmployee.function, phone: newEmployee.phone || '', shift: newEmployee.shift as 'Matin'|'Soir'|'Jour', monthlySalary: Number(newEmployee.monthlySalary), lastMonthSalary: Number(newEmployee.monthlySalary), absences: 0, status: 'Présent' }]); setShowEmployeeForm(false); setNewEmployee({ shift: 'Jour', monthlySalary: 0, name: '', function: '', phone: '' }); } };
  const updateEmployeeStatus = (id: string, status: 'Présent' | 'Absent' | 'Retard') => { setEmployees(employees.map(e => e.id === id ? { ...e, status } : e)); };
  const updateEmployeeAbsences = (id: string, absences: number) => { setEmployees(employees.map(e => e.id === id ? { ...e, absences } : e)); };
  const handleAddFund = () => { if (!newFundAmount) return; const amount = parseFloat(newFundAmount); if (isNaN(amount) || amount <= 0) return; const newFund: CashFund = { id: Date.now().toString(), amount, date: new Date().toISOString().split('T')[0], addedBy: user?.username || 'Boss' }; setCashFunds([...cashFunds, newFund]); setNewFundAmount(''); setShowFundForm(false); logAction('Caisse entrée', `${amount} DH`, 'info'); };
  const handleAddExpense = () => { if (!newExpense.amount || !newExpense.category) return; const amount = parseFloat(newExpense.amount); if (isNaN(amount) || amount <= 0) return; const expense: CashExpense = { id: Date.now().toString(), category: newExpense.category, amount, observation: newExpense.observation, date: new Date().toISOString().split('T')[0], addedBy: user?.username || 'Gérant' }; setCashExpenses([...cashExpenses, expense]); setNewExpense({ category: '', amount: '', observation: '' }); setShowExpenseForm(false); logAction('Dépense', `${amount} DH - ${newExpense.category}`, 'warning'); };
  const handleExport = (type: 'pdf' | 'excel') => { if (type === 'pdf') { window.print(); } else { const csvContent = "data:text/csv;charset=utf-8,Type,Date,Montant\nRevenus,2025-01-01,15000\nDepenses,2025-01-01,5000"; const encodedUri = encodeURI(csvContent); const link = document.createElement("a"); link.setAttribute("href", encodedUri); link.setAttribute("download", "rapport_financier.csv"); document.body.appendChild(link); link.click(); document.body.removeChild(link); } };
  const searchResults = useMemo(() => { if (!clientSearchQuery) return []; const results: { id: string; clientName: string; type: HebergementType; entryDate: string; leaveDate: string; status: 'En cours' | 'Terminé'; aptNumber: string; building: string; site: string; apt: Apartment; }[] = []; apartments.forEach(apt => { apt.currentClients.forEach(c => { if (c.name.toLowerCase().includes(clientSearchQuery.toLowerCase())) { results.push({ id: `${apt.id}-${c.id}`, clientName: c.name, type: c.type, entryDate: c.entryDate, leaveDate: '-', status: 'En cours', aptNumber: apt.number, building: apt.building, site: apt.site, apt: apt }); } }); apt.history.forEach((h, idx) => { if (h.clientName.toLowerCase().includes(clientSearchQuery.toLowerCase())) { results.push({ id: `${apt.id}-hist-${idx}`, clientName: h.clientName, type: h.type, entryDate: h.entryDate, leaveDate: h.leaveDate, status: 'Terminé', aptNumber: apt.number, building: apt.building, site: apt.site, apt: apt }); } }); }); return results; }, [clientSearchQuery, apartments]);

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

  // --- RENDER FUNCTIONS (OPTIMIZED VISUALS) ---

  const renderDashboardContent = () => {
    const occupiedCount = apartments.filter(a => a.currentClients.length > 0).length;
    const totalSalaries = employees.reduce((acc, emp) => acc + (emp.monthlySalary/30 * (30 - emp.absences)), 0);
    const totalRevenue = revenueData.reduce((acc, d) => acc + d.revenu, 0);
    const totalFunds = cashFunds.reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpenses = cashExpenses.reduce((acc, curr) => acc + curr.amount, 0);
    const caisseBalance = totalFunds - totalExpenses;

    if (user.role === UserRole.Boss || user.role === UserRole.Gerant) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in pb-20">
          <div className="dashboard-card col-span-1 lg:col-span-4 bg-gradient-to-r from-[var(--role-color)] to-slate-900 border-none shadow-xl relative overflow-hidden group p-8">
             <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 transition-transform group-hover:scale-110 duration-1000">
               <PieChartIcon size={240} />
             </div>
             <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                   <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">Rapport Mensuel</h3>
                   <div className="flex flex-wrap gap-8 text-white/90">
                      <div>
                         <div className="text-[11px] uppercase opacity-70 tracking-widest font-semibold mb-1">Masse Salariale</div>
                         <div className="font-mono text-2xl font-bold">{Math.round(totalSalaries).toLocaleString()} DH</div>
                      </div>
                      <div>
                         <div className="text-[11px] uppercase opacity-70 tracking-widest font-semibold mb-1">CA (7j)</div>
                         <div className="font-mono text-2xl font-bold">{totalRevenue.toLocaleString()} DH</div>
                      </div>
                      <div>
                         <div className="text-[11px] uppercase opacity-70 tracking-widest font-semibold mb-1">Taux Occupation</div>
                         <div className="font-mono text-2xl font-bold">{Math.round((occupiedCount / apartments.length) * 100)}%</div>
                      </div>
                   </div>
                </div>
                <Button onClick={() => setActiveMenu('Rapports')} className="w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md rounded-xl font-medium shadow-lg hover:shadow-xl transition-all">
                  Voir Détails <ArrowRight size={16} className="ml-2 inline" />
                </Button>
             </div>
          </div>

          <StatWidget title="Solde Caisse" value={`${caisseBalance.toLocaleString()} DH`} subtext="Disponible" icon={Wallet} trend={caisseBalance > 0 ? "up" : "down"} />
          <StatWidget title="Revenu du jour" value="0 DH" subtext="Aucune donnée" icon={TrendingUp} trend="up" />
          <StatWidget title="Occupation" value={`${Math.round((occupiedCount / apartments.length) * 100)}%`} subtext={`${occupiedCount}/${apartments.length} appts`} icon={Users} trend="neutral" />
          <StatWidget title="Commandes Chef" value={`${chefOrders.filter(o => o.statut !== 'Livré').length} En cours`} subtext="Action requise" icon={ShoppingCart} trend="neutral" />

          <RevenueChartWidget data={revenueData} />
          <OccupancyChartWidget />
          <InteractiveStockWidget items={stockItems} onUpdate={handleStockUpdate} />
          <InteractiveOrdersWidget orders={chefOrders} onStatusChange={handleStatusChange} />
        </div>
      );
    } 
    return <div className="p-8 dashboard-card text-center text-gray-500">Vue non configurée pour ce rôle.</div>;
  };

  const renderSettings = () => {
    // SECURITY CHECK: Only Boss can see this
    if (user.role !== UserRole.Boss) {
      return (
        <div className="dashboard-card p-10 flex flex-col items-center justify-center text-center">
           <Shield size={48} className="text-red-500 mb-4" />
           <h2 className="text-2xl font-bold text-red-600 mb-2">Accès Refusé</h2>
           <p className="text-gray-500">Seul le Boss a accès à ces paramètres.</p>
        </div>
      );
    }

    const filteredUsers = allUsers.filter(u => u.username.toLowerCase().includes(userSearch.toLowerCase()));

    return (
      <div className="animate-fade-in space-y-6 pb-24 md:pb-6">
         {/* Top Actions: Search & Add */}
         <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
            <div className="w-full md:w-auto flex gap-4 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-xl self-start">
               <button 
                 onClick={() => setSettingsTab('users')}
                 className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${settingsTab === 'users' ? 'bg-white dark:bg-gray-700 shadow text-[var(--role-color)]' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
               >
                  <Users size={16}/> Comptes
               </button>
               <button 
                 onClick={() => setSettingsTab('logs')}
                 className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${settingsTab === 'logs' ? 'bg-white dark:bg-gray-700 shadow text-[var(--role-color)]' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
               >
                  <Activity size={16}/> Activité
               </button>
            </div>

            {settingsTab === 'users' && (
               <div className="flex gap-3 w-full md:w-auto">
                  <div className="relative w-full md:w-64">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                     <input 
                        type="text" 
                        placeholder="Rechercher un utilisateur..." 
                        value={userSearch}
                        onChange={e => setUserSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-[var(--role-color)] transition-shadow shadow-sm text-gray-900 dark:text-white placeholder-gray-400"
                     />
                  </div>
                  <Button onClick={() => setShowUserForm(true)} className="w-auto px-4 rounded-xl shadow-lg bg-[var(--role-color)] hover:brightness-110 text-white flex items-center justify-center"><UserPlus size={20}/></Button>
               </div>
            )}
         </div>

         {/* USERS TAB */}
         {settingsTab === 'users' && (
           <div className="space-y-4">
              {/* Add User Modal */}
              {showUserForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
                   <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl w-full max-w-lg shadow-2xl relative border border-white/10">
                      <button onClick={() => setShowUserForm(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500 dark:text-gray-400"><X size={20}/></button>
                      <h4 className="font-bold text-2xl mb-6 flex items-center gap-3 text-[var(--role-color)]">
                         <div className="p-2 bg-[var(--role-color)]/10 rounded-lg"><UserPlus size={24}/></div>
                         Nouveau Compte
                      </h4>
                      <div className="grid grid-cols-1 gap-5">
                         <Input label="Identifiant (Username)" value={newUser.username || ''} onChange={e => setNewUser({...newUser, username: e.target.value})} className="bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white" />
                         <Input label="Mot de passe initial" value={newUser.password || ''} onChange={e => setNewUser({...newUser, password: e.target.value})} className="bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white" />
                         <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Rôle</label>
                            <select className="w-full p-3.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--role-color)]" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}>
                               {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                         </div>
                         <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Site Assigné</label>
                            <select className="w-full p-3.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--role-color)]" value={newUser.site || ''} onChange={e => setNewUser({...newUser, site: e.target.value})}>
                               <option value="">Aucun (Global)</option>
                               {SITE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                         </div>
                      </div>
                      <div className="mt-8 flex justify-end gap-3">
                         <Button onClick={() => setShowUserForm(false)} variant="secondary" className="w-auto px-6">Annuler</Button>
                         <Button onClick={handleAddUser} className="w-auto px-8 bg-[var(--role-color)] text-white hover:brightness-110 shadow-lg">Créer le compte</Button>
                      </div>
                   </div>
                </div>
              )}

              {/* Edit Password Modal */}
              {editingUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                   <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in relative border border-white/10">
                      <button onClick={() => setEditingUser(null)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-500 dark:text-gray-400"><X size={20}/></button>
                      <h3 className="font-bold text-xl mb-6 flex items-center gap-3 text-gray-900 dark:text-white"><div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Key size={24}/></div> Changer Mot de Passe</h3>
                      <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl mb-6">
                         <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Utilisateur Cible</p>
                         <p className="text-lg font-bold text-gray-900 dark:text-white">{editingUser.username}</p>
                         <p className="text-sm text-[var(--role-color)]">{editingUser.role}</p>
                      </div>
                      <Input label="Nouveau Mot de passe" value={newPassword} onChange={e => setNewPassword(e.target.value)} type="text" placeholder="Entrez le nouveau code" className="text-gray-900 dark:text-white" />
                      <Button onClick={handleUpdatePassword} className="mt-6 w-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg">Mettre à jour</Button>
                   </div>
                </div>
              )}

              {/* Mobile/Tablet View: Cards (Grid 1 on Mobile, Grid 2 on Tablet) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
                 {filteredUsers.map((u, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-4 transition-all hover:shadow-md">
                       <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                             <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-md ${u.role === UserRole.Boss ? 'bg-gradient-to-br from-red-500 to-red-700' : 'bg-gradient-to-br from-blue-500 to-blue-700'}`}>
                                {u.username.charAt(0).toUpperCase()}
                             </div>
                             <div>
                                <div className="font-bold text-lg text-gray-900 dark:text-white">{u.username}</div>
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${u.role === UserRole.Boss ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'}`}>{u.role}</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 p-3 rounded-xl">
                          <Home size={16}/> Site: <span className="font-medium text-gray-900 dark:text-white">{u.site || 'Global'}</span>
                       </div>

                       <div className="flex gap-2 pt-2 mt-auto">
                          <button onClick={() => setEditingUser(u)} className="flex-1 py-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"><Key size={16}/> <span className="hidden sm:inline">Mdp</span></button>
                          {u.role !== UserRole.Boss && (
                             <button onClick={() => handleDeleteUser(u.username)} className="flex-1 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"><Trash2 size={16}/> <span className="hidden sm:inline">Suppr</span></button>
                          )}
                       </div>
                    </div>
                 ))}
              </div>

              {/* Desktop View: Table */}
              <div className="hidden lg:block dashboard-card p-0 overflow-hidden">
                 <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-white/5">
                       <tr>
                          <th className="px-6 py-4 font-bold text-xs uppercase text-gray-500 dark:text-gray-400">Utilisateur</th>
                          <th className="px-6 py-4 font-bold text-xs uppercase text-gray-500 dark:text-gray-400">Rôle</th>
                          <th className="px-6 py-4 font-bold text-xs uppercase text-gray-500 dark:text-gray-400">Site</th>
                          <th className="px-6 py-4 font-bold text-xs uppercase text-gray-500 dark:text-gray-400 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                       {filteredUsers.map((u, idx) => (
                          <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                             <td className="px-6 py-4 font-bold flex items-center gap-3 text-gray-900 dark:text-white">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs text-white font-bold ${u.role === UserRole.Boss ? 'bg-red-600' : 'bg-blue-600'}`}>
                                   {u.username.charAt(0)}
                                </div>
                                {u.username}
                             </td>
                             <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === UserRole.Boss ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'}`}>{u.role}</span>
                             </td>
                             <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{u.site || 'Global'}</td>
                             <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button onClick={() => setEditingUser(u)} className="p-2 text-amber-500 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/40 rounded-lg transition-colors" title="Changer mot de passe"><Key size={16}/></button>
                                   {u.role !== UserRole.Boss && (
                                      <button onClick={() => handleDeleteUser(u.username)} className="p-2 text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-lg transition-colors" title="Supprimer le compte"><Trash2 size={16}/></button>
                                   )}
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
         )}

         {/* LOGS TAB (Mobile Optimized Timeline) */}
         {settingsTab === 'logs' && (
            <div className="dashboard-card p-0 overflow-hidden relative">
               <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/5 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-bold"><History size={16}/> Dernières actions</span>
                  <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">{actionLogs.length} entrées</span>
               </div>
               
               <div className="max-h-[600px] overflow-y-auto p-0">
                  {actionLogs.length === 0 ? (
                     <div className="p-12 text-center flex flex-col items-center gap-4 text-gray-400">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center"><Activity size={24}/></div>
                        <p>Aucune activité récente.</p>
                     </div>
                  ) : (
                     <div className="relative">
                        {/* Desktop Table */}
                        <table className="hidden lg:table w-full text-sm text-left">
                           <thead className="bg-white dark:bg-gray-900 sticky top-0 z-10 shadow-sm">
                              <tr>
                                 <th className="px-6 py-3 text-gray-500 dark:text-gray-400">Date</th>
                                 <th className="px-6 py-3 text-gray-500 dark:text-gray-400">Acteur</th>
                                 <th className="px-6 py-3 text-gray-500 dark:text-gray-400">Action</th>
                                 <th className="px-6 py-3 text-gray-500 dark:text-gray-400">Détail</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                              {actionLogs.map((log) => (
                                 <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                    <td className="px-6 py-3 text-xs text-gray-400 dark:text-gray-500 font-mono whitespace-nowrap">{log.date}</td>
                                    <td className="px-6 py-3 font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                                       <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px]">{log.actor.charAt(0)}</div>
                                       {log.actor}
                                    </td>
                                    <td className="px-6 py-3">
                                       <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wide ${
                                          log.type === 'danger' ? 'bg-red-100 text-red-600' : 
                                          log.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-50 text-blue-600'
                                       }`}>
                                          {log.action}
                                       </span>
                                    </td>
                                    <td className="px-6 py-3 text-gray-600 dark:text-gray-300">{log.target}</td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>

                        {/* Mobile & Tablet Timeline View */}
                        <div className="lg:hidden p-4 space-y-6 relative">
                           {/* Vertical Line */}
                           <div className="absolute left-7 top-6 bottom-6 w-0.5 bg-gray-200 dark:bg-gray-800"></div>
                           
                           {actionLogs.map((log) => (
                              <div key={log.id} className="relative pl-10">
                                 {/* Timeline Dot */}
                                 <div className={`absolute left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 shadow-sm z-10 ${
                                    log.type === 'danger' ? 'bg-red-500' : 
                                    log.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                                 }`}></div>
                                 
                                 <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <div className="flex justify-between items-start mb-1">
                                       <span className={`text-[10px] uppercase font-bold tracking-wide ${
                                          log.type === 'danger' ? 'text-red-600' : 
                                          log.type === 'warning' ? 'text-amber-600' : 'text-blue-600'
                                       }`}>
                                          {log.action}
                                       </span>
                                       <span className="text-[10px] text-gray-400">{log.date.split(' ')[1]}</span>
                                    </div>
                                    <div className="font-bold text-sm mb-1 text-gray-800 dark:text-gray-200">{log.target}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                       <div className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[8px]">{log.actor.charAt(0)}</div>
                                       Par: {log.actor}
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}
               </div>
            </div>
         )}
      </div>
    );
  };

  const renderCaisse = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      <div className="dashboard-card h-full flex flex-col">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--border-color)]">
          <h3 className="font-bold text-lg flex items-center gap-2">
             <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg dark:bg-emerald-900/30"><Wallet size={20} /></div>
             Fonds de Caisse
          </h3>
          <Button onClick={() => setShowFundForm(true)} className="w-auto py-2 px-4 text-xs font-bold uppercase"><Plus size={14} className="mr-1"/> Ajouter</Button>
        </div>
        
        {showFundForm && (
          <div className="mb-6 p-5 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
             <Input label="Montant (DH)" type="number" value={newFundAmount} onChange={e => setNewFundAmount(e.target.value)} className="bg-white" />
             <div className="flex gap-3 mt-4">
               <Button onClick={handleAddFund} className="py-2 text-sm bg-emerald-600 hover:bg-emerald-700">Valider</Button>
               <Button onClick={() => setShowFundForm(false)} variant="secondary" className="py-2 text-sm">Annuler</Button>
             </div>
          </div>
        )}
        
        <div className="space-y-4 flex-grow overflow-y-auto pr-2 custom-scrollbar">
           {cashFunds.length === 0 ? <p className="text-center text-gray-400 mt-10">Aucun fonds enregistré.</p> : cashFunds.map(f => (
             <div key={f.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-white/5 rounded-xl hover:bg-white hover:shadow-md dark:hover:bg-white/10 transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center font-bold">
                      <ArrowRight size={16} className="-rotate-45" />
                   </div>
                   <div>
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">+{f.amount.toLocaleString()} DH</div>
                      <div className="text-[11px] uppercase tracking-wide opacity-50 font-medium">Apport</div>
                   </div>
                </div>
                <div className="text-right">
                   <div className="text-sm font-medium">{f.addedBy}</div>
                   <div className="text-xs opacity-50">{f.date}</div>
                </div>
             </div>
           ))}
        </div>
      </div>

      <div className="dashboard-card h-full flex flex-col">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--border-color)]">
          <h3 className="font-bold text-lg flex items-center gap-2">
             <div className="bg-rose-100 text-rose-600 p-2 rounded-lg dark:bg-rose-900/30"><Banknote size={20} /></div>
             Dépenses
          </h3>
          <Button onClick={() => setShowExpenseForm(true)} className="w-auto py-2 px-4 text-xs font-bold uppercase" variant="danger"><Plus size={14} className="mr-1"/> Nouvelle</Button>
        </div>

        {showExpenseForm && (
          <div className="mb-6 p-5 bg-rose-50/50 dark:bg-rose-900/10 rounded-xl border border-rose-100 dark:border-rose-900/30 space-y-3">
             <Input label="Catégorie" value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})} className="bg-white" />
             <Input label="Montant (DH)" type="number" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} className="bg-white" />
             <Input label="Observation" value={newExpense.observation} onChange={e => setNewExpense({...newExpense, observation: e.target.value})} className="bg-white" />
             <div className="flex gap-3 mt-4">
               <Button onClick={handleAddExpense} className="py-2 text-sm bg-rose-600 hover:bg-rose-700">Valider</Button>
               <Button onClick={() => setShowExpenseForm(false)} variant="secondary" className="py-2 text-sm">Annuler</Button>
             </div>
          </div>
        )}

        <div className="space-y-4 flex-grow overflow-y-auto pr-2 custom-scrollbar">
           {cashExpenses.length === 0 ? <p className="text-center text-gray-400 mt-10">Aucune dépense enregistrée.</p> : cashExpenses.map(e => (
             <div key={e.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-white/5 rounded-xl hover:bg-white hover:shadow-md dark:hover:bg-white/10 transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center font-bold">
                      <ArrowRight size={16} className="rotate-45" />
                   </div>
                   <div>
                      <div className="font-bold text-rose-600 dark:text-rose-400">-{e.amount.toLocaleString()} DH</div>
                      <div className="text-[11px] uppercase tracking-wide opacity-50 font-medium">{e.category}</div>
                   </div>
                </div>
                <div className="text-right">
                   <div className="text-sm font-medium truncate max-w-[120px]">{e.observation}</div>
                   <div className="text-xs opacity-50">{e.date}</div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );

  const renderStockManagement = () => {
    const categories = ['Tout', ...Array.from(new Set(stockItems.map(item => item.cat)))];
    const filteredItems = selectedCategory === 'Tout' ? stockItems : stockItems.filter(item => item.cat === selectedCategory);
    const stockValue = filteredItems.reduce((acc, item) => acc + (item.quantite * item.prix), 0);

    return (
      <div className="animate-fade-in flex flex-col h-full">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
            <div>
               <h3 className="text-2xl font-bold flex items-center gap-3 text-[var(--text-main)]">
                 <Package className="text-[var(--role-color)]" size={28}/> 
                 Gestion de Stock
               </h3>
               <p className="text-sm text-gray-400 mt-1 ml-10">Inventaire en temps réel et valorisation</p>
            </div>
            <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border border-[var(--border-color)]">
               <div className="px-4 border-r border-gray-200 dark:border-gray-700">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-0.5">Valeur Totale</span>
                  <span className="font-mono font-bold text-lg text-[var(--role-color)]">{stockValue.toLocaleString()} DH</span>
               </div>
               <Button onClick={() => setShowAddForm(true)} className="w-auto py-2.5 px-5 text-xs font-bold uppercase tracking-wide rounded-lg shadow-none hover:shadow-md"><Plus size={16} className="mr-2"/> Produit</Button>
            </div>
         </div>

         {showAddForm && (
            <div className="dashboard-card p-8 mb-8 border-2 border-[var(--role-color)]/20 animate-slide-in relative bg-gray-50/50 dark:bg-gray-900/50">
               <button onClick={() => setShowAddForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"><X size={24}/></button>
               <h4 className="font-bold text-lg mb-6 flex items-center gap-2 text-[var(--role-color)]"><Tag size={20}/> Nouveau Produit</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <Input label="Nom du produit" placeholder="Ex: Lait" value={newProduct.nom} onChange={e => setNewProduct({...newProduct, nom: e.target.value})} />
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Catégorie</label>
                     <input 
                       list="categories-list" 
                       className="w-full p-[14px] border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--role-color)] text-sm"
                       value={newProduct.cat}
                       onChange={e => setNewProduct({...newProduct, cat: e.target.value})}
                       placeholder="Choisir ou créer..."
                     />
                     <datalist id="categories-list">
                        {categories.filter(c => c !== 'Tout').map(c => <option key={c} value={c} />)}
                     </datalist>
                  </div>
                  <Input label="Prix Unitaire (DH)" type="number" placeholder="0.00" value={newProduct.prix} onChange={e => setNewProduct({...newProduct, prix: Number(e.target.value)})} />
                  <Input label="Quantité Initiale" type="number" value={newProduct.quantite} onChange={e => setNewProduct({...newProduct, quantite: Number(e.target.value)})} />
                  <Input label="Unité (Kg, L, Pcs)" placeholder="Ex: L" value={newProduct.unite} onChange={e => setNewProduct({...newProduct, unite: e.target.value})} />
               </div>
               <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                 <Button onClick={() => setShowAddForm(false)} variant="secondary" className="w-auto px-6">Annuler</Button>
                 <Button onClick={handleAddProduct} className="w-auto px-8 bg-[var(--role-color)] text-white hover:brightness-110">Ajouter au Stock</Button>
               </div>
            </div>
         )}

         <div className="flex flex-col lg:flex-row gap-8 h-full">
            {/* Left: Categories Sidebar */}
            <div className="w-full lg:w-64 flex-shrink-0">
               <div className="dashboard-card p-0 overflow-hidden h-full">
                  <div className="p-4 bg-gray-50 dark:bg-white/5 border-b border-[var(--border-color)]">
                    <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2">
                      <Layers size={14}/> Catégories
                    </h4>
                  </div>
                  <div className="p-2 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible custom-scrollbar">
                     {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`
                            flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all duration-200 text-sm font-medium whitespace-nowrap
                            ${selectedCategory === cat 
                              ? 'bg-[var(--role-color)] text-white shadow-md' 
                              : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'}
                          `}
                        >
                           {selectedCategory === cat ? <FolderOpen size={18} /> : <FolderOpen size={18} className="opacity-50"/>}
                           {cat}
                           {cat !== 'Tout' && (
                             <span className={`ml-auto text-[10px] py-0.5 px-2 rounded-full font-bold ${selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                                {stockItems.filter(i => i.cat === cat).length}
                             </span>
                           )}
                        </button>
                     ))}
                  </div>
               </div>
            </div>

            {/* Right: Items Grid */}
            <div className="flex-1">
               {filteredItems.length === 0 ? (
                 <div className="dashboard-card h-96 flex items-center justify-center flex-col opacity-50 border-dashed border-2 border-gray-300 dark:border-gray-700 bg-transparent shadow-none">
                   <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                      <Package size={48} className="text-gray-400" />
                   </div>
                   <p className="text-lg font-medium">Le stock est vide.</p>
                   <p className="text-sm text-gray-400 mt-2">Commencez par ajouter des produits.</p>
                 </div>
               ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredItems.map((item, idx) => {
                      const originalIndex = stockItems.indexOf(item);
                      const isCritical = item.quantite <= item.seuilCritique;
                      
                      return (
                        <div key={idx} className={`dashboard-card p-5 group transition-all duration-300 hover:-translate-y-1 ${isCritical ? 'border-l-4 border-l-rose-500' : 'hover:border-[var(--role-color)]'}`}>
                          <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${isCritical ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                                    <Package size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-base leading-snug">{item.nom}</h4>
                                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{item.cat}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-mono font-bold text-lg text-[var(--role-color)]">{item.prix} <span className="text-xs">DH</span></div>
                              </div>
                          </div>

                          <div className="bg-gray-50 dark:bg-black/20 rounded-xl p-4 flex justify-between items-center mb-2">
                              <div className="flex flex-col">
                                <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-0.5">Stock Actuel</span>
                                <span className={`font-mono text-2xl font-bold ${isCritical ? 'text-rose-500' : 'text-gray-800 dark:text-white'}`}>
                                  {item.quantite} <span className="text-sm font-normal text-gray-400">{item.unite}</span>
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleStockUpdate(originalIndex, -1)}
                                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-gray-700 shadow-sm hover:bg-rose-50 hover:text-rose-500 transition-colors border border-gray-200 dark:border-gray-600"
                                >
                                  <Minus size={16} />
                                </button>
                                <button 
                                  onClick={() => handleStockUpdate(originalIndex, 1)}
                                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-[var(--role-color)] text-white shadow-md hover:brightness-110 transition-transform active:scale-95"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                          </div>
                          
                          {isCritical && (
                            <div className="flex items-center gap-2 text-rose-500 text-xs font-bold animate-pulse bg-rose-50 dark:bg-rose-900/10 p-2 rounded-lg justify-center">
                                <AlertTriangle size={14} /> Stock Critique (Min: {item.seuilCritique})
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
               )}
            </div>
         </div>
      </div>
    );
  };

  const renderMealPlanning = () => (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-center">
         <div>
            <h3 className="text-2xl font-bold text-[var(--text-main)]">Planning des Repas</h3>
            <p className="text-sm text-gray-400">Organisation hebdomadaire du menu</p>
         </div>
         <Button onClick={() => setShowDishForm(true)} className="w-auto px-6 py-3 rounded-lg shadow-md"><Plus size={18} className="mr-2"/> Nouveau Plat</Button>
      </div>
      
      {showDishForm && (
        <div className="dashboard-card p-6 space-y-4 border-2 border-[var(--role-color)]/20 animate-slide-in">
           <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-lg text-[var(--role-color)]">Ajouter un plat au catalogue</h4>
              <button onClick={() => setShowDishForm(false)}><X size={20} className="text-gray-400 hover:text-red-500"/></button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Nom du plat" value={newDish.name} onChange={e => setNewDish({...newDish, name: e.target.value})} className="bg-white" />
              <div className="mb-3">
                 <label className="block text-sm font-medium mb-2">Catégorie</label>
                 <select 
                   className="w-full p-3.5 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[var(--role-color)]"
                   value={newDish.category} 
                   onChange={e => setNewDish({...newDish, category: e.target.value as MealType})}
                 >
                   <option value="PtDej">Petit Déjeuner</option>
                   <option value="Dej">Déjeuner</option>
                   <option value="Gouter">Goûter</option>
                   <option value="Diner">Dîner</option>
                 </select>
              </div>
              <Input label="Ingrédients (séparés par virgule)" value={newDish.ingredients} onChange={e => setNewDish({...newDish, ingredients: e.target.value})} className="bg-white" />
              <Input label="Coût estimé (DH)" type="number" value={newDish.cost} onChange={e => setNewDish({...newDish, cost: Number(e.target.value)})} className="bg-white" />
           </div>
           <div className="flex gap-3 justify-end pt-4">
             <Button onClick={() => setShowDishForm(false)} variant="secondary" className="w-auto px-6">Annuler</Button>
             <Button onClick={handleAddDish} className="w-auto px-6">Enregistrer le plat</Button>
           </div>
        </div>
      )}

      <div className="dashboard-card overflow-hidden p-0 border border-[var(--border-color)]">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-white/5">
            <tr>
               <th className="px-6 py-4 text-left font-bold text-gray-500 uppercase tracking-wider text-xs">Jour</th>
               <th className="px-6 py-4 text-left font-bold text-[var(--role-color)] uppercase tracking-wider text-xs">Petit Déjeuner</th>
               <th className="px-6 py-4 text-left font-bold text-[var(--role-color)] uppercase tracking-wider text-xs">Déjeuner</th>
               <th className="px-6 py-4 text-left font-bold text-[var(--role-color)] uppercase tracking-wider text-xs">Goûter</th>
               <th className="px-6 py-4 text-left font-bold text-[var(--role-color)] uppercase tracking-wider text-xs">Dîner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
             {Object.keys(weeklyPlan).map(day => (
               <tr key={day} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-5 font-bold text-base">{day}</td>
                  {(['PtDej', 'Dej', 'Gouter', 'Diner'] as MealType[]).map(type => {
                    const dishId = weeklyPlan[day][type];
                    const dish = getDish(dishId);
                    return (
                      <td key={type} className="px-6 py-4">
                        {editingSlot?.day === day && editingSlot?.type === type ? (
                          <select 
                            className="w-full p-2.5 rounded-lg border border-[var(--role-color)] shadow-sm bg-white dark:bg-gray-800 text-sm focus:outline-none"
                            onChange={(e) => handleAssignDish(e.target.value)}
                            autoFocus
                            onBlur={() => setEditingSlot(null)}
                            defaultValue=""
                          >
                             <option value="" disabled>Choisir un plat...</option>
                             {dishes.filter(d => d.category === type).map(d => (
                               <option key={d.id} value={d.id}>{d.name}</option>
                             ))}
                          </select>
                        ) : (
                          <div 
                            onClick={() => setEditingSlot({day, type})}
                            className={`
                              p-3 rounded-lg cursor-pointer border border-transparent transition-all group relative
                              ${dish ? 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-[var(--role-color)]' : 'bg-gray-50 dark:bg-white/5 border-dashed border-gray-300 text-gray-400 hover:bg-gray-100'}
                            `}
                          >
                            {dish ? (
                              <>
                                <div className="font-semibold text-sm">{dish.name}</div>
                                <div className="text-[10px] text-gray-500 mt-1 truncate">{dish.ingredients}</div>
                              </>
                            ) : (
                              <div className="flex items-center gap-2 text-xs italic"><Plus size={12}/> Ajouter</div>
                            )}
                          </div>
                        )}
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
    <div className="animate-fade-in">
       {/* Filters */}
       <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full md:w-96 relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
             <Input 
                placeholder="Rechercher un client, N° Chambre..." 
                value={clientSearchQuery}
                onChange={e => setClientSearchQuery(e.target.value)}
                className="pl-12 py-3 bg-white dark:bg-gray-800 shadow-sm border-none rounded-xl"
             />
          </div>
          <div className="flex gap-2">
             <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div> <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Libre</span>
             </div>
             <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div> <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Occupé</span>
             </div>
          </div>
       </div>

       {clientSearchQuery ? (
          <div className="dashboard-card p-0 overflow-hidden">
             <div className="p-4 bg-gray-50 dark:bg-white/5 border-b border-[var(--border-color)] font-bold">Résultats de recherche</div>
             {searchResults.length === 0 ? <p className="p-8 text-center text-gray-500">Aucun résultat trouvé.</p> : (
               <div className="divide-y divide-gray-100 dark:divide-gray-800">
                 {searchResults.map((res: any) => (
                   <div key={res.id} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--role-color)] text-white flex items-center justify-center font-bold">
                           {res.clientName.charAt(0)}
                        </div>
                        <div>
                           <div className="font-bold">{res.clientName}</div>
                           <div className="text-sm text-gray-500">{res.aptNumber} - {res.building}</div>
                        </div>
                      </div>
                      <div className="text-right">
                         <span className={`px-3 py-1 rounded-full text-xs font-bold ${res.status === 'En cours' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{res.status}</span>
                         <div className="text-xs mt-1 text-gray-400">Entrée: {res.entryDate}</div>
                      </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
       ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
             {apartments.filter(a => user?.role === UserRole.Boss || a.site === user?.site || currentSite === 'Vue Globale' || a.site === currentSite).map(apt => {
               const isOccupied = apt.currentClients.length > 0;
               return (
                 <div 
                   key={apt.id}
                   onClick={() => { setSelectedApt(apt); setShowCheckInModal(true); }}
                   className={`
                     relative p-5 rounded-2xl cursor-pointer transition-all duration-300 group
                     ${isOccupied 
                       ? 'bg-rose-50 dark:bg-rose-900/10 border-2 border-rose-200 dark:border-rose-900/30 hover:shadow-lg hover:shadow-rose-100 dark:hover:shadow-none' 
                       : 'bg-white dark:bg-gray-800 border-2 border-emerald-100 dark:border-emerald-900/20 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-50 dark:hover:shadow-none'}
                   `}
                 >
                    {/* Status Indicator */}
                    <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${isOccupied ? 'bg-rose-500 animate-pulse' : 'bg-emerald-400'}`}></div>

                    <div className="mb-4">
                       <span className="font-mono text-2xl font-bold tracking-tighter opacity-80">{apt.number}</span>
                       <div className="text-[10px] uppercase tracking-wider text-gray-400 mt-1 truncate">{apt.building}</div>
                    </div>

                    <div className="pt-4 border-t border-black/5 dark:border-white/5">
                      {isOccupied ? (
                        <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
                           <UserCheck size={16}/>
                           <span className="text-xs font-bold truncate">{apt.currentClients[0].name}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                           <CheckCircle size={16}/>
                           <span className="text-xs font-bold">Disponible</span>
                        </div>
                      )}
                    </div>
                 </div>
               );
             })}
          </div>
       )}

       {/* Modal Logic (Visual update) */}
       {showCheckInModal && selectedApt && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl w-full max-w-lg animate-fade-in shadow-2xl border border-white/10 relative">
                <button onClick={() => { setShowCheckInModal(false); setSelectedApt(null); }} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20}/></button>
                
                <h3 className="font-bold text-2xl mb-1 flex items-center gap-3">
                   <div className="p-2 bg-[var(--role-color)] text-white rounded-lg"><Home size={24}/></div>
                   Appartement {selectedApt.number}
                </h3>
                <p className="text-gray-400 mb-8 ml-14">{selectedApt.building} - {selectedApt.site}</p>
                
                {selectedApt.currentClients.length > 0 ? (
                   <div className="space-y-6">
                      <div className="p-6 bg-rose-50 dark:bg-rose-900/10 rounded-xl border border-rose-100 dark:border-rose-900/20">
                         <div className="text-xs uppercase tracking-widest text-rose-500 mb-2 font-bold">Occupant Actuel</div>
                         <div className="font-bold text-3xl text-gray-800 dark:text-white mb-1">{selectedApt.currentClients[0].name}</div>
                         <div className="text-sm text-gray-500 flex items-center gap-2"><Calendar size={14}/> Depuis le: {selectedApt.currentClients[0].entryDate}</div>
                         <div className="mt-4 inline-flex items-center px-3 py-1 bg-white rounded-full text-xs font-bold shadow-sm">Type: {selectedApt.currentClients[0].type}</div>
                      </div>
                      <Button onClick={() => handleCheckOut(selectedApt.currentClients[0].id)} className="w-full py-4 bg-white text-rose-600 border-2 border-rose-100 hover:bg-rose-50 font-bold shadow-none">Libérer l'appartement (Check-out)</Button>
                   </div>
                ) : (
                   <div className="space-y-5">
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl mb-4 text-emerald-700 dark:text-emerald-400 text-sm font-medium flex items-center gap-2">
                         <CheckCircle size={18}/> Cet appartement est prêt à accueillir un client.
                      </div>
                      <Input label="Nom du client" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="bg-gray-50" placeholder="Nom complet" />
                      <Input label="Date d'entrée" type="date" value={newClient.date} onChange={e => setNewClient({...newClient, date: e.target.value})} className="bg-gray-50" />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type d'hébergement</label>
                        <select 
                          className="w-full p-3.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-[var(--role-color)]"
                          value={newClient.type}
                          onChange={e => setNewClient({...newClient, type: e.target.value as HebergementType})}
                        >
                           <option value="1/1">1/1 (1 personne)</option>
                           <option value="1/2">1/2 (2 personnes)</option>
                           <option value="1/3">1/3 (3 personnes)</option>
                           <option value="1/4">1/4 (4 personnes)</option>
                        </select>
                      </div>
                      <Button onClick={handleCheckIn} className="w-full py-4 mt-4 shadow-lg">Valider le Check-in</Button>
                   </div>
                )}
             </div>
          </div>
       )}
    </div>
  );

  const renderBlanchisserie = () => (
    <div className="animate-fade-in">
       <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="font-bold text-2xl">Blanchisserie</h3>
            <p className="text-sm text-gray-400">Suivi du linge client</p>
          </div>
          <Button onClick={() => setShowLaundryForm(true)} className="w-auto px-6 py-3 shadow-md"><Shirt size={18} className="mr-2"/> Nouvelle demande</Button>
       </div>

       {showLaundryForm && (
         <div className="dashboard-card mb-8 p-6 border-2 border-[var(--role-color)]/20 relative">
            <button onClick={() => setShowLaundryForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><X size={20}/></button>
            <h4 className="font-bold text-lg mb-6 flex items-center gap-2 text-[var(--role-color)]"><Shirt size={20}/> Nouvelle demande de blanchisserie</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-medium mb-2">Appartement</label>
                  <select 
                    className="w-full p-3.5 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[var(--role-color)]"
                    value={newLaundryOrder.apartmentId}
                    onChange={e => setNewLaundryOrder({...newLaundryOrder, apartmentId: e.target.value, clientId: ''})}
                  >
                     <option value="">Choisir un appartement...</option>
                     {apartments.filter(a => a.currentClients.length > 0).map(a => (
                        <option key={a.id} value={a.id}>{a.number} - {a.building}</option>
                     ))}
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium mb-2">Client</label>
                  <select 
                    className="w-full p-3.5 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[var(--role-color)]"
                    value={newLaundryOrder.clientId}
                    onChange={e => setNewLaundryOrder({...newLaundryOrder, clientId: e.target.value})}
                    disabled={!newLaundryOrder.apartmentId}
                  >
                     <option value="">Choisir un client...</option>
                     {newLaundryOrder.apartmentId && apartments.find(a => a.id === newLaundryOrder.apartmentId)?.currentClients.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                     ))}
                  </select>
               </div>
               <div className="md:col-span-2">
                  <Input label="Articles (Détails)" placeholder="Ex: 2 Chemises, 1 Pantalon..." value={newLaundryOrder.items} onChange={e => setNewLaundryOrder({...newLaundryOrder, items: e.target.value})} className="bg-white" />
               </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
               <Button onClick={() => setShowLaundryForm(false)} variant="secondary" className="w-auto px-6">Annuler</Button>
               <Button onClick={handleAddLaundryOrder} className="w-auto px-6">Enregistrer</Button>
            </div>
         </div>
       )}

       <div className="grid gap-4">
          {laundryOrders.length === 0 ? <p className="text-center text-gray-400 py-10">Aucune commande de blanchisserie.</p> : laundryOrders.map(order => (
             <div key={order.id} className="dashboard-card p-5 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-[var(--role-color)]">
                <div className="flex items-center gap-5 w-full md:w-auto">
                   <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center font-bold text-xl shadow-inner">
                      <Shirt size={24} />
                   </div>
                   <div>
                      <div className="font-bold text-lg mb-1">{order.apartmentNumber} <span className="text-gray-400 mx-2">|</span> {order.clientName}</div>
                      <div className="text-sm text-gray-500 font-medium mb-1">{order.items}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={12}/> {order.date}</div>
                   </div>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                   {['En attente', 'En blanchisserie', 'En réception', 'Livré'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateLaundryStatus(order.id, status as LaundryStatus)}
                        className={`
                          px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border
                          ${order.status === status 
                            ? 'bg-[var(--role-color)] text-white border-[var(--role-color)] shadow-md' 
                            : 'bg-transparent text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400'}
                        `}
                      >
                         {status}
                      </button>
                   ))}
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  const renderRestaurant = () => (
    <div className="animate-fade-in">
       <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="font-bold text-2xl">Restauration</h3>
            <p className="text-sm text-gray-400">Gestion des bons et commandes</p>
          </div>
          <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/10 px-4 py-2 rounded-lg border border-yellow-100 dark:border-yellow-900/20">
             <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
             <span className="text-sm font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-wider">Service: {currentMealService}</span>
          </div>
       </div>

       <div className="dashboard-card mb-8 p-6 border-l-4 border-l-[var(--role-color)]">
          <h4 className="font-bold text-lg mb-6 flex items-center gap-2"><Utensils size={20} className="text-[var(--role-color)]"/> Nouveau Bon de Commande</h4>
          <div className="flex flex-col md:flex-row gap-6 items-end">
             <div className="w-full md:w-1/3 space-y-2">
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Client / Chambre</label>
               <select 
                 className="w-full p-3.5 border border-gray-300 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-[var(--role-color)]"
                 value={newRestoOrder.clientId}
                 onChange={e => setNewRestoOrder({...newRestoOrder, clientId: e.target.value})}
               >
                 <option value="">Sélectionner un client...</option>
                 {apartments.filter(a => a.currentClients.length > 0).map(a => (
                    <option key={a.currentClients[0].id} value={a.currentClients[0].id}>
                      {a.number} - {a.currentClients[0].name}
                    </option>
                 ))}
               </select>
             </div>
             <div className="w-full md:w-1/3 bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <label className="flex items-center gap-3 mb-2 cursor-pointer">
                   <input 
                     type="checkbox" 
                     checked={newRestoOrder.isDrinkOnly} 
                     onChange={e => setNewRestoOrder({...newRestoOrder, isDrinkOnly: e.target.checked})} 
                     className="w-5 h-5 rounded text-[var(--role-color)] focus:ring-[var(--role-color)]"
                   />
                   <span className="text-sm font-medium">Boissons / Extra seulement</span>
                </label>
                {newRestoOrder.isDrinkOnly && (
                   <Input 
                     placeholder="Ex: 2 Cafés, 1 Soda..." 
                     value={newRestoOrder.drinks.join(', ')} 
                     onChange={e => setNewRestoOrder({...newRestoOrder, drinks: e.target.value.split(',')})} 
                     className="mt-2 bg-white h-10 py-2 text-sm"
                   />
                )}
             </div>
             <Button onClick={handleValidateRestoOrder} className="w-full md:w-auto h-[50px] px-8 shadow-lg">Générer le Bon</Button>
          </div>
       </div>

       <div className="grid gap-4">
          {restaurantOrders.length === 0 ? <p className="text-center text-gray-400 py-10">Aucun bon de commande.</p> : restaurantOrders.map(order => (
            <div key={order.id} className="dashboard-card p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer group transition-all" onClick={() => setShowBonModal(order)}>
               <div className="flex items-center gap-5">
                  <div className="p-4 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-100 transition-colors">
                     <Utensils size={24} />
                  </div>
                  <div>
                     <div className="font-bold text-lg mb-1">{order.aptNumber} <span className="text-gray-400 font-light mx-2">|</span> {order.clientName}</div>
                     <div className="flex items-center gap-3 text-sm">
                        <span className="font-medium bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">{order.type}</span>
                        {order.mealType && <span className="text-gray-500">- {order.mealType}</span>}
                     </div>
                  </div>
               </div>
               <div className="text-right flex items-center gap-6">
                  <div>
                     <div className="text-sm font-bold">{order.time}</div>
                     <div className="text-xs text-gray-400">{order.date}</div>
                  </div>
                  <div className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                    <Printer size={20} className="text-gray-400" />
                  </div>
               </div>
            </div>
          ))}
       </div>

       {showBonModal && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white text-black p-8 shadow-2xl w-full max-w-sm font-mono text-sm relative transform rotate-1 paper-shadow">
               <button onClick={() => setShowBonModal(null)} className="absolute top-2 right-2 text-black hover:text-red-500 p-2"><X size={24}/></button>
               
               <div className="text-center border-b-2 border-black pb-6 mb-6">
                  <h2 className="text-2xl font-bold uppercase tracking-widest mb-1">Résidence Samia</h2>
                  <p className="text-xs uppercase tracking-widest mb-4">Suite Hotel & Spa</p>
                  <div className="inline-block border border-black px-4 py-1 font-bold">BON DE COMMANDE</div>
                  <p className="mt-2 text-xs">{showBonModal.site}</p>
               </div>

               <div className="space-y-3 mb-6 text-xs uppercase tracking-wide">
                  <div className="flex justify-between"><span>Date:</span> <span className="font-bold">{showBonModal.date} {showBonModal.time}</span></div>
                  <div className="flex justify-between"><span>Chambre:</span> <span className="font-bold text-lg">{showBonModal.aptNumber}</span></div>
                  <div className="flex justify-between"><span>Client:</span> <span className="font-bold">{showBonModal.clientName}</span></div>
                  <div className="flex justify-between"><span>Service:</span> <span className="font-bold">{showBonModal.mealType || 'Hors repas'}</span></div>
               </div>

               <div className="border-t-2 border-dashed border-black py-6 mb-6">
                  <div className="font-bold mb-3 underline">DÉTAIL COMMANDE:</div>
                  <ul className="list-disc pl-4 space-y-1">
                    {showBonModal.items && showBonModal.items.length > 0 ? (
                        showBonModal.items.map((item, i) => <li key={i}>{item}</li>)
                    ) : (
                        <li>Formule {showBonModal.mealType} Standard</li>
                    )}
                  </ul>
               </div>

               <div className="flex justify-between items-end mt-12 mb-4">
                  <div className="text-center w-1/2">
                     <p className="text-[10px] mb-8">Visa Réception</p>
                     <div className="h-px w-20 bg-black mx-auto"></div>
                  </div>
                  <div className="text-center w-1/2">
                     <p className="text-[10px] mb-8">Signature Client</p>
                     <div className="h-px w-20 bg-black mx-auto"></div>
                  </div>
               </div>
               
               <p className="text-center text-[10px] italic mt-4">Merci de votre visite</p>

               <Button onClick={() => window.print()} className="no-print mt-6 w-full bg-black text-white hover:bg-gray-800 py-3 uppercase tracking-widest text-xs">Imprimer le ticket</Button>
            </div>
         </div>
       )}
    </div>
  );

  const renderEmployees = () => (
    <div className="animate-fade-in">
       <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="font-bold text-2xl">Personnel</h3>
            <p className="text-sm text-gray-400">Gestion des équipes et planning</p>
          </div>
          <Button onClick={() => setShowEmployeeForm(true)} className="w-auto px-6 py-3 shadow-md"><UserPlus size={18} className="mr-2"/> Ajouter un employé</Button>
       </div>

       {showEmployeeForm && (
         <div className="dashboard-card mb-8 p-6 border-2 border-[var(--role-color)]/20 relative">
            <button onClick={() => setShowEmployeeForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><X size={20}/></button>
            <h4 className="font-bold text-lg mb-6 flex items-center gap-2 text-[var(--role-color)]"><Briefcase size={20}/> Nouveau Collaborateur</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Input label="Nom Complet" value={newEmployee.name} onChange={e => setNewEmployee({...newEmployee, name: e.target.value})} className="bg-white" />
               <Input label="Fonction / Poste" value={newEmployee.function} onChange={e => setNewEmployee({...newEmployee, function: e.target.value})} className="bg-white" />
               <Input label="Téléphone" value={newEmployee.phone} onChange={e => setNewEmployee({...newEmployee, phone: e.target.value})} className="bg-white" />
               <Input label="Salaire Mensuel (DH)" type="number" value={newEmployee.monthlySalary} onChange={e => setNewEmployee({...newEmployee, monthlySalary: Number(e.target.value)})} className="bg-white" />
               <div>
                  <label className="block text-sm mb-2 font-medium">Shift / Horaire</label>
                  <select className="w-full p-3.5 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[var(--role-color)]" value={newEmployee.shift} onChange={e => setNewEmployee({...newEmployee, shift: e.target.value as any})}>
                     <option value="Matin">Matin</option>
                     <option value="Soir">Soir</option>
                     <option value="Jour">Journée</option>
                  </select>
               </div>
            </div>
            <div className="flex gap-3 mt-8 justify-end">
               <Button onClick={() => setShowEmployeeForm(false)} variant="secondary" className="w-auto px-6">Annuler</Button>
               <Button onClick={handleAddEmployee} className="w-auto px-6">Enregistrer</Button>
            </div>
         </div>
       )}

       <div className="grid gap-4">
          {employees.length === 0 ? <p className="text-center text-gray-400 py-10">Aucun employé enregistré.</p> : employees.map(emp => (
             <div key={emp.id} className="dashboard-card p-5 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-lg transition-all group border-l-4 border-l-transparent hover:border-l-[var(--role-color)]">
                <div className="flex items-center gap-5 w-full md:w-auto">
                   <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-xl text-gray-500 shadow-inner">
                      {emp.name.substring(0,2).toUpperCase()}
                   </div>
                   <div>
                      <div className="font-bold text-lg text-[var(--text-main)] group-hover:text-[var(--role-color)] transition-colors">{emp.name}</div>
                      <div className="text-sm text-gray-500 font-medium">{emp.function} <span className="mx-2 text-gray-300">|</span> <span className="bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-xs">{emp.shift}</span></div>
                      <div className="text-xs text-gray-400 mt-1 flex items-center gap-1"><UserIcon size={12}/> {emp.phone}</div>
                   </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-8 justify-end w-full md:w-auto">
                   <div className="text-right">
                      <div className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Salaire</div>
                      <div className="text-base font-mono font-bold">{emp.monthlySalary.toLocaleString()} DH</div>
                   </div>

                   <div className="text-right">
                      <div className="text-xs uppercase tracking-widest text-rose-400 font-bold mb-1">Absences</div>
                      <div className="text-base font-bold text-rose-500">{emp.absences}</div>
                   </div>
                   
                   <div className="flex items-center bg-gray-50 dark:bg-black/20 p-1 rounded-xl border border-gray-100 dark:border-white/5">
                      <button 
                        onClick={() => updateEmployeeStatus(emp.id, 'Présent')}
                        className={`p-2.5 rounded-lg transition-all ${emp.status === 'Présent' ? 'bg-white shadow text-emerald-600' : 'text-gray-400 hover:bg-gray-200'}`}
                        title="Marquer Présent"
                      >
                         <UserCheck size={20}/>
                      </button>
                      <button 
                         onClick={() => {
                            updateEmployeeStatus(emp.id, 'Absent');
                            updateEmployeeAbsences(emp.id, emp.absences + 1);
                         }}
                         className={`p-2.5 rounded-lg transition-all ${emp.status === 'Absent' ? 'bg-white shadow text-rose-600' : 'text-gray-400 hover:bg-gray-200'}`}
                         title="Marquer Absent"
                      >
                         <UserX size={20}/>
                      </button>
                      <button 
                         onClick={() => updateEmployeeStatus(emp.id, 'Retard')}
                         className={`p-2.5 rounded-lg transition-all ${emp.status === 'Retard' ? 'bg-white shadow text-amber-600' : 'text-gray-400 hover:bg-gray-200'}`}
                         title="Marquer Retard"
                      >
                         <Clock size={20}/>
                      </button>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  const renderReports = () => (
     <div className="animate-fade-in space-y-8">
        <div>
           <h3 className="font-bold text-2xl">Analytique</h3>
           <p className="text-sm text-gray-400">Performances et rapports financiers</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <RevenueChartWidget data={revenueData} />
           <div className="dashboard-card h-[340px] flex flex-col items-center justify-center border-dashed border-2 border-gray-300 dark:border-gray-700 bg-transparent">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                 <BarChart size={32} className="text-gray-400" />
              </div>
              <h4 className="font-bold text-gray-500">Statistiques avancées</h4>
              <p className="text-sm text-gray-400 text-center max-w-xs mt-2">Le module d'analyse prédictive et de comparaison mensuelle sera bientôt disponible.</p>
           </div>
        </div>

        <div className="flex gap-4 p-6 dashboard-card items-center justify-between">
           <div>
              <h4 className="font-bold">Exporter les données</h4>
              <p className="text-xs text-gray-400">Téléchargez les rapports au format PDF ou Excel.</p>
           </div>
           <div className="flex gap-3">
              <Button onClick={() => handleExport('pdf')} className="w-auto px-6 bg-slate-800 hover:bg-slate-900 text-white"><Printer size={16} className="mr-2"/> Imprimer</Button>
              <Button onClick={() => handleExport('excel')} className="w-auto px-6 bg-emerald-600 hover:bg-emerald-700 text-white"><FileSpreadsheet size={16} className="mr-2"/> Excel</Button>
           </div>
        </div>
     </div>
  );

  // --- MAIN LAYOUT ---
  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] font-sans transition-colors duration-300">
      <Header 
        user={user} 
        currentSite={currentSite} 
        onSiteChange={setCurrentSite} 
        onLogout={onLogout} 
        onThemeToggle={handleThemeToggle}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <Sidebar 
        role={user.role} 
        activeItem={activeMenu} 
        onItemClick={setActiveMenu} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main 
        className={`
          flex-grow pt-28 px-4 md:px-10 pb-12
          transition-all duration-300 ease-in-out
          md:ml-[270px] 
          max-w-[1920px] mx-auto w-full
        `}
      >
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 animate-fade-in">
          <div>
             <h2 className="text-4xl font-bold tracking-tight text-[var(--text-main)]">{activeMenu}</h2>
             <p className="text-gray-400 text-sm mt-1">Bienvenue dans votre espace de gestion, {user.username}.</p>
          </div>
          <div className="flex gap-3">
             <button className="bg-white dark:bg-gray-800 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm flex items-center gap-2">
                <Download size={16}/> <span>Export Rapide</span>
             </button>
          </div>
        </div>
        
        {/* Content Area */}
        {activeMenu === 'Tableau de bord' ? renderDashboardContent() :
         activeMenu === 'Caisse' ? renderCaisse() :
         activeMenu === 'Gestion de stock' ? renderStockManagement() :
         activeMenu === 'Planning des repas' ? renderMealPlanning() :
         activeMenu === 'Appartements' ? renderAppartements() :
         activeMenu === 'Blanchisserie' ? renderBlanchisserie() :
         activeMenu === 'Bons de restauration' ? renderRestaurant() :
         activeMenu === 'Les employés' || activeMenu === 'Présence' ? renderEmployees() :
         activeMenu === 'Rapports' ? renderReports() :
         activeMenu === 'Paramètres' ? renderSettings() :
         (
           <div className="dashboard-card h-96 flex items-center justify-center flex-col opacity-50 border-dashed border-2 border-gray-300 dark:border-gray-700 bg-transparent shadow-none">
              <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                 <Package size={48} className="text-gray-400" />
              </div>
              <p className="text-lg font-medium">Le module <span className="font-bold">"{activeMenu}"</span> est en cours de développement.</p>
              <p className="text-sm text-gray-400 mt-2">Veuillez revenir plus tard.</p>
           </div>
         )
        }
      </main>
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
      setError('Accès refusé. Vérifiez vos identifiants.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden text-gray-200 px-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
         <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-brand-gold/5 blur-[120px] animate-pulse-slow"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-900/10 blur-[100px]"></div>
      </div>

      <div className="w-full max-w-sm md:max-w-md z-10 animate-fade-in-up">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative group hover:border-brand-gold/20 transition-all duration-500">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-70"></div>

           <div className="p-6 md:p-8">
              <div className="text-center mb-6 md:mb-8">
                <div className="inline-block p-1 rounded-full border border-brand-gold/30 mb-4 bg-black/20 shadow-lg">
                   <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-white/90 flex items-center justify-center">
                      <img src={LOGO_URL} alt="Logo" className="w-full h-full object-cover" />
                   </div>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide font-serif mb-2">Résidence Samia</h1>
                <p className="text-xs text-brand-gold font-medium uppercase tracking-[0.2em]">L'art de l'hospitalité</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-3 tracking-wider text-center">Sélectionnez votre poste</label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-gold transition-colors duration-300 pointer-events-none z-10">
                        <Briefcase size={18} />
                    </div>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full p-[14px] pl-10 appearance-none bg-black/30 border-white/10 !text-white focus:bg-black/50 border-none rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all duration-300"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r} className="text-black bg-white">{r}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                       <ChevronDown size={18} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Input 
                    icon={UserProfileIcon}
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="Identifiant"
                    className="bg-black/30 border-white/10 !text-white placeholder-gray-500 focus:bg-black/50 border-none rounded-lg"
                  />
                  
                  <Input 
                    icon={Lock}
                    type="password"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Mot de passe"
                    className="bg-black/30 border-white/10 !text-white placeholder-gray-500 focus:bg-black/50 border-none rounded-lg"
                  />
                </div>

                {error && (
                  <div className="text-red-400 text-xs text-center bg-red-900/20 p-2 rounded border border-red-500/20 flex items-center justify-center gap-2 animate-pulse">
                    <AlertTriangle size={12}/> {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full py-3.5 bg-gradient-to-r from-brand-gold to-yellow-600 text-black font-bold rounded-lg shadow-lg hover:shadow-brand-gold/20 hover:scale-[1.01] transition-all duration-300 text-sm tracking-wide uppercase border-none"
                >
                   Connexion Sécurisée
                </Button>
              </form>
           </div>
           
           <div className="bg-black/20 py-3 px-8 text-center border-t border-white/5">
              <p className="text-[10px] text-gray-500">© 2025 Résidence Samia Suite Hotel. Accès restreint.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => AuthService.getPersistedUser());
  const [loading, setLoading] = useState(true);

  const handleLogin = (u: User) => {
    setUser(u);
    AuthService.persistUser(u, true);
  };

  const handleLogout = () => {
    setUser(null);
    AuthService.logout();
  };

  if (loading) {
    return <LoadingScreen onFinished={() => setLoading(false)} />;
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/*" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;