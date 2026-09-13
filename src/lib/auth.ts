export type User = {
  id: string;
  name: string;
  identifier: string; // Email address or phone number
  createdAt: string;
};

type StoredUser = User & {
  passwordHash: string;
};

const USERS_KEY = "revive_users_db";
const SESSION_KEY = "revive_active_user";

// Helper to hash password locally
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return "h_" + Math.abs(hash).toString(36) + "_" + btoa(str).substring(0, 8);
}

const defaultDummyUsers: StoredUser[] = [
  {
    id: "u_ankit_demo",
    name: "Ankit",
    identifier: "9876543210",
    createdAt: "2026-09-01T00:00:00.000Z",
    passwordHash: simpleHash("password123")
  },
  {
    id: "u_alex_demo",
    name: "Alex Chen",
    identifier: "9123456789",
    createdAt: "2026-09-01T00:00:00.000Z",
    passwordHash: simpleHash("password123")
  }
];

function getStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      saveUsers(defaultDummyUsers);
      return defaultDummyUsers;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveUsers(defaultDummyUsers);
      return defaultDummyUsers;
    }
    return parsed;
  } catch (e) {
    return defaultDummyUsers;
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const auth = {
  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  getActiveUserId(): string {
    const user = this.getCurrentUser();
    return user ? user.id : "guest_default";
  },

  signup(name: string, identifier: string, password: string): { success: boolean; user?: User; error?: string } {
    const trimmedId = identifier.trim().toLowerCase();
    const trimmedName = name.trim() || trimmedId.split("@")[0];

    if (!trimmedId) {
      return { success: false, error: "Please enter an email address or mobile number." };
    }
    if (!password || password.length < 4) {
      return { success: false, error: "Password must be at least 4 characters long." };
    }

    const users = getStoredUsers();
    const existing = users.find(u => u.identifier.toLowerCase() === trimmedId);
    if (existing) {
      return { success: false, error: "An account with this email or mobile number already exists." };
    }

    const newUser: StoredUser = {
      id: "u_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      name: trimmedName,
      identifier: trimmedId,
      createdAt: new Date().toISOString(),
      passwordHash: simpleHash(password)
    };

    users.push(newUser);
    saveUsers(users);

    const publicUser: User = {
      id: newUser.id,
      name: newUser.name,
      identifier: newUser.identifier,
      createdAt: newUser.createdAt
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));

    // Async sync to MongoDB serverless API if connected
    fetch("/api/auth?action=signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmedName, identifier: trimmedId, password })
    }).catch(() => {});

    return { success: true, user: publicUser };
  },

  login(identifier: string, password: string): { success: boolean; user?: User; error?: string } {
    const trimmedId = identifier.trim().toLowerCase();
    if (!trimmedId || !password) {
      return { success: false, error: "Please enter your email/phone and password." };
    }

    const users = getStoredUsers();
    const targetHash = simpleHash(password);
    const found = users.find(u => u.identifier.toLowerCase() === trimmedId);

    if (!found) {
      return { success: false, error: "No account found with this email or mobile number." };
    }

    if (found.passwordHash !== targetHash) {
      return { success: false, error: "Incorrect password. Please try again." };
    }

    const publicUser: User = {
      id: found.id,
      name: found.name,
      identifier: found.identifier,
      createdAt: found.createdAt
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));

    // Async sync to MongoDB serverless API if connected
    fetch("/api/auth?action=login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: trimmedId, password })
    }).catch(() => {});

    return { success: true, user: publicUser };
  },

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
  }
};
