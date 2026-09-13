import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { db } from "./lib/db";
import { auth, type User } from "./lib/auth";

type Theme = "light" | "dark";

type ContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  currentUser: User | null;
  login: (identifier: string, password: string) => { success: boolean; user?: User; error?: string };
  signup: (name: string, identifier: string, password: string) => { success: boolean; user?: User; error?: string };
  logout: () => void;
};

const AppContext = createContext<ContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [currentUser, setCurrentUser] = useState<User | null>(() => auth.getCurrentUser());

  useEffect(() => {
    db.getSettings().then(settings => {
      const found = settings.find(x => x.key === "theme")?.value;
      if (found === "dark" || found === "light") setTheme(found);
    });
  }, [currentUser]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () =>
        setTheme(t => {
          const next = t === "light" ? "dark" : "light";
          db.setSetting("theme", next);
          return next;
        }),
      currentUser,
      login: (identifier: string, password: string) => {
        const res = auth.login(identifier, password);
        if (res.success && res.user) {
          setCurrentUser(res.user);
        }
        return res;
      },
      signup: (name: string, identifier: string, password: string) => {
        const res = auth.signup(name, identifier, password);
        if (res.success && res.user) {
          setCurrentUser(res.user);
        }
        return res;
      },
      logout: () => {
        auth.logout();
        setCurrentUser(null);
      }
    }),
    [theme, currentUser]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useTheme() {
  const c = useContext(AppContext);
  if (!c) throw new Error("useTheme must be used inside AppProvider");
  return c;
}

export function useAuth() {
  const c = useContext(AppContext);
  if (!c) throw new Error("useAuth must be used inside AppProvider");
  return {
    currentUser: c.currentUser,
    login: c.login,
    signup: c.signup,
    logout: c.logout
  };
}
