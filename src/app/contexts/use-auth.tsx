'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

type UserType = 'user' | 'hospital' | null;

interface AuthContextType {
  isOnboarded: boolean;
  userType: UserType;
  isRegistrationModalOpen: boolean;
  isHospitalVerified: boolean;
  setIsOnboarded: (value: boolean) => void;
  setUserType: (type: UserType) => void;
  openRegistrationModal: () => void;
  closeRegistrationModal: () => void;
  setIsHospitalVerified: (value: boolean) => void;
  completeOnboarding: (type: 'user' | 'hospital') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState<boolean>(false);
  const [isHospitalVerified, setIsHospitalVerified] = useState<boolean>(false);

  useEffect(() => {
    // setIsOnboarded(true);
    setIsRegistrationModalOpen(true);
  }, []);

  const openRegistrationModal = () => setIsRegistrationModalOpen(true);
  const closeRegistrationModal = () => {
    // localStorage.setItem('isRegistrationModalOpen', 'false');
    setIsRegistrationModalOpen(false);
  };

  const completeOnboarding = (type: 'user' | 'hospital') => {
    setUserType(type);
    setIsOnboarded(true);
    setIsRegistrationModalOpen(false);

    // Save to localStorage
    localStorage.setItem('userType', type);
    localStorage.setItem('isOnboarded', 'true');
  };

  return (
    <AuthContext.Provider
      value={{
        isOnboarded,
        userType,
        isRegistrationModalOpen,
        isHospitalVerified,
        setIsOnboarded,
        setUserType,
        openRegistrationModal,
        closeRegistrationModal,
        setIsHospitalVerified,
        completeOnboarding
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};