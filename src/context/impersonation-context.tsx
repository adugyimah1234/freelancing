// src/context/impersonation-context.tsx
'use client';
import type { User, Role as UserRoleType, Branch } from '@/types'; // MOCK_USER, MOCK_USERS no longer needed here
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { apiService } from '@/lib/apiService'; // For fetching all users

interface ImpersonationContextType {
  impersonatedUser: User | null;
  originalUser: User | null; // Can be null until fetched
  currentEffectiveUser: User | null; // Can be null until originalUser is fetched
  isImpersonating: boolean;
  startImpersonation: (userToImpersonate: User) => void;
  stopImpersonation: () => void;
  allUsersForImpersonation: User[]; // List of users a Super Admin can impersonate
  isLoadingOriginalUser: boolean;
}

const ImpersonationContext = createContext<ImpersonationContextType | undefined>(undefined);

// A default/fallback user structure if localStorage is empty or parsing fails
const getDefaultUser = (): User => ({
  id: 0, // Default ID, will be overridden
  name: 'Guest',
  email: 'guest@example.com',
  role: { id: 'guest', name: 'Guest' } as UserRoleType, // Default Role
  status: 'active',
  avatarUrl: undefined,
  branch: undefined,
  lastLogin: null,
});


export const ImpersonationProvider = ({ children }: { children: ReactNode }) => {
  const [impersonatedUser, setImpersonatedUser] = useState<User | null>(null);
  const [originalUser, setOriginalUser] = useState<User | null>(null);
  const [allUsersForImpersonation, setAllUsersForImpersonation] = useState<User[]>([]);
  const [isLoadingOriginalUser, setIsLoadingOriginalUser] = useState(true);

  // Effect to load originalUser from localStorage on initial mount
  useEffect(() => {
    setIsLoadingOriginalUser(true);
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('originalUser');
      if (storedUser) {
        try {
          setOriginalUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Failed to parse originalUser from localStorage", error);
          setOriginalUser(getDefaultUser()); // Fallback
          localStorage.removeItem('originalUser'); // Clear corrupted data
        }
      } else {
        // If no user in localStorage, might be logged out or first visit
        // Could redirect to login or set a guest user if app supports it.
        // For now, assuming redirection happens elsewhere if token is missing.
         setOriginalUser(getDefaultUser()); 
      }
    }
    setIsLoadingOriginalUser(false);
  }, []);

  // Effect to load impersonatedUser from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && originalUser && originalUser.role?.name === 'Super Admin') {
      const impersonatedUserIdStr = localStorage.getItem('impersonatedUserId');
      if (impersonatedUserIdStr) {
        const impersonatedUserId = parseInt(impersonatedUserIdStr, 10);
        // Fetch all users to find the one to impersonate.
        // This assumes 'allUsersForImpersonation' will be populated.
        // A better approach might be to fetch the specific user by ID if an endpoint exists.
        const userToImpersonate = allUsersForImpersonation.find(u => u.id === impersonatedUserId);
        if (userToImpersonate) {
          setImpersonatedUser(userToImpersonate);
        } else {
          localStorage.removeItem('impersonatedUserId'); // Clean up if user not found
        }
      }
    }
  }, [originalUser, allUsersForImpersonation]); // Re-run if originalUser or allUsers changes

  // Fetch all users if the originalUser is a Super Admin (for the impersonation dropdown)
  useEffect(() => {
    if (originalUser && originalUser.role?.name === 'Super Admin') {
      apiService.get<User[]>('/users')
        .then(users => {
          setAllUsersForImpersonation(users.filter(u => u.id !== originalUser.id)); // Exclude self
        })
        .catch(error => {
          console.error("Failed to fetch users for impersonation:", error);
          setAllUsersForImpersonation([]);
        });
    } else {
      setAllUsersForImpersonation([]); // Clear if not Super Admin
    }
  }, [originalUser]);


  const startImpersonation = useCallback((userToImpersonate: User) => {
    if (originalUser && originalUser.role?.name === 'Super Admin') {
      setImpersonatedUser(userToImpersonate);
      if (typeof window !== 'undefined') {
        localStorage.setItem('impersonatedUserId', userToImpersonate.id.toString());
      }
    }
  }, [originalUser]);

  const stopImpersonation = useCallback(() => {
    setImpersonatedUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('impersonatedUserId');
    }
  }, []);

  const currentEffectiveUser = impersonatedUser || originalUser;
  const isImpersonating = !!impersonatedUser && originalUser?.role?.name === 'Super Admin';


  if (isLoadingOriginalUser && typeof window !== 'undefined' && !localStorage.getItem('accessToken')) {
    // If still loading and no access token, probably means user is not logged in or session expired.
    // Let other parts of the app (like apiService or router middleware) handle redirection.
    // For now, we'll provide default values to prevent app crash.
     return (
      <ImpersonationContext.Provider
        value={{
          impersonatedUser: null,
          originalUser: getDefaultUser(),
          currentEffectiveUser: getDefaultUser(),
          isImpersonating: false,
          startImpersonation: () => {},
          stopImpersonation: () => {},
          allUsersForImpersonation: [],
          isLoadingOriginalUser: true, // still true
        }}
      >
        {children}
      </ImpersonationContext.Provider>
    );
  }


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
