import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { localStore, DEFAULT_USERS, initializeLocalStorage } from '../data/initialSeed';
import { auth, isFirebaseConfigured } from '../services/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from 'firebase/auth';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: Partial<UserProfile>, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  switchUserRoleDemo: (role: UserRole) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  logout: () => Promise<void>;
  isFirebaseActive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeLocalStorage();

    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          const storedUsers = localStore.getAllUsers();
          const matched = storedUsers.find((u) => u.uid === fbUser.uid || u.email === fbUser.email);
          if (matched) {
            setUser(matched);
            localStore.setCurrentUser(matched);
          } else {
            const newUser: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName: fbUser.displayName || 'Bazaar One Shopper',
              role: 'customer',
              avatarUrl: fbUser.photoURL || undefined,
              isVerified: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            storedUsers.push(newUser);
            localStore.saveUsers(storedUsers);
            localStore.setCurrentUser(newUser);
            setUser(newUser);
          }
        } else {
          // If no firebase user, fall back to locally saved session
          const current = localStore.getCurrentUser();
          setUser(current);
        }
        setIsLoading(false);
      });
      return () => unsubscribe();
    } else {
      const current = localStore.getCurrentUser();
      setUser(current);
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        await signInWithEmailAndPassword(auth, email, pass);
      }
      const users = localStore.getAllUsers();
      const matched = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        setUser(matched);
        localStore.setCurrentUser(matched);
        setIsLoading(false);
        return { success: true };
      }
      // Demo fallback if not in list
      const demoUser: UserProfile = {
        uid: 'user-' + Date.now(),
        email,
        displayName: email.split('@')[0],
        role: 'customer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      users.push(demoUser);
      localStore.saveUsers(users);
      localStore.setCurrentUser(demoUser);
      setUser(demoUser);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Login failed. Please check your credentials.' };
    }
  };

  const register = async (data: Partial<UserProfile>, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      let uid = 'user-' + Date.now();
      if (isFirebaseConfigured && auth && data.email) {
        const cred = await createUserWithEmailAndPassword(auth, data.email, pass);
        uid = cred.user.uid;
      }
      const newUser: UserProfile = {
        uid,
        email: data.email || '',
        displayName: data.displayName || 'Bazaar Member',
        phoneNumber: data.phoneNumber,
        role: data.role || 'customer',
        shopId: data.shopId,
        address: data.address,
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const users = localStore.getAllUsers();
      users.push(newUser);
      localStore.saveUsers(users);
      localStore.setCurrentUser(newUser);
      setUser(newUser);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Registration failed.' };
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    if (!isFirebaseConfigured || !auth) {
      // In local mode, simulate immediate Google login
      const googleDemo = DEFAULT_USERS[0];
      setUser(googleDemo);
      localStore.setCurrentUser(googleDemo);
      return { success: true };
    }
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Google Sign-In failed.' };
    }
  };

  const switchUserRoleDemo = (role: UserRole) => {
    const users = localStore.getAllUsers();
    let target = users.find((u) => u.role === role);
    if (!target) {
      target = DEFAULT_USERS.find((u) => u.role === role);
    }
    if (target) {
      setUser(target);
      localStore.setCurrentUser(target);
    }
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data, updatedAt: new Date().toISOString() };
    setUser(updated);
    localStore.setCurrentUser(updated);
    const all = localStore.getAllUsers().map((u) => (u.uid === updated.uid ? updated : u));
    localStore.saveUsers(all);
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.error(e);
      }
    }
    setUser(null);
    localStore.setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'customer',
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        switchUserRoleDemo,
        updateProfile,
        logout,
        isFirebaseActive: isFirebaseConfigured,
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
