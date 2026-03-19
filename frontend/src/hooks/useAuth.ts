import { useEffect, useState } from "react";
import type { User } from "../types/models";
import { loginRequest, registerRequest } from "../api/authService";

const USER_KEY = "user";
const TOKEN_KEY = "token";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isLoggedIn = !!user;

  const login = async (email: string, password: string) => {
    const data = await loginRequest(email, password);
    console.log("LOGIN RESPONSE:", data);

    const nextUser: User = {
      id: data.userId,
      name: data.name,
      email: data.email,
      passwordHash: "",
    };

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));

    setUser(nextUser);
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    const data = await registerRequest(name, email, password);

    const nextUser: User = {
      id: data.userId,
      name: data.name,
      email: data.email,
      passwordHash: "",
    };

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));

    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
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