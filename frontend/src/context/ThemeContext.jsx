import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("hk_theme");
    return saved || "dark";
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("hk_theme", theme);

    // Update meta theme-color for mobile browsers
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", theme === "dark" ? "#0B0B0B" : "#F8F6F1");
    }
  }, [theme]);

  const toggleTheme = () => {
    setIsTransitioning(true);
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    setTimeout(() => setIsTransitioning(false), 400);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isTransitioning, isDark: theme === "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
