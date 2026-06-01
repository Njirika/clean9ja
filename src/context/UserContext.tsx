import React, { createContext, useContext, useState, useEffect } from 'react';

import { User } from '../types/database';
import { api, tokenStore, ApiUser } from '../lib/api';

interface UserLocation {
  state: string;
  city: string;
  lga: string;
  town: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

interface UserContextType {
  isAuthenticated: boolean;
  isOnboarded: boolean;
  location: UserLocation | null;
  currentUser: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  completeOnboarding: (location: UserLocation) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

/** Map the backend's camelCase user onto the app's snake_case `User` type. */
function mapApiUser(u: ApiUser): User {
  return {
    id: u.id,
    first_name: u.firstName,
    last_name: u.lastName,
    email: u.email,
    phone: u.phone,
    password_hash: '',
    role: u.role,
    avatar_url: u.avatarUrl,
    is_verified: u.isVerified,
    preferred_language: (u.preferredLanguage as User['preferred_language']) || 'en',
    created_at: u.createdAt,
    updated_at: u.createdAt,
  };
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(true);
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Rehydrate session: restore location + re-validate the stored token.
  useEffect(() => {
    const savedLocation = localStorage.getItem('cn_location');
    if (savedLocation) {
      setLocation(JSON.parse(savedLocation));
      setIsOnboarded(true);
    }

    if (tokenStore.get()) {
      api.auth
        .me()
        .then(({ user }) => {
          setCurrentUser(mapApiUser(user));
          setIsAuthenticated(true);
        })
        .catch(() => {
          // Token expired/invalid — clear it.
          tokenStore.clear();
          setIsAuthenticated(false);
          setCurrentUser(null);
        });
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const { user, token } = await api.auth.login(credentials);
    tokenStore.set(token);
    setCurrentUser(mapApiUser(user));
    setIsAuthenticated(true);
  };

  const register = async (data: RegisterData) => {
    const { user, token } = await api.auth.register(data);
    tokenStore.set(token);
    setCurrentUser(mapApiUser(user));
    setIsAuthenticated(true);
  };

  const logout = () => {
    api.auth.logout().catch(() => {
      /* best-effort server-side cookie clear */
    });
    tokenStore.clear();
    setIsAuthenticated(false);
    setIsOnboarded(false);
    setLocation(null);
    setCurrentUser(null);
    localStorage.removeItem('cn_location');
  };

  const completeOnboarding = (loc: UserLocation) => {
    setLocation(loc);
    setIsOnboarded(true);
    localStorage.setItem('cn_location', JSON.stringify(loc));
  };

  return (
    <UserContext.Provider
      value={{ isAuthenticated, isOnboarded, location, currentUser, login, register, logout, completeOnboarding }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
