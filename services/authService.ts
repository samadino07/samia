import { MOCK_USERS } from '../constants';
import { User, UserRole } from '../types';

const USERS_STORAGE_KEY = 'rs_manager_users';

export const AuthService = {
  // Get users from LocalStorage or fallback to MOCK_USERS
  getUsers: (): User[] => {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with mock users if nothing in storage
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(MOCK_USERS));
    return MOCK_USERS;
  },

  // Save users to LocalStorage
  saveUsers: (users: User[]): void => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  },

  validateUser: (username: string, password: string, role: UserRole): User | undefined => {
    // Always get the latest list of users from storage
    const users = AuthService.getUsers();
    return users.find(
      u => u.username === username && u.password === password && u.role === role
    ) as User | undefined;
  },

  persistUser: (user: User, remember: boolean): void => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('loggedUser', JSON.stringify(user));
  },

  getPersistedUser: (): User | null => {
    const session = sessionStorage.getItem('loggedUser');
    if (session) return JSON.parse(session);
    
    const local = localStorage.getItem('loggedUser');
    if (local) return JSON.parse(local);
    
    return null;
  },

  logout: (): void => {
    localStorage.removeItem('loggedUser');
    sessionStorage.removeItem('loggedUser');
  }
};