import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  location?: string;
  role?: 'entrepreneur' | 'customer';
}

interface AuthContextType {
  currentUser: User;
  token: string | null;
  role: 'entrepreneur' | 'customer' | 'admin';
  switchRole: (role: 'entrepreneur' | 'customer' | 'admin') => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const DEFAULT_USER: User = {
  id: 'user-artisan-1',
  name: 'Vedant Mishra',
  email: 'vedant.mishra@gramai.in',
  role: 'entrepreneur',
  phone: '+91 94310 44521',
  location: 'Varanasi Craft & Tech Hub',
  state: 'Uttar Pradesh',
  avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Vedant%20Mishra',
  bio: 'Lead Producer & Entrepreneur Coordinator at Mishra Rural Guild.',
  shgName: 'Mishra Rural Guild & Tech Labs',
  joinedDate: '2024-01-01',
  accountStatus: 'active',
  lastLoginAt: null,
  lastLoginType: 'recent',
  failedLoginAttempts: 0,
  loginHistory: [],
  suspensionAuditTrail: []
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_USER);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('gramai_token') || 'demo_token_artisan'
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) return;
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setCurrentUser(data.user);
          }
        }
      } catch (e) {
        console.warn('Auth check fallback', e);
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

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid email or password.');
      }
      setCurrentUser(data.user);
      setToken(data.token);
      localStorage.setItem('gramai_token', data.token);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }
      setCurrentUser(data.user);
      setToken(data.token);
      localStorage.setItem('gramai_token', data.token);
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
        register,
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
