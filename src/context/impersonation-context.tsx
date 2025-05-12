
'use client';
import type { User } from '@/types';
import { MOCK_USER as DEFAULT_SUPER_ADMIN_USER, MOCK_USERS } from '@/lib/constants';
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

interface ImpersonationContextType {
  impersonatedUser: User | null;
  originalUser: User; // This is the actual logged-in user (Super Admin)
  currentEffectiveUser: User; // The user whose perspective is currently active
  isImpersonating: boolean;
  startImpersonation: (userToImpersonate: User) => void;
  stopImpersonation: () => void;
}

const ImpersonationContext = createContext<ImpersonationContextType | undefined>(undefined);

export const ImpersonationProvider = ({ children }: { children: ReactNode }) => {
  const [impersonatedUser, setImpersonatedUser] = useState<User | null>(null);
  // originalUser is always the Super Admin who initiated the session.
  const originalUser = DEFAULT_SUPER_ADMIN_USER;

  const startImpersonation = useCallback((userToImpersonate: User) => {
    if (originalUser.role === 'Super Admin') {
      setImpersonatedUser(userToImpersonate);
      localStorage.setItem('impersonatedUserId', userToImpersonate.id);
    }
  }, [originalUser.role]);

  const stopImpersonation = useCallback(() => {
    setImpersonatedUser(null);
    localStorage.removeItem('impersonatedUserId');
  }, []);

  useEffect(() => {
    const impersonatedUserId = localStorage.getItem('impersonatedUserId');
    if (impersonatedUserId && originalUser.role === 'Super Admin') {
      const userToImpersonate = MOCK_USERS.find(u => u.id === impersonatedUserId);
      if (userToImpersonate) {
        setImpersonatedUser(userToImpersonate);
      } else {
        localStorage.removeItem('impersonatedUserId'); // Clean up if user not found
      }
    }
  }, [originalUser.role]); // MOCK_USERS is stable, not needed in deps. originalUser.role ensures this runs once SUPER_ADMIN_USER is resolved.

  const currentEffectiveUser = impersonatedUser || originalUser;
  const isImpersonating = !!impersonatedUser;

  return (
    <ImpersonationContext.Provider
      value={{
        impersonatedUser,
        originalUser,
        currentEffectiveUser,
        isImpersonating,
        startImpersonation,
        stopImpersonation,
      }}
    >
      {children}
    </ImpersonationContext.Provider>
  );
};

export const useImpersonation = () => {
  const context = useContext(ImpersonationContext);
  if (context === undefined) {
    throw new Error('useImpersonation must be used within an ImpersonationProvider');
  }
  return context;
};
