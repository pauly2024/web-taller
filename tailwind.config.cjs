/*
  tailwind.config.cjs
*/
export default {
  darkMode: ["class"],
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./components/**/*.{html,js,svelte,ts}",
  ],
  theme: {
    extend: {
      colors: {
        taller: {
          primary: "#1e40af",
          secondary: "#059669",
          accent: "#f59e0b",
          background: "#f8fafc",
          card: "#ffffff",
          border: "#e2e8f0",
        },
      },
    },
  },
  plugins: [],
}