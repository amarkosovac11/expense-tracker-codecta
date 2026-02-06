import { useEffect, useState } from "react";
import { mockAuth } from "../services/mockAuth";
import type { User } from "../types/models";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userId = mockAuth.getSessionUserId();
    if (userId) {
      setUser({
        id: userId,
        name: "",
        email: "",
        passwordHash: "",
      });
    }
  }, []);

  const isLoggedIn = !!user;

  const login = (email: string, password: string) => {
    const u = mockAuth.login(email, password);
    setUser(u);
  };

  const register = (name: string, email: string, password: string) => {
    const u = mockAuth.register(name, email, password);
    setUser(u);
  };

  const logout = () => {
    mockAuth.logout();
    setUser(null);
  };

  return {
    user,
    userId: user?.id ?? null,
    isLoggedIn,
    login,
    register,
    logout,
  };
}

