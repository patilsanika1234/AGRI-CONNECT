
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../types';
import { addLog } from '../services/activityService';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (user: User) => {
    const loginTime = Date.now();
    const userWithSession = { ...user, loginTime };
    setUser(userWithSession);
    sessionStorage.setItem('user', JSON.stringify(userWithSession));
    addLog(userWithSession.name, 'Logged into the platform', 'Auth', loginTime);
  };

  const logout = () => {
    if (user) {
        addLog(user.name, 'Logged out', 'Auth', user.loginTime);
    }
    setUser(null);
    sessionStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
