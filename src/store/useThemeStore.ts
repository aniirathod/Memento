import { create } from "zustand";

export type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  toggleTheme: (theme: Theme) => void;
}

const getSystemTheme = (): "light" | "dark" => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem("theme") as Theme | null;
  if (!saved || saved === "system") return "system";
  return saved;
};

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  const appliedTheme = theme === "system" ? getSystemTheme() : theme;
  root.classList.remove("light", "dark");
  root.classList.add(appliedTheme);
};

const useThemeStore = create<ThemeState>((set) => {
  const initial = getInitialTheme();
  if (typeof window !== "undefined") applyTheme(initial);

  return {
    theme: initial,
    toggleTheme: (theme) => {
      localStorage.setItem("theme", theme);
      applyTheme(theme);
      set({ theme });
    },
  };
});

export default useThemeStore;
