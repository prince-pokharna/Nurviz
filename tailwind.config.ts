import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Main Theme Colors
        theme: {
          light: "#B4AFA7", // Lightest of the three
          medium: "#9E8E80", // Medium tone
          dark: "#8A8786", // Darkest of the three
        },
        // Updated luxury palette based on theme colors
        luxury: {
          50: "#fefdfb",
          100: "#f8f6f4",
          200: "#f2f0ed",
          300: "#ebe8e4",
          400: "#e4e0db",
          500: "#B4AFA7", // Theme light
          600: "#9E8E80", // Theme medium
          700: "#8A8786", // Theme dark
          800: "#7a7370",
          900: "#6a635f",
          950: "#4a4440",
        },
        // Keep other colors for contrast and functionality
        gold: {
          50: "#fefdfb",
          100: "#f8f6f4",
          200: "#f2f0ed",
          300: "#ebe8e4",
          400: "#e4e0db",
          500: "#B4AFA7",
          600: "#9E8E80",
          700: "#8A8786",
          800: "#7a7370",
          900: "#6a635f",
          950: "#4a4440",
        },
        amber: {
          50: "#fefdfb",
          100: "#f8f6f4",
          200: "#f2f0ed",
          300: "#ebe8e4",
          400: "#e4e0db",
          500: "#B4AFA7",
          600: "#9E8E80",
          700: "#8A8786",
          800: "#7a7370",
          900: "#6a635f",
          950: "#4a4440",
        },
        // Keep standard colors for functionality
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          950: "#030712",
        },
        red: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
        },
        green: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        rose: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
          950: "#4c0519",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        serif: ["var(--font-playfair)", "Playfair Display", "serif"],
        display: ["var(--font-playfair)", "Playfair Display", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0", transform: "scale(0)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(158, 142, 128, 0.5)" },
          "50%": { boxShadow: "0 0 30px rgba(158, 142, 128, 0.8)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "luxury-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(158, 142, 128, 0.7)" },
          "70%": { boxShadow: "0 0 0 10px rgba(158, 142, 128, 0)" },
        },
        "theme-shine": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "theme-flow": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
        sparkle: "sparkle 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "gradient-shift": "gradient-shift 3s ease infinite",
        "luxury-pulse": "luxury-pulse 2s infinite",
        "theme-shine": "theme-shine 2s ease-in-out infinite",
        "theme-flow": "theme-flow 4s ease-in-out infinite",
      },
      backgroundImage: {
        // Main theme gradients
        "luxury-gradient": "linear-gradient(135deg, #B4AFA7 0%, #9E8E80 50%, #8A8786 100%)",
        "luxury-gradient-reverse": "linear-gradient(135deg, #8A8786 0%, #9E8E80 50%, #B4AFA7 100%)",
        "theme-gradient-1": "linear-gradient(45deg, #B4AFA7 0%, #9E8E80 100%)",
        "theme-gradient-2": "linear-gradient(90deg, #9E8E80 0%, #8A8786 100%)",
        "theme-gradient-3": "linear-gradient(135deg, #8A8786 0%, #B4AFA7 100%)",
        "theme-gradient-soft":
          "linear-gradient(135deg, rgba(180, 175, 167, 0.8) 0%, rgba(158, 142, 128, 0.8) 50%, rgba(138, 135, 134, 0.8) 100%)",

        // Alternative gradients
        "gold-gradient": "linear-gradient(135deg, #B4AFA7 0%, #9E8E80 50%, #8A8786 100%)",
        "rose-gold-gradient": "linear-gradient(90deg, #8A8786 0%, #9E8E80 50%, #B4AFA7 100%)",
        "cream-gradient": "linear-gradient(180deg, #B4AFA7 0%, #9E8E80 50%, #8A8786 100%)",
        "champagne-gradient": "linear-gradient(45deg, #B4AFA7 0%, #9E8E80 25%, #8A8786 50%, #9E8E80 75%, #B4AFA7 100%)",

        // Radial and special gradients
        "luxury-radial": "radial-gradient(circle at center, #B4AFA7 0%, #9E8E80 50%, #8A8786 100%)",
        "theme-conic": "conic-gradient(from 0deg, #B4AFA7, #9E8E80, #8A8786, #B4AFA7)",

        // Keep standard gradients for other uses
        "pearl-gradient": "linear-gradient(135deg, #fefefe 0%, #f5f5f5 25%, #eeeeee 50%, #e0e0e0 75%, #c2c2c2 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
