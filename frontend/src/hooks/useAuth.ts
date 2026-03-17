import { useEffect, useState } from "react";
import type { User } from "../types/models";
import { loginRequest, registerRequest } from "../api/authService";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {

      setUser({
        id: 1,
        name: "",
        email: "",
        passwordHash: "",
      });
    }
  }, []);

  const isLoggedIn = !!user;

  const login = async (email: string, password: string) => {
    const data = await loginRequest(email, password);
    console.log("LOGIN RESPONSE:", data);

    localStorage.setItem("token", data.token);

    const nextUser = {
      id: data.userId,
      name: data.name,
      email: data.email,
      passwordHash: "",
    };

    console.log("NEXT USER:", nextUser);

    setUser(nextUser);
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    const data = await registerRequest(name, email, password);

    localStorage.setItem("token", data.token);

    setUser({
      id: data.userId,
      name: data.name,
      email: data.email,
      passwordHash: "",
    });
  };
  const logout = () => {
    localStorage.removeItem("token");
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

