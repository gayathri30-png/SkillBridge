/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
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
          DEFAULT: "#0057D9", // Primary Blue
          dark: "#0042A8",
          light: "#E8F0FE",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "#0F5C5C", // Teal
          green: "#10B981",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "#FFA800", // Amber
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "#EF4444", // Red
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#F3F4F6", // Gray 100
          foreground: "#6B7280", // Gray 600
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // AI Specific
        ai: {
            DEFAULT: "#0057D9", // Using primary blue for consistent AI branding
            sparkle: "#FFA800",
            bg: "linear-gradient(135deg, #E8F0FE 0%, #FFFFFF 100%)"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "16px",
        "2xl": "24px",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #E8F0FE 0%, #FFFFFF 100%)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        // Add more animations if needed for the landing page
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}
