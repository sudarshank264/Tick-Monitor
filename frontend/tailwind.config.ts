import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        neutral: "#ffffff",
        text: "#333333",
        bg: "#f0f0f0",
        highlight: "#01ff70",
        disabled: "#7fdbff",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      keyframes: {
        loginBgShrink: {
          "0%": {
            width: "100%",
            margin: "0",
            borderRadius: "0",
          },
          "100%": {
            width: "calc(50% - 2em)",
            margin: "1em",
            borderRadius: "0.5rem",
          },
        },
        loginLoaderGrow: {
          "0%": {
            width: "0%",
          },
          "100%": {
            width: "50%",
          },
        },
        loginLoaderAppear: {
          "0%": {
            opacity: "0",
            transform: "scale(0.3)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        loginFormSlide: {
          "0%": {
            opacity: "0.3",
            transform: "translateX(-10%)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        loginWidthGrow: {
          "0%": {
            opacity: "0",
            transform: "scale(0)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
      },
      animation: {
        "login-bg-shrink": "loginBgShrink 1s ease-in forwards",
        "login-loader-grow": "loginLoaderGrow 1s ease-in forwards",
        "login-loader-appear": "loginLoaderAppear 1s ease-in forwards",
        "login-form-slide": "loginFormSlide 0.4s ease-in forwards",
        "login-width-grow": "loginWidthGrow 0.4s ease-in forwards",
        "drawer-arrow-grow": "loginLoaderAppear 0.2s ease-in forwards",
        "dropdown-appear-grow": "loginWidthGrow 0.2s ease-in forwards",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
export default config;
