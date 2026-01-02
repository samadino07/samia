import { MOCK_USERS } from '../constants';
import { User, UserRole } from '../types';

export const AuthService = {
  validateUser: (username: string, password: string, role: UserRole): User | undefined => {
    return MOCK_USERS.find(
      u => u.username === username && u.password === password && u.role === role
    ) as User | undefined;
  },

  persistUser: (user: User, remember: boolean): void => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('loggedUser', JSON.stringify(user));
  },

  getPersistedUser: (): User | null => {
    // Check session first, then local
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