/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        "3xl": "1600px",
        "4xl": "2000px",
        "5xl": "2500px",
        "6xl": "3000px",
      },
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        danger: "rgb(var(--color-danger) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        background: "rgb(var(--color-background) / <alpha-value>)",
        textBase: "rgb(var(--color-text-base) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        neutral: "rgb( var(--color-neutral) / <alpha-value>)",
        "neutral-focus": "var(--neutral-focus)",
        "neutral-content": "var(--neutral-content)",
        "neutral-content-focus": "var(--neutral-content-focus)",
      },
      keyframes: {
        "scale-in" : {
          "0%": {
            transform: "scale(0)",
          },
          "100%": {
            transform: "scale(1)",
          },
        },
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "accordion-left": {
          from: { width: 0 },
          to: { width: "var(--radix-accordion-content-width)" },
        },
        "accordion-right": {
          from: { width: "var(--radix-accordion-content-width)" },
          to: { width: 0 },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        sparkle: {
          "0%": {
            opacity: "0",
            transform: "rotate(0) scale(0)",
          },
          "50%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0",
            transform: "rotate(360deg) scale(1.1)",
          },
        },
        reverseSparkle: {
          "0%": {
            opacity: "0",
            transform: "rotate(0) scale(0)",
          },
          "50%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0",
            transform: "rotate(-360deg) scale(1.1)",
          },
        },
      },
      animation: {
        fadeOut: "fadeOut 0.1s ease-out",
        fadeIn: "fadeIn 1s ease-in",
        "accordion-down": "accordion-down 0.3s ease-out",
        "accordion-up": "accordion-up 0.3s ease-out",
        sparkle: "sparkle 2.5s ease-out infinite",
        reverseSparkle: "reverseSparkle 2.5s ease-out infinite",
        "scale-in": "scale-in 1s ease-out",
      },
    },
  },
  plugins: [require("daisyui"), require("tailwindcss-animate")],
  daisyui: {
    styled: true,
    // themes: ["black"],
    base: false,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    // darkTheme: "black",
  },
};