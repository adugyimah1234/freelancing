// src/context/impersonation-context.tsx
'use client';
import type { User, Role as UserRoleType, Branch } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { apiService } from '@/lib/apiService';

interface ImpersonationContextType {
  impersonatedUser: User | null;
  originalUser: User | null;
  currentEffectiveUser: User | null;
  isImpersonating: boolean;
  startImpersonation: (userToImpersonate: User) => void;
  stopImpersonation: () => void;
  allUsersForImpersonation: User[];
  isLoadingOriginalUser: boolean;
}

const ImpersonationContext = createContext<ImpersonationContextType | undefined>(undefined);

const getDefaultUser = (): User => ({
  id: 0,
  name: 'Guest',
  email: 'guest@example.com',
  role: { id: 'guest-role', name: 'Guest' } as UserRoleType,
  status: 'active',
  avatarUrl: undefined,
  branch: undefined,
  lastLogin: null,
});


export const ImpersonationProvider = ({ children }: { children: ReactNode }) => {
  const [impersonatedUser, setImpersonatedUser] = useState<User | null>(null);
  const [originalUser, setOriginalUser] = useState<User | null>(null); // Initialize as null
  const [allUsersForImpersonation, setAllUsersForImpersonation] = useState<User[]>([]);
  const [isLoadingOriginalUser, setIsLoadingOriginalUser] = useState(true);
  const [isClient, setIsClient] = useState(false); // New state

  useEffect(() => {
    setIsClient(true); // Set to true once component mounts on client
  }, []);

  // Effect to load originalUser from localStorage on initial mount, only on client
  useEffect(() => {
    if (isClient) {
      setIsLoadingOriginalUser(true);
      const storedUser = localStorage.getItem('originalUser');
      if (storedUser) {
        try {
          setOriginalUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Failed to parse originalUser from localStorage", error);
          setOriginalUser(getDefaultUser()); 
          localStorage.removeItem('originalUser');
        }
      } else {
        // If no user in localStorage (e.g. not logged in), set to a default or null.
        // Setting to getDefaultUser() helps avoid null checks for currentEffectiveUser if we want a guest state.
        // If strict "must be logged in" is desired, originalUser could remain null and app layout handles it.
        setOriginalUser(null); // Or getDefaultUser() if a guest-like state is preferred before login
      }
      setIsLoadingOriginalUser(false);
    }
  }, [isClient]);

  // Effect to load impersonatedUser from localStorage
  useEffect(() => {
    if (isClient && originalUser && originalUser.role?.name === 'Super Admin') {
      const impersonatedUserIdStr = localStorage.getItem('impersonatedUserId');
      if (impersonatedUserIdStr) {
        const impersonatedUserId = parseInt(impersonatedUserIdStr, 10);
        // Ensure allUsersForImpersonation is populated before finding
        if (allUsersForImpersonation.length > 0) {
            const userToImpersonate = allUsersForImpersonation.find(u => u.id === impersonatedUserId);
            if (userToImpersonate) {
              setImpersonatedUser(userToImpersonate);
            } else {
              localStorage.removeItem('impersonatedUserId'); // Clean up if user not found
            }
        } else if (!isLoadingOriginalUser && originalUser?.role?.name === 'Super Admin'){
            // This means allUsersForImpersonation might still be fetching.
            // The effect dependency on allUsersForImpersonation will re-run this.
        }
      }
    } else if (isClient) { // if not super admin or no original user on client, clear impersonation
        setImpersonatedUser(null);
        if (localStorage.getItem('impersonatedUserId')) { // only remove if it exists
            localStorage.removeItem('impersonatedUserId');
        }
    }
  }, [isClient, originalUser, allUsersForImpersonation, isLoadingOriginalUser]);

  // Fetch all users if the originalUser is a Super Admin
  useEffect(() => {
    if (isClient && originalUser && originalUser.role?.name === 'Super Admin') {
      apiService.get<User[]>('/users')
        .then(users => {
          setAllUsersForImpersonation(users.filter(u => u.id !== originalUser.id));
        })
        .catch(error => {
          console.error("Failed to fetch users for impersonation:", error);
          setAllUsersForImpersonation([]);
        });
    } else if (isClient) {
      setAllUsersForImpersonation([]);
    }
  }, [isClient, originalUser]);


  const startImpersonation = useCallback((userToImpersonate: User) => {
    if (isClient && originalUser && originalUser.role?.name === 'Super Admin') {
      setImpersonatedUser(userToImpersonate);
      localStorage.setItem('impersonatedUserId', userToImpersonate.id.toString());
    }
  }, [isClient, originalUser]);

  const stopImpersonation = useCallback(() => {
    if (isClient) {
        setImpersonatedUser(null);
        localStorage.removeItem('impersonatedUserId');
    }
  }, [isClient]);

  // Determine currentEffectiveUser. originalUser could be null initially or if not logged in.
  const currentEffectiveUser = impersonatedUser || originalUser;
  const isImpersonating = !!impersonatedUser && !!originalUser && originalUser.role?.name === 'Super Admin';


  return (
    <ImpersonationContext.Provider
      value={{
        impersonatedUser,
        originalUser,
        currentEffectiveUser,
        isImpersonating,
        startImpersonation,
        stopImpersonation,
        allUsersForImpersonation,
        isLoadingOriginalUser,
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