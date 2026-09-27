import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User;
  token: string | null;
  role: 'entrepreneur' | 'customer' | 'admin';
  switchRole: (role: 'entrepreneur' | 'customer' | 'admin') => Promise<void>;
  login: (email: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const DEFAULT_USER: User = {
  id: 'user-artisan-1',
  name: 'Sunita Devi',
  email: 'sunita@gramai.org',
  role: 'entrepreneur',
  phone: '+91 98234 56789',
  location: 'Madhubani District',
  state: 'Bihar',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
  bio: 'Master artisan in Madhubani traditional hand-painted Tussar silk & cotton textiles, leader of Mithila Women Self-Help Group (28 weavers).',
  shgName: 'Mithila Shakti SHG',
  joinedDate: '2024-03-12'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_USER);
  const [token, setToken] = useState<string | null>(localStorage.getItem('gramai_token') || 'demo_token_artisan');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Attempt to fetch current user session
    const fetchMe = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setCurrentUser(data.user);
          }
        }
      } catch (e) {
        console.warn('Auth check fallback to local state', e);
      }
    };
    fetchMe();
  }, [token]);

  const switchRole = async (newRole: 'entrepreneur' | 'customer' | 'admin') => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setToken(data.token);
        localStorage.setItem('gramai_token', data.token);
      }
    } catch (e) {
      console.error('Role switch failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setToken(data.token);
        localStorage.setItem('gramai_token', data.token);
      }
    } catch (e) {
      console.error('Login failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('gramai_token');
    switchRole('customer');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        role: currentUser.role,
        switchRole,
        login,
        logout,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
