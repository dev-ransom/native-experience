import {
  signIn as appwriteSignIn,
  signUp as appwriteSignUp,
  signOut as appwriteSignOut,
  updateEmail as appwriteUpdateEmail,
  updateName as appwriteUpdateName,
  updatePhone as appwriteUpdatePhone,
  verifyEmail as appwriteVerifyEmail,
  verifyPhone as appwriteVerifyPhone,
  getCurrentUser,
} from "@/services/appwrite";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  $id: string;
  name: string;
  email: string;
  phone: string;
  emailVerification: boolean;
  phoneVerification: boolean;
  registration: string;
  accessedAt: string;
  mfa: boolean;
  prefs: Record<string, any>;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  updateEmail: (email: string, password: string) => Promise<void>;
  updatePhone: (phone: string, password: string) => Promise<void>;
  verifyEmail: (userId: string, secret: string) => Promise<void>;
  verifyPhone: (userId: string, secret: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then((user) => {
      setUser(user as User | null);
      setLoading(false);
    });
  }, []);

  const refreshUser = async () => {
    const u = await getCurrentUser();
    setUser(u as User | null);
  };

  const signIn = async (email: string, password: string) => {
    await appwriteSignIn(email, password);
    const user = await getCurrentUser();
    setUser(user as User | null);
  };

  const signUp = async (email: string, password: string, name: string) => {
    await appwriteSignUp(email, password, name);
    await appwriteSignIn(email, password);
    const user = await getCurrentUser();
    setUser(user as User | null);
  };

  const signOut = async () => {
    await appwriteSignOut();
    setUser(null);
  };

  const verifyEmail = async (userId: string, secret: string) => {
    await appwriteVerifyEmail(userId, secret);
  };

  const verifyPhone = async (userId: string, secret: string) => {
    await appwriteVerifyPhone(userId, secret);
  };

  const updateName = async (name: string) => {
    await appwriteUpdateName(name);
    setUser((prev) => (prev ? { ...prev, name } : prev));
  };

  const updateEmail = async (email: string, password: string) => {
    await appwriteUpdateEmail(email, password);
    setUser((prev) => (prev ? { ...prev, email } : prev));
  };

  const updatePhone = async (phone: string, password: string) => {
    await appwriteUpdatePhone(phone, password);
    setUser((prev) => (prev ? { ...prev, phone } : prev));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateName,
        refreshUser,
        updateEmail,
        updatePhone,
        verifyEmail,
        verifyPhone
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
