import type { User } from "../types/models";
import { mockUsers } from "./mockDb";

const USERS_KEY = "mock_users";
const SESSION_KEY = "mock_session_user_id";

function readStoredUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeStoredUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const mockAuth = {
  getSessionUserId(): number | null {
    const v = localStorage.getItem(SESSION_KEY);
    return v ? Number(v) : null;
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  login(email: string, password: string): User {
    const stored = readStoredUsers();
    const allUsers = [...mockUsers, ...stored];

    const user = allUsers.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.passwordHash === password
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    localStorage.setItem(SESSION_KEY, String(user.id));
    return user;
  },

  register(name: string, email: string, password: string): User {
    const stored = readStoredUsers();
    const allUsers = [...mockUsers, ...stored];

    const exists = allUsers.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (exists) {
      throw new Error("Email already exists");
    }

    const newUser: User = {
      id: Date.now(),
      name,
      email,
      passwordHash: password,
    };

    writeStoredUsers([...stored, newUser]);
    localStorage.setItem(SESSION_KEY, String(newUser.id));

    return newUser;
  },
};
