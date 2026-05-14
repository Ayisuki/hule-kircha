/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["class", "[data-theme="dark"]"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          card: "var(--bg-card)",
          elevated: "var(--bg-elevated)"
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)"
        },
        gold: {
          DEFAULT: "var(--accent-gold)",
          light: "var(--accent-gold-light)",
          dark: "var(--accent-gold-dark)"
        },
        border: {
          DEFAULT: "var(--border-color)"
        }
      },
      fontFamily: {
        ethiopic: ["var(--font-ethiopic)"],
        sans: ["var(--font-sans)"]
      }
    }
  },
  plugins: []
};
