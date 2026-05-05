import React, { createContext, useContext, useEffect, useState } from "react";
import {
  apiClient,
  AuthResponse,
  LoginCredentials,
  SignupData,
  User,
} from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  signup: (data: SignupData) => Promise<AuthResponse>;
  logout: () => void;
  refreshUser: () => Promise<User | null>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = apiClient.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await apiClient.login(credentials);
    setUser(response.user);
    return response;
  };

  const signup = async (data: SignupData) => {
    const response = await apiClient.signup(data);
    setUser(response.user);
    return response;
  };

  const refreshUser = async () => {
    if (!apiClient.isAuthenticated()) {
      setUser(null);
      return null;
    }
    const nextUser = await apiClient.getMe();
    setUser(nextUser);
    return nextUser;
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
